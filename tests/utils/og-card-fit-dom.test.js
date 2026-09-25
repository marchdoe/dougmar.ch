/**
 * The share card probe against real Chromium. Each page stands at the
 * capture's 1200x630 and is built the way the prompt asks the engineer to
 * build og.tsx: a fixed layer over the site's shell, holding one 1200x630
 * card. The two failures it exists for are rebuilt here from the nights that
 * shipped them: 2026-09-23's headline anchored to the bottom and running out
 * of the card, and 2026-09-25's card, 1392px wide once its padding was added,
 * which put the brand mark past the left edge.
 */
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  measureOgCard,
  OG_CARD_VIEWPORT,
  OG_SAFE_MARGIN_PX,
  ogFitFindings,
} from '../../scripts/utils/og-card-fit.js'

const MARK =
  '<svg data-brand-mark="" data-brand-mode="single-color" viewBox="0 0 71 59" ' +
  'style="display:block;width:58px;height:48px"><circle cx="30" cy="30" r="28" fill="currentColor"/></svg>'

const lockupAt = (style) =>
  `<div style="position:absolute;${style}"><span style="display:inline-flex;gap:12px;font:600 28px/1 sans-serif">` +
  `${MARK}<span style="display:flex;flex-direction:column"><span>Doug March</span></span></span></div>`

/** The shell under the card: a page of text the fixed layer covers. */
const SHELL =
  '<header style="padding:0;margin:0"><p style="margin:0;font:16px sans-serif">Doug March, shell nav</p></header>' +
  '<main><h1 style="margin:0;font:64px sans-serif">The home page hero</h1></main>'

/** The card, inside the fixed layer the prompt asks for. */
const card = (inner, cardStyle = '') =>
  `${SHELL}<div style="position:fixed;inset:0;z-index:9999;background:#fff;display:flex;` +
  'align-items:center;justify-content:center;overflow:hidden">' +
  `<div data-card style="position:relative;width:1200px;height:630px;flex-shrink:0;overflow:hidden;${cardStyle}">` +
  `${inner}</div></div>`

const HEADLINE = 'font:700 96px/1.1 sans-serif;margin:0'

describe('measureOgCard', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  async function probe(body) {
    const { width, height } = OG_CARD_VIEWPORT
    const page = await browser.newPage({ viewport: { width, height } })
    try {
      await page.setContent(`<!doctype html><html><body style="margin:0">${body}</body></html>`)
      return await measureOgCard(page)
    } finally {
      await page.close()
    }
  }

  const details = (faults) => ogFitFindings({ ogFit: faults }).map((f) => f.detail)

  it('passes a clean card, and ignores the shell the card covers', async () => {
    const clean = card(
      lockupAt('top:56px;left:64px') +
        `<h1 style="position:absolute;top:220px;left:64px;${HEADLINE}">Deep in both.<br>Not a generalist.</h1>` +
        '<p style="position:absolute;bottom:56px;left:64px;margin:0;font:20px/1 sans-serif">Doug March</p>'
    )
    expect(await probe(clean)).toEqual([])
  })

  it('names the headline line that runs past the bottom edge, and by how much', async () => {
    // 2026-09-23: anchored to the bottom, the second line past 630px.
    const bottom = card(
      lockupAt('top:56px;left:64px') +
        `<h1 style="position:absolute;top:470px;left:64px;${HEADLINE}">Deep in both.<br>Not a generalist.</h1>`
    )
    const faults = await probe(bottom)
    expect(faults[0]).toMatchObject({
      name: 'headline',
      line: 2,
      text: 'Not a generalist.',
      fault: 'card',
      edge: 'bottom',
    })
    expect(faults[0].px).toBeGreaterThan(40)
    expect(details(faults)[0]).toMatch(
      /^og: headline line 2 'Not a generalist\.' ends \d+px below the card's bottom edge\./
    )
  })

  it('finds the brand mark cut at the left edge', async () => {
    // 2026-09-25: width 1200px plus 96px of inline padding each side, centred
    // in the viewport, so the card started at -96px and the lockup at -40px.
    const wide = card(
      lockupAt('top:48px;left:56px') +
        `<h1 style="${HEADLINE};font-size:64px;margin-top:200px">People rarely succeed</h1>`,
      'padding:0 96px;box-sizing:content-box'
    )
    const faults = await probe(wide)
    const mark = faults.find((f) => f.name === 'brand mark')
    expect(mark).toMatchObject({ fault: 'card', edge: 'left', px: 40 })
    expect(details([mark])[0]).toMatch(/^og: brand mark starts 40px left of the card's left edge\./)
    expect(faults.find((f) => f.name === 'wordmark')).toMatchObject({
      fault: 'margin',
      edge: 'left',
    })
  })

  it("counts text cut by an ancestor's overflow as outside, inside the card", async () => {
    const clipped = card(
      '<div style="position:absolute;top:200px;left:100px;width:1000px;height:110px;overflow:hidden">' +
        `<h1 style="${HEADLINE}">Deep in both.<br>Not a generalist.</h1></div>`
    )
    const faults = await probe(clipped)
    expect(faults).toHaveLength(1)
    expect(faults[0]).toMatchObject({
      name: 'headline',
      line: 2,
      fault: 'clip',
      edge: 'bottom',
      overflow: 'hidden',
    })
    expect(details(faults)[0]).toMatch(
      /is cut \d+px at its bottom edge by <.*div> \(overflow: hidden\)/
    )
  })

  it('flags a line inside the card but inside the safe margin', async () => {
    const tight = card(
      `<p style="position:absolute;top:${OG_SAFE_MARGIN_PX - 20}px;left:100px;margin:0;font:20px/1 sans-serif">Doug March</p>`
    )
    const faults = await probe(tight)
    expect(faults).toEqual([
      expect.objectContaining({ name: '<p>', line: 1, fault: 'margin', edge: 'top' }),
    ])
    expect(details(faults)[0]).toMatch(
      new RegExp(
        `starts \\d+px from the card's top edge, inside the ${OG_SAFE_MARGIN_PX}px safe margin`
      )
    )
  })

  it('exempts faint aria-hidden texture type, and nothing short of both', async () => {
    // Like 2026-09-25's "fun" at opacity 0.055, set bigger than the card on purpose.
    const texture = (attrs, style) =>
      card(
        `<span ${attrs} style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);` +
          `font:700 900px/1 serif;white-space:nowrap;${style}">fun</span>`
      )
    expect(await probe(texture('aria-hidden="true"', 'opacity:0.055'))).toEqual([])
    expect(await probe(texture('aria-hidden="true"', 'color:rgba(0,0,0,0.1)'))).toEqual([])
    // Faint but content: measured.
    expect(await probe(texture('', 'opacity:0.055'))).not.toEqual([])
    // Hidden from readers but solid on the card: measured.
    expect(await probe(texture('aria-hidden="true"', 'opacity:0.6'))).not.toEqual([])
  })

  it('leaves visually-hidden text alone', async () => {
    const srOnly = card(
      '<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);' +
        'white-space:nowrap">Share card for Doug March</span>'
    )
    expect(await probe(srOnly)).toEqual([])
  })
})
