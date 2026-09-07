/**
 * The achieved-numbers half of the MEASURABLES comparison (#456), against
 * real Chromium — the same discipline surface-gate-dom.test.js applies to
 * collectSurfaceMetrics and findClippedElements, since getComputedStyle and
 * getBoundingClientRect need actual layout, not jsdom.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { measureDesignFidelity } from '../../scripts/utils/design-fidelity.js'

async function measure(browser, html, { width = 400, height = 300, bodyStyle = '' } = {}) {
  const page = await browser.newPage({ viewport: { width, height } })
  try {
    await page.setContent(
      `<!doctype html><html><head><style>html,body{margin:0;padding:0}</style></head>` +
        `<body style="${bodyStyle}">${html}</body></html>`
    )
    return await page.evaluate(measureDesignFidelity)
  } finally {
    await page.close()
  }
}

describe('measureDesignFidelity', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  it('measures a full-bleed colour field near 100% coverage', async () => {
    const { canvas_utilization, color_coverage } = await measure(
      browser,
      `<div style="position:fixed;inset:0;background:#2255dd"></div>`
    )
    expect(canvas_utilization).toBeGreaterThan(95)
    expect(color_coverage).toBeGreaterThan(95)
  })

  it('measures a narrow centered column on white at low utilization', async () => {
    const { canvas_utilization } = await measure(
      browser,
      `<div style="width:80px;margin:100px auto;font-size:14px;color:#111">Hi</div>`
    )
    expect(canvas_utilization).toBeLessThan(20)
  })

  it('does not count a background that only restates the page background', async () => {
    // The page itself is set to white; a white box on top of it declares
    // nothing new, so it must not count as designed content.
    const { canvas_utilization } = await measure(
      browser,
      `<div style="width:400px;height:300px;background:#ffffff"></div>`,
      { bodyStyle: 'background:#ffffff' }
    )
    expect(canvas_utilization).toBe(0)
  })

  it('reports zero colour coverage for black text with no colour anywhere', async () => {
    const { color_coverage } = await measure(
      browser,
      `<p style="font-size:16px;color:#000;margin:20px">Plain running copy, no colour here.</p>`
    )
    expect(color_coverage).toBe(0)
  })

  it('scores a saturated accent block for colour coverage well under total coverage', async () => {
    // Grey fills the whole field (covered, but achromatic); only the pink box
    // is chromatic, so coverage and colour coverage must come apart.
    const { color_coverage, canvas_utilization } = await measure(
      browser,
      `<div style="width:400px;height:300px;background:#888888">` +
        `<div style="width:100px;height:100px;background:#e0217a"></div></div>`
    )
    expect(canvas_utilization).toBeGreaterThan(90) // the grey field fills the page
    expect(color_coverage).toBeGreaterThan(0)
    expect(color_coverage).toBeLessThan(canvas_utilization / 2) // only the accent box is chromatic
  })

  it('picks the largest first-fold text as hero_px', async () => {
    const { hero_px } = await measure(
      browser,
      `<h1 style="font-size:80px;margin:0">Headline</h1>` +
        `<p style="font-size:16px;margin:0">Supporting copy underneath.</p>`
    )
    expect(hero_px).toBe(80)
  })

  it('ignores text below the fold when picking hero_px', async () => {
    const { hero_px } = await measure(
      browser,
      `<h1 style="font-size:32px;margin:0">Above the fold</h1>` +
        `<div style="margin-top:2000px;font-size:300px">Never seen without scrolling</div>`,
      { width: 400, height: 300 }
    )
    expect(hero_px).toBe(32)
  })

  it('ignores display:none and zero-opacity elements entirely', async () => {
    // Absolutely positioned so an invisible box does not also push the
    // visible paragraph below the fold by occupying flow space it does not
    // visually use.
    const { canvas_utilization, hero_px } = await measure(
      browser,
      `<div style="position:absolute;font-size:400px;display:none">Hidden</div>` +
        `<div style="position:absolute;font-size:400px;opacity:0">Invisible</div>` +
        `<p style="font-size:16px;margin:0">Visible copy</p>`
    )
    expect(hero_px).toBe(16)
    expect(canvas_utilization).toBeLessThan(20)
  })

  it('returns numbers, never NaN, on a blank page', async () => {
    const result = await measure(browser, '')
    expect(result.canvas_utilization).toBe(0)
    expect(result.color_coverage).toBe(0)
    expect(result.hero_px).toBe(0)
    for (const v of Object.values(result)) {
      expect(Number.isNaN(v)).toBe(false)
    }
  })
})
