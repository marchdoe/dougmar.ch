import { describe, it, expect } from 'vitest'
import {
  findNavOffenders,
  findShellPostureViolation,
} from '../../scripts/utils/shell-posture-check.js'

describe('findShellPostureViolation', () => {
  it('flags a <nav> element when shell_posture is none', () => {
    const files = [
      {
        path: 'app/components/Sidebar.tsx',
        content: 'export function Sidebar() { return <nav>...</nav> }',
      },
    ]
    expect(findShellPostureViolation(files, 'none')).toMatch(/app\/components\/Sidebar\.tsx/)
  })

  it('lists every offending file', () => {
    const files = [
      { path: 'app/components/Layout.tsx', content: '<nav className="top">' },
      { path: 'app/components/Sidebar.tsx', content: '<nav>' },
      { path: 'app/routes/index.tsx', content: 'return <main>hero</main>' },
    ]
    const violation = findShellPostureViolation(files, 'none')
    expect(violation).toMatch(/app\/components\/Layout\.tsx/)
    expect(violation).toMatch(/app\/components\/Sidebar\.tsx/)
    expect(violation).not.toMatch(/app\/routes\/index\.tsx/)
  })

  it('passes when no file contains a <nav> element', () => {
    const files = [
      {
        path: 'app/components/Sidebar.tsx',
        content: 'export function Sidebar() { return <aside>Doug March</aside> }',
      },
      { path: 'app/routes/index.tsx', content: 'return <main><a href="/about">About</a></main>' },
    ]
    expect(findShellPostureViolation(files, 'none')).toBeNull()
  })

  it('does not flag a partial match like <navbar> or "innavigable"', () => {
    const files = [
      {
        path: 'app/components/Sidebar.tsx',
        content: '<navbar>not a real nav tag</navbar> innavigable',
      },
    ]
    expect(findShellPostureViolation(files, 'none')).toBeNull()
  })

  it('is a no-op for any posture other than none', () => {
    const files = [{ path: 'app/components/Sidebar.tsx', content: '<nav>standard nav</nav>' }]
    for (const posture of [
      'standard',
      'marginal',
      'folded-into-hero',
      'footer-only',
      null,
      undefined,
    ]) {
      expect(findShellPostureViolation(files, posture)).toBeNull()
    }
  })

  it('handles an empty file list', () => {
    expect(findShellPostureViolation([], 'none')).toBeNull()
  })
})

describe('findNavOffenders', () => {
  const files = [
    { path: 'app/components/Layout.tsx', content: '<nav className="top">' },
    { path: 'app/components/Sidebar.tsx', content: '<nav>' },
    { path: 'app/routes/index.tsx', content: 'return <main>hero</main>' },
  ]

  it('lists the offending paths in file order', () => {
    expect(findNavOffenders(files, 'none')).toEqual([
      'app/components/Layout.tsx',
      'app/components/Sidebar.tsx',
    ])
  })

  it('is empty for any posture but none, and for no files', () => {
    expect(findNavOffenders(files, 'standard')).toEqual([])
    expect(findNavOffenders(undefined, 'none')).toEqual([])
  })
})
