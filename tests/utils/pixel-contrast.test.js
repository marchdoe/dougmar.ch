/**
 * The pixel contrast probe's arithmetic and findings (spec 11, 1c), with
 * pixels fed in by hand. pixel-contrast-dom.test.js proves the page half.
 */
import { describe, expect, it } from 'vitest'
import { contrastRatio } from '../../scripts/utils/contrast.js'
import { evaluateMockupPrecheck } from '../../scripts/utils/mockup-precheck.js'
import {
  collapseLegibility,
  LEGIBILITY_KIND,
  LEGIBILITY_LARGE_MIN,
  LEGIBILITY_MIN,
  legibilityFaults,
  legibilityFindings,
  legibilityThreshold,
  lowPercentile,
  MAX_LEGIBILITY_REPORTED,
  measureProbe,
  measureRow,
  ROW_FRACTION,
  samplesToColors,
} from '../../scripts/utils/pixel-contrast.js'
import { evaluateMeasurement, faultsForOwner } from '../../scripts/utils/surface-gate.js'
import { textContrastFindings } from '../../scripts/utils/text-contrast.js'

const WHITE_INK = { r: 255, g: 255, b: 255, a: 1 }
const NAVY = [44, 34, 96]
const RULE = [255, 255, 255]

/** One pixel row of `n` pixels, `hits` of them the rule colour and the rest the ground. */
function row(n, hits, ground = NAVY, line = RULE) {
  const out = []
  for (let i = 0; i < n; i++) out.push(...(i < hits ? line : ground))
  return out
}

/** An 18-row glyph band on the ground, with row 9 crossed by a rule over `hits` of its 100 pixels. */
function band(hits = 0, ground = NAVY, line = RULE) {
  return Array.from({ length: 18 }, (_, i) => row(100, i === 9 ? hits : 0, ground, line))
}

const probe = (over = {}) => ({
  key: 'div > span.label|div.rules (positioned background-image)',
  selector: 'div > span.label',
  text: 'SHEET 01 · DESIGN INTENT',
  sizePx: 12,
  weight: 400,
  large: false,
  fg: WHITE_INK,
  unresolved: 'div.rules (positioned background-image)',
  part: null,
  rows: band(),
  ...over,
})

describe('lowPercentile', () => {
  it('is the lowest of ten at the 10th percentile, the second lowest of twenty', () => {
    const ten = [9, 3, 7, 1, 5, 2, 8, 4, 6, 10]
    expect(lowPercentile(ten, 0.1)).toEqual({ value: 1, index: 3 })
    const twenty = [...ten, ...ten.map((v) => v + 10)]
    expect(lowPercentile(twenty, 0.1).value).toBe(2)
  })

  it('rounds the rank up: 11 values at 0.1 take the second lowest', () => {
    expect(lowPercentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 0.1).value).toBe(2)
  })

  it('takes the only value, and is null on none', () => {
    expect(lowPercentile([4.2], 0.1)).toEqual({ value: 4.2, index: 0 })
    expect(lowPercentile([], 0.1)).toBeNull()
  })
})

describe('legibilityThreshold', () => {
  it('is 4.5 under the large size and 3 at it', () => {
    expect(legibilityThreshold(false)).toBe(LEGIBILITY_MIN)
    expect(legibilityThreshold(true)).toBe(LEGIBILITY_LARGE_MIN)
    expect([LEGIBILITY_MIN, LEGIBILITY_LARGE_MIN]).toEqual([4.5, 3])
  })
})

describe('samplesToColors', () => {
  it('reads flat r, g, b triples and drops a partial one', () => {
    expect(samplesToColors([1, 2, 3, 4, 5, 6, 7])).toEqual([
      { r: 1, g: 2, b: 3 },
      { r: 4, g: 5, b: 6 },
    ])
  })
})

describe('measureRow', () => {
  it("is the ratio at the row's low ROW_FRACTION mark, with the share under the floor", () => {
    expect(ROW_FRACTION).toBe(0.5)
    const m = measureRow(WHITE_INK, row(10, 5), 4.5)
    expect(m.ratio).toBeCloseTo(1, 6)
    expect(m.under).toBe(0.5)
    expect(measureRow(WHITE_INK, row(10, 4), 4.5).under).toBe(0.4)
  })

  it('is null on an empty row', () => {
    expect(measureRow(WHITE_INK, [], 4.5)).toBeNull()
  })
})

describe('measureProbe', () => {
  const flat = contrastRatio({ r: 255, g: 255, b: 255 }, { r: 44, g: 34, b: 96 })

  it('is the ratio on a flat ground when nothing crosses it', () => {
    const m = measureProbe(probe())
    expect(m.ratio).toBeCloseTo(flat)
    expect(m.threshold).toBe(4.5)
  })

  it('fails on one 1px rule drawn across the text: white on white is 1:1', () => {
    // 09-28's label: the rule was one row of an 18px band, 5.6% of its pixels.
    const m = measureProbe(probe({ rows: band(100) }))
    expect(m.ratio).toBeCloseTo(1, 6)
    expect(m.under).toBe(1)
    expect(m.bg).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('fails a rule across half the line, and passes one across less', () => {
    expect(measureProbe(probe({ rows: band(50) })).ratio).toBeCloseTo(1, 6)
    expect(measureProbe(probe({ rows: band(49) })).ratio).toBeCloseTo(flat)
  })

  it('passes a texture that dips under the floor in patches on every row', () => {
    const speckled = Array.from({ length: 18 }, () => row(100, 30))
    expect(measureProbe(probe({ rows: speckled })).ratio).toBeCloseTo(flat)
  })

  it('lays a translucent ink over each pixel before the ratio', () => {
    // White at 50% over black is mid grey on black.
    const m = measureProbe(probe({ fg: { ...WHITE_INK, a: 0.5 }, rows: [row(10, 0, [0, 0, 0])] }))
    expect(m.fg.r).toBeCloseTo(127.5, 6)
    expect(m.ratio).toBeCloseTo(
      contrastRatio({ r: 127.5, g: 127.5, b: 127.5 }, { r: 0, g: 0, b: 0 })
    )
  })

  it('holds large text to 3:1', () => {
    expect(measureProbe(probe({ large: true })).threshold).toBe(3)
  })

  it('is null with nothing sampled', () => {
    expect(measureProbe(probe({ rows: [] }))).toBeNull()
  })
})

describe('legibilityFindings', () => {
  const m = (probes) => ({ route: '/', pixelContrast: { probes, probed: [] } })

  it('reports a text under its floor with its chain, ratio and threshold', () => {
    const [f] = legibilityFindings(m([probe({ rows: band(100) })]), 'react-engineer')
    expect(f).toMatchObject({
      kind: LEGIBILITY_KIND,
      severity: 'error',
      owner: 'react-engineer',
      selector: 'div > span.label',
      threshold: 4.5,
    })
    expect(f.ratio).toBeCloseTo(1, 6)
    expect(f.detail).toContain('<div > span.label> "SHEET 01 · DESIGN INTENT" at 12px')
    expect(f.detail).toContain('is under 4.5:1 across 100% of one pixel row through its glyphs')
    expect(f.detail).toContain('(1.00:1 on #ffffff)')
    expect(f.detail).toContain('Give the text a flat ground')
  })

  it('passes text that clears its floor', () => {
    expect(legibilityFindings(m([probe()]), 'react-engineer')).toEqual([])
  })

  it('lets large text through at 3:1 that small text fails', () => {
    // #767676-ish grey on white is about 4.5; #949494 on white is about 3.03.
    const grey = { r: 148, g: 148, b: 148, a: 1 }
    const onWhite = [row(10, 0, [255, 255, 255])]
    const small = probe({ fg: grey, rows: onWhite })
    const large = probe({ fg: grey, rows: onWhite, large: true, selector: 'h1' })
    const found = legibilityFindings(m([small, large]), 'react-engineer')
    expect(found.map((f) => f.selector)).toEqual(['div > span.label'])
  })

  it('keeps one finding per chain, at the worst reading', () => {
    const found = legibilityFindings(
      m([probe({ rows: band(100, NAVY, [120, 120, 160]) }), probe({ rows: band(100) })]),
      'react-engineer'
    )
    expect(found).toHaveLength(1)
    expect(found[0].ratio).toBeCloseTo(1, 6)
  })

  describe('a part over a ground painted from outside it (#705)', () => {
    // 2026-10-02: the lockup's light ink on the page's dark bg, laid by the
    // engineer over a green mesh layer.
    const INK = { r: 0xb4, g: 0xe8, b: 0xd3, a: 1 }
    const GREEN = [0x1e, 0xca, 0x87]
    const partGround = (bg, outside = 'div.drift (positioned background)') => ({
      fg: INK,
      layers: [
        { bg: null, opacity: 1 },
        { bg, opacity: 1 },
      ],
      outside,
    })
    const lockup = (over) =>
      probe({
        fg: INK,
        rows: band(0, GREEN),
        part: 'BrandLockup',
        unresolved: 'div.drift (positioned background)',
        ...over,
      })
    const DARK = { r: 5, g: 12, b: 24, a: 1 }

    it('is the engineer error when the part clears its floor on its own ground', () => {
      const [f] = legibilityFindings(
        m([lockup({ partGround: partGround(DARK) })]),
        'react-engineer'
      )
      expect(f).toMatchObject({ kind: LEGIBILITY_KIND, severity: 'error', owner: 'react-engineer' })
      expect(f.detail).toContain(
        'BrandLockup is written by the orchestrator and its text colour is fixed'
      )
      expect(f.detail).toContain('Move or recolour div.drift (positioned background)')
      expect(f.detail).not.toContain('not a revision')
      expect(faultsForOwner([f], 'react-engineer')).toHaveLength(1)
    })

    it('stays the human finding when the part fails on its own ground too', () => {
      const [f] = legibilityFindings(
        m([lockup({ partGround: partGround({ r: 255, g: 255, b: 255, a: 1 }) })]),
        'react-engineer'
      )
      expect(f.owner).toBe('human')
      expect(f.detail).toContain('not a revision')
    })

    it('stays the human finding when nothing outside the part paints behind it', () => {
      const [f] = legibilityFindings(
        m([lockup({ partGround: partGround(DARK, null) })]),
        'react-engineer'
      )
      expect(f.owner).toBe('human')
    })

    it('stays with a human-owned route', () => {
      const [f] = legibilityFindings(m([lockup({ partGround: partGround(DARK) })]), 'human')
      expect(f.owner).toBe('human')
      expect(f.detail).toContain('Move or recolour')
    })
  })

  it('gives text inside an orchestrator part to the human', () => {
    const [f] = legibilityFindings(
      m([probe({ rows: band(100), part: 'SiteCallout' })]),
      'react-engineer'
    )
    expect(f.owner).toBe('human')
    expect(f.detail).toContain('written by the orchestrator')
  })
})

describe('the surface gate', () => {
  const page = {
    route: '/',
    viewport: 'mobile',
    status: 200,
    scrollWidth: 360,
    clientWidth: 360,
  }
  const unresolved = {
    selector: 'div > span.label',
    text: 'SHEET 01',
    sizePx: 12,
    weight: 400,
    fg: WHITE_INK,
    layers: [{ bg: null, opacity: 1 }],
    unresolved: 'div.rules (positioned background-image)',
    part: null,
    count: 1,
  }
  const key = `${unresolved.selector}|${unresolved.unresolved}`

  it('turns a failing probe into an engineer-owned error that forces a revision', () => {
    const findings = evaluateMeasurement({
      ...page,
      textContrast: { candidates: [unresolved] },
      pixelContrast: { probes: [probe({ rows: band(100) })], probed: [key] },
    })
    const faults = faultsForOwner(findings, 'react-engineer')
    expect(faults.map((f) => f.kind)).toEqual([LEGIBILITY_KIND])
    // The probed text drops its warning: it was measured.
    expect(findings.some((f) => f.kind === 'contrast-unresolved')).toBe(false)
  })

  it('keeps the warning on a text the probe could not reach', () => {
    const found = textContrastFindings(
      { textContrast: { candidates: [unresolved] }, pixelContrast: { probes: [], probed: [] } },
      'react-engineer'
    )
    expect(found.map((f) => f.kind)).toEqual(['contrast-unresolved'])
  })

  it('folds one chain across places, worst first, and caps each owner', () => {
    const at = (surface, width, gap, selector = 'span.a') => ({
      kind: LEGIBILITY_KIND,
      severity: 'error',
      owner: 'react-engineer',
      surface,
      width,
      gap,
      key: `${LEGIBILITY_KIND}|${selector}`,
      detail: `${selector} gap ${gap}`,
    })
    const [one] = collapseLegibility([at('/', 360, 1), at('/about', 1440, 3), at('/', 360, 2)])
    expect(one.detail).toBe('span.a gap 3 Also on / at 360px.')

    const many = Array.from({ length: MAX_LEGIBILITY_REPORTED + 2 }, (_, i) =>
      at('/', 360, i, `span.s${i}`)
    )
    const capped = collapseLegibility([{ kind: 'overflow' }, ...many])
    expect(capped[0]).toEqual({ kind: 'overflow' })
    expect(capped).toHaveLength(MAX_LEGIBILITY_REPORTED + 2)
    expect(capped.at(-1).detail).toBe(
      '2 more texts under their floor over a textured ground are not listed.'
    )
    expect(capped.at(-1).severity).toBe('error')
  })
})

describe('legibilityFaults', () => {
  it('picks the legibility faults out of what the last round left', () => {
    const faults = [{ kind: 'overflow' }, { kind: LEGIBILITY_KIND }, { kind: 'clipped' }]
    expect(legibilityFaults(faults)).toEqual([{ kind: LEGIBILITY_KIND }])
    expect(legibilityFaults(null)).toEqual([])
  })
})

describe('the mockup pre-check', () => {
  const facts = (width, probes) => ({
    width,
    height: 900,
    scrollWidth: width,
    markCount: 1,
    mark: { heightPx: 44, top: 20, inFold: true, original: true },
    wordmark: { orientation: 'row', gapPx: 12 },
    cutText: [],
    pixelContrast: { probes, probed: [] },
  })

  it('sends the designer the worst text over a textured ground, at each width', () => {
    const [f] = evaluateMockupPrecheck({
      measured: null,
      wide: facts(1440, [probe({ rows: band(100, NAVY, [90, 80, 140]) })]),
      narrow: facts(360, [probe({ rows: band(100) })]),
      declared: {},
    })
    expect(f.key).toBe('legibility')
    expect(f.check).toBe(5)
    expect(f.gap).toBeCloseTo(3.5, 2)
    // One line per chain, the worst reading: here the phone's.
    expect(f.detail).toMatch(/^Legibility: At 360px, <div > span\.label>/)
    expect(f.detail).not.toContain('At 1440px')
  })

  it('names outlined text as outlined', () => {
    const [f] = evaluateMockupPrecheck({
      measured: null,
      wide: facts(1440, [probe({ rows: band(100), large: true, outlined: true, sizePx: 72 })]),
      narrow: null,
      declared: {},
    })
    expect(f.detail).toContain('at 72px outlined over')
  })

  it('finds nothing when every probe clears its floor', () => {
    expect(
      evaluateMockupPrecheck({
        measured: null,
        wide: facts(1440, [probe()]),
        narrow: facts(360, [probe()]),
        declared: {},
      })
    ).toEqual([])
  })
})
