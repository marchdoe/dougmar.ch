/**
 * The motion strip against real Chromium (#790).
 *
 * A frame has to be the entrance at its offset, however long the screenshot
 * took. The strip used to race the wall clock, and each screenshot took long
 * enough that the "0ms" frame was already most of the way through.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { captureMotionFrames, seekClockAnimations } from '../../scripts/utils/snapshot.js'

const PAGE = `<!doctype html><style>
@keyframes rise { from { opacity: 0 } to { opacity: 1 } }
h1 { animation: rise 500ms linear both }
p { animation: rise 500ms linear 240ms both }
aside { height: 2000px; animation: rise linear both; animation-timeline: view() }
</style><h1>hero</h1><p>deck</p><aside>below</aside>`
const pageUrl = `data:text/html,${encodeURIComponent(PAGE)}`

const opacity = (page, selector) =>
  page.evaluate((s) => Number(getComputedStyle(document.querySelector(s)).opacity), selector)

describe('the motion strip reads the entrance clock (#790)', () => {
  let browser
  let page
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  }, 30_000)
  afterAll(async () => {
    await browser?.close()
  })

  async function loaded() {
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.goto(pageUrl, { waitUntil: 'load' })
    return page
  }

  it('shows the hero not yet arrived at 0, however late the seek lands', async () => {
    await loaded()
    await page.waitForTimeout(800) // the entrance has long finished
    await page.evaluate(seekClockAnimations, 0)
    expect(await opacity(page, 'h1')).toBe(0)
    expect(await opacity(page, 'p')).toBe(0)
    await page.close()
  })

  it('puts each element where its own delay says it is', async () => {
    await loaded()
    await page.evaluate(seekClockAnimations, 250)
    expect(await opacity(page, 'h1')).toBeCloseTo(0.5, 2)
    expect(await opacity(page, 'p')).toBeCloseTo(0.02, 2)
    await page.evaluate(seekClockAnimations, 1000)
    expect(await opacity(page, 'h1')).toBe(1)
    expect(await opacity(page, 'p')).toBe(1)
    await page.close()
  })

  it('leaves a scroll-driven reveal on its own timeline', async () => {
    await loaded()
    await page.evaluate(seekClockAnimations, 0)
    const asidePlayState = await page.evaluate(
      () => document.querySelector('aside').getAnimations()[0].playState
    )
    expect(asidePlayState).toBe('running')
    await page.close()
  })

  it('holds the page at the last offset instead of letting it play out', async () => {
    await loaded()
    const jpeg = await captureMotionFrames(page, pageUrl)
    expect(Buffer.isBuffer(jpeg)).toBe(true)
    const states = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.timeline === document.timeline)
        .map((a) => [a.playState, a.currentTime])
    )
    expect(states).toEqual([
      ['paused', 1000],
      ['paused', 1000],
    ])
    await page.close()
  }, 30_000)
})
