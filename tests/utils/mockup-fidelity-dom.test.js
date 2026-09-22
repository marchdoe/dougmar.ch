/**
 * `extractTextSegments`, against real Chromium — the grouping and geometry
 * rules need actual layout, not jsdom. Mirrors surface-gate-dom.test.js's
 * setup (one shared browser, a `measure` helper that sets page content and
 * evaluates the function under test).
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { createServer } from 'node:http'
import { extractTextSegments, readPageLayout } from '../../scripts/utils/mockup-fidelity.js'
import { runSurfaceGate, VIEWPORT_RUNGS } from '../../scripts/utils/surface-gate.js'

async function measure(browser, html, { width = 1440, height = 900 } = {}) {
  const page = await browser.newPage({ viewport: { width, height } })
  try {
    await page.setContent(
      `<!doctype html><html><head><style>html,body{margin:0;padding:0}</style></head>` +
        `<body>${html}</body></html>`
    )
    return await page.evaluate(extractTextSegments)
  } finally {
    await page.close()
  }
}

describe('extractTextSegments', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  it('recovers "gap" from a per-letter flex hero (2026-09-19)', async () => {
    // archive/2026-09-19's mockup builds the hero word letter by letter, each
    // in its own span, laid out with `display:flex` on the container —
    // exactly what blockifies each letter's own inline-block span to `block`
    // without making it a real block boundary.
    const segs = await measure(
      browser,
      `<style>
        .gap-letters{display:flex;justify-content:space-between;font-size:200px}
        .gap-letters span{display:inline-block}
      </style>
      <span class="gap-letters"><span>G</span><span>A</span><span>P</span></span>`
    )
    const gap = segs.find((s) => s.text === 'GAP')
    expect(gap).toBeDefined()
    expect(segs.filter((s) => /^[GAP]$/.test(s.text))).toHaveLength(0)
  })

  it('keeps the stacked lines of a flex-column headline apart (2026-09-22 canary)', async () => {
    // The canary's h1: three spans in a flex column, the second and third
    // both at 122px. They read as one segment, 'bothnot a generalist'.
    const segs = await measure(
      browser,
      `<h1 style="display:flex;flex-direction:column;margin:0">` +
        `<span style="display:block;font-size:40px">Deep in</span>` +
        `<span style="display:block;font-size:122px">Both</span>` +
        `<span style="display:block;font-size:122px">Not a generalist.</span></h1>`
    )
    const texts = segs.map((s) => s.text.trim())
    expect(texts).toContain('Both')
    expect(texts).toContain('Not a generalist.')
  })

  it('does not merge two real paragraphs that happen to share a font-size', async () => {
    const segs = await measure(
      browser,
      `<p style="font-size:40px">First paragraph.</p><p style="font-size:40px">Second paragraph.</p>`
    )
    const texts = segs.map((s) => s.text.trim())
    expect(texts).toContain('First paragraph.')
    expect(texts).toContain('Second paragraph.')
    expect(texts).not.toContain('First paragraph.Second paragraph.')
  })

  it('folds a <br> between two same-size runs into a space', async () => {
    const segs = await measure(
      browser,
      `<p style="font-size:32px">Closing the gap<br>between design and code</p>`
    )
    const p = segs.find((s) => s.text.includes('Closing'))
    expect(p.text.replace(/\s+/g, ' ').trim()).toBe('Closing the gap between design and code')
  })

  it('lowers visibleFraction for a segment clipped by an ancestor', async () => {
    const segs = await measure(
      browser,
      `<div style="width:100px;height:20px;overflow:hidden">` +
        `<span style="font-size:16px;white-space:nowrap">A much longer line than the box</span></div>`
    )
    const s = segs.find((s) => s.text.includes('much longer'))
    expect(s).toBeDefined()
    expect(s.visibleFraction).toBeLessThan(0.6)
    expect(s.visibleFraction).toBeGreaterThan(0)
  })

  it('reports full visibleFraction for an unclipped segment', async () => {
    const segs = await measure(browser, `<p style="font-size:40px">Plainly visible</p>`)
    const s = segs.find((s) => s.text.includes('Plainly'))
    expect(s.visibleFraction).toBeCloseTo(1, 1)
  })

  it('captures effective opacity as the product of ancestor opacities', async () => {
    const segs = await measure(
      browser,
      `<div style="opacity:0.5"><div style="opacity:0.4"><p style="font-size:20px">Faded</p></div></div>`
    )
    const s = segs.find((s) => s.text.includes('Faded'))
    expect(s.opacity).toBeCloseTo(0.2, 5)
  })

  it('treats display:none and visibility:hidden as absent, not opacity 0', async () => {
    const segs = await measure(
      browser,
      `<p style="font-size:20px" hidden>Gone</p>` +
        `<div style="display:none"><p style="font-size:20px">Also gone</p></div>` +
        `<p style="font-size:20px;visibility:hidden">Invisible</p>` +
        `<p style="font-size:20px">Still here</p>`
    )
    const texts = segs.map((s) => s.text.trim())
    expect(texts.some((t) => t.includes('Gone'))).toBe(false)
    expect(texts.some((t) => t.includes('Also gone'))).toBe(false)
    expect(texts.some((t) => t.includes('Invisible'))).toBe(false)
    expect(texts.some((t) => t.includes('Still here'))).toBe(true)
  })

  it('reports a genuine opacity:0 element rather than dropping it', async () => {
    const segs = await measure(browser, `<p style="font-size:20px;opacity:0">Faint</p>`)
    const s = segs.find((s) => s.text.includes('Faint'))
    expect(s).toBeDefined()
    expect(s.opacity).toBeCloseTo(0, 5)
  })

  it('reads a section held back by a view() scroll reveal as rendered (2026-09-14)', async () => {
    // Panda's `anim-n_rise` on `animation-timeline: view()`, fill-mode both:
    // a section below the fold sits at opacity 0 until it is scrolled to, and
    // an unscrolled capture used to report it as missing from the build.
    const segs = await measure(
      browser,
      `<style>
        @keyframes rise{0%{opacity:0}to{opacity:1}}
        .reveal{animation-name:rise;animation-fill-mode:both;animation-timeline:view();
          animation-range:entry 0% entry 40%}
      </style>
      <div style="height:1400px"></div>
      <section class="reveal"><h2 style="font-size:28px">Selected Work</h2></section>`
    )
    const s = segs.find((s) => s.text.includes('Selected Work'))
    expect(s.opacity).toBeCloseTo(1, 5)
  })

  it('leaves a time-based animation alone, so a stuck entrance still reads as stuck', async () => {
    const segs = await measure(
      browser,
      `<style>
        @keyframes stuck{0%,to{opacity:0}}
        .stuck{animation:stuck 100s both paused}
      </style>
      <p class="stuck" style="font-size:28px">Held at zero</p>`
    )
    const s = segs.find((s) => s.text.includes('Held at zero'))
    expect(s.opacity).toBeCloseTo(0, 5)
  })

  it('breaks a run across two different block-level containers', async () => {
    const segs = await measure(
      browser,
      `<div style="display:flex"><p style="font-size:24px">Left column</p>` +
        `<p style="font-size:24px">Right column</p></div>`
    )
    const texts = segs.map((s) => s.text.trim())
    expect(texts).toContain('Left column')
    expect(texts).toContain('Right column')
  })
})

/**
 * The nightly's path: the mockup's layout read the way snapshot.js reads it,
 * handed to `runSurfaceGate`, which reads the build's `/` and compares. The
 * pages are the local canary that prompted this: BOTH at 158px over a 44px
 * caption, built with the caption at 122px.
 */
describe('mockup drift through runSurfaceGate', () => {
  const PAGES = {
    '/mockup':
      '<h1 style="font-size:158px;margin:0">BOTH</h1><h2 style="font-size:150px;margin:0">Work</h2>' +
      '<p style="font-size:44px">Deep in</p>',
    '/':
      '<p style="font-size:122px;margin:0">Deep in</p><h1 style="font-size:100px;margin:0">BOTH</h1>' +
      '<h2 style="font-size:95px;margin:0">Work</h2>',
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

  it('returns the comparison beside the findings, with only the lost leader at 1440 in them', async () => {
    const server = await serve()
    const browser = await chromium.launch({ headless: true })
    try {
      const { port } = server.address()
      const mockupLayout = await readPageLayout(browser, `http://localhost:${port}/mockup`)
      const opts = {
        port,
        routes: [{ id: 'home', route: '/' }],
        viewports: VIEWPORT_RUNGS.filter((v) => v.name === 'desktop'),
        schemes: ['light'],
      }
      const gate = await runSurfaceGate({ ...opts, mockupLayout })

      const hierarchy = gate.mockupFindings.find(
        (f) => f.kind === 'mockup-hierarchy' && f.width === 1440
      )
      // The build's largest text is not the mockup's: an error at 1440, with
      // the instruction as its detail (mockup-drift-gate.js).
      expect(hierarchy).toMatchObject({ surface: '/', severity: 'error', scheme: 'light' })
      expect(hierarchy.detail).toContain("'deep in' is 44px in the mockup.")
      expect(gate.mockupFindings.some((f) => f.width === 360)).toBe(true)
      // Errors join `findings`, so they force a revision; nothing at 360 does.
      const inFindings = gate.findings.filter((f) => f.kind.startsWith('mockup-'))
      expect(inFindings).toContainEqual(hierarchy)
      expect(inFindings.every((f) => f.severity === 'error' && f.width === 1440)).toBe(true)
      expect(gate.errorCount).toBe(gate.findings.filter((f) => f.severity === 'error').length)

      const without = await runSurfaceGate(opts)
      expect(without.mockupFindings).toBeNull()
    } finally {
      await browser.close()
      server.close()
    }
  }, 90_000)
})
