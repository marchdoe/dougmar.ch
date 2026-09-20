/**
 * The React Engineer's failure paths and the run deadline, driven through the
 * real swarm against a temp root (#221).
 *
 * Eight rows of the Task 3 table: the engineer omits a required file (once,
 * twice, and Layout.tsx itself), stalls (once, and past the deadline), and the
 * three deadline checkpoints between phases. Each asserts the calls made, the
 * prompt that carried the reminder, the ledger's retries, the thrown message,
 * and the state left under the root.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import { setRunDeadline } from '../../scripts/utils/run-budget.js'
import { ModelTransportError } from '../../scripts/utils/model-transport-error.js'
import { writeUnder } from '../helpers/tmp.js'
import {
  DEFAULT_BUILD_ERROR,
  REQUIRED_ENGINEER_FILES,
  fixtureFor,
  mockFactories as m,
  runSwarm,
} from './swarm-harness.js'

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

// site-context.js imports file-manager.js, so it loads after the mock block.
const { MUTABLE_FILES } = await import('../../scripts/utils/site-context.js')

// The harness keeps `restore` and `cleanupOrphans` real and records each call
// as `run.fakes.restore` / `run.fakes.cleanupOrphans`, with a `seq` that says
// which ran first; disk state is still what the real code left.

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const SEEDED_PRESET = readFileSync(path.join(REPO, 'elements', 'preset.ts'), 'utf8')

/** Everything the recorded engineer writes: the six required files plus its Ledger. */
const ENGINEER_OUTPUT = ['app/components/generated/Ledger.tsx', ...REQUIRED_ENGINEER_FILES]

const REQUIRED_FILES_REMINDER = '## REQUIRED FILES MISSING — RETRY'
const LAYOUT_GATE_MESSAGE =
  'React Engineer did not produce Layout.tsx — site cannot function without it'
const STALL_MESSAGE =
  '[react-engineer] stalled — no output for 15 minutes (generated 0KB before stall)'

/** The fixture with one `===FILE:<relPath>===` block removed. */
function withoutBlock(text, relPath) {
  const header = `===FILE:${relPath}===`
  const start = text.indexOf(header)
  if (start < 0) throw new Error(`fixture has no block for ${relPath}`)
  const next = text.indexOf('\n===', start + header.length)
  if (next < 0) throw new Error(`no block follows ${relPath}`)
  return text.slice(0, start) + text.slice(next + 1)
}

function under(root, rel) {
  return existsSync(path.join(root, rel))
}

function presetUnder(root) {
  return readFileSync(path.join(root, 'elements', 'preset.ts'), 'utf8')
}

function errorTxt(run) {
  return readFileSync(path.join(run.root, 'archive', run.date, run.trace.dir, 'error.txt'), 'utf8')
}

function failedSourceDirs(run) {
  return readdirSync(path.join(run.root, 'archive', run.date)).filter((d) =>
    d.startsWith('build-failed-sources-')
  )
}

/** The maps `restore` was called with, as sorted key lists. */
function restoredKeySets(run) {
  return run.fakes.restore.map((r) => [...r.paths].sort())
}

/** What the swarm has written before the Mockup Designer is called. */
const PRE_MOCKUP_WRITES = [
  'elements/preset.ts',
  'elements/chassis-preset.ts',
  'app/routes/__root.tsx',
  'app/components/BrandLockup.tsx',
  'app/components/Material.tsx',
  'app/components/SiteCallout.tsx',
  'app/components/WhitePaper.tsx',
]

// The engineer's invented Ledger.tsx joins the backup at write time (as null,
// it did not exist), so the final restore covers it and deletes it (#432).
const ORIGINAL_BACKUP_KEYS = [...MUTABLE_FILES, 'app/components/generated/Ledger.tsx'].sort()

describe('the React Engineer omits a required file', () => {
  it('omits Sidebar once: the retry carries the reminder and ships six files', async () => {
    const full = fixtureFor('react-engineer')
    const run = await runSwarm({
      agents: {
        'react-engineer': [withoutBlock(full, 'app/components/Sidebar.tsx'), full],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'react-engineer',
      'screenshot-critic',
    ])
    const [first, retry] = run.callsFor('react-engineer')
    expect(first.userPrompt).not.toContain(REQUIRED_FILES_REMINDER)
    expect(retry.userPrompt).toContain(REQUIRED_FILES_REMINDER)
    expect(retry.userPrompt).toContain(
      'Your previous response omitted these required files: app/components/Sidebar.tsx'
    )
    expect(retry.systemPrompt).toBe(first.systemPrompt)
    expect(run.retries).toBe(1)

    for (const rel of ENGINEER_OUTPUT) {
      expect(under(run.root, rel), `${rel} under the root`).toBe(true)
    }
    expect(run.result.files.map((f) => f.path)).toContain('app/components/Sidebar.tsx')
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.trace.dir).toMatch(/^build-\d+$/)
    expect(run.fakes.restore).toEqual([])
  })

  it('omits Sidebar three times: two retries, then the original ships without it', async () => {
    const fiveFiles = withoutBlock(fixtureFor('react-engineer'), 'app/components/Sidebar.tsx')
    const run = await runSwarm({ agents: { 'react-engineer': [fiveFiles] } })

    expect(run.error).toBeNull()
    const engineer = run.callsFor('react-engineer')
    expect(engineer).toHaveLength(3)
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'react-engineer',
      'react-engineer',
      'screenshot-critic',
    ])
    expect(engineer[0].userPrompt).not.toContain(REQUIRED_FILES_REMINDER)
    expect(engineer[1].userPrompt).toContain(REQUIRED_FILES_REMINDER)
    expect(engineer[2].userPrompt).toContain(REQUIRED_FILES_REMINDER)
    expect(engineer[2].userPrompt).toBe(engineer[1].userPrompt)
    expect(run.retries).toBe(2)

    // MAX_OUTPUT_RETRIES spent: the original result is written and the
    // build proceeds on five required files; Sidebar.tsx never reaches disk.
    const written = run.result.files.map((f) => f.path)
    expect(written).toEqual([
      'elements/preset.ts',
      'app/components/generated/Ledger.tsx',
      'app/components/Layout.tsx',
      'app/routes/index.tsx',
      'app/routes/about.tsx',
      'app/routes/work.$slug.tsx',
      'app/routes/og.tsx',
    ])
    expect(under(run.root, 'app/components/Sidebar.tsx')).toBe(false)
    for (const rel of ENGINEER_OUTPUT.filter((f) => f !== 'app/components/Sidebar.tsx')) {
      expect(under(run.root, rel), `${rel} under the root`).toBe(true)
    }
    expect(run.fakes.validateBuild).toHaveLength(1)
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.fakes.archive[0].changedFiles).toEqual(written)
    expect(run.trace.dir).toMatch(/^build-\d+$/)
    const step = run.trace.steps.find((s) => s.name === 'react-engineer')
    expect(step.output.files).not.toContain('app/components/Sidebar.tsx')
    expect(run.fakes.restore).toEqual([])
  })

  it('omits Layout every time: the disk gate rolls the run back', async () => {
    const noLayout = withoutBlock(fixtureFor('react-engineer'), 'app/components/Layout.tsx')
    const run = await runSwarm({ agents: { 'react-engineer': [noLayout] } })

    expect(run.result).toBeNull()
    expect(run.error?.message).toBe(LAYOUT_GATE_MESSAGE)
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'react-engineer',
      'react-engineer',
    ])
    const engineer = run.callsFor('react-engineer')
    expect(engineer[1].userPrompt).toContain(
      'Your previous response omitted these required files: app/components/Layout.tsx'
    )
    expect(run.retries).toBe(2)

    // cleanupOrphans(writtenPaths, originalBackup) then restore(originalBackup).
    expect(run.fakes.cleanupOrphans).toHaveLength(1)
    expect(run.fakes.restore).toHaveLength(1)
    expect(run.fakes.cleanupOrphans[0].seq).toBeLessThan(run.fakes.restore[0].seq)
    expect(restoredKeySets(run)).toEqual([ORIGINAL_BACKUP_KEYS])
    // writtenPaths: the Art Director's and orchestrator's writes plus
    // everything the engineer emitted, which never included Layout.tsx.
    expect([...run.fakes.cleanupOrphans[0].written].sort()).toEqual(
      [
        'elements/preset.ts',
        'elements/chassis-preset.ts',
        'app/routes/__root.tsx',
        'app/components/BrandLockup.tsx',
        'app/components/Material.tsx',
        'app/components/SiteCallout.tsx',
        'app/components/WhitePaper.tsx',
        ...ENGINEER_OUTPUT.filter((f) => f !== 'app/components/Layout.tsx'),
      ].sort()
    )

    for (const rel of ENGINEER_OUTPUT) {
      expect(under(run.root, rel), `${rel} gone from the root`).toBe(false)
    }
    expect(presetUnder(run.root)).toBe(SEEDED_PRESET)
    expect(run.fakes.validateBuild).toHaveLength(0)
    expect(run.fakes.archive).toHaveLength(0)
    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    expect(errorTxt(run)).toMatch(new RegExp(`^${LAYOUT_GATE_MESSAGE}`))
    expect(run.trace.steps.map((s) => s.name)).toContain('react-engineer')
  })
})

describe('the React Engineer stalls', () => {
  it('stalls once: one retry on the same prompt, and the run completes', async () => {
    const run = await runSwarm({
      agents: {
        'react-engineer': [new Error(STALL_MESSAGE), fixtureFor('react-engineer')],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'react-engineer',
      'screenshot-critic',
    ])
    const [first, retry] = run.callsFor('react-engineer')
    expect(retry.userPrompt).toBe(first.userPrompt)
    expect(retry.systemPrompt).toBe(first.systemPrompt)
    expect(retry.options).toEqual(first.options)
    expect(run.retries).toBe(1)

    for (const rel of ENGINEER_OUTPUT) {
      expect(under(run.root, rel), `${rel} under the root`).toBe(true)
    }
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.trace.dir).toMatch(/^build-\d+$/)
    expect(run.fakes.restore).toEqual([])
  })

  it('stalls past the deadline: no retry, restore, and "React Engineer failed:"', async () => {
    const run = await runSwarm({
      agents: {
        'react-engineer': [
          () => {
            setRunDeadline(Date.now())
            return new Error(STALL_MESSAGE)
          },
        ],
      },
    })

    expect(run.result).toBeNull()
    expect(run.error?.message).toMatch(/^React Engineer failed: /)
    expect(run.error?.message).toContain(STALL_MESSAGE)
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
    ])
    expect(run.retries).toBe(0)

    expect(run.fakes.restore).toHaveLength(1)
    // The engineer wrote nothing, so the backup is the pre-run list alone; the
    // preset and chassis files are on the orphan list and all in that backup.
    expect(restoredKeySets(run)).toEqual([[...MUTABLE_FILES].sort()])
    expect(run.fakes.cleanupOrphans.map((c) => c.written)).toEqual([PRE_MOCKUP_WRITES])
    for (const rel of ENGINEER_OUTPUT) {
      expect(under(run.root, rel), `${rel} absent from the root`).toBe(false)
    }
    expect(presetUnder(run.root)).toBe(SEEDED_PRESET)
    expect(run.fakes.validateBuild).toHaveLength(0)
    expect(run.fakes.archive).toHaveLength(0)
    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    expect(errorTxt(run)).toMatch(/^React Engineer failed: /)
  })
})

describe('the run deadline between phases', () => {
  it('before the mockup: throws and rolls the Art Director back', async () => {
    const run = await runSwarm({
      agents: {
        'art-director': [
          () => {
            setRunDeadline(Date.now())
            return fixtureFor('art-director')
          },
        ],
      },
    })

    expect(run.result).toBeNull()
    expect(run.error?.message).toBe(
      'run budget exhausted before the Mockup Designer could start — nothing to ship'
    )
    expect(run.calls.map((c) => c.agent)).toEqual(['art-director'])
    expect(run.retries).toBe(0)

    // The Art Director's preset and the chassis files were on disk when the
    // throw came; the outer catch puts the checkout back.
    expect(run.fakes.cleanupOrphans).toHaveLength(1)
    expect(run.fakes.restore).toHaveLength(1)
    expect(run.fakes.cleanupOrphans[0].seq).toBeLessThan(run.fakes.restore[0].seq)
    expect(restoredKeySets(run)).toEqual([[...MUTABLE_FILES].sort()])
    expect(run.fakes.cleanupOrphans[0].written).toEqual(PRE_MOCKUP_WRITES)
    expect(presetUnder(run.root)).toBe(SEEDED_PRESET)
    expect(under(run.root, 'app/routes/__root.tsx')).toBe(false)
    expect(under(run.root, 'app/components/BrandLockup.tsx')).toBe(false)
    expect(under(run.root, 'signals/today.mockup.html')).toBe(false)
    for (const rel of ENGINEER_OUTPUT) {
      expect(under(run.root, rel), `${rel} absent from the root`).toBe(false)
    }
    expect(run.fakes.archive).toHaveLength(0)
    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    expect(errorTxt(run)).toMatch(/^run budget exhausted before the Mockup Designer/)
    expect(run.trace.steps.map((s) => s.name)).toEqual(expect.arrayContaining(['art-director']))
    expect(run.trace.steps.map((s) => s.name)).not.toContain('mockup-critic')
  })

  it('before the engineer: throws after mockup approval and rolls back', async () => {
    const run = await runSwarm({
      agents: {
        'mockup-critic': [
          () => {
            setRunDeadline(Date.now())
            return fixtureFor('mockup-critic')
          },
        ],
      },
    })

    expect(run.result).toBeNull()
    expect(run.error?.message).toBe(
      'run budget exhausted before the React Engineer could start — nothing to ship'
    )
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
    ])
    expect(run.retries).toBe(0)

    expect(run.fakes.cleanupOrphans).toHaveLength(1)
    expect(run.fakes.restore).toHaveLength(1)
    expect(run.fakes.cleanupOrphans[0].seq).toBeLessThan(run.fakes.restore[0].seq)
    expect(restoredKeySets(run)).toEqual([[...MUTABLE_FILES].sort()])
    expect(run.fakes.cleanupOrphans[0].written).toEqual(PRE_MOCKUP_WRITES)
    expect(presetUnder(run.root)).toBe(SEEDED_PRESET)
    expect(under(run.root, 'app/routes/__root.tsx')).toBe(false)
    // signals/today.mockup.html is gitignored scratch, not a checkout file.
    expect(under(run.root, 'signals/today.mockup.html')).toBe(true)
    for (const rel of ENGINEER_OUTPUT) {
      expect(under(run.root, rel), `${rel} absent from the root`).toBe(false)
    }
    expect(run.fakes.validateBuild).toHaveLength(0)
    expect(run.fakes.archive).toHaveLength(0)
    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    expect(errorTxt(run)).toMatch(/^run budget exhausted before the React Engineer/)
    const names = run.trace.steps.map((s) => s.name)
    expect(names).toContain('mockup-critic')
    expect(names).not.toContain('react-engineer')
  })

  it('during repairs: the loop breaks at 0 attempts and the run rolls back', async () => {
    const run = await runSwarm({
      build: [
        () => {
          setRunDeadline(Date.now())
          return false
        },
      ],
    })

    expect(run.result).toBeNull()
    expect(run.error?.message).toBe(
      `Build failed after 0 repair attempt(s). Error:\n${DEFAULT_BUILD_ERROR}`
    )
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
    ])
    expect(run.fakes.validateBuild).toHaveLength(1)
    expect(run.retries).toBe(0)

    // The deadline breaks the loop before attempt 1. Nothing is restored or
    // reset ahead of a repair any more (a repair patches Phase 3's files,
    // #432), so the exhausted loop's rollback is the only one: orphans
    // cleaned, then the original backup restored.
    expect(run.fakes.restore).toHaveLength(1)
    expect(restoredKeySets(run)).toEqual([ORIGINAL_BACKUP_KEYS])
    expect(run.fakes.cleanupOrphans).toHaveLength(1)
    expect(run.fakes.cleanupOrphans[0].seq).toBeLessThan(run.fakes.restore[0].seq)

    for (const rel of ENGINEER_OUTPUT) {
      expect(under(run.root, rel), `${rel} gone from the root`).toBe(false)
    }
    expect(presetUnder(run.root)).toBe(SEEDED_PRESET)
    expect(run.fakes.archive).toHaveLength(0)
    // Phase 3's files were still on disk when the failing sources were
    // snapshotted, so every one of them is in the archive, not only the
    // orphan Ledger.tsx.
    const sources = failedSourceDirs(run)
    expect(sources).toHaveLength(1)
    for (const rel of ENGINEER_OUTPUT) {
      expect(under(run.root, `archive/${run.date}/${sources[0]}/${rel}`), rel).toBe(true)
    }
    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    expect(errorTxt(run)).toMatch(/^Build failed after 0 repair attempt\(s\)/)
    const build = run.trace.steps.find((s) => s.name === 'build-validation')
    expect(build.output.success).toBe(false)
  })
})

describe('a dead model during the engineer phase (#432)', () => {
  it('is not retried: one call, the original restored, and the transport named', async () => {
    const dead = new ModelTransportError({
      agent: 'react-engineer',
      channel: 'cli',
      exitCode: 1,
      stderrTail: 'credit balance too low',
    })
    const run = await runSwarm({
      agents: { 'react-engineer': [dead, fixtureFor('react-engineer')] },
    })

    expect(run.result).toBeNull()
    expect(run.error.message).toMatch(
      /^React Engineer failed: no response from the model for react-engineer \(cli, exit 1\): credit balance too low/
    )
    expect(run.callsFor('react-engineer')).toHaveLength(1)
    expect(run.retries).toBe(0)
    expect(run.fakes.restore.map((r) => r.paths)).toContainEqual(MUTABLE_FILES)
    expect(run.fakes.archive).toHaveLength(0)
  })
})

describe('an existing file the engineer overwrites (#432)', () => {
  const ORIGINAL = 'export const Hand = "written by a person, not on the mutable list"\n'
  const REWRITE =
    '===FILE:app/components/generated/Hand.tsx===\nexport const Hand = "rewritten by the engineer"\n'

  it('comes back on rollback instead of being deleted', async () => {
    const run = await runSwarm({
      build: [false, false, false, false],
      agents: { 'react-engineer': [REWRITE + fixtureFor('react-engineer')] },
      beforeRun: (root) => {
        writeUnder(root, 'app/components/generated/Hand.tsx', ORIGINAL)
      },
    })

    expect(run.error.message).toMatch(/^Build failed after 3 repair attempt\(s\)/)
    const hand = path.join(run.root, 'app', 'components', 'generated', 'Hand.tsx')
    expect(existsSync(hand)).toBe(true)
    expect(readFileSync(hand, 'utf8')).toBe(ORIGINAL)
    // The invented Ledger.tsx, which did not exist before the run, is gone.
    expect(existsSync(path.join(run.root, 'app', 'components', 'generated', 'Ledger.tsx'))).toBe(
      false
    )
  })
})
