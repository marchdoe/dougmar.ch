import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  extractRecentEntrances,
  computeMotionMandate,
  formatMotionMandateForPrompt,
} from '../../scripts/utils/motion-mandate.js'

function seedBuild(archiveDir, date, motion) {
  const buildDir = path.join(archiveDir, date, `build-${Date.parse(date)}`)
  mkdirSync(buildDir, { recursive: true })
  if (motion) writeFileSync(path.join(buildDir, 'motion.json'), JSON.stringify(motion))
}

const M = (entrance) => ({ entrance, ground: 'static', reveal: 'none' })

describe('motion-mandate', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'motionm-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('extracts recent entrances newest-first and skips builds without motion.json', () => {
    seedBuild(archiveDir, '2026-09-10', M('rise'))
    seedBuild(archiveDir, '2026-09-11', null)
    seedBuild(archiveDir, '2026-09-12', M('wipe'))
    expect(extractRecentEntrances(archiveDir, 30)).toEqual([
      { date: '2026-09-12', entrance: 'wipe' },
      { date: '2026-09-10', entrance: 'rise' },
    ])
  })

  it('soft-forbids the last three distinct entrances', () => {
    seedBuild(archiveDir, '2026-09-08', M('wipe'))
    seedBuild(archiveDir, '2026-09-09', M('none'))
    seedBuild(archiveDir, '2026-09-10', M('settle'))
    seedBuild(archiveDir, '2026-09-11', M('settle'))
    seedBuild(archiveDir, '2026-09-12', M('rise'))
    const m = computeMotionMandate({ archiveDir, lookbackDays: 30 })
    expect(m.softForbidden).toEqual(['rise', 'settle', 'none'])
    expect(m.recentEntrances).toHaveLength(5)
  })

  it('degrades to an open mandate and an empty prompt block with no history', () => {
    const m = computeMotionMandate({ archiveDir, lookbackDays: 7 })
    expect(m.recentEntrances).toEqual([])
    expect(m.softForbidden).toEqual([])
    expect(m.rationale).toContain('No recent motion history')
    expect(formatMotionMandateForPrompt(m)).toBe('')
  })

  it('formats a prompt block in the shape of the other recency mandates', () => {
    seedBuild(archiveDir, '2026-09-12', M('rise'))
    const block = formatMotionMandateForPrompt(
      computeMotionMandate({ archiveDir, lookbackDays: 7 })
    )
    expect(block).toContain('## Motion Mandate')
    expect(block).toContain('**Entrances used recently (avoid):** rise')
    expect(block).toContain('**Rationale:** Last 1 declared entrances: 2026-09-12: rise')
    expect(block).toContain('`none` is a real choice on a poster day')
    expect(block).toContain('Fit > novelty')
  })

  it('honors the lookback window', () => {
    seedBuild(archiveDir, '2026-08-01', M('wipe'))
    seedBuild(archiveDir, '2026-09-12', M('rise'))
    const m = computeMotionMandate({ archiveDir, lookbackDays: 1 })
    expect(m.recentEntrances.map((t) => t.date)).toEqual(['2026-09-12'])
  })
})
