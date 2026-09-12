import { describe, expect, it } from 'vitest'
import { contrastRatio, relativeLuminance, rgbToHex } from '../../scripts/utils/contrast.js'

const WHITE = { r: 255, g: 255, b: 255 }
const BLACK = { r: 0, g: 0, b: 0 }

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance(BLACK)).toBe(0)
    expect(relativeLuminance(WHITE)).toBeCloseTo(1, 6)
  })

  it('weights green heaviest, per the WCAG coefficients', () => {
    const red = relativeLuminance({ r: 255, g: 0, b: 0 })
    const green = relativeLuminance({ r: 0, g: 255, b: 0 })
    const blue = relativeLuminance({ r: 0, g: 0, b: 255 })
    expect(red).toBeCloseTo(0.2126, 4)
    expect(green).toBeCloseTo(0.7152, 4)
    expect(blue).toBeCloseTo(0.0722, 4)
  })
})

describe('contrastRatio', () => {
  it('is 21:1 for black on white, either way round', () => {
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(21, 4)
    expect(contrastRatio(WHITE, BLACK)).toBeCloseTo(21, 4)
  })

  it('is 1:1 for a colour on itself', () => {
    expect(contrastRatio({ r: 26, g: 47, b: 26 }, { r: 26, g: 47, b: 26 })).toBe(1)
  })

  it('matches a known WCAG pair: #767676 on white is 4.54:1', () => {
    expect(contrastRatio({ r: 118, g: 118, b: 118 }, WHITE)).toBeCloseTo(4.54, 2)
  })

  it('reads a single-colour mark sunk into its ground as under the 3:1 floor', () => {
    // The 2026-09-09 shape: a near-black green mark on a deep emerald field.
    expect(contrastRatio({ r: 26, g: 47, b: 26 }, { r: 11, g: 61, b: 46 })).toBeLessThan(3)
  })
})

describe('rgbToHex', () => {
  it('formats channels as #rrggbb', () => {
    expect(rgbToHex({ r: 26, g: 47, b: 26 })).toBe('#1a2f1a')
    expect(rgbToHex(WHITE)).toBe('#ffffff')
  })

  it('rounds and clamps fractional or out-of-range channels', () => {
    expect(rgbToHex({ r: 25.6, g: 300, b: -4 })).toBe('#1aff00')
  })
})
