import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  extractRecentTypeTreatments,
  computeTypeTreatmentMandate,
  formatTypeTreatmentMandateForPrompt,
} from '../../scripts/utils/type-treatment-mandate.js'

function seedBuild(archiveDir, date, treatment) {
  const buildDir = path.join(archiveDir, date, `build-${Date.parse(date)}`)
  mkdirSync(buildDir, { recursive: true })
  if (treatment) {
    writeFileSync(path.join(buildDir, 'type-treatment.json'), JSON.stringify(treatment))
  }
}

const T = (over = {}) => ({
  case: 'mixed',
  lead: 'roman',
  weight: 'regular',
  alignment: 'left',
  texture: 'none',
  ...over,
})

describe('type-treatment-mandate', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'typem-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('extracts recent treatments newest-first and skips builds without one', () => {
    seedBuild(archiveDir, '2026-09-10', T({ case: 'caps' }))
    seedBuild(archiveDir, '2026-09-11', null)
    seedBuild(archiveDir, '2026-09-12', T({ case: 'lower' }))
    const recent = extractRecentTypeTreatments(archiveDir, 30)
    expect(recent.map((t) => [t.date, t.case])).toEqual([
      ['2026-09-12', 'lower'],
      ['2026-09-10', 'caps'],
    ])
  })

  it('drops a value that is no longer in the vocabulary rather than forbidding it', () => {
    seedBuild(archiveDir, '2026-09-12', T({ texture: 'glitter', case: 'CAPS' }))
    const [t] = extractRecentTypeTreatments(archiveDir, 30)
    expect(t.texture).toBeNull()
    expect(t.case).toBe('caps')
  })

  it('soft-forbids the last three distinct values, per field', () => {
    seedBuild(archiveDir, '2026-09-08', T({ case: 'lower', texture: 'outline' }))
    seedBuild(archiveDir, '2026-09-09', T({ case: 'small-caps', texture: 'vertical' }))
    seedBuild(archiveDir, '2026-09-10', T({ case: 'caps', texture: 'none' }))
    seedBuild(archiveDir, '2026-09-11', T({ case: 'caps', texture: 'stacked' }))
    seedBuild(archiveDir, '2026-09-12', T({ case: 'mixed', texture: 'none' }))
    const m = computeTypeTreatmentMandate({ archiveDir, lookbackDays: 30 })
    expect(m.softForbidden.case).toEqual(['mixed', 'caps', 'small-caps'])
    expect(m.softForbidden.texture).toEqual(['none', 'stacked', 'vertical'])
    expect(m.softForbidden.alignment).toEqual(['left'])
  })

  it('never forbids every value of a field: a fully covered field reads as open', () => {
    seedBuild(archiveDir, '2026-09-11', T({ lead: 'italic' }))
    seedBuild(archiveDir, '2026-09-12', T({ lead: 'roman' }))
    const m = computeTypeTreatmentMandate({ archiveDir, lookbackDays: 30 })
    expect(m.softForbidden.lead).toEqual([])
    expect(m.softForbidden.case).toEqual(['mixed'])
  })

  it('degrades to an open mandate and an empty prompt block with no history', () => {
    const m = computeTypeTreatmentMandate({ archiveDir, lookbackDays: 7 })
    expect(m.recentTreatments).toEqual([])
    expect(m.softForbidden.case).toEqual([])
    expect(m.rationale).toContain('No recent type treatment history')
    expect(formatTypeTreatmentMandateForPrompt(m)).toBe('')
  })

  it('formats a prompt block naming each field and the guidance language of the other mandates', () => {
    seedBuild(archiveDir, '2026-09-12', T({ case: 'caps', weight: 'heavy', texture: 'stacked' }))
    const block = formatTypeTreatmentMandateForPrompt(
      computeTypeTreatmentMandate({ archiveDir, lookbackDays: 7 })
    )
    expect(block).toContain('## Type Treatment Mandate')
    expect(block).toContain('**Case used recently (avoid):** caps')
    expect(block).toContain('**Weight used recently (avoid):** heavy')
    expect(block).toContain('**Texture used recently (avoid):** stacked')
    expect(block).toContain('**Rationale:** Last 1 type treatment: 2026-09-12: case=caps')
    expect(block).toContain('Fit > novelty')
  })

  it('honors the lookback window', () => {
    seedBuild(archiveDir, '2026-08-01', T({ case: 'lower' }))
    seedBuild(archiveDir, '2026-09-12', T({ case: 'caps' }))
    const m = computeTypeTreatmentMandate({ archiveDir, lookbackDays: 1 })
    expect(m.recentTreatments.map((t) => t.date)).toEqual(['2026-09-12'])
  })
})
