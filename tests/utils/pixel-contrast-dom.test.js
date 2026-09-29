/**
 * The page half of the pixel contrast probe (spec 11, 1c), against real
 * Chromium: the text is hidden and only the text, the pixels come back from
 * the box it sits in, and the page is left as it was found.
 */
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { WIDE_VIEWPORT } from '../../elements/chassis/viewports.js'
import { legibilityFindings, measureProbe } from '../../scripts/utils/pixel-contrast.js'
import { probePixelContrast } from '../../scripts/utils/pixel-contrast-page.js'

let browser
beforeAll(async () => {
  browser = await chromium.launch({ headless: true })
})
afterAll(async () => {
  await browser?.close()
})

// 09-28's shape: white rules drawn by a positioned layer beside the copy,
// every 12px, 2px thick, across a navy field.
const RULES =
  '<div class="rules" style="position:absolute;inset:0;background:repeating-linear-gradient(180deg, transparent 0 10px, #fff 10px 12px)"></div>'

async function probe(body) {
  const page = await browser.newPage({ viewport: WIDE_VIEWPORT })
  try {
    await page.setContent(`<!doctype html><html><body style="margin:0">${body}</body></html>`)
    const result = await probePixelContrast(page)
    const after = await page.evaluate(() => ({
      marked: document.querySelectorAll('[data-pixel-contrast-hide]').length,
      sheets: document.querySelectorAll('style[data-pixel-contrast-hide-sheet]').length,
      color: getComputedStyle(document.querySelector('.label')).color,
      global: '__pixelContrastTargets' in window,
    }))
    return { result, after }
  } finally {
    await page.close()
  }
}

describe('probePixelContrast', () => {
  it('fails white text set across white rules, and leaves the page as it was', async () => {
    const { result, after } = await probe(
      `<section style="position:relative;background:#2c2260;padding:40px">${RULES}<span class="label" style="position:relative;color:#fff;font-size:12px;letter-spacing:.1em">SHEET 01 · DESIGN INTENT</span></section>`
    )
    expect(result.probes).toHaveLength(1)
    const [p] = result.probes
    expect(p.unresolved).toContain('div.rules (positioned background-image)')
    expect(result.probed).toEqual([p.key])
    const m = measureProbe(p)
    expect(m.ratio).toBeLessThan(2)
    const [f] = legibilityFindings({ pixelContrast: result }, 'react-engineer')
    expect(f.detail).toContain('SHEET 01')
    expect(after).toEqual({ marked: 0, sheets: 0, color: 'rgb(255, 255, 255)', global: false })
  })

  it('reads the ground, not the text: the same label on a flat gradient passes', async () => {
    // A one-colour gradient is a background-image the CSS walk cannot
    // resolve, and a flat ground in pixels; only the label's own glyphs
    // could lower the ratio, and they are hidden.
    const { result } = await probe(
      '<section style="background:linear-gradient(#2c2260, #2c2260);padding:40px"><span class="label" style="color:#fff;font-size:12px">SHEET 01</span></section>'
    )
    expect(result.probes).toHaveLength(1)
    const m = measureProbe(result.probes[0])
    expect(m.ratio).toBeGreaterThan(12)
  })

  it('measures a flat box laid over the rules as the ground', async () => {
    const { result } = await probe(
      `<section style="position:relative;background:#2c2260;padding:40px">${RULES}<p style="position:relative;background:#2c2260;margin:0;padding:8px"><span class="label" style="color:#fff;font-size:14px">Buildable before the first line of code.</span></p></section>`
    )
    const labels = result.probes.filter((p) => p.text.startsWith('Buildable'))
    expect(labels).toHaveLength(1)
    expect(measureProbe(labels[0]).ratio).toBeGreaterThan(12)
  })

  it('probes large text too, and holds it to 3:1', async () => {
    const { result } = await probe(
      `<section style="position:relative;background:#2c2260;padding:40px">${RULES}<h1 class="label" style="position:relative;color:#fff;font-size:56px;margin:0">Buildable</h1></section>`
    )
    const [p] = result.probes
    expect(p.large).toBe(true)
    expect(measureProbe(p).threshold).toBe(3)
    expect(measureProbe(p).ratio).toBeLessThan(3)
  })

  it('fails a single 1px rule through the glyph band, and reads the line box, not the padding', async () => {
    // 09-28's label: one thin rule through the baseline, a sliver of the box.
    // The padding above and below is rule-free and must not dilute it.
    const { result } = await probe(
      '<section style="position:relative;background:#2c2260">' +
        '<div class="rules" style="position:absolute;inset:0;background:linear-gradient(transparent 46px, #fff 46px, #fff 47px, transparent 47px)"></div>' +
        '<div class="label" style="position:relative;color:#9e8fee;font-size:13px;line-height:1;padding:40px 20px">SHEET 01 · DESIGN INTENT</div></section>'
    )
    const [p] = result.probes
    expect(p.lines).toHaveLength(1)
    expect(p.lines[0].height).toBeLessThan(20)
    const m = measureProbe(p)
    expect(m.under).toBe(1)
    // #9e8fee on white is 2.76:1.
    expect(m.ratio).toBeCloseTo(2.76, 1)
  })

  it('measures outlined text in its stroke colour', async () => {
    const { result } = await probe(
      `<section style="position:relative;background:#2c2260;padding:40px">${RULES}<h1 class="label" style="position:relative;color:transparent;-webkit-text-stroke:2px #fff;font-size:72px;margin:0">BUILDABLE</h1></section>`
    )
    const [p] = result.probes
    expect(p.outlined).toBe(true)
    expect(p.fg).toMatchObject({ r: 255, g: 255, b: 255 })
    expect(measureProbe(p).ratio).toBeLessThan(3)
  })

  it('skips text under aria-hidden, on the element or an ancestor', async () => {
    const { result } = await probe(
      `<section style="position:relative;background:#2c2260;padding:40px">${RULES}<div aria-hidden="true"><span class="label" style="position:relative;color:#fff;font-size:12px">texture</span></div></section>`
    )
    expect(result).toEqual({ probes: [], probed: [] })
  })

  it('leaves text on a flat ground to the CSS walk', async () => {
    const { result } = await probe(
      '<p class="label" style="background:#fff;color:#777;font-size:14px">Plain</p>'
    )
    expect(result).toEqual({ probes: [], probed: [] })
  })
})
