import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { parseDelimiterResponse } from '../../scripts/utils/delimiter-parser.js'
import { parseShellBlock } from '../../scripts/utils/spec-blocks.js'
import { validateArtDirectorResult } from '../../scripts/agents/art-director.js'
import { archiveArtifacts } from '../../scripts/design-agents.js'
import { computeShellMandate } from '../../scripts/utils/shell-mandate.js'
import { computeUniqueness } from '../../scripts/utils/uniqueness-index.js'
import { formatMaterialContractBlock, materialSeed } from '../../scripts/utils/material.js'

/**
 * A whole Art Director response with `ground_material` driven through the
 * path the orchestrator takes (#505): parse, validate against the material
 * library, persist shell.json through archiveArtifacts, and read it back
 * through the shell mandate and the uniqueness index. Modelled on
 * type-treatment-flow.test.js.
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
hero_scale: clamp(64px, 8vw, 112px)
color_coverage_min: 60

===SHELL===
footer: data strip
brand_lockup: stacked-md
brand_color_mode: original
ground_strategy: drench
ground_material: Grain

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
case: caps
lead: roman
weight: heavy
alignment: left
texture: none

===MOBILE===
carrier: The drenched field with FOURTEEN HOURS OF LIGHT carries the page; the spine becomes a band above it.
first_fold: The nav band, then FOURTEEN HOURS OF LIGHT at hero step filling the field.
order: nav band, hero field, colophon
hero_step_360: hero
nav_360: the rotated spine becomes one horizontal band of small-caps links at the top

===MOTION===

entrance: none

ground: static

reveal: none

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

const RUN_BASE = {
  finalScreenshot: null,
  mockup: null,
  mockupScreenshot: null,
  verdicts: [],
  headerDecl: {},
  typeDecl: {},
  mobileDecl: {},
  heroSource: 'composed',
  chosenComposition: {},
  chosenLane: { id: 'lane', register: 'brand' },
  measurablesDecl: null,
}

describe('an Art Director response with ground_material, end to end', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'material-flow-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('parses, validates, and persists ground_material in shell.json', () => {
    const parsed = parseDelimiterResponse(RESPONSE)
    expect(() => validateArtDirectorResult(parsed)).not.toThrow()

    const shellDecl = parseShellBlock(parsed.shell)
    expect(shellDecl.ground_material).toBe('grain')

    const artifacts = archiveArtifacts({ ...RUN_BASE, shellDecl })
    const buildDir = path.join(archiveDir, '2026-09-13', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(path.join(buildDir, 'shell.json'), artifacts['shell.json'])
    expect(JSON.parse(readFileSync(path.join(buildDir, 'shell.json'), 'utf8'))).toMatchObject({
      brand_lockup: 'stacked-md',
      ground_strategy: 'drench',
      ground_material: 'grain',
    })
  })

  it('rejects the same response with ground_material removed or invented', () => {
    expect(() =>
      validateArtDirectorResult(
        parseDelimiterResponse(RESPONSE.replace('ground_material: Grain\n', ''))
      )
    ).toThrow(/SHELL block missing ground_material/)
    expect(() =>
      validateArtDirectorResult(
        parseDelimiterResponse(
          RESPONSE.replace('ground_material: Grain', 'ground_material: velvet')
        )
      )
    ).toThrow(/got "velvet"/)
  })

  it('hands the engineer the declared material as the exact JSX line, seeded from the date', () => {
    const shellDecl = parseShellBlock(parseDelimiterResponse(RESPONSE).shell)
    const seed = materialSeed('2026-09-13')
    const block = formatMaterialContractBlock(shellDecl.ground_material, seed)
    expect(block).toContain(`<Ground material="grain" seed={${seed}} />`)
    expect(formatMaterialContractBlock(shellDecl.ground_material, materialSeed('2026-09-13'))).toBe(
      block
    )
  })

  it('feeds the persisted material back into the shell mandate and the uniqueness index', () => {
    const shellDecl = parseShellBlock(parseDelimiterResponse(RESPONSE).shell)
    const buildDir = path.join(archiveDir, '2026-09-12', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(path.join(buildDir, 'shell.json'), JSON.stringify(shellDecl))

    const mandate = computeShellMandate({ archiveDir, lookbackDays: 30 })
    expect(mandate.softForbidden.ground_material).toEqual(['grain'])

    const history = [
      { date: '2026-09-12', shell: shellDecl, composition: { shell_posture: 'marginal' } },
    ]
    const same = computeUniqueness(
      { date: '2026-09-13', shell: shellDecl, composition: { shell_posture: 'marginal' } },
      history
    )
    const moved = computeUniqueness(
      {
        date: '2026-09-13',
        shell: { ...shellDecl, ground_material: 'none' },
        composition: { shell_posture: 'marginal' },
      },
      history
    )
    expect(same.metrics.shell.raw).toBe(0)
    expect(moved.metrics.shell.raw).toBe(1)
  })
})
