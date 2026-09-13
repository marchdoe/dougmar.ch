import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { OPEN_COLOR_MANDATE, computeMandateSections } from '../../scripts/pipeline/mandates.js'

let root

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), 'mandates-'))
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  rmSync(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})

describe('computeMandateSections', () => {
  it('returns every section and the colour mandate as data, on an empty archive', () => {
    const { colorMandate, sections } = computeMandateSections({
      root,
      signals: {},
      date: '2026-08-30',
    })
    expect(Object.keys(sections).sort()).toEqual(
      [
        'chassis',
        'color',
        'composition',
        'heroSource',
        'paletteFormula',
        'shell',
        'typeTreatment',
      ].sort()
    )
    // The colour mandate always renders; the others say nothing with no history.
    expect(sections.color).toContain('## Color Mandate')
    expect(colorMandate.targetHueRange).toEqual([0, 360])
    expect(colorMandate.forbiddenHues).toEqual([])
  })

  it('never throws: a mandate that cannot be computed degrades to open', () => {
    // A file where the archive directory should be: existsSync says yes,
    // readdirSync throws ENOTDIR, and every walk fails.
    writeFileSync(path.join(root, 'archive'), '')
    const { colorMandate, sections } = computeMandateSections({
      root,
      signals: {},
      date: '2026-08-30',
    })
    expect(colorMandate.targetHueRange).toEqual([0, 360])
    expect(typeof sections.shell).toBe('string')
  })

  it('exposes the permissive default the colour path falls back to', () => {
    expect(OPEN_COLOR_MANDATE.targetHueRange).toEqual([0, 360])
    expect(OPEN_COLOR_MANDATE.forbiddenHues).toEqual([])
  })
})
