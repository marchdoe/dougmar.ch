import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  anomaliesOf,
  buildRecord,
  eraForDate,
  expectedArtifacts,
  liftSignals,
  parseBrief,
  parseSignalsBrief,
  pickBuild,
} from '../../scripts/utils/archive-record.js'

let archiveDir

/** Write a build dir's worth of files. Values are written verbatim. */
function writeBuild(date, buildId, files) {
  const dir = join(archiveDir, date, `build-${buildId}`)
  mkdirSync(dir, { recursive: true })
  for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content)
  return dir
}

function writeDateFile(date, name, content) {
  mkdirSync(join(archiveDir, date), { recursive: true })
  writeFileSync(join(archiveDir, date, name), content)
}

const BRIEF = `# 2026-06-28

**Design Brief:** Terracotta fire on near-void dark.

## Signals

## Claude's Rationale

The hero phrase arrived without competition.

## Files Changed

- elements/preset.ts
- app/components/Sidebar.tsx
`

beforeEach(() => {
  archiveDir = mkdtempSync(join(tmpdir(), 'archive-record-'))
})

afterEach(() => {
  rmSync(archiveDir, { recursive: true, force: true })
})

describe('eraForDate', () => {
  it('stamps each stratum from its first date', () => {
    expect(eraForDate('2026-03-12')).toBe('prose')
    expect(eraForDate('2026-03-19')).toBe('prose')
    expect(eraForDate('2026-03-20')).toBe('logged')
    expect(eraForDate('2026-03-29')).toBe('traced')
    expect(eraForDate('2026-04-18')).toBe('color-directed')
    expect(eraForDate('2026-07-12')).toBe('shell-directed')
    expect(eraForDate('2026-08-23')).toBe('grammar')
    expect(eraForDate('2026-08-30')).toBe('header-declared')
    expect(eraForDate('2027-01-01')).toBe('header-declared')
  })

  it('returns null before the archive begins', () => {
    expect(eraForDate('2026-03-11')).toBeNull()
  })
})

describe('expectedArtifacts', () => {
  it('accumulates every stratum below', () => {
    expect(expectedArtifacts('prose')).toEqual(['brief.md', 'archetype.txt'])
    expect(expectedArtifacts('traced')).toContain('build.json')
    expect(expectedArtifacts('grammar')).toContain('color-scheme.json')
    expect(expectedArtifacts('grammar')).toContain('cost.json')
  })
})

describe('pickBuild', () => {
  it('picks the build whose brief matches the day it shipped', () => {
    // 2026-04-30's shape: a complete-looking retry that never went live.
    writeBuild('2026-04-30', '1777546126760', { 'brief.md': BRIEF })
    writeBuild('2026-04-30', '1777547559412', { 'brief.md': 'a retry that never shipped' })
    writeDateFile('2026-04-30', 'brief.md', BRIEF)

    const picked = pickBuild(join(archiveDir, '2026-04-30'))
    expect(picked.buildId).toBe('1777546126760')
    expect(picked.attempts).toBe(2)
  })

  it('skips a newest build that carries no brief at all', () => {
    // 2026-04-28's shape: newest build dir holds only a stray .DS_Store.
    writeBuild('2026-04-28', '1777373640991', { 'brief.md': BRIEF })
    writeBuild('2026-04-28', '1777389003254', { '.DS_Store': 'junk' })

    expect(pickBuild(join(archiveDir, '2026-04-28')).buildId).toBe('1777373640991')
  })

  it('takes the newest when several shipped identically', () => {
    writeBuild('2026-03-18', '1773831843342', { 'brief.md': BRIEF })
    writeBuild('2026-03-18', '1773868809694', { 'brief.md': BRIEF })
    writeDateFile('2026-03-18', 'brief.md', BRIEF)

    expect(pickBuild(join(archiveDir, '2026-03-18')).buildId).toBe('1773868809694')
  })

  it('orders builds numerically, not lexically', () => {
    writeBuild('2026-06-28', '99999999999', { 'brief.md': 'older, shorter id' })
    writeBuild('2026-06-28', '100000000000', { 'brief.md': BRIEF })
    writeDateFile('2026-06-28', 'brief.md', BRIEF)

    expect(pickBuild(join(archiveDir, '2026-06-28')).buildId).toBe('100000000000')
  })

  it('reports no build for a prose-era date that never had one', () => {
    writeDateFile('2026-03-12', 'brief.md', BRIEF)
    expect(pickBuild(join(archiveDir, '2026-03-12'))).toEqual({
      buildId: null,
      buildDir: null,
      attempts: 0,
    })
  })
})

describe('parseBrief', () => {
  it('reads the brief, rationale, and file list', () => {
    expect(parseBrief(BRIEF)).toEqual({
      brief: 'Terracotta fire on near-void dark.',
      rationale: 'The hero phrase arrived without competition.',
      filesChanged: ['elements/preset.ts', 'app/components/Sidebar.tsx'],
    })
  })

  it('handles a brief with no file list', () => {
    const md = "# 2026-03-12\n\n**Design Brief:** A start.\n\n## Claude's Rationale\n\nBecause.\n"
    expect(parseBrief(md)).toEqual({
      brief: 'A start.',
      rationale: 'Because.',
      filesChanged: [],
    })
  })

  it('returns nulls for a missing file', () => {
    expect(parseBrief(null)).toEqual({ brief: null, rationale: null, filesChanged: [] })
  })
})

describe('parseSignalsBrief', () => {
  const MODERN = `# Signals Brief — 2026-06-28

## Hero Copy
We can spend our whole lives escaping.

## Hero Rationale
It arrived on a quiet day.

## Archetype
Gallery Wall

## Chassis
bricolage-manrope

## Visual Specification
### 1. Color Specification
Terracotta.

### 5. Signal Integration
The full moon amplifies the phrase.

## Self-Check
Checked.

## Rationale
Because it earned the scale.
`

  const PROSE = `# Creative Brief: doug-march.com
## 2026-04-05

## Mood
Easter Sunday arrives contemplative.

## Composition Direction
Specimen with Gallery Wall energy.

## Typography Direction
Generous and precise.

## Signal Integration
- Hacker News at 756 points.

## Palette Direction
Spring saturation with restraint.
`

  it('reads the modern vocabulary', () => {
    const parsed = parseSignalsBrief(MODERN)
    expect(parsed.hero.copy).toBe('We can spend our whole lives escaping.')
    expect(parsed.hero.rationale).toBe('It arrived on a quiet day.')
    expect(parsed.chassis).toBe('bricolage-manrope')
    expect(parsed.adBrief.selfCheck).toBe('Checked.')
    expect(parsed.adBrief.rationale).toBe('Because it earned the scale.')
    expect(parsed.adBrief.visualSpecification).toContain('### 1. Color Specification')
  })

  it('lifts signal integration out of the numbered visual-spec subsection', () => {
    expect(parseSignalsBrief(MODERN).adBrief.signalIntegration).toBe(
      'The full moon amplifies the phrase.'
    )
  })

  it('reads the pre-2026-05 directional vocabulary', () => {
    const parsed = parseSignalsBrief(PROSE)
    expect(parsed.hero.copy).toBeNull()
    expect(parsed.chassis).toBeNull()
    expect(parsed.adBrief.mood).toBe('Easter Sunday arrives contemplative.')
    expect(parsed.adBrief.compositionDirection).toBe('Specimen with Gallery Wall energy.')
    expect(parsed.adBrief.paletteDirection).toBe('Spring saturation with restraint.')
  })

  it('drops date and title headings instead of keying on them', () => {
    expect(Object.keys(parseSignalsBrief(PROSE).adBrief)).toEqual([
      'mood',
      'compositionDirection',
      'typographyDirection',
      'signalIntegration',
      'paletteDirection',
    ])
  })

  it('returns nulls for a missing file', () => {
    expect(parseSignalsBrief(null)).toEqual({
      hero: { copy: null, rationale: null },
      chassis: null,
      adBrief: null,
    })
  })
})

describe('liftSignals', () => {
  it('takes only the signals-loaded output', () => {
    const trace = {
      date: '2026-06-28',
      steps: [
        { name: 'signals-loaded', output: { lunar: { illumination: 0.99 } } },
        { name: 'art-director', output: { huge: 'x'.repeat(100) } },
      ],
    }
    expect(liftSignals(trace)).toEqual({ lunar: { illumination: 0.99 } })
  })

  it('returns null when there is no trace or no such step', () => {
    expect(liftSignals(null)).toBeNull()
    expect(liftSignals({ steps: [{ name: 'art-director' }] })).toBeNull()
  })
})

describe('buildRecord', () => {
  it('assembles a grammar-era day from its artifacts', () => {
    writeBuild('2026-08-23', '1787524807640', {
      'brief.md': BRIEF,
      'build.json': '{}',
      'signals-brief.md': '## Chassis\nspace-mono-archivo\n',
      'preset.ts':
        "definePreset({ theme: { tokens: { colors: { lime: { 500: { value: '#b5e61d' } } } } } })",
      'trace.json': JSON.stringify({ steps: [{ name: 'signals-loaded', output: { golf: {} } }] }),
      'color-scheme.json': '{"mood_word":"vigilant"}',
      'shell.json': '{"nav":"none"}',
      'verdicts.json': '[{"critic":"spec-critic","verdict":"SHIP"}]',
      'composition.json': '{"density":"dense"}',
      'lane.json': '{"laneId":"swiss-poster"}',
      'hero-source.json': '{"source":"signal-event"}',
      'cost.json': '{"total_usd":2.03,"calls":7,"retries":1}',
      'mockup.html': '<html></html>',
    })
    writeDateFile('2026-08-23', 'brief.md', BRIEF)
    writeDateFile('2026-08-23', 'archetype.txt', 'a postmortem report, rendered as a page')

    const record = buildRecord('2026-08-23', { archiveDir, generatedAt: '2026-08-24T00:00:00Z' })

    expect(record.era).toBe('grammar')
    expect(record.buildId).toBe('1787524807640')
    expect(record.attempts).toBe(1)
    expect(record.brief).toBe('Terracotta fire on near-void dark.')
    expect(record.chassis).toBe('space-mono-archivo')
    expect(record.signals).toEqual({ golf: {} })
    expect(record.tokens.colors.ramps.lime[500]).toBe('#b5e61d')
    expect(record.colorScheme.mood_word).toBe('vigilant')
    expect(record.composition.density).toBe('dense')
    expect(record.hero.source).toBe('signal-event')
    expect(record.cost.total_usd).toBe(2.03)
    expect(anomaliesOf(record)).toEqual([])
  })

  it('keeps the purpose of each call, and reads a night from before purposes as it always did (#578)', () => {
    writeBuild('2026-09-21', '300', {
      'brief.md': BRIEF,
      'cost.json': JSON.stringify({
        total_usd: 4.82,
        calls: 2,
        retries: 0,
        byAgent: [
          { agent: 'art-director', purpose: 'first', cost_usd: 1 },
          { agent: 'react-engineer', purpose: 'repair', cost_usd: 3.82 },
        ],
      }),
    })
    writeDateFile('2026-09-21', 'brief.md', BRIEF)
    const record = buildRecord('2026-09-21', { archiveDir })
    expect(record.cost.byAgent.map((c) => c.purpose)).toEqual(['first', 'repair'])
    // One attempt: no field for the others.
    expect(record.cost).not.toHaveProperty('priorAttempts')
    expect(record.cost).not.toHaveProperty('night_usd')

    writeBuild('2026-08-20', '100', {
      'brief.md': BRIEF,
      'cost.json': JSON.stringify({ total_usd: 1, calls: 1, byAgent: [{ agent: 'art-director' }] }),
    })
    writeDateFile('2026-08-20', 'brief.md', BRIEF)
    const old = buildRecord('2026-08-20', { archiveDir })
    expect(old.cost.byAgent).toEqual([{ agent: 'art-director' }])
  })

  it("carries the night's earlier attempts when the run that shipped it recorded them (#578)", () => {
    writeBuild('2026-09-20', '200', {
      'brief.md': BRIEF,
      'cost.json': JSON.stringify({
        total_usd: 4.82,
        calls: 12,
        retries: 1,
        byAgent: [],
        priorAttempts: [{ runId: '111', total_usd: 4.18, calls: 10 }],
        night_usd: 9,
      }),
    })
    writeDateFile('2026-09-20', 'brief.md', BRIEF)
    const { cost } = buildRecord('2026-09-20', { archiveDir })
    expect(cost.total_usd).toBe(4.82)
    expect(cost.night_usd).toBe(9)
    expect(cost.priorAttempts).toEqual([{ runId: '111', total_usd: 4.18, calls: 10 }])
  })

  it('carries whether the surface gate measured, and reads null for every older night (#565)', () => {
    writeBuild('2026-09-20', '200', {
      'brief.md': BRIEF,
      'surface-gate.json': JSON.stringify({ ran: false, error: 'browser crashed', round: 1 }),
    })
    writeDateFile('2026-09-20', 'brief.md', BRIEF)
    expect(buildRecord('2026-09-20', { archiveDir }).surfaceGate).toEqual({
      ran: false,
      error: 'browser crashed',
      round: 1,
    })

    writeBuild('2026-09-19', '100', { 'brief.md': BRIEF })
    writeDateFile('2026-09-19', 'brief.md', BRIEF)
    const old = buildRecord('2026-09-19', { archiveDir })
    expect(old.surfaceGate).toBeNull()
    // Not an artifact any era is expected to carry, so an older date is no anomaly.
    expect(anomaliesOf(old).join('\n')).not.toContain('surface-gate')
    // And it survives the JSON round trip record.json takes.
    expect(JSON.parse(JSON.stringify(old)).surfaceGate).toBeNull()
  })

  it('reads a malformed surface-gate.json as unknown rather than as a gate that ran', () => {
    for (const [i, raw] of ['{"ran":"yes"}', '[]', 'not json'].entries()) {
      const date = `2026-09-0${i + 1}`
      writeBuild(date, '1', { 'brief.md': BRIEF, 'surface-gate.json': raw })
      writeDateFile(date, 'brief.md', BRIEF)
      expect(buildRecord(date, { archiveDir }).surfaceGate, raw).toBeNull()
    }
  })

  it('degrades a prose-era day to what that stratum actually had', () => {
    writeDateFile('2026-03-12', 'brief.md', BRIEF)
    writeDateFile('2026-03-12', 'archetype.txt', 'Index')

    const record = buildRecord('2026-03-12', { archiveDir, generatedAt: 'x' })

    expect(record.era).toBe('prose')
    expect(record.buildId).toBeNull()
    expect(record.legacyArchetype).toBe('Index')
    expect(record.brief).toBe('Terracotta fire on near-void dark.')
    expect(record.signals).toBeNull()
    expect(record.tokens).toBeNull()
    expect(record.adBrief).toBeNull()
    expect(anomaliesOf(record)).toEqual([])
  })

  it('keeps the eight-name vocabulary and drops today’s free prose', () => {
    writeDateFile('2026-03-12', 'brief.md', BRIEF)
    writeDateFile('2026-03-12', 'archetype.txt', 'Gallery Wall')
    expect(buildRecord('2026-03-12', { archiveDir }).legacyArchetype).toBe('Gallery Wall')

    writeDateFile('2026-08-23', 'brief.md', BRIEF)
    writeDateFile('2026-08-23', 'archetype.txt', 'a postmortem report, rendered as a page')
    expect(buildRecord('2026-08-23', { archiveDir }).legacyArchetype).toBeNull()
  })

  it('prefers signals passed in over the trace on disk', () => {
    writeBuild('2026-08-23', '1', {
      'brief.md': BRIEF,
      'trace.json': JSON.stringify({
        steps: [{ name: 'signals-loaded', output: { stale: true } }],
      }),
    })
    const record = buildRecord('2026-08-23', { archiveDir, signals: { fresh: true } })
    expect(record.signals).toEqual({ fresh: true })
  })

  it('flags a date whose artifacts disagree with its era', () => {
    // 2026-04-14's shape: a build dir holding a site copy and nothing else.
    mkdirSync(join(archiveDir, '2026-04-14', 'build-1776167013986', 'site'), { recursive: true })

    const record = buildRecord('2026-04-14', { archiveDir })

    expect(record.era).toBe('traced')
    expect(anomaliesOf(record)).toEqual([
      'missing brief.md',
      'missing archetype.txt',
      'missing build.json',
      'missing trace.json',
      'missing signals-brief.md',
      'missing preset.ts',
    ])
  })

  it('records an unparseable preset as an anomaly rather than throwing', () => {
    writeBuild('2026-06-28', '1', {
      'brief.md': BRIEF,
      'preset.ts': 'definePreset({ theme: { tokens: { colors: someImport } } })',
    })
    const record = buildRecord('2026-06-28', { archiveDir })
    expect(record.tokens).toBeNull()
    expect(anomaliesOf(record).join(' ')).toMatch(/preset\.ts unparseable/)
  })

  it('never puts anomalies in the serialized record', () => {
    writeDateFile('2026-03-12', 'brief.md', BRIEF)
    const record = buildRecord('2026-03-12', { archiveDir })
    expect(JSON.stringify(record)).not.toContain('__anomalies')
  })

  it('returns null for a date with no archive directory', () => {
    expect(buildRecord('2026-01-01', { archiveDir })).toBeNull()
  })
})
