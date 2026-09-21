/**
 * captureTabletStill against real Chromium (#565).
 *
 * The critic is sent one still of the home page at the tablet width: the first
 * screen, at TABLET_VIEWPORT, not the whole page and not a downscale of it.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { TABLET_VIEWPORT } from '../../elements/chassis/viewports.js'
import { captureTabletStill } from '../../scripts/utils/snapshot.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES = path.join(__dirname, '../fixtures/responsive')
const fixtureUrl = (name) => `file://${path.join(FIXTURES, name)}`

describe('captureTabletStill', () => {
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

  it('is the first screen of a tall page, at the tablet size and no smaller', async () => {
    // tall.html is 2000 CSS px, past the tablet's 1180: a full-page capture
    // would be taller than the viewport.
    const jpeg = await captureTabletStill(browser, fixtureUrl('tall.html'))
    expect(Buffer.isBuffer(jpeg)).toBe(true)
    expect(await dimensionsOf(jpeg)).toEqual({
      width: TABLET_VIEWPORT.width,
      height: TABLET_VIEWPORT.height,
    })
  }, 30_000)

  it('returns null rather than throwing when the capture fails', async () => {
    expect(await captureTabletStill(browser, 'file:///does/not/exist.html')).toBeNull()
  }, 30_000)
})
