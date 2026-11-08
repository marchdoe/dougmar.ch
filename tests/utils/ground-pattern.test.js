import { describe, expect, it } from 'vitest'
import { classifyGroundPattern } from '../../scripts/utils/ground-pattern.js'
import { findPatternedGrounds, formatFindings } from '../../scripts/utils/token-gate.js'

const DOT = 'radial-gradient(circle, rgb(0, 0, 0) 1.5px, rgba(0, 0, 0, 0) 1.8px)'

describe('classifyGroundPattern', () => {
  it('calls a repeating gradient a pattern, whichever kind', () => {
    for (const kind of ['linear', 'radial', 'conic']) {
      expect(classifyGroundPattern(`repeating-${kind}-gradient(red 0 1px, blue 1px 24px)`)).toBe(
        'repeating-gradient'
      )
    }
  })

  it('calls a radial-gradient tiled under 40px a dot tile, and 40px or more nothing', () => {
    expect(classifyGroundPattern(DOT, '20px 20px')).toBe('dot-tile')
    expect(classifyGroundPattern(DOT, '39.5px')).toBe('dot-tile')
    expect(classifyGroundPattern(DOT, '40px 40px')).toBeNull()
    expect(classifyGroundPattern(DOT, 'auto')).toBeNull()
    expect(classifyGroundPattern(DOT)).toBeNull()
  })

  it('reads the size that belongs to the layer, repeating the list as CSS does', () => {
    const image = `linear-gradient(red, blue), ${DOT}`
    expect(classifyGroundPattern(image, '100% 100%, 8px 8px')).toBe('dot-tile')
    expect(classifyGroundPattern(image, '100% 100%')).toBeNull()
  })

  it('calls three positioned blooms a mesh, and two or one nothing', () => {
    const bloom = (at) => `radial-gradient(at ${at}, red 0, transparent 40%)`
    expect(classifyGroundPattern([bloom('1% 1%'), bloom('2% 2%'), bloom('3% 3%')].join(', '))).toBe(
      'blooms'
    )
    expect(classifyGroundPattern([bloom('1% 1%'), bloom('2% 2%')].join(', '))).toBeNull()
    expect(classifyGroundPattern(bloom('1% 1%'))).toBeNull()
  })

  it('leaves a sized orb, a plain linear gradient and a missing value alone', () => {
    expect(classifyGroundPattern('radial-gradient(circle at 38% 36%, red 0, blue 66%)')).toBeNull()
    expect(classifyGroundPattern('linear-gradient(to bottom, red, blue)')).toBeNull()
    expect(classifyGroundPattern('none')).toBeNull()
    expect(classifyGroundPattern(null)).toBeNull()
  })
})

describe('findPatternedGrounds (the token gate, on source)', () => {
  it('pairs a radial-gradient with the tile size in the same css()', () => {
    const src = `css({ backgroundImage: 'radial-gradient(circle, {colors.accent} 1.5px, transparent 1.8px)', backgroundSize: '20px 20px' })`
    expect(findPatternedGrounds(src)).toEqual([
      expect.objectContaining({ property: 'backgroundImage', pattern: 'dot-tile' }),
    ])
  })

  it('finds a repeating gradient and a mesh, in css() and in a style prop', () => {
    expect(
      findPatternedGrounds(
        `css({ background: 'repeating-linear-gradient(to bottom, red 0 1px, transparent 1px 24px)' })`
      )
    ).toHaveLength(1)
    const mesh =
      'radial-gradient(at 1% 1%, red 0, transparent 40%), radial-gradient(at 2% 2%, red 0, transparent 40%), radial-gradient(at 3% 3%, red 0, transparent 40%)'
    expect(findPatternedGrounds(`<div style={{ backgroundImage: '${mesh}' }} />`)).toHaveLength(1)
  })

  it('leaves plain gradients and commented-out code alone', () => {
    expect(findPatternedGrounds(`css({ backgroundImage: 'linear-gradient(red, blue)' })`)).toEqual(
      []
    )
    expect(
      findPatternedGrounds(
        `// css({ background: 'repeating-linear-gradient(red, blue)' })\nconst x = 1`
      )
    ).toEqual([])
  })

  it('tells the engineer what to do instead, without the token-reference preamble', () => {
    const msg = formatFindings([
      {
        kind: 'patterned-ground',
        property: 'backgroundImage',
        value: 'repeating-linear-gradient(red, blue)',
        pattern: 'repeating-gradient',
        files: ['app/components/generated/Hero.tsx'],
      },
    ])
    expect(msg).toContain('app/components/generated/Hero.tsx')
    expect(msg).toContain('flat token colour')
    expect(msg).not.toContain('did not resolve')
  })
})
