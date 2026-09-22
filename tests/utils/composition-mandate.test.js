import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  extractRecentCompositions,
  suggestTupleForDate,
  computeCompositionMandate,
  formatCompositionMandateForPrompt,
} from '../../scripts/utils/composition-mandate.js'
import {
  AXIS_NAMES,
  COMPOSITION_AXES,
  densityForbidsHeroObject,
  describeAxisValue,
  isValidTuple,
} from '../../scripts/utils/composition-grammar.js'

let archiveDir

beforeEach(() => {
  archiveDir = mkdtempSync(path.join(tmpdir(), 'composition-mandate-'))
})

afterEach(() => {
  rmSync(archiveDir, { recursive: true, force: true })
})

/** Write one build's signature artifact under archive/<date>/build-<n>/. */
function writeBuild(date, tuple, { filename = 'composition.json', buildId = '1' } = {}) {
  const dir = path.join(archiveDir, date, `build-${buildId}`)
  mkdirSync(dir, { recursive: true })
  writeFileSync(path.join(dir, filename), JSON.stringify(tuple), 'utf8')
}

describe('extractRecentCompositions', () => {
  it('returns [] for an archive directory that does not exist', () => {
    expect(extractRecentCompositions(path.join(archiveDir, 'nope'), 7)).toEqual([])
  })

  it('returns [] when no build carries a signature artifact', () => {
    mkdirSync(path.join(archiveDir, '2026-08-20', 'build-1'), { recursive: true })
    expect(extractRecentCompositions(archiveDir, 7)).toEqual([])
  })

  it('reads newest date first and honours the lookback window', () => {
    writeBuild('2026-08-18', { columns: 'single' })
    writeBuild('2026-08-19', { columns: 'three' })
    writeBuild('2026-08-20', { columns: 'masonry' })
    const got = extractRecentCompositions(archiveDir, 2)
    expect(got.map((r) => r.date)).toEqual(['2026-08-20', '2026-08-19'])
  })

  it('parses a legacy 4-key layout-signature.json without crashing', () => {
    writeBuild(
      '2026-08-20',
      { columns: 'two-equal', axis: 'vertical', symmetry: 'broken', hero_zone: 'center' },
      { filename: 'layout-signature.json' }
    )
    const [entry] = extractRecentCompositions(archiveDir, 7)
    expect(entry.tuple.columns).toBe('two-equal')
    // The four axes that did not exist yet read as no-history, not as errors.
    expect(entry.tuple.density).toBeNull()
    expect(entry.tuple.rhythm).toBeNull()
    expect(entry.tuple.shell_posture).toBeNull()
    expect(entry.tuple.field_ratio).toBeNull()
  })

  it('prefers composition.json over a legacy file in the same build', () => {
    const dir = path.join(archiveDir, '2026-08-20', 'build-1')
    mkdirSync(dir, { recursive: true })
    writeFileSync(path.join(dir, 'layout-signature.json'), JSON.stringify({ columns: 'single' }))
    writeFileSync(path.join(dir, 'composition.json'), JSON.stringify({ columns: 'masonry' }))
    expect(extractRecentCompositions(archiveDir, 7)[0].tuple.columns).toBe('masonry')
  })

  it('takes the newest build when a date has several', () => {
    writeBuild('2026-08-20', { columns: 'single' }, { buildId: '100' })
    writeBuild('2026-08-20', { columns: 'masonry' }, { buildId: '200' })
    expect(extractRecentCompositions(archiveDir, 7)[0].tuple.columns).toBe('masonry')
  })

  it('skips a malformed artifact without losing the rest of the history', () => {
    const dir = path.join(archiveDir, '2026-08-20', 'build-1')
    mkdirSync(dir, { recursive: true })
    writeFileSync(path.join(dir, 'composition.json'), '{ not json')
    writeBuild('2026-08-19', { columns: 'three' })
    const got = extractRecentCompositions(archiveDir, 7)
    expect(got.map((r) => r.date)).toEqual(['2026-08-19'])
  })

  it('drops values no longer in the vocabulary', () => {
    writeBuild('2026-08-20', { columns: 'quadruple', axis: 'vertical' })
    const [entry] = extractRecentCompositions(archiveDir, 7)
    expect(entry.tuple.columns).toBeNull()
    expect(entry.tuple.axis).toBe('vertical')
  })

  it('normalizes case and whitespace', () => {
    writeBuild('2026-08-20', { columns: '  MASONRY ' })
    expect(extractRecentCompositions(archiveDir, 7)[0].tuple.columns).toBe('masonry')
  })
})

describe('suggestTupleForDate', () => {
  it('is a complete, valid tuple', () => {
    expect(isValidTuple(suggestTupleForDate('2026-08-23')).valid).toBe(true)
  })

  it('is deterministic per date', () => {
    expect(suggestTupleForDate('2026-08-23')).toEqual(suggestTupleForDate('2026-08-23'))
  })

  it('differs across dates rather than returning one fixed tuple', () => {
    const dates = ['2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23', '2026-08-24']
    const seen = new Set(dates.map((d) => JSON.stringify(suggestTupleForDate(d))))
    expect(seen.size).toBe(dates.length)
  })

  it('does not move all axes in lockstep — axes are salted independently', () => {
    // Across 40 dates each axis should reach more than one value.
    const dates = Array.from({ length: 40 }, (_, i) => `2026-01-${String(i + 1).padStart(2, '0')}`)
    for (const axis of AXIS_NAMES) {
      const values = new Set(dates.map((d) => suggestTupleForDate(d)[axis]))
      expect(values.size, `${axis} never varies across 40 dates`).toBeGreaterThan(1)
    }
  })

  it('never suggests density: sparse with hero_object: list or artifact (#514)', () => {
    // Each axis is seeded off its own salted hash, so the two independent
    // draws can otherwise land on the one pair the grammar forbids. Walk a
    // wide date range rather than a single date to catch it.
    const dates = Array.from({ length: 400 }, (_, i) => {
      const day = i + 1
      const month = String((Math.floor((day - 1) / 28) % 12) + 1).padStart(2, '0')
      const date = String(((day - 1) % 28) + 1).padStart(2, '0')
      return `2026-${month}-${date}`
    })
    for (const date of dates) {
      const tuple = suggestTupleForDate(date)
      expect(
        densityForbidsHeroObject(tuple.density, tuple.hero_object),
        `${date} suggested density: ${tuple.density}, hero_object: ${tuple.hero_object}`
      ).toBe(false)
    }
  })
})

describe('computeCompositionMandate', () => {
  it('forbids nothing and still suggests on an empty archive', () => {
    const m = computeCompositionMandate({ archiveDir, date: '2026-08-23' })
    expect(m.recent).toEqual([])
    for (const axis of AXIS_NAMES) expect(m.softForbidden[axis]).toEqual([])
    expect(isValidTuple(m.suggestion).valid).toBe(true)
    expect(m.rationale).toMatch(/every axis is open/)
  })

  it('soft-forbids per axis over the last 3 builds only', () => {
    writeBuild('2026-08-23', { columns: 'single' })
    writeBuild('2026-08-22', { columns: 'three' })
    writeBuild('2026-08-21', { columns: 'masonry' })
    writeBuild('2026-08-20', { columns: 'two-equal' }) // 4th back — outside the window
    const m = computeCompositionMandate({ archiveDir, date: '2026-08-24' })
    expect(m.softForbidden.columns).toEqual(['single', 'three', 'masonry'])
    expect(m.softForbidden.columns).not.toContain('two-equal')
  })

  it('tracks each axis separately rather than as one tuple', () => {
    writeBuild('2026-08-23', { columns: 'single', density: 'sparse' })
    writeBuild('2026-08-22', { columns: 'single', density: 'crowded' })
    const m = computeCompositionMandate({ archiveDir, date: '2026-08-24' })
    // Repeated value collapses to one entry; the other axis keeps both.
    expect(m.softForbidden.columns).toEqual(['single'])
    expect(m.softForbidden.density).toEqual(['sparse', 'crowded'])
  })

  it('leaves axes with no history unforbidden even when others have some', () => {
    writeBuild('2026-08-23', { columns: 'single' })
    const m = computeCompositionMandate({ archiveDir, date: '2026-08-24' })
    expect(m.softForbidden.columns).toEqual(['single'])
    expect(m.softForbidden.rhythm).toEqual([])
  })

  it('nudges the suggestion off a discouraged value', () => {
    const date = '2026-08-24'
    const naive = suggestTupleForDate(date)
    // Forbid exactly what the date would otherwise suggest, on every axis.
    writeBuild('2026-08-23', naive)
    const m = computeCompositionMandate({ archiveDir, date })
    for (const axis of AXIS_NAMES) {
      expect(m.suggestion[axis], `${axis} was not nudged off the forbidden value`).not.toBe(
        naive[axis]
      )
    }
    expect(isValidTuple(m.suggestion).valid).toBe(true)
  })

  it('cannot exhaust an axis — the 3-build window is smaller than the smallest axis', () => {
    // This is why the nudge always has somewhere to go. Fill the whole
    // window on the narrowest axes (4 values each) and one value survives.
    const dates = ['2026-08-23', '2026-08-22', '2026-08-21']
    COMPOSITION_AXES.axis.slice(0, 3).forEach((v, i) => {
      writeBuild(dates[i], { axis: v })
    })
    const m = computeCompositionMandate({ archiveDir, date: '2026-08-24' })

    const smallestAxis = Math.min(...AXIS_NAMES.map((a) => COMPOSITION_AXES[a].length))
    expect(smallestAxis).toBeGreaterThan(3)
    expect(m.softForbidden.axis).toHaveLength(3)
    expect(COMPOSITION_AXES.axis).toContain(m.suggestion.axis)
    expect(m.softForbidden.axis).not.toContain(m.suggestion.axis)
  })

  it('does not let the per-axis nudge reintroduce density: sparse / hero_object: list|artifact (#514)', () => {
    const date = '2026-01-03'
    const naive = suggestTupleForDate(date)
    // This date's naive suggestion already pairs a non-sparse density with a
    // list/artifact hero_object (fine on its own). Forbid every other
    // density value so the per-axis nudge below has nowhere to go but
    // "sparse" — which, paired with the untouched hero_object, would
    // recreate the pair suggestTupleForDate avoids.
    expect(densityForbidsHeroObject(naive.density, naive.hero_object)).toBe(false)
    expect(['list', 'artifact']).toContain(naive.hero_object)
    const others = COMPOSITION_AXES.density.filter((v) => v !== naive.density && v !== 'sparse')
    writeBuild('2026-01-02', { density: others[0] })
    writeBuild('2026-01-01', { density: others[1] })
    writeBuild('2025-12-31', { density: naive.density })

    const m = computeCompositionMandate({ archiveDir, date })
    expect(m.softForbidden.density.sort()).toEqual([...others, naive.density].sort())
    // The forced nudge landed on sparse; confirm the fixture provokes it.
    expect(m.suggestion.density).toBe('sparse')
    expect(densityForbidsHeroObject(m.suggestion.density, m.suggestion.hero_object)).toBe(false)
    expect(isValidTuple(m.suggestion).valid).toBe(true)
  })

  it('is reproducible for the same date and archive', () => {
    writeBuild('2026-08-23', { columns: 'single', density: 'dense' })
    const a = computeCompositionMandate({ archiveDir, date: '2026-08-24' })
    const b = computeCompositionMandate({ archiveDir, date: '2026-08-24' })
    expect(a.suggestion).toEqual(b.suggestion)
    expect(a.softForbidden).toEqual(b.softForbidden)
  })
})

describe('formatCompositionMandateForPrompt', () => {
  it('returns empty string only for an unusable mandate', () => {
    expect(formatCompositionMandateForPrompt(null)).toBe('')
    expect(formatCompositionMandateForPrompt({})).toBe('')
    expect(formatCompositionMandateForPrompt({ suggestion: { columns: 'single' } })).toBe('')
  })

  it('still steers on an empty archive — the case every early run hits', () => {
    const m = computeCompositionMandate({ archiveDir, date: '2026-08-23' })
    const block = formatCompositionMandateForPrompt(m)
    expect(block).not.toBe('')
    for (const axis of AXIS_NAMES) {
      expect(block).toContain(`**${axis}** — start from \`${m.suggestion[axis]}\``)
      expect(block).toContain(describeAxisValue(axis, m.suggestion[axis]))
    }
    // Nothing to avoid yet, so no avoid-clauses are claimed.
    expect(block).not.toContain('avoid `')
  })

  it('names every axis, its start value, and what to avoid', () => {
    writeBuild('2026-08-23', { columns: 'single', density: 'dense' })
    const m = computeCompositionMandate({ archiveDir, date: '2026-08-24' })
    const block = formatCompositionMandateForPrompt(m)
    for (const axis of AXIS_NAMES) {
      expect(block).toContain(`**${axis}**`)
      expect(block).toContain(`start from \`${m.suggestion[axis]}\``)
    }
    expect(block).toContain('avoid `single`')
    expect(block).toContain('avoid `dense`')
    expect(block).toContain('nothing to avoid') // axes with no history
  })

  it('never emits "undefined" or "null" into the prompt', () => {
    writeBuild('2026-08-23', { columns: 'single' }, { filename: 'layout-signature.json' })
    const m = computeCompositionMandate({ archiveDir, date: '2026-08-24' })
    const block = formatCompositionMandateForPrompt(m)
    expect(block).not.toMatch(/undefined|\bnull\b/)
  })
})
