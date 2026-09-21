/**
 * The full-page filmstrips against a page that reveals its sections on scroll
 * (#569 follow-up), in real Chromium.
 *
 * A full-page capture never scrolls, so a section on an `animation-timeline:
 * view()` reveal stays at its 0% keyframe, `opacity: 0`, in every fold below
 * the first. 2026-09-19's case study came out of the phone filmstrip as one
 * lit fold and five white ones. The page here is that shape, built with the
 * chassis preset's own keyframes and reduced-motion rule so the fixture cannot
 * drift from what the nightly ships: five 640px black sections on a white
 * page, each one revealed on a view timeline. Painted means black.
 */
import { createServer } from 'node:http'
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { MOTION_KEYFRAMES, REDUCED_MOTION_RULE } from '../../scripts/utils/chassis.js'
import { captureDesktopFilmstrip, capturePhoneFilmstrip } from '../../scripts/utils/snapshot.js'

const kebab = (prop) => prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
const decls = (obj) =>
  Object.entries(obj)
    .map(([prop, v]) => `${kebab(prop)}: ${v};`)
    .join(' ')

/** The preset's keyframes and its reduced-motion rule as plain CSS. */
function presetCss() {
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

const SECTIONS = 5
const PAGE = `<!doctype html><html><head><style>
${presetCss()}
body { margin: 0; background: #fff; }
section { height: 640px; background: #000; }
@supports (animation-timeline: view()) {
  .reveal { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 40%; }
}
</style></head><body>${Array.from({ length: SECTIONS }, () => '<section class="reveal"></section>').join('')}</body></html>`

let browser
let server
let url
beforeAll(async () => {
  browser = await chromium.launch({ headless: true })
  server = createServer((_req, res) => {
    res.setHeader('content-type', 'text/html')
    res.end(PAGE)
  })
  await new Promise((resolve) => server.listen(0, resolve))
  url = `http://localhost:${server.address().port}/`
}, 30_000)
afterAll(async () => {
  server?.close()
  await browser?.close()
})

/**
 * The luminance at the middle of each of `across` equal slices of an image,
 * read below its label bars: a slice is a tile, give or take a gutter.
 */
async function tileLuma(jpeg, { across, rows = 1 }) {
  const page = await browser.newPage()
  try {
    return await page.evaluate(
      async ({ b64, across, rows }) => {
        const img = new Image()
        img.src = `data:image/jpeg;base64,${b64}`
        await img.decode()
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0)
        const out = []
        for (let i = 0; i < across * rows; i++) {
          const col = i % across
          const row = Math.floor(i / across)
          const x = Math.round(((col + 0.5) * img.naturalWidth) / across)
          const y = Math.round(((row + 0.75) * img.naturalHeight) / rows)
          const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
          out.push(Math.round((r + g + b) / 3))
        }
        return out
      },
      { b64: jpeg.toString('base64'), across, rows }
    )
  } finally {
    await page.close()
  }
}

describe('the fixture is a real scroll reveal', () => {
  it('leaves every section below the first at opacity 0 in a full-page capture with motion allowed', async () => {
    const page = await browser.newPage({
      viewport: { width: 360, height: 640 },
      reducedMotion: 'no-preference',
    })
    try {
      await page.goto(url)
      await page.waitForTimeout(500)
      const opacities = await page.evaluate(() =>
        [...document.querySelectorAll('section')].map((s) => Number(getComputedStyle(s).opacity))
      )
      expect(opacities[0]).toBe(1)
      expect(opacities.slice(1)).toEqual(Array(SECTIONS - 1).fill(0))
    } finally {
      await page.close()
    }
  }, 30_000)
})

describe('the phone filmstrip', () => {
  it('paints every fold of a page that reveals its sections on scroll', async () => {
    const jpeg = await capturePhoneFilmstrip(browser, url)
    expect(jpeg).not.toBeNull()
    const luma = await tileLuma(jpeg, { across: SECTIONS })
    // Black sections. A fold left at opacity 0 reads white.
    expect(luma).toHaveLength(SECTIONS)
    for (const [i, l] of luma.entries()) expect(l, `fold ${i + 1}`).toBeLessThan(60)
  }, 60_000)
})

describe('the desktop filmstrip', () => {
  it('paints every fold of the same page at 1440', async () => {
    // Five 640px sections are 3200px: four 900px folds, two across.
    const jpeg = await captureDesktopFilmstrip(browser, url)
    expect(jpeg).not.toBeNull()
    const luma = await tileLuma(jpeg, { across: 2, rows: 2 })
    // The last fold holds 500px of black under 400px of nothing, so it is not
    // sampled at its middle; the three whole folds are.
    for (const [i, l] of luma.slice(0, 3).entries()) expect(l, `fold ${i + 1}`).toBeLessThan(60)
  }, 60_000)
})
