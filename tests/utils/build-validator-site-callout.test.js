import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { validateGenerated } from '../../scripts/utils/build-validator.js'
import { renderSiteCalloutFile } from '../../scripts/utils/site-callout.js'

// biome-ignore lint/suspicious/noTemplateCurlyInString: the fixture must carry the literal interpolation; the validator reads it as source text.
const MAILTO_HREF = '{`mailto:${identity.email}`}'

/**
 * The minimal tree build-validator-material.test.js seeds, with a home route,
 * so a failure here is a callout failure and nothing else.
 */
function seedRepo() {
  const root = mkdtempSync(path.join(tmpdir(), 'callout-validator-'))
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
  writeFileSync(
    path.join(root, 'app/components/Layout.tsx'),
    [
      "import { identity } from '../content/about'",
      'export function Layout({ children }: { children: React.ReactNode }) {',
      `  return (<div><a href=${MAILTO_HREF}>mail</a>{children}</div>)`,
      '}',
    ].join('\n')
  )
  writeFileSync(
    path.join(root, 'app/components/SiteCallout.tsx'),
    renderSiteCalloutFile({ date: '2026-09-20', archiveCount: 141 })
  )
  return root
}

function writeHome(root, { importLine, body }) {
  writeFileSync(
    path.join(root, 'app/routes/index.tsx'),
    [importLine, 'export function Home() {', `  return (<>${body}</>)`, '}'].join('\n')
  )
}

/** Findings about the callout, so an unrelated check cannot pass a test. */
function calloutErrors(result) {
  if (result.success) return []
  return result.error
    .split('\n')
    .filter((line) => /SiteCallout/.test(line))
    .map((line) => line.trim())
}

describe('validateGenerated, the home page callout (#532)', () => {
  let root
  beforeEach(() => {
    root = seedRepo()
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('passes a home route that places the callout', () => {
    writeHome(root, {
      importLine: "import { SiteCallout } from '../components/SiteCallout'",
      body: '<h1>hero</h1><SiteCallout /><footer />',
    })
    expect(calloutErrors(validateGenerated({ root, shell: null }))).toEqual([])
  })

  it('fails the build when the home route leaves it out', () => {
    writeHome(root, { importLine: '', body: '<h1>hero</h1><footer />' })
    const result = validateGenerated({ root, shell: null })
    expect(result.success).toBe(false)
    expect(calloutErrors(result).join('\n')).toMatch(
      /app\/routes\/index\.tsx: does not render <SiteCallout \/>/
    )
  })

  it('fails an import that is never rendered', () => {
    writeHome(root, {
      importLine: "import { SiteCallout } from '../components/SiteCallout'",
      body: '<h1>hero</h1>',
    })
    expect(calloutErrors(validateGenerated({ root, shell: null }))).toHaveLength(1)
  })

  it("fails the engineer's own component of the same name", () => {
    writeFileSync(
      path.join(root, 'app/components/generated/SiteCallout.tsx'),
      'export const SiteCallout = () => <aside>A pipeline rebuilt this.</aside>\n'
    )
    writeHome(root, {
      importLine: "import { SiteCallout } from '../components/generated/SiteCallout'",
      body: '<h1>hero</h1><SiteCallout />',
    })
    expect(calloutErrors(validateGenerated({ root, shell: null }))).toHaveLength(1)
  })
})
