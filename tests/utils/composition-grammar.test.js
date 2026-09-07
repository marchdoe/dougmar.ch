import { describe, it, expect } from 'vitest'
import {
  COMPOSITION_AXES,
  AXIS_NAMES,
  describeAxisValue,
  isValidTuple,
  formatTuple,
} from '../../scripts/utils/composition-grammar.js'

/** A tuple made from the first value of every axis. */
function firstValueTuple(overrides = {}) {
  const t = {}
  for (const axis of AXIS_NAMES) t[axis] = COMPOSITION_AXES[axis][0]
  return { ...t, ...overrides }
}

describe('COMPOSITION_AXES', () => {
  it('has the nine axes the grammar is defined over', () => {
    expect(AXIS_NAMES).toEqual([
      'columns',
      'axis',
      'symmetry',
      'hero_zone',
      'density',
      'rhythm',
      'shell_posture',
      'field_ratio',
      'collapse',
    ])
  })

  it('has 43 values in total, none duplicated within an axis', () => {
    let total = 0
    for (const axis of AXIS_NAMES) {
      const values = COMPOSITION_AXES[axis]
      expect(new Set(values).size, `${axis} has a duplicate value`).toBe(values.length)
      total += values.length
    }
    expect(total).toBe(43)
  })
})

describe('describeAxisValue', () => {
  it('describes every value of every axis', () => {
    for (const axis of AXIS_NAMES) {
      for (const value of COMPOSITION_AXES[axis]) {
        const text = describeAxisValue(axis, value)
        expect(text, `${axis}=${value} has no description`).toBeTruthy()
        expect(text.length, `${axis}=${value} description is too short to act on`).toBeGreaterThan(
          25
        )
      }
    }
  })

  it('returns null for an unknown axis or value', () => {
    expect(describeAxisValue('vibes', 'good')).toBeNull()
    expect(describeAxisValue('columns', 'seventeen')).toBeNull()
  })
})

describe('isValidTuple', () => {
  it('accepts a complete tuple', () => {
    expect(isValidTuple(firstValueTuple())).toEqual({ valid: true, errors: [] })
  })

  it('accepts every value of every axis', () => {
    for (const axis of AXIS_NAMES) {
      for (const value of COMPOSITION_AXES[axis]) {
        expect(isValidTuple(firstValueTuple({ [axis]: value })).valid).toBe(true)
      }
    }
  })

  it('rejects a missing axis and names it', () => {
    const t = firstValueTuple()
    delete t.rhythm
    const { valid, errors } = isValidTuple(t)
    expect(valid).toBe(false)
    expect(errors).toContain('missing axis: rhythm')
  })

  it('rejects an out-of-vocabulary value and lists the alternatives', () => {
    const { valid, errors } = isValidTuple(firstValueTuple({ density: 'airy' }))
    expect(valid).toBe(false)
    expect(errors[0]).toMatch(/invalid density: "airy"/)
    expect(errors[0]).toMatch(/sparse, measured, dense, crowded/)
  })

  it('rejects an unknown extra axis', () => {
    const { valid, errors } = isValidTuple(firstValueTuple({ mood: 'stormy' }))
    expect(valid).toBe(false)
    expect(errors).toContain('unknown axis: mood')
  })

  it('rejects non-objects', () => {
    for (const bad of [null, undefined, 'columns: single', 42, []]) {
      expect(isValidTuple(bad).valid, `${JSON.stringify(bad)} should be invalid`).toBe(false)
    }
  })

  it('validates without consulting any archetype name — that cage is gone', () => {
    // The eight legacy names are not vocabulary here: none appears in any
    // axis, and a tuple validates with no archetype supplied at all.
    const legacy = [
      'Specimen',
      'Gallery Wall',
      'Broadsheet',
      'Poster',
      'Split',
      'Stack',
      'Index',
      'Scroll',
    ]
    // `collapse: stack` (#452) shares a word with the retired Stack
    // archetype and nothing else: it is a phone strategy, not a silhouette,
    // so the check runs over the eight canvas axes the archetypes described.
    const canvasAxes = AXIS_NAMES.filter((a) => a !== 'collapse')
    const allValues = canvasAxes.flatMap((a) => COMPOSITION_AXES[a])
    for (const name of legacy) {
      expect(allValues).not.toContain(name)
      expect(allValues).not.toContain(name.toLowerCase())
    }
    expect(isValidTuple(firstValueTuple()).valid).toBe(true)
  })
})

describe('formatTuple', () => {
  it('emits one key: value line per axis, in canonical order', () => {
    const lines = formatTuple(firstValueTuple()).split('\n')
    expect(lines).toHaveLength(9)
    expect(lines[0]).toBe('columns: single')
    expect(lines[7]).toBe('field_ratio: type-dominant')
    expect(lines[8]).toBe('collapse: stack')
  })

  it('marks missing values rather than emitting "undefined"', () => {
    expect(formatTuple({})).not.toMatch(/undefined/)
    expect(formatTuple({}).split('\n')[0]).toBe('columns: ?')
  })
})
