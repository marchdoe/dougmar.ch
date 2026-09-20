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

/**
 * Waits for the element's animation to finish, then returns when it ended in
 * ms from the start, delay included. The wait is on the browser's own
 * `finished` promise, so a slow machine takes longer instead of sampling early;
 * the returned time is the CSS's own claim about how long the animation takes.
 */
const settledAt = (page, selector = '.hero') =>
  page.evaluate(async (sel) => {
    const [animation] = document.querySelector(sel).getAnimations()
    await animation.finished
    return animation.effect.getComputedTiming().endTime
  }, selector)

describe('the rise keyframe in a browser', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  }, 30_000)
  afterAll(async () => {
    await browser?.close()
  }, 30_000)

  it('starts the element invisible and settles it by 600ms', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.setContent(PAGE)
      expect(await opacityOf(page)).toBeLessThan(1)
      await nextFrame(page)
      expect(await opacityOf(page)).toBeLessThan(1)
      expect(await settledAt(page)).toBeLessThanOrEqual(600)
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
      expect(await settledAt(page, '.deck')).toBeLessThanOrEqual(900)
      expect(await opacityOf(page, '.deck')).toBe(1)
    } finally {
      await page.close()
    }
  }, 30_000)

  /**
   * `reveal: on-scroll` is the case the duration and delay lines never
   * reached. A `view()` timeline reads scroll position, not the clock, so
   * collapsing the duration to 0.01ms leaves a section below the fold sitting
   * at the 0% state of `rise` — invisible — for a visitor who asked for less
   * motion and got a blank page instead. `animation-name: none` is what
   * reaches it.
   */
  const SCROLL_PAGE = `<!doctype html><html><head><style>
${motionCss()}
.spacer { height: 400vh; }
@supports (animation-timeline: view()) {
  .section {
    animation-name: rise;
    animation-timeline: view();
    animation-range: entry 0% entry 40%;
    animation-fill-mode: both;
  }
}
</style></head><body><div class="spacer"></div><section class="section">Below the fold.</section></body></html>`

  it('leaves a scroll-driven reveal below the fold invisible when motion is allowed', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.setContent(SCROLL_PAGE)
      await nextFrame(page)
      // Guard the guard: if this Chromium ignored the timeline the section
      // would already be at 1 and the next test would prove nothing.
      expect(await opacityOf(page, '.section')).toBe(0)
    } finally {
      await page.close()
    }
  }, 30_000)

  it('shows that same reveal immediately when reduced motion is requested', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setContent(SCROLL_PAGE)
      await nextFrame(page)
      // Never scrolled. With no animation there is nothing for fill-mode to
      // apply, so the section shows its own styles, which are its end state.
      expect(await opacityOf(page, '.section')).toBe(1)
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
