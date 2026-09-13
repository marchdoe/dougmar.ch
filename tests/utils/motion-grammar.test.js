import { describe, it, expect } from 'vitest'
import {
  MOTION_FIELDS,
  MOTION_FIELD_NAMES,
  STILL_MOTION,
  formatMotion,
  hasFirstPaintMotion,
  isValidMotion,
  wantsMotionReference,
} from '../../scripts/utils/motion-grammar.js'
import { parseMotionBlock } from '../../scripts/utils/spec-blocks.js'
import { parseDelimiterResponse } from '../../scripts/utils/delimiter-parser.js'

const BLOCK = ['entrance: rise', 'ground: drift', 'reveal: on-scroll'].join('\n')

const valid = (over = {}) => ({ ...parseMotionBlock(BLOCK), ...over })

describe('parseMotionBlock', () => {
  it('reads every field, normalizing the enumerated values', () => {
    expect(parseMotionBlock(BLOCK)).toEqual({
      entrance: 'rise',
      ground: 'drift',
      reveal: 'on-scroll',
    })
  })

  it('lowercases what the Art Director capitalized and drops a trailing comment', () => {
    const t = parseMotionBlock('entrance: Wipe   # left to right\nground: Static\nreveal: None')
    expect(t).toEqual({ entrance: 'wipe', ground: 'static', reveal: 'none' })
  })

  it('returns nulls rather than throwing on a missing block', () => {
    const t = parseMotionBlock(undefined)
    for (const field of MOTION_FIELD_NAMES) expect(t[field]).toBeNull()
  })
})

describe('parseDelimiterResponse: ===MOTION===', () => {
  it('captures the block between MOBILE and COMPOSITION', () => {
    const raw = [
      '===MOBILE===',
      'carrier: the phrase',
      '===MOTION===',
      BLOCK,
      '===COMPOSITION===',
      'columns: single',
    ].join('\n')
    const p = parseDelimiterResponse(raw)
    expect(p.mobile).toBe('carrier: the phrase')
    expect(p.motion).toBe(BLOCK)
    expect(p.composition).toBe('columns: single')
  })

  it('leaves motion undefined when the block is absent', () => {
    expect(parseDelimiterResponse('===HERO_COPY===\nx\n===RATIONALE===\ny').motion).toBeUndefined()
  })
})

describe('the vocabulary', () => {
  it('has the three fields in canonical order', () => {
    expect(MOTION_FIELD_NAMES).toEqual(['entrance', 'ground', 'reveal'])
  })

  it('carries the values the prompt names', () => {
    expect(MOTION_FIELDS.entrance).toEqual(['none', 'settle', 'rise', 'wipe'])
    expect(MOTION_FIELDS.ground).toEqual(['static', 'drift'])
    expect(MOTION_FIELDS.reveal).toEqual(['none', 'on-scroll'])
  })

  it('names the still page every field accepts', () => {
    expect(isValidMotion(STILL_MOTION)).toEqual({ valid: true, errors: [] })
    expect(hasFirstPaintMotion(STILL_MOTION)).toBe(false)
  })
})

describe('isValidMotion', () => {
  it('accepts a complete declaration', () => {
    expect(isValidMotion(valid())).toEqual({ valid: true, errors: [] })
  })

  it('rejects anything that is not an object', () => {
    expect(isValidMotion(null).valid).toBe(false)
    expect(isValidMotion(['rise']).valid).toBe(false)
  })

  it('names every missing field', () => {
    const { errors } = isValidMotion({})
    for (const field of MOTION_FIELD_NAMES) {
      expect(errors.join('\n')).toContain(`missing field: ${field}`)
    }
  })

  it('rejects a value outside a field vocabulary and lists the vocabulary', () => {
    const { valid: ok, errors } = isValidMotion(valid({ entrance: 'bounce' }))
    expect(ok).toBe(false)
    expect(errors.join('\n')).toMatch(
      /invalid entrance: "bounce" \(expected one of: none, settle, rise, wipe\)/
    )
  })

  it('accepts every value of every field', () => {
    for (const [field, values] of Object.entries(MOTION_FIELDS)) {
      for (const value of values) {
        expect(isValidMotion(valid({ [field]: value })).valid).toBe(true)
      }
    }
  })
})

describe('formatMotion', () => {
  it('round-trips through parseMotionBlock', () => {
    const parsed = parseMotionBlock(BLOCK)
    expect(parseMotionBlock(formatMotion(parsed))).toEqual(parsed)
    expect(formatMotion(parsed)).toBe(BLOCK)
  })

  it('writes a question mark rather than dropping an absent field', () => {
    expect(formatMotion({ entrance: 'rise' })).toContain('reveal: ?')
  })
})

describe('hasFirstPaintMotion: the guard on the frame strip', () => {
  it('is true for any entrance or a drifting ground', () => {
    expect(hasFirstPaintMotion({ entrance: 'settle', ground: 'static', reveal: 'none' })).toBe(true)
    expect(hasFirstPaintMotion({ entrance: 'none', ground: 'drift', reveal: 'none' })).toBe(true)
  })

  it('ignores reveal, which is below the fold', () => {
    expect(hasFirstPaintMotion({ entrance: 'none', ground: 'static', reveal: 'on-scroll' })).toBe(
      false
    )
  })

  it('reads a missing declaration as a still page', () => {
    expect(hasFirstPaintMotion(null)).toBe(false)
    expect(hasFirstPaintMotion(undefined)).toBe(false)
    expect(hasFirstPaintMotion({ entrance: null, ground: null, reveal: null })).toBe(false)
  })
})

describe('wantsMotionReference: when the engineer gets motion-design.md', () => {
  it('is true for an entrance or a reveal, not for a drift alone', () => {
    expect(wantsMotionReference({ entrance: 'rise', ground: 'static', reveal: 'none' })).toBe(true)
    expect(wantsMotionReference({ entrance: 'none', ground: 'static', reveal: 'on-scroll' })).toBe(
      true
    )
    expect(wantsMotionReference({ entrance: 'none', ground: 'drift', reveal: 'none' })).toBe(false)
    expect(wantsMotionReference(STILL_MOTION)).toBe(false)
    expect(wantsMotionReference(null)).toBe(false)
  })
})
