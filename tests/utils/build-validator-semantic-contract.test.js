import { describe, it, expect, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { validateGenerated } from '../../scripts/utils/build-validator.js'
import { SEMANTIC_COLOR_NAMES } from '../../scripts/utils/semantic-contract.js'

/** A preset declaring the given semantic colour names and nothing else. */
function preset(names) {
  const entries = names
    .map(
      (n) => `        ${n}: { value: { base: '{colors.sand.900}', _light: '{colors.sand.50}' } },`
    )
    .join('\n')
  return `import { definePreset } from '@pandacss/dev'
export const elementsPreset = definePreset({
  name: 'elements',
  theme: {
    tokens: { colors: { sand: { 50: { value: '#fff' }, 900: { value: '#000' } } } },
    semanticTokens: {
      colors: {
${entries}
      },
    },
  },
})`
}

/**
 * A minimal tree that satisfies every other check in validateGenerated, so a
 * failure here is a semantic-contract failure and nothing else. `shell` is left
 * null, which skips the declared-lockup rule.
 */
function seedRepo({ presetNames = SEMANTIC_COLOR_NAMES, layoutColor = 'text' } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'contract-validator-'))
  mkdirSync(path.join(root, 'elements'), { recursive: true })
  mkdirSync(path.join(root, 'app/components'), { recursive: true })
  mkdirSync(path.join(root, 'app/routes'), { recursive: true })
  mkdirSync(path.join(root, 'app/content'), { recursive: true })

  writeFileSync(path.join(root, 'elements/preset.ts'), preset(presetNames))
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
      "import { css } from '../../styled-system/css'",
      'export function Layout({ children }: { children: React.ReactNode }) {',
      `  return (<div className={css({ color: '${layoutColor}' })}>`,
      // biome-ignore lint/suspicious/noTemplateCurlyInString: the fixture must carry the literal interpolation; the validator reads it as source text.
      '      <a href={`mailto:${identity.email}`}>mail</a>',
      '      {children}',
      '    </div>)',
      '}',
    ].join('\n')
  )
  return root
}

/** Only the findings this check produces, so an unrelated one cannot pass a test. */
function contractErrors(result) {
  if (result.success) return []
  return result.error
    .split('\n')
    .filter((line) => /frozen|semanticTokens\.colors/.test(line))
    .map((line) => line.trim())
}

describe('validateGenerated — the frozen semantic contract (#255)', () => {
  let root
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true })
    root = null
  })

  it('passes a preset defining the contract and TSX naming only the contract', () => {
    root = seedRepo()
    expect(contractErrors(validateGenerated({ root }))).toEqual([])
  })

  it('fails when the preset omits a canonical name', () => {
    root = seedRepo({ presetNames: SEMANTIC_COLOR_NAMES.filter((n) => n !== 'textFaint') })
    const errors = contractErrors(validateGenerated({ root }))
    expect(errors.join('\n')).toMatch(/missing textFaint/)
  })

  it('fails when the preset invents a name, which is the drift itself', () => {
    root = seedRepo({ presetNames: [...SEMANTIC_COLOR_NAMES, 'surfaceQuiet'] })
    const errors = contractErrors(validateGenerated({ root }))
    expect(errors.join('\n')).toMatch(/defines surfaceQuiet/)
  })

  it('fails on a raw palette step in an engineer-owned reachable file', () => {
    root = seedRepo({ layoutColor: 'sand.300' })
    const errors = contractErrors(validateGenerated({ root }))
    expect(errors.join('\n')).toMatch(/app\/components\/Layout\.tsx.*sand\.300/)
  })

  it('fails on an off-contract semantic name too', () => {
    root = seedRepo({ layoutColor: 'textSecondary' })
    const errors = contractErrors(validateGenerated({ root }))
    expect(errors.join('\n')).toMatch(/textSecondary/)
  })

  it('does not block on an orphan component no route reaches (#216)', () => {
    root = seedRepo()
    writeFileSync(
      path.join(root, 'app/components/Ledger.tsx'),
      "export const Ledger = () => <div className={css({ color: 'sand.600' })} />"
    )
    const errors = contractErrors(validateGenerated({ root }))
    expect(errors.join('\n')).not.toMatch(/Ledger/)
  })

  it('does not block on a reachable file the nightly agents do not own', () => {
    root = seedRepo()
    writeFileSync(
      path.join(root, 'app/components/ArchiveMarkdown.tsx'),
      "export const ArchiveMarkdown = () => <div className={css({ color: 'archive.dim' })} />"
    )
    writeFileSync(
      path.join(root, 'app/routes/archive.tsx'),
      [
        "import { ArchiveMarkdown } from '../components/ArchiveMarkdown'",
        'export const Route = { component: () => <ArchiveMarkdown /> }',
      ].join('\n')
    )
    const errors = contractErrors(validateGenerated({ root }))
    expect(errors.join('\n')).not.toMatch(/ArchiveMarkdown|archive\.dim/)
  })

  it('leaves raw CSS alone', () => {
    root = seedRepo({ layoutColor: '#ff0000' })
    expect(contractErrors(validateGenerated({ root }))).toEqual([])
  })
})
