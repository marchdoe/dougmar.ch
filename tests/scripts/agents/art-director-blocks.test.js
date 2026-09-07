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
    'canvas_utilization_min: 70\nhero_scale: clamp(96px, 13vw, 200px)\ncolor_coverage_min: 60',
  shell: 'footer: data strip\nbrand_lockup: horizontal-md\nbrand_color_mode: original',
  header: validHeader,
  mobile: validMobile,
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
      'canvas_utilization_min: >=70\nhero_scale: clamp(96px, 13vw, 200px)\ncolor_coverage_min: 60'
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
