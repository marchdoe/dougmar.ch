/**
 * `compareLayouts` (pure, no browser) and the normalization/matching
 * helpers it's built from. The DOM half — `extractTextSegments` itself —
 * lives in mockup-fidelity-dom.test.js, against real Chromium.
 */
import { describe, expect, it } from 'vitest'
import {
  compareLayouts,
  compareMockupLayout,
  matchKey,
  normalizeText,
} from '../../scripts/utils/mockup-fidelity.js'

/** A fixture segment, shaped like extractTextSegments()'s output. */
function seg(text, fontSize, opts = {}) {
  const {
    x = 0,
    y = 0,
    w = Math.max(20, text.length * fontSize * 0.55),
    h = fontSize * 1.2,
    opacity = 1,
    visibleFraction = 1,
    fontFamily = 'Body',
    fontWeight = '400',
  } = opts
  return { text, fontSize, fontWeight, fontFamily, rect: { x, y, w, h }, opacity, visibleFraction }
}

const VIEWPORT = { width: 1440, viewportHeight: 900 }

function kinds(findings) {
  return findings.map((f) => f.kind)
}

describe('normalizeText', () => {
  it('lowercases and NFKC-normalizes', () => {
    expect(normalizeText('GAP')).toBe('gap')
  })

  it('folds U+2212 minus and en/em dashes to a hyphen', () => {
    expect(normalizeText('−26')).toBe('-26')
    expect(normalizeText('11–8 win')).toBe('11-8 win')
    expect(normalizeText('a—b')).toBe('a-b')
  })

  it('collapses whitespace and trims', () => {
    expect(normalizeText('  Closing   the\n gap  ')).toBe('closing the gap')
  })

  it('strips punctuation except hyphen and a digit-adjacent period', () => {
    expect(normalizeText('built.')).toBe('built')
    expect(normalizeText('(2018)')).toBe('2018')
    expect(normalizeText('"quoted", really!')).toBe('quoted really')
    expect(normalizeText('3.5 points')).toBe('3.5 points')
    expect(normalizeText('gap-toothed')).toBe('gap-toothed')
  })
})

describe('matchKey', () => {
  it('masks digit runs so a changed score still keys the same', () => {
    expect(matchKey('761.69')).toBe(matchKey('773.50'))
    expect(matchKey('11-8 W')).toBe(matchKey('9-2 W'))
  })

  it('masks date-like patterns', () => {
    expect(matchKey('2026-09-19')).toBe(matchKey('2026-09-22'))
  })
})

describe('compareLayouts: mockup-missing', () => {
  it('reports an unmatched mockup candidate with no build match', () => {
    const findings = compareLayouts([seg('Gap', 200, { y: 100 })], [], VIEWPORT)
    expect(kinds(findings)).toContain('mockup-missing')
    expect(findings.find((f) => f.kind === 'mockup-missing').detail).toContain('has no match')
  })

  it('distinguishes "present but not rendered" from plain absence', () => {
    const mockup = [seg('Gap', 200, { y: 100 })]
    const build = [seg('Gap', 190, { y: 100, opacity: 0.02 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    const missing = findings.find((f) => f.kind === 'mockup-missing')
    expect(missing.detail).toContain('present but not rendered')
  })

  it('does not match a short segment across a drastic size collapse (2026-09-19 hero "GAP")', () => {
    // The mockup's hero letters at 389px; the build's same word rendered at
    // 32px after a Panda static-extraction miss — twelve times smaller, not
    // "the same element, resized". It must report missing, not a scale fault.
    const mockup = [seg('GAP', 388.8, { y: 100, x: 58, w: 1325 })]
    const build = [seg('GAP', 32, { y: 371, x: 24, w: 1392 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    expect(kinds(findings)).toContain('mockup-missing')
    expect(kinds(findings)).not.toContain('mockup-scale')
  })

  it('requires an exact unmasked match for short segments ("-26" vs "-19")', () => {
    const mockup = [seg('-26', 160, { y: 100 })]
    const build = [seg('-19', 150, { y: 100 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    expect(kinds(findings)).toContain('mockup-missing')
  })

  it('still matches a long segment whose digits changed (score, date, weather)', () => {
    const mockup = [seg('Final score 761.69 on 2026-09-19', 40, { y: 100 })]
    const build = [seg('Final score 773.50 on 2026-09-22', 40, { y: 100 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    expect(kinds(findings)).not.toContain('mockup-missing')
  })
})

describe('compareLayouts: mockup-hierarchy', () => {
  it('fires when the largest mockup text has no comparable match at the top', () => {
    const mockup = [seg('Headline', 180, { y: 50 }), seg('Byline', 40, { y: 300 })]
    const build = [seg('Byline', 40, { y: 300 }), seg('Something else', 30, { y: 50 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    expect(kinds(findings)).toContain('mockup-hierarchy')
  })

  it('fires when the build flattens a clear size lead into a near-tie (2026-09-21)', () => {
    const mockup = [seg('-26', 160, { y: 100 }), seg('-26', 56, { y: 200 })]
    const build = [seg('-26', 128, { y: 100 }), seg('-26', 120, { y: 200 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    const hierarchy = findings.find((f) => f.kind === 'mockup-hierarchy')
    expect(hierarchy).toBeDefined()
    expect(hierarchy.detail).toContain('leads')
  })

  it('does not fire when the top ranks and their gaps both survive', () => {
    const mockup = [seg('Headline', 180, { y: 50 }), seg('Byline', 60, { y: 300 })]
    const build = [seg('Headline', 170, { y: 50 }), seg('Byline', 62, { y: 300 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    expect(kinds(findings)).not.toContain('mockup-hierarchy')
  })
})

describe('compareLayouts: mockup-scale', () => {
  it('flags a matched top segment resized outside 0.6-1.6x', () => {
    const mockup = [seg('Leaderboard score', 56, { y: 100 })]
    const build = [seg('Leaderboard score', 120, { y: 100 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    const scale = findings.find((f) => f.kind === 'mockup-scale')
    expect(scale).toBeDefined()
    expect(scale.detail).toContain('2.14x')
  })

  it('does not flag a match inside the tolerance', () => {
    const mockup = [seg('Roughly the same', 100, { y: 100 })]
    const build = [seg('Roughly the same', 140, { y: 100 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    expect(kinds(findings)).not.toContain('mockup-scale')
  })
})

describe('compareLayouts: mockup-shift', () => {
  it('flags a first-fold match whose centre moves more than 25% of the viewport', () => {
    const mockup = [seg('Anchored headline', 60, { x: 100, y: 100, w: 400, h: 70 })]
    const build = [seg('Anchored headline', 60, { x: 900, y: 100, w: 400, h: 70 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    expect(kinds(findings)).toContain('mockup-shift')
  })

  it('flags a first-fold match that crosses below the fold', () => {
    const mockup = [seg('Standfirst', 40, { x: 100, y: 100, w: 400, h: 60 })]
    const build = [seg('Standfirst', 40, { x: 100, y: 950, w: 400, h: 60 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    const shift = findings.find((f) => f.kind === 'mockup-shift')
    expect(shift).toBeDefined()
    expect(shift.detail).toContain('crossed the fold')
  })

  it('does not flag a match that barely moves', () => {
    const mockup = [seg('Steady', 40, { x: 100, y: 100, w: 200, h: 50 })]
    const build = [seg('Steady', 40, { x: 110, y: 105, w: 200, h: 50 })]
    const findings = compareLayouts(mockup, build, VIEWPORT)
    expect(kinds(findings)).not.toContain('mockup-shift')
  })
})

describe('compareLayouts: text-cut', () => {
  it('flags a build segment clipped below 85% visible, mockup or not', () => {
    const build = [seg('Doug March', 32, { y: 100, visibleFraction: 0.55 })]
    const findings = compareLayouts([], build, VIEWPORT)
    const cut = findings.find((f) => f.kind === 'text-cut')
    expect(cut).toBeDefined()
    expect(cut.detail).toContain('55%')
  })

  it('does not flag decorative near-invisible clipped text', () => {
    // A background texture at low opacity, clipped by design — not content.
    const build = [seg('ghost texture', 180, { y: 100, opacity: 0.08, visibleFraction: 0.3 })]
    const findings = compareLayouts([], build, VIEWPORT)
    expect(kinds(findings)).not.toContain('text-cut')
  })

  it('does not flag a segment below the size floor', () => {
    const build = [seg('tiny', 10, { y: 100, visibleFraction: 0.5 })]
    const findings = compareLayouts([], build, VIEWPORT)
    expect(kinds(findings)).not.toContain('text-cut')
  })
})

describe('compareLayouts: finding shape and determinism', () => {
  it('shapes findings like the surface gate: kind, severity, route, viewport, width, detail', () => {
    const findings = compareLayouts([seg('Gap', 200, { y: 100 })], [], VIEWPORT)
    for (const f of findings) {
      expect(f).toMatchObject({
        kind: expect.any(String),
        severity: 'warning',
        route: '/',
        viewport: 'desktop',
        width: 1440,
        detail: expect.any(String),
      })
    }
  })

  it('names the phone viewport at narrow widths', () => {
    const findings = compareLayouts([seg('Gap', 60, { y: 50 })], [], {
      width: 360,
      viewportHeight: 640,
    })
    expect(findings[0].viewport).toBe('phone')
  })

  it('produces the same findings twice for the same fixture', () => {
    const mockup = [
      seg('-26', 160, { x: 1117, y: 285, w: 251, h: 165 }),
      seg('-26', 56, { x: 520, y: 475, w: 96, h: 58 }),
      seg('Jacob Bridgeman', 26, { x: 108, y: 499, w: 246, h: 27 }),
    ]
    const build = [
      seg('-26', 128, { x: 628, y: 317, w: 212, h: 133 }),
      seg('-26', 120, { x: 1171, y: 729, w: 197, h: 124 }),
      seg('Jacob Bridgeman', 64, { x: 146, y: 368, w: 414, h: 125 }),
    ]
    const first = compareLayouts(mockup, build, VIEWPORT)
    const second = compareLayouts(mockup, build, VIEWPORT)
    expect(JSON.stringify(second)).toBe(JSON.stringify(first))
  })
})

describe('compareLayouts: facts for the repair brief', () => {
  // The brief phrases each finding as an instruction from these numbers
  // (mockup-advisory.js); `detail` stays as it was for the CLI and the archive.
  it('says whether the build lost the mockup leader, whatever the shape', () => {
    const replaced = compareLayouts(
      [seg('BOTH', 158, { y: 100 }), seg('The work', 150, { y: 300 })],
      [
        seg('Other', 122, { y: 100 }),
        seg('BOTH', 100, { y: 300 }),
        seg('The work', 95, { y: 500 }),
      ],
      VIEWPORT
    ).find((x) => x.kind === 'mockup-hierarchy')
    expect(replaced.facts.leaderLost).toBe(true)

    const flattened = compareLayouts(
      [seg('-26', 160, { y: 100 }), seg('-26', 56, { y: 200 })],
      [seg('-26', 128, { y: 100 }), seg('-26', 120, { y: 200 })],
      VIEWPORT
    ).find((x) => x.kind === 'mockup-hierarchy')
    expect(flattened.facts.leaderLost).toBe(false)
  })

  it('does not let a lone decorative glyph take the lead (2026-09-13)', () => {
    const mockup = [seg('11', 200, { y: 100 }), seg('Holes', 60, { y: 400 })]
    const build = [
      seg('-', 287, { y: 50 }),
      seg('11', 190, { y: 100 }),
      seg('Holes', 58, { y: 400 }),
    ]
    expect(kinds(compareLayouts(mockup, build, VIEWPORT))).not.toContain('mockup-hierarchy')
  })

  it('skips a segment that is only punctuation (a lone separator between flex items)', () => {
    const findings = compareLayouts([seg('·', 16, { y: 100 })], [], VIEWPORT)
    expect(findings).toEqual([])
  })

  it('names the build leader and its mockup size when the leader is replaced (the BOTH canary)', () => {
    const mockup = [
      seg('BOTH', 158, { y: 100 }),
      seg('The work', 150, { y: 300 }),
      seg('DEEP IN', 44, { y: 500 }),
    ]
    const build = [
      seg('DEEP IN', 122, { y: 100 }),
      seg('BOTH', 100, { y: 300 }),
      seg('The work', 95, { y: 500 }),
    ]
    const f = compareLayouts(mockup, build, VIEWPORT).find((x) => x.kind === 'mockup-hierarchy')
    expect(f.detail).toBe(
      "largest text in mockup is 'both' (158px); in build it is 'deep in' (122px)"
    )
    expect(f.facts).toMatchObject({
      shape: 'replaced',
      leader: { text: 'both', mockupPx: 158 },
      buildLeader: { text: 'deep in', buildPx: 122, mockupPx: 44 },
    })
  })

  it('records the build sizes of a flattened lead (2026-09-21)', () => {
    const mockup = [seg('-26', 160, { y: 100 }), seg('-26', 56, { y: 200 })]
    const build = [seg('-26', 128, { y: 100 }), seg('-26', 120, { y: 200 })]
    const f = compareLayouts(mockup, build, VIEWPORT).find((x) => x.kind === 'mockup-hierarchy')
    expect(f.facts).toMatchObject({
      shape: 'flattened',
      leader: { mockupPx: 160, buildPx: 128 },
      runnerUp: { mockupPx: 56, buildPx: 120 },
      mockupGap: 2.9,
      buildGap: 1.1,
    })
  })

  it('names what fell out of the top three when the leader held (reordered)', () => {
    const mockup = [
      seg('Spaceman', 64, { y: 50 }),
      seg('Selected Work', 28, { y: 300 }),
      seg('Experiments', 28, { y: 500 }),
    ]
    const build = [
      seg('Spaceman', 64, { y: 50 }),
      seg('A caption', 40, { y: 200 }),
      seg('Another caption', 36, { y: 250 }),
      seg('A third caption', 32, { y: 280 }),
      seg('Selected Work', 20, { y: 300 }),
      seg('Experiments', 20, { y: 500 }),
    ]
    const f = compareLayouts(mockup, build, VIEWPORT).find((x) => x.kind === 'mockup-hierarchy')
    expect(f.facts.shape).toBe('reordered')
    expect(f.facts.dropped.map((d) => d.text)).toEqual(['selected work', 'experiments'])
  })

  it('carries sizes and ratio on a scale finding, and hidden on a missing one', () => {
    const scale = compareLayouts(
      [seg('Leaderboard score', 56, { y: 100 })],
      [seg('Leaderboard score', 120, { y: 100 })],
      VIEWPORT
    ).find((x) => x.kind === 'mockup-scale')
    expect(scale.facts).toEqual({
      text: 'leaderboard score',
      mockupPx: 56,
      buildPx: 120,
      ratio: 2.14,
      mockupRank: 0,
    })

    const hidden = compareLayouts(
      [seg('Selected Work', 28, { y: 100 })],
      [seg('Selected Work', 28, { y: 100, opacity: 0 })],
      VIEWPORT
    ).find((x) => x.kind === 'mockup-missing')
    expect(hidden.facts).toEqual({ text: 'selected work', mockupPx: 28, hidden: true })
  })
})

describe('compareMockupLayout', () => {
  it('compares at every width both layouts have, desktop first', () => {
    const mockup = { desktop: [seg('Gap', 200, { y: 100 })], phone: [seg('Gap', 80, { y: 50 })] }
    const findings = compareMockupLayout(mockup, { desktop: [], phone: [] })
    const widths = findings.map((f) => f.width)
    expect(widths).toContain(1440)
    expect(widths).toContain(360)
    expect(widths.indexOf(360)).toBeGreaterThan(widths.lastIndexOf(1440))
  })

  it('skips a width either side is missing', () => {
    const findings = compareMockupLayout(
      { desktop: [seg('Gap', 200, { y: 100 })] },
      { desktop: [] }
    )
    expect(findings.every((f) => f.width === 1440)).toBe(true)
    expect(compareMockupLayout(null, { desktop: [] })).toEqual([])
  })
})
