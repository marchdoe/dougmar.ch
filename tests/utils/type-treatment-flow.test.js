import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { parseDelimiterResponse } from '../../scripts/utils/delimiter-parser.js'
import { parseTypeTreatmentBlock } from '../../scripts/utils/spec-blocks.js'
import { validateArtDirectorResult } from '../../scripts/agents/art-director.js'
import { archiveArtifacts } from '../../scripts/design-agents.js'
import { computeTypeTreatmentMandate } from '../../scripts/utils/type-treatment-mandate.js'

/**
 * A whole Art Director response driven through the path the orchestrator
 * takes (#502): parse the delimiter blocks, validate against the chosen
 * chassis, parse TYPE_TREATMENT, write type-treatment.json beside header.json,
 * and read it back through the mandate. Modelled on
 * header-declaration-flow.test.js.
 */
const RESPONSE = `===HERO_COPY===
FOURTEEN HOURS OF LIGHT

===HERO_SOURCE===
composed

===CHASSIS_ID===
spectral-albert

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
ground_material: none

===HEADER===
placement: left-rail
height_px: 240
mark_px: 48
wordmark_step: lg
wordmark_weight: 500
role_line: absent
nav_step: sm
nav_case: small-caps
nav_form: labels
nav: a vertical spine of rotated labels

===TYPE_TREATMENT===
case: lower
lead: italic
weight: light
alignment: right
texture: vertical

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
hero_object: statement

===COMPOSITION_RATIONALE===
A left-weighted asymmetric split gives the spine somewhere to live without a top bar.

===FILE:elements/preset.ts===
export const elementsPreset = definePreset({ name: 'elements' })

===RATIONALE===
Because the light lasts fourteen hours today.
`

describe('an Art Director response with ===TYPE_TREATMENT===, end to end', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'type-flow-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('parses, validates against the chassis, and persists type-treatment.json', () => {
    const parsed = parseDelimiterResponse(RESPONSE)
    expect(() => validateArtDirectorResult(parsed)).not.toThrow()

    const typeDecl = parseTypeTreatmentBlock(parsed.type_treatment)
    expect(typeDecl).toEqual({
      case: 'lower',
      lead: 'italic',
      weight: 'light',
      alignment: 'right',
      texture: 'vertical',
    })

    const artifacts = archiveArtifacts({
      finalScreenshot: null,
      mockup: null,
      mockupScreenshot: null,
      verdicts: [],
      shellDecl: {},
      headerDecl: {},
      typeDecl,
      mobileDecl: {},
      heroSource: 'composed',
      chosenComposition: {},
      chosenLane: { id: 'x', register: 'y' },
    })
    expect(JSON.parse(artifacts['type-treatment.json'])).toEqual(typeDecl)

    const buildDir = path.join(archiveDir, '2026-09-12', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(path.join(buildDir, 'type-treatment.json'), artifacts['type-treatment.json'])
    expect(JSON.parse(readFileSync(path.join(buildDir, 'type-treatment.json'), 'utf8'))).toEqual(
      typeDecl
    )
  })

  it('rejects the same response with the TYPE_TREATMENT block removed', () => {
    const parsed = parseDelimiterResponse(
      RESPONSE.replace(/===TYPE_TREATMENT===[\s\S]*?(?====MOBILE===)/, '')
    )
    expect(() => validateArtDirectorResult(parsed)).toThrow(/===TYPE_TREATMENT===/)
  })

  it('rejects an italic lead once the chassis moves to one with no display italic', () => {
    const parsed = parseDelimiterResponse(
      RESPONSE.replace('spectral-albert', 'big-shoulders-atkinson')
    )
    expect(() => validateArtDirectorResult(parsed)).toThrow(
      /TYPE_TREATMENT block is invalid: lead: italic needs a display italic and big-shoulders-atkinson loads none/
    )
  })

  it('rejects a weight extreme once the chassis moves to a single-weight display face', () => {
    const parsed = parseDelimiterResponse(RESPONSE.replace('spectral-albert', 'dm-serif-public'))
    expect(() => validateArtDirectorResult(parsed)).toThrow(/loads a single weight \(400\)/)
  })

  it('rejects a value outside the vocabulary', () => {
    const parsed = parseDelimiterResponse(RESPONSE.replace('texture: vertical', 'texture: neon'))
    expect(() => validateArtDirectorResult(parsed)).toThrow(/invalid texture: "neon"/)
  })

  it('feeds the persisted treatment back into the mandate, per field', () => {
    const parsed = parseDelimiterResponse(RESPONSE)
    const buildDir = path.join(archiveDir, '2026-09-11', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(
      path.join(buildDir, 'type-treatment.json'),
      JSON.stringify(parseTypeTreatmentBlock(parsed.type_treatment))
    )

    const mandate = computeTypeTreatmentMandate({ archiveDir, lookbackDays: 30 })
    expect(mandate.softForbidden).toEqual({
      case: ['lower'],
      lead: ['italic'],
      weight: ['light'],
      alignment: ['right'],
      texture: ['vertical'],
    })
  })
})
