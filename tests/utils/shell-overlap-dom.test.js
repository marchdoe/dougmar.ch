/**
 * The shell-overlap probe against real Chromium (#640). It is rebuilt in the
 * page from source through `runPageKit`, like the render-health probes, so
 * this proves it runs there and draws the line between the route and the
 * shell where the e2e spec drew it: `[data-page]`.
 */
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { measureShellOverlap } from '../../scripts/utils/shell-overlap.js'

const PAGE =
  '<main data-page="elements" style="padding:40px 0 0 40px">' +
  '<h1 style="font:700 48px/1 sans-serif;margin:0">ELEMENTS</h1>' +
  '<p style="font:16px/1.5 sans-serif">The building blocks of this site.</p></main>'

/** A shell line drawn at the top left, where the heading is, with its own style. */
const shellAt = (style, text = 'Doug March') =>
  `<div style="position:absolute;top:44px;left:44px;font:700 32px/1 sans-serif;${style}">${text}</div>`

describe('findTextUnderShell', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  async function probe(body, arrange, arg) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.setContent(`<!doctype html><html><body style="margin:0">${body}</body></html>`)
      if (arrange) await page.evaluate(arrange, arg)
      return await measureShellOverlap(page)
    } finally {
      await page.close()
    }
  }

  it("names the shell's line and the route's line it sits on", async () => {
    const hits = await probe(shellAt('') + PAGE)
    expect(hits).toHaveLength(1)
    expect(hits[0]).toMatchObject({ text: 'Doug March', opacity: 1, lines: ['ELEMENTS'] })
  })

  it('counts a ghosted texture at opacity 0.08', async () => {
    const hits = await probe(shellAt('opacity:0.08', 'JAMES −24') + PAGE)
    expect(hits.map((h) => [h.text, h.opacity])).toEqual([['JAMES −24', 0.08]])
  })

  it('counts ink alpha the same as opacity, and skips a line too faint to read', async () => {
    expect(await probe(shellAt('color:rgba(0,0,0,0.08)') + PAGE)).toHaveLength(1)
    expect(await probe(shellAt('opacity:0.5;color:rgba(0,0,0,0.06)') + PAGE)).toEqual([])
    expect(await probe(shellAt('opacity:0.02') + PAGE)).toEqual([])
    expect(await probe(shellAt('visibility:hidden') + PAGE)).toEqual([])
  })

  it("leaves a route's own layering alone", async () => {
    const layered = PAGE.replace('</main>', `${shellAt('opacity:0.2', 'GHOST')}</main>`)
    expect(await probe(layered)).toEqual([])
  })

  it('reports nothing on a page with no [data-page], which is every route the engineer writes', async () => {
    expect(await probe(shellAt('') + PAGE.replace(' data-page="elements"', ''))).toEqual([])
  })

  it('measures a texture where its clipping box leaves it', async () => {
    const cropped =
      '<div style="position:absolute;top:0;left:0;width:30px;height:30px;overflow:hidden">' +
      '<div style="position:absolute;top:44px;left:44px;font:700 32px/1 sans-serif">Doug March</div></div>'
    expect(await probe(cropped + PAGE)).toEqual([])
  })

  it('ignores a shell line that only grazes the route text', async () => {
    // The shell's glyph box starts `share` of the heading's height above its bottom.
    const graze = (share) => {
      const range = document.createRange()
      range.selectNodeContents(document.querySelector('h1').firstChild)
      const heading = range.getBoundingClientRect()
      const shell = document.querySelector('#shell')
      shell.style.top = '0px'
      range.selectNodeContents(shell.firstChild)
      const offset = range.getBoundingClientRect().top
      shell.style.top = `${heading.bottom - heading.height * share - offset}px`
    }
    const heading = PAGE.replace(/<p .*<\/p>/, '')
    const body = `<div id="shell" style="position:absolute;left:44px;font:700 32px/1 sans-serif">Doug March</div>${heading}`
    expect(await probe(body, graze, 0.02)).toEqual([])
    expect(await probe(body, graze, 0.3)).toHaveLength(1)
  })
})
