import { describe, expect, it } from 'vitest'
import {
  buildMockupCriticBlocks,
  formatMeasuredFidelity,
  parseMockupCriticResponse,
} from '../../../scripts/agents/mockup-critic.js'

describe('parseMockupCriticResponse', () => {
  it('parses APPROVE', () => {
    const r = parseMockupCriticResponse(
      '===VERDICT===\nAPPROVE\n===FEEDBACK===\nStrong drench.\n===END==='
    )
    expect(r.verdict).toBe('APPROVE')
    expect(r.feedback).toBe('Strong drench.')
  })
  it('parses REVISE with feedback', () => {
    const r = parseMockupCriticResponse(
      '===VERDICT===\nREVISE\n===FEEDBACK===\n1. utilization ~45% vs floor 70\n===END==='
    )
    expect(r.verdict).toBe('REVISE')
    expect(r.feedback).toContain('45%')
  })
  it('defaults to REVISE on malformed responses (fail-closed)', () => {
    const r = parseMockupCriticResponse('I think it looks nice')
    expect(r.verdict).toBe('REVISE')
    expect(r.feedback).toContain('malformed')
  })
  it('rejects a literal echo of the template line (fail-closed)', () => {
    const r = parseMockupCriticResponse(
      '===VERDICT===\nAPPROVE | REVISE\n===FEEDBACK===\nx\n===END==='
    )
    expect(r.verdict).toBe('REVISE')
    expect(r.feedback).toContain('malformed')
  })
  it('takes the LAST verdict so quoted examples cannot shadow the real one', () => {
    const r = parseMockupCriticResponse(
      'Example:\n===VERDICT===\nAPPROVE\n===FEEDBACK===\nexample\n===END===\n\nReal:\n===VERDICT===\nREVISE\n===FEEDBACK===\nreal feedback\n===END==='
    )
    expect(r.verdict).toBe('REVISE')
  })
  it('keeps feedback when ===END=== is truncated away', () => {
    const r = parseMockupCriticResponse(
      '===VERDICT===\nREVISE\n===FEEDBACK===\n1. hero too small at ~60px'
    )
    expect(r.verdict).toBe('REVISE')
    expect(r.feedback).toContain('hero too small')
  })
})

describe('buildMockupCriticBlocks', () => {
  const ctx = {
    enrichedBrief: 'the brief',
    measurables: 'floors',
    shell: 'shell decl',
    screenshotBuffer: Buffer.from([0xff, 0xd8, 0xff]),
  }

  it('ends with a real image block carrying the JPEG bytes', () => {
    const blocks = buildMockupCriticBlocks(ctx)
    const last = blocks[blocks.length - 1]
    expect(last).toEqual({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: '/9j/' },
    })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(1)
  })

  it('carries the phone filmstrip next to the desktop render, each labelled', () => {
    const blocks = buildMockupCriticBlocks({
      ...ctx,
      mobileScreenshot: Buffer.from([0x01]),
      headerCrop: Buffer.from([0x02]),
    })
    const images = blocks.filter((b) => b.type === 'image')
    expect(images).toHaveLength(3)

    const kinds = blocks.map((b) => (b.type === 'image' ? 'image' : b.text))
    const desktopLabel = kinds.findIndex((k) => k.includes('1440×900'))
    const mobileLabel = kinds.findIndex((k) => k.includes('phone filmstrip'))
    expect(desktopLabel).toBeGreaterThan(-1)
    expect(mobileLabel).toBeGreaterThan(-1)
    // label, image, label, image: the filmstrip is adjacent to its counterpart.
    expect(kinds[desktopLabel + 1]).toBe('image')
    expect(mobileLabel).toBe(desktopLabel + 2)
    expect(kinds[mobileLabel + 1]).toBe('image')
    // The header crop still comes last, so check 4 is judged on it.
    expect(images[2].source.data).toBe(Buffer.from([0x02]).toString('base64'))
  })

  it('drops the phone block rather than the run when the capture failed', () => {
    const blocks = buildMockupCriticBlocks({ ...ctx, mobileScreenshot: null })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(1)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('phone filmstrip'))).toBe(false)
  })

  it('carries brief, measurables and shell as text blocks', () => {
    const text = buildMockupCriticBlocks(ctx)
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(text).toContain('the brief')
    expect(text).toContain('floors')
    expect(text).toContain('shell decl')
    // The screenshot must never ride along as a data-URI in text.
    expect(text).not.toContain('base64')
  })

  it('carries the measured fidelity numbers as a text block beside the declared floors (#487)', () => {
    const blocks = buildMockupCriticBlocks({
      ...ctx,
      measured: { canvas_utilization: 35.1, color_coverage: 19.5, hero_px: 96 },
      measurablesDecl: {
        canvas_utilization_min: 68,
        color_coverage_min: 40,
        hero_scale: 'clamp(64px, 7vw, 96px)',
      },
    })
    const text = blocks
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(text).toContain('Measured Fidelity')
    expect(text).toContain('canvas utilization 35.1%')
    expect(text).toContain('floor 68%')
    expect(text).toContain('colour coverage 19.5%')
    expect(text).toContain('floor 40%')
    expect(text).toContain('96px')
    expect(text).toContain('clamp(64px, 7vw, 96px)')
  })

  it('omits the measured fidelity block when the capture produced no numbers', () => {
    const blocks = buildMockupCriticBlocks({ ...ctx, measured: null })
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('Measured Fidelity'))).toBe(
      false
    )
  })
})

describe('formatMeasuredFidelity', () => {
  it('returns null when nothing was measured', () => {
    expect(formatMeasuredFidelity(null, { canvas_utilization_min: 68 })).toBeNull()
    expect(formatMeasuredFidelity(undefined, undefined)).toBeNull()
  })

  it('states the measured numbers beside the declared floors and the method note', () => {
    const text = formatMeasuredFidelity(
      { canvas_utilization: 35.1, color_coverage: 19.5, hero_px: 96 },
      { canvas_utilization_min: 68, color_coverage_min: 40, hero_scale: 'clamp(64px, 7vw, 96px)' }
    )
    expect(text).toContain('canvas utilization 35.1% (floor 68%)')
    expect(text).toContain('colour coverage 19.5% (floor 40%)')
    expect(text).toContain('largest first-fold text 96px (declared hero clamp(64px, 7vw, 96px))')
    // The one-line method note travels with the numbers, for a reader who
    // was not there.
    expect(text).toMatch(/Measured at 1440x900 on a \d+px grid/)
  })

  it('falls back to n/a for a missing declared floor rather than throwing', () => {
    const text = formatMeasuredFidelity(
      { canvas_utilization: 10, color_coverage: 5, hero_px: 40 },
      null
    )
    expect(text).toContain('floor n/a')
    expect(text).toContain('declared hero n/a')
  })
})
