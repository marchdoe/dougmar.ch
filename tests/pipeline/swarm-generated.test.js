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

describe('a hand-written component beside the directory', () => {
  const HAND = 'app/components/FeaturedProject.tsx'
  const ORIGINAL = 'export function FeaturedProject() {\n  return null\n}\n'
  const REWRITE = `===FILE:${HAND}===\nexport const FeaturedProject = () => null\n`

  it('cannot be written by the engineer; the run fails and the file is untouched', async () => {
    const run = await runSwarm({
      agents: { 'react-engineer': [REWRITE + fixtureFor('react-engineer')] },
      beforeRun: (root) => writeUnder(root, HAND, ORIGINAL),
    })

    expect(run.result).toBeNull()
    expect(run.error.message).toMatch(
      /Path not in write allowlist: app\/components\/FeaturedProject\.tsx/
    )
    expect(onDisk(run.root, HAND)).toBe(ORIGINAL)
    expect(run.fakes.archive).toHaveLength(0)
  })
})
