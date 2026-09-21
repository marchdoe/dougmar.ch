/**
 * The arithmetic of the phone density measurement (#569), on rects built by
 * hand. text-density-dom.test.js proves the rects against real Chromium.
 */
import { describe, expect, it } from 'vitest'
import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'
import { phoneDensityRecord } from '../../scripts/utils/surface-gate.js'
import {
  DENSITY_FOLD_PX,
  SPARSE_FOLD_RATIO,
  foldDensity,
  formatDensityForCritic,
  unionArea,
} from '../../scripts/utils/text-density.js'

describe('unionArea', () => {
  it('sums disjoint rects', () => {
    expect(
      unionArea([
        [0, 0, 10, 10],
        [20, 0, 30, 10],
        [0, 20, 5, 30],
      ])
    ).toBe(250)
  })

  it('counts an overlap once', () => {
    // Two 10x10 boxes sharing a 5x5 corner.
    expect(
      unionArea([
        [0, 0, 10, 10],
        [5, 5, 15, 15],
      ])
    ).toBe(175)
  })

  it('counts a rect inside another once, and identical rects once', () => {
    expect(
      unionArea([
        [0, 0, 100, 100],
        [10, 10, 20, 20],
        [0, 0, 100, 100],
      ])
    ).toBe(10000)
  })

  it('adds nothing for rects that only touch along an edge', () => {
    expect(
      unionArea([
        [0, 0, 10, 10],
        [10, 0, 20, 10],
      ])
    ).toBe(200)
  })

  it('is zero for no rects', () => {
    expect(unionArea([])).toBe(0)
  })
})

describe('foldDensity', () => {
  const W = 360
  const fold = 640
  const row = (top, height = 20, left = 0, right = W) => [left, top, right, top + height]

  it('takes a fold to be one phone screen', () => {
    expect(DENSITY_FOLD_PX).toBe(NARROW_VIEWPORT.height)
  })

  it('is the covered share of each fold, from the top of the page', () => {
    // Fold 1: one full-width 64px band, a tenth of 640. Fold 2: nothing.
    const d = foldDensity({ width: W, height: 2 * fold, rects: [row(100, 64)] }, fold)
    expect(d.folds.map((f) => f.ratio)).toEqual([0.1, 0])
    expect(d.lowest).toEqual({ index: 2, ratio: 0 })
    expect(d.wholePage).toBe(0.05)
    expect(d.folds.every((f) => !f.partial)).toBe(true)
  })

  it('cuts a box that crosses a fold between the two', () => {
    // 100px tall across the 640 line: 40px in the first fold, 60 in the second.
    const d = foldDensity({ width: W, height: 2 * fold, rects: [row(600, 100)] }, fold)
    expect(d.folds[0].ratio).toBeCloseTo(40 / 640, 2)
    expect(d.folds[1].ratio).toBeCloseTo(60 / 640, 2)
  })

  it('counts overlapping boxes once', () => {
    const d = foldDensity(
      { width: W, height: fold, rects: [row(0, 64), row(0, 64), row(32, 64)] },
      fold
    )
    expect(d.folds[0].ratio).toBeCloseTo(96 / 640, 2)
  })

  it('divides by the width of the page, so a narrow box is a share of it', () => {
    const d = foldDensity({ width: W, height: fold, rects: [row(0, 640, 0, 180)] }, fold)
    expect(d.folds[0].ratio).toBe(0.5)
  })

  it('marks a short last band, measures it at its own height and leaves it out of the lowest', () => {
    const d = foldDensity({ width: W, height: 800, rects: [row(0, 64), row(700, 10)] }, fold)
    expect(d.folds).toHaveLength(2)
    expect(d.folds[1]).toMatchObject({ index: 2, partial: true, px: 160 })
    expect(d.folds[1].ratio).toBeCloseTo(10 / 160, 2)
    // The last band is emptier than the first would be if it were a fold, but
    // it is 160px of footer: the lowest is over whole folds.
    expect(d.lowest).toEqual({ index: 1, ratio: 0.1 })
  })

  it('counts a page shorter than a fold as its one band', () => {
    const d = foldDensity({ width: W, height: 300, rects: [row(0, 30)] }, fold)
    expect(d.folds).toHaveLength(1)
    expect(d.folds[0]).toMatchObject({ partial: true, px: 300, ratio: 0.1 })
    expect(d.lowest.index).toBe(1)
  })

  it('is exact for a page a whole number of folds tall', () => {
    const d = foldDensity({ width: W, height: 3 * fold, rects: [] }, fold)
    expect(d.folds).toHaveLength(3)
    expect(d.folds.some((f) => f.partial)).toBe(false)
    expect(d.wholePage).toBe(0)
  })

  it('picks the lowest fold, the first when two tie', () => {
    const rects = [row(0, 64), row(640, 32), row(1280, 32)]
    const d = foldDensity({ width: W, height: 3 * fold, rects }, fold)
    expect(d.lowest).toEqual({ index: 2, ratio: 0.05 })
  })
})

describe('formatDensityForCritic', () => {
  const rec = (route, ratios, over = {}) => ({
    route,
    foldPx: 640,
    widthPx: 360,
    heightPx: 640 * ratios.length,
    wholePage: 0.2,
    folds: ratios.map((ratio, i) => ({ index: i + 1, ratio, px: 640, partial: false })),
    lowest: (() => {
      const i = ratios.indexOf(Math.min(...ratios))
      return { index: i + 1, ratio: ratios[i] }
    })(),
    ...over,
  })

  it('is empty when nothing was measured', () => {
    expect(formatDensityForCritic([])).toBe('')
    expect(formatDensityForCritic(undefined)).toBe('')
  })

  it('lists every fold of /, /about and the first case study, and one line for the rest', () => {
    const text = formatDensityForCritic([
      rec('/', [0.47, 0.26, 0.12]),
      rec('/about', [0.3, 0.2]),
      rec('/work/a', [0.19, 0.05, 0.19]),
      rec('/work/b', [0.2, 0.1]),
      rec('/work/c', [0.3, 0.02]),
    ])
    expect(text).toContain('## Measured phone density')
    expect(text).toContain('360px wide')
    expect(text).toContain(`Under ${Math.round(SPARSE_FOLD_RATIO * 100)}% is sparse.`)
    expect(text).toContain(
      '- /, 3 folds of 640px: 47% 26% 12%. Lowest 12% (fold 3), whole page 20%.'
    )
    expect(text).toContain('- /about, 2 folds of 640px: 30% 20%.')
    expect(text).toContain('- /work/a, 3 folds of 640px: 19% 5% 19%.')
    expect(text).not.toContain('- /work/b,')
    expect(text).toContain('- 2 more case studies: the lowest fold is 2% (/work/c, fold 2 of 2).')
  })

  it('says a short last band is short', () => {
    const r = rec('/', [0.3, 0.04], {
      folds: [
        { index: 1, ratio: 0.3, px: 640, partial: false },
        { index: 2, ratio: 0.04, px: 122, partial: true },
      ],
    })
    expect(formatDensityForCritic([r])).toContain('30% 4% (last, 122px)')
  })

  it('says it is a measurement and not a fault', () => {
    expect(formatDensityForCritic([rec('/', [0.3])])).toContain('a measurement and not a fault')
  })

  it('has no closing line when there is no other case study', () => {
    expect(formatDensityForCritic([rec('/', [0.3]), rec('/work/a', [0.3])])).not.toContain(
      'more case stud'
    )
  })
})

describe('phoneDensityRecord', () => {
  const seen = { width: 360, height: 1280, rects: [[0, 0, 360, 64]] }

  it('is one record per engineer-owned route, carrying its route', () => {
    const r = phoneDensityRecord({ route: '/about', textDensity: seen })
    expect(r).toMatchObject({ route: '/about', widthPx: 360, heightPx: 1280 })
    expect(r.folds).toHaveLength(2)
  })

  it('is null for a measurement that took none, and for a route no agent owns', () => {
    expect(phoneDensityRecord({ route: '/about', textDensity: null })).toBeNull()
    expect(phoneDensityRecord({ route: '/about' })).toBeNull()
    expect(phoneDensityRecord({ route: '/work', textDensity: seen })).toBeNull()
    expect(phoneDensityRecord({ route: '/experiments', textDensity: seen })).toBeNull()
  })
})
