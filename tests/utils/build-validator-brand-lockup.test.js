import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { validateGenerated } from '../../scripts/utils/build-validator.js'
import { renderBrandLockupFile } from '../../scripts/utils/brand-lockup.js'

// biome-ignore lint/suspicious/noTemplateCurlyInString: the fixture must carry the literal interpolation; the validator reads it as source text.
const MAILTO_HREF = '{`mailto:${identity.email}`}'

/**
 * A minimal tree that satisfies every OTHER check in validateGenerated, so a
 * failure in these tests is a brand-lockup failure and nothing else. The
 * checks above this one want a preset, a __root.tsx that imports and renders
 * Scripts with a charset, an about.ts with an email, and something binding
 * that email.
 */
function seedRepo() {
  const root = mkdtempSync(path.join(tmpdir(), 'lockup-validator-'))
  mkdirSync(path.join(root, 'elements'), { recursive: true })
  mkdirSync(path.join(root, 'app/components'), { recursive: true })
  mkdirSync(path.join(root, 'app/routes'), { recursive: true })
  mkdirSync(path.join(root, 'app/content'), { recursive: true })

  writeFileSync(
    path.join(root, 'elements/preset.ts'),
    'export const elementsPreset = { theme: { tokens: {} } }\n'
  )
  writeFileSync(
    path.join(root, 'app/content/about.ts'),
    "export const identity = { name: 'Doug March', role: 'Product Designer', email: 'hello@dougmar.ch' }\n"
  )
  writeFileSync(
    path.join(root, 'app/routes/__root.tsx'),
    [
      "import { Scripts } from '@tanstack/react-router'",
      "import { Layout } from '../components/Layout'",
      "export const Route = { head: () => ({ meta: [{ charSet: 'utf-8' }] }) }",
      'export function RootDocument() {',
      '  return (<Layout><Scripts /></Layout>)',
      '}',
    ].join('\n')
  )
  writeFileSync(
    path.join(root, 'app/components/Layout.tsx'),
    [
      "import { identity } from '../content/about'",
      "import { BrandLockup } from './BrandLockup'",
      'export function Layout({ children }: { children: React.ReactNode }) {',
      '  return (',
      '    <div>',
      '      <BrandLockup variant="horizontal-md" mode="single-color" />',
      `      <a href=${MAILTO_HREF}>mail</a>`,
      '      {children}',
      '    </div>',
      '  )',
      '}',
    ].join('\n')
  )
  // The real generated component, so the owner-file exemption is exercised
  // against the actual path data rather than a stand-in.
  writeFileSync(
    path.join(root, 'app/components/BrandLockup.tsx'),
    renderBrandLockupFile({ fonts: { display: { weights: [400] } } })
  )
  return root
}

/** Findings mentioning the brand lockup, so an unrelated check cannot pass a test. */
function lockupErrors(result) {
  if (result.success) return []
  return result.error
    .split('\n')
    .filter((line) => /BrandLockup|logo|mark|lockup/i.test(line))
    .map((line) => line.trim())
}

describe('validateGenerated — the brand lockup (#254)', () => {
  let root
  beforeEach(() => {
    root = seedRepo()
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('passes a tree where only BrandLockup draws the mark', () => {
    const result = validateGenerated({ root, shell: { brand_lockup: 'horizontal-md' } })
    expect(lockupErrors(result)).toEqual([])
  })

  it('rejects a direct logo.svg import from a file a route reaches', () => {
    writeFileSync(
      path.join(root, 'app/components/Layout.tsx'),
      [
        "import logo from '../assets/logo.svg'",
        "import { identity } from '../content/about'",
        "import { BrandLockup } from './BrandLockup'",
        'export function Layout({ children }) {',
        `  return (<div><img src={logo} alt="" /><BrandLockup /><a href=${MAILTO_HREF}>m</a>{children}</div>)`,
        '}',
      ].join('\n')
    )
    const errors = lockupErrors(validateGenerated({ root, shell: null }))
    expect(errors.join('\n')).toMatch(/Layout\.tsx: imports the logo SVG directly/)
  })

  it('rejects a logo-mono.svg import too', () => {
    writeFileSync(
      path.join(root, 'app/components/Layout.tsx'),
      [
        "import logoMono from '../assets/logo-mono.svg'",
        "import { identity } from '../content/about'",
        "import { BrandLockup } from './BrandLockup'",
        'export function Layout({ children }) {',
        `  return (<div><img src={logoMono} alt="" /><BrandLockup /><a href=${MAILTO_HREF}>m</a>{children}</div>)`,
        '}',
      ].join('\n')
    )
    expect(lockupErrors(validateGenerated({ root, shell: null })).join('\n')).toMatch(
      /imports the logo SVG directly/
    )
  })

  it('rejects the mark pasted inline as path data', () => {
    writeFileSync(
      path.join(root, 'app/components/Layout.tsx'),
      [
        "import { identity } from '../content/about'",
        "import { BrandLockup } from './BrandLockup'",
        'export function Layout({ children }) {',
        '  return (',
        '    <div>',
        '      <svg viewBox="0 0 71 59">',
        '        <path d="M29.8925 0.440186C45.91 0.440257 58.8956 13.4256 58.8965 29.4431Z" />',
        '      </svg>',
        `      <BrandLockup /><a href=${MAILTO_HREF}>m</a>{children}`,
        '    </div>',
        '  )',
        '}',
      ].join('\n')
    )
    expect(lockupErrors(validateGenerated({ root, shell: null })).join('\n')).toMatch(
      /contains the brand mark's path data inline/
    )
  })

  it('catches pasted path data that has been reformatted across lines', () => {
    writeFileSync(
      path.join(root, 'app/components/Layout.tsx'),
      [
        "import { identity } from '../content/about'",
        "import { BrandLockup } from './BrandLockup'",
        'export function Layout({ children }) {',
        '  const d =',
        '    "M68.9722 9.76277C68.1324 8.9222 66.8896 8.48386 65.2438 8.44856Z"',
        `  return (<div><svg><path d={d} /></svg><BrandLockup /><a href=${MAILTO_HREF}>m</a>{children}</div>)`,
        '}',
      ].join('\n')
    )
    expect(lockupErrors(validateGenerated({ root, shell: null })).join('\n')).toMatch(
      /path data inline/
    )
  })

  it('does not flag BrandLockup.tsx itself, which is where the mark lives', () => {
    const result = validateGenerated({ root, shell: { brand_lockup: 'stacked-lg' } })
    expect(result.error ?? '').not.toContain('BrandLockup.tsx: contains')
    expect(result.error ?? '').not.toContain('BrandLockup.tsx: imports')
  })

  it('ignores an orphan component no route can reach', () => {
    // #216 owns deleting the five leftover attempts. Until it lands, failing a
    // nightly build over a file nobody renders would kill a run that was fine.
    writeFileSync(
      path.join(root, 'app/components/LogoMark.tsx'),
      [
        "import logo from '../assets/logo-mono.svg'",
        'export function LogoMark() {',
        '  return <img src={logo} alt="" />',
        '}',
      ].join('\n')
    )
    expect(
      lockupErrors(validateGenerated({ root, shell: { brand_lockup: 'horizontal-md' } }))
    ).toEqual([])
  })

  it('rejects a declared lockup that nothing renders', () => {
    writeFileSync(
      path.join(root, 'app/components/Layout.tsx'),
      [
        "import { identity } from '../content/about'",
        'export function Layout({ children }) {',
        `  return (<div><a href=${MAILTO_HREF}>m</a>{children}</div>)`,
        '}',
      ].join('\n')
    )
    expect(
      lockupErrors(validateGenerated({ root, shell: { brand_lockup: 'stacked-md' } })).join('\n')
    ).toMatch(/SHELL declares brand_lockup: stacked-md, but no file renders <BrandLockup \/>/)
  })

  it('skips the render check when no shell declaration was handed in', () => {
    writeFileSync(
      path.join(root, 'app/components/Layout.tsx'),
      [
        "import { identity } from '../content/about'",
        'export function Layout({ children }) {',
        `  return (<div><a href=${MAILTO_HREF}>m</a>{children}</div>)`,
        '}',
      ].join('\n')
    )
    expect(lockupErrors(validateGenerated({ root, shell: null }))).toEqual([])
  })

  it('skips the render check when the declaration says there is no lockup', () => {
    writeFileSync(
      path.join(root, 'app/components/Layout.tsx'),
      [
        "import { identity } from '../content/about'",
        'export function Layout({ children }) {',
        `  return (<div><a href=${MAILTO_HREF}>m</a>{children}</div>)`,
        '}',
      ].join('\n')
    )
    expect(lockupErrors(validateGenerated({ root, shell: { brand_lockup: 'none' } }))).toEqual([])
  })

  it('accepts a self-closing render and one with children', () => {
    for (const usage of ['<BrandLockup />', '<BrandLockup variant="stacked-lg" />']) {
      writeFileSync(
        path.join(root, 'app/components/Layout.tsx'),
        [
          "import { identity } from '../content/about'",
          "import { BrandLockup } from './BrandLockup'",
          'export function Layout({ children }) {',
          `  return (<div>${usage}<a href={\`mailto:\${identity.email}\`}>m</a>{children}</div>)`,
          '}',
        ].join('\n')
      )
      expect(
        lockupErrors(validateGenerated({ root, shell: { brand_lockup: 'stacked-lg' } }))
      ).toEqual([])
    }
  })
})
