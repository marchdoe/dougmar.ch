/**
 * The React Engineer's failure paths and the run deadline, driven through the
 * real swarm against a temp root (#221).
 *
 * Eight rows of the Task 3 table: the engineer omits a required file (once,
 * twice, and Layout.tsx itself), stalls (once, and past the deadline), and the
 * three deadline checkpoints between phases. Each asserts the calls made, the
 * brief that carried the report, the ledger's retries, the thrown message,
 * and the state left under the root. A reply that is incomplete or breaks the
 * shell posture is answered with a patch request (#577); the rows after the
 * table cover those.
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
const { parseDelimiterResponse } = await import('../../scripts/utils/delimiter-parser.js')

/** What the recorded engineer reply holds for one file, as it is written to disk. */
function fixtureContent(relPath) {
  const file = parseDelimiterResponse(fixtureFor('react-engineer')).files.find(
    (f) => f.path === relPath
  )
  if (!file) throw new Error(`fixture has no block for ${relPath}`)
  return file.content
}

// The harness keeps `restore` and `cleanupOrphans` real and records each call
// as `run.fakes.restore` / `run.fakes.cleanupOrphans`, with a `seq` that says
// which ran first; disk state is still what the real code left.

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const SEEDED_PRESET = readFileSync(path.join(REPO, 'elements', 'preset.ts'), 'utf8')

/** Everything the recorded engineer writes: the six required files plus its Ledger. */
const ENGINEER_OUTPUT = ['app/components/generated/Ledger.tsx', ...REQUIRED_ENGINEER_FILES]

const REQUIRED_FILES_REPORT = '## REQUIRED FILES MISSING'
const POSTURE_REPORT = '## SHELL POSTURE VIOLATION'
const LAYOUT_GATE_MESSAGE =
  'React Engineer did not produce Layout.tsx — site cannot function without it'
const STALL_MESSAGE =
  '[react-engineer] stalled — no output for 15 minutes (generated 0KB before stall)'

/** One `===FILE:<relPath>===` block of the fixture, delimiter to the next delimiter. */
function blockOf(text, relPath) {
  const header = `===FILE:${relPath}===`
  const start = text.indexOf(header)
  if (start < 0) throw new Error(`fixture has no block for ${relPath}`)
  const next = text.indexOf('\n===', start + header.length)
  if (next < 0) throw new Error(`no block follows ${relPath}`)
  return text.slice(start, next + 1)
}

/** The fixture with one `===FILE:<relPath>===` block removed. */
function withoutBlock(text, relPath) {
  return text.replace(blockOf(text, relPath), '')
}

/** A patch reply carrying only the fixture's blocks for `relPaths`. */
function patchOf(text, relPaths, rationale = 'patched') {
  return `${relPaths.map((p) => blockOf(text, p)).join('\n')}\n===RATIONALE===\n${rationale}\n`
}

/** A patch reply that rewrites one fixture file with a comment line on top. */
function markedPatch(text, relPath, marker) {
  const header = `===FILE:${relPath}===\n`
  return `${header}// ${marker}\n${blockOf(text, relPath).slice(header.length)}\n===RATIONALE===\nmarked\n`
}

/** The fixture with every `<nav>` element turned into a `<div>`. */
const withoutNav = (text) => text.replaceAll('<nav', '<div').replaceAll('</nav>', '</div>')

/**
 * The Art Director's reply with the composition and the header agreeing on
 * `shell_posture: none`, so the swarm's own check has a rule to enforce. The
 * recorded engineer reply carries a `<nav>` in Layout.tsx.
 */
function noNavArtDirector() {
  return fixtureFor('art-director')
    .replace('shell_posture: marginal', 'shell_posture: none')
    .replace('placement: right-margin', 'placement: none')
    .replace('height_px: 72', 'height_px: 0')
}

const isBrief = (call) => call.userPrompt.startsWith('# Repair brief')

/** The block the brief prints a file on disk as. */
function briefBlock(relPath, content) {
  return `--- ${relPath} ---\n${content.replace(/\n$/, '')}\n--- end ${relPath} ---`
}

function under(root, rel) {
  return existsSync(path.join(root, rel))
}

function onDisk(root, rel) {
  return readFileSync(path.join(root, rel), 'utf8')
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
  it('omits Sidebar once: the retry is a patch request and the reply adds only Sidebar', async () => {
    const full = fixtureFor('react-engineer')
    const patch = patchOf(full, ['app/components/Sidebar.tsx'], 'added Sidebar')
    const run = await runSwarm({
      agents: {
        'react-engineer': [withoutBlock(full, 'app/components/Sidebar.tsx'), patch],
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
    expect(isBrief(first)).toBe(false)
    expect(first.userPrompt).toContain('## Approved Mockup')

    // The retry is the repair brief, not the task again: no mockup, no
    // declarations, the files on disk, and the problem named in the report.
    expect(isBrief(retry)).toBe(true)
    expect(retry.userPrompt).not.toContain('## Approved Mockup')
    expect(retry.userPrompt).toContain(REQUIRED_FILES_REPORT)
    expect(retry.userPrompt).not.toContain('Re-emit')
    expect(retry.systemPrompt).toBe(first.systemPrompt)
    expect(run.retries).toBe(1)

    // What Sidebar must hold, named in the brief; the files that did arrive
    // are printed as they are on disk, and the one that did not is absent.
    expect(retry.userPrompt).toContain(
      '- app/components/Sidebar.tsx: the navigation: `export function Sidebar`, taking the props Layout.tsx passes it'
    )
    for (const rel of ENGINEER_OUTPUT.filter((f) => f !== 'app/components/Sidebar.tsx')) {
      expect(retry.userPrompt, rel).toContain(briefBlock(rel, onDisk(run.root, rel)))
    }
    expect(retry.userPrompt).not.toContain('--- app/components/Sidebar.tsx ---')

    for (const rel of ENGINEER_OUTPUT) {
      expect(under(run.root, rel), `${rel} under the root`).toBe(true)
    }
    // The merged set is what the archive records, and it passes the same check.
    const shipped = run.result.files.map((f) => f.path)
    expect(shipped).toEqual(expect.arrayContaining(ENGINEER_OUTPUT))
    expect(new Set(shipped).size).toBe(shipped.length)
    expect(run.fakes.archive[0].changedFiles).toEqual(shipped)
    expect(run.fakes.validateBuild).toHaveLength(1)
    const step = run.trace.steps.find((s) => s.name === 'react-engineer')
    expect(step.output.files).toContain('app/components/Sidebar.tsx')
    // The sweep after the patch is a Phase 3 step, not a repair's.
    expect(run.trace.steps.filter((s) => s.name === 'generated-sweep').map((s) => s.phase)).toEqual(
      [3, 3]
    )
    expect(run.trace.dir).toMatch(/^build-\d+$/)
    expect(run.fakes.restore).toEqual([])
  })

  it('omits Sidebar three times: two patch rounds, then the original ships without it', async () => {
    const full = fixtureFor('react-engineer')
    const fiveFiles = withoutBlock(full, 'app/components/Sidebar.tsx')
    // Each reply is a patch that still leaves Sidebar out, so the merged set
    // fails the check and nothing from it is written.
    const run = await runSwarm({
      agents: {
        'react-engineer': [
          fiveFiles,
          markedPatch(full, 'app/routes/about.tsx', 'patch 1'),
          markedPatch(full, 'app/routes/about.tsx', 'patch 2'),
        ],
      },
    })

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
    expect(isBrief(engineer[0])).toBe(false)
    expect(isBrief(engineer[1])).toBe(true)
    expect(isBrief(engineer[2])).toBe(true)
    expect(engineer[1].userPrompt).toContain(REQUIRED_FILES_REPORT)
    // The second round says the first reply was not applied and why.
    expect(engineer[1].userPrompt).not.toContain('was not applied')
    expect(engineer[2].userPrompt).toContain(REQUIRED_FILES_REPORT)
    expect(engineer[2].userPrompt).toContain('Your last reply to this was not applied')
    expect(engineer[2].userPrompt).toContain(
      'React Engineer omitted required files: app/components/Sidebar.tsx'
    )
    expect(run.retries).toBe(2)
    // Neither patch touched disk: the file it rewrote is as it first arrived.
    expect(onDisk(run.root, 'app/routes/about.tsx')).not.toContain('// patch')

    // The rounds are spent: the original result is written and the
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
    expect(engineer.slice(1).every(isBrief)).toBe(true)
    expect(engineer[1].userPrompt).toContain(
      '- app/components/Layout.tsx: the site shell: `export function Layout`'
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

describe('a reply that is incomplete in other ways', () => {
  it('omits two routes: one brief names both, one patch adds both', async () => {
    const full = fixtureFor('react-engineer')
    const two = ['app/routes/about.tsx', 'app/routes/work.$slug.tsx']
    const run = await runSwarm({
      agents: {
        'react-engineer': [two.reduce(withoutBlock, full), patchOf(full, two)],
      },
    })

    expect(run.error).toBeNull()
    const [, retry] = run.callsFor('react-engineer')
    expect(isBrief(retry)).toBe(true)
    expect(retry.userPrompt).toContain(
      "- app/routes/about.tsx: the about page: `export const Route = createFileRoute('/about')"
    )
    expect(retry.userPrompt).toContain(
      "- app/routes/work.$slug.tsx: the case study page: `export const Route = createFileRoute('/work/$slug')"
    )
    expect(run.retries).toBe(1)
    for (const rel of two) expect(under(run.root, rel), rel).toBe(true)
    expect(run.fakes.archive).toHaveLength(1)
  })

  it('has no engineer file on disk: the whole task is asked again, and that reply ships', async () => {
    const full = fixtureFor('react-engineer')
    // A block with nothing after its delimiter parses to no file at all.
    const nothing = '===FILE:app/routes/index.tsx===\n\n===RATIONALE===\nempty\n'
    const run = await runSwarm({ agents: { 'react-engineer': [nothing, full] } })

    expect(run.error).toBeNull()
    const [first, retry] = run.callsFor('react-engineer')
    // There is nothing to patch, and the brief has no mockup, so the retry is
    // the original task and a note.
    expect(isBrief(retry)).toBe(false)
    const task = first.userPrompt.split('\n\n---\n\nIMPORTANT:')[0]
    expect(retry.userPrompt.startsWith(task)).toBe(true)
    expect(retry.userPrompt).toContain('## NOTHING USABLE ARRIVED')
    expect(retry.userPrompt).toContain('React Engineer omitted required files:')
    expect(run.retries).toBe(1)
    for (const rel of ENGINEER_OUTPUT) {
      expect(under(run.root, rel), `${rel} under the root`).toBe(true)
    }
    expect(run.fakes.validateBuild).toHaveLength(1)
    expect(run.fakes.restore).toEqual([])
  })

  it('has a patch request that fails: the round is spent and the next one is a patch', async () => {
    const full = fixtureFor('react-engineer')
    const run = await runSwarm({
      agents: {
        'react-engineer': [
          withoutBlock(full, 'app/components/Sidebar.tsx'),
          new Error(STALL_MESSAGE),
          patchOf(full, ['app/components/Sidebar.tsx']),
        ],
      },
    })

    expect(run.error).toBeNull()
    const engineer = run.callsFor('react-engineer')
    expect(engineer).toHaveLength(3)
    expect(engineer.slice(1).every(isBrief)).toBe(true)
    expect(run.retries).toBe(2)
    expect(under(run.root, 'app/components/Sidebar.tsx')).toBe(true)
  })

  it('is past the run deadline: no patch is asked for and the original ships', async () => {
    const full = fixtureFor('react-engineer')
    const run = await runSwarm({
      agents: {
        'react-engineer': [
          () => {
            setRunDeadline(Date.now())
            return withoutBlock(full, 'app/components/Sidebar.tsx')
          },
        ],
      },
    })

    expect(run.callsFor('react-engineer')).toHaveLength(1)
    expect(run.retries).toBe(0)
    expect(under(run.root, 'app/components/Sidebar.tsx')).toBe(false)
    expect(under(run.root, 'app/components/Layout.tsx')).toBe(true)
  })
})

describe('the React Engineer breaks the shell posture', () => {
  const full = fixtureFor('react-engineer')
  const NAV_FILE = 'app/components/Layout.tsx'

  it('leaves a <nav> under shell_posture none: the brief names the file and the patch removes it', async () => {
    expect(full).toContain('<nav')
    const run = await runSwarm({
      agents: {
        'art-director': [noNavArtDirector()],
        'react-engineer': [full, patchOf(withoutNav(full), [NAV_FILE], 'nav removed')],
      },
    })

    expect(run.error).toBeNull()
    const [, retry] = run.callsFor('react-engineer')
    expect(isBrief(retry)).toBe(true)
    expect(retry.userPrompt).toContain(POSTURE_REPORT)
    expect(retry.userPrompt).toContain(`<nav> appears in: ${NAV_FILE}`)
    expect(retry.userPrompt).toContain(`\n- ${NAV_FILE}`)
    expect(retry.userPrompt).not.toContain('Re-emit')
    // The offending file is printed as it stands, nav and all.
    expect(retry.userPrompt).toContain('<nav')
    expect(retry.userPrompt).toContain('--- app/components/Layout.tsx ---')
    expect(run.retries).toBe(1)

    // Only the one file was rewritten; the merged set has no nav anywhere.
    expect(onDisk(run.root, NAV_FILE)).not.toContain('<nav')
    for (const rel of ENGINEER_OUTPUT) {
      expect(onDisk(run.root, rel), rel).not.toMatch(/<nav[\s>]/)
    }
    expect(onDisk(run.root, 'app/routes/index.tsx')).toBe(fixtureContent('app/routes/index.tsx'))
    expect(run.fakes.validateBuild).toHaveLength(1)
    expect(run.fakes.restore).toEqual([])
  })

  it('answers twice with the nav still there: the original ships, as the regeneration did', async () => {
    const run = await runSwarm({
      agents: {
        'art-director': [noNavArtDirector()],
        'react-engineer': [full],
      },
    })

    expect(run.error).toBeNull()
    const engineer = run.callsFor('react-engineer')
    expect(engineer).toHaveLength(3)
    expect(engineer.slice(1).every(isBrief)).toBe(true)
    expect(engineer[2].userPrompt).toContain('Your last reply to this was not applied')
    expect(run.retries).toBe(2)
    expect(onDisk(run.root, NAV_FILE)).toContain('<nav')
    expect(run.fakes.archive).toHaveLength(1)
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
    // The same model and budget; only the ledger's reason for the call differs.
    expect(first.options.purpose).toBe('first')
    expect(retry.options).toEqual({ ...first.options, purpose: 'retry' })
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
