import { describe, expect, it } from 'vitest'
import {
  REQUIRED_FILES,
  findEngineerOutputProblem,
  findMissingRequiredFiles,
  findUnwritablePaths,
} from '../../scripts/utils/engineer-output-check.js'

const file = (path, content = 'export {}') => ({ path, content })
const complete = () => REQUIRED_FILES.map((p) => file(p))

describe('findMissingRequiredFiles', () => {
  it('returns nothing for a complete response', () => {
    expect(findMissingRequiredFiles(complete())).toEqual([])
  })

  it('lists every omitted required file, in the canonical order', () => {
    const files = complete().filter(
      (f) => f.path !== 'app/components/Sidebar.tsx' && f.path !== 'app/routes/og.tsx'
    )
    expect(findMissingRequiredFiles(files)).toEqual([
      'app/components/Sidebar.tsx',
      'app/routes/og.tsx',
    ])
  })

  it('ignores extra files the engineer chose to write', () => {
    expect(findMissingRequiredFiles([...complete(), file('app/components/Ledger.tsx')])).toEqual([])
  })

  it('treats no files as everything missing', () => {
    expect(findMissingRequiredFiles(undefined)).toEqual(REQUIRED_FILES)
  })
})

describe('findEngineerOutputProblem', () => {
  it('is null for a complete, posture-respecting response', () => {
    expect(findEngineerOutputProblem(complete(), 'none')).toBeNull()
    expect(findEngineerOutputProblem(complete(), 'standard')).toBeNull()
  })

  it('reports missing files with a reminder that names them', () => {
    const files = complete().filter((f) => f.path !== 'app/components/Sidebar.tsx')
    const problem = findEngineerOutputProblem(files, 'standard')
    expect(problem.kind).toBe('missing-files')
    expect(problem.message).toMatch(/app\/components\/Sidebar\.tsx/)
    expect(problem.reminder).toMatch(/REQUIRED FILES MISSING/)
    expect(problem.reminder).toMatch(/- app\/components\/Sidebar\.tsx/)
  })

  it('reports a posture violation once the files are complete', () => {
    const files = complete().map((f) =>
      f.path === 'app/components/Sidebar.tsx' ? file(f.path, '<nav>links</nav>') : f
    )
    const problem = findEngineerOutputProblem(files, 'none')
    expect(problem.kind).toBe('shell-posture')
    expect(problem.message).toMatch(/app\/components\/Sidebar\.tsx/)
    expect(problem.reminder).toMatch(/SHELL POSTURE VIOLATION/)
  })

  it('reports missing files before posture, since an absent file cannot be judged', () => {
    // #298: the posture retry used to be accepted for removing the nav even
    // when it dropped Sidebar.tsx again. Both must hold at once.
    const files = complete()
      .filter((f) => f.path !== 'app/components/Sidebar.tsx')
      .map((f) => (f.path === 'app/components/Layout.tsx' ? file(f.path, '<nav>') : f))
    expect(findEngineerOutputProblem(files, 'none').kind).toBe('missing-files')
  })

  it('does not treat a nav as a problem for any posture other than none', () => {
    const files = complete().map((f) =>
      f.path === 'app/components/Sidebar.tsx' ? file(f.path, '<nav>links</nav>') : f
    )
    expect(findEngineerOutputProblem(files, 'marginal')).toBeNull()
  })
})

/**
 * The night of 2026-09-20 ended here: the engineer's repair named
 * `app/components/MobileFooter.tsx`, one directory above the part of
 * `app/components/` it owns. `validateWritePath` threw, and the throw left
 * `applyEngineerPatch`, left `runAgentSwarm`, and ended the run 31 minutes in.
 * A misplaced component should cost a retry.
 */
describe('findUnwritablePaths', () => {
  it('passes a complete, correctly placed response', () => {
    expect(findUnwritablePaths(complete())).toEqual([])
  })

  it('passes a new component under the generated directory', () => {
    expect(findUnwritablePaths([file('app/components/generated/ManifestBand.tsx')])).toEqual([])
  })

  it('catches a new component beside the hand-written ones', () => {
    expect(findUnwritablePaths([file('app/components/MobileFooter.tsx')])).toEqual([
      'app/components/MobileFooter.tsx',
    ])
  })

  it.each([
    ['../outside.tsx'],
    ['/etc/passwd'],
    ['.github/workflows/daily-redesign.yml'],
    ['app/routeTree.gen.ts'],
    ['package.json'],
  ])('catches %s', (path) => {
    expect(findUnwritablePaths([file(path)])).toEqual([path])
  })

  it('tolerates an absent list', () => {
    expect(findUnwritablePaths(undefined)).toEqual([])
  })
})

describe('findEngineerOutputProblem on an unwritable path', () => {
  const strayed = () => [...complete(), file('app/components/MobileFooter.tsx')]

  it('reports it, and names the path and where it belongs', () => {
    const problem = findEngineerOutputProblem(strayed(), 'standard')
    expect(problem.kind).toBe('unwritable-path')
    expect(problem.message).toMatch(/MobileFooter\.tsx/)
    expect(problem.reminder).toMatch(/FILE PATH NOT YOURS/)
    expect(problem.reminder).toMatch(/app\/components\/generated\//)
  })

  it('reports missing files first, since the response is incomplete either way', () => {
    const files = strayed().filter((f) => f.path !== 'app/routes/og.tsx')
    expect(findEngineerOutputProblem(files, 'standard').kind).toBe('missing-files')
  })

  it('reports the path before posture: a file that cannot be written has no nav to judge', () => {
    const files = [
      ...complete().filter((f) => f.path !== 'app/components/Sidebar.tsx'),
      file('app/components/Sidebar.tsx', '<nav>links</nav>'),
      file('app/components/MobileFooter.tsx'),
    ]
    expect(findEngineerOutputProblem(files, 'none').kind).toBe('unwritable-path')
  })
})
