// tests/server/archive-detail.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { _readArchiveDetail } from '../../app/server/archive-detail-impl'

// A temp dir, not archive/__test-detail__ inside the repo. _readArchiveDetail
// already takes the archive path as a parameter, so there was never a reason
// to build the fixture inside the real archive — and a throw in beforeAll left
// it there, a non-date-shaped directory sitting in a tree that is otherwise
// entirely date-shaped.
const TEST_ARCHIVE = mkdtempSync(join(tmpdir(), 'dm-archive-detail-'))

/** A record as `scripts/utils/archive-record.js` writes it. */
function record(date: string, overrides: Record<string, unknown> = {}) {
  return {
    date,
    era: 'grammar',
    generatedAt: '2026-08-24T00:00:00.000Z',
    buildId: '9999999999999',
    attempts: 1,
    brief: 'Test brief content',
    rationale: 'Test rationale paragraph.',
    filesChanged: ['app/routes/index.tsx', 'elements/preset.ts'],
    legacyArchetype: 'Specimen',
    signals: { lunar: { illumination: 0.5 } },
    hero: { copy: 'A phrase', rationale: 'It earned the scale.', source: null },
    chassis: 'space-mono-archivo',
    adBrief: { mood: 'Test mood' },
    tokens: { colors: { ramps: { lime: { '500': '#b5e61d' } }, semantic: {} } },
    colorScheme: null,
    shell: null,
    verdicts: null,
    composition: null,
    lane: null,
    cost: null,
    ...overrides,
  }
}

describe('archive detail', () => {
  const dateWithBuild = '2099-01-01'
  const dateDir = join(TEST_ARCHIVE, dateWithBuild)
  const buildDir = join(dateDir, 'build-9999999999999')

  const dateNoBuild = '2099-01-02'
  const dateDirNoBuild = join(TEST_ARCHIVE, dateNoBuild)

  const dateNoRecord = '2099-01-03'

  beforeAll(() => {
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(join(dateDir, 'record.json'), JSON.stringify(record(dateWithBuild)))
    writeFileSync(
      join(buildDir, 'trace.json'),
      JSON.stringify({ steps: [{ name: 'signals-loaded', output: {} }] })
    )

    mkdirSync(dateDirNoBuild, { recursive: true })
    writeFileSync(
      join(dateDirNoBuild, 'record.json'),
      JSON.stringify(
        record(dateNoBuild, {
          era: 'prose',
          buildId: null,
          attempts: 0,
          legacyArchetype: 'Poster',
          brief: 'Old format brief',
          rationale: 'Old rationale.',
          signals: null,
          adBrief: null,
          tokens: null,
          chassis: null,
        })
      )
    )

    // A date the backfill has not reached: artifacts, but no record.
    mkdirSync(join(TEST_ARCHIVE, dateNoRecord), { recursive: true })
  })

  afterAll(() => {
    rmSync(TEST_ARCHIVE, { recursive: true, force: true })
  })

  it('returns the record plus the raw trace the record leaves out', () => {
    const result = _readArchiveDetail(dateWithBuild, TEST_ARCHIVE)
    if (!result) throw new Error('expected a non-null archive detail')
    expect(result.date).toBe(dateWithBuild)
    expect(result.legacyArchetype).toBe('Specimen')
    expect(result.brief).toBe('Test brief content')
    expect(result.rationale).toBe('Test rationale paragraph.')
    expect(result.chassis).toBe('space-mono-archivo')
    expect(result.adBrief).toEqual({ mood: 'Test mood' })
    expect(result.tokens?.colors.ramps.lime['500']).toBe('#b5e61d')
    expect(result.filesChanged).toEqual(['app/routes/index.tsx', 'elements/preset.ts'])
    expect(result.buildId).toBe('9999999999999')
    expect(result.trace).toContain('signals-loaded')
    expect(result.hasScreenshot).toBe(false)
  })

  it('reads a date whose era never had a build directory', () => {
    const result = _readArchiveDetail(dateNoBuild, TEST_ARCHIVE)
    if (!result) throw new Error('expected a non-null archive detail')
    expect(result.era).toBe('prose')
    expect(result.legacyArchetype).toBe('Poster')
    expect(result.brief).toBe('Old format brief')
    expect(result.buildId).toBeNull()
    expect(result.trace).toBe('')
    expect(result.tokens).toBeNull()
  })

  it('returns null for a date with no record', () => {
    expect(_readArchiveDetail(dateNoRecord, TEST_ARCHIVE)).toBeNull()
  })

  it('returns null for non-existent date', () => {
    expect(_readArchiveDetail('9999-99-99', TEST_ARCHIVE)).toBeNull()
  })

  it('refuses path traversal, and refuses it for the right reason', () => {
    // This test used to pass because <fixture>/../../etc/record.json happens
    // not to exist — not because traversal was refused. Nothing validated the
    // date; the only guard lived in archive.ts's validator, which most
    // callers of this function never pass through.
    //
    // So plant a real, readable record.json one level above the fixture root
    // and point a traversal string straight at it. If the date is validated,
    // this is null. If it is not, the old implementation reads the file and
    // the assertion below fails — which is what makes this a test.
    const outsideDir = join(TEST_ARCHIVE, '..', '__test-outside__')
    mkdirSync(outsideDir, { recursive: true })
    writeFileSync(
      join(outsideDir, 'record.json'),
      JSON.stringify(record('2099-12-31', { brief: 'SHOULD NEVER BE READ' })),
      'utf8'
    )
    try {
      expect(_readArchiveDetail('../__test-outside__', TEST_ARCHIVE)).toBeNull()
      expect(_readArchiveDetail('../../etc', TEST_ARCHIVE)).toBeNull()
      expect(_readArchiveDetail('../../../etc/passwd', TEST_ARCHIVE)).toBeNull()
      expect(_readArchiveDetail('2099-01-01/../../etc', TEST_ARCHIVE)).toBeNull()
    } finally {
      rmSync(outsideDir, { recursive: true, force: true })
    }
  })

  it('rejects a date that is merely date-shaped-ish', () => {
    expect(_readArchiveDetail('2099-01-01extra', TEST_ARCHIVE)).toBeNull()
    expect(_readArchiveDetail('', TEST_ARCHIVE)).toBeNull()
    expect(_readArchiveDetail('.', TEST_ARCHIVE)).toBeNull()
  })
})
