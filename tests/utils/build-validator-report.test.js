import { describe, it, expect, vi, afterEach } from 'vitest'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { tempDir } from '../helpers/tmp.js'
import { validateBuild } from '../../scripts/utils/build-validator.js'
import { ROOT } from '../../scripts/utils/file-manager.js'

/**
 * #432: run 33756500843 met a different gate on each of four retry attempts
 * because `validateBuild` returned at the first failing gate, so no single
 * repair could see everything wrong. These tests exercise the restructured
 * `validateBuild`, which runs every gate that can run and reports every
 * failure together, grouped by gate, in the order the pipeline runs them:
 * pre-build validation, `pnpm build`, the build-output smoke checks, then
 * `runStaticChecks`.
 */

/** What a clean `fallow audit --format json` prints, reduced to what is read. */
const FALLOW_PASS = JSON.stringify({ verdict: 'pass', complexity: { findings: [] }, dead_code: {} })

// `runBuildGate` archives a failing build's log under the real repo root
// (not the injected `root`) the same way it did before #432 — clean it up so
// a failing-build test here never leaves a stray archive/ dir behind.
const TEST_DATE = '1999-12-31'
afterEach(() => {
  rmSync(path.join(ROOT, 'archive', TEST_DATE), { recursive: true, force: true })
})

/**
 * Seeds a temp tree that `validateGenerated` and `validateBuildOutput` can
 * both run against for real: a healthy `dist/client` (shell, JS/CSS bundles,
 * a pinned CSP meta) plus a minimal, reachable component tree.
 *
 * `violate: true` (the default) puts a `dangerouslySetInnerHTML` use and a
 * bare type error in `Sidebar.tsx` — the pre-build security scan catches the
 * former for real; the latter exists for the fixture to read true (a fake
 * `tsc` reports it, since nothing here actually runs the compiler).
 */
function seedRoot(root, { violate = true } = {}) {
  const distClient = path.join(root, 'dist', 'client')
  const assets = path.join(distClient, 'assets')
  mkdirSync(assets, { recursive: true })
  mkdirSync(path.join(root, 'app', 'routes'), { recursive: true })
  mkdirSync(path.join(root, 'app', 'components'), { recursive: true })
  mkdirSync(path.join(root, 'app', 'content'), { recursive: true })
  mkdirSync(path.join(root, 'styled-system', 'tokens'), { recursive: true })

  writeFileSync(
    path.join(distClient, '_shell.html'),
    '<!doctype html><html><head>' +
      `<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'sha256-${'a'.repeat(44)}'">` +
      `</head><body>${'x'.repeat(600)}<script type="module" src="/assets/app.js"></script></body></html>`
  )
  writeFileSync(path.join(assets, 'app.js'), 'console.log("app")')
  writeFileSync(path.join(assets, 'app.css'), '.filler{color:red}'.repeat(200))

  writeFileSync(
    path.join(root, 'styled-system', 'tokens', 'index.mjs'),
    'export const tokens = {\n' +
      '  "spacing.1": { "value": "4px" },\n' +
      '  "sizes.full": { "value": "100%" }\n' +
      '}\n'
  )

  writeFileSync(
    path.join(root, 'app', 'content', 'about.ts'),
    "export const identity = { email: 'doug@example.com' }\n"
  )

  writeFileSync(
    path.join(root, 'app', 'routes', 'index.tsx'),
    "import { Sidebar } from '../components/Sidebar'\n" +
      "import { SiteCallout } from '../components/SiteCallout'\n" +
      'export function Index() { return <><Sidebar /><SiteCallout /></> }\n'
  )

  const sidebar = violate
    ? [
        'export function Sidebar() {',
        "  const total: number = 'not-a-number'",
        '  return (',
        '    <div>',
        '      <a href="mailto:doug@example.com">Say hi</a>',
        "      <div dangerouslySetInnerHTML={{ __html: '<b>hi</b>' }} />",
        '      <span>{total}</span>',
        '    </div>',
        '  )',
        '}',
        '',
      ].join('\n')
    : [
        'export function Sidebar() {',
        '  return (',
        '    <div>',
        '      <a href="mailto:doug@example.com">Say hi</a>',
        '    </div>',
        '  )',
        '}',
        '',
      ].join('\n')
  writeFileSync(path.join(root, 'app', 'components', 'Sidebar.tsx'), sidebar)
}

/** A `spawn` stand-in that answers `pnpm build` and the three static-check tools. */
function fakeSpawn({
  build = { status: 0, stdout: '', stderr: '' },
  biome = { status: 0, stdout: 'Checked 2 files in 3ms.', stderr: '' },
  tsc = { status: 0, stdout: '', stderr: '' },
  fallow = { status: 0, stdout: FALLOW_PASS, stderr: '' },
} = {}) {
  return vi.fn((_cmd, args) => {
    if (args[0] === 'build') return build
    const tool = args[1]
    return tool === 'biome' ? biome : tool === 'tsc' ? tsc : fallow
  })
}

describe('validateBuild reports every failing gate together (#432)', () => {
  it('reports the pre-build security-scan failure and the tsc failure together, in gate order, heading count 2', async () => {
    const root = await tempDir('dm-validate-build-')
    seedRoot(root, { violate: true })
    const spawn = fakeSpawn({
      tsc: {
        status: 2,
        stdout:
          "app/components/Sidebar.tsx(2,9): error TS2322: Type 'string' is not assignable to type 'number'.",
        stderr: '',
      },
    })

    const result = validateBuild({ root, date: TEST_DATE, spawn })

    expect(result.success).toBe(false)
    expect(result.error).toContain('2 of 4 gates failed:')
    expect(result.error).toContain(
      'app/components/Sidebar.tsx: contains dangerouslySetInnerHTML (blocks XSS)'
    )
    expect(result.error).toContain('Type errors (tsc --noEmit)')
    // identifyFailingAgent matches FILE_OWNERSHIP paths by substring, so the
    // path tsc reported must survive into the report verbatim.
    expect(result.error).toContain(
      "app/components/Sidebar.tsx(2,9): error TS2322: Type 'string' is not assignable to type 'number'."
    )

    // Gate order: Pre-build validation, then pnpm build, then the smoke
    // checks, then the static-check sections.
    const securityIndex = result.error.indexOf('dangerouslySetInnerHTML')
    const tscIndex = result.error.indexOf('Type errors (tsc --noEmit)')
    expect(securityIndex).toBeGreaterThan(-1)
    expect(tscIndex).toBeGreaterThan(securityIndex)

    // pnpm build and the smoke checks both passed — neither gate's section
    // appears in the report.
    expect(result.error).not.toContain('pnpm build:')
    expect(result.error).not.toContain('skipped, the build did not produce output')
  })

  it('passes cleanly when every gate passes', async () => {
    const root = await tempDir('dm-validate-build-')
    seedRoot(root, { violate: false })
    const spawn = fakeSpawn()

    const result = validateBuild({ root, date: TEST_DATE, spawn })

    expect(result).toEqual({ success: true })
  })

  it('reports pre-build and pnpm build failures together, with the smoke checks marked skipped', async () => {
    const root = await tempDir('dm-validate-build-')
    seedRoot(root, { violate: true })
    const spawn = fakeSpawn({
      build: { status: 1, stdout: 'Error: build broke\nsome trailing detail\n', stderr: '' },
    })

    const result = validateBuild({ root, date: TEST_DATE, spawn })

    expect(result.success).toBe(false)
    expect(result.error).toContain('2 of 4 gates failed:')
    expect(result.error).toContain(
      'app/components/Sidebar.tsx: contains dangerouslySetInnerHTML (blocks XSS)'
    )
    expect(result.error).toContain('Error: build broke')
    expect(result.error).toContain(
      'build output smoke checks: skipped, the build did not produce output'
    )
    // Static checks passed this time — no static-check section in the report.
    expect(result.error).not.toContain('Type errors (tsc --noEmit)')

    const preIndex = result.error.indexOf('Pre-build validation:')
    const buildIndex = result.error.indexOf('pnpm build:')
    const skipIndex = result.error.indexOf('skipped, the build did not produce output')
    expect(preIndex).toBeGreaterThan(-1)
    expect(buildIndex).toBeGreaterThan(preIndex)
    expect(skipIndex).toBeGreaterThan(buildIndex)
  })
})

// The 2026-09-20 shape: `pnpm build` exits 0 and prints one line per archived
// page from pin-inline-scripts, then the token gate rejects a value. The tail
// of that log is 35 lines of noise about pages nobody touched.
const PIN_NOISE = Array.from(
  { length: 35 },
  (_, i) => `how/2026-07-${String(i + 1).padStart(2, '0')}/index.html: 3 hashes`
).join('\n')
const PIN_BUILD = {
  status: 0,
  stdout: `vite build\n[pin-inline-scripts] pinning\n${PIN_NOISE}\n[pin-inline-scripts] pinned 143 file(s)\n`,
  stderr: '',
}
const TAIL_MARKER = 'last 1500 chars of build output'

/** A healthy tree whose one component uses a bare number the spacing scale lacks. */
function seedTokenFailure(root) {
  seedRoot(root, { violate: false })
  writeFileSync(
    path.join(root, 'app', 'components', 'Sidebar.tsx'),
    "export function Sidebar() { return <div className={css({ width: '11' })} /> }\n"
  )
}

describe('the smoke-check failure carries the build log only when it helps', () => {
  it('leaves the tail off a token failure: the report names the value and nothing else', async () => {
    const root = await tempDir('dm-validate-build-')
    seedTokenFailure(root)

    const result = validateBuild({ root, date: TEST_DATE, spawn: fakeSpawn({ build: PIN_BUILD }) })

    expect(result.success).toBe(false)
    expect(result.error).toContain('Build output smoke check failed:')
    expect(result.error).toContain("width: '11'")
    expect(result.error).not.toContain(TAIL_MARKER)
    expect(result.error).not.toContain('3 hashes')
  })

  it('keeps the tail when the build output has no shell', async () => {
    const root = await tempDir('dm-validate-build-')
    seedTokenFailure(root)
    rmSync(path.join(root, 'dist', 'client', '_shell.html'))

    const result = validateBuild({ root, date: TEST_DATE, spawn: fakeSpawn({ build: PIN_BUILD }) })

    expect(result.error).toContain('dist/client/_shell.html and index.html are both missing')
    expect(result.error).toContain(TAIL_MARKER)
    expect(result.error).toContain('3 hashes')
  })

  it('keeps the tail when dist/client is empty', async () => {
    const root = await tempDir('dm-validate-build-')
    seedTokenFailure(root)
    rmSync(path.join(root, 'dist', 'client'), { recursive: true })
    mkdirSync(path.join(root, 'dist', 'client'), { recursive: true })

    const result = validateBuild({ root, date: TEST_DATE, spawn: fakeSpawn({ build: PIN_BUILD }) })

    expect(result.error).toContain('dist/client/ is empty')
    expect(result.error).toContain(TAIL_MARKER)
  })

  it('keeps the tail, and the runtime lines, when the log shows a crashed prerender', async () => {
    const root = await tempDir('dm-validate-build-')
    seedTokenFailure(root)
    const build = {
      ...PIN_BUILD,
      stdout: `Unhandled rejection: Failed to fetch /: Internal Server Error\n${PIN_BUILD.stdout}`,
    }

    const result = validateBuild({ root, date: TEST_DATE, spawn: fakeSpawn({ build }) })

    expect(result.error).toContain('the app crashed during prerender')
    expect(result.error).toContain('Unhandled rejection: Failed to fetch /')
    expect(result.error).toContain(TAIL_MARKER)
  })
})

describe('validateBuild uses the root it is given for the build (#579)', () => {
  it('runs pnpm build in that root, and writes a failing build log under it', async () => {
    const root = await tempDir('dm-validate-build-')
    seedRoot(root, { violate: false })
    const spawn = fakeSpawn({ build: { status: 1, stdout: 'Error: build broke\n', stderr: '' } })

    validateBuild({ root, date: TEST_DATE, spawn })

    const buildCall = spawn.mock.calls.find(([, args]) => args[0] === 'build')
    expect(buildCall[2].cwd).toBe(root)
    expect(
      readFileSync(path.join(root, 'archive', TEST_DATE, 'last-build-output.txt'), 'utf8')
    ).toBe('Error: build broke\n')
    expect(existsSync(path.join(ROOT, 'archive', TEST_DATE))).toBe(false)
  })
})
