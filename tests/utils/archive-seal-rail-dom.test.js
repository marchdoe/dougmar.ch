/**
 * The archive rail in real Chromium (#562).
 *
 * The unit tests over buildFrame read bytes. What broke on phones was layout:
 * "How it was made" ran off the right edge of the rail on phones,
 * and the controls were 22 to 26px tall in a 44px rail. Only a browser shows
 * either, so this seals a small page with sealPage and measures the result.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { sealPage } from '../../scripts/utils/archive-seal.js'
import { TAP_TARGET_MIN_PX } from '../../scripts/utils/responsive-thresholds.js'

const PAGE = `<!doctype html><html><head><style>body{margin:0;font:16px serif}</style></head>
<body><h1>A design</h1><p>Some page copy.</p></body></html>`

// A date with a long month and a two-digit day, and both arrows live, is the
// widest the rail gets. September is the longest month name here.
const SEALED = sealPage(PAGE, {
  date: '2026-09-19',
  relPath: 'index.html',
  prev: '2026-09-18',
  next: '2026-09-20',
})

async function measureRail(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 800 } })
  try {
    await page.setContent(SEALED)
    return await page.evaluate(() => {
      const frame = document.querySelector('[data-archive-frame]')
      const visible = (el) => getComputedStyle(el).display !== 'none'
      const controls = [...frame.querySelectorAll('a, .af-off')].map((el) => {
        const r = el.getBoundingClientRect()
        return {
          name: el.getAttribute('aria-label') || el.textContent.trim(),
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
          w: r.width,
          h: r.height,
        }
      })
      const shown = (sel) => [...frame.querySelectorAll(sel)].filter(visible).length
      return {
        viewport: window.innerWidth,
        pageScrollWidth: document.documentElement.scrollWidth,
        railHeight: frame.getBoundingClientRect().height,
        railScrollWidth: frame.scrollWidth,
        railClientWidth: frame.clientWidth,
        controls,
        longShown: shown('.af-long'),
        shortShown: shown('.af-short'),
      }
    })
  } finally {
    await page.close()
  }
}

describe('the archive rail in a browser', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  }, 60_000)
  afterAll(async () => {
    await browser?.close()
  })

  for (const width of [320, 360, 390, 419, 480, 640]) {
    it(`fits ${width}px with no control clipped and no width added to the page`, async () => {
      const m = await measureRail(browser, width)
      expect(m.pageScrollWidth).toBe(width)
      expect(m.railScrollWidth).toBeLessThanOrEqual(m.railClientWidth)
      for (const c of m.controls) {
        expect(c.left, c.name).toBeGreaterThanOrEqual(0)
        expect(c.right, c.name).toBeLessThanOrEqual(width + 0.5)
      }
    })
  }

  for (const width of [320, 390, 640]) {
    it(`gives every control a ${TAP_TARGET_MIN_PX}px target that fills the rail at ${width}px`, async () => {
      const m = await measureRail(browser, width)
      expect(m.railHeight).toBe(44)
      expect(m.controls).toHaveLength(4)
      for (const c of m.controls) {
        expect(c.w, c.name).toBeGreaterThanOrEqual(TAP_TARGET_MIN_PX)
        expect(c.h, c.name).toBeGreaterThanOrEqual(TAP_TARGET_MIN_PX)
        expect(c.top, c.name).toBeCloseTo(0, 0)
        expect(c.bottom, c.name).toBeCloseTo(44, 0)
      }
    })
  }

  it('shortens the date and the explainer link under 480px and no wider', async () => {
    const narrow = await measureRail(browser, 479)
    expect(narrow.shortShown).toBe(2)
    expect(narrow.longShown).toBe(0)
    const wide = await measureRail(browser, 480)
    expect(wide.shortShown).toBe(0)
    expect(wide.longShown).toBe(2)
  })

  it('leaves the desktop rail as it was: long forms, controls smaller than the rail', async () => {
    const m = await measureRail(browser, 1440)
    expect(m.pageScrollWidth).toBe(1440)
    expect(m.railHeight).toBe(44)
    expect(m.longShown).toBe(2)
    expect(m.shortShown).toBe(0)
    const how = m.controls.find((c) => c.name === 'How it was made')
    expect(how.h).toBeLessThan(TAP_TARGET_MIN_PX)
  })
})
