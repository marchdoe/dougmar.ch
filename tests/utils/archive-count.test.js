import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  countArchivedDesigns,
  latestArchivedDateBefore,
} from '../../scripts/utils/archive-count.js'

let dir

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'archive-count-'))
})

afterEach(() => {
  rmSync(dir, { recursive: true, force: true })
})

describe('countArchivedDesigns', () => {
  it('counts date directories', () => {
    for (const d of ['2026-03-12', '2026-06-28', '2026-08-23']) mkdirSync(join(dir, d))
    expect(countArchivedDesigns(dir)).toBe(3)
  })

  it('ignores non-date directories and loose files', () => {
    mkdirSync(join(dir, '2026-03-12'))
    mkdirSync(join(dir, 'scratch'))
    mkdirSync(join(dir, '2026-3-12')) // not zero-padded
    writeFileSync(join(dir, '2026-04-01'), 'a file, not a directory')
    expect(countArchivedDesigns(dir)).toBe(1)
  })

  it('returns 0 when the archive directory is absent', () => {
    expect(countArchivedDesigns(join(dir, 'nope'))).toBe(0)
  })

  it('returns 0 for an empty archive', () => {
    expect(countArchivedDesigns(dir)).toBe(0)
  })
})

// The live rail's `‹` (#702). It links to /archive/<date>/, which is a
// snapshot, so a day with a record and no captured index.html is skipped.
describe('latestArchivedDateBefore', () => {
  const snapshot = (date) => {
    mkdirSync(join(dir, date), { recursive: true })
    writeFileSync(join(dir, date, 'index.html'), '<html></html>')
  }

  it('returns the newest snapshot strictly before the date', () => {
    for (const d of ['2026-10-03', '2026-10-05', '2026-10-06']) snapshot(d)
    expect(latestArchivedDateBefore('2026-10-06', dir)).toBe('2026-10-05')
    expect(latestArchivedDateBefore('2026-10-07', dir)).toBe('2026-10-06')
  })

  it('skips a day with no captured index.html, which would be a 404', () => {
    snapshot('2026-10-03')
    mkdirSync(join(dir, '2026-10-05'))
    expect(latestArchivedDateBefore('2026-10-06', dir)).toBe('2026-10-03')
  })

  it('ignores non-date directories and loose files', () => {
    snapshot('2026-10-01')
    mkdirSync(join(dir, 'scratch'))
    writeFileSync(join(dir, '2026-10-04'), 'a file, not a directory')
    expect(latestArchivedDateBefore('2026-10-06', dir)).toBe('2026-10-01')
  })

  it('returns null when nothing came before, or the directory is absent', () => {
    snapshot('2026-10-06')
    expect(latestArchivedDateBefore('2026-10-06', dir)).toBeNull()
    expect(latestArchivedDateBefore('2026-10-06', join(dir, 'nope'))).toBeNull()
  })

  it('refuses a date that is not YYYY-MM-DD', () => {
    expect(() => latestArchivedDateBefore('Oct 6', dir)).toThrow(/YYYY-MM-DD/)
  })
})
