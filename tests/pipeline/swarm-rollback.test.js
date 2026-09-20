/**
 * "A run either ships a night or fails and rolls the checkout back"
 * (CONTEXT.md), driven through the real swarm against a temp root.
 *
 * Each scenario ends the run with a throw from a different site after the
 * Art Director's preset and the orchestrator's chassis files are on disk, and
 * asserts that every file under the root is back to what it held before the
 * run. Until the outer catch owned the rollback, six of these sites left the
 * half-written site in the working tree, and a test pinned that as the
 * behaviour.
 *
 * `archive/` and `signals/` are left out of the comparison: the swarm writes
 * failure traces and gitignored scratch there on purpose.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { setRunDeadline } from '../../scripts/utils/run-budget.js'
import { fixtureFor, mockFactories as m, runSwarm } from './swarm-harness.js'

vi.mock('../../scripts/utils/claude-cli.js', (o) => m['scripts/utils/claude-cli.js'](o))
vi.mock('../../scripts/utils/vision-router.js', (o) => m['scripts/utils/vision-router.js'](o))
vi.mock('../../scripts/utils/build-validator.js', (o) => m['scripts/utils/build-validator.js'](o))
vi.mock('../../scripts/utils/snapshot.js', (o) => m['scripts/utils/snapshot.js'](o))
vi.mock('../../scripts/utils/surface-gate.js', (o) => m['scripts/utils/surface-gate.js'](o))
vi.mock('../../scripts/utils/copy-gate.js', (o) => m['scripts/utils/copy-gate.js'](o))
vi.mock('../../scripts/utils/archiver.js', (o) => m['scripts/utils/archiver.js'](o))
vi.mock('../../scripts/seal-archive.js', (o) => m['scripts/seal-archive.js'](o))
vi.mock('../../scripts/utils/file-manager.js', (o) => m['scripts/utils/file-manager.js'](o))
vi.mock('node:child_process', (o) => m['node:child_process'](o))

const SKIPPED_DIRS = new Set(['archive', 'signals'])

/** Every file under `root` as relative path -> content, minus the skipped directories. */
function snapshotTree(root, rel = '', out = new Map()) {
  for (const entry of readdirSync(path.join(root, rel), { withFileTypes: true })) {
    const next = rel ? `${rel}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      if (rel === '' && SKIPPED_DIRS.has(entry.name)) continue
      snapshotTree(root, next, out)
    } else {
      out.set(next, readFileSync(path.join(root, next), 'utf8'))
    }
  }
  return out
}

/** Paths whose presence or content differs between two snapshots, sorted. */
function differences(before, after) {
  const paths = new Set([...before.keys(), ...after.keys()])
  return [...paths].filter((p) => before.get(p) !== after.get(p)).sort()
}

/**
 * Run the swarm with `beforeRun` applied, take the tree as the run will find
 * it, and report what differs once the run has thrown.
 */
async function runAndDiff(opts) {
  let before = null
  const run = await runSwarm({
    ...opts,
    beforeRun: async (root) => {
      await opts.beforeRun?.(root)
      before = snapshotTree(root)
    },
  })
  return { run, changed: differences(before, snapshotTree(run.root)) }
}

/** A run that threw after the Art Director's writes, and rolled them back. */
function expectRolledBack(run, changed) {
  expect(run.result).toBeNull()
  expect(run.error).toBeTruthy()
  expect(run.fakes.restore).toHaveLength(1)
  expect(run.fakes.cleanupOrphans).toHaveLength(1)
  // The preset and the chassis files had been written when the throw came.
  expect(run.fakes.cleanupOrphans[0].written).toEqual(
    expect.arrayContaining(['elements/preset.ts', 'app/routes/__root.tsx'])
  )
  expect(changed).toEqual([])
  expect(run.fakes.archive.length).toBeLessThanOrEqual(1)
  expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
}

const pastDeadlineAfter = (fixture) => () => {
  setRunDeadline(Date.now())
  return fixture
}

describe('every throw between the first write and archive() rolls the checkout back', () => {
  it('run budget spent before the Mockup Designer', async () => {
    const { run, changed } = await runAndDiff({
      agents: { 'art-director': [pastDeadlineAfter(fixtureFor('art-director'))] },
    })

    expect(run.error.message).toMatch(/^run budget exhausted before the Mockup Designer/)
    expectRolledBack(run, changed)
  })

  it('run budget spent before the React Engineer', async () => {
    const { run, changed } = await runAndDiff({
      agents: { 'mockup-critic': [pastDeadlineAfter(fixtureFor('mockup-critic'))] },
    })

    expect(run.error.message).toMatch(/^run budget exhausted before the React Engineer/)
    expectRolledBack(run, changed)
  })

  it.each(['{{SEMANTIC_COLOR_CONTRACT}}', '{{GATES}}'])(
    'react-engineer.md without its %s placeholder',
    async (placeholder) => {
      const { run, changed } = await runAndDiff({
        beforeRun: (root) => {
          const file = path.join(root, 'scripts', 'prompts', 'react-engineer.md')
          writeFileSync(file, readFileSync(file, 'utf8').replaceAll(placeholder, ''))
        },
      })

      expect(run.error.message).toBe(`react-engineer.md is missing its ${placeholder} placeholder`)
      // Thrown after the mockup stage, so the mockup designer had already run.
      expect(run.calls.map((c) => c.agent)).toContain('mockup-designer')
      expectRolledBack(run, changed)
    }
  )

  it('a write to disk that throws part-way through the engineer batch', async () => {
    const ZED = 'app/components/generated/Zed.tsx'
    const engineer = fixtureFor('react-engineer')
    const withZed = engineer.replace(
      '===RATIONALE===',
      `===FILE:${ZED}===\nexport const Zed = 1\n\n===RATIONALE===`
    )
    expect(withZed).not.toBe(engineer)

    const { run, changed } = await runAndDiff({
      agents: { 'react-engineer': [withZed] },
      // A directory where the last file should go: writeFiles throws on it
      // after the earlier files of the batch are already on disk.
      beforeRun: (root) => mkdirSync(path.join(root, ZED), { recursive: true }),
    })

    expect(run.error.message).toMatch(/EISDIR/)
    expect(run.error.message).not.toMatch(/^React Engineer/)
    // writeFiles throws before it returns the paths it wrote, so the earlier
    // files of the batch are not on the orphan list. They are in the backup
    // as null, written there at write time, and restore deletes them.
    expect(run.fakes.restore[0].map.get('app/components/generated/Ledger.tsx')).toBeNull()
    expectRolledBack(run, changed)
    expect(existsSync(path.join(run.root, 'app/components/Layout.tsx'))).toBe(false)
  })

  it('archive() that throws after the build passed', async () => {
    const { run, changed } = await runAndDiff({ archive: [new Error('disk full')] })

    expect(run.error.message).toBe('disk full')
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.fakes.validateBuild).toHaveLength(1)
    // The engineer's files and the og card had all been written by then.
    expect(run.fakes.cleanupOrphans[0].written).toEqual(
      expect.arrayContaining(['app/routes/index.tsx', `public/og/${run.date}.png`])
    )
    expectRolledBack(run, changed)
  })

  it('a file read between the chassis write and the mockup stage', async () => {
    const { run, changed } = await runAndDiff({
      beforeRun: (root) => rmSync(path.join(root, 'app', 'assets', 'logo.svg')),
    })

    // Not the chassis writer's own catch: the run got past it.
    expect(run.error.message).toMatch(/ENOENT.*logo\.svg/)
    expect(run.error.message).not.toMatch(/^Chassis file generation failed/)
    expect(run.calls.map((c) => c.agent)).toEqual(['art-director'])
    expectRolledBack(run, changed)
  })
})

describe('a run that shipped', () => {
  it('is not rolled back', async () => {
    const { run, changed } = await runAndDiff({})

    expect(run.error).toBeNull()
    expect(run.fakes.restore).toEqual([])
    expect(run.fakes.cleanupOrphans).toEqual([])
    // Preset, chassis files and the engineer's output are the night.
    expect(changed).toEqual(
      expect.arrayContaining(['elements/preset.ts', 'app/components/Layout.tsx'])
    )
  })
})
