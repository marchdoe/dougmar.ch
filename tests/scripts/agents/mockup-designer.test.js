import { describe, it, expect } from 'vitest'
import {
  buildMockupDesignerUserPrompt,
  validateMockupResult,
} from '../../../scripts/agents/mockup-designer.js'

describe('buildMockupDesignerUserPrompt', () => {
  it('includes brief, tokens, measurables, shell, brand svg, and polish sections', () => {
    const p = buildMockupDesignerUserPrompt({
      enrichedBrief: 'THE BRIEF',
      tokenContext: 'export const elementsPreset = {}',
      contentSummary: 'PROJECTS...',
      measurables: 'canvas_utilization_min: 70',
      shell: 'nav: bottom rail',
      brandSvg: '<svg id="mark"/>',
      brandMonoSvg: '<svg id="mono"/>',
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Anton',
      lessonsBlock: '## Recent Lessons\n- stop doing X',
      calibrationNote: '',
      compositionContractBlock: '',
      polishRef: 'POLISH GUIDANCE TEXT',
    })
    for (const s of [
      'THE BRIEF',
      'elementsPreset',
      'canvas_utilization_min: 70',
      'nav: bottom rail',
      '<svg id="mark"/>',
      'fonts.googleapis.com',
      'Recent Lessons',
      'POLISH GUIDANCE TEXT',
    ]) {
      expect(p).toContain(s)
    }
  })
  it('carries the client marks block after the brand mark and omits it when empty (#505)', () => {
    const base = {
      enrichedBrief: 'B',
      tokenContext: 'T',
      contentSummary: 'SITE CONTENT',
      measurables: 'M',
      shell: 'S',
      brandSvg: 'V',
      brandMonoSvg: 'W',
      googleFontsUrl: 'G',
    }
    const withMarks = buildMockupDesignerUserPrompt({
      ...base,
      clientMarksBlock:
        '## Client Marks (inline SVG source; paste, never redraw)\n\n<svg id="rolex"/>',
    })
    expect(withMarks).toContain('<svg id="rolex"/>')
    expect(withMarks.indexOf('Client Marks')).toBeGreaterThan(withMarks.indexOf('Brand Mark SVG'))
    expect(withMarks.indexOf('Client Marks')).toBeLessThan(withMarks.indexOf('SITE CONTENT'))
    expect(buildMockupDesignerUserPrompt({ ...base, clientMarksBlock: '' })).not.toContain(
      'Client Marks'
    )
  })

  it('appends revision feedback as the final section when present', () => {
    const p = buildMockupDesignerUserPrompt({
      enrichedBrief: 'B',
      tokenContext: 'T',
      contentSummary: 'C',
      measurables: 'M',
      shell: 'S',
      brandSvg: 'V',
      brandMonoSvg: 'W',
      googleFontsUrl: 'G',
      lessonsBlock: 'LESSONS',
      calibrationNote: 'CALIBRATION',
      polishRef: 'POLISH',
      revisionFeedback: 'utilization ~45% vs floor 70',
    })
    expect(p).toContain('CRITIC REVISION FEEDBACK')
    // genuinely last — after every optional section, not just Site Content
    expect(p.indexOf('utilization ~45%')).toBeGreaterThan(p.indexOf('POLISH'))
    expect(p.indexOf('POLISH')).toBeGreaterThan(p.indexOf('CALIBRATION'))
    expect(p.indexOf('CALIBRATION')).toBeGreaterThan(p.indexOf('LESSONS'))
  })
})

describe('validateMockupResult', () => {
  it('accepts a complete response', () => {
    expect(() =>
      validateMockupResult({
        files: [
          {
            path: 'mockup.html',
            content: '<!DOCTYPE html><html><head></head><body>x</body></html>',
          },
        ],
        interior_notes: 'about page notes',
      })
    ).not.toThrow()
  })
  it('rejects a missing mockup.html', () => {
    expect(() => validateMockupResult({ files: [], interior_notes: 'n' })).toThrow(/mockup\.html/)
  })
  it('rejects script tags (mockup must be JS-free)', () => {
    expect(() =>
      validateMockupResult({
        files: [{ path: 'mockup.html', content: '<html><script>alert(1)</script></html>' }],
        interior_notes: 'n',
      })
    ).toThrow(/script/i)
  })
  it('rejects missing interior notes', () => {
    expect(() =>
      validateMockupResult({
        files: [{ path: 'mockup.html', content: '<html></html>' }],
      })
    ).toThrow(/INTERIOR_NOTES/)
  })
})
