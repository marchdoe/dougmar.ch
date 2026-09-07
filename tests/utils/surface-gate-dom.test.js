/**
 * The DOM half of the surface gate, against real Chromium.
 *
 * evaluateMeasurement's tests feed it a pre-built worstCopy, so they prove
 * the threshold and never the extraction (#321). This proves the extraction,
 * including the case that slipped through: a paragraph carrying one inline
 * element was skipped entirely by the leaf-only walk (#307).
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import {
  OVERFLOW_TOLERANCE_PX,
  RUNNING_COPY_MIN_CHARS,
  collectSurfaceMetrics,
  findClippedElements,
  findSmallCopy,
  findTapTargetFailures,
} from '../../scripts/utils/surface-gate.js'
import { BODY_TEXT_MIN_PX, TAP_TARGET_MIN_PX } from '../../scripts/utils/responsive-thresholds.js'

const LONG =
  'I work at the intersection of product and engineering, mostly on things that ship to people who did not ask for them and have to like them anyway. '.repeat(
    3
  )

async function measure(browser, html) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  try {
    await page.setContent(`<!doctype html><html><body>${html}</body></html>`)
    return await page.evaluate(collectSurfaceMetrics, { minChars: RUNNING_COPY_MIN_CHARS })
  } finally {
    await page.close()
  }
}

describe('collectSurfaceMetrics', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  it('measures a paragraph that carries a link', async () => {
    // 2026-09-01's /about paragraph, with the one <a> the Art Director is
    // likely to put in it. The leaf-only walk measured the <a> alone.
    const { worstCopy } = await measure(
      browser,
      `<p style="font-size:110px">${LONG} <a href="/work">See the work</a>.</p>`
    )
    expect(worstCopy).not.toBeNull()
    expect(worstCopy.fontSizePx).toBe(110)
    expect(worstCopy.chars).toBeGreaterThan(RUNNING_COPY_MIN_CHARS)
  })

  it('measures a paragraph with emphasis and a line break', async () => {
    const { worstCopy } = await measure(
      browser,
      `<p style="font-size:64px">${LONG}<br><em>${LONG}</em> <strong>and more</strong></p>`
    )
    expect(worstCopy?.fontSizePx).toBe(64)
  })

  it('still measures a plain leaf paragraph', async () => {
    const { worstCopy } = await measure(browser, `<p style="font-size:110px">${LONG}</p>`)
    expect(worstCopy?.fontSizePx).toBe(110)
  })

  it('does not report a wrapper of block children as one giant block', async () => {
    // The wrapper's textContent is the sum of its paragraphs. Measuring it
    // would flag every page as a running-copy block at the wrapper's size.
    const { worstCopy } = await measure(
      browser,
      `<div style="font-size:120px"><p style="font-size:16px">${LONG}</p><p style="font-size:16px">${LONG}</p></div>`
    )
    expect(worstCopy?.fontSizePx).toBe(16)
  })

  it('leaves a short hero phrase alone however large', async () => {
    const { worstCopy } = await measure(
      browser,
      `<h1 style="font-size:200px"><span>97.7,</span> still summer.</h1>`
    )
    expect(worstCopy).toBeNull()
  })

  it('reports document overflow and the opt-out attribute', async () => {
    const wide = await measure(browser, `<div style="width:2000px;height:10px"></div>`)
    expect(wide.scrollWidth).toBeGreaterThan(wide.clientWidth)
    expect(wide.allowsXOverflow).toBe(false)

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.setContent(
        '<!doctype html><html><body data-allow-x-overflow><p>x</p></body></html>'
      )
      const out = await page.evaluate(collectSurfaceMetrics, { minChars: RUNNING_COPY_MIN_CHARS })
      expect(out.allowsXOverflow).toBe(true)
    } finally {
      await page.close()
    }
  })
})

/**
 * The clipping detector, against real geometry.
 *
 * It is rebuilt from its own source inside the page, the way `measureRoute`
 * and `responsive-scorer.js` both run it, so this exercises the serialisation
 * as well as the rules.
 */
describe('findClippedElements', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  async function clipped(html, { width = 360, height = 640 } = {}) {
    const page = await browser.newPage({ viewport: { width, height } })
    try {
      await page.setContent(
        `<!doctype html><html><head><style>html,body{margin:0;padding:0;overflow:hidden}</style>` +
          `</head><body>${html}</body></html>`
      )
      return await page.evaluate(
        ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
        [findClippedElements.toString(), { overflowTolerancePx: OVERFLOW_TOLERANCE_PX }]
      )
    } finally {
      await page.close()
    }
  }

  it('reports a clipped parent once, not once per clipped child', async () => {
    // 2026-09-04 reported {DIV "Daylight06:46…" right:392} and
    // {DIV "Daylight" right:368} as two faults. They are one.
    const found = await clipped(
      `<div style="width:800px"><div style="width:700px">Daylight</div>` +
        `<div style="width:700px">06:46</div></div>`
    )
    expect(found).toHaveLength(1)
    expect(found[0].tag).toBe('DIV')
    expect(found[0].text.startsWith('Daylight')).toBe(true)
    expect(found[0].over).toBe(440)
  })

  it('marks an element that carries text apart from one that does not', async () => {
    const [withText] = await clipped(`<h1 style="width:800px;font-size:20px">Spaceman</h1>`)
    expect(withText.text).toBe('Spaceman')

    const [decorative] = await clipped(`<div style="width:800px;height:40px;background:red"></div>`)
    expect(decorative.text).toBe('')
  })

  it('honours the opt-out on the element and on body', async () => {
    expect(
      await clipped(`<div data-allow-x-overflow style="width:800px">Deliberate crop</div>`)
    ).toEqual([])
    // A child of an opted-out element is covered too — closest walks up.
    expect(
      await clipped(
        `<div data-allow-x-overflow style="width:800px"><span>Deliberate crop</span></div>`
      )
    ).toEqual([])
    // And the page-level attribute the overflow check already honours.
    const page = await browser.newPage({ viewport: { width: 360, height: 640 } })
    try {
      await page.setContent(
        '<!doctype html><html><head><style>html,body{margin:0;overflow:hidden}</style></head>' +
          '<body data-allow-x-overflow><div style="width:800px">Full bleed</div></body></html>'
      )
      const out = await page.evaluate(
        ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
        [findClippedElements.toString(), { overflowTolerancePx: OVERFLOW_TOLERANCE_PX }]
      )
      expect(out).toEqual([])
    } finally {
      await page.close()
    }
  })

  it('leaves an element that fits alone, and ignores sub-pixel overhang', async () => {
    expect(await clipped(`<div style="width:340px">Fits</div>`)).toEqual([])
    // 360.5px in a 360px viewport is layout arithmetic, not a defect.
    expect(await clipped(`<div style="width:360.5px">Rounding</div>`)).toEqual([])
  })

  it('collapses whitespace in the sample so one finding stays one bullet', async () => {
    const [found] = await clipped(
      `<div style="width:800px">\n  <h1>Where does the day go?</h1>\n  <p>Here, and Spaceman</p>\n</div>`
    )
    expect(found.text).not.toContain('\n')
    expect(found.text).toBe('Where does the day go? Here, and Spaceman')
  })

  it('puts the worst offender first', async () => {
    const found = await clipped(
      `<div style="width:400px">near</div><div style="width:900px">far</div>`
    )
    expect(found.map((f) => f.text)).toEqual(['far', 'near'])
  })

  // #465: 2026-09-05 shipped "Shutout." as "Sh" at 360. The <p> was 216px
  // wide, exactly its column, so its right edge cleared the viewport and the
  // walk above saw nothing; the word inside it needed 1298px.
  describe('a word wider than its box', () => {
    const shout = ({ style = '', attrs = '' } = {}) =>
      `<div ${attrs} style="width:300px;overflow:hidden;${style}">` +
      `<p style="font-size:200px;margin:0">Shutout.</p></div>`

    it('is reported, with the overrun measured against the box', async () => {
      const found = await clipped(shout())
      expect(found).toHaveLength(1)
      expect(found[0].tag).toBe('P')
      expect(found[0].text).toBe('Shutout.')
      expect(found[0].cause).toBe('text')
      expect(found[0].boxWidth).toBe(300)
      expect(found[0].over).toBeGreaterThan(300)
    })

    it('is reported at the block that lays it out when the word sits in a span', async () => {
      const found = await clipped(
        `<div style="width:300px;overflow:hidden">` +
          `<h2 style="font-size:200px;margin:0"><span>Spaceman</span></h2></div>`
      )
      expect(found.map((f) => [f.tag, f.text, f.cause])).toEqual([['H2', 'Spaceman', 'text']])
    })

    it('is left alone inside a deliberate scroller', async () => {
      expect(await clipped(shout({ style: 'overflow-x:auto' }))).toEqual([])
      expect(await clipped(shout({ style: 'overflow-x:scroll' }))).toEqual([])
      // On the block itself, not only on an ancestor.
      expect(
        await clipped(
          `<div style="width:300px;overflow:hidden">` +
            `<p style="font-size:200px;margin:0;overflow-x:auto">Shutout.</p></div>`
        )
      ).toEqual([])
    })

    it('honours the opt-out on an ancestor', async () => {
      expect(await clipped(shout({ attrs: 'data-allow-x-overflow' }))).toEqual([])
    })

    it('is not a wrapped paragraph', async () => {
      // Long prose wraps; scrollWidth stays at clientWidth.
      expect(
        await clipped(
          `<div style="width:300px;overflow:hidden"><p style="font-size:16px">${LONG}</p></div>`
        )
      ).toEqual([])
    })

    it('is one finding when the box that clips it is also past the viewport', async () => {
      // The outermost rule spans both causes: the parent is cut by the
      // viewport and the word inside is cut by the parent. One fault.
      const found = await clipped(
        `<div style="width:800px;overflow:hidden">` +
          `<p style="font-size:200px;margin:0;width:300px">Shutout.</p></div>`
      )
      expect(found).toHaveLength(1)
      expect(found[0].cause).toBe('viewport')
    })
  })
})

/**
 * The tap-target and small-copy detectors, against real geometry (#488).
 * From the 2026-09-07 nightly: 12 tap-target failures on the small-caps nav
 * and running copy at 12.6px, both measured nightly by responsive-scorer.js
 * and read by nothing.
 */
describe('findTapTargetFailures', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  async function targets(html) {
    const page = await browser.newPage({ viewport: { width: 360, height: 640 } })
    try {
      await page.setContent(`<!doctype html><html><body>${html}</body></html>`)
      return await page.evaluate(
        ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
        [findTapTargetFailures.toString(), { tapTargetMinPx: TAP_TARGET_MIN_PX }]
      )
    } finally {
      await page.close()
    }
  }

  it('reports a link under 44x44', async () => {
    const found = await targets(
      `<a href="/work" style="display:inline-block;width:34px;height:22px">work</a>`
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ text: 'work', count: 1, w: 34, h: 22 })
  })

  it('leaves a 44x44 link alone', async () => {
    const found = await targets(
      `<a href="/work" style="display:inline-block;width:44px;height:44px">work</a>`
    )
    expect(found).toEqual([])
  })

  it('groups repeats of the same visible text into one finding with a count', async () => {
    const found = await targets(
      Array.from(
        { length: 3 },
        () => `<a href="/work" style="display:inline-block;width:34px;height:22px">work</a>`
      ).join('')
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ text: 'work', count: 3, w: 34, h: 22 })
  })

  it('keeps the smallest box seen for a repeated text', async () => {
    const found = await targets(
      `<a href="/a" style="display:inline-block;width:34px;height:22px">work</a>` +
        `<a href="/b" style="display:inline-block;width:20px;height:20px">work</a>`
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ text: 'work', count: 2, w: 20, h: 20 })
  })

  it('reports buttons and role=button elements too, worst first', async () => {
    const found = await targets(
      `<button style="width:40px;height:40px">go</button>` +
        `<div role="button" style="width:10px;height:10px">x</div>`
    )
    expect(found.map((f) => f.text)).toEqual(['x', 'go'])
  })
})

describe('findSmallCopy', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  async function smallCopy(html) {
    const page = await browser.newPage({ viewport: { width: 360, height: 640 } })
    try {
      await page.setContent(`<!doctype html><html><body><main>${html}</main></body></html>`)
      return await page.evaluate(
        ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
        [findSmallCopy.toString(), { bodyTextMinPx: BODY_TEXT_MIN_PX }]
      )
    } finally {
      await page.close()
    }
  }

  it('reports a 14px paragraph', async () => {
    const found = await smallCopy(`<p style="font-size:14px">Design systems, mostly.</p>`)
    expect(found).toMatchObject({ tag: 'P', fontSizePx: 14 })
    expect(found.sample).toContain('Design systems')
  })

  it('leaves a 16px paragraph at the floor alone', async () => {
    expect(await smallCopy(`<p style="font-size:16px">Design systems, mostly.</p>`)).toBeNull()
  })

  it('does not report a 12px caption set in a <small>', async () => {
    // Excluded by tag, the way responsive-scorer's bodyTextSize already
    // excludes it — not by size, which is what let a caption at the
    // chassis's 11.2px step fail the check as noise (#469).
    expect(
      await smallCopy(`<small style="font-size:12px">A caption nobody reads twice.</small>`)
    ).toBeNull()
  })

  it('reports the worst of several blocks', async () => {
    const found = await smallCopy(
      `<p style="font-size:15px">Fifteen pixels of running copy here.</p>` +
        `<li style="font-size:12px">Twelve pixels of running copy here.</li>`
    )
    expect(found).toMatchObject({ tag: 'LI', fontSizePx: 12 })
  })
})
