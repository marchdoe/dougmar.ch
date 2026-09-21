/**
 * The engineer's generated directory, driven through the real swarm against
 * a temp root (#448): app/components/generated/ is the one place its invented
 * components may go, a file there that today's output does not import is
 * swept before the build and comes back on rollback, and a write to a
 * hand-written component beside the directory is rejected outright.
 *
 * `restore` from file-manager.js stays real; the harness records each call
 * as `run.fakes.restore` so a scenario can say which map was put back.
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { writeUnder } from '../helpers/tmp.js'
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

const LEDGER = 'app/components/generated/Ledger.tsx'
const YESTERDAY = 'app/components/generated/Yesterday.tsx'
const YESTERDAY_SRC = 'export function Yesterday() {\n  return null\n}\n'

const onDisk = (root, rel) => readFileSync(path.join(root, rel), 'utf8')
const under = (root, rel) => existsSync(path.join(root, rel))

describe("a previous night's component under app/components/generated/", () => {
  it("is swept when today's files do not import it; the one they import stays", async () => {
    const run = await runSwarm({
      beforeRun: (root) => writeUnder(root, YESTERDAY, YESTERDAY_SRC),
    })

    expect(run.error).toBeNull()
    expect(under(run.root, YESTERDAY)).toBe(false)
    // The fixture's routes import Ledger, so the sweep keeps it.
    expect(under(run.root, LEDGER)).toBe(true)

    const sweeps = run.trace.steps.filter((s) => s.name === 'generated-sweep')
    expect(sweeps).toHaveLength(1)
    expect(sweeps[0]).toMatchObject({
      phase: 3,
      input: { after: 'react-engineer' },
      output: { kept: [LEDGER], removed: [YESTERDAY] },
    })
    // The sweep ran before the build saw the directory.
    const names = run.trace.steps.map((s) => s.name)
    expect(names.indexOf('generated-sweep')).toBeLessThan(names.indexOf('build-validation'))

    // A passing run restores nothing and ships without the swept file.
    expect(run.fakes.restore).toHaveLength(0)
    expect(run.fakes.archive[0].changedFiles).not.toContain(YESTERDAY)
    expect(run.fakes.archive[0].changedFiles).toContain(LEDGER)
  })

  it('comes back when the run rolls back', async () => {
    const run = await runSwarm({
      build: [false, false, false, false],
      beforeRun: (root) => writeUnder(root, YESTERDAY, YESTERDAY_SRC),
    })

    expect(run.error.message).toMatch(/^Build failed after 3 repair attempt\(s\)/)
    expect(onDisk(run.root, YESTERDAY)).toBe(YESTERDAY_SRC)
    // The engineer's own files are gone, as on any rollback.
    expect(under(run.root, LEDGER)).toBe(false)
    expect(under(run.root, 'app/components/Layout.tsx')).toBe(false)

    // The sweep recorded the file into the original backup, and that is the
    // map the rollback restored.
    expect(run.fakes.restore).toHaveLength(1)
    expect(run.fakes.restore[0].map.get(YESTERDAY)).toBe(YESTERDAY_SRC)

    // One sweep after Phase 3, one after each repair merge; only the first
    // had anything to remove.
    const sweeps = run.trace.steps.filter((s) => s.name === 'generated-sweep')
    expect(sweeps.map((s) => s.phase)).toEqual([3, 5, 5, 5])
    expect(sweeps.map((s) => s.input.after)).toEqual([
      'react-engineer',
      'React Engineer repair',
      'React Engineer repair',
      'React Engineer repair',
    ])
    expect(sweeps.map((s) => s.output.removed)).toEqual([[YESTERDAY], [], [], []])
    expect(sweeps.every((s) => s.output.kept.includes(LEDGER))).toBe(true)
  })
})

describe("a previous night's component that today's files import (#575)", () => {
  const INDEX = 'app/routes/index.tsx'
  const IMPORT_LINE = "import { Yesterday } from '../components/generated/Yesterday'\n"
  const HEADER = `===FILE:${INDEX}===\n`
  const FIXTURE = fixtureFor('react-engineer')
  const REVISE_REPLY = [
    '===VERDICT===',
    'REVISE',
    '===END===',
    '',
    '**Responsible agent:** react-engineer',
    '',
    '===FEEDBACK===',
    'The home page needs a second look.',
    '===END===',
    '',
  ].join('\n')

  const start = FIXTURE.indexOf(HEADER) + HEADER.length
  const indexSource = FIXTURE.slice(start, FIXTURE.indexOf('\n===', start) + 1)
  /** The engineer's first reply: the recorded one, with the home route importing Yesterday. */
  const importsYesterday = FIXTURE.replace(HEADER, HEADER + IMPORT_LINE)
  /** The revision's patch: the home route as recorded, without the import. */
  const dropsTheImport = `${HEADER}${indexSource}\n===RATIONALE===\ndrop the import\n`

  it('is put back when a revision that stops importing it fails to rebuild', async () => {
    const run = await runSwarm({
      build: [true, false, true],
      agents: {
        'react-engineer': [importsYesterday, dropsTheImport],
        'screenshot-critic': [REVISE_REPLY],
      },
      beforeRun: (root) => writeUnder(root, YESTERDAY, YESTERDAY_SRC),
    })

    expect(run.error).toBeNull()
    expect(run.fakes.validateBuild).toHaveLength(3)

    // The first sweep kept it (the home route imports it); the revision's
    // sweep removed it, and the rollback of that revision restored the
    // passing state, which is where the file has to come from.
    const sweeps = run.trace.steps.filter((s) => s.name === 'generated-sweep')
    expect(sweeps.map((s) => s.output.removed)).toEqual([[], [YESTERDAY]])
    expect(run.fakes.restore).toHaveLength(1)
    expect(run.fakes.restore[0].map.get(YESTERDAY)).toBe(YESTERDAY_SRC)

    expect(onDisk(run.root, YESTERDAY)).toBe(YESTERDAY_SRC)
    expect(onDisk(run.root, INDEX)).toContain(IMPORT_LINE.trim())
  })
})

describe('a hand-written component beside the directory', () => {
  const HAND = 'app/components/FeaturedProject.tsx'
  const ORIGINAL = 'export function FeaturedProject() {\n  return null\n}\n'
  const REWRITE = `===FILE:${HAND}===\nexport const FeaturedProject = () => null\n`

  /**
   * The file being untouched is the guarantee. The run ending was only ever
   * the mechanism, and it was the wrong one: on 2026-09-20 the engineer's
   * repair named a component one directory too high and `validateWritePath`
   * threw out through `applyEngineerPatch` and `runAgentSwarm`, ending a run
   * 31 minutes in over one misplaced file.
   *
   * Now the engineer is asked to move it, and when it declines — which this
   * harness guarantees, since an exhausted queue replays the same response —
   * the block is discarded and the night goes on without it.
   */
  it('cannot be written by the engineer, and the file is untouched', async () => {
    const run = await runSwarm({
      agents: { 'react-engineer': [REWRITE + fixtureFor('react-engineer')] },
      beforeRun: (root) => writeUnder(root, HAND, ORIGINAL),
    })

    // The hand-written component is what this protects, and it is intact.
    expect(onDisk(run.root, HAND)).toBe(ORIGINAL)

    // And the run finished rather than dying on the way past it.
    expect(run.error).toBeFalsy()
    expect(run.result).not.toBeNull()
    expect(run.fakes.archive).toHaveLength(1)

    // The engineer was told which path was not its own before the block was
    // dropped, so a willing agent fixes the import rather than losing it. The
    // ask is a patch request, and it carries the rejected file: nothing was
    // written to the path, so the brief's listing of the disk cannot show it.
    const asks = run.callsFor('react-engineer').slice(1)
    expect(asks.length).toBeGreaterThan(0)
    for (const ask of asks) {
      expect(ask.userPrompt.startsWith('# Repair brief')).toBe(true)
      expect(ask.userPrompt).toContain('FILE PATH NOT YOURS')
      expect(ask.userPrompt).toContain(HAND)
      expect(ask.userPrompt).toContain(`--- ${HAND} (not written) ---`)
      expect(ask.userPrompt).toContain('export const FeaturedProject = () => null')
    }
  })

  it('is moved under generated/ by a patch that also fixes the import', async () => {
    const MOVED = 'app/components/generated/FeaturedProject.tsx'
    const INDEX = 'app/routes/index.tsx'
    const engineer = fixtureFor('react-engineer')
    // The first reply imports the stray file from the home route.
    const start = engineer.indexOf(`===FILE:${INDEX}===\n`) + `===FILE:${INDEX}===\n`.length
    const strayImport = `import { FeaturedProject } from '../components/FeaturedProject'\n`
    const firstReply = REWRITE + engineer.slice(0, start) + strayImport + engineer.slice(start)
    const patch =
      `===FILE:${MOVED}===\nexport const FeaturedProject = () => null\n\n` +
      `===FILE:${INDEX}===\n${strayImport.replace('../components/', '../components/generated/')}` +
      `${engineer.slice(start, engineer.indexOf('\n===', start) + 1)}\n===RATIONALE===\nmoved\n`

    const run = await runSwarm({
      agents: { 'react-engineer': [firstReply, patch] },
      beforeRun: (root) => writeUnder(root, HAND, ORIGINAL),
    })

    expect(run.error).toBeNull()
    expect(run.callsFor('react-engineer')).toHaveLength(2)
    expect(run.retries).toBe(1)
    expect(onDisk(run.root, HAND)).toBe(ORIGINAL)
    expect(onDisk(run.root, MOVED)).toContain('FeaturedProject')
    expect(onDisk(run.root, INDEX)).toContain('../components/generated/FeaturedProject')
    expect(onDisk(run.root, INDEX)).not.toContain("'../components/FeaturedProject'")
    expect(run.fakes.archive[0].changedFiles).toContain(MOVED)
  })
})
