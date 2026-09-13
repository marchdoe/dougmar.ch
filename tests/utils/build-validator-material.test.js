import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { validateGenerated } from '../../scripts/utils/build-validator.js'
import { renderBrandLockupFile } from '../../scripts/utils/brand-lockup.js'
import { renderMaterialFile } from '../../scripts/utils/material.js'

// biome-ignore lint/suspicious/noTemplateCurlyInString: the fixture must carry the literal interpolation; the validator reads it as source text.
const MAILTO_HREF = '{`mailto:${identity.email}`}'

/**
 * The same minimal tree build-validator-brand-lockup.test.js seeds, plus the
 * generated Material.tsx, so a failure here is a material failure and nothing
 * else.
 */
function seedRepo() {
  const root = mkdtempSync(path.join(tmpdir(), 'material-validator-'))
  mkdirSync(path.join(root, 'elements'), { recursive: true })
  mkdirSync(path.join(root, 'app/components/generated'), { recursive: true })
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
  writeLayout(
    root,
    "import { Ground } from './Material'",
    '<Ground material="grain" seed={4242} />'
  )
  writeFileSync(
    path.join(root, 'app/components/BrandLockup.tsx'),
    renderBrandLockupFile({ fonts: { display: { weights: [400] } } })
  )
  writeFileSync(path.join(root, 'app/components/Material.tsx'), renderMaterialFile())
  return root
}

function writeLayout(root, extraImport, hero) {
  writeFileSync(
    path.join(root, 'app/components/Layout.tsx'),
    [
      "import { identity } from '../content/about'",
      "import { BrandLockup } from './BrandLockup'",
      extraImport,
      'export function Layout({ children }: { children: React.ReactNode }) {',
      '  return (',
      '    <div>',
      '      <BrandLockup variant="horizontal-md" mode="single-color" />',
      `      <section>${hero}</section>`,
      `      <a href=${MAILTO_HREF}>mail</a>`,
      '      {children}',
      '    </div>',
      '  )',
      '}',
    ].join('\n')
  )
}

/** Findings mentioning the material, so an unrelated check cannot pass a test. */
function materialErrors(result) {
  if (result.success) return []
  return result.error
    .split('\n')
    .filter((line) => /feTurbulence|Material\.tsx/.test(line))
    .map((line) => line.trim())
}

describe('validateGenerated, the material library (#505)', () => {
  let root
  beforeEach(() => {
    root = seedRepo()
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('passes a tree where only Material.tsx synthesizes a material', () => {
    const result = validateGenerated({ root, shell: { brand_lockup: 'horizontal-md' } })
    expect(materialErrors(result)).toEqual([])
  })

  it('rejects an feTurbulence in a file the engineer wrote', () => {
    writeLayout(
      root,
      '',
      '<svg><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" /></filter></svg>'
    )
    const errors = materialErrors(validateGenerated({ root, shell: null }))
    expect(errors.join('\n')).toMatch(
      /Layout\.tsx: defines its own feTurbulence, and material is owned by app\/components\/Material\.tsx/
    )
  })

  it('catches it in a generated component a route reaches', () => {
    writeFileSync(
      path.join(root, 'app/components/generated/Grain.tsx'),
      [
        'export function Grain() {',
        '  return <svg><filter><feTurbulence baseFrequency="0.7" /></filter></svg>',
        '}',
      ].join('\n')
    )
    writeLayout(root, "import { Grain } from './generated/Grain'", '<Grain />')
    expect(materialErrors(validateGenerated({ root, shell: null })).join('\n')).toMatch(
      /generated\/Grain\.tsx: defines its own feTurbulence/
    )
  })

  it('ignores an orphan file no route reaches', () => {
    writeFileSync(
      path.join(root, 'app/components/generated/Orphan.tsx'),
      'export const o = <feTurbulence />\n'
    )
    expect(materialErrors(validateGenerated({ root, shell: null }))).toEqual([])
  })
})
