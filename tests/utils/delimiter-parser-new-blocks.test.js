import { describe, it, expect } from 'vitest'
import { parseDelimiterResponse } from '../../scripts/utils/delimiter-parser.js'

describe('parseDelimiterResponse — new blocks', () => {
  it('captures MEASURABLES, SHELL, and INTERIOR_NOTES', () => {
    const raw = [
      '===HERO_COPY===',
      'FOURTEEN HOURS OF LIGHT',
      '===MEASURABLES===',
      'canvas_utilization_min: 70',
      'color_coverage_min: 60',
      '===SHELL===',
      'nav: bottom rail',
      'brand_lockup: mark-only-sm',
      '===INTERIOR_NOTES===',
      'About page carries the same rail.',
      '===RATIONALE===',
      'because',
    ].join('\n')
    const p = parseDelimiterResponse(raw)
    expect(p.hero_copy).toBe('FOURTEEN HOURS OF LIGHT')
    expect(p.measurables).toContain('canvas_utilization_min: 70')
    expect(p.shell).toContain('nav: bottom rail')
    expect(p.interior_notes).toBe('About page carries the same rail.')
    expect(p.rationale).toBe('because')
  })

  it('still terminates a FILE block at the new delimiters', () => {
    const raw = ['===FILE:mockup.html===', '<html></html>', '===INTERIOR_NOTES===', 'notes'].join(
      '\n'
    )
    const p = parseDelimiterResponse(raw)
    expect(p.files[0].content).toBe('<html></html>')
    expect(p.interior_notes).toBe('notes')
  })

  it('captures HERO_SOURCE, COMPOSITION, and COMPOSITION_RATIONALE (variance/coherence blocks)', () => {
    const raw = [
      '===HERO_COPY===',
      'FOURTEEN HOURS OF LIGHT',
      '===HERO_SOURCE===',
      'composed',
      '===COMPOSITION===',
      'columns: two-equal',
      'axis: vertical',
      'symmetry: broken',
      'hero_zone: center',
      '===COMPOSITION_RATIONALE===',
      'A broken-symmetry two-column grid lets the phrase sit off-center, matching its uneasy tone.',
      '===RATIONALE===',
      'because',
    ].join('\n')
    const p = parseDelimiterResponse(raw)
    expect(p.hero_source).toBe('composed')
    expect(p.composition).toContain('columns: two-equal')
    expect(p.composition_rationale).toContain('broken-symmetry')
    expect(p.rationale).toBe('because')
  })

  it('captures MOBILE between HEADER and COMPOSITION, and terminates a FILE block at it', () => {
    const raw = [
      '===HEADER===',
      'placement: top-bar',
      '===MOBILE===',
      'carrier: the hero phrase',
      'order: hero, ledger',
      '===COMPOSITION===',
      'collapse: stack',
      '===FILE:elements/preset.ts===',
      'export const elementsPreset = {}',
      '===MOBILE===',
      'carrier: second',
      '===RATIONALE===',
      'because',
    ].join('\n')
    const p = parseDelimiterResponse(raw)
    // First occurrence wins for the block; the FILE block still ends at the delimiter.
    expect(p.header).toBe('placement: top-bar')
    expect(p.mobile).toBe('carrier: the hero phrase\norder: hero, ledger')
    expect(p.composition).toBe('collapse: stack')
    expect(p.files[0].content).toBe('export const elementsPreset = {}')
  })

  it('leaves mobile undefined when the block is absent', () => {
    expect(parseDelimiterResponse('===HERO_COPY===\nX\n===RATIONALE===\nr').mobile).toBeUndefined()
  })

  it('does not fail when HERO_SOURCE and COMPOSITION are absent (optional/independent blocks)', () => {
    const raw = [
      '===HERO_COPY===',
      'FOURTEEN HOURS OF LIGHT',
      '===ARCHETYPE===',
      'Specimen',
      '===RATIONALE===',
      'because',
    ].join('\n')
    const p = parseDelimiterResponse(raw)
    expect(p.hero_source).toBeUndefined()
    expect(p.composition).toBeUndefined()
    expect(p.composition_rationale).toBeUndefined()
    expect(p.hero_copy).toBe('FOURTEEN HOURS OF LIGHT')
  })

  it('still terminates a FILE block at HERO_SOURCE, COMPOSITION, and COMPOSITION_RATIONALE', () => {
    const raw = [
      '===FILE:mockup.html===',
      '<html></html>',
      '===HERO_SOURCE===',
      'quote',
      '===COMPOSITION===',
      'columns: single',
      '===COMPOSITION_RATIONALE===',
      'because',
    ].join('\n')
    const p = parseDelimiterResponse(raw)
    expect(p.files[0].content).toBe('<html></html>')
    expect(p.hero_source).toBe('quote')
    expect(p.composition).toBe('columns: single')
    expect(p.composition_rationale).toBe('because')
  })
})
