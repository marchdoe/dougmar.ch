/**
 * The page half of the phone density measurement (#569), against real
 * Chromium: that the walk hands back one box per rendered line of visible
 * text, in document coordinates, and leaves out what a reader cannot see.
 * The last block runs the whole path, `runSurfaceGate` over served pages, and
 * reads the section the critic is handed.
 */
import { createServer } from 'node:http'
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'
import { collectTextRects } from '../../scripts/utils/text-density-page.js'
import { foldDensity } from '../../scripts/utils/text-density.js'
import { runSurfaceGate } from '../../scripts/utils/surface-gate.js'

let browser
beforeAll(async () => {
  browser = await chromium.launch({ headless: true })
})
afterAll(async () => {
  await browser?.close()
})

/** What the walk hands back for a body of html at the phone. */
async function seen(html) {
  const page = await browser.newPage({ viewport: NARROW_VIEWPORT })
  try {
    await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`)
    return await collectTextRects(page)
  } finally {
    await page.close()
  }
}

const MONO = 'font:16px/24px monospace;margin:0'

describe('the text boxes of a page', () => {
  it('is one box per rendered line, in document coordinates, with the page size', async () => {
    const words = Array.from({ length: 20 }, () => 'abcd').join(' ')
    const html = `<div style="height:700px"></div><p style="${MONO};width:20ch">${words}</p>`
    const r = await seen(html)
    expect(r.width).toBe(NARROW_VIEWPORT.width)
    // 700px of spacer and five lines of 24px.
    expect(r.height).toBeGreaterThanOrEqual(700)
    expect(r.rects.length).toBeGreaterThanOrEqual(5)
    for (const [left, top, right, bottom] of r.rects) {
      expect(top).toBeGreaterThanOrEqual(700)
      expect(left).toBeGreaterThanOrEqual(0)
      expect(right).toBeLessThanOrEqual(192 + 1)
      expect(bottom).toBeGreaterThan(top)
    }
  })

  it('leaves out text nobody sees', async () => {
    const html =
      `<p style="${MONO};display:none">gone</p>` +
      `<p style="${MONO};visibility:hidden">hidden</p>` +
      `<p style="${MONO};opacity:0">transparent</p>` +
      `<p style="${MONO};color:transparent">painted in nothing</p>` +
      `<svg width="100" height="20"><text y="15">in svg</text></svg>` +
      `<script>var x = 'script text'</script>`
    expect((await seen(html)).rects).toEqual([])
  })

  it('cuts a box that runs past the right edge to the width of the page', async () => {
    const r = await seen(`<p style="${MONO};white-space:nowrap">${'abcd '.repeat(30)}</p>`)
    expect(r.rects).toHaveLength(1)
    expect(r.rects[0][0]).toBe(0)
    expect(r.rects[0][2]).toBe(NARROW_VIEWPORT.width)
  })

  it('reads whitespace between blocks as nothing', async () => {
    const r = await seen(
      `<div>\n  <p style="${MONO}">one</p>\n  <p style="${MONO}">two</p>\n</div>`
    )
    expect(r.rects).toHaveLength(2)
  })
})

describe('what the boxes come to as a density', () => {
  it('is a small share for a title and a meta line in a tall row, and higher for a paragraph', async () => {
    // The 2026-09-20 register: a 24px title and a 12.64px meta line in a 209px row.
    const row = `<div style="height:209px;box-sizing:border-box;padding:20px 16px"><div style="font:24px/28px monospace">Spaceman</div><div style="font:12.64px/16px monospace">2018, present</div></div>`
    const rows = seen(row.repeat(6))
    const dense = seen(`<p style="${MONO};padding:0 16px">${'abcd '.repeat(600)}</p>`)
    const [sparse, thick] = await Promise.all([rows, dense])
    const sparseFold = foldDensity(sparse).folds[0].ratio
    const thickFold = foldDensity(thick).folds[0].ratio
    expect(sparseFold).toBeLessThan(0.15)
    expect(thickFold).toBeGreaterThan(0.5)
  })
})

// A phone page with a paragraph and then an empty fold, served.
const PAGES = {
  '/': `<h1>Home</h1><a href="/about">About</a><p style="${MONO}">${'abcd '.repeat(200)}</p>`,
  '/about': `<h1>About</h1><a href="/about">About</a><div style="height:1400px"></div><p style="${MONO}">${'abcd '.repeat(60)}</p>`,
  '/work/one': `<h1>One</h1><a href="/about">About</a><div style="height:900px"></div>`,
  '/work/two': `<h1>Two</h1><a href="/about">About</a><div style="height:900px"></div>`,
  '/experiments': `<h1>Lab</h1><div style="height:2000px"></div>`,
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

describe('phone density through runSurfaceGate', () => {
  it('reports the folds of each engineer-owned route in route order, and the section for the critic', async () => {
    const server = await serve()
    try {
      const { port } = server.address()
      const routes = Object.keys(PAGES).map((route) => ({ id: route, route }))
      const gate = await runSurfaceGate({ port, routes })

      // Engineer-owned routes only, in the order they were listed.
      expect(gate.phoneDensity.map((r) => r.route)).toEqual([
        '/',
        '/about',
        '/work/one',
        '/work/two',
      ])
      const about = gate.phoneDensity[1]
      // A 1400px spacer puts the copy in the third fold; the first two are empty.
      expect(about.folds[0].ratio).toBeLessThan(0.05)
      expect(about.lowest.ratio).toBeLessThan(0.05)

      expect(gate.facts).toContain('## Measured phone density')
      expect(gate.facts).toContain('- /about, ')
      expect(gate.facts).toContain('- /work/one, ')
      // The second case study is the one line for the rest.
      expect(gate.facts).toContain('- 1 more case study: the lowest fold is')
      expect(gate.facts).not.toContain('/experiments')
      // A measurement and not a fault: nothing in the findings is density.
      expect(gate.findings.some((f) => /density/.test(f.kind))).toBe(false)
    } finally {
      server.close()
    }
  }, 90_000)
})
