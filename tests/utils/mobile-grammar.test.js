import { describe, expect, it } from 'vitest'
import { COMPOSITION_AXES } from '../../scripts/utils/composition-grammar.js'
import {
  COLLAPSE_RULES,
  HERO_STEPS_360,
  MOBILE_FIELD_NAMES,
  formatMobile,
  hadRail,
  heroBelowFold,
  isValidMobile,
  namesHero,
  parseOrder,
} from '../../scripts/utils/mobile-grammar.js'
import { parseMobileBlock } from '../../scripts/utils/spec-blocks.js'

const HERO = 'Select a busy man.'

const BLOCK = [
  'carrier: The gold field with SELECT A BUSY MAN carries the page; the ledger follows as evidence.',
  'first_fold: The mark, then "Select a busy man." at hero step, then the consequence clause.',
  'order: gold field, nav row, ledger, work, footer',
  'hero_step_360: hero',
  'nav_360: one lowercase row under the mark',
].join('\n')

const valid = (over = {}) => ({ ...parseMobileBlock(BLOCK), ...over })
const ctx = {
  collapse: 'split-to-sequence',
  shellPosture: 'marginal',
  columns: 'two-asymmetric',
  placement: 'right-margin',
  heroCopy: HERO,
}

describe('vocabulary', () => {
  it('names the five fields in emission order', () => {
    expect(MOBILE_FIELD_NAMES).toEqual([
      'carrier',
      'first_fold',
      'order',
      'hero_step_360',
      'nav_360',
    ])
  })

  it('admits the fluid display steps and nothing below 2xl', () => {
    expect(HERO_STEPS_360).toEqual(['hero', '5xl', '4xl', '3xl', '2xl'])
  })

  it('validates against every collapse value the grammar defines', () => {
    for (const collapse of COMPOSITION_AXES.collapse) {
      // A rail-y, split composition with the hero named in the fold satisfies all five.
      expect(isValidMobile(valid(), { ...ctx, collapse }).valid, collapse).toBe(true)
    }
  })
})

describe('namesHero / heroBelowFold', () => {
  it('matches the phrase, its opening words, or the word hero', () => {
    expect(namesHero('the mark, then "Select a busy man." set large', HERO)).toBe(true)
    expect(namesHero('SELECT A BUSY MAN fills the fold', HERO)).toBe(true)
    expect(namesHero('the hero phrase at 4xl', 'anything')).toBe(true)
    expect(namesHero('a nav row and three signal cards', HERO)).toBe(false)
    expect(namesHero(null, HERO)).toBe(false)
  })

  it('reads a deliberate below-the-fold clause', () => {
    expect(heroBelowFold('the score leads; the hero sits below the fold on purpose')).toBe(true)
    expect(heroBelowFold('the hero under the fold so the date leads')).toBe(true)
    expect(heroBelowFold('the hero at the top')).toBe(false)
  })
})

describe('COLLAPSE_RULES / hadRail', () => {
  it('has a rule for every collapse value that can contradict the composition, and none for the rest', () => {
    expect(Object.keys(COLLAPSE_RULES).sort()).toEqual([
      'hero-only',
      'rail-to-band',
      'split-to-sequence',
    ])
    expect(COLLAPSE_RULES.stack).toBeUndefined()
    expect(COLLAPSE_RULES.reorder).toBeUndefined()
  })

  it('reads a rail off the posture, the columns, or the header placement', () => {
    expect(hadRail({ shellPosture: 'marginal' })).toBe(true)
    expect(hadRail({ columns: 'two-asymmetric' })).toBe(true)
    expect(hadRail({ placement: 'right-margin' })).toBe(true)
    expect(hadRail({ shellPosture: 'standard', columns: 'single', placement: 'top-bar' })).toBe(
      false
    )
    expect(hadRail({})).toBe(false)
  })

  it('hero-only passes only when the fold names the hero and keeps it above the fold', () => {
    const rule = COLLAPSE_RULES['hero-only']
    expect(rule({}, { named: true, below: false })).toEqual([])
    expect(rule({}, { named: true, below: true })).toHaveLength(1)
    expect(rule({}, { named: false, below: false })).toHaveLength(1)
  })

  it('split-to-sequence fails only on a single column', () => {
    const rule = COLLAPSE_RULES['split-to-sequence']
    expect(rule({ columns: 'two-equal' }, {})).toEqual([])
    expect(rule({ columns: 'single' }, {})[0]).toMatch(/columns "single"/)
  })
})

describe('parseOrder', () => {
  it('splits on commas and drops empties', () => {
    expect(parseOrder(' hero , ledger,, work ')).toEqual(['hero', 'ledger', 'work'])
    expect(parseOrder(null)).toEqual([])
  })
})

describe('isValidMobile', () => {
  it('accepts a complete, consistent block', () => {
    expect(isValidMobile(valid(), ctx)).toEqual({ valid: true, errors: [] })
  })

  it('rejects non-objects', () => {
    for (const bad of [null, undefined, 'carrier: x', 42, []]) {
      expect(isValidMobile(bad, ctx).valid, JSON.stringify(bad)).toBe(false)
    }
  })

  it('names every missing field', () => {
    const { valid: ok, errors } = isValidMobile(parseMobileBlock(''), ctx)
    expect(ok).toBe(false)
    for (const field of MOBILE_FIELD_NAMES) expect(errors).toContain(`missing field: ${field}`)
  })

  it('rejects a hero step below the display register and lists the alternatives', () => {
    const { errors } = isValidMobile(valid({ hero_step_360: 'lg' }), ctx)
    expect(errors[0]).toMatch(/invalid hero_step_360: "lg"/)
    expect(errors[0]).toMatch(/hero, 5xl, 4xl, 3xl, 2xl/)
  })

  it('rejects an order with a single zone', () => {
    const { errors } = isValidMobile(valid({ order: 'everything' }), ctx)
    expect(errors).toContainEqual(expect.stringMatching(/order names 1 zone; at least 2/))
  })

  it('rejects a first fold that neither names the hero nor explains its absence', () => {
    const { errors } = isValidMobile(valid({ first_fold: 'a nav row and the ledger' }), ctx)
    expect(errors).toContainEqual(expect.stringMatching(/first_fold must name the hero phrase/))
  })

  it('accepts a first fold that puts the hero below the fold for a stated reason', () => {
    const r = isValidMobile(
      valid({
        first_fold:
          'The score and the date lead; the hero sits below the fold so the win lands first.',
      }),
      { ...ctx, collapse: 'reorder' }
    )
    expect(r.valid).toBe(true)
  })

  it('rejects hero-only when the first fold puts the hero below the fold', () => {
    const r = isValidMobile(
      valid({ first_fold: 'The nav and the score; the hero sits below the fold.' }),
      { ...ctx, collapse: 'hero-only' }
    )
    expect(r.valid).toBe(false)
    expect(r.errors).toContainEqual(expect.stringMatching(/"hero-only" contradicts first_fold/))
  })

  it('rejects hero-only when the first fold never names the hero', () => {
    const r = isValidMobile(valid({ first_fold: 'the ledger and the nav' }), {
      ...ctx,
      collapse: 'hero-only',
    })
    expect(r.errors.some((e) => /"hero-only" contradicts first_fold/.test(e))).toBe(true)
  })

  it('rejects rail-to-band when nothing at 1440 was a rail', () => {
    const r = isValidMobile(valid(), {
      collapse: 'rail-to-band',
      shellPosture: 'standard',
      columns: 'single',
      placement: 'top-bar',
      heroCopy: HERO,
    })
    expect(r.valid).toBe(false)
    expect(r.errors[0]).toMatch(/"rail-to-band" contradicts the composition/)
  })

  it('accepts rail-to-band from a marginal posture, asymmetric columns, or a rail header alone', () => {
    const base = { collapse: 'rail-to-band', heroCopy: HERO }
    expect(isValidMobile(valid(), { ...base, shellPosture: 'marginal' }).valid).toBe(true)
    expect(isValidMobile(valid(), { ...base, columns: 'two-asymmetric' }).valid).toBe(true)
    expect(isValidMobile(valid(), { ...base, placement: 'left-rail' }).valid).toBe(true)
  })

  it('rejects split-to-sequence on a single column', () => {
    const r = isValidMobile(valid(), { ...ctx, collapse: 'split-to-sequence', columns: 'single' })
    expect(r.errors[0]).toMatch(/"split-to-sequence" contradicts columns "single"/)
  })

  it('validates stack and reorder on any composition', () => {
    for (const collapse of ['stack', 'reorder']) {
      const r = isValidMobile(valid(), { collapse, shellPosture: 'none', columns: 'single' })
      expect(r.valid, collapse).toBe(true)
    }
  })

  it('treats a missing collapse as unknown, not as a contradiction', () => {
    expect(isValidMobile(valid(), { heroCopy: HERO }).valid).toBe(true)
  })
})

describe('formatMobile', () => {
  it('emits one key: value line per field, in canonical order', () => {
    const lines = formatMobile(parseMobileBlock(BLOCK)).split('\n')
    expect(lines).toHaveLength(5)
    expect(lines[0]).toMatch(/^carrier: The gold field/)
    expect(lines[3]).toBe('hero_step_360: hero')
    expect(lines[4]).toBe('nav_360: one lowercase row under the mark')
  })

  it('round-trips through parseMobileBlock', () => {
    const parsed = parseMobileBlock(BLOCK)
    expect(parseMobileBlock(formatMobile(parsed))).toEqual(parsed)
  })

  it('marks missing values rather than emitting "undefined"', () => {
    expect(formatMobile({})).not.toMatch(/undefined/)
    expect(formatMobile(null).split('\n')[0]).toBe('carrier: ?')
  })
})
