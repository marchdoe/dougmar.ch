/**
 * The page half of the render-health checks (#574), against real Chromium.
 *
 * Each case is a defect that shipped or a shape the probe could get wrong: a
 * word cut over lines by a column narrower than it (2026-09-20), text set in
 * `transparent` with no stroke to draw it (2026-09-19), and a reveal that
 * leaves a section at `opacity: 0` once the animation is off. The last block
 * runs the whole path, `runSurfaceGate` over served pages, and asserts the
 * finding and who owns it.
 */
import { createServer } from 'node:http'
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { NARROW_VIEWPORT, WIDE_VIEWPORT } from '../../elements/chassis/viewports.js'
import {
  collectBrokenWords,
  collectInvisibleText,
  collectStrandedText,
} from '../../scripts/utils/render-health-page.js'
import { measureRenderHealth, measureStranded } from '../../scripts/utils/render-health.js'
import { faultsForOwner, runSurfaceGate } from '../../scripts/utils/surface-gate.js'
import { withRevealedPage } from '../../scripts/utils/text-contrast-page.js'

let browser
beforeAll(async () => {
  browser = await chromium.launch({ headless: true })
})
afterAll(async () => {
  await browser?.close()
})

async function onPage(html, viewport, probe, head = '') {
  const page = await browser.newPage({ viewport })
  try {
    await page.setContent(
      `<!doctype html><html><head>${head}</head><body style="margin:0">${html}</body></html>`
    )
    return await probe(page)
  } finally {
    await page.close()
  }
}

const words = (html, viewport = NARROW_VIEWPORT, head = '') =>
  onPage(html, viewport, collectBrokenWords, head)
const invisible = (html) => onPage(html, WIDE_VIEWPORT, collectInvisibleText)
const stranded = (html) => onPage(html, WIDE_VIEWPORT, collectStrandedText)

// "Spaceman" at 80px needs about 330px; the column is 150px and lets a word
// break anywhere, which is how 2026-09-20 turned overflow into a shred.
const SHRED = 'width:150px;font-size:80px;margin:0;overflow-wrap:anywhere'

describe('a word broken across lines', () => {
  it('is reported with the element, the size and what the column held', async () => {
    const { words: found } = await words(`<h1 style="${SHRED}">Spaceman</h1>`)
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({
      word: 'Spaceman',
      tag: 'h1',
      selector: 'h1',
      sizePx: 80,
      boxPx: 150,
      part: null,
      count: 1,
    })
    expect(found[0].lines).toBeGreaterThan(1)
    expect(found[0].needsPx).toBeGreaterThan(150)
  })

  it('names the nearest box that is not inline as the one that did the breaking', async () => {
    const { words: found } = await words(
      `<div style="width:150px;padding:0 10px;box-sizing:content-box"><h1 style="margin:0;font-size:80px;overflow-wrap:anywhere"><span>Spaceman</span></h1></div>`
    )
    expect(found).toHaveLength(1)
    // The h1 is a block: its own 150px, not the span's.
    expect(found[0].boxPx).toBe(150)
  })

  it('leaves a stack written with <br> alone: it breaks between words', async () => {
    const { words: found } = await words(
      `<h1 style="width:150px;font-size:40px;margin:0">Space<br>man<br>Twitter</h1>`
    )
    expect(found).toEqual([])
  })

  it('leaves ordinary wrapping and hyphenated compounds alone', async () => {
    const { words: found } = await words(
      `<p style="width:120px;font-size:20px;margin:0">well-known-fact-of-life and other long sentences that wrap over several lines</p>`
    )
    expect(found).toEqual([])
  })

  it('skips vertical writing-mode, where a stack is the design', async () => {
    const { words: found } = await words(
      `<h1 style="writing-mode:vertical-rl;height:70px;font-size:40px;margin:0;overflow-wrap:anywhere">Spaceman</h1>`
    )
    expect(found).toEqual([])
  })

  it('skips hyphens: auto, where the break arrives with a hyphen', async () => {
    const { words: found } = await words(
      `<h1 lang="en" style="${SHRED};hyphens:auto">Spaceman</h1>`
    )
    expect(found).toEqual([])
  })

  it('skips text that is not there: visibility hidden and display none', async () => {
    const { words: found } = await words(
      `<h1 style="${SHRED};visibility:hidden">Spaceman</h1><h1 style="${SHRED};display:none">Twittertale</h1>`
    )
    expect(found).toEqual([])
  })

  it('counts the same word in the same chain once, with how many', async () => {
    const { words: found } = await words(
      `<ul style="margin:0;padding:0">${'<li class="t" style="width:150px;font-size:80px;overflow-wrap:anywhere">Spaceman</li>'.repeat(3)}</ul>`
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ word: 'Spaceman', count: 3 })
    expect(found[0].selector).toContain('li.t')
  })

  it('carries the orchestrator part the word sits in', async () => {
    const { words: found } = await words(
      `<aside data-site-callout><h2 style="${SHRED}">Spaceman</h2></aside>`
    )
    expect(found[0].part).toBe('SiteCallout')
  })

  it('reads the design date from og:image, and gives none when there is no card', async () => {
    const card = `<meta property="og:image" content="https://dougmar.ch/og/2026-09-20.png">`
    expect((await words('<p>Hello</p>', NARROW_VIEWPORT, card)).designDate).toBe('2026-09-20')
    expect((await words('<p>Hello</p>')).designDate).toBe('')
  })

  it('is measured at the rung viewport, before the gate resizes it for the reveal', async () => {
    // 40vh is 256px on the phone and 1200px once the viewport is as tall as
    // the page, so this word fits until something resizes the window.
    const html = `<p style="width:600px;margin:0;font-size:40vh;overflow-wrap:anywhere">Fit</p><div style="height:3000px"></div>`
    const page = await browser.newPage({ viewport: NARROW_VIEWPORT })
    try {
      await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`)
      const atRung = await measureRenderHealth({
        browser,
        page,
        viewport: { name: 'mobile' },
        scheme: 'light',
      })
      expect(atRung.renderHealth.words).toEqual([])
      // Control: the same page, measured the way the walk sees it, does break.
      const resized = await withRevealedPage(page, () => collectBrokenWords(page))
      expect(resized.words.length).toBeGreaterThan(0)
    } finally {
      await page.close()
    }
  })
})

describe('text painted in nothing', () => {
  it('reports transparent text with no stroke and no clipped background', async () => {
    const found = await invisible(
      '<p class="ghost" style="color:transparent;font-size:20px">Ghost words in the hero band</p>'
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({
      tag: 'p',
      text: 'Ghost words in the hero band',
      color: 'rgba(0, 0, 0, 0)',
      sizePx: 20,
      part: null,
    })
    expect(found[0].selector).toContain('p.ghost')
  })

  it('leaves transparent text alone when a stroke draws it', async () => {
    expect(
      await invisible(
        '<h1 style="color:transparent;-webkit-text-stroke:2px #000;font-size:80px">Outline</h1>'
      )
    ).toEqual([])
  })

  it('leaves transparent text alone when a clipped background paints it', async () => {
    expect(
      await invisible(
        '<h1 style="color:transparent;background:linear-gradient(90deg,red,blue);-webkit-background-clip:text;font-size:80px">Gradient</h1>'
      )
    ).toEqual([])
  })

  it('leaves text alone that is not on screen: opacity 0, sr-only, hidden', async () => {
    expect(
      await invisible(
        `<p style="color:transparent;opacity:0">mid-flight</p>
         <p style="color:transparent;position:absolute;width:1px;height:1px;overflow:hidden">sr only</p>
         <p style="color:transparent;visibility:hidden">hidden</p>
         <p style="color:transparent;display:none">gone</p>`
      )
    ).toEqual([])
  })

  it('leaves ordinary text alone', async () => {
    expect(await invisible('<h1>Hello</h1><p style="color:rgba(0,0,0,.5)">Half</p>')).toEqual([])
  })

  it('carries the part and folds repeats of one chain', async () => {
    const found = await invisible(
      `<div data-white-paper><p class="g" style="color:transparent">a</p><p class="g" style="color:transparent">b</p></div>`
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ part: 'WhitePaper', count: 2 })
  })
})

describe('text left at opacity 0', () => {
  it('reports the element, its box and the animation still on it', async () => {
    const found = await stranded(
      '<section class="rise" style="opacity:0;width:300px;height:120px"><h2>Below the hero</h2></section>'
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({
      tag: 'section',
      text: 'Below the hero',
      widthPx: 300,
      heightPx: 120,
      animationName: 'none',
      part: null,
    })
    expect(found[0].selector).toContain('section.rise')
  })

  it('reports the wrapper and a child that sets its own zero', async () => {
    const found = await stranded(
      '<div style="opacity:0"><p style="opacity:0">Inner</p></div><p>Fine</p>'
    )
    expect(found.map((f) => f.tag)).toEqual(['div', 'p'])
  })

  it('leaves alone what is hidden, empty, or only under a zero it does not set itself', async () => {
    expect(
      await stranded(
        `<p style="opacity:0;visibility:hidden">hidden</p>
         <p style="opacity:0;display:none">gone</p>
         <div style="opacity:0"></div>
         <p style="opacity:.01">nearly there</p>`
      )
    ).toEqual([])
  })

  it('does not list a child for a zero it inherits from a wrapper: the wrapper is the fault', async () => {
    const found = await stranded('<div style="opacity:0"><p>Inner</p></div>')
    expect(found.map((f) => f.tag)).toEqual(['div'])
  })
})

const dataUrl = (html) =>
  `data:text/html,${encodeURIComponent(`<!doctype html><html><body>${html}</body></html>`)}`

describe('the reduced-motion visit', () => {
  it('loads the page with the preference on, so a rule that keys on it is seen', async () => {
    // Stranded only when the preference is on.
    const html = `<style>@media (prefers-reduced-motion: reduce){.r{opacity:0}}</style><p class="r">Hello there</p>`
    const seen = await measureStranded(browser, dataUrl(html))
    expect(seen.map((s) => s.text)).toEqual(['Hello there'])
    // The same page without the preference has nothing to report.
    expect(await stranded(html)).toEqual([])
  })

  it('passes a reveal that keeps its resting state visible', async () => {
    const html = `<style>
      @keyframes rise{from{opacity:0}to{opacity:1}}
      @supports (animation-timeline: view()){.r{animation:rise 1s both;animation-timeline:view()}}
      @media (prefers-reduced-motion: reduce){*{animation:none !important}}
    </style><section class="r"><p>Below the fold</p></section>`
    expect(await measureStranded(browser, dataUrl(html))).toEqual([])
  })

  it('reports a reveal whose resting state is the hidden one', async () => {
    const html = `<style>
      @keyframes rise{to{opacity:1}}
      .r{opacity:0;animation:rise 1s both}
      @media (prefers-reduced-motion: reduce){*{animation:none !important}}
    </style><section class="r"><p>Below the fold</p></section>`
    const seen = await measureStranded(browser, dataUrl(html))
    expect(seen).toHaveLength(1)
    expect(seen[0]).toMatchObject({ tag: 'section', animationName: 'none' })
  })
})

/**
 * The whole path: served pages walked by `runSurfaceGate` at every rung, so
 * the finding, its owner and its fold are what a night would carry.
 */
describe('through runSurfaceGate', () => {
  const NAV = '<h1>Home</h1><a href="/about">About</a>'
  const PAGES = {
    // All three defects at once, on a route the engineer owns.
    '/': `${NAV}
      <h2 class="shred" style="${SHRED}">Spaceman</h2>
      <p class="ghost" style="color:transparent;font-size:20px">Ghost words in the hero band</p>
      <style>@keyframes rise{to{opacity:1}}
        .rise{opacity:0;animation:rise 1s both}
        @media (prefers-reduced-motion: reduce){*{animation:none !important}}</style>
      <section class="rise"><p>A section that depends on its reveal</p></section>`,
    // The same reveal written safely: visible at rest, hidden only inside the
    // animation. Nothing to report.
    '/about': `${NAV}
      <p>Fine</p>
      <style>@keyframes rise{from{opacity:0}to{opacity:1}}
        @supports (animation-timeline: view()){.rise{animation:rise 1s both;animation-timeline:view()}}
        @media (prefers-reduced-motion: reduce){*{animation:none !important}}</style>
      <section class="rise"><p>Below the fold, on a working reveal</p></section>`,
    // The same shred on an authored route: reported, for a person.
    '/experiments': `${NAV}<h2 style="${SHRED}">Spaceman</h2>`,
    // The same shred inside a part the orchestrator writes.
    '/work/callout': `${NAV}<aside data-site-callout><h2 style="${SHRED}">Spaceman</h2></aside>`,
  }

  async function serve() {
    const server = createServer((req, res) => {
      const html = PAGES[req.url ?? '']
      res.statusCode = html ? 200 : 404
      res.setHeader('content-type', 'text/html')
      res.end(`<!doctype html><html><body style="margin:0">${html ?? ''}</body></html>`)
    })
    await new Promise((resolve) => server.listen(0, resolve))
    return server
  }

  it('turns each defect into an error owned by the engineer, and routes the rest to a person', async () => {
    const server = await serve()
    try {
      const { port } = server.address()
      const { findings } = await runSurfaceGate({
        port,
        routes: Object.keys(PAGES).map((route) => ({ id: route, route })),
        schemes: ['light', 'dark'],
      })
      const ofKind = (kind) => findings.filter((f) => f.kind === kind)

      // The shred, once for the chain, at both rungs it shows in.
      const shreds = ofKind('word-break').filter((f) => f.surface === '/')
      expect(shreds).toHaveLength(1)
      expect(shreds[0]).toMatchObject({ severity: 'error', owner: 'react-engineer' })
      expect(shreds[0].detail).toContain('"Spaceman" at 80px')
      expect(shreds[0].detail).toContain('its box is 150px')
      expect(shreds[0].detail).toContain('Size the type to the column')
      expect(shreds[0].detail).toContain(
        `Also on / at ${shreds[0].width === NARROW_VIEWPORT.width ? WIDE_VIEWPORT.width : NARROW_VIEWPORT.width}px`
      )

      const ghosts = ofKind('invisible-text')
      expect(ghosts).toHaveLength(1)
      expect(ghosts[0]).toMatchObject({ surface: '/', severity: 'error', owner: 'react-engineer' })
      expect(ghosts[0].detail).toContain('"Ghost words in the hero band"')
      expect(ghosts[0].detail).toContain('rgba(0, 0, 0, 0)')

      const reveals = ofKind('stranded-text')
      expect(reveals).toHaveLength(1)
      expect(reveals[0]).toMatchObject({
        surface: '/',
        viewport: 'desktop',
        scheme: 'light',
        severity: 'error',
        owner: 'react-engineer',
      })
      expect(reveals[0].detail).toContain('section.rise')
      expect(reveals[0].detail).toContain('opacity 0')
      expect(reveals[0].detail).toContain('animation-name none')

      // Nothing on the route with a reveal that holds at rest.
      expect(
        findings.filter((f) => f.surface === '/about' && /-text$|word-break/.test(f.kind))
      ).toEqual([])

      // Who acts on it.
      const experiments = ofKind('word-break').find((f) => f.surface === '/experiments')
      expect(experiments).toMatchObject({ severity: 'error' })
      expect(faultsForOwner(findings, 'human').map((f) => f.surface)).toContain('/experiments')
      const callout = ofKind('word-break').find((f) => f.surface === '/work/callout')
      expect(callout).toMatchObject({ owner: 'human' })
      expect(callout.detail).toContain('SiteCallout')
      expect(faultsForOwner(findings, 'react-engineer').map((f) => f.kind)).toEqual(
        expect.arrayContaining(['word-break', 'invisible-text', 'stranded-text'])
      )
      // The engineer is never sent to a word it cannot edit.
      expect(
        faultsForOwner(findings, 'react-engineer').filter(
          (f) => f.surface === '/work/callout' && f.kind === 'word-break'
        )
      ).toEqual([])
    } finally {
      await new Promise((resolve) => server.close(resolve))
    }
  }, 120000)
})
