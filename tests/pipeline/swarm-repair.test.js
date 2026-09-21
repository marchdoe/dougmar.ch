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
import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'
import {
  CLEAN_GATE,
  CLEAN_COPY_GATE,
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
vi.mock('../../scripts/utils/copy-gate.js', (o) => m['scripts/utils/copy-gate.js'](o))
vi.mock('../../scripts/utils/archiver.js', (o) => m['scripts/utils/archiver.js'](o))
vi.mock('../../scripts/seal-archive.js', (o) => m['scripts/seal-archive.js'](o))
vi.mock('../../scripts/utils/file-manager.js', (o) => m['scripts/utils/file-manager.js'](o))
vi.mock('node:child_process', (o) => m['node:child_process'](o))

// site-context.js imports file-manager.js, so it loads after the mock block.
const { MUTABLE_FILES } = await import('../../scripts/utils/site-context.js')
const { parseDelimiterResponse } = await import('../../scripts/utils/delimiter-parser.js')
const { formatFindingsForCritic } = await import('../../scripts/utils/surface-gate.js')
const { renderedCopyFindings } = await import('../../scripts/utils/copy-gate.js')

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

/** The repair brief's advisory heading, which names the phone width. */
const ADVISORY_HEADING = `## Advisory at ${NARROW_VIEWPORT.width}`

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
    expect(first.options.purpose).toBe('first')
    expect(repair.options).toEqual({ ...first.options, purpose: 'repair' })
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
    expect(repair2.userPrompt).toContain('## REQUIRED FILES MISSING')
    // The report tells a patch to put the file back, not to re-emit everything.
    expect(repair2.userPrompt).not.toContain('Re-emit')

    const repairSteps = run.trace.steps.filter((s) => s.name === 'repair')
    expect(repairSteps).toHaveLength(2)
    const [rejected, succeeded] = repairSteps
    expect(rejected).toMatchObject({ input: { attempt: 1 }, output: { files: 1, success: false } })
    expect(rejected.output.error).toContain('## REQUIRED FILES MISSING')
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

describe('Phase 5: a failure only the Art Director can fix', () => {
  // What validateBuild reports when the preset breaks the frozen semantic set.
  const PRESET_ERROR = [
    '1 of 4 gates failed:',
    '',
    'Pre-build validation:',
    'elements/preset.ts: semanticTokens.colors is missing fieldInk — the semantic set is frozen and every one must be defined. Map the missing role onto the palette this design already has.',
  ].join('\n')

  it('fails with the reason and makes no repair call, and still rolls back', async () => {
    const run = await runSwarm({ build: [{ success: false, error: PRESET_ERROR }] })

    expect(run.result).toBeNull()
    expect(run.error.message.startsWith('Build failed after 0 repair attempt(s)')).toBe(true)
    expect(run.error.message).toContain('The failure is in elements/preset.ts')
    expect(run.error.message).toContain('no repair was attempted')
    expect(run.error.message).toContain(PRESET_ERROR)
    // The engineer's first generation is the only engineer call.
    expect(run.callsFor('react-engineer')).toHaveLength(1)
    expect(run.retries).toBe(0)
    expect(run.fakes.validateBuild).toHaveLength(1)
    expect(run.trace.steps.filter((s) => s.name === 'repair')).toEqual([])

    expect(run.fakes.archive).toHaveLength(0)
    expect(run.fakes.restore).toHaveLength(1)
    expect(onDisk(run.root, 'elements/preset.ts')).toBe(
      readFileSync(path.join(REPO, 'elements', 'preset.ts'), 'utf8')
    )
    const errorTxt = readFileSync(
      path.join(run.root, 'archive', run.date, run.trace.dir, 'error.txt'),
      'utf8'
    )
    expect(errorTxt).toContain('no repair was attempted')
  })

  it('still repairs when the same report also names an engineer file', async () => {
    const both = `${PRESET_ERROR}\napp/components/Layout.tsx(12,7): error TS2322: Type 'string' is not assignable to type 'number'.`
    const run = await runSwarm({ build: [{ success: false, error: both }, true] })

    expect(run.error).toBeNull()
    expect(run.callsFor('react-engineer')).toHaveLength(2)
    expect(run.callsFor('react-engineer')[1].userPrompt).toContain(both)
    expect(run.retries).toBe(1)
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

  // #570: the message the router reported on 2026-09-09, when the critic
  // stopped at its cap. It used to come back as the critic's reply, fail
  // closed to REVISE, and become the engineer's feedback.
  const TRUNCATION_REASON =
    '[screenshot-critic] response truncated at max_tokens (6000 output tokens, cap 6000)'

  it('gives a truncated round-1 critic no verdict and does not revise on it (#570)', async () => {
    const run = await runSwarm({
      agents: {
        'screenshot-critic': [withChannel(TRUNCATION_REASON, 'sdk-vision-truncated')],
      },
    })

    expect(run.error).toBeNull()
    // One engineer call, no revision, no final re-judge: nothing was
    // revised, so there is no post-revision build to judge.
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
    ])
    expect(run.retries).toBe(0)
    expect(run.fakes.validateBuild).toHaveLength(1)
    expect(run.fakes.archive).toHaveLength(1)
    expect(
      run.verdicts
        .filter((v) => v.critic === 'screenshot-critic')
        .map(({ round, verdict, channel, feedback }) => ({ round, verdict, channel, feedback }))
    ).toEqual([
      {
        round: undefined,
        verdict: 'UNVERIFIED',
        channel: 'sdk-vision-truncated',
        feedback: TRUNCATION_REASON,
      },
    ])
  })

  it('gives a text-only round-1 critic no verdict either, so its REVISE revises nothing (#570)', async () => {
    const run = await runSwarm({
      agents: { 'screenshot-critic': [withChannel(REVISE_REPLY, 'cli-text-fallback')] },
    })

    expect(run.error).toBeNull()
    expect(run.callsFor('react-engineer')).toHaveLength(1)
    expect(run.retries).toBe(0)
    const [verdict] = run.verdicts.filter((v) => v.critic === 'screenshot-critic')
    expect(verdict).toMatchObject({ verdict: 'UNVERIFIED', channel: 'cli-text-fallback' })
  })

  it('still runs the gate-driven revision when the round-1 critic truncated, on the gate faults alone (#570)', async () => {
    const run = await runSwarm({
      gate: [{ findings: [OVERFLOW_AT_390], measured: 8, errorCount: 1 }, CLEAN_GATE],
      agents: {
        'screenshot-critic': [
          withChannel(TRUNCATION_REASON, 'sdk-vision-truncated'),
          fixtureFor('screenshot-critic'),
        ],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
      'react-engineer',
      'screenshot-critic',
    ])
    const faults = formatFindingsForCritic([OVERFLOW_AT_390])
    const revision = run.callsFor('react-engineer')[1]
    expect(revision.userPrompt).toContain(faults)
    expect(revision.userPrompt).not.toContain('truncated at max_tokens')
    expect(run.retries).toBe(1)
    expect(
      run.verdicts
        .filter((v) => v.critic === 'screenshot-critic')
        .map(({ round, verdict, channel }) => ({ round, verdict, channel }))
    ).toEqual([
      { round: undefined, verdict: 'UNVERIFIED', channel: 'sdk-vision-truncated' },
      { round: 'final', verdict: 'SHIP', channel: 'sdk-vision' },
    ])
  })

  it('records a truncated final re-judge as UNVERIFIED with the reason, as before (#570)', async () => {
    const run = await runSwarm({
      agents: {
        'react-engineer': [
          ENGINEER_FIXTURE,
          patchReply([markedFile('app/components/Sidebar.tsx', 'post-critic revision')]),
        ],
        'screenshot-critic': [REVISE_REPLY, withChannel(TRUNCATION_REASON, 'sdk-vision-truncated')],
      },
    })

    expect(run.error).toBeNull()
    expect(run.callsFor('react-engineer')).toHaveLength(2)
    expect(
      run.verdicts
        .filter((v) => v.critic === 'screenshot-critic')
        .map(({ round, verdict, channel, feedback }) => ({
          round,
          verdict,
          channel,
          feedback: round === 'final' ? feedback : undefined,
        }))
    ).toEqual([
      { round: undefined, verdict: 'REVISE', channel: 'sdk-vision', feedback: undefined },
      {
        round: 'final',
        verdict: 'UNVERIFIED',
        channel: 'sdk-vision-truncated',
        feedback: TRUNCATION_REASON,
      },
    ])
    expect(run.verdicts.some((v) => v.critic === 'ship-gate')).toBe(false)
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
    expect(first.userPrompt).not.toContain(ADVISORY_HEADING)

    const errors = formatFindingsForCritic([OVERFLOW_AT_390])
    const advisoryIdx = revision.userPrompt.indexOf(ADVISORY_HEADING)
    expect(advisoryIdx).toBeGreaterThan(-1)
    // After the errors, as the issue asks.
    expect(revision.userPrompt.indexOf(errors)).toBeLessThan(advisoryIdx)
    expect(revision.userPrompt).toContain(TAP_TARGET_AT_360.detail)
  })
})

describe('the copy gate (#504)', () => {
  /** A static finding on an engineer file: the shape `runCopyGate` returns. */
  const DASH_IN_DECK = {
    surface: 'app/routes/index.tsx',
    line: 14,
    owner: 'react-engineer',
    kind: 'copy-tell',
    tell: 'em-dash',
    severity: 'error',
    detail: 'em dash: "<p>Rebuilt every night — again</p>". Use a period or a comma.',
  }

  it('revises on a SHIP when the static scan found a tell in an engineer file', async () => {
    const run = await runSwarm({
      copy: [{ findings: [DASH_IN_DECK], scanned: 6, errorCount: 1 }, CLEAN_COPY_GATE],
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
      'react-engineer',
      'screenshot-critic',
    ])

    // The line comes back verbatim, with the file and the line number, to
    // the critic and then to the engineer's repair brief.
    const faults = formatFindingsForCritic([DASH_IN_DECK])
    expect(faults).toContain(
      '- [error] app/routes/index.tsx:14: em dash: "<p>Rebuilt every night — again</p>". Use a period or a comma.'
    )
    expect(run.callsFor('screenshot-critic')[0].userPrompt).toContain(faults)
    const [first, revision] = run.callsFor('react-engineer')
    expect(first.userPrompt).not.toContain('## Measured layout faults')
    expect(revision.userPrompt).toContain(faults)
    expect(run.retries).toBe(1)

    // Both halves run in both rounds, and the record says round 1 failed on it.
    expect(run.fakes.runSurfaceGate).toHaveLength(2)
    expect(run.fakes.runCopyGate).toHaveLength(2)
    const gateVerdicts = run.verdicts.filter((v) => v.critic === 'surface-gate')
    expect(gateVerdicts.map((v) => v.verdict)).toEqual(['REVISE', 'SHIP'])
    expect(gateVerdicts[0].feedback).toContain('app/routes/index.tsx:14: em dash')
  })

  it('sends the engineer the block and the fix for an orphan separator on /about (#568)', async () => {
    // What the surface gate builds from the real 2026-09-20 /about: the
    // rendered runs go through the real rule, and the finding takes the
    // shape `runSurfaceGate` returns.
    const runs = [
      { tag: 'span', text: '2025,', before: false, after: false },
      { tag: 'div', text: ', iCapital', before: false, after: false },
      { tag: 'div', text: 'Founder & Consultant, Spaceman', before: false, after: false },
    ]
    const orphans = renderedCopyFindings({ text: '', runs }, { severity: 'error' }).map((f) => ({
      surface: '/about',
      viewport: 'desktop',
      width: 1440,
      scheme: 'light',
      ...f,
    }))
    expect(orphans).toHaveLength(2)

    const run = await runSwarm({
      gate: [{ findings: orphans, measured: 8, errorCount: 2 }, CLEAN_GATE],
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent).filter((a) => a === 'react-engineer')).toHaveLength(2)
    const [first, revision] = run.callsFor('react-engineer')
    expect(first.userPrompt).not.toContain('orphan separator')
    const fix = 'A field can be empty; render the separator only when both sides exist.'
    expect(revision.userPrompt).toContain(
      `- [error] /about at 1440px (light): orphan separator in rendered copy: <span> "2025," closes on ",". ${fix}`
    )
    expect(revision.userPrompt).toContain(
      `- [error] /about at 1440px (light): orphan separator in rendered copy: <div> ", iCapital" opens on ",". ${fix}`
    )
    expect(revision.userPrompt).not.toContain('Founder & Consultant')
    expect(run.retries).toBe(1)
  })

  it('reports a tell in hand-written content as a warning that forces nothing', async () => {
    const warning = {
      ...DASH_IN_DECK,
      surface: 'app/content/projects.ts',
      line: 40,
      owner: 'human',
      severity: 'warning',
    }
    const run = await runSwarm({ copy: [{ findings: [warning], scanned: 6, errorCount: 0 }] })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
    ])
    expect(run.retries).toBe(0)
    expect(run.callsFor('screenshot-critic')[0].userPrompt).toContain(
      '- [warning] app/content/projects.ts:40: em dash'
    )
    expect(run.verdicts.find((v) => v.critic === 'surface-gate').verdict).toBe('SHIP')
    expect(run.verdicts.some((v) => v.verdict === 'NEEDS-HUMAN')).toBe(false)
  })
})
