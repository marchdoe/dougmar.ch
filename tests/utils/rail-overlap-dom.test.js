/**
 * The rail-overlap probe against real Chromium (#702). It is rebuilt in the
 * page from source through `runPageKit`, like the shell-overlap probe, so
 * this proves it runs there and draws the line the spec draws: a fixed bar on the rail at scroll 0 is
 * a fault, a sticky one is not.
 */
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { measureRailOverlap } from '../../scripts/utils/shell-overlap.js'

/** The rail as `LiveRail` renders it: 44px, in flow, first in the body, no nested div. */
const RAIL =
  '<div data-live-frame="2026-10-07" style="height:44px;background:#111;color:#eee">' +
  '<span>Archive</span> <a href="/how/2026-10-07">How it was made</a></div>'

const PAGE = '<main><h1 style="margin:0">Hero</h1><p style="height:2000px">Body</p></main>'

/** A top bar, 72px tall, at the top of the viewport, pinned however `position` says. */
const bar = (position, extra = '') =>
  `<header style="position:${position};top:0;left:0;right:0;height:72px;background:#fff;${extra}">` +
  'Doug March</header>'

describe('measureRailOverlap', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  async function probe(body) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.setContent(`<!doctype html><html><body style="margin:0">${body}</body></html>`)
      return await measureRailOverlap(page)
    } finally {
      await page.close()
    }
  }

  it('reports a fixed header pinned at top 0', async () => {
    const hits = await probe(RAIL + bar('fixed') + PAGE)
    expect(hits).toHaveLength(1)
    expect(hits[0]).toMatchObject({ text: 'Doug March', top: 0, height: 72, overlapPx: 44 })
    expect(hits[0].selector).toBe('header')
  })

  it('leaves a sticky header at top 0 alone: it sits in flow below the rail', async () => {
    expect(await probe(RAIL + bar('sticky') + PAGE)).toEqual([])
  })

  it('leaves a fixed bottom bar alone', async () => {
    const bottom =
      '<nav style="position:fixed;bottom:0;left:0;right:0;height:56px;background:#fff">Menu</nav>'
    expect(await probe(RAIL + bottom + PAGE)).toEqual([])
  })

  it('reports nothing on a page with no rail', async () => {
    expect(await probe(bar('fixed') + PAGE)).toEqual([])
  })

  it("skips the rail's own descendants, hidden bars and a texture parked behind the page", async () => {
    const own = RAIL.replace(
      '</div>',
      '<span style="position:fixed;top:0;left:0;width:10px;height:10px"></span></div>'
    )
    expect(await probe(own + PAGE)).toEqual([])
    expect(await probe(RAIL + bar('fixed', 'visibility:hidden') + PAGE)).toEqual([])
    expect(await probe(RAIL + bar('fixed', 'opacity:0') + PAGE)).toEqual([])
    expect(await probe(RAIL + bar('fixed', 'bottom:0;height:auto;z-index:-1') + PAGE)).toEqual([])
  })

  it('reports a fixed bar once, at the outer element', async () => {
    const nested = bar('fixed').replace(
      'Doug March',
      '<button style="position:fixed;top:8px;right:8px;width:44px;height:28px">Menu</button>Doug March'
    )
    const hits = await probe(RAIL + nested + PAGE)
    expect(hits.map((h) => h.selector)).toEqual(['header'])
  })
})
