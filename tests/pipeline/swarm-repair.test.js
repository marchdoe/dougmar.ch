/**
 * The swarm's repair and revision paths, run for real against a temp root
 * (#221): a build that fails and is repaired, repairs that run out, a repair
 * reply that empties a required file, and the post-critic revision in all
 * three of its outcomes plus the surface gate forcing one on a SHIP.
 *
 * A repair is a patch (#432, docs/adr/0001-repair-as-a-patch.md): the
 * engineer gets a brief listing the files it owns on disk and the error
 * verbatim, returns only the files that must change, and the swarm merges the
 * reply over what is on disk. An empty `===FILE:path===` block deletes that
 * file. The same contract runs the post-critic revision.
 *
 * `restore` from file-manager.js stays real; the harness records each call
 * as `run.fakes.restore` so a scenario can say which backup map was put
 * back, not only what the disk looks like afterwards.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import {
  CLEAN_GATE,
  DEFAULT_BUILD_ERROR,
  REQUIRED_ENGINEER_FILES,
  fixtureFor,
  mockFactories as m,
  runSwarm,
  withChannel,
} from './swarm-harness.js'

vi.mock('../../scripts/utils/claude-cli.js', (o) => m['scripts/utils/claude-cli.js'](o))
vi.mock('../../scripts/utils/vision-router.js', (o) => m['scripts/utils/vision-router.js'](o))
vi.mock('../../scripts/utils/build-validator.js', (o) => m['scripts/utils/build-validator.js'](o))
vi.mock('../../scripts/utils/snapshot.js', (o) => m['scripts/utils/snapshot.js'](o))
vi.mock('../../scripts/utils/surface-gate.js', (o) => m['scripts/utils/surface-gate.js'](o))
vi.mock('../../scripts/utils/archiver.js', (o) => m['scripts/utils/archiver.js'](o))
vi.mock('../../scripts/seal-archive.js', (o) => m['scripts/seal-archive.js'](o))
vi.mock('../../scripts/utils/file-manager.js', (o) => m['scripts/utils/file-manager.js'](o))
vi.mock('node:child_process', (o) => m['node:child_process'](o))

// site-context.js imports file-manager.js, so it loads after the mock block.
const { MUTABLE_FILES } = await import('../../scripts/utils/site-context.js')
const { parseDelimiterResponse } = await import('../../scripts/utils/delimiter-parser.js')
const { formatFindingsForCritic } = await import('../../scripts/utils/surface-gate.js')

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const ENGINEER_FIXTURE = fixtureFor('react-engineer')
/** The files the recorded engineer reply carries, in reply order. */
const FIXTURE_FILES = parseDelimiterResponse(ENGINEER_FIXTURE).files
const FIXTURE_PATHS = FIXTURE_FILES.map((f) => f.path)

function fixtureContent(relPath) {
  const file = FIXTURE_FILES.find((f) => f.path === relPath)
  if (!file) throw new Error(`fixture has no block for ${relPath}`)
  return file.content
}

/**
 * A patch reply: only the named files, each complete. `content: ''` is the
 * empty block that deletes a file.
 */
function patchReply(files, rationale = 'patched') {
  return `${files
    .map(({ path: relPath, content }) => `===FILE:${relPath}===\n${content}\n`)
    .join('\n')}\n===RATIONALE===\n${rationale}\n`
}

/** A patch that rewrites one fixture file with a comment line at the top. */
function markedFile(relPath, marker) {
  return { path: relPath, content: `// ${marker}\n${fixtureContent(relPath)}` }
}

/** The recorded engineer reply with extra `===FILE:===` blocks inserted before the rationale. */
function withAddedFiles(text, files) {
  const marker = '===RATIONALE==='
  const idx = text.indexOf(marker)
  if (idx === -1) throw new Error('fixture has no ===RATIONALE=== marker')
  const blocks = files.map(({ path: relPath, content }) => `===FILE:${relPath}===\n${content}\n\n`)
  return text.slice(0, idx) + blocks.join('') + text.slice(idx)
}

/** The block the brief prints a file on disk as: its full content between markers. */
function briefBlock(relPath, content) {
  return `--- ${relPath} ---\n${content.replace(/\n$/, '')}\n--- end ${relPath} ---`
}
function briefLine(root, relPath) {
  return briefBlock(relPath, readFileSync(path.join(root, relPath), 'utf8'))
}

const onDisk = (root, relPath) => readFileSync(path.join(root, relPath), 'utf8')

const REVISE_FEEDBACK =
  'The wordmark and the nav share a baseline at 1440px and read as one word; give the header its own row.'

const REVISE_REPLY = [
  '===VERDICT===',
  'REVISE',
  '===END===',
  '',
  '**Responsible agent:** react-engineer',
  '',
  '===FEEDBACK===',
  REVISE_FEEDBACK,
  '===END===',
  '',
].join('\n')

const OVERFLOW_AT_390 = {
  surface: '/',
  viewport: 'phone',
  width: 390,
  scheme: 'light',
  kind: 'overflow',
  severity: 'error',
  detail: 'document is 640px wide in a 390px viewport',
}

/**
 * A clipped element on an engineer-owned route. Distinct from OVERFLOW_AT_390:
 * on 2026-09-04 the document did not scroll horizontally at all — a parent
 * carried `overflow: hidden` — and the hero's type was severed mid-word
 * anyway. The measurement was taken every night into responsive-metrics.json
 * and no reader existed, so it could neither fail a build nor earn a revision.
 */
const CLIPPED_AT_360 = {
  surface: '/',
  viewport: 'mobile',
  width: 360,
  scheme: 'light',
  kind: 'clipped',
  severity: 'error',
  detail: '<H1> is cut off: its right edge lands at 392px, 32px past the 360px viewport',
}

/**
 * A tap target under 44x44 on an engineer-owned route (#488). Warning, not
 * error: it never forces a revision on its own — see the tests below.
 */
const TAP_TARGET_AT_360 = {
  surface: '/',
  viewport: 'mobile',
  width: 360,
  scheme: 'light',
  kind: 'tap-target',
  severity: 'warning',
  detail: "'work' is a 34x22px target; a thumb needs 44x44. Give it padding or a taller line box.",
}

const OLD_FRAMING = 'The previous attempt failed with this build error'

function dirsUnder(root, date, prefix) {
  const dateDir = path.join(root, 'archive', date)
  if (!existsSync(dateDir)) return []
  return readdirSync(dateDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith(prefix))
    .map((d) => d.name)
}

describe('Phase 5: the build fails', () => {
  it('repairs a failed build with a one-file patch merged over the rest', async () => {
    const marker = 'repair attempt 1'
    const run = await runSwarm({
      build: [false, true],
      agents: {
        'react-engineer': [
          ENGINEER_FIXTURE,
          patchReply([markedFile('app/components/Layout.tsx', marker)]),
        ],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'react-engineer',
      'screenshot-critic',
    ])
    expect(run.retries).toBe(1)
    expect(run.fakes.validateBuild).toHaveLength(2)

    // The repair call: the engineer's own system prompt, model and budget,
    // and a brief as the user prompt in place of the original task plus the
    // error. The brief prints every file on disk in full and carries the
    // build error verbatim.
    const [first, repair] = run.callsFor('react-engineer')
    expect(repair.systemPrompt).toBe(first.systemPrompt)
    expect(repair.model).toBe(first.model)
    expect(repair.options).toEqual(first.options)
    expect(repair.userPrompt.startsWith('# Repair brief')).toBe(true)
    expect(repair.userPrompt).toContain(DEFAULT_BUILD_ERROR)
    expect(repair.userPrompt).not.toContain(OLD_FRAMING)
    for (const rel of FIXTURE_PATHS) {
      expect(repair.userPrompt, rel).toContain(briefBlock(rel, fixtureContent(rel)))
    }
    expect(repair.userPrompt).not.toContain('--- elements/preset.ts ---')
    expect(repair.userPrompt).not.toContain('--- app/routes/__root.tsx ---')
    expect(first.userPrompt).not.toContain('# Repair brief')

    // Nothing was restored or reset ahead of the repair: Phase 3's files are
    // the base the patch lands on.
    expect(run.fakes.restore).toHaveLength(0)
    expect(run.fakes.cleanupOrphans).toHaveLength(0)

    // One file changed on disk; the other six are as Phase 3 wrote them.
    expect(onDisk(run.root, 'app/components/Layout.tsx')).toBe(
      `// ${marker}\n${fixtureContent('app/components/Layout.tsx')}`
    )
    for (const rel of FIXTURE_PATHS.filter((p) => p !== 'app/components/Layout.tsx')) {
      expect(onDisk(run.root, rel), rel).toBe(fixtureContent(rel))
    }

    // The archive records the merged set, not the one file the reply carried.
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.fakes.archive[0]).toMatchObject({
      rationale: 'Agent swarm redesign (repair 1)',
      designBrief: 'Multi-agent redesign (repair 1)',
      changedFiles: ['elements/preset.ts', ...FIXTURE_PATHS],
      options: { root: run.root },
    })
    expect(run.result.files.map((f) => f.path)).toEqual(['elements/preset.ts', ...FIXTURE_PATHS])
    expect(run.result.files.find((f) => f.path === 'app/components/Layout.tsx').content).toContain(
      marker
    )
    expect(run.result.files.find((f) => f.path === 'app/components/Sidebar.tsx').content).toBe(
      fixtureContent('app/components/Sidebar.tsx')
    )
    expect(run.trace.dir).toMatch(/^build-\d+$/)
    expect(dirsUnder(run.root, run.date, 'build-failed')).toEqual([])

    const repairSteps = run.trace.steps.filter((s) => s.name === 'repair')
    expect(repairSteps).toHaveLength(1)
    expect(repairSteps[0]).toMatchObject({
      phase: 5,
      input: { attempt: 1 },
      output: { files: 1, written: 1, deleted: 0, merged: FIXTURE_PATHS.length, success: true },
    })
  })

  it('a patch that names no required file is fine when they are all on disk', async () => {
    const fix = {
      path: 'app/components/generated/Fix.tsx',
      content: 'export function Fix() {\n  return null\n}\n',
    }
    // Ledger.tsx, which the routes import, takes an import of the new file:
    // a generated file nothing imports is swept before the build (#448).
    const ledger = {
      path: 'app/components/generated/Ledger.tsx',
      content: `import { Fix } from './Fix'\n${fixtureContent('app/components/generated/Ledger.tsx')}`,
    }
    const run = await runSwarm({
      build: [false, true],
      agents: { 'react-engineer': [ENGINEER_FIXTURE, patchReply([fix, ledger])] },
    })

    expect(run.error).toBeNull()
    expect(run.retries).toBe(1)
    expect(run.fakes.validateBuild).toHaveLength(2)
    // The reply alone would fail the required-file check; the merged set passes it.
    expect(run.callsFor('react-engineer')).toHaveLength(2)
    expect(onDisk(run.root, 'app/components/generated/Fix.tsx')).toBe(fix.content.trim())
    for (const rel of REQUIRED_ENGINEER_FILES) {
      expect(onDisk(run.root, rel), rel).toBe(fixtureContent(rel))
    }
    expect(run.result.files.map((f) => f.path)).toEqual([
      'elements/preset.ts',
      ...FIXTURE_PATHS,
      'app/components/generated/Fix.tsx',
    ])
    expect(run.fakes.archive[0].changedFiles).toEqual(run.result.files.map((f) => f.path))
    expect(run.trace.steps.find((s) => s.name === 'repair').output).toMatchObject({
      files: 2,
      written: 2,
      deleted: 0,
      merged: FIXTURE_PATHS.length + 1,
      success: true,
    })
  })

  it('an empty block deletes that file; a file the patch omits stays', async () => {
    const marker = 'repair attempt 2'
    const stale = {
      path: 'app/components/generated/Stale.tsx',
      content: 'export function Stale() {\n  return null\n}\n',
    }
    // Layout imports Stale in both attempts so the sweep keeps it (#448); the
    // point here is what the patch omits, not what nothing imports.
    const layout = fixtureContent('app/components/Layout.tsx')
    const layoutWithStale = `import { Stale } from './generated/Stale'\n${layout}`
    // Attempt 1 adds Stale.tsx and fails the build. Attempt 2 fixes Layout,
    // deletes Ledger.tsx with an empty block, and says nothing about Stale.
    const run = await runSwarm({
      build: [false, false, true],
      agents: {
        'react-engineer': [
          ENGINEER_FIXTURE,
          withAddedFiles(ENGINEER_FIXTURE.replace(layout, layoutWithStale), [stale]),
          patchReply([
            { path: 'app/components/Layout.tsx', content: `// ${marker}\n${layoutWithStale}` },
            { path: 'app/components/generated/Ledger.tsx', content: '' },
          ]),
        ],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'react-engineer',
      'react-engineer',
      'screenshot-critic',
    ])
    expect(run.retries).toBe(2)
    expect(run.fakes.validateBuild).toHaveLength(3)
    expect(run.fakes.restore).toHaveLength(0)

    // Attempt 2's brief lists Stale.tsx, which attempt 1 added, as a file the
    // engineer owns this run.
    const [, , repair2] = run.callsFor('react-engineer')
    expect(repair2.userPrompt).toContain(briefLine(run.root, 'app/components/generated/Stale.tsx'))
    expect(repair2.userPrompt).toContain(DEFAULT_BUILD_ERROR)

    expect(existsSync(path.join(run.root, 'app/components/generated/Ledger.tsx'))).toBe(false)
    expect(onDisk(run.root, 'app/components/generated/Stale.tsx')).toBe(stale.content.trim())
    expect(onDisk(run.root, 'app/components/Layout.tsx')).toContain(marker)

    const shipped = run.result.files.map((f) => f.path)
    expect(shipped).toEqual([
      'elements/preset.ts',
      ...FIXTURE_PATHS.filter((p) => p !== 'app/components/generated/Ledger.tsx'),
      'app/components/generated/Stale.tsx',
    ])
    expect(run.fakes.archive[0].changedFiles).toEqual(shipped)
    expect(run.fakes.archive[0]).toMatchObject({ rationale: 'Agent swarm redesign (repair 2)' })

    const repairSteps = run.trace.steps.filter((s) => s.name === 'repair')
    expect(repairSteps.map((s) => s.output)).toMatchObject([
      {
        files: FIXTURE_PATHS.length + 1,
        written: FIXTURE_PATHS.length + 1,
        deleted: 0,
        success: false,
      },
      { files: 2, written: 1, deleted: 1, merged: FIXTURE_PATHS.length, success: true },
    ])
  })

  it('spends a repair attempt on a patch that empties a required file and reminds the next one', async () => {
    const run = await runSwarm({
      build: [false, true],
      agents: {
        'react-engineer': [
          ENGINEER_FIXTURE,
          patchReply([{ path: 'app/routes/about.tsx', content: '' }]),
          patchReply([markedFile('app/components/Layout.tsx', 'repair attempt 2')]),
        ],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'react-engineer',
      'react-engineer',
      'screenshot-critic',
    ])
    // Two builds: the first pass and the second repair. The patch that would
    // have removed about.tsx was never applied, so it was never built.
    expect(run.fakes.validateBuild).toHaveLength(2)
    expect(run.retries).toBe(2)
    expect(onDisk(run.root, 'app/routes/about.tsx')).toBe(fixtureContent('app/routes/about.tsx'))

    const [, repair1, repair2] = run.callsFor('react-engineer')
    expect(repair1.userPrompt).toContain(DEFAULT_BUILD_ERROR)
    expect(repair1.userPrompt).not.toContain('## REQUIRED FILES MISSING')
    expect(repair2.userPrompt.startsWith('# Repair brief')).toBe(true)
    expect(repair2.userPrompt).toContain(
      'React Engineer omitted required files: app/routes/about.tsx'
    )
    expect(repair2.userPrompt).toContain('## REQUIRED FILES MISSING — RETRY')

    const repairSteps = run.trace.steps.filter((s) => s.name === 'repair')
    expect(repairSteps).toHaveLength(2)
    const [rejected, succeeded] = repairSteps
    expect(rejected).toMatchObject({ input: { attempt: 1 }, output: { files: 1, success: false } })
    expect(rejected.output.error).toContain('## REQUIRED FILES MISSING — RETRY')
    expect(succeeded).toMatchObject({ input: { attempt: 2 }, output: { success: true } })

    expect(run.fakes.archive).toHaveLength(1)
    expect(run.fakes.archive[0]).toMatchObject({ rationale: 'Agent swarm redesign (repair 2)' })
    expect(run.trace.dir).toMatch(/^build-\d+$/)
    for (const rel of REQUIRED_ENGINEER_FILES) {
      expect(existsSync(path.join(run.root, rel)), `${rel} under the root`).toBe(true)
    }
  })

  it('gives up after three repairs, keeps the failing sources, and puts the original back', async () => {
    const run = await runSwarm({ build: [false, false, false, false] })

    expect(run.result).toBeNull()
    expect(run.error.message.startsWith('Build failed after 3 repair attempt(s)')).toBe(true)
    expect(run.error.message).toContain(DEFAULT_BUILD_ERROR)
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'react-engineer',
      'react-engineer',
      'react-engineer',
    ])
    const repairs = run.callsFor('react-engineer').slice(1)
    expect(repairs).toHaveLength(3)
    for (const c of repairs) {
      expect(c.userPrompt.startsWith('# Repair brief')).toBe(true)
      expect(c.userPrompt).toContain(DEFAULT_BUILD_ERROR)
      expect(c.userPrompt).not.toContain(OLD_FRAMING)
    }
    expect(run.retries).toBe(3)
    expect(run.fakes.validateBuild).toHaveLength(4)
    expect(run.fakes.archive).toHaveLength(0)
    expect(run.verdicts).toBeNull()

    // The engineer's files were copied aside before the rollback erased them.
    const sourceDirs = dirsUnder(run.root, run.date, 'build-failed-sources-')
    expect(sourceDirs).toHaveLength(1)
    for (const rel of FIXTURE_PATHS) {
      expect(
        existsSync(path.join(run.root, 'archive', run.date, sourceDirs[0], rel)),
        `${rel} in ${sourceDirs[0]}`
      ).toBe(true)
    }

    // Nothing is restored ahead of a repair; the one restore is the original
    // backup when the loop runs out.
    expect(run.fakes.restore).toHaveLength(1)
    // Ledger.tsx joined the backup at write time (#432), so the rollback covers it.
    expect([...run.fakes.restore[0].map.keys()].sort()).toEqual(
      [...MUTABLE_FILES, 'app/components/generated/Ledger.tsx'].sort()
    )
    for (const rel of FIXTURE_PATHS) {
      expect(existsSync(path.join(run.root, rel)), `${rel} gone from the root`).toBe(false)
    }
    expect(onDisk(run.root, 'elements/preset.ts')).toBe(
      readFileSync(path.join(REPO, 'elements', 'preset.ts'), 'utf8')
    )

    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    const errorTxt = readFileSync(
      path.join(run.root, 'archive', run.date, run.trace.dir, 'error.txt'),
      'utf8'
    )
    expect(errorTxt.startsWith('Build failed after 3 repair attempt(s)')).toBe(true)
    expect(run.trace.steps.find((s) => s.name === 'build-validation').output.success).toBe(false)

    const repairSteps = run.trace.steps.filter((s) => s.name === 'repair')
    expect(repairSteps).toHaveLength(3)
    expect(repairSteps.map((s) => s.input.attempt)).toEqual([1, 2, 3])
    for (const step of repairSteps) {
      expect(step.phase).toBe(5)
      expect(step.output.success).toBe(false)
    }

    const costJson = JSON.parse(
      readFileSync(path.join(run.root, 'archive', run.date, run.trace.dir, 'cost.json'), 'utf8')
    )
    expect(costJson.retries).toBe(run.retries)
  })
})

describe('after the build passes: the screenshot critic and the surface gate', () => {
  it('revises on REVISE with a one-file patch and ships the merged set', async () => {
    const marker = 'post-critic revision'
    const run = await runSwarm({
      agents: {
        'react-engineer': [
          ENGINEER_FIXTURE,
          patchReply([markedFile('app/components/Sidebar.tsx', marker)]),
        ],
        'screenshot-critic': [REVISE_REPLY, fixtureFor('screenshot-critic')],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
      'react-engineer',
      // The final re-judge (#467): the build that ships after a repair round
      // is judged one more time, against the same fixture queue's second entry.
      'screenshot-critic',
    ])
    // The same brief as a repair, with the critic's feedback as the report.
    const [first, revision] = run.callsFor('react-engineer')
    expect(first.userPrompt).not.toContain(REVISE_FEEDBACK)
    expect(revision.systemPrompt).toBe(first.systemPrompt)
    expect(revision.userPrompt.startsWith('# Repair brief')).toBe(true)
    expect(revision.userPrompt).toContain(
      `The build passed. The screenshot critic and the surface gate found:\n\n${REVISE_FEEDBACK}`
    )
    expect(revision.userPrompt).not.toContain('Measured layout faults')
    expect(revision.userPrompt).not.toContain(OLD_FRAMING)
    for (const rel of FIXTURE_PATHS) {
      expect(revision.userPrompt, rel).toContain(briefBlock(rel, fixtureContent(rel)))
    }
    expect(run.retries).toBe(1)

    expect(run.fakes.validateBuild).toHaveLength(2)
    expect(run.fakes.runSurfaceGate).toHaveLength(2)
    expect(run.fakes.captureScreenshot).toHaveLength(2)
    expect(run.fakes.restore).toHaveLength(0)

    // One file changed; the merged set is what ships and what the archive records.
    expect(onDisk(run.root, 'app/components/Sidebar.tsx')).toContain(marker)
    expect(onDisk(run.root, 'app/components/Layout.tsx')).toBe(
      fixtureContent('app/components/Layout.tsx')
    )
    expect(run.result.files.map((f) => f.path)).toEqual(['elements/preset.ts', ...FIXTURE_PATHS])
    expect(run.result.files.find((f) => f.path === 'app/components/Sidebar.tsx').content).toContain(
      marker
    )
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.fakes.archive[0]).toMatchObject({
      rationale: 'Agent swarm redesign',
      changedFiles: ['elements/preset.ts', ...FIXTURE_PATHS],
    })

    expect(run.verdicts.map(({ critic, round, verdict }) => ({ critic, round, verdict }))).toEqual([
      { critic: 'spec-critic', round: undefined, verdict: 'APPROVED' },
      { critic: 'mockup-critic', round: 0, verdict: 'APPROVE' },
      { critic: 'surface-gate', round: 1, verdict: 'SHIP' },
      { critic: 'screenshot-critic', round: undefined, verdict: 'REVISE' },
      { critic: 'surface-gate', round: 2, verdict: 'SHIP' },
      { critic: 'screenshot-critic', round: 'final', verdict: 'SHIP' },
    ])
    expect(run.trace.dir).toMatch(/^build-\d+$/)
    for (const rel of REQUIRED_ENGINEER_FILES) {
      expect(existsSync(path.join(run.root, rel)), `${rel} under the root`).toBe(true)
    }
  })

  it('ships with the fault logged when the final re-judge still says REVISE (#467)', async () => {
    const marker = 'post-critic revision'
    const run = await runSwarm({
      agents: {
        'react-engineer': [
          ENGINEER_FIXTURE,
          patchReply([markedFile('app/components/Sidebar.tsx', marker)]),
        ],
        // Round 1 and the final re-judge both come back REVISE: the revision
        // did not clear the critic's objection, and the owner's call (#467)
        // is to ship anyway rather than spend a second repair.
        'screenshot-critic': [REVISE_REPLY, REVISE_REPLY],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
      'react-engineer',
      'screenshot-critic',
    ])
    // No second repair: one retry only.
    expect(run.retries).toBe(1)
    expect(onDisk(run.root, 'app/components/Sidebar.tsx')).toContain(marker)
    expect(run.result.files.map((f) => f.path)).toEqual(['elements/preset.ts', ...FIXTURE_PATHS])
    expect(run.fakes.archive).toHaveLength(1)

    expect(run.verdicts.map(({ critic, round, verdict }) => ({ critic, round, verdict }))).toEqual([
      { critic: 'spec-critic', round: undefined, verdict: 'APPROVED' },
      { critic: 'mockup-critic', round: 0, verdict: 'APPROVE' },
      { critic: 'surface-gate', round: 1, verdict: 'SHIP' },
      { critic: 'screenshot-critic', round: undefined, verdict: 'REVISE' },
      { critic: 'surface-gate', round: 2, verdict: 'SHIP' },
      { critic: 'screenshot-critic', round: 'final', verdict: 'REVISE' },
      { critic: 'ship-gate', round: undefined, verdict: 'SHIPPED-WITH-FAULTS' },
    ])
    const shipGate = run.verdicts.find((v) => v.critic === 'ship-gate')
    expect(shipGate.feedback).toContain(REVISE_FEEDBACK)
  })

  it('records UNVERIFIED instead of SHIPPED-WITH-FAULTS when the final re-judge never reaches the SDK vision channel (#486)', async () => {
    const marker = 'post-critic revision'
    const run = await runSwarm({
      agents: {
        'react-engineer': [
          ENGINEER_FIXTURE,
          patchReply([markedFile('app/components/Sidebar.tsx', marker)]),
        ],
        // Round 1 REVISE triggers the repair. The final re-judge falls back
        // to a text-only channel and answers REVISE for lack of images — the
        // build was never actually re-seen, so that REVISE is not a
        // confirmed fault (#486, the night that shipped a SHIPPED-WITH-FAULTS
        // notice for a build nothing was ever wrong with).
        'screenshot-critic': [REVISE_REPLY, withChannel(REVISE_REPLY, 'cli-text-fallback')],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
      'react-engineer',
      'screenshot-critic',
    ])

    expect(
      run.verdicts.map(({ critic, round, verdict, channel }) => ({
        critic,
        round,
        verdict,
        channel,
      }))
    ).toEqual([
      { critic: 'spec-critic', round: undefined, verdict: 'APPROVED', channel: undefined },
      { critic: 'mockup-critic', round: 0, verdict: 'APPROVE', channel: 'sdk-vision' },
      { critic: 'surface-gate', round: 1, verdict: 'SHIP', channel: undefined },
      { critic: 'screenshot-critic', round: undefined, verdict: 'REVISE', channel: 'sdk-vision' },
      { critic: 'surface-gate', round: 2, verdict: 'SHIP', channel: undefined },
      {
        critic: 'screenshot-critic',
        round: 'final',
        verdict: 'UNVERIFIED',
        channel: 'cli-text-fallback',
      },
    ])
    // No ship-gate entry at all: an unverified re-judge is not a fault to log.
    expect(run.verdicts.some((v) => v.critic === 'ship-gate')).toBe(false)
    // The build still ships — an unreachable vision channel is not a build
    // failure, just an unconfirmed one.
    expect(onDisk(run.root, 'app/components/Sidebar.tsx')).toContain(marker)
    expect(run.fakes.archive).toHaveLength(1)
  })

  it('rolls a revision that fails to build back to the passing state and ships that', async () => {
    const marker = 'post-critic revision'
    const run = await runSwarm({
      build: [true, false, true],
      agents: {
        'react-engineer': [
          ENGINEER_FIXTURE,
          patchReply([markedFile('app/components/Layout.tsx', marker)]),
        ],
        'screenshot-critic': [REVISE_REPLY],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
      'react-engineer',
    ])
    expect(run.callsFor('react-engineer')[1].userPrompt).toContain(REVISE_FEEDBACK)
    expect(run.retries).toBe(1)
    // Initial build, the revision's failed build, the re-validation after rollback.
    expect(run.fakes.validateBuild).toHaveLength(3)
    expect(run.fakes.runSurfaceGate).toHaveLength(1)

    // The map put back is the passing snapshot: every mutable file plus the
    // Ledger.tsx the engineer invented, all holding the first engineer result.
    expect(run.fakes.restore).toHaveLength(1)
    const passing = run.fakes.restore[0].map
    expect(run.fakes.restore[0].root).toBe(run.root)
    expect([...passing.keys()].sort()).toEqual(
      [...MUTABLE_FILES, 'app/components/generated/Ledger.tsx'].sort()
    )
    expect(typeof passing.get('app/components/Layout.tsx')).toBe('string')
    expect(passing.get('app/components/Layout.tsx')).not.toContain(marker)
    expect(typeof passing.get('app/components/generated/Ledger.tsx')).toBe('string')

    const layoutOnDisk = onDisk(run.root, 'app/components/Layout.tsx')
    expect(layoutOnDisk).not.toContain(marker)
    expect(layoutOnDisk).toBe(passing.get('app/components/Layout.tsx'))
    for (const rel of FIXTURE_PATHS) {
      expect(existsSync(path.join(run.root, rel)), `${rel} under the root`).toBe(true)
    }

    expect(run.fakes.archive).toHaveLength(1)
    expect(run.fakes.archive[0]).toMatchObject({ rationale: 'Agent swarm redesign' })
    expect(run.result.files.map((f) => f.path)).toEqual(['elements/preset.ts', ...FIXTURE_PATHS])
    expect(
      run.result.files.find((f) => f.path === 'app/components/Layout.tsx').content
    ).not.toContain(marker)
    expect(run.trace.dir).toMatch(/^build-\d+$/)
  })

  it('fails fatally when the rolled-back passing state does not rebuild either', async () => {
    const run = await runSwarm({
      build: [true, false, false],
      agents: { 'screenshot-critic': [REVISE_REPLY] },
    })

    expect(run.result).toBeNull()
    expect(run.error.fatal).toBe(true)
    expect(
      run.error.message.startsWith(
        'Restore of passing state failed to rebuild after post-critic revision'
      )
    ).toBe(true)
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
      'react-engineer',
    ])
    expect(run.retries).toBe(1)
    expect(run.fakes.validateBuild).toHaveLength(3)
    expect(run.fakes.archive).toHaveLength(0)
    expect(run.verdicts).toBeNull()

    // restore(passingBackup) first, then restore(originalBackup) when that did not build.
    expect(run.fakes.restore).toHaveLength(2)
    expect([...run.fakes.restore[0].map.keys()]).toContain('app/components/generated/Ledger.tsx')
    expect([...run.fakes.restore[1].map.keys()].sort()).toEqual(
      [...MUTABLE_FILES, 'app/components/generated/Ledger.tsx'].sort()
    )
    for (const rel of FIXTURE_PATHS) {
      expect(existsSync(path.join(run.root, rel)), `${rel} gone from the root`).toBe(false)
    }
    expect(onDisk(run.root, 'elements/preset.ts')).toBe(
      readFileSync(path.join(REPO, 'elements', 'preset.ts'), 'utf8')
    )

    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    const errorTxt = readFileSync(
      path.join(run.root, 'archive', run.date, run.trace.dir, 'error.txt'),
      'utf8'
    )
    expect(errorTxt.startsWith('Restore of passing state failed to rebuild')).toBe(true)
  })

  it('revises on a SHIP when the gate measured an engineer-owned fault', async () => {
    const run = await runSwarm({
      gate: [{ findings: [OVERFLOW_AT_390], measured: 8, errorCount: 1 }, CLEAN_GATE],
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
      'react-engineer',
      'screenshot-critic',
    ])
    const faults = formatFindingsForCritic([OVERFLOW_AT_390])
    expect(faults).toContain(
      '- [error] / at 390px (light): document is 640px wide in a 390px viewport'
    )
    // The critic read the measurements, said SHIP, and the engineer was
    // revised anyway with the same measurements as its feedback.
    expect(run.callsFor('screenshot-critic')[0].userPrompt).toContain(faults)
    const [first, revision] = run.callsFor('react-engineer')
    expect(first.userPrompt).not.toContain('## Measured layout faults')
    expect(revision.userPrompt).toContain(faults)
    expect(run.retries).toBe(1)

    expect(run.fakes.runSurfaceGate).toHaveLength(2)
    expect(run.fakes.validateBuild).toHaveLength(2)
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.fakes.restore).toHaveLength(0)
    expect(
      run.verdicts.map(({ critic, round, verdict, feedback }) => ({
        critic,
        round,
        verdict,
        feedback: critic === 'surface-gate' ? feedback : undefined,
      }))
    ).toEqual([
      { critic: 'spec-critic', round: undefined, verdict: 'APPROVED', feedback: undefined },
      { critic: 'mockup-critic', round: 0, verdict: 'APPROVE', feedback: undefined },
      {
        critic: 'surface-gate',
        round: 1,
        verdict: 'REVISE',
        feedback: '/ @390: document is 640px wide in a 390px viewport',
      },
      { critic: 'screenshot-critic', round: undefined, verdict: 'SHIP', feedback: undefined },
      {
        critic: 'surface-gate',
        round: 2,
        verdict: 'SHIP',
        feedback: 'all surfaces fit their viewport',
      },
      { critic: 'screenshot-critic', round: 'final', verdict: 'SHIP', feedback: undefined },
    ])
    expect(run.trace.dir).toMatch(/^build-\d+$/)
  })

  it('revises on a SHIP when the gate measured a clipped element at 360', async () => {
    const run = await runSwarm({
      gate: [{ findings: [CLIPPED_AT_360], measured: 8, errorCount: 1 }, CLEAN_GATE],
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
      'react-engineer',
      'screenshot-critic',
    ])

    // The finding routes to the engineer through ownerForSurface('/'), so the
    // clipped hero is fixed by the same path an overflow is.
    const faults = formatFindingsForCritic([CLIPPED_AT_360])
    expect(faults).toContain('- [error] / at 360px (light): <H1> is cut off')
    expect(run.callsFor('screenshot-critic')[0].userPrompt).toContain(faults)
    const [first, revision] = run.callsFor('react-engineer')
    expect(first.userPrompt).not.toContain('## Measured layout faults')
    expect(revision.userPrompt).toContain(faults)
    expect(run.retries).toBe(1)
    expect(run.fakes.runSurfaceGate).toHaveLength(2)
    expect(run.fakes.archive).toHaveLength(1)

    const gateVerdicts = run.verdicts.filter((v) => v.critic === 'surface-gate')
    expect(gateVerdicts.map((v) => v.verdict)).toEqual(['REVISE', 'SHIP'])
    expect(gateVerdicts[0].feedback).toContain('<H1> is cut off')
  })

  it('does not revise on a clipped element the design declared deliberate', async () => {
    // A warning is what the gate reports for a clipped element carrying no
    // text. It reaches the critic and cannot force anything.
    const run = await runSwarm({
      gate: [
        {
          findings: [{ ...CLIPPED_AT_360, severity: 'warning' }],
          measured: 8,
          errorCount: 0,
        },
      ],
    })

    expect(run.error).toBeNull()
    expect(run.callsFor('react-engineer')).toHaveLength(1)
    expect(run.fakes.runSurfaceGate).toHaveLength(1)
    expect(run.fakes.archive).toHaveLength(1)
  })

  it('does not revise for a tap-target warning alone, and it never reaches the repair brief without one', async () => {
    // #488: a tap-target or small-copy warning is advisory. It must not force
    // the revision that would put it in front of the engineer.
    const run = await runSwarm({
      gate: [{ findings: [TAP_TARGET_AT_360], measured: 8, errorCount: 0 }],
    })

    expect(run.error).toBeNull()
    expect(run.callsFor('react-engineer')).toHaveLength(1)
    expect(run.fakes.runSurfaceGate).toHaveLength(1)
  })

  it('carries tap-target and small-copy warnings into the repair brief when a revision runs for another reason (#488)', async () => {
    // The gate forces a revision on OVERFLOW_AT_390 (an error); the
    // tap-target warning rides along for free, after the errors.
    const run = await runSwarm({
      gate: [
        { findings: [OVERFLOW_AT_390, TAP_TARGET_AT_360], measured: 8, errorCount: 1 },
        CLEAN_GATE,
      ],
    })

    expect(run.error).toBeNull()
    expect(run.retries).toBe(1)

    const [first, revision] = run.callsFor('react-engineer')
    expect(first.userPrompt).not.toContain('## Advisory at 360')

    const errors = formatFindingsForCritic([OVERFLOW_AT_390])
    const advisoryIdx = revision.userPrompt.indexOf('## Advisory at 360')
    expect(advisoryIdx).toBeGreaterThan(-1)
    // After the errors, as the issue asks.
    expect(revision.userPrompt.indexOf(errors)).toBeLessThan(advisoryIdx)
    expect(revision.userPrompt).toContain(TAP_TARGET_AT_360.detail)
  })
})
