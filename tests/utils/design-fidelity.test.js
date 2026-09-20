/**
 * The achieved-numbers half of the MEASURABLES comparison (#456), against
 * real Chromium — the same discipline surface-gate-dom.test.js applies to
 * collectSurfaceMetrics and findClippedElements, since getComputedStyle and
 * getBoundingClientRect need actual layout, not jsdom.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { measureDesignFidelity } from '../../scripts/utils/design-fidelity.js'

async function measure(
  browser,
  html,
  { width = 400, height = 300, bodyStyle = '', htmlStyle = '', head = '' } = {}
) {
  const page = await browser.newPage({ viewport: { width, height } })
  try {
    await page.setContent(
      `<!doctype html><html style="${htmlStyle}"><head><style>html,body{margin:0;padding:0}</style>` +
        `${head}</head><body style="${bodyStyle}">${html}</body></html>`
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

  // The four pages from #572, at the desktop size the capture uses. Before the
  // fix the first three measured 4.4%, 0% and 0% canvas.
  describe('paint that is not a background colour on an element', () => {
    const desktop = { width: 1440, height: 900 }

    it('counts a body painted with a flat colour as a full canvas', async () => {
      const { canvas_utilization, color_coverage } = await measure(browser, '', {
        ...desktop,
        bodyStyle: 'background:#1f5142',
      })
      expect(canvas_utilization).toBeGreaterThan(95)
      expect(color_coverage).toBeGreaterThan(95)
    })

    it('counts a full-bleed div that is only a linear-gradient', async () => {
      const { canvas_utilization, color_coverage } = await measure(
        browser,
        `<div style="position:fixed;inset:0;background-image:linear-gradient(#1f5142,#0b2a20)"></div>`,
        desktop
      )
      expect(canvas_utilization).toBeGreaterThan(95)
      expect(color_coverage).toBeGreaterThan(95)
    })

    it('counts a full-bleed inline svg', async () => {
      const { canvas_utilization } = await measure(
        browser,
        `<svg style="position:fixed;inset:0;width:100%;height:100%" viewBox="0 0 10 10">` +
          `<rect width="10" height="10" fill="#1f5142"/></svg>`,
        desktop
      )
      expect(canvas_utilization).toBeGreaterThan(95)
    })

    it('counts a full-bleed div with a background colour (control)', async () => {
      const { canvas_utilization, color_coverage } = await measure(
        browser,
        `<div style="position:fixed;inset:0;background-color:#1f5142"></div>`,
        desktop
      )
      expect(canvas_utilization).toBeGreaterThan(95)
      expect(color_coverage).toBeGreaterThan(95)
    })

    it('counts a gradient painted on body, which paints the whole canvas', async () => {
      const { canvas_utilization, color_coverage } = await measure(browser, '', {
        ...desktop,
        bodyStyle: 'background:radial-gradient(120% 90% at 50% 34%,#1f6b57,#0b2a20)',
      })
      expect(canvas_utilization).toBeGreaterThan(95)
      expect(color_coverage).toBeGreaterThan(95)
    })

    it('counts a background set on html', async () => {
      const { canvas_utilization, color_coverage } = await measure(browser, '', {
        ...desktop,
        htmlStyle: 'background:#1f5142',
      })
      expect(canvas_utilization).toBeGreaterThan(95)
      expect(color_coverage).toBeGreaterThan(95)
    })

    it('does not count an explicit opaque white html and body', async () => {
      const { canvas_utilization } = await measure(browser, '', {
        ...desktop,
        htmlStyle: 'background:#ffffff',
        bodyStyle: 'background:#ffffff',
      })
      expect(canvas_utilization).toBe(0)
    })

    it('counts a gradient that only fades to transparent, but not as colour when its stops are grey', async () => {
      const { canvas_utilization, color_coverage } = await measure(
        browser,
        `<div style="position:fixed;inset:0;background-image:linear-gradient(transparent,rgba(0,0,0,.5))"></div>`,
        desktop
      )
      expect(canvas_utilization).toBeGreaterThan(95)
      expect(color_coverage).toBe(0)
    })

    it('counts a chromatic stop that shows and ignores one that is fully transparent', async () => {
      const { color_coverage } = await measure(
        browser,
        `<div style="position:fixed;inset:0;background-image:linear-gradient(#e0217a,transparent)"></div>`,
        desktop
      )
      expect(color_coverage).toBeGreaterThan(95)
    })

    it('reads a positioned ::before that paints a host with no paint of its own', async () => {
      const { canvas_utilization, color_coverage } = await measure(
        browser,
        `<div class="field"></div>`,
        {
          ...desktop,
          head:
            `<style>.field{position:fixed;inset:0}` +
            `.field::before{content:"";position:absolute;inset:0;background:#e0217a}</style>`,
        }
      )
      expect(canvas_utilization).toBeGreaterThan(95)
      expect(color_coverage).toBeGreaterThan(95)
    })

    it('sizes a ::after by its own box, not the whole host', async () => {
      // 200x150 of a 400x300 viewport is a quarter of the grid.
      const { canvas_utilization } = await measure(browser, `<div class="box"></div>`, {
        head:
          `<style>.box{position:relative;width:200px;height:150px}` +
          `.box::after{content:"";position:absolute;inset:0;background:#e0217a}</style>`,
      })
      expect(canvas_utilization).toBeGreaterThan(20)
      expect(canvas_utilization).toBeLessThan(30)
    })

    it('ignores a pseudo-element with no content, which generates no box', async () => {
      const { canvas_utilization } = await measure(browser, `<div class="field"></div>`, {
        ...desktop,
        head:
          `<style>.field{position:fixed;inset:0}` +
          `.field::before{position:absolute;inset:0;background:#e0217a}</style>`,
      })
      expect(canvas_utilization).toBe(0)
    })
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
