/**
 * capturePhoneFilmstrip against real Chromium (#466).
 *
 * Everything else about the filmstrip (fold arithmetic, the "N more folds
 * not shown" label) is pure and covered in snapshot.test.js without a
 * browser. This proves the capture + composition + critic downscale
 * actually produces one wide image out of a page taller than one fold.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { capturePhoneFilmstrip } from '../../scripts/utils/snapshot.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES = path.join(__dirname, '../fixtures/responsive')
const fixtureUrl = (name) => `file://${path.join(FIXTURES, name)}`

describe('capturePhoneFilmstrip', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  }, 30_000)
  afterAll(async () => {
    await browser?.close()
  })

  /** Decode a JPEG buffer's pixel dimensions using the browser's own
   * <img>.decode(), the same trick downscaleForCritic uses — no image
   * library in the repo to read dimensions with instead. */
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

  it('composes a filmstrip from a page taller than one fold, downscaled for the critic', async () => {
    // tall.html is 2000 CSS px, well past the 640px phone viewport: at least
    // two folds side by side, so a single-fold crop would fail this.
    const jpeg = await capturePhoneFilmstrip(browser, fixtureUrl('tall.html'))
    expect(jpeg).not.toBeNull()
    expect(Buffer.isBuffer(jpeg)).toBe(true)

    const { width, height } = await dimensionsOf(jpeg)
    // Several 360-wide folds laid side by side are much wider than tall —
    // a single 360-wide crop would be roughly as tall as it is wide.
    expect(width).toBeGreaterThan(height)
    // The composed image (several folds plus gutters) is well past the
    // critic's downscale target, so the result is capped there, not left
    // at full device-pixel resolution.
    expect(width).toBeLessThanOrEqual(1568)
    expect(height).toBeGreaterThan(0)
  }, 30_000)

  it('returns null rather than throwing when the capture fails', async () => {
    const jpeg = await capturePhoneFilmstrip(browser, 'file:///does/not/exist.html')
    expect(jpeg).toBeNull()
  }, 30_000)
})
