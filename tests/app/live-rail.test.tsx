import { readFileSync } from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LiveRail } from '../../app/components/LiveRail'
import { liveRail, railMonthDay } from '../../app/content/rail'
import { contrastRatio } from '../../scripts/utils/contrast.js'

/**
 * The live rail (#702). Its colours are fixed, not the day's, so they are
 * pinned here and their contrast is checked once, against the values
 * panda.config.ts gives the `archive.*` tokens. The surface gate's contrast
 * check measures the page every night as well, but a rail that failed it would
 * fail every night, and the engineer could not fix it.
 */

const read = (rel: string) => readFileSync(path.join(process.cwd(), rel), 'utf8')
/** The component's code, with its comments taken out: they cite issue numbers like #702. */
const source = read('app/components/LiveRail.tsx')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')
const pandaConfig = read('panda.config.ts')

type Rgb = { r: number; g: number; b: number }

/** `archive.<name>` as panda.config.ts defines it, read from the source. */
function archiveToken(name: string): string {
  const group = pandaConfig.slice(pandaConfig.indexOf('archive: {'))
  const hex = new RegExp(`\\b${name}: \\{ value: '(#[0-9a-fA-F]{6})' \\}`).exec(group)?.[1]
  if (!hex) throw new Error(`archive.${name} not found in panda.config.ts`)
  return hex.toLowerCase()
}

function hexToRgb(hex: string): Rgb {
  const n = Number.parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

/** A white wash at `alpha` laid over `ground`. */
function washOver(ground: Rgb, alpha: number): Rgb {
  const mix = (c: number) => c + (255 - c) * alpha
  return { r: mix(ground.r), g: mix(ground.g), b: mix(ground.b) }
}

describe('the rail sets every colour it uses, and nothing else', () => {
  it('names exactly these tokens', () => {
    const tokens = new Set(source.match(/'archive\.\w+'/g))
    expect([...tokens].sort()).toEqual(["'archive.bg'", "'archive.dim'", "'archive.text'"])
  })

  it('and exactly these literals', () => {
    const literals = new Set(source.match(/rgba\([^)]*\)|#[0-9a-fA-F]{3,8}\b/g))
    expect([...literals].sort()).toEqual([
      '#f4f4f5',
      'rgba(255, 255, 255, 0.14)',
      'rgba(255, 255, 255, 0.24)',
    ])
  })

  it('reads no colour from the day: no semantic token appears in a colour property', () => {
    const colourValues = [
      ...source.matchAll(/\b(?:color|background|borderColor|bg)\s*:\s*'([^']+)'/g),
    ].map((m) => m[1])
    for (const value of colourValues) {
      expect(value, `rail colour ${value}`).toMatch(/^(?:archive\.\w+|transparent|rgba\(.*\))$/)
    }
  })

  it('sits on the archive ground, the same #0e0e10 the archive rail and surfaces use', () => {
    expect(archiveToken('bg')).toBe('#0e0e10')
    expect(archiveToken('text')).toBe('#e8e8ea')
    expect(archiveToken('dim')).toBe('#8a8a93')
  })
})

describe('every text colour clears 4.5:1 on the ground it sits on', () => {
  const bg = hexToRgb(archiveToken('bg'))
  const text = hexToRgb(archiveToken('text'))
  const dim = hexToRgb(archiveToken('dim'))

  it.each([
    ['labels and links on the rail', text, bg],
    ['the note on the rail', dim, bg],
    ['a link on its hover wash', text, washOver(bg, 0.14)],
  ])('%s', (_name, fg, ground) => {
    expect(contrastRatio(fg, ground)).toBeGreaterThanOrEqual(4.5)
  })

  it('the focus ring clears 3:1, the floor for a non-text indicator', () => {
    expect(contrastRatio(hexToRgb('#f4f4f5'), bg)).toBeGreaterThanOrEqual(3)
  })
})

describe('the markup', () => {
  const html = renderToStaticMarkup(
    <LiveRail date="2026-10-06" prevDate="2026-10-05" archiveCount={157} />
  )

  it('is one div carrying the marker, with no div inside it, so stripLiveFrame can cut it', () => {
    expect(html.startsWith('<div data-live-frame="2026-10-06"')).toBe(true)
    expect(html.match(/<div\b/g)).toHaveLength(1)
    expect(html.indexOf('</div>')).toBe(html.length - '</div>'.length)
  })

  it('holds only spans and anchors', () => {
    const tags = new Set([...html.matchAll(/<(\w+)\b/g)].map((m) => m[1]))
    expect([...tags].sort()).toEqual(['a', 'div', 'span'])
  })

  it('links the archive, the previous design, the white paper and the explainer', () => {
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
    expect(hrefs).toEqual([
      '/archive',
      '/archive/2026-10-05/',
      '/work/dougmar-ch',
      '/how/2026-10-06',
    ])
  })

  it('puts the white paper before the explainer', () => {
    expect(html.indexOf(liveRail.whitePaper.long)).toBeLessThan(html.indexOf(liveRail.how.long))
  })

  it('carries both forms of every label', () => {
    for (const text of [
      'Archive · 157 designs',
      'Archive',
      'Today, October 6',
      'Today',
      'A new design ships every morning.',
      'Read the white paper',
      'White paper',
      'How it was made',
      'How',
    ]) {
      expect(html).toContain(text)
    }
  })

  it('renders no arrow when there is no previous design', () => {
    const first = renderToStaticMarkup(
      <LiveRail date="2026-03-16" prevDate={null} archiveCount={1} />
    )
    expect(first).not.toContain('/archive/2')
    expect(first).not.toContain('‹')
  })

  it('carries no data-archive-link, so the footer link counts are unchanged', () => {
    expect(html).not.toContain('data-archive-link')
  })
})

describe('the date', () => {
  it.each([
    ['2026-10-06', 'October 6'],
    ['2026-01-01', 'January 1'],
    ['2026-12-31', 'December 31'],
  ])('%s reads %s, from the string, with no timezone in the way', (date, label) => {
    expect(railMonthDay(date)).toBe(label)
  })

  it('refuses something that is not a date', () => {
    expect(() => railMonthDay('2026-13-01')).toThrow(/YYYY-MM-DD/)
    expect(() => railMonthDay('soon')).toThrow(/YYYY-MM-DD/)
  })
})

describe('the rail stays out of the way', () => {
  it('is never fixed or sticky', () => {
    expect(source).not.toMatch(/position:\s*'(?:fixed|sticky)'/)
  })

  it('passes css() nothing but literals (PR #525)', () => {
    // Every css({...}) argument is an object literal; none is built from a
    // variable, a template literal, or a call.
    for (const m of source.matchAll(/\bcss\(([^{])/g)) {
      throw new Error(`css() called with a non-literal argument starting ${m[1]}`)
    }
    expect(source).not.toMatch(/:\s*`/)
  })
})
