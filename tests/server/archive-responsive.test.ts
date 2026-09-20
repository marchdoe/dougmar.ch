// tests/server/archive-responsive.test.ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { _readResponsiveHistory, _readResponsiveMetrics } from '../../app/server/archive-impl'

// Temp dir, as in tests/server/archive.test.ts: nothing here writes under the
// repo's archive/.
let archive: string

beforeEach(() => {
  archive = mkdtempSync(join(tmpdir(), 'dm-archive-responsive-'))
})

afterEach(() => {
  rmSync(archive, { recursive: true, force: true })
})

const metrics = (buildId: string, over: Record<string, unknown> = {}) => ({
  buildId,
  date: '2026-03-14',
  archetype: null,
  overallScore: 90,
  worstFailure: null,
  viewports: { '360': { width: 360, height: 800, score: 90, checks: {} } },
  ...over,
})

/** Write `archive/<date>/<dir>/responsive-metrics.json`; a string is written as is. */
function writeMetrics(date: string, dir: string, content: unknown) {
  const buildDir = join(archive, date, dir)
  mkdirSync(buildDir, { recursive: true })
  writeFileSync(
    join(buildDir, 'responsive-metrics.json'),
    typeof content === 'string' ? content : JSON.stringify(content),
    'utf8'
  )
}

describe('_readResponsiveMetrics', () => {
  it('reads the metrics for a build', () => {
    writeMetrics('2026-03-14', 'build-1000', metrics('1000'))
    expect(_readResponsiveMetrics('2026-03-14', '1000', archive)).toEqual(metrics('1000'))
  })

  it('is null for a date or build id that could traverse or is not a date', () => {
    writeMetrics('2026-03-14', 'build-1000', metrics('1000'))
    expect(_readResponsiveMetrics('../2026-03-14', '1000', archive)).toBeNull()
    expect(_readResponsiveMetrics('2026-3-14', '1000', archive)).toBeNull()
    expect(_readResponsiveMetrics('2026-03-14', '../1000', archive)).toBeNull()
    expect(_readResponsiveMetrics('2026-03-14', 'failed-1000', archive)).toBeNull()
    expect(_readResponsiveMetrics('2026-03-14', '', archive)).toBeNull()
  })

  it('is null when the build has no metrics file', () => {
    mkdirSync(join(archive, '2026-03-14', 'build-1000'), { recursive: true })
    expect(_readResponsiveMetrics('2026-03-14', '1000', archive)).toBeNull()
  })

  it('is null for a file that is not JSON', () => {
    writeMetrics('2026-03-14', 'build-1000', '{"buildId": "1000", "viewp')
    expect(_readResponsiveMetrics('2026-03-14', '1000', archive)).toBeNull()
  })

  it.each([
    ['an array', []],
    ['no buildId', { viewports: {} }],
    ['a numeric buildId', { buildId: 1000, viewports: {} }],
    ['no viewports', { buildId: '1000' }],
    ['viewports an array', { buildId: '1000', viewports: [] }],
  ])('is null for a file with %s', (_label, content) => {
    writeMetrics('2026-03-14', 'build-1000', content)
    expect(_readResponsiveMetrics('2026-03-14', '1000', archive)).toBeNull()
  })
})

describe('_readResponsiveHistory', () => {
  it('is empty when the archive dir does not exist', () => {
    expect(_readResponsiveHistory(30, join(archive, 'nope'))).toEqual([])
  })

  it('is empty for an archive with no metrics', () => {
    mkdirSync(join(archive, '2026-03-14', 'build-1000'), { recursive: true })
    expect(_readResponsiveHistory(30, archive)).toEqual([])
  })

  it('lists newest first: date descending, then build id descending', () => {
    writeMetrics('2026-03-12', 'build-1000', metrics('1000'))
    writeMetrics('2026-03-14', 'build-2000', metrics('2000'))
    writeMetrics('2026-03-14', 'build-3000', metrics('3000'))
    writeMetrics('2026-03-13', 'build-1500', metrics('1500'))
    expect(_readResponsiveHistory(30, archive).map((m) => m.buildId)).toEqual([
      '3000',
      '2000',
      '1500',
      '1000',
    ])
  })

  it('stops at the limit, across date dirs', () => {
    writeMetrics('2026-03-13', 'build-1000', metrics('1000'))
    writeMetrics('2026-03-14', 'build-2000', metrics('2000'))
    writeMetrics('2026-03-14', 'build-3000', metrics('3000'))
    expect(_readResponsiveHistory(2, archive).map((m) => m.buildId)).toEqual(['3000', '2000'])
    expect(_readResponsiveHistory(1, archive).map((m) => m.buildId)).toEqual(['3000'])
  })

  it('leaves out builds that never shipped', () => {
    writeMetrics('2026-03-14', 'build-1000', metrics('1000'))
    writeMetrics('2026-03-14', 'build-failed-2000', metrics('2000'))
    writeMetrics('2026-03-14', 'build-pre-3000', metrics('3000'))
    expect(_readResponsiveHistory(30, archive).map((m) => m.buildId)).toEqual(['1000'])
  })

  it('skips a build whose file is missing, broken or the wrong shape, and keeps going', () => {
    writeMetrics('2026-03-14', 'build-1000', metrics('1000'))
    writeMetrics('2026-03-14', 'build-2000', '{broken')
    writeMetrics('2026-03-14', 'build-3000', { buildId: '3000' })
    mkdirSync(join(archive, '2026-03-14', 'build-4000'), { recursive: true })
    expect(_readResponsiveHistory(30, archive).map((m) => m.buildId)).toEqual(['1000'])
  })

  it('ignores entries that are not date dirs', () => {
    writeMetrics('2026-03-14', 'build-1000', metrics('1000'))
    writeMetrics('scratch', 'build-2000', metrics('2000'))
    writeMetrics('2026-3-14', 'build-3000', metrics('3000'))
    expect(_readResponsiveHistory(30, archive).map((m) => m.buildId)).toEqual(['1000'])
  })

  it('skips a date entry that is a file, not a directory', () => {
    writeMetrics('2026-03-12', 'build-1000', metrics('1000'))
    writeFileSync(join(archive, '2026-03-13'), 'not a dir', 'utf8')
    expect(_readResponsiveHistory(30, archive).map((m) => m.buildId)).toEqual(['1000'])
  })
})
