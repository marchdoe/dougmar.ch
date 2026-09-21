import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { validateBuildOutput } from '../../scripts/utils/build-validator.js'
import { ROOT } from '../../scripts/utils/file-manager.js'

/**
 * `validateBuildOutput` used to hardcode `resolve(ROOT, 'dist/client')` and
 * pass `root: ROOT` straight into `checkTokenResolution`, ignoring any root a
 * caller injected (#312). A test could not point either check at a temp tree
 * — they always read the real repo's `dist/client`, which does not exist in
 * this checkout, so the token-resolution check silently no-opped instead of
 * reporting anything.
 *
 * This seeds a complete fake build — a healthy shell, JS and CSS bundles, and
 * a component tree reachable from `app/routes` — in a temp directory, with a
 * bogus `width: '11'` in the one MUTABLE file it reaches. If `root` is
 * actually threaded through, the check reads that temp tree and reports it.
 */
function seedBuild() {
  const root = mkdtempSync(path.join(tmpdir(), 'build-validator-root-'))
  const distClient = path.join(root, 'dist', 'client')
  const assets = path.join(distClient, 'assets')
  mkdirSync(assets, { recursive: true })
  mkdirSync(path.join(root, 'app', 'routes'), { recursive: true })
  mkdirSync(path.join(root, 'app', 'components'), { recursive: true })
  mkdirSync(path.join(root, 'styled-system', 'tokens'), { recursive: true })

  writeFileSync(
    path.join(distClient, '_shell.html'),
    `<!doctype html><html><head></head><body>${'x'.repeat(600)}<script type="module" src="/assets/app.js"></script></body></html>`
  )
  writeFileSync(path.join(assets, 'app.js'), 'console.log("app")')
  // Padded well past the 2KB floor with harmless, fully-resolved CSS.
  writeFileSync(path.join(assets, 'app.css'), '.filler{color:red}'.repeat(200))

  // No numeric spacing or sizes key, matching the real preset's shape — a
  // bare number on either scale is a miss.
  writeFileSync(
    path.join(root, 'styled-system', 'tokens', 'index.mjs'),
    'export const tokens = {\n' +
      '  "spacing.1": { "value": "4px" },\n' +
      '  "sizes.full": { "value": "100%" }\n' +
      '}\n'
  )

  writeFileSync(
    path.join(root, 'app', 'routes', 'index.tsx'),
    "import { Sidebar } from '../components/Sidebar'\nexport function Index() { return <Sidebar /> }\n"
  )
  writeFileSync(
    path.join(root, 'app', 'components', 'Sidebar.tsx'),
    "export function Sidebar() { return <div className={css({ width: '11' })} /> }\n"
  )

  return root
}

describe('validateBuildOutput reads the injected root (#312)', () => {
  let root
  beforeEach(() => {
    root = seedBuild()
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('reports a bare-number miss from the temp tree, not the real repo', () => {
    // Whether this checkout has been built is not this test's business, but
    // whether validating changed that is. Asserting `false` here made the
    // suite unrunnable after `pnpm build` — which is exactly when the nightly
    // now runs it, so the assertion became a lie about the environment rather
    // than a fact about the code.
    const distBefore = existsSync(path.join(ROOT, 'dist', 'client'))

    const result = validateBuildOutput({ root })
    expect(result.success).toBe(false)

    // `width: '11'` is seeded only in the temp tree, so matching it is itself
    // the proof that the injected root was read rather than this checkout.
    expect(result.errors.join('\n')).toContain("width: '11'")

    // And the other half: seeding and validating left the real repo alone.
    expect(existsSync(path.join(ROOT, 'dist', 'client'))).toBe(distBefore)
  })
})

describe('validateBuildOutput carries the spacing-string finding to the engineer (#553)', () => {
  let root
  beforeEach(() => {
    root = seedBuild()
    // Replace the bare-number miss with the shape that shipped in experiments.tsx.
    writeFileSync(
      path.join(root, 'app', 'components', 'Sidebar.tsx'),
      "export function Sidebar() {\n  return <div className={css({ padding: '3 4' })} />\n}\n"
    )
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('fails the build and puts the line and the corrected form in the error', () => {
    const result = validateBuildOutput({ root })
    expect(result.success).toBe(false)
    const errors = result.errors.join('\n')
    expect(errors).toContain('app/components/Sidebar.tsx:2')
    expect(errors).toContain("padding: '3 4'")
    expect(errors).toContain("paddingBlock: '3', paddingInline: '4'")
  })
})

describe('validateBuildOutput blocks on a generated component the engineer wrote (#614)', () => {
  let root
  beforeEach(() => {
    root = seedBuild()
    // The hand-listed file is clean; the fault is in a component the engineer
    // invented under app/components/generated/, which MUTABLE_FILES cannot
    // name. On 2026-09-21 the gate warned on exactly this and let the build
    // through, and `pnpm test` failed the run on the same line.
    writeFileSync(
      path.join(root, 'app', 'components', 'Sidebar.tsx'),
      "export function Sidebar() { return <div className={css({ width: 'full' })} /> }\n"
    )
    mkdirSync(path.join(root, 'app', 'components', 'generated'), { recursive: true })
    writeFileSync(
      path.join(root, 'app', 'components', 'generated', 'PersonalStrip.tsx'),
      "export function PersonalStrip() {\n  return <div className={css({ padding: '4 0' })} />\n}\n"
    )
    writeFileSync(
      path.join(root, 'app', 'routes', 'index.tsx'),
      "import { Sidebar } from '../components/Sidebar'\n" +
        "import { PersonalStrip } from '../components/generated/PersonalStrip'\n" +
        'export function Index() { return <><Sidebar /><PersonalStrip /></> }\n'
    )
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('fails the build with the generated file, its line and the corrected form', () => {
    const result = validateBuildOutput({ root })
    expect(result.success).toBe(false)
    const errors = result.errors.join('\n')
    expect(errors).toContain('app/components/generated/PersonalStrip.tsx:2')
    expect(errors).toContain("padding: '4 0'")
    expect(errors).toContain("paddingBlock: '4', paddingInline: '0'")
  })
})
