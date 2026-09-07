import { describe, expect, it } from 'vitest'

import {
  SHELL_FIELDS,
  WEIGHTS,
  WINDOW,
  compositionNovelty,
  composite,
  computeUniqueness,
  fidelity,
  formatUniquenessForPrompt,
  hammingTuple,
  hueNovelty,
  laneNovelty,
  shellNovelty,
} from '../../scripts/utils/uniqueness-index.js'
import { AXIS_NAMES } from '../../scripts/utils/composition-grammar.js'

/** A full, valid axis tuple. Individual tests override single axes. */
const TUPLE = {
  columns: 'single',
  axis: 'vertical',
  symmetry: 'symmetric',
  hero_zone: 'center',
  density: 'measured',
  rhythm: 'even',
  shell_posture: 'standard',
  field_ratio: 'balanced',
  collapse: 'stack',
}

/** A tuple that differs from TUPLE on every axis. */
const FAR = {
  columns: 'masonry',
  axis: 'radial',
  symmetry: 'broken',
  hero_zone: 'full-bleed',
  density: 'crowded',
  rhythm: 'syncopated',
  shell_posture: 'none',
  field_ratio: 'drenched',
  collapse: 'hero-only',
}

const SHELL = {
  brand_lockup: 'mark-only-sm',
  brand_color_mode: 'single-color',
  ground_strategy: 'dark-void',
}

describe('hammingTuple', () => {
  it('is 0 for an identical tuple', () => {
    expect(hammingTuple(TUPLE, { ...TUPLE })).toBe(0)
  })

  it('counts each differing axis once', () => {
    expect(hammingTuple(TUPLE, { ...TUPLE, columns: 'masonry' })).toBe(1)
    expect(hammingTuple(TUPLE, { ...TUPLE, columns: 'masonry', axis: 'radial' })).toBe(2)
  })

  it('is the axis count when every axis differs', () => {
    expect(hammingTuple(TUPLE, FAR)).toBe(AXIS_NAMES.length)
    expect(AXIS_NAMES.length).toBe(9)
  })

  it('counts a legacy record with no collapse axis as one axis apart, not invalid', () => {
    const { collapse, ...legacy } = TUPLE
    expect(hammingTuple(TUPLE, legacy)).toBe(1)
  })

  it('counts a missing axis as a difference', () => {
    const { columns, ...partial } = TUPLE
    expect(hammingTuple(TUPLE, partial)).toBe(1)
  })

  it('treats a null tuple as maximally distant rather than throwing', () => {
    expect(hammingTuple(TUPLE, null)).toBe(AXIS_NAMES.length)
  })
})

describe('compositionNovelty', () => {
  it('scores 0 against an exact repeat', () => {
    const r = compositionNovelty(TUPLE, [{ date: '2026-08-25', composition: { ...TUPLE } }])
    expect(r.raw).toBe(0)
    expect(r.score).toBe(0)
    expect(r.nearest).toBe('2026-08-25')
  })

  it('reports the NEAREST neighbour, not the average', () => {
    const r = compositionNovelty(TUPLE, [
      { date: 'far-1', composition: FAR },
      { date: 'far-2', composition: FAR },
      { date: 'clone', composition: { ...TUPLE } },
    ])
    // Averaging would score this highly. The clone is the point.
    expect(r.raw).toBe(0)
    expect(r.nearest).toBe('clone')
  })

  it('normalizes against the axis count', () => {
    const r = compositionNovelty(TUPLE, [
      { date: 'd', composition: { ...TUPLE, columns: 'masonry', axis: 'radial' } },
    ])
    expect(r.raw).toBe(2)
    expect(r.score).toBeCloseTo(2 / AXIS_NAMES.length)
  })

  it('returns null on empty history', () => {
    expect(compositionNovelty(TUPLE, [])).toMatchObject({ raw: null, score: null, compared: 0 })
  })

  it('skips legacy builds that carry no composition', () => {
    const r = compositionNovelty(TUPLE, [
      { date: 'legacy-1', composition: null },
      { date: 'legacy-2' },
      { date: 'modern', composition: { ...TUPLE, columns: 'masonry' } },
    ])
    expect(r.compared).toBe(1)
    expect(r.raw).toBe(1)
    expect(r.nearest).toBe('modern')
  })

  it('returns null when every neighbour is legacy', () => {
    const r = compositionNovelty(TUPLE, [{ date: 'legacy', composition: null }])
    expect(r).toMatchObject({ raw: null, score: null, compared: 0 })
  })

  it('returns null when the build itself has no composition', () => {
    expect(compositionNovelty(null, [{ date: 'd', composition: TUPLE }])).toMatchObject({
      score: null,
    })
  })
})

describe('hueNovelty', () => {
  it('scores 0 against the same hue', () => {
    expect(hueNovelty(42, [{ date: 'd', hue: 42 }])).toMatchObject({ raw: 0, score: 0 })
  })

  it('scores 1 at the opposite side of the wheel', () => {
    expect(hueNovelty(0, [{ date: 'd', hue: 180 }])).toMatchObject({ raw: 180, score: 1 })
  })

  it('takes the short way around the wheel', () => {
    // 350 and 10 are 20 apart, not 340.
    expect(hueNovelty(350, [{ date: 'd', hue: 10 }]).raw).toBe(20)
  })

  it('ignores non-numeric hues in history', () => {
    const r = hueNovelty(42, [
      { date: 'bad', hue: null },
      { date: 'good', hue: 222 },
    ])
    expect(r.compared).toBe(1)
    expect(r.nearest).toBe('good')
  })

  it('returns null when the build has no hue', () => {
    expect(hueNovelty(null, [{ date: 'd', hue: 42 }])).toMatchObject({ score: null })
  })

  it('returns null on empty history', () => {
    expect(hueNovelty(42, [])).toMatchObject({ score: null, compared: 0 })
  })
})

describe('laneNovelty', () => {
  it('scores 0 when yesterday ran the same lane', () => {
    const r = laneNovelty('swiss-poster', [
      { date: 'y', lane: 'swiss-poster' },
      { date: 'x', lane: 'brutalist' },
    ])
    expect(r.raw).toBe(0)
    expect(r.score).toBe(0)
    expect(r.lastSeen).toBe('y')
  })

  it('counts builds since the lane last ran', () => {
    const r = laneNovelty('swiss-poster', [
      { date: 'a', lane: 'brutalist' },
      { date: 'b', lane: 'editorial' },
      { date: 'c', lane: 'swiss-poster' },
    ])
    expect(r.raw).toBe(2)
    expect(r.score).toBeCloseTo(2 / 3)
  })

  it('scores 1 for a lane absent from the window', () => {
    const r = laneNovelty('never-run', [
      { date: 'a', lane: 'brutalist' },
      { date: 'b', lane: 'editorial' },
    ])
    expect(r.score).toBe(1)
    expect(r.lastSeen).toBeNull()
  })

  it('skips legacy builds with no lane', () => {
    const r = laneNovelty('swiss-poster', [{ date: 'legacy' }, { date: 'b', lane: 'swiss-poster' }])
    expect(r.compared).toBe(1)
    expect(r.raw).toBe(0)
  })

  it('returns null on empty history', () => {
    expect(laneNovelty('swiss-poster', [])).toMatchObject({ score: null, compared: 0 })
  })
})

describe('shellNovelty', () => {
  const cur = { posture: 'standard', shell: SHELL }

  it('scores 0 against an identical shell', () => {
    const r = shellNovelty(cur, [{ date: 'd', posture: 'standard', shell: { ...SHELL } }])
    expect(r.raw).toBe(0)
    expect(r.score).toBe(0)
  })

  it('counts posture alongside the enumerated treatments', () => {
    const r = shellNovelty(cur, [{ date: 'd', posture: 'none', shell: { ...SHELL } }])
    expect(r.raw).toBe(1)
    expect(r.score).toBeCloseTo(1 / (SHELL_FIELDS.length + 1))
  })

  it('scores 1 when posture and every treatment differ', () => {
    const r = shellNovelty(cur, [
      {
        date: 'd',
        posture: 'none',
        shell: {
          brand_lockup: 'wordmark-lg',
          brand_color_mode: 'original',
          ground_strategy: 'drench',
        },
      },
    ])
    expect(r.score).toBe(1)
  })

  it('handles a legacy build with no shell at all', () => {
    const r = shellNovelty(cur, [{ date: 'legacy' }])
    expect(r).toMatchObject({ score: null, compared: 0 })
  })

  it('scores a posture-only legacy pair over posture alone', () => {
    // Neither side declares a treatment, so a posture mismatch is a total
    // mismatch. Normalizing over all four fields would score this 0.25.
    const r = shellNovelty({ posture: 'standard' }, [{ date: 'legacy', posture: 'none' }])
    expect(r.raw).toBe(1)
    expect(r.score).toBe(1)
  })

  it('scores a posture-only legacy match at 0', () => {
    const r = shellNovelty({ posture: 'standard' }, [{ date: 'legacy', posture: 'standard' }])
    expect(r.score).toBe(0)
  })

  it('returns null when the build itself has no shell or posture', () => {
    expect(shellNovelty({}, [{ date: 'd', posture: 'standard', shell: SHELL }])).toMatchObject({
      score: null,
    })
  })
})

describe('fidelity', () => {
  it('scores 1 when every floor is cleared', () => {
    const r = fidelity(
      { canvas_utilization_min: 70, color_coverage_min: 40 },
      { canvas_utilization: 82, color_coverage: 55 }
    )
    expect(r.score).toBe(1)
    expect(r.checks).toHaveLength(2)
  })

  it('scores the fraction of floors met', () => {
    const r = fidelity(
      { canvas_utilization_min: 70, color_coverage_min: 40 },
      { canvas_utilization: 82, color_coverage: 12 }
    )
    expect(r.score).toBe(0.5)
    expect(r.checks.find((c) => c.name === 'color_coverage').met).toBe(false)
  })

  it('treats exactly meeting the floor as met', () => {
    const r = fidelity({ canvas_utilization_min: 70 }, { canvas_utilization: 70 })
    expect(r.score).toBe(1)
  })

  it('returns null when measurements are absent, which is today', () => {
    expect(fidelity({ canvas_utilization_min: 70 }, null)).toMatchObject({
      score: null,
      checks: [],
    })
  })

  it('ignores a floor with no matching measurement', () => {
    const r = fidelity(
      { canvas_utilization_min: 70, color_coverage_min: 40 },
      { canvas_utilization: 82 }
    )
    expect(r.checks).toHaveLength(1)
    expect(r.score).toBe(1)
  })
})

describe('composite', () => {
  it('is the weighted mean when every metric scores', () => {
    const all = {
      composition: { score: 1 },
      hue: { score: 1 },
      lane: { score: 1 },
      shell: { score: 1 },
      fidelity: { score: 1 },
    }
    expect(composite(all)).toBeCloseTo(1)
  })

  it('renormalizes over present metrics rather than treating null as zero', () => {
    // Only composition scores. Its own score must survive intact.
    const r = composite({
      composition: { score: 0.5 },
      hue: { score: null },
      lane: { score: null },
      shell: { score: null },
      fidelity: { score: null },
    })
    expect(r).toBeCloseTo(0.5)
  })

  it('weights composition heaviest', () => {
    const heavier = composite({ composition: { score: 1 }, hue: { score: 0 } })
    expect(heavier).toBeGreaterThan(0.5)
    expect(WEIGHTS.composition).toBeGreaterThan(WEIGHTS.hue)
  })

  it('returns null when nothing could be scored', () => {
    expect(composite({ composition: { score: null } })).toBeNull()
  })
})

describe('computeUniqueness', () => {
  const build = {
    date: '2026-08-26',
    composition: TUPLE,
    hue: 42,
    lane: 'swiss-poster',
    shell: SHELL,
  }

  it('trims history to the window', () => {
    const history = Array.from({ length: 20 }, (_, i) => ({
      date: `d${i}`,
      composition: { ...TUPLE, columns: 'masonry' },
      hue: 200,
      lane: 'other',
      shell: SHELL,
    }))
    expect(computeUniqueness(build, history).window).toBe(WINDOW)
  })

  it('scores a clone of yesterday at the floor', () => {
    const r = computeUniqueness(build, [{ ...build, date: '2026-08-25' }])
    expect(r.composite).toBe(0)
    expect(r.metrics.composition.raw).toBe(0)
    expect(r.metrics.hue.raw).toBe(0)
    expect(r.metrics.lane.raw).toBe(0)
    expect(r.metrics.shell.raw).toBe(0)
  })

  it('produces a composite for the very first build, with no history', () => {
    const r = computeUniqueness(build, [])
    expect(r.window).toBe(0)
    // Nothing is comparable, so nothing is scored.
    expect(r.composite).toBeNull()
    expect(r.metrics.composition.score).toBeNull()
  })

  it('still scores a legacy build that carries only a composition', () => {
    const legacy = { date: '2026-04-01', composition: TUPLE }
    const r = computeUniqueness(legacy, [
      { date: '2026-03-31', composition: { ...TUPLE, columns: 'masonry' } },
    ])
    expect(r.metrics.composition.score).toBeCloseTo(1 / AXIS_NAMES.length)
    expect(r.metrics.hue.score).toBeNull()
    expect(r.metrics.lane.score).toBeNull()
    // Shell still scores: posture rides on the composition tuple, and both
    // builds declare 'standard'. So the composite is composition and shell
    // renormalized over their two weights, not composition alone.
    expect(r.metrics.shell.score).toBe(0)
    const expected =
      ((1 / AXIS_NAMES.length) * WEIGHTS.composition) / (WEIGHTS.composition + WEIGHTS.shell)
    expect(r.composite).toBeCloseTo(expected)
  })

  it('stamps a version so the shape can change later', () => {
    // 2 since #255 added the geometry metric to the payload.
    expect(computeUniqueness(build, []).version).toBe(2)
  })

  it('does not throw on a wholly empty build', () => {
    const r = computeUniqueness({}, [])
    expect(r.composite).toBeNull()
    expect(r.date).toBeNull()
  })
})

describe('geometry, wired into the index (#255)', () => {
  const FINGERPRINT = {
    version: 1,
    viewport: { width: 1440, height: 900 },
    elements: [
      { class: 'hero', x: 0.0667, y: 0.3418, w: 0.4397, h: 0.3847 },
      { class: 'nav', x: 0.6411, y: 0.1067, w: 0.2922, h: 0.1644 },
      { class: 'mark', x: 0.0667, y: 0.1067, w: 0.0401, h: 0.0533 },
    ],
  }
  const MIRRORED = {
    ...FINGERPRINT,
    elements: FINGERPRINT.elements.map((e) => ({ ...e, x: 1 - e.x - e.w })),
  }

  it('carries a weight, under composition and over shell', () => {
    expect(WEIGHTS.geometry).toBeGreaterThan(0)
    expect(WEIGHTS.geometry).toBeLessThan(WEIGHTS.composition)
    expect(WEIGHTS.geometry).toBeGreaterThan(WEIGHTS.shell)
  })

  it('scores a repeated silhouette near zero even when the tuple is new', () => {
    const r = computeUniqueness(
      { date: '2026-08-30', composition: TUPLE, fingerprint: FINGERPRINT },
      [
        {
          date: '2026-08-23',
          composition: { ...TUPLE, columns: 'masonry', axis: 'radial', density: 'crowded' },
          fingerprint: FINGERPRINT,
        },
      ]
    )
    expect(r.metrics.composition.raw).toBe(3)
    expect(r.metrics.geometry.score).toBeLessThan(0.01)
    expect(r.metrics.geometry.nearest).toBe('2026-08-23')
  })

  it('scores a new silhouette high', () => {
    const r = computeUniqueness({ date: '2026-08-30', fingerprint: FINGERPRINT }, [
      { date: '2026-08-29', fingerprint: MIRRORED },
    ])
    expect(r.metrics.geometry.score).toBeGreaterThan(0.8)
  })

  it('degrades to null for a build with no fingerprint, like composition does', () => {
    const r = computeUniqueness({ date: '2026-08-30', composition: TUPLE }, [
      { date: '2026-08-29', composition: TUPLE },
    ])
    expect(r.metrics.geometry.score).toBeNull()
    expect(r.metrics.geometry.compared).toBe(0)
    expect(r.composite).not.toBeNull()
  })

  it('renormalizes the composite around a null geometry', () => {
    const withGeometry = computeUniqueness(
      { date: 'a', composition: TUPLE, fingerprint: FINGERPRINT },
      [{ date: 'b', composition: TUPLE, fingerprint: FINGERPRINT }]
    )
    const without = computeUniqueness({ date: 'a', composition: TUPLE }, [
      { date: 'b', composition: TUPLE },
    ])
    // Both repeat everything they can be compared on, so both score 0.
    expect(withGeometry.composite).toBeCloseTo(0)
    expect(without.composite).toBeCloseTo(0)
  })
})

describe('formatUniquenessForPrompt', () => {
  const idx = (metrics, composite = 0.2, window = 7) => ({
    date: '2026-08-25',
    window,
    metrics: {
      composition: { raw: null, score: null, nearest: null },
      hue: { raw: null, score: null, nearest: null },
      lane: { raw: null, score: null, lastSeen: null },
      shell: { raw: null, score: null, nearest: null },
      fidelity: { raw: null, score: null, checks: [] },
      ...metrics,
    },
    composite,
  })

  it('is empty when there is nothing to compare', () => {
    expect(formatUniquenessForPrompt(null)).toBe('')
    expect(formatUniquenessForPrompt(idx({}, null))).toBe('')
    expect(formatUniquenessForPrompt(idx({}, 0.5, 0))).toBe('')
  })

  it('names the repeated day and the axis', () => {
    const out = formatUniquenessForPrompt(
      idx({ composition: { raw: 0, score: 0, nearest: '2026-08-19' } })
    )
    expect(out).toContain('EXACT repeat of 2026-08-19')
    expect(out).toContain('Repetition Check')
  })

  it('reports a near-miss composition without calling it exact', () => {
    const out = formatUniquenessForPrompt(
      idx({ composition: { raw: 2, score: 0.25, nearest: '2026-08-20' } })
    )
    expect(out).toContain(`only 2 of ${AXIS_NAMES.length} axes`)
    expect(out).not.toContain('EXACT')
  })

  it('flags a hue that is too close', () => {
    const out = formatUniquenessForPrompt(idx({ hue: { raw: 12, score: 0.06, nearest: 'd' } }))
    expect(out).toContain('12°')
    expect(out).toContain('at least 60°')
  })

  it('stays quiet about a hue that is far enough', () => {
    const out = formatUniquenessForPrompt(idx({ hue: { raw: 120, score: 0.66, nearest: 'd' } }))
    expect(out).not.toContain('reads as the same color')
  })

  it('flags a back-to-back lane and an identical shell', () => {
    const out = formatUniquenessForPrompt(
      idx({
        lane: { raw: 0, score: 0, lastSeen: '2026-08-24' },
        shell: { raw: 0, score: 0, nearest: '2026-08-24' },
      })
    )
    expect(out).toContain('repeated 2026-08-24 back to back')
    expect(out).toContain('identical to 2026-08-24')
  })

  it('says so when nothing repeated', () => {
    const out = formatUniquenessForPrompt(
      idx({ composition: { raw: 6, score: 0.75, nearest: 'd' } }, 0.8)
    )
    expect(out).toContain('No axis repeated closely')
  })

  it('renders the composite as a percentage', () => {
    const out = formatUniquenessForPrompt(idx({}, 0.42))
    expect(out).toContain('42/100')
  })
})

describe('formatUniquenessForPrompt — the silhouette note (#255)', () => {
  const base = {
    date: '2026-08-30',
    window: 7,
    composite: 0.4,
    metrics: {
      composition: { raw: 6, score: 0.75, nearest: '2026-08-23', compared: 7 },
      hue: { raw: 90, score: 0.5, nearest: null, compared: 7 },
      lane: { raw: 4, score: 0.57, lastSeen: null, compared: 7 },
      shell: { raw: 2, score: 0.5, nearest: null, compared: 7 },
      geometry: { raw: 0.9, score: 0.9, nearest: '2026-08-23', compared: 7 },
      fidelity: { raw: null, score: null, checks: [] },
    },
  }

  it('raises no note when the silhouette moved', () => {
    expect(formatUniquenessForPrompt(base)).not.toMatch(/silhouette sat/)
    expect(formatUniquenessForPrompt(base)).toMatch(/No axis repeated closely/)
  })

  it('names the day whose silhouette was repeated', () => {
    const out = formatUniquenessForPrompt({
      ...base,
      metrics: {
        ...base.metrics,
        geometry: { raw: 0.08, score: 0.08, nearest: '2026-08-23', compared: 7 },
      },
    })
    expect(out).toMatch(/silhouette sat 8\/100 from 2026-08-23/)
    expect(out).toMatch(/measured off the built page/)
  })

  it('mentions the silhouette in the header sentence', () => {
    expect(formatUniquenessForPrompt(base)).toMatch(/the silhouette the page actually rendered/)
  })
})
