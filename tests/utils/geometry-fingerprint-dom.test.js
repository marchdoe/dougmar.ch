/**
 * The DOM half of the geometry fingerprint, against real Chromium.
 *
 * Every other test in geometry-fingerprint.test.js hands the pure functions a
 * fingerprint that was typed in by hand, so nothing exercises the in-page
 * walk that produces one (#321) — the same gap #307 found in the surface
 * gate's `worstCopy` extraction. This builds a page with a known hero, two
 * navs, the brand mark and four candidate sections, and asserts the
 * `elements` payload `collectGeometry` reads back out of it.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import {
  FINGERPRINT_VERSION,
  FINGERPRINT_VIEWPORT,
  collectGeometry,
} from '../../scripts/utils/geometry-fingerprint.js'

// Mirrors the rounding collectGeometry applies to every box (round to 4
// decimal places), so the expected numbers below match what it returns
// rather than the raw pixel fractions.
const round = (n) => Math.round(n * 10000) / 10000
const frac = (px, dim) => round(px / dim)

const FIXTURE = `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; border: 0; }
  body { width: 1440px; }
</style>
</head>
<body>
  <header style="position: relative; width: 1440px; height: 100px;">
    <svg viewBox="0 0 71 59" style="position: absolute; left: 24px; top: 26px; width: 57.6px; height: 47.2px;"></svg>
    <nav style="position: absolute; left: 924px; top: 20px; width: 420px; height: 60px;"><a href="#work">Work</a></nav>
  </header>
  <h1 style="margin-left: 96px; width: 600px; height: 120px; font-size: 16px;">Hero phrase</h1>
  <main style="width: 1440px;">
    <div style="width: 60px; height: 60px;">too small to be a section</div>
    <div style="display: none; width: 300px; height: 300px;">hidden, never a section</div>
    <div style="width: 1440px; height: 200px;">first section</div>
    <div style="margin-left: 100px; width: 800px; height: 200px;">second section</div>
    <div style="margin-left: 50px; width: 900px; height: 200px;">third section</div>
    <div style="margin-left: 200px; width: 500px; height: 200px;">fourth section, past the cap</div>
  </main>
  <nav style="width: 200px; height: 40px;"><a href="#contact">Contact</a></nav>
</body>
</html>`

describe('collectGeometry', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  it('reads the hero, both navs, the mark and the first three sections, in order', async () => {
    const page = await browser.newPage({ viewport: { ...FINGERPRINT_VIEWPORT } })
    try {
      await page.setContent(FIXTURE)
      const result = await page.evaluate(collectGeometry)

      expect(result.version).toBe(FINGERPRINT_VERSION)
      expect(result.viewport).toEqual(FINGERPRINT_VIEWPORT)

      // Count and order: hero, then both navs in DOM order, then the mark,
      // then the first three sections — the fourth is past collectGeometry's
      // three-section cap and must not appear.
      expect(result.elements.map((e) => e.class)).toEqual([
        'hero',
        'nav',
        'nav',
        'mark',
        'section',
        'section',
        'section',
      ])

      expect(result.elements).toEqual([
        {
          class: 'hero',
          x: frac(96, 1440),
          y: frac(100, 900),
          w: frac(600, 1440),
          h: frac(120, 900),
        },
        {
          class: 'nav',
          x: frac(924, 1440),
          y: frac(20, 900),
          w: frac(420, 1440),
          h: frac(60, 900),
        },
        {
          class: 'nav',
          // The footer nav sits below main, off the bottom of the 900px
          // viewport — a normal position for a below-the-fold element, and
          // exactly why the fields are fractions of viewport, not clamped.
          x: frac(0, 1440),
          y: frac(1080, 900),
          w: frac(200, 1440),
          h: frac(40, 900),
        },
        {
          class: 'mark',
          x: frac(24, 1440),
          y: frac(26, 900),
          w: frac(57.6, 1440),
          h: frac(47.2, 900),
        },
        {
          class: 'section',
          x: frac(0, 1440),
          y: frac(280, 900),
          w: frac(1440, 1440),
          h: frac(200, 900),
        },
        {
          class: 'section',
          x: frac(100, 1440),
          y: frac(480, 900),
          w: frac(800, 1440),
          h: frac(200, 900),
        },
        {
          class: 'section',
          x: frac(50, 1440),
          y: frac(680, 900),
          w: frac(900, 1440),
          h: frac(200, 900),
        },
      ])
    } finally {
      await page.close()
    }
  })

  it('drops a hidden section and one too small to count, without leaving a gap', async () => {
    const page = await browser.newPage({ viewport: { ...FINGERPRINT_VIEWPORT } })
    try {
      await page.setContent(FIXTURE)
      const { elements } = await page.evaluate(collectGeometry)
      const sections = elements.filter((e) => e.class === 'section')
      // Neither the 60x60 div nor the display:none one made it in, and the
      // fourth real section was cut by the three-section cap rather than by
      // either of them being counted in its place.
      expect(sections).toHaveLength(3)
      expect(sections.map((s) => s.h)).toEqual([frac(200, 900), frac(200, 900), frac(200, 900)])
    } finally {
      await page.close()
    }
  })

  it("reads the same silhouette with the site's rail above it, and puts the rail back (#702)", async () => {
    // The rail carries a nav and a lone child of body would be a wrapper, so
    // left in, it would add a box and push every other one down 44px.
    const rail =
      '<div data-live-frame="2026-10-07" style="height: 44px;"><nav><a href="/archive">Archive</a></nav></div>'
    const page = await browser.newPage({ viewport: { ...FINGERPRINT_VIEWPORT } })
    try {
      await page.setContent(FIXTURE)
      const without = await page.evaluate(collectGeometry)
      await page.setContent(FIXTURE.replace('<body>', `<body>${rail}`))
      expect(await page.evaluate(collectGeometry)).toEqual(without)
      const shown = await page.evaluate(
        () => getComputedStyle(document.querySelector('[data-live-frame]')).display
      )
      expect(shown).toBe('block')
    } finally {
      await page.close()
    }
  })
})
