import { describe, it, expect } from 'vitest'
import { hashString, hashToRange } from '../../scripts/utils/deterministic-hash.js'

describe('hashString', () => {
  it('is deterministic — same input, same output', () => {
    expect(hashString('2026-08-23')).toBe(hashString('2026-08-23'))
  })

  it('returns a non-negative integer', () => {
    const h = hashString('2026-08-23')
    expect(Number.isInteger(h)).toBe(true)
    expect(h).toBeGreaterThanOrEqual(0)
  })

  it('different inputs usually produce different hashes', () => {
    const inputs = Array.from({ length: 30 }, (_, i) => `2026-01-${String(i + 1).padStart(2, '0')}`)
    const hashes = new Set(inputs.map(hashString))
    expect(hashes.size).toBeGreaterThan(1)
  })
})

describe('hashToRange', () => {
  it('always returns a value within [min, max] inclusive', () => {
    for (let i = 0; i < 50; i++) {
      const v = hashToRange(`key-${i}`, 3, 10)
      expect(v).toBeGreaterThanOrEqual(3)
      expect(v).toBeLessThanOrEqual(10)
    }
  })

  it('is deterministic for the same key', () => {
    expect(hashToRange('poster:2026-08-23', 0, 2)).toBe(hashToRange('poster:2026-08-23', 0, 2))
  })

  it('distributes across the full range given enough distinct keys', () => {
    const seen = new Set()
    for (let i = 0; i < 200; i++) {
      seen.add(hashToRange(`k${i}`, 0, 2))
    }
    expect(seen).toEqual(new Set([0, 1, 2]))
  })

  it('handles a single-value range (min === max)', () => {
    expect(hashToRange('anything', 5, 5)).toBe(5)
  })

  it('throws when max < min', () => {
    expect(() => hashToRange('x', 5, 3)).toThrow()
  })
})
