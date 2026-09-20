import { describe, expect, it } from 'vitest'

import { isRecord } from '../../app/lib/guards'

describe('isRecord', () => {
  it('accepts a plain object', () => {
    expect(isRecord({ a: 1 })).toBe(true)
    expect(isRecord({})).toBe(true)
    expect(isRecord(JSON.parse('{"a":{"b":[1]}}'))).toBe(true)
  })

  it('rejects null, arrays and primitives', () => {
    expect(isRecord(null)).toBe(false)
    expect(isRecord(undefined)).toBe(false)
    expect(isRecord([])).toBe(false)
    expect(isRecord([{ a: 1 }])).toBe(false)
    expect(isRecord('x')).toBe(false)
    expect(isRecord(3)).toBe(false)
    expect(isRecord(true)).toBe(false)
  })

  it('narrows so properties can be read without a cast', () => {
    const value: unknown = { date: '2026-09-20' }
    expect(isRecord(value) ? value.date : null).toBe('2026-09-20')
  })
})
