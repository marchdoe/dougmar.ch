/**
 * The motion keyframes and the reduced-motion rule against real Chromium
 * (#506).
 *
 * chassis.test.js proves the preset file names them; this proves they do
 * what the engineer prompt says they do: a `rise` element starts invisible
 * and reaches full opacity by 600ms, and with reduced motion emulated it is
 * at full opacity immediately. The CSS is rendered from the same objects
 * `renderChassisPresetFile` emits, so the two cannot drift.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { MOTION_KEYFRAMES, REDUCED_MOTION_RULE } from '../../scripts/utils/chassis.js'

const kebab = (prop) => prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
const decls = (obj) =>
  Object.entries(obj)
    .map(([prop, v]) => `${kebab(prop)}: ${v};`)
    .join(' ')

/** The keyframes and the reduced-motion rule as plain CSS, from the preset's own objects. */
function motionCss() {
  const keyframes = Object.entries(MOTION_KEYFRAMES)
    .map(
      ([name, stops]) =>
        `@keyframes ${name} { ${Object.entries(stops)
          .map(([stop, d]) => `${stop} { ${decls(d)} }`)
          .join(' ')} }`
    )
    .join('\n')
  const reduced = Object.entries(REDUCED_MOTION_RULE)
    .map(
      ([atRule, inner]) =>
        `${atRule} { ${Object.entries(inner)
          .map(([sel, d]) => `${sel} { ${decls(d)} }`)
          .join(' ')} }`
    )
    .join('\n')
  return `${keyframes}\n${reduced}`
}

const PAGE = `<!doctype html><html><head><style>
${motionCss()}
.hero { animation: rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.deck { animation: rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 240ms; }
</style></head><body><h1 class="hero">FOURTEEN HOURS OF LIGHT</h1><p class="deck">And the deck, last in the stagger.</p></body></html>`

const opacityOf = (page, selector = '.hero') =>
  page.evaluate((sel) => Number(getComputedStyle(document.querySelector(sel)).opacity), selector)

/** One rendered frame: the earliest a CSS animation can have advanced at all. */
const nextFrame = (page) =>
  page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))

describe('the rise keyframe in a browser', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  }, 30_000)
  afterAll(async () => {
    await browser?.close()
  })

  it('starts the element invisible and settles it by 600ms', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.setContent(PAGE)
      expect(await opacityOf(page)).toBeLessThan(1)
      await nextFrame(page)
      expect(await opacityOf(page)).toBeLessThan(1)
      await page.waitForTimeout(600)
      expect(await opacityOf(page)).toBe(1)
    } finally {
      await page.close()
    }
  }, 30_000)

  it('is at full opacity immediately when reduced motion is requested', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setContent(PAGE)
      // The 0.01ms rule still needs one frame to run; after it the element
      // is at its end state, with none of the 500ms lift.
      await nextFrame(page)
      expect(await opacityOf(page)).toBe(1)
      // The staggered sibling too: its 240ms delay is zeroed by the same
      // rule, so it does not sit invisible while the page is "fully formed".
      expect(await opacityOf(page, '.deck')).toBe(1)
    } finally {
      await page.close()
    }
  }, 30_000)

  it('holds a staggered sibling invisible through its delay when motion is allowed', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.setContent(PAGE)
      await nextFrame(page)
      expect(await opacityOf(page, '.deck')).toBe(0)
      await page.waitForTimeout(900)
      expect(await opacityOf(page, '.deck')).toBe(1)
    } finally {
      await page.close()
    }
  }, 30_000)

  it('emits the four keyframes and the reduced-motion rule the engineer prompt names', () => {
    expect(Object.keys(MOTION_KEYFRAMES)).toEqual(['settle', 'rise', 'wipe', 'drift'])
    const [[atRule, inner]] = Object.entries(REDUCED_MOTION_RULE)
    expect(atRule).toBe('@media (prefers-reduced-motion: reduce)')
    expect(Object.keys(inner)).toEqual(['*, *::before, *::after'])
    expect(inner['*, *::before, *::after'].animationDuration).toBe('0.01ms !important')
    expect(inner['*, *::before, *::after'].animationDelay).toBe('0s !important')
  })
})
