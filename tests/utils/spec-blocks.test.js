import { describe, it, expect } from 'vitest'
import {
  parseMeasurablesBlock,
  parseShellBlock,
  parseCompositionBlock,
  parseMobileBlock,
} from '../../scripts/utils/spec-blocks.js'

describe('parseMeasurablesBlock', () => {
  it('parses the three measurable fields', () => {
    const m = parseMeasurablesBlock(
      [
        'canvas_utilization_min: 70',
        'hero_scale: clamp(96px, 13vw, 200px)',
        'color_coverage_min: 60',
      ].join('\n')
    )
    expect(m.canvas_utilization_min).toBe(70)
    expect(m.hero_scale).toBe('clamp(96px, 13vw, 200px)')
    expect(m.color_coverage_min).toBe(60)
  })

  it('tolerates comments and missing fields', () => {
    const m = parseMeasurablesBlock('canvas_utilization_min: 80   # Broadsheet floor')
    expect(m.canvas_utilization_min).toBe(80)
    expect(m.hero_scale).toBeNull()
    expect(m.color_coverage_min).toBeNull()
  })

  it('keeps a # that is part of the value, and still strips a trailing comment', () => {
    // The old parser split on the first '#' anywhere, so any hex colour or a
    // role line like "Designer #1" was cut off mid-value.
    const m = parseMeasurablesBlock('hero_scale: clamp(96px,13vw,200px)#nospace   # real comment')
    expect(m.hero_scale).toBe('clamp(96px,13vw,200px)#nospace')
  })

  it('returns all-null for garbage input', () => {
    const m = parseMeasurablesBlock('not even close')
    expect(m.canvas_utilization_min).toBeNull()
  })

  it('parses canvas_utilization_min from >=70 (lenient integer parsing)', () => {
    const m = parseMeasurablesBlock('canvas_utilization_min: >=70')
    expect(m.canvas_utilization_min).toBe(70)
  })
})

describe('parseShellBlock', () => {
  it('parses the four shell fields', () => {
    const s = parseShellBlock(
      [
        'nav: bottom rail',
        'footer: data strip',
        'brand_lockup: horizontal-md',
        'brand_color_mode: single-color',
      ].join('\n')
    )
    expect(s.nav).toBe('bottom rail')
    expect(s.footer).toBe('data strip')
    expect(s.brand_lockup).toBe('horizontal-md')
    expect(s.brand_color_mode).toBe('single-color')
  })

  it('returns nulls for missing fields', () => {
    const s = parseShellBlock('nav: left spine')
    expect(s.nav).toBe('left spine')
    expect(s.footer).toBeNull()
  })

  it('normalizes brand_color_mode to lowercase (Single-Color → single-color)', () => {
    const s = parseShellBlock('brand_color_mode: Single-Color')
    expect(s.brand_color_mode).toBe('single-color')
  })

  it('parses ground_strategy and normalizes to lowercase', () => {
    const s = parseShellBlock('ground_strategy: Dark-Void')
    expect(s.ground_strategy).toBe('dark-void')
  })

  it('returns null ground_strategy for old-shaped SHELL blocks missing the field', () => {
    const s = parseShellBlock(
      ['nav: bottom rail', 'footer: data strip', 'brand_lockup: horizontal-md'].join('\n')
    )
    expect(s.ground_strategy).toBeNull()
  })
})

describe('parseCompositionBlock', () => {
  it('parses all nine composition-axis fields', () => {
    const s = parseCompositionBlock(
      [
        'columns: two-equal',
        'axis: vertical',
        'symmetry: broken',
        'hero_zone: center',
        'density: measured',
        'rhythm: even',
        'shell_posture: standard',
        'field_ratio: balanced',
        'collapse: stack',
      ].join('\n')
    )
    expect(s).toEqual({
      columns: 'two-equal',
      axis: 'vertical',
      symmetry: 'broken',
      hero_zone: 'center',
      density: 'measured',
      rhythm: 'even',
      shell_posture: 'standard',
      field_ratio: 'balanced',
      collapse: 'stack',
    })
  })

  it('returns nulls for missing fields, including all four legacy-shape fields', () => {
    const s = parseCompositionBlock('columns: single')
    expect(s.columns).toBe('single')
    expect(s.axis).toBeNull()
    expect(s.density).toBeNull()
    expect(s.rhythm).toBeNull()
    expect(s.shell_posture).toBeNull()
    expect(s.field_ratio).toBeNull()
    // Every composition.json written before #452 has no collapse axis.
    expect(s.collapse).toBeNull()
  })

  it('normalizes values to lowercase and trims whitespace', () => {
    const s = parseCompositionBlock('symmetry:   Broken  \nfield_ratio: Type-Dominant')
    expect(s.symmetry).toBe('broken')
    expect(s.field_ratio).toBe('type-dominant')
  })

  it("does not validate values against the axis vocabulary — that is the caller's job", () => {
    const s = parseCompositionBlock('columns: seventeen')
    expect(s.columns).toBe('seventeen')
  })
})

describe('parseMobileBlock', () => {
  it('reads every field, normalizing only the enumerated step', () => {
    const m = parseMobileBlock(
      [
        'carrier: The gold field carries the page.',
        'first_fold: The mark, then "Select a busy man." at hero step.',
        'order: gold field, ledger, work, footer',
        'hero_step_360:  Hero ',
        'nav_360: One lowercase row under the mark.',
      ].join('\n')
    )
    expect(m).toEqual({
      carrier: 'The gold field carries the page.',
      first_fold: 'The mark, then "Select a busy man." at hero step.',
      order: 'gold field, ledger, work, footer',
      hero_step_360: 'hero',
      nav_360: 'One lowercase row under the mark.',
    })
  })

  it('returns nulls for missing fields and tolerates comments', () => {
    const m = parseMobileBlock('hero_step_360: 4xl   # compressed step')
    expect(m.hero_step_360).toBe('4xl')
    expect(m.carrier).toBeNull()
    expect(m.first_fold).toBeNull()
    expect(m.order).toBeNull()
    expect(m.nav_360).toBeNull()
  })

  it('returns all-null for garbage or empty input', () => {
    expect(Object.values(parseMobileBlock('nothing here')).every((v) => v === null)).toBe(true)
    expect(Object.values(parseMobileBlock(undefined)).every((v) => v === null)).toBe(true)
  })
})
