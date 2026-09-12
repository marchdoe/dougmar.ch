import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  extractRecentShells,
  computeShellMandate,
  formatShellMandateForPrompt,
} from '../../scripts/utils/shell-mandate.js'

function seedBuild(archiveDir, date, shell) {
  const buildDir = path.join(archiveDir, date, `build-${Date.parse(date)}`)
  mkdirSync(buildDir, { recursive: true })
  writeFileSync(path.join(buildDir, 'shell.json'), JSON.stringify(shell))
}

describe('shell-mandate', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'shellm-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('extracts recent shells newest-first', () => {
    seedBuild(archiveDir, '2026-06-09', {
      nav: 'top bar',
      footer: 'data strip',
      brand_lockup: 'mark-only-md',
    })
    seedBuild(archiveDir, '2026-06-10', {
      nav: 'left spine',
      footer: 'colophon',
      brand_lockup: 'horizontal-md',
    })
    const shells = extractRecentShells(archiveDir, 7)
    expect(shells.length).toBe(2)
    expect(shells[0].nav).toBe('left spine')
  })

  it('computes soft-forbidden lists from the last 3 distinct values', () => {
    seedBuild(archiveDir, '2026-06-08', {
      nav: 'top bar',
      footer: 'data strip',
      brand_lockup: 'mark-only-md',
    })
    seedBuild(archiveDir, '2026-06-09', {
      nav: 'top bar',
      footer: 'colophon',
      brand_lockup: 'horizontal-md',
    })
    seedBuild(archiveDir, '2026-06-10', {
      nav: 'left spine',
      footer: 'none',
      brand_lockup: 'stacked-lg',
    })
    const m = computeShellMandate({ archiveDir, lookbackDays: 7 })
    expect(m.softForbidden.nav).toEqual(['left spine', 'top bar'])
    expect(m.softForbidden.brand_lockup).toContain('stacked-lg')
  })

  it('degrades to empty mandate with no history', () => {
    const m = computeShellMandate({ archiveDir, lookbackDays: 7 })
    expect(m.softForbidden.nav).toEqual([])
    expect(formatShellMandateForPrompt(m)).toContain('No recent shell history')
  })

  it('formats a prompt block with guidance language', () => {
    seedBuild(archiveDir, '2026-06-10', {
      nav: 'top bar',
      footer: 'data strip',
      brand_lockup: 'mark-only-md',
    })
    const block = formatShellMandateForPrompt(computeShellMandate({ archiveDir, lookbackDays: 7 }))
    expect(block).toContain('## Shell Mandate')
    expect(block).toContain('top bar')
    expect(block).toContain('justify')
  })
})
