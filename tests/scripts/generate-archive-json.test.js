import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import {
  countSnapshotPages,
  indexEntry,
  liftRun,
  projectArchive,
  publishArchiveImages,
} from '../../scripts/generate-archive-json.js'

// The build-step projection the site depends on: every calendar cell and
// every explainer page reads what this writes. It had no test (#229).

let root
let archiveDir
let publicDir
let outDir

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'archive-json-'))
  archiveDir = join(root, 'archive')
  publicDir = join(root, 'public')
  outDir = join(publicDir, 'archive-data')
  mkdirSync(archiveDir, { recursive: true })
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  rmSync(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})

const record = (date, extra = {}) => ({
  date,
  era: 'grammar',
  brief: `Brief for ${date}`,
  legacyArchetype: null,
  chassis: 'unbounded-figtree',
  buildId: '1',
  attempts: 1,
  colorScheme: { mood_word: 'ELECTRIC', primary_hue: { h: 210 } },
  ...extra,
})

function writeDay(date, { pages = [], withRecord = true, trace, cost } = {}) {
  mkdirSync(join(archiveDir, date, 'build-1'), { recursive: true })
  if (withRecord) {
    writeFileSync(join(archiveDir, date, 'record.json'), JSON.stringify(record(date)))
  }
  if (trace !== undefined) {
    const body = typeof trace === 'string' ? trace : JSON.stringify(trace)
    writeFileSync(join(archiveDir, date, 'build-1', 'trace.json'), body)
  }
  if (cost !== undefined) {
    writeFileSync(join(archiveDir, date, 'build-1', 'cost.json'), JSON.stringify(cost))
  }
  for (const p of pages) {
    const file = join(publicDir, 'archive', date, p)
    mkdirSync(join(file, '..'), { recursive: true })
    writeFileSync(file, '<html></html>')
  }
}

describe('countSnapshotPages', () => {
  it('counts html files recursively, and nothing else', () => {
    writeDay('2026-08-20', { pages: ['index.html', 'about.html', 'work/spaceman.html'] })
    writeFileSync(join(publicDir, 'archive', '2026-08-20', 'logo.png'), '')
    expect(countSnapshotPages('2026-08-20', publicDir)).toBe(3)
  })

  it('is 0 for a day with a record and no capture', () => {
    writeDay('2026-08-20')
    expect(countSnapshotPages('2026-08-20', publicDir)).toBe(0)
  })
})

// A short run in the shape the pipeline writes: two markers with no duration,
// two agent steps, one gate.
const trace = {
  date: '2026-08-20',
  startedAt: '2026-08-20T08:00:00.000Z',
  completedAt: '2026-08-20T08:10:00.000Z',
  steps: [
    { name: 'signals-loaded', phase: 0, durationMs: 0, timestamp: '2026-08-20T08:00:00.100Z' },
    { name: 'art-director', phase: 1, durationMs: 300000, timestamp: '2026-08-20T08:05:00.000Z' },
    { name: 'build-validation', phase: 4, durationMs: 0, timestamp: '2026-08-20T08:09:00.000Z' },
    { name: 'surface-gate', phase: 4, durationMs: 20000, timestamp: '2026-08-20T08:09:20.000Z' },
  ],
}

const cost = {
  total_usd: 0.8,
  estimated: true,
  partial: false,
  retries: 0,
  calls: 1,
  byAgent: [
    {
      agent: 'art-director',
      model: 'claude-opus-4-8',
      source: 'cli',
      input: 1000,
      output: 500,
      cache_read: 0,
      cache_write: 0,
      cost_usd: 0.8,
      estimated: true,
      ms: 299000,
      num_turns: 3,
    },
  ],
}

describe('liftRun', () => {
  it('lifts the steps that took time and every call, and nothing else', () => {
    writeDay('2026-08-20', { trace, cost })
    expect(liftRun('2026-08-20', archiveDir)).toEqual({
      startedAt: '2026-08-20T08:00:00.000Z',
      completedAt: '2026-08-20T08:10:00.000Z',
      steps: [
        {
          name: 'art-director',
          phase: 1,
          durationMs: 300000,
          endedAt: '2026-08-20T08:05:00.000Z',
        },
        { name: 'surface-gate', phase: 4, durationMs: 20000, endedAt: '2026-08-20T08:09:20.000Z' },
      ],
      calls: [
        {
          agent: 'art-director',
          model: 'claude-opus-4-8',
          ms: 299000,
          costUsd: 0.8,
          estimated: true,
        },
      ],
      totalUsd: 0.8,
      estimated: true,
      retries: 0,
    })
  })

  it('lifts the same fields from an entry that carries a purpose and a night with earlier attempts (#578)', () => {
    const withPurposes = {
      ...cost,
      byAgent: [{ ...cost.byAgent[0], purpose: 'first' }],
      priorAttempts: [{ runId: '111', total_usd: 4.18, calls: 10 }],
      night_usd: 4.98,
    }
    writeDay('2026-08-20', { trace, cost })
    writeDay('2026-08-21', { trace, cost: withPurposes })
    // The page's run view reads exactly what it read before: the new fields
    // stay in cost.json and record.json.
    expect(liftRun('2026-08-21', archiveDir).calls).toEqual(liftRun('2026-08-20', archiveDir).calls)
    expect(liftRun('2026-08-21', archiveDir).totalUsd).toBe(0.8)
  })

  it('is time only when the day has a trace and no cost file', () => {
    writeDay('2026-08-20', { trace })
    const run = liftRun('2026-08-20', archiveDir)
    expect(run.steps).toHaveLength(2)
    expect(run.calls).toBeNull()
    expect(run.totalUsd).toBeNull()
    expect(run.estimated).toBe(false)
    expect(run.retries).toBeNull()
  })

  it('is null when the day has neither', () => {
    writeDay('2026-08-20')
    expect(liftRun('2026-08-20', archiveDir)).toBeNull()
  })

  it('is null for a day with no build directory at all', () => {
    mkdirSync(join(archiveDir, '2026-03-12'), { recursive: true })
    expect(liftRun('2026-03-12', archiveDir)).toBeNull()
  })

  it('treats a malformed trace as absent rather than throwing', () => {
    writeDay('2026-08-20', { trace: '{not json', cost })
    expect(liftRun('2026-08-20', archiveDir)).toBeNull()
    writeDay('2026-08-21', { trace: { steps: 'nope' } })
    expect(liftRun('2026-08-21', archiveDir)).toBeNull()
  })

  it('treats a malformed cost file as no cost file', () => {
    writeDay('2026-08-20', { trace, cost: { total_usd: 1 } })
    expect(liftRun('2026-08-20', archiveDir).calls).toBeNull()
  })
})

describe('indexEntry', () => {
  it('carries only what a calendar cell needs', () => {
    const entry = indexEntry(
      record('2026-08-20'),
      { hasScreenshot: true, pages: 9, uniqueness: { composite: 0.4, window: 7, metrics: {} } },
      archiveDir
    )
    expect(entry).toMatchObject({
      date: '2026-08-20',
      era: 'grammar',
      moodWord: 'ELECTRIC',
      primaryHue: { h: 210 },
      hasScreenshot: true,
      pages: 9,
      cost: null,
      rating: null,
      uniqueness: { composite: 0.4, window: 7 },
    })
    // The full uniqueness payload stays in the per-date file, not the index.
    expect(entry.uniqueness).not.toHaveProperty('metrics')
  })
})

describe('projectArchive', () => {
  it('writes an index and one file per day, newest first', () => {
    writeDay('2026-08-19', { pages: ['index.html'] })
    writeDay('2026-08-20', { pages: ['index.html', 'about.html'] })

    const result = projectArchive({ archiveDir, publicDir, outDir })

    expect(result.index.map((e) => e.date)).toEqual(['2026-08-20', '2026-08-19'])
    expect(result.rebuilt).toBe(0)
    const index = JSON.parse(readFileSync(join(outDir, 'index.json'), 'utf8'))
    expect(index).toHaveLength(2)
    expect(index[0].pages).toBe(2)
    expect(index[1].pages).toBe(1)

    const day = JSON.parse(readFileSync(join(outDir, '2026-08-20.json'), 'utf8'))
    expect(day.brief).toBe('Brief for 2026-08-20')
    expect(day.pages).toBe(2)
    expect(day.hasScreenshot).toBe(false)
    expect(day.uniqueness).not.toBeNull()
    expect(day.run).toBeNull()
  })

  it('writes the run into the day file and keeps it out of the index', () => {
    writeDay('2026-08-20', { trace, cost })
    const { index } = projectArchive({ archiveDir, publicDir, outDir })
    const day = JSON.parse(readFileSync(join(outDir, '2026-08-20.json'), 'utf8'))
    expect(day.run.calls).toHaveLength(1)
    expect(day.run.totalUsd).toBe(0.8)
    expect(index[0]).not.toHaveProperty('run')
  })

  it('marks a day whose screenshot is beside the record', () => {
    writeDay('2026-08-20')
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, '2026-08-20.png'), '')
    const { index } = projectArchive({ archiveDir, publicDir, outDir })
    expect(index[0].hasScreenshot).toBe(true)
  })

  it('marks a day whose screenshot is only in its build dir, since the copy is made here (#549)', () => {
    writeDay('2026-08-20')
    writeFileSync(join(archiveDir, '2026-08-20', 'build-1', 'screenshot.png'), 'png')
    const { index } = projectArchive({ archiveDir, publicDir, outDir })
    expect(index[0].hasScreenshot).toBe(true)
    expect(readFileSync(join(outDir, '2026-08-20.png'), 'utf8')).toBe('png')
  })

  it('scores each day only against the days that preceded it', () => {
    writeDay('2026-08-18')
    writeDay('2026-08-19')
    writeDay('2026-08-20')
    const { index } = projectArchive({ archiveDir, publicDir, outDir })
    const byDate = Object.fromEntries(index.map((e) => [e.date, e.uniqueness]))
    // The first day has nothing to compare to; the third has two.
    expect(byDate['2026-08-18'].window).toBe(0)
    expect(byDate['2026-08-20'].window).toBe(2)
  })

  it('produces an empty index for an empty archive rather than failing', () => {
    const { index } = projectArchive({ archiveDir, publicDir, outDir })
    expect(index).toEqual([])
    expect(existsSync(join(outDir, 'index.json'))).toBe(true)
  })
})

describe('publishArchiveImages', () => {
  const put = (file, body) => {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, body)
  }

  it("copies the shipped build's screenshot and viewport captures to where the site serves them (#549)", () => {
    writeDay('2026-08-20')
    const build = join(archiveDir, '2026-08-20', 'build-1')
    put(join(build, 'screenshot.png'), 'day')
    put(join(build, 'viewports', 'mobile.webp'), 'new')
    put(join(build, 'viewports', 'desktop.png'), 'old')
    put(join(build, 'viewports', 'notes.txt'), 'not an image')

    expect(publishArchiveImages({ archiveDir, outDir })).toBe(3)

    expect(readFileSync(join(outDir, '2026-08-20.png'), 'utf8')).toBe('day')
    expect(readFileSync(join(outDir, '2026-08-20', 'viewports', 'mobile.webp'), 'utf8')).toBe('new')
    expect(readFileSync(join(outDir, '2026-08-20', 'viewports', 'desktop.png'), 'utf8')).toBe('old')
    expect(existsSync(join(outDir, '2026-08-20', 'viewports', 'notes.txt'))).toBe(false)
  })

  it('leaves a copy that is already there alone, so committed ones keep their bytes', () => {
    writeDay('2026-08-20')
    put(join(archiveDir, '2026-08-20', 'build-1', 'screenshot.png'), 'from the build')
    put(join(outDir, '2026-08-20.png'), 'committed before #549')

    expect(publishArchiveImages({ archiveDir, outDir })).toBe(0)

    expect(readFileSync(join(outDir, '2026-08-20.png'), 'utf8')).toBe('committed before #549')
  })

  it('does nothing for a day with no build or no images', () => {
    mkdirSync(join(archiveDir, '2026-08-19'), { recursive: true })
    writeDay('2026-08-20')
    expect(publishArchiveImages({ archiveDir, outDir })).toBe(0)
    expect(existsSync(join(outDir, '2026-08-20.png'))).toBe(false)
  })
})
