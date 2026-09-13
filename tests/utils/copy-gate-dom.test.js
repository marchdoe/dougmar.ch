/**
 * The in-page half of the copy gate, against real Chromium (#504).
 * `collectVisibleCopy` is serialised into the page with toString(), the
 * same way the clipping check is, so this proves it runs there.
 */
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { collectVisibleCopy } from '../../scripts/utils/copy-gate.js'

describe('collectVisibleCopy', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  it('returns the visible text and the text of allowed elements', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.setContent(
        '<!doctype html><html><body><h1>Select a busy man</h1>' +
          '<p style="display:none">hidden — text</p>' +
          '<blockquote data-allow-copy-tell>Hope — is the thing</blockquote>' +
          '<p>Rebuilt every night</p></body></html>'
      )
      const out = await page.evaluate(
        ([src]) => new Function(`return ${src}`)()(),
        [collectVisibleCopy.toString()]
      )
      expect(out.text).toContain('Select a busy man')
      expect(out.text).toContain('Rebuilt every night')
      expect(out.text).not.toContain('hidden')
      expect(out.allowed).toEqual(['Hope — is the thing'])
    } finally {
      await page.close()
    }
  })
})
