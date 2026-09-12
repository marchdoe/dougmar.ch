import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  markBand,
  extractRecentShells,
  computeShellMandate,
  formatShellMandateForPrompt,
} from '../../scripts/utils/shell-mandate.js'

function seedBuild(archiveDir, date, { shell, header }) {
  const buildDir = path.join(archiveDir, date, `build-${Date.parse(date)}`)
  mkdirSync(buildDir, { recursive: true })
  if (shell) writeFileSync(path.join(buildDir, 'shell.json'), JSON.stringify(shell))
  if (header) writeFileSync(path.join(buildDir, 'header.json'), JSON.stringify(header))
}

describe('markBand', () => {
  it('buckets a mark size coarsely enough that 44 and 46 are the same choice', () => {
    expect(markBand(44)).toBe(markBand(46))
  })

  it('separates the sizes that read as different decisions', () => {
    expect(markBand(11)).toBe('under-28')
    expect(markBand(32)).toBe('28-44')
    expect(markBand(48)).toBe('44-64')
    expect(markBand(80)).toBe('over-64')
  })

  it('returns null for anything that is not a size', () => {
    expect(markBand(null)).toBeNull()
    expect(markBand(0)).toBeNull()
    expect(markBand('44')).toBeNull()
    expect(markBand(Number.NaN)).toBeNull()
  })
})

describe('shell mandate — the header half (#254)', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'shellm-header-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('reads nav from header.json now that it lives there', () => {
    seedBuild(archiveDir, '2026-08-29', {
      shell: { footer: 'colophon', brand_lockup: 'stacked-md', brand_color_mode: 'original' },
      header: { placement: 'left-rail', mark_px: 48, nav: 'a rotated spine' },
    })
    const [s] = extractRecentShells(archiveDir, 30)
    expect(s.nav).toBe('a rotated spine')
    expect(s.placement).toBe('left-rail')
    expect(s.mark_band).toBe('44-64')
  })

  it('still reads nav out of a legacy shell.json with no header beside it', () => {
    seedBuild(archiveDir, '2026-08-28', {
      shell: { nav: 'top bar', footer: 'none', brand_lockup: 'horizontal-md' },
    })
    const [s] = extractRecentShells(archiveDir, 30)
    expect(s.nav).toBe('top bar')
    expect(s.placement).toBeNull()
    expect(s.mark_band).toBeNull()
  })

  it('soft-forbids the last three distinct placements and mark bands', () => {
    seedBuild(archiveDir, '2026-08-26', {
      shell: { footer: 'a', brand_lockup: 'horizontal-md', brand_color_mode: 'single-color' },
      header: { placement: 'top-bar', mark_px: 24, nav: 'a' },
    })
    seedBuild(archiveDir, '2026-08-27', {
      shell: { footer: 'b', brand_lockup: 'horizontal-md', brand_color_mode: 'single-color' },
      header: { placement: 'top-bar', mark_px: 40, nav: 'b' },
    })
    seedBuild(archiveDir, '2026-08-28', {
      shell: { footer: 'c', brand_lockup: 'stacked-lg', brand_color_mode: 'single-color' },
      header: { placement: 'corner', mark_px: 70, nav: 'c' },
    })
    const m = computeShellMandate({ archiveDir, lookbackDays: 30 })
    expect(m.softForbidden.placement).toEqual(['corner', 'top-bar'])
    expect(m.softForbidden.mark_band).toEqual(['over-64', '28-44', 'under-28'])
  })

  it('nudges toward original when the window has none of it', () => {
    for (const date of ['2026-08-27', '2026-08-28', '2026-08-29']) {
      seedBuild(archiveDir, date, {
        shell: { footer: 'x', brand_lockup: 'horizontal-md', brand_color_mode: 'single-color' },
        header: { placement: 'top-bar', mark_px: 40, nav: 'x' },
      })
    }
    const m = computeShellMandate({ archiveDir, lookbackDays: 30 })
    expect(m.colorModeNudge).toMatch(/brand_color_mode: original/)
    expect(formatShellMandateForPrompt(m)).toContain('Color mode:')
  })

  it('stays quiet about color mode once original has been used', () => {
    seedBuild(archiveDir, '2026-08-28', {
      shell: { footer: 'x', brand_lockup: 'horizontal-md', brand_color_mode: 'single-color' },
      header: { placement: 'top-bar', mark_px: 40, nav: 'x' },
    })
    seedBuild(archiveDir, '2026-08-29', {
      shell: { footer: 'y', brand_lockup: 'stacked-md', brand_color_mode: 'original' },
      header: { placement: 'corner', mark_px: 48, nav: 'y' },
    })
    const m = computeShellMandate({ archiveDir, lookbackDays: 30 })
    expect(m.colorModeNudge).toBeNull()
    expect(formatShellMandateForPrompt(m)).not.toContain('Color mode:')
  })

  it('says nothing about color mode with no history at all', () => {
    const m = computeShellMandate({ archiveDir, lookbackDays: 30 })
    expect(m.colorModeNudge).toBeNull()
    expect(formatShellMandateForPrompt(m)).toContain('No recent shell history')
  })

  it('names the header fields in the prompt block', () => {
    seedBuild(archiveDir, '2026-08-29', {
      shell: { footer: 'x', brand_lockup: 'stacked-md', brand_color_mode: 'original' },
      header: { placement: 'left-rail', mark_px: 48, nav: 'a rotated spine' },
    })
    const block = formatShellMandateForPrompt(computeShellMandate({ archiveDir, lookbackDays: 30 }))
    expect(block).toContain('Header placements used recently (avoid):** left-rail')
    expect(block).toContain('Mark size bands used recently (avoid):** 44-64')
    expect(block).toContain('justify')
  })
})
