/**
 * `extractTextSegments`, against real Chromium — the grouping and geometry
 * rules need actual layout, not jsdom. Mirrors surface-gate-dom.test.js's
 * setup (one shared browser, a `measure` helper that sets page content and
 * evaluates the function under test).
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { extractTextSegments } from '../../scripts/utils/mockup-fidelity.js'

async function measure(browser, html, { width = 1440, height = 900 } = {}) {
  const page = await browser.newPage({ viewport: { width, height } })
  try {
    await page.setContent(
      `<!doctype html><html><head><style>html,body{margin:0;padding:0}</style></head>` +
        `<body>${html}</body></html>`
    )
    return await page.evaluate(extractTextSegments)
  } finally {
    await page.close()
  }
}

describe('extractTextSegments', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  it('recovers "gap" from a per-letter flex hero (2026-09-19)', async () => {
    // archive/2026-09-19's mockup builds the hero word letter by letter, each
    // in its own span, laid out with `display:flex` on the container —
    // exactly what blockifies each letter's own inline-block span to `block`
    // without making it a real block boundary.
    const segs = await measure(
      browser,
      `<style>
        .gap-letters{display:flex;justify-content:space-between;font-size:200px}
        .gap-letters span{display:inline-block}
      </style>
      <span class="gap-letters"><span>G</span><span>A</span><span>P</span></span>`
    )
    const gap = segs.find((s) => s.text === 'GAP')
    expect(gap).toBeDefined()
    expect(segs.filter((s) => /^[GAP]$/.test(s.text))).toHaveLength(0)
  })

  it('does not merge two real paragraphs that happen to share a font-size', async () => {
    const segs = await measure(
      browser,
      `<p style="font-size:40px">First paragraph.</p><p style="font-size:40px">Second paragraph.</p>`
    )
    const texts = segs.map((s) => s.text.trim())
    expect(texts).toContain('First paragraph.')
    expect(texts).toContain('Second paragraph.')
    expect(texts).not.toContain('First paragraph.Second paragraph.')
  })

  it('folds a <br> between two same-size runs into a space', async () => {
    const segs = await measure(
      browser,
      `<p style="font-size:32px">Closing the gap<br>between design and code</p>`
    )
    const p = segs.find((s) => s.text.includes('Closing'))
    expect(p.text.replace(/\s+/g, ' ').trim()).toBe('Closing the gap between design and code')
  })

  it('lowers visibleFraction for a segment clipped by an ancestor', async () => {
    const segs = await measure(
      browser,
      `<div style="width:100px;height:20px;overflow:hidden">` +
        `<span style="font-size:16px;white-space:nowrap">A much longer line than the box</span></div>`
    )
    const s = segs.find((s) => s.text.includes('much longer'))
    expect(s).toBeDefined()
    expect(s.visibleFraction).toBeLessThan(0.6)
    expect(s.visibleFraction).toBeGreaterThan(0)
  })

  it('reports full visibleFraction for an unclipped segment', async () => {
    const segs = await measure(browser, `<p style="font-size:40px">Plainly visible</p>`)
    const s = segs.find((s) => s.text.includes('Plainly'))
    expect(s.visibleFraction).toBeCloseTo(1, 1)
  })

  it('captures effective opacity as the product of ancestor opacities', async () => {
    const segs = await measure(
      browser,
      `<div style="opacity:0.5"><div style="opacity:0.4"><p style="font-size:20px">Faded</p></div></div>`
    )
    const s = segs.find((s) => s.text.includes('Faded'))
    expect(s.opacity).toBeCloseTo(0.2, 5)
  })

  it('treats display:none and visibility:hidden as absent, not opacity 0', async () => {
    const segs = await measure(
      browser,
      `<p style="font-size:20px" hidden>Gone</p>` +
        `<div style="display:none"><p style="font-size:20px">Also gone</p></div>` +
        `<p style="font-size:20px;visibility:hidden">Invisible</p>` +
        `<p style="font-size:20px">Still here</p>`
    )
    const texts = segs.map((s) => s.text.trim())
    expect(texts.some((t) => t.includes('Gone'))).toBe(false)
    expect(texts.some((t) => t.includes('Also gone'))).toBe(false)
    expect(texts.some((t) => t.includes('Invisible'))).toBe(false)
    expect(texts.some((t) => t.includes('Still here'))).toBe(true)
  })

  it('reports a genuine opacity:0 element rather than dropping it', async () => {
    const segs = await measure(browser, `<p style="font-size:20px;opacity:0">Faint</p>`)
    const s = segs.find((s) => s.text.includes('Faint'))
    expect(s).toBeDefined()
    expect(s.opacity).toBeCloseTo(0, 5)
  })

  it('breaks a run across two different block-level containers', async () => {
    const segs = await measure(
      browser,
      `<div style="display:flex"><p style="font-size:24px">Left column</p>` +
        `<p style="font-size:24px">Right column</p></div>`
    )
    const texts = segs.map((s) => s.text.trim())
    expect(texts).toContain('Left column')
    expect(texts).toContain('Right column')
  })
})
