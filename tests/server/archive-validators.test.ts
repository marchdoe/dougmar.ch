// tests/server/archive-validators.test.ts
//
// The validators on the archive server functions had no test at all.
// They were inline in the createServerFn chain, so there was nothing to call;
// they are named exports now for exactly this reason.
import { describe, it, expect } from 'vitest'
import {
  validateDateInput,
  validateHistoryInput,
  validateMetricsInput,
} from '../../app/server/archive'

describe('validateDateInput', () => {
  it('accepts a well-formed date', () => {
    expect(validateDateInput('2026-08-30')).toBe('2026-08-30')
  })

  it.each([
    ['..', 'a bare traversal'],
    ['../../etc/passwd', 'a traversal with a target'],
    ['2026-08-30/../../etc', 'a valid date used as a prefix'],
    ['2026-8-3', 'unpadded components'],
    ['2026-08-30extra', 'trailing junk'],
    ['', 'the empty string'],
    [null, 'null, which String() turns into "null"'],
  ])('rejects %j — %s', (input: unknown, _why: string) => {
    expect(() => validateDateInput(input)).toThrow('Invalid date format')
  })
})

describe('validateMetricsInput', () => {
  it('accepts a date and a numeric build id', () => {
    expect(validateMetricsInput({ date: '2026-08-30', buildId: '1785322984137' })).toEqual({
      date: '2026-08-30',
      buildId: '1785322984137',
    })
  })

  it('rejects a build id that could escape the date directory', () => {
    expect(() => validateMetricsInput({ date: '2026-08-30', buildId: '../..' })).toThrow(
      'Invalid buildId format'
    )
  })

  it('rejects a failed build dir suffix', () => {
    // `build-failed-1777553883277` is a real directory name; only shipped
    // numeric build dirs are addressable.
    expect(() => validateMetricsInput({ date: '2026-08-30', buildId: 'failed-177755' })).toThrow(
      'Invalid buildId format'
    )
  })

  it('rejects missing fields rather than reading build-undefined', () => {
    expect(() => validateMetricsInput({})).toThrow('Invalid date format')
    expect(() => validateMetricsInput(undefined)).toThrow('Invalid date format')
  })
})

describe('validateHistoryInput', () => {
  it('defaults to 30 when no limit is given', () => {
    expect(validateHistoryInput({})).toEqual({ limit: 30 })
  })

  it('accepts a limit inside the range', () => {
    expect(validateHistoryInput({ limit: 5 })).toEqual({ limit: 5 })
  })

  it.each([0, -1, 201, 1.5])('rejects %s', (limit) => {
    expect(() => validateHistoryInput({ limit })).toThrow('limit must be')
  })
})
