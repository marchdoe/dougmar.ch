// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BrandLockup } from '../../app/components/BrandLockup'

/**
 * The lockup's colour mode: full colour by default (owner, 2026-10-18), and
 * one mode per scheme when the header's ground passes the contrast test in
 * one scheme and fails it in the other (owner, 2026-10-19). Rendered to
 * static markup and read back as DOM, the way the gates see it.
 */

function marks(element: React.ReactElement) {
  const doc = new DOMParser().parseFromString(renderToStaticMarkup(element), 'text/html')
  return [...doc.querySelectorAll('svg[data-brand-mark]')].map((svg) => ({
    mode: svg.getAttribute('data-brand-mode'),
    scheme: svg.getAttribute('data-brand-scheme'),
    classes: (svg.getAttribute('class') ?? '').split(/\s+/),
    labelled: svg.getAttribute('aria-label'),
  }))
}

describe('BrandLockup colour mode', () => {
  it('renders the full-colour mark when no mode is passed', () => {
    const [mark, ...rest] = marks(<BrandLockup />)
    expect(rest).toHaveLength(0)
    expect(mark).toMatchObject({ mode: 'original', scheme: null })
  })

  it('renders one mark in a bare mode, shown in both schemes', () => {
    const shown = marks(<BrandLockup mode="single-color" />)
    expect(shown).toHaveLength(1)
    expect(shown[0]).toMatchObject({ mode: 'single-color', scheme: null })
    expect(shown[0].classes).toContain('d_block')
  })

  it('renders one mark per scheme, each hidden in the other scheme', () => {
    const [light, dark, ...rest] = marks(
      <BrandLockup variant="mark-only-md" mode={{ light: 'original', dark: 'single-color' }} />
    )
    expect(rest).toHaveLength(0)
    expect(light).toMatchObject({ mode: 'original', scheme: 'light' })
    expect(dark).toMatchObject({ mode: 'single-color', scheme: 'dark' })
    // Hidden at base, shown under the `.light` class, and the reverse.
    expect(light.classes).toEqual(expect.arrayContaining(['d_none', 'light:d_block']))
    expect(dark.classes).toEqual(expect.arrayContaining(['d_block', 'light:d_none']))
    // mark-only-md labels its mark; the hidden twin is display:none, so one name reaches AT.
    expect(light.labelled).toBe('Doug March logo')
    expect(dark.labelled).toBe('Doug March logo')
  })

  it('collapses a per-scheme mode whose schemes agree to one mark', () => {
    const shown = marks(<BrandLockup mode={{ light: 'original', dark: 'original' }} />)
    expect(shown).toHaveLength(1)
    expect(shown[0]).toMatchObject({ mode: 'original', scheme: null })
  })

  it('keeps the template and the generated component in step on the mode', () => {
    const read = (rel: string) => readFileSync(path.join(process.cwd(), rel), 'utf8')
    const template = read('scripts/templates/BrandLockup.tsx.template')
    const component = read('app/components/BrandLockup.tsx')
    for (const source of [template, component]) {
      expect(source).toContain("mode = 'original',")
      expect(source).toContain('mode?: BrandLockupMode | BrandLockupSchemeModes')
    }
  })
})
