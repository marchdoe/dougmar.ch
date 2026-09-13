import { describe, it, expect } from 'vitest'
import { RAMP_STEPS as CHASSIS_RAMP_STEPS } from '../../elements/chassis/scale.js'
import {
  HEADER_FIELDS,
  HEADER_FIELD_NAMES,
  PLACEMENT_BY_POSTURE,
  RAMP_STEPS,
  formatHeader,
  isValidHeader,
} from '../../scripts/utils/header-grammar.js'
import { parseHeaderBlock } from '../../scripts/utils/spec-blocks.js'
import { parseDelimiterResponse } from '../../scripts/utils/delimiter-parser.js'

const BLOCK = [
  'placement: top-bar',
  'height_px: 96',
  'mark_px: 40',
  'wordmark_step: lg',
  'wordmark_weight: 600',
  'role_line: present',
  'nav_step: sm',
  'nav_case: upper',
  'nav_form: labels',
  'nav: thin rule, flush-right links',
].join('\n')

const valid = (over = {}) => ({ ...parseHeaderBlock(BLOCK), ...over })
const ctx = { shellPosture: 'standard', brandLockup: 'horizontal-md' }

describe('parseHeaderBlock', () => {
  it('reads every field, normalizing the enumerated ones', () => {
    const h = parseHeaderBlock(BLOCK)
    expect(h).toEqual({
      placement: 'top-bar',
      height_px: 96,
      mark_px: 40,
      wordmark_step: 'lg',
      wordmark_weight: 600,
      role_line: 'present',
      nav_step: 'sm',
      nav_case: 'upper',
      nav_form: 'labels',
      nav: 'thin rule, flush-right links',
    })
  })

  it('lowercases enumerated values but leaves the nav prose alone', () => {
    const h = parseHeaderBlock('placement: Left-Rail\nnav: A Thin Corner Mark')
    expect(h.placement).toBe('left-rail')
    expect(h.nav).toBe('A Thin Corner Mark')
  })

  it('pulls the integer out of a value that carries a unit', () => {
    expect(parseHeaderBlock('height_px: 96px\nmark_px: 44 px').height_px).toBe(96)
    expect(parseHeaderBlock('mark_px: 44px').mark_px).toBe(44)
  })

  it('returns nulls rather than throwing on a missing block', () => {
    const h = parseHeaderBlock(undefined)
    for (const field of HEADER_FIELD_NAMES) expect(h[field]).toBeNull()
  })
})

describe('parseDelimiterResponse — ===HEADER===', () => {
  it('captures the block and keeps SHELL separate', () => {
    const raw = [
      '===SHELL===',
      'footer: data strip',
      'brand_lockup: horizontal-md',
      '===HEADER===',
      BLOCK,
      '===COMPOSITION===',
      'columns: single',
    ].join('\n')
    const p = parseDelimiterResponse(raw)
    expect(p.shell).toContain('brand_lockup: horizontal-md')
    expect(p.shell).not.toContain('placement:')
    expect(p.header).toContain('placement: top-bar')
    expect(p.composition).toBe('columns: single')
  })

  it('terminates a FILE block at HEADER', () => {
    const raw = ['===FILE:mockup.html===', '<html></html>', '===HEADER===', BLOCK].join('\n')
    const p = parseDelimiterResponse(raw)
    expect(p.files[0].content).toBe('<html></html>')
    expect(p.header).toContain('nav_case: upper')
  })

  it('leaves header undefined when the block is absent', () => {
    expect(parseDelimiterResponse('===HERO_COPY===\nx\n===RATIONALE===\ny').header).toBeUndefined()
  })
})

describe('isValidHeader', () => {
  it('accepts a complete, self-consistent declaration', () => {
    expect(isValidHeader(valid(), ctx)).toEqual({ valid: true, errors: [] })
  })

  it('names every missing enumerated field', () => {
    const { errors } = isValidHeader({}, {})
    for (const field of Object.keys(HEADER_FIELDS)) {
      expect(errors.join('\n')).toContain(`missing field: ${field}`)
    }
  })

  it('rejects a value outside an axis vocabulary', () => {
    const { valid: ok, errors } = isValidHeader(valid({ placement: 'floating-orb' }), ctx)
    expect(ok).toBe(false)
    expect(errors.join('\n')).toMatch(/invalid placement: "floating-orb"/)
  })

  it('rejects a nav_case the critics cannot check', () => {
    expect(isValidHeader(valid({ nav_case: 'sentence' }), ctx).valid).toBe(false)
  })

  it('requires a nav_form and rejects one outside the five forms (#501)', () => {
    expect(isValidHeader(valid({ nav_form: null }), ctx).errors).toContain(
      'missing field: nav_form'
    )
    expect(isValidHeader(valid({ nav_form: 'pills' }), ctx).errors.join('\n')).toMatch(
      /invalid nav_form: "pills"/
    )
    for (const form of HEADER_FIELDS.nav_form) {
      expect(isValidHeader(valid({ nav_form: form }), ctx).valid).toBe(true)
    }
  })

  it('accepts every ramp step for the nav', () => {
    for (const step of RAMP_STEPS) {
      expect(isValidHeader(valid({ nav_step: step }), ctx).valid).toBe(true)
    }
  })

  it("is the chassis ramp minus 'hero', not a hand-kept copy of it", () => {
    expect(RAMP_STEPS).toEqual(CHASSIS_RAMP_STEPS.filter((s) => s !== 'hero'))
    expect(RAMP_STEPS).not.toContain('hero')
  })

  it('requires a numeric height and mark size', () => {
    expect(isValidHeader(valid({ height_px: null }), ctx).errors).toContain(
      'missing numeric height_px'
    )
    expect(isValidHeader(valid({ mark_px: null }), ctx).errors).toContain('missing numeric mark_px')
  })

  it('rejects a header too short to be one', () => {
    expect(isValidHeader(valid({ height_px: 12 }), ctx).errors.join('\n')).toMatch(/outside 32–800/)
  })

  it('requires height_px 0 when there is no header, and rejects anything else', () => {
    const none = { shellPosture: 'none', brandLockup: 'horizontal-md' }
    expect(isValidHeader(valid({ placement: 'none', height_px: 0 }), none).valid).toBe(true)
    expect(
      isValidHeader(valid({ placement: 'none', height_px: 64 }), none).errors.join('\n')
    ).toMatch(/height_px must be 0 when placement is none/)
  })

  it('rejects a mark_px outside the declared lockup band', () => {
    // The 2026-08-30 failure, caught at declaration time rather than in pixels.
    const { errors } = isValidHeader(valid({ mark_px: 11 }), ctx)
    expect(errors.join('\n')).toMatch(/mark_px 11 is outside the horizontal-md band \(32–48px\)/)
  })

  it('accepts both ends of a band and rejects one past it', () => {
    expect(isValidHeader(valid({ mark_px: 32 }), ctx).valid).toBe(true)
    expect(isValidHeader(valid({ mark_px: 48 }), ctx).valid).toBe(true)
    expect(isValidHeader(valid({ mark_px: 49 }), ctx).valid).toBe(false)
  })

  it('skips the band check for a lockup id that is not in the contract', () => {
    const off = { shellPosture: 'standard', brandLockup: 'diagonal-xl' }
    expect(isValidHeader(valid({ mark_px: 400 }), off).valid).toBe(true)
  })

  it('rejects a wordmark_weight outside 100-900', () => {
    expect(isValidHeader(valid({ wordmark_weight: 1200 }), ctx).valid).toBe(false)
    expect(isValidHeader(valid({ wordmark_weight: 100 }), ctx).valid).toBe(true)
  })

  it('rejects a placement that contradicts the shell posture', () => {
    const { errors } = isValidHeader(valid({ placement: 'top-bar' }), {
      ...ctx,
      shellPosture: 'none',
    })
    expect(errors.join('\n')).toMatch(/contradicts shell_posture "none"/)
  })

  it('accepts every placement its posture admits', () => {
    for (const [posture, placements] of Object.entries(PLACEMENT_BY_POSTURE)) {
      for (const placement of placements) {
        const height = placement === 'none' ? 0 : 96
        const result = isValidHeader(valid({ placement, height_px: height }), {
          ...ctx,
          shellPosture: posture,
        })
        expect(result.errors.join('\n')).not.toMatch(/contradicts shell_posture/)
      }
    }
  })

  it('requires wordmark_step: none for a mark-only lockup, and a step otherwise', () => {
    const markOnly = { shellPosture: 'standard', brandLockup: 'mark-only-md' }
    expect(
      isValidHeader(valid({ wordmark_step: 'lg', mark_px: 44 }), markOnly).errors.join('\n')
    ).toMatch(/wordmark_step must be none for mark-only-md/)
    expect(isValidHeader(valid({ wordmark_step: 'none', mark_px: 44 }), markOnly).valid).toBe(true)
    expect(isValidHeader(valid({ wordmark_step: 'none' }), ctx).errors.join('\n')).toMatch(
      /must be a ramp step for horizontal-md/
    )
  })
})

describe('formatHeader', () => {
  it('round-trips through parseHeaderBlock', () => {
    expect(parseHeaderBlock(formatHeader(parseHeaderBlock(BLOCK)))).toEqual(parseHeaderBlock(BLOCK))
  })

  it('writes a question mark rather than dropping an absent field', () => {
    expect(formatHeader({ placement: 'corner' })).toContain('mark_px: ?')
  })
})
