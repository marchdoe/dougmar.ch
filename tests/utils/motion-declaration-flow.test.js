import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { parseDelimiterResponse } from '../../scripts/utils/delimiter-parser.js'
import { parseMotionBlock } from '../../scripts/utils/spec-blocks.js'
import { validateArtDirectorResult } from '../../scripts/agents/art-director.js'
import { archiveArtifacts } from '../../scripts/design-agents.js'
import { computeMotionMandate } from '../../scripts/utils/motion-mandate.js'
import { buildScreenshotCriticBlocks } from '../../scripts/agents/screenshot-critic.js'
import { buildMockupDesignerUserPrompt } from '../../scripts/agents/mockup-designer.js'
import { formatMotion } from '../../scripts/utils/motion-grammar.js'

/**
 * A whole Art Director response driven through the path the orchestrator
 * takes (#506): parse the delimiter blocks, validate, parse MOTION, write
 * motion.json beside mobile.json, read it back through the mandate, and
 * hand the declaration to the designer and the critic. Modelled on
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
hero_scale: clamp(64px, 8vw, 112px)
color_coverage_min: 60

===SHELL===
footer: data strip
brand_lockup: stacked-md
brand_color_mode: original
ground_material: none
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

===MOTION===
entrance: rise
ground: drift
reveal: on-scroll

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

describe('an Art Director response with ===MOTION===, end to end', () => {
  let archiveDir
  beforeEach(() => {
    archiveDir = mkdtempSync(path.join(tmpdir(), 'motion-flow-'))
  })
  afterEach(() => {
    rmSync(archiveDir, { recursive: true, force: true })
  })

  it('parses, validates, and persists motion.json beside mobile.json', () => {
    const parsed = parseDelimiterResponse(RESPONSE)
    expect(() => validateArtDirectorResult(parsed)).not.toThrow()

    const motionDecl = parseMotionBlock(parsed.motion)
    expect(motionDecl).toEqual({ entrance: 'rise', ground: 'drift', reveal: 'on-scroll' })

    const strip = Buffer.from('strip')
    const artifacts = archiveArtifacts({
      finalScreenshot: { motionStripJpeg: strip },
      mockup: null,
      mockupScreenshot: null,
      verdicts: [],
      shellDecl: {},
      headerDecl: {},
      typeDecl: {},
      mobileDecl: {},
      motionDecl,
      heroSource: 'composed',
      chosenComposition: {},
      chosenLane: { id: 'x', register: 'y' },
    })
    expect(JSON.parse(artifacts['motion.json'])).toEqual(motionDecl)
    expect(artifacts['motion-strip.jpg']).toBe(strip)

    const buildDir = path.join(archiveDir, '2026-09-13', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(path.join(buildDir, 'motion.json'), artifacts['motion.json'])
    expect(JSON.parse(readFileSync(path.join(buildDir, 'motion.json'), 'utf8'))).toEqual(motionDecl)
  })

  it('writes no strip on a still night', () => {
    const artifacts = archiveArtifacts({
      finalScreenshot: { png: Buffer.from('x') },
      mockup: null,
      mockupScreenshot: null,
      verdicts: [],
      shellDecl: {},
      headerDecl: {},
      typeDecl: {},
      mobileDecl: {},
      motionDecl: { entrance: 'none', ground: 'static', reveal: 'none' },
      heroSource: null,
      chosenComposition: {},
      chosenLane: { id: 'x', register: 'y' },
    })
    expect(artifacts['motion-strip.jpg']).toBeNull()
  })

  it('rejects the same response with the MOTION block removed', () => {
    const parsed = parseDelimiterResponse(
      RESPONSE.replace(/===MOTION===[\s\S]*?(?====COMPOSITION===)/, '')
    )
    expect(() => validateArtDirectorResult(parsed)).toThrow(/===MOTION===/)
  })

  it('rejects a value outside the vocabulary', () => {
    const parsed = parseDelimiterResponse(RESPONSE.replace('entrance: rise', 'entrance: bounce'))
    expect(() => validateArtDirectorResult(parsed)).toThrow(
      /MOTION block is invalid: invalid entrance: "bounce"/
    )
  })

  it('rejects a block missing a field', () => {
    const parsed = parseDelimiterResponse(RESPONSE.replace('reveal: on-scroll\n', ''))
    expect(() => validateArtDirectorResult(parsed)).toThrow(/missing field: reveal/)
  })

  it('feeds the persisted entrance back into the mandate', () => {
    const parsed = parseDelimiterResponse(RESPONSE)
    const buildDir = path.join(archiveDir, '2026-09-12', 'build-1')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(
      path.join(buildDir, 'motion.json'),
      JSON.stringify(parseMotionBlock(parsed.motion))
    )
    const mandate = computeMotionMandate({ archiveDir, lookbackDays: 30 })
    expect(mandate.softForbidden).toEqual(['rise'])
  })

  it('reaches the mockup designer as an informational section', () => {
    const motion = formatMotion(parseMotionBlock(parseDelimiterResponse(RESPONSE).motion))
    const prompt = buildMockupDesignerUserPrompt({
      enrichedBrief: 'brief',
      tokenContext: '',
      contentSummary: '',
      measurables: 'canvas_utilization_min: 78',
      shell: 'footer: data strip',
      motion,
      brandSvg: '',
      brandMonoSvg: '',
      googleFontsUrl: '',
    })
    expect(prompt).toContain('## Motion Declaration (informational; the mockup is static')
    expect(prompt).toContain('entrance: rise')
  })

  it('reaches the screenshot critic as text, with the strip after the render crop', () => {
    const buf = (n) => Buffer.from(n)
    const motion = formatMotion(parseMotionBlock(parseDelimiterResponse(RESPONSE).motion))
    const blocks = buildScreenshotCriticBlocks({
      enrichedBrief: 'brief',
      motion,
      screenshotBuffer: {
        jpeg: buf('light'),
        darkJpeg: buf('dark'),
        headerJpeg: buf('render-crop'),
        motionStripJpeg: buf('strip'),
      },
      mockupScreenshot: { jpeg: buf('mockup'), headerJpeg: buf('mockup-crop') },
      bestReference: { buffer: buf('reference'), description: 'grade A' },
    })
    const text = blocks
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(text).toContain('## Motion Declaration (section 12 is judged against this)')
    expect(text).toContain('ground: drift')
    const images = blocks
      .filter((b) => b.type === 'image')
      .map((b) => Buffer.from(b.source.data, 'base64').toString())
    expect(images).toEqual([
      'mockup',
      'light',
      'dark',
      'mockup-crop',
      'render-crop',
      'strip',
      'reference',
    ])
  })

  it('sends no strip image and no motion label when the capture did not happen', () => {
    const buf = (n) => Buffer.from(n)
    const blocks = buildScreenshotCriticBlocks({
      enrichedBrief: 'brief',
      motion: 'entrance: none\nground: static\nreveal: none',
      screenshotBuffer: { jpeg: buf('light'), darkJpeg: buf('dark'), motionStripJpeg: null },
      mockupScreenshot: { jpeg: buf('mockup') },
    })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(3)
    expect(blocks.some((b) => b.type === 'text' && /MOTION STRIP/.test(b.text))).toBe(false)
  })
})
