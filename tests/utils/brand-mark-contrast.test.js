/**
 * The owner's colour-mode rule (2026-10-18): the full-colour mark unless it
 * fails WCAG 1.4.11 on its ground. Ratios worked by hand from the WCAG
 * luminance formula and pinned to two decimals.
 */
import { describe, expect, it } from 'vitest'
import {
  formatMarkRatio,
  MARK_CONTRAST_MIN,
  originalMarkContrast,
} from '../../scripts/utils/brand-mark-contrast.js'

const hex = (s) => ({
  r: Number.parseInt(s.slice(1, 3), 16),
  g: Number.parseInt(s.slice(3, 5), 16),
  b: Number.parseInt(s.slice(5, 7), 16),
})

describe('originalMarkContrast', () => {
  it('uses the WCAG 1.4.11 floor of 3:1', () => {
    expect(MARK_CONTRAST_MIN).toBe(3)
  })

  it.each([
    // ground, passes, the colour that carries it, best ratio
    ['white', '#FFFFFF', true, 'blue', 3.61],
    ['cream', '#F5EFE0', true, 'blue', 3.15],
    ['dark navy', '#0B1A33', true, 'white disc', 17.36],
    ['mid grey', '#999999', false, 'white disc', 2.85],
    ['pale blue', '#A8D8F0', false, 'blue', 2.37],
    ['saturated green', '#3DBE5A', false, 'white disc', 2.41],
  ])('%s (%s): passes=%s, best is the %s at %s:1', (_n, ground, passes, name, ratio) => {
    const t = originalMarkContrast(hex(ground))
    expect(t.passes).toBe(passes)
    expect(t.best.name).toBe(name)
    expect(t.best.ratio).toBeCloseTo(ratio, 2)
  })

  it('reports all three defining colours, disc then green then blue', () => {
    const t = originalMarkContrast(hex('#FFFFFF'))
    expect(t.ratios.map((r) => [r.name, r.hex])).toEqual([
      ['white disc', '#ffffff'],
      ['green', '#7ac042'],
      ['blue', '#008ed3'],
    ])
    expect(t.ratios[0].ratio).toBe(1)
    expect(t.ratios[1].ratio).toBeCloseTo(2.22, 2)
  })

  it('passes a mid grey one step darker on the disc alone (#888888, 3.54:1)', () => {
    const t = originalMarkContrast(hex('#888888'))
    expect(t.passes).toBe(true)
    expect(t.best).toMatchObject({ name: 'white disc' })
    expect(t.best.ratio).toBeCloseTo(3.54, 2)
  })
})

describe('formatMarkRatio', () => {
  it('rounds down, so a miss never prints as the floor', () => {
    expect(formatMarkRatio(2.97)).toBe('2.9')
    expect(formatMarkRatio(3.61)).toBe('3.6')
    expect(formatMarkRatio(17.36)).toBe('17.3')
  })
})
