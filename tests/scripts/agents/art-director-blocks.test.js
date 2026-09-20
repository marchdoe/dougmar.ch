import { describe, it, expect } from 'vitest'
import { validateArtDirectorResult } from '../../../scripts/agents/art-director.js'

const validComposition = [
  'columns: three',
  'axis: vertical',
  'symmetry: symmetric',
  'hero_zone: full-bleed',
  'density: dense',
  'rhythm: even',
  'shell_posture: standard',
  'field_ratio: balanced',
  'collapse: stack',
  'hero_object: statement',
].join('\n')

const validHeader = [
  'placement: top-bar',
  'height_px: 96',
  'mark_px: 40',
  'wordmark_step: lg',
  'wordmark_weight: 600',
  'role_line: present',
  'nav_step: sm',
  'nav_case: upper',
  'nav_form: labels',
  'nav: bottom rail',
].join('\n')

const validMobile = [
  'carrier: The hero phrase carries the page at 360, stacked above the stat columns.',
  'first_fold: The hero phrase "FOURTEEN HOURS OF LIGHT" at hero step, then the nav.',
  'order: hero, nav, columns, footer',
  'hero_step_360: hero',
  'nav_360: one row under the mark',
].join('\n')

const valid = () => ({
  hero_copy: 'FOURTEEN HOURS OF LIGHT',
  archetype: 'Stack',
  composition: validComposition,
  composition_rationale: 'Full-bleed dense columns carry the stat-heavy phrase at full confidence.',
  chassis_id: 'big-shoulders-atkinson',
  visual_spec: 'spec',
  self_check: 'yes',
  measurables:
    'canvas_utilization_min: 70\nhero_scale: clamp(64px, 8vw, 112px)\ncolor_coverage_min: 60',
  shell:
    'footer: data strip\nbrand_lockup: horizontal-md\nbrand_color_mode: original\nground_material: none',
  header: validHeader,
  type_treatment: 'case: mixed\nlead: roman\nweight: regular\nalignment: left\ntexture: none',
  mobile: validMobile,
  motion: 'entrance: none\nground: static\nreveal: none',
  files: [{ path: 'elements/preset.ts', content: 'export const elementsPreset = {}' }],
})

describe('validateArtDirectorResult — MEASURABLES + SHELL', () => {
  it('accepts a complete response', () => {
    expect(() => validateArtDirectorResult(valid())).not.toThrow()
  })
  it('rejects a missing MEASURABLES block', () => {
    const r = valid()
    delete r.measurables
    expect(() => validateArtDirectorResult(r)).toThrow(/MEASURABLES/)
  })
  it('rejects MEASURABLES without a numeric canvas floor', () => {
    const r = valid()
    r.measurables = 'hero_scale: 96px'
    expect(() => validateArtDirectorResult(r)).toThrow(/canvas_utilization_min/)
  })
  it('rejects a missing SHELL block', () => {
    const r = valid()
    delete r.shell
    expect(() => validateArtDirectorResult(r)).toThrow(/SHELL/)
  })
  it('rejects an unknown brand_color_mode', () => {
    const r = valid()
    r.shell = r.shell.replace('original', 'rainbow')
    expect(() => validateArtDirectorResult(r)).toThrow(/brand_color_mode/)
  })

  it('does NOT throw for an off-contract brand_lockup (warn-only)', () => {
    const r = valid()
    r.shell = r.shell.replace('horizontal-md', 'diagonal-xl')
    expect(() => validateArtDirectorResult(r)).not.toThrow()
  })

  it('accepts canvas_utilization_min: >=70 in MEASURABLES (passes validation)', () => {
    const r = valid()
    r.measurables =
      'canvas_utilization_min: >=70\nhero_scale: clamp(64px, 8vw, 112px)\ncolor_coverage_min: 60'
    expect(() => validateArtDirectorResult(r)).not.toThrow()
  })

  it('does NOT throw when hero_source is absent (optional variance field)', () => {
    const r = valid()
    expect(r.hero_source).toBeUndefined()
    expect(() => validateArtDirectorResult(r)).not.toThrow()
  })

  it('does NOT throw when SHELL is missing ground_strategy (optional field, old-shaped SHELL)', () => {
    const r = valid()
    // shell already has no ground_strategy line — confirms it's not required
    expect(r.shell).not.toContain('ground_strategy')
    expect(() => validateArtDirectorResult(r)).not.toThrow()
  })
})

describe('validateArtDirectorResult, the reply checked against itself (#576)', () => {
  const PRESET = "theme: { tokens: { colors: { pine: { 600: { value: '#0a7d54' } } } } }"
  const HUGE_HERO =
    'canvas_utilization_min: 70\nhero_scale: clamp(140px, 27vw, 400px)\ncolor_coverage_min: 60'
  const withSpec = (overrides = {}) => ({
    ...valid(),
    visual_spec: '### 1. Color Specification\n- accent `#0a7d54`',
    files: [{ path: 'elements/preset.ts', content: PRESET }],
    ...overrides,
  })

  it('accepts a spec whose colours the preset defines', () => {
    expect(() => validateArtDirectorResult(withSpec())).not.toThrow()
    expect(validateArtDirectorResult(withSpec())).toEqual([])
  })

  it('throws on a spec hex the preset lacks, naming it', () => {
    const r = withSpec({ visual_spec: '### 1. Color Specification\n- accent `#e86f1e`' })
    expect(() => validateArtDirectorResult(r)).toThrow(
      /Art Director reply disagrees with its own chassis or preset:\n- the Color Specification .* names #e86f1e/
    )
  })

  it('throws on a hero_scale above the chassis ramp, naming field, value and ceiling', () => {
    const r = withSpec({ measurables: HUGE_HERO })
    expect(() => validateArtDirectorResult(r)).toThrow(
      /MEASURABLES hero_scale "clamp\(140px, 27vw, 400px\)" resolves to 389px at 1440px, and chassis big-shoulders-atkinson tops out at 160px/
    )
  })

  it('reports every failed check in one message, so one retry can fix them all', () => {
    const r = withSpec({
      visual_spec: '### 1. Color Specification\n- accent `#e86f1e`',
      measurables: HUGE_HERO,
    })
    expect(() => validateArtDirectorResult(r)).toThrow(/#e86f1e[\s\S]*hero_scale/)
  })

  it('returns the findings instead of throwing when enforceSpec is off (the retry)', () => {
    const r = withSpec({ visual_spec: '### 1. Color Specification\n- accent `#e86f1e`' })
    const findings = validateArtDirectorResult(r, { enforceSpec: false })
    expect(findings).toHaveLength(1)
    expect(findings[0]).toContain('#e86f1e')
  })

  it('still throws for a missing block when enforceSpec is off', () => {
    const r = withSpec()
    delete r.mobile
    expect(() => validateArtDirectorResult(r, { enforceSpec: false })).toThrow(/MOBILE/)
  })

  it('leaves an unknown chassis to the orchestrator, which falls back', () => {
    const r = withSpec({ chassis_id: 'no-such-chassis', measurables: HUGE_HERO })
    expect(() => validateArtDirectorResult(r)).not.toThrow()
  })
})
