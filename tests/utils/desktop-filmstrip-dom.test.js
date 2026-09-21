/**
 * captureDesktopFilmstrip against real Chromium (#569).
 *
 * The fold arithmetic is `computePhoneFilmstripFolds`, covered in
 * snapshot.test.js. This proves the capture, the two-across composition and
 * the critic downscale produce one image out of a page taller than a fold,
 * and that the phone filmstrip, which shares the composer, still lays its
 * folds in one row.
 */
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { captureDesktopFilmstrip, capturePhoneFilmstrip } from '../../scripts/utils/snapshot.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES = path.join(__dirname, '../fixtures/responsive')
const fixtureUrl = (name) => `file://${path.join(FIXTURES, name)}`

describe('captureDesktopFilmstrip', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  }, 30_000)
  afterAll(async () => {
    await browser?.close()
  })

  async function dimensionsOf(jpegBuffer) {
    const page = await browser.newPage()
    try {
      return await page.evaluate(async (base64) => {
        const img = new Image()
        img.src = `data:image/jpeg;base64,${base64}`
        await img.decode()
        return { width: img.naturalWidth, height: img.naturalHeight }
      }, jpegBuffer.toString('base64'))
    } finally {
      await page.close()
    }
  }

  it('lays the folds of a page taller than one fold two across, scaled to the critic width', async () => {
    // tall.html is 2000 CSS px: three 900px folds, so two rows of two.
    const jpeg = await captureDesktopFilmstrip(browser, fixtureUrl('tall.html'))
    expect(jpeg).not.toBeNull()
    const { width, height } = await dimensionsOf(jpeg)
    expect(width).toBeLessThanOrEqual(1568)
    expect(width).toBeGreaterThan(1500)
    // Two rows of 900 against a width of two 1440s: about 0.62 tall for wide.
    // One row of three would be about 0.21, and a column of three about 1.9.
    const aspect = height / width
    expect(aspect).toBeGreaterThan(0.5)
    expect(aspect).toBeLessThan(0.75)
  }, 30_000)

  it('is one row of one fold for a page no taller than the viewport', async () => {
    const jpeg = await captureDesktopFilmstrip(browser, fixtureUrl('clean.html'))
    expect(jpeg).not.toBeNull()
    const { width, height } = await dimensionsOf(jpeg)
    expect(width).toBeLessThanOrEqual(1568)
    // A single 1440x900 screen, fitted to 1568 wide: never upscaled.
    expect(width).toBeLessThanOrEqual(1440)
    expect(height / width).toBeCloseTo(900 / 1440, 1)
  }, 30_000)

  it('shows a section that fades in on scroll at rest, not at opacity 0 (reduced motion is on)', async () => {
    // The second fold is a black block that only the no-preference branch hides.
    // A full-page capture never scrolls, so without the preference on it would
    // be white.
    const html =
      '<!doctype html><body style="margin:0;background:#fff"><div style="height:900px"></div>' +
      '<div class="late" style="height:900px;background:#000"></div>' +
      '<style>@media (prefers-reduced-motion: no-preference){.late{opacity:0}}</style>'
    const page = await browser.newPage()
    let jpeg
    let server
    try {
      server = createServer((_req, res) => {
        res.setHeader('content-type', 'text/html')
        res.end(html)
      })
      await new Promise((resolve) => server.listen(0, resolve))
      jpeg = await captureDesktopFilmstrip(browser, `http://localhost:${server.address().port}/`)
      expect(jpeg).not.toBeNull()
      // The second fold sits in the right-hand tile, below its label bar.
      const luma = await page.evaluate(async (base64) => {
        const img = new Image()
        img.src = `data:image/jpeg;base64,${base64}`
        await img.decode()
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const [r, g, b] = ctx.getImageData(
          Math.round(img.naturalWidth * 0.75),
          Math.round(img.naturalHeight * 0.6),
          1,
          1
        ).data
        return (r + g + b) / 3
      }, jpeg.toString('base64'))
      expect(luma).toBeLessThan(60)
    } finally {
      server?.close()
      await page.close()
    }
  }, 30_000)

  it('returns null rather than throwing when the capture fails', async () => {
    expect(await captureDesktopFilmstrip(browser, 'file:///does/not/exist.html')).toBeNull()
  }, 30_000)

  it('leaves the phone filmstrip a single row of folds', async () => {
    const jpeg = await capturePhoneFilmstrip(browser, fixtureUrl('tall.html'))
    const { width, height } = await dimensionsOf(jpeg)
    expect(width).toBeGreaterThan(height * 2)
  }, 30_000)
})
