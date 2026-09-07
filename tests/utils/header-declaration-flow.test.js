import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { parseDelimiterResponse } from '../../scripts/utils/delimiter-parser.js'
import {
  parseCompositionBlock,
  parseHeaderBlock,
  parseMobileBlock,
  parseShellBlock,
} from '../../scripts/utils/spec-blocks.js'
import { validateArtDirectorResult } from '../../scripts/agents/art-director.js'
import { computeShellMandate } from '../../scripts/utils/shell-mandate.js'
import { computeUniqueness } from '../../scripts/utils/uniqueness-index.js'

/**
 * There is no dry-run mode that exercises parsing without model calls —
 * `DRY_RUN=true` in scripts/daily-redesign.js still runs the agents. So this
 * drives a whole Art Director response through the same path the orchestrator
 * does: parse the delimiter blocks, validate the result, parse SHELL and
 * HEADER, write header.json beside shell.json, and read both back through the
 * mandate and the uniqueness index.
 */
const RESPONSE = `===HERO_COPY===
FOURTEEN HOURS OF LIGHT

===HERO_SOURCE===
composed

===CHASSIS_ID===
anton-inter-tight

===VISUAL_SPEC===
## Color
- 18 degrees, drenched

===SELF_CHECK===
1. Yes 2. Yes 3. Yes 4. Yes

===MEASURABLES===
canvas_utilization_min: 78
hero_scale: clamp(96px, 13vw, 200px)
color_coverage_min: 60

===SHELL===
footer: data strip
brand_lockup: stacked-md
brand_color_mode: original
ground_strategy: light-ground

===HEADER===
placement: left-rail
height_px: 240
mark_px: 48
wordmark_step: lg
wordmark_weight: 500
role_line: absent
nav_step: sm
nav_case: small-caps
nav: a vertical spine of rotated labels

===MOBILE===
carrier: The drenched field with FOURTEEN HOURS OF LIGHT carries the page; the spine becomes a band above it.
first_fold: The nav band, then FOURTEEN HOURS OF LIGHT at hero step filling the field.
order: nav band, hero field, colophon
hero_step_360: hero
nav_360: the rotated spine becomes one horizontal band of small-caps links at the top

===COMPOSITION===
columns: two-asymmetric
axis: vertical
symmetry: left-weighted
hero_zone: full-bleed
density: sparse
rhythm: interrupted
shell_posture: marginal
field_ratio: drenched
collapse: rail-to-band

===COMPOSITION_RATIONALE===
A left-weighted asymmetric split gives the spine somewhere to live without a top bar.

===FILE:elements/preset.ts===
export const elementsPreset = definePreset({ name: 'elements' })

===RATIONALE===
Because the light lasts fourteen hours today.
`

describe('an Art Director response with ===HEADER===, end to end', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'header-flow-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('parses, validates, and persists header.json beside shell.json', () => {
    const parsed = parseDelimiterResponse(RESPONSE)
    expect(() => validateArtDirectorResult(parsed)).not.toThrow()

    const shell = parseShellBlock(parsed.shell)
    const header = parseHeaderBlock(parsed.header)
    expect(shell.brand_lockup).toBe('stacked-md')
    expect(shell.nav).toBeNull() // nav moved to HEADER
    expect(header.placement).toBe('left-rail')
    expect(header.mark_px).toBe(48)
    expect(header.nav).toBe('a vertical spine of rotated labels')

    const buildDir = path.join(archiveDir, '2026-08-30', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(path.join(buildDir, 'shell.json'), JSON.stringify(shell, null, 2))
    writeFileSync(path.join(buildDir, 'header.json'), JSON.stringify(header, null, 2))

    expect(JSON.parse(readFileSync(path.join(buildDir, 'header.json'), 'utf8'))).toEqual(header)
  })

  it('rejects the same response with the HEADER block removed', () => {
    const parsed = parseDelimiterResponse(
      RESPONSE.replace(/===HEADER===[\s\S]*?(?====MOBILE===)/, '')
    )
    expect(() => validateArtDirectorResult(parsed)).toThrow(/===HEADER===/)
  })

  it('parses and persists mobile.json beside composition.json, nine keys deep', () => {
    const parsed = parseDelimiterResponse(RESPONSE)
    expect(() => validateArtDirectorResult(parsed)).not.toThrow()
    const composition = parseCompositionBlock(parsed.composition)
    const mobile = parseMobileBlock(parsed.mobile)
    expect(Object.keys(composition)).toHaveLength(9)
    expect(composition.collapse).toBe('rail-to-band')
    expect(mobile.hero_step_360).toBe('hero')
    expect(mobile.order).toBe('nav band, hero field, colophon')

    const buildDir = path.join(archiveDir, '2026-09-06', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(path.join(buildDir, 'composition.json'), JSON.stringify(composition, null, 2))
    writeFileSync(path.join(buildDir, 'mobile.json'), JSON.stringify(mobile, null, 2))
    expect(JSON.parse(readFileSync(path.join(buildDir, 'mobile.json'), 'utf8'))).toEqual(mobile)
  })

  it('rejects the same response with the MOBILE block removed', () => {
    const parsed = parseDelimiterResponse(
      RESPONSE.replace(/===MOBILE===[\s\S]*?(?====COMPOSITION===)/, '')
    )
    expect(() => validateArtDirectorResult(parsed)).toThrow(/===MOBILE===/)
  })

  it('rejects a collapse that contradicts the mobile block the way a placement contradicts the posture', () => {
    // rail-to-band with nothing that was a rail: posture standard, columns single, top-bar header.
    const parsed = parseDelimiterResponse(
      RESPONSE.replace('shell_posture: marginal', 'shell_posture: standard')
        .replace('columns: two-asymmetric', 'columns: single')
        .replace('placement: left-rail', 'placement: top-bar')
    )
    expect(() => validateArtDirectorResult(parsed)).toThrow(/rail-to-band/)
  })

  it('rejects a placement that contradicts the declared shell posture', () => {
    const parsed = parseDelimiterResponse(
      RESPONSE.replace('placement: left-rail', 'placement: top-bar')
    )
    expect(() => validateArtDirectorResult(parsed)).toThrow(/contradicts shell_posture "marginal"/)
  })

  it('rejects a mark_px outside the declared lockup band', () => {
    const parsed = parseDelimiterResponse(RESPONSE.replace('mark_px: 48', 'mark_px: 11'))
    expect(() => validateArtDirectorResult(parsed)).toThrow(/stacked-md band/)
  })

  it('rejects a HEADER with no nav prose', () => {
    const parsed = parseDelimiterResponse(
      RESPONSE.replace('nav: a vertical spine of rotated labels', '')
    )
    expect(() => validateArtDirectorResult(parsed)).toThrow(/HEADER block missing nav/)
  })

  it('feeds the persisted header back into the shell mandate', () => {
    const parsed = parseDelimiterResponse(RESPONSE)
    const buildDir = path.join(archiveDir, '2026-08-29', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(path.join(buildDir, 'shell.json'), JSON.stringify(parseShellBlock(parsed.shell)))
    writeFileSync(
      path.join(buildDir, 'header.json'),
      JSON.stringify(parseHeaderBlock(parsed.header))
    )

    const mandate = computeShellMandate({ archiveDir, lookbackDays: 30 })
    expect(mandate.softForbidden.placement).toEqual(['left-rail'])
    expect(mandate.softForbidden.nav).toEqual(['a vertical spine of rotated labels'])
    expect(mandate.softForbidden.mark_band).toEqual(['44-64'])
    // original WAS used, so no nudge fires.
    expect(mandate.colorModeNudge).toBeNull()
  })

  it('feeds the persisted header into the uniqueness index', () => {
    const parsed = parseDelimiterResponse(RESPONSE)
    const shell = parseShellBlock(parsed.shell)
    const header = parseHeaderBlock(parsed.header)
    const today = { date: '2026-08-30', composition: { shell_posture: 'marginal' }, shell, header }
    const yesterday = {
      date: '2026-08-29',
      composition: { shell_posture: 'marginal' },
      shell,
      header: { ...header, placement: 'right-margin' },
    }

    const identical = computeUniqueness(today, [today])
    const moved = computeUniqueness(today, [yesterday])
    // A build that only moved the header placement is more novel than a clone.
    expect(moved.metrics.shell.score).toBeGreaterThan(identical.metrics.shell.score)
  })
})
