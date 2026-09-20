import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  extractRecentHeroSources,
  computeHeroSourceMandate,
  formatHeroSourceMandateForPrompt,
} from '../../scripts/utils/hero-source-mandate.js'

function seedBuild(archiveDir, date, heroSource) {
  const buildDir = path.join(archiveDir, date, `build-${Date.parse(date)}`)
  mkdirSync(buildDir, { recursive: true })
  writeFileSync(path.join(buildDir, 'hero-source.json'), JSON.stringify(heroSource))
}

describe('hero-source-mandate', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'herosrcm-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('extracts recent hero sources newest-first', () => {
    seedBuild(archiveDir, '2026-08-01', { source: 'quote' })
    seedBuild(archiveDir, '2026-08-02', { source: 'composed' })
    const sources = extractRecentHeroSources(archiveDir, 7)
    expect(sources.length).toBe(2)
    expect(sources[0].source).toBe('composed')
  })

  it('does not forbid quote after two consecutive quote-sourced days', () => {
    seedBuild(archiveDir, '2026-08-03', { source: 'quote' })
    seedBuild(archiveDir, '2026-08-04', { source: 'quote' })
    const m = computeHeroSourceMandate({ archiveDir, lookbackDays: 7 })
    expect(m.softForbidden).toEqual([])
  })

  it('still forbids a repeated non-quote lane after two consecutive days', () => {
    seedBuild(archiveDir, '2026-08-03', { source: 'composed' })
    seedBuild(archiveDir, '2026-08-04', { source: 'composed' })
    const m = computeHeroSourceMandate({ archiveDir, lookbackDays: 7 })
    expect(m.softForbidden).toEqual(['composed'])
  })

  it('does not forbid a non-quote lane when the streak is broken', () => {
    seedBuild(archiveDir, '2026-08-02', { source: 'composed' })
    seedBuild(archiveDir, '2026-08-03', { source: 'quote' })
    seedBuild(archiveDir, '2026-08-04', { source: 'composed' })
    const m = computeHeroSourceMandate({ archiveDir, lookbackDays: 7 })
    expect(m.softForbidden).toEqual([])
  })

  it('does not forbid quote on a single quote-sourced day', () => {
    seedBuild(archiveDir, '2026-08-04', { source: 'quote' })
    const m = computeHeroSourceMandate({ archiveDir, lookbackDays: 7 })
    expect(m.softForbidden).toEqual([])
  })

  it('skips builds with no declared hero source (old archives)', () => {
    const buildDir = path.join(archiveDir, '2026-08-01', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    const sources = extractRecentHeroSources(archiveDir, 7)
    expect(sources).toEqual([])
  })

  it('degrades to empty mandate and empty prompt block with no history', () => {
    const m = computeHeroSourceMandate({ archiveDir, lookbackDays: 7 })
    expect(m.softForbidden).toEqual([])
    expect(m.recentHeroSources).toEqual([])
    expect(formatHeroSourceMandateForPrompt(m)).toBe('')
  })

  it('formats a prompt block with guidance language when history exists', () => {
    seedBuild(archiveDir, '2026-08-03', { source: 'composed' })
    seedBuild(archiveDir, '2026-08-04', { source: 'composed' })
    const block = formatHeroSourceMandateForPrompt(
      computeHeroSourceMandate({ archiveDir, lookbackDays: 7 })
    )
    expect(block).toContain('## Hero Source Mandate')
    expect(block).toContain('composed')
    expect(block).toContain('justify')
  })
})
