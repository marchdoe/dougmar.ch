import { describe, it, expect } from 'vitest'
import { CHASSIS_CATALOG } from '../../elements/chassis/index.js'
import {
  TYPE_FIELDS,
  TYPE_FIELD_NAMES,
  formatTypeTreatment,
  isValidTypeTreatment,
} from '../../scripts/utils/type-grammar.js'
import { parseTypeTreatmentBlock } from '../../scripts/utils/spec-blocks.js'
import { parseDelimiterResponse } from '../../scripts/utils/delimiter-parser.js'

const BLOCK = [
  'case: caps',
  'lead: roman',
  'weight: heavy',
  'alignment: left',
  'texture: stacked',
].join('\n')

const chassis = (id) => CHASSIS_CATALOG.find((c) => c.id === id)
const valid = (over = {}) => ({ ...parseTypeTreatmentBlock(BLOCK), ...over })

describe('parseTypeTreatmentBlock', () => {
  it('reads every field, normalizing the enumerated values', () => {
    expect(parseTypeTreatmentBlock(BLOCK)).toEqual({
      case: 'caps',
      lead: 'roman',
      weight: 'heavy',
      alignment: 'left',
      texture: 'stacked',
    })
  })

  it('lowercases what the Art Director capitalized', () => {
    expect(parseTypeTreatmentBlock('case: Small-Caps\nlead: Italic').case).toBe('small-caps')
    expect(parseTypeTreatmentBlock('case: Small-Caps\nlead: Italic').lead).toBe('italic')
  })

  it('returns nulls rather than throwing on a missing block', () => {
    const t = parseTypeTreatmentBlock(undefined)
    for (const field of TYPE_FIELD_NAMES) expect(t[field]).toBeNull()
  })
})

describe('parseDelimiterResponse: ===TYPE_TREATMENT===', () => {
  it('captures the block between HEADER and MOBILE', () => {
    const raw = [
      '===HEADER===',
      'placement: top-bar',
      '===TYPE_TREATMENT===',
      BLOCK,
      '===MOBILE===',
      'carrier: the phrase',
    ].join('\n')
    const p = parseDelimiterResponse(raw)
    expect(p.header).toBe('placement: top-bar')
    expect(p.type_treatment).toBe(BLOCK)
    expect(p.mobile).toBe('carrier: the phrase')
  })

  it('leaves type_treatment undefined when the block is absent', () => {
    expect(
      parseDelimiterResponse('===HERO_COPY===\nx\n===RATIONALE===\ny').type_treatment
    ).toBeUndefined()
  })
})

describe('the vocabulary', () => {
  it('has the five fields in canonical order', () => {
    expect(TYPE_FIELD_NAMES).toEqual(['case', 'lead', 'weight', 'alignment', 'texture'])
  })

  it('carries the values the prompt names', () => {
    expect(TYPE_FIELDS.case).toEqual(['mixed', 'caps', 'lower', 'small-caps'])
    expect(TYPE_FIELDS.lead).toEqual(['roman', 'italic'])
    expect(TYPE_FIELDS.weight).toEqual(['light', 'regular', 'heavy'])
    expect(TYPE_FIELDS.alignment).toEqual(['left', 'centred', 'right', 'justified'])
    expect(TYPE_FIELDS.texture).toEqual([
      'none',
      'type-as-texture',
      'vertical',
      'outline',
      'stacked',
    ])
  })
})

describe('isValidTypeTreatment', () => {
  it('accepts a complete declaration with no chassis in context', () => {
    expect(isValidTypeTreatment(valid())).toEqual({ valid: true, errors: [] })
  })

  it('rejects anything that is not an object', () => {
    expect(isValidTypeTreatment(null).valid).toBe(false)
    expect(isValidTypeTreatment(['caps']).valid).toBe(false)
  })

  it('names every missing field', () => {
    const { errors } = isValidTypeTreatment({})
    for (const field of TYPE_FIELD_NAMES) {
      expect(errors.join('\n')).toContain(`missing field: ${field}`)
    }
  })

  it('rejects a value outside a field vocabulary and lists the vocabulary', () => {
    const { valid: ok, errors } = isValidTypeTreatment(valid({ texture: 'glitter' }))
    expect(ok).toBe(false)
    expect(errors.join('\n')).toMatch(
      /invalid texture: "glitter" \(expected one of: none, type-as-texture, vertical, outline, stacked\)/
    )
  })

  it('rejects an italic lead on a chassis whose display face loads no italic, naming the ones that do', () => {
    const { errors } = isValidTypeTreatment(valid({ lead: 'italic' }), {
      chassis: chassis('unbounded-figtree'),
    })
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('unbounded-figtree loads none')
    for (const id of ['spectral-albert', 'fraunces-karla', 'anybody-franklin']) {
      expect(errors[0]).toContain(id)
    }
    expect(errors[0]).not.toContain('unbounded-figtree,')
  })

  it('accepts an italic lead on a chassis that loads display italics', () => {
    expect(
      isValidTypeTreatment(valid({ lead: 'italic' }), { chassis: chassis('spectral-albert') }).valid
    ).toBe(true)
  })

  it('rejects a weight extreme on a single-weight display face, naming the weight', () => {
    for (const weight of ['light', 'heavy']) {
      const { errors } = isValidTypeTreatment(valid({ weight }), {
        chassis: chassis('anton-inter-tight'),
      })
      expect(errors).toHaveLength(1)
      expect(errors[0]).toContain(`weight: ${weight}`)
      expect(errors[0]).toContain('loads a single weight (400)')
    }
  })

  it('accepts regular on a single-weight face and any weight on a multi-weight face', () => {
    expect(
      isValidTypeTreatment(valid({ weight: 'regular' }), { chassis: chassis('bebas-plex') }).valid
    ).toBe(true)
    for (const weight of ['light', 'regular', 'heavy']) {
      expect(
        isValidTypeTreatment(valid({ weight }), { chassis: chassis('fraunces-karla') }).valid
      ).toBe(true)
    }
  })

  it('reports both chassis errors at once', () => {
    const { errors } = isValidTypeTreatment(valid({ lead: 'italic', weight: 'light' }), {
      chassis: chassis('bebas-plex'),
    })
    expect(errors).toHaveLength(2)
  })

  it('accepts every value of every field on a chassis that loads italics and three weights', () => {
    const roomy = chassis('fraunces-karla')
    for (const [field, values] of Object.entries(TYPE_FIELDS)) {
      for (const value of values) {
        expect(isValidTypeTreatment(valid({ [field]: value }), { chassis: roomy }).valid).toBe(true)
      }
    }
  })
})

describe('formatTypeTreatment', () => {
  it('round-trips through parseTypeTreatmentBlock', () => {
    const parsed = parseTypeTreatmentBlock(BLOCK)
    expect(parseTypeTreatmentBlock(formatTypeTreatment(parsed))).toEqual(parsed)
    expect(formatTypeTreatment(parsed)).toBe(BLOCK)
  })

  it('writes a question mark rather than dropping an absent field', () => {
    expect(formatTypeTreatment({ case: 'lower' })).toContain('texture: ?')
  })
})
