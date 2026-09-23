import { describe, it, expect } from 'vitest'
import {
  buildMockupDesignerUserPrompt,
  resolveMockupReply,
  validateMockupResult,
} from '../../../scripts/agents/mockup-designer.js'
import { parseDelimiterResponse } from '../../../scripts/utils/delimiter-parser.js'
import { PATCH_INSTRUCTIONS } from '../../../scripts/utils/mockup-patch.js'

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

describe('buildMockupDesignerUserPrompt on a revision round (#573)', () => {
  const base = {
    enrichedBrief: 'B',
    tokenContext: 'T',
    contentSummary: 'C',
    measurables: 'M',
    shell: 'S',
    brandSvg: 'V',
    brandMonoSvg: 'W',
    googleFontsUrl: 'G',
    polishRef: 'POLISH',
  }
  const previousMockupHtml = '<!doctype html><html><body data-round="0">page</body></html>'

  it('puts the previous mockup between the polish reference and the critic feedback', () => {
    const p = buildMockupDesignerUserPrompt({
      ...base,
      previousMockupHtml,
      revisionFeedback: 'Measured 61.9% against floor 76%',
    })
    const header = '## PREVIOUS MOCKUP'
    expect(p).toContain(
      `${header} — the page the critic reviewed; revise this file, do not start over`
    )
    expect(p).toContain(`\`\`\`html\n${previousMockupHtml}\n\`\`\``)
    expect(p.indexOf(header)).toBeGreaterThan(p.indexOf('POLISH'))
    expect(p.indexOf(header)).toBeLessThan(p.indexOf('## CRITIC REVISION FEEDBACK'))
    expect(p.trimEnd().endsWith('Measured 61.9% against floor 76%')).toBe(true)
  })

  it('adds nothing but the previous-mockup section to the first-round prompt', () => {
    const first = buildMockupDesignerUserPrompt(base)
    const revised = buildMockupDesignerUserPrompt({
      ...base,
      previousMockupHtml,
      revisionFeedback: 'FEEDBACK',
    })
    expect(revised.startsWith(first)).toBe(true)
    expect(revised.slice(first.length).split('\n\n---\n\n')).toEqual([
      '',
      `## PREVIOUS MOCKUP — the page the critic reviewed; revise this file, do not start over\n\n\`\`\`html\n${previousMockupHtml}\n\`\`\``,
      PATCH_INSTRUCTIONS,
      '## CRITIC REVISION FEEDBACK — fix these before anything else\n\nFEEDBACK',
    ])
  })

  it('puts the measured faults after the patch instructions and before the critic', () => {
    const p = buildMockupDesignerUserPrompt({
      ...base,
      previousMockupHtml,
      measuredFaults: '## MEASURED FAULTS\n\n- [check 4] mark missing',
      revisionFeedback: 'FEEDBACK',
    })
    expect(p.indexOf('## HOW TO RETURN THIS REVISION')).toBeLessThan(
      p.indexOf('## MEASURED FAULTS')
    )
    expect(p.indexOf('## MEASURED FAULTS')).toBeLessThan(p.indexOf('## CRITIC REVISION FEEDBACK'))
  })

  it('revises on measured faults alone, with no critic section', () => {
    const p = buildMockupDesignerUserPrompt({
      ...base,
      previousMockupHtml,
      measuredFaults: '## MEASURED FAULTS\n\n- [check 2] canvas',
    })
    expect(p).toContain('## PREVIOUS MOCKUP')
    expect(p).not.toContain('## CRITIC REVISION FEEDBACK')
    expect(p.trimEnd().endsWith('- [check 2] canvas')).toBe(true)
  })

  it('asks for the whole file when the patch format is withdrawn', () => {
    const p = buildMockupDesignerUserPrompt({
      ...base,
      previousMockupHtml,
      revisionFeedback: 'FEEDBACK',
      allowPatch: false,
    })
    expect(p).toContain('## PREVIOUS MOCKUP')
    expect(p).not.toContain(PATCH_INSTRUCTIONS)
  })

  it('omits the section on the first round and when there is no feedback to act on', () => {
    expect(buildMockupDesignerUserPrompt(base)).not.toContain('PREVIOUS MOCKUP')
    expect(buildMockupDesignerUserPrompt({ ...base, previousMockupHtml })).not.toContain(
      'PREVIOUS MOCKUP'
    )
    expect(buildMockupDesignerUserPrompt({ ...base, revisionFeedback: 'FEEDBACK' })).not.toContain(
      'PREVIOUS MOCKUP'
    )
  })

  it('keeps the retry context last, after the previous mockup and the feedback', () => {
    const p = buildMockupDesignerUserPrompt({
      ...base,
      previousMockupHtml,
      revisionFeedback: 'FEEDBACK',
      retryContext: '## Previous attempt was rejected',
    })
    expect(p.indexOf('## Previous attempt was rejected')).toBeGreaterThan(
      p.indexOf('## CRITIC REVISION FEEDBACK')
    )
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

describe('resolveMockupReply (a revision is a patch)', () => {
  const previous =
    '<!doctype html><html><head><style>\n.mark { height: 24px; }\n</style></head><body>page</body></html>'
  const ctx = {
    previousMockupHtml: previous,
    previousInteriorNotes: 'OLD NOTES',
    previousRationale: 'OLD RATIONALE',
  }
  const reply = (body) => `===PATCH:mockup.html===\n${body}\n`

  it('applies the patch to the previous mockup and carries the notes over', () => {
    const raw = reply(
      '<<<<<<< FIND\n.mark { height: 24px; }\n=======\n.mark { height: 52px; }\n>>>>>>> REPLACE'
    )
    const { parsed, patch } = resolveMockupReply(parseDelimiterResponse(raw), raw, ctx)
    expect(patch).toEqual({ edits: 1 })
    expect(parsed.files.find((f) => f.path === 'mockup.html').content).toBe(
      previous.replace('24px', '52px')
    )
    expect(parsed.interior_notes).toBe('OLD NOTES')
    expect(parsed.rationale).toBe('OLD RATIONALE')
    expect(() => validateMockupResult(parsed)).not.toThrow()
  })

  it('keeps new notes when the patch reply carries them', () => {
    const raw = `${reply('<<<<<<< FIND\npage\n=======\nPAGE\n>>>>>>> REPLACE')}===INTERIOR_NOTES===\nNEW NOTES\n`
    const { parsed } = resolveMockupReply(parseDelimiterResponse(raw), raw, ctx)
    expect(parsed.interior_notes).toBe('NEW NOTES')
  })

  it('throws with patchFailed when a FIND is not in the page', () => {
    const raw = reply(
      '<<<<<<< FIND\n.nav { gap: 4px; }\n=======\n.nav { gap: 8px; }\n>>>>>>> REPLACE'
    )
    let err
    try {
      resolveMockupReply(parseDelimiterResponse(raw), raw, ctx)
    } catch (e) {
      err = e
    }
    expect(err?.patchFailed).toBe(true)
    expect(err.message).toMatch(/edit 1's FIND text is not in the previous mockup/)
  })

  it('prefers a full file when the reply sends one', () => {
    const raw = '===FILE:mockup.html===\n<html>whole</html>\n===INTERIOR_NOTES===\nn\n'
    const { parsed, patch } = resolveMockupReply(parseDelimiterResponse(raw), raw, ctx)
    expect(patch).toBeNull()
    expect(parsed.files[0].content).toBe('<html>whole</html>')
  })

  it('rejects a patched page that adds a script', () => {
    const raw = reply('<<<<<<< FIND\npage\n=======\n<script>x</script>\n>>>>>>> REPLACE')
    const { parsed } = resolveMockupReply(parseDelimiterResponse(raw), raw, ctx)
    expect(() => validateMockupResult(parsed)).toThrow(/script/)
  })
})
