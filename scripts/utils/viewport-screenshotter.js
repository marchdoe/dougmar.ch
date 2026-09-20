import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Widest a stored viewport capture stays. The desktop rung is rendered at 1440
 * and the same picture is already archived at full size as `screenshot.png`;
 * this copy is for a thumbnail and a phone-width rating image, so anything
 * wider than the laptop rung is scaled down. Narrower captures are untouched.
 */
export const VIEWPORT_IMAGE_MAX_WIDTH = 1024

const VIEWPORT_WEBP_QUALITY = 0.8

/**
 * Re-encode a PNG screenshot as WebP with the browser's own canvas, so no
 * image library is needed (the critic JPEGs in snapshot.js do the same). On a
 * night when the encoder is unavailable the browser hands back a PNG, and the
 * caller is told so rather than being given a PNG named `.webp`.
 *
 * @param {import('@playwright/test').Page} page - any open page; it only hosts the canvas
 * @param {Buffer} png
 * @returns {Promise<{ bytes: Buffer, ext: 'webp'|'png' }>}
 */
async function encodeViewportImage(page, png) {
  const dataUrl = await page.evaluate(
    async ({ base64, maxWidth, quality }) => {
      const img = new Image()
      img.src = `data:image/png;base64,${base64}`
      await img.decode()
      const scale = Math.min(1, maxWidth / img.naturalWidth)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/webp', quality)
    },
    {
      base64: png.toString('base64'),
      maxWidth: VIEWPORT_IMAGE_MAX_WIDTH,
      quality: VIEWPORT_WEBP_QUALITY,
    }
  )
  if (!dataUrl.startsWith('data:image/webp')) return { bytes: png, ext: 'png' }
  return { bytes: Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64'), ext: 'webp' }
}

/**
 * Screenshot a URL at multiple viewports, one WebP per viewport (#549).
 * Single browser, one page, resize between viewports. Files are named
 * `<name>.webp`; anything already archived as `<name>.png` predates that and
 * is read as it always was.
 *
 * @param {string} url
 * @param {Array<{name: string, width: number, height: number}>} viewports
 * @param {string} outDir - absolute path; must exist
 * @param {object} [opts]
 * @param {import('@playwright/test').Browser} [opts.browser]
 * @returns {Promise<Array<{name, width, height, path}>>}
 */
export async function screenshotViewports(url, viewports, outDir, opts = {}) {
  const ownBrowser = !opts.browser
  const browser = opts.browser || (await chromium.launch({ headless: true }))

  try {
    const page = await browser.newPage()
    const encoder = await browser.newPage()
    const results = []
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(url, { waitUntil: 'load', timeout: 30000 })
      await page.waitForTimeout(500)
      const png = await page.screenshot({ type: 'png', fullPage: false })
      const { bytes, ext } = await encodeViewportImage(encoder, png)
      const outPath = path.join(outDir, `${vp.name}.${ext}`)
      await writeFile(outPath, bytes)
      results.push({ name: vp.name, width: vp.width, height: vp.height, path: outPath })
    }
    await encoder.close()
    await page.close()
    return results
  } finally {
    if (ownBrowser) await browser.close()
  }
}
