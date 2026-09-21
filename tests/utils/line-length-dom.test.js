/**
 * The page half of the line-length check (#569), against real Chromium.
 *
 * line-length.test.js feeds the rules records built by hand. This proves the
 * records: that the walk counts the characters the browser laid on each line,
 * reads a paragraph whose words sit in inline children, and leaves out what is
 * not running copy. Type is set in a monospace face so a column of `40ch` holds
 * 40 characters and the expected counts are arithmetic, not a font's opinion.
 * The last block runs the whole path, `runSurfaceGate` over served pages.
 */
import { createServer } from 'node:http'
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { NARROW_VIEWPORT, WIDE_VIEWPORT } from '../../elements/chassis/viewports.js'
import { collectLineLength } from '../../scripts/utils/line-length-page.js'
import { LINE_LENGTH_MAX_CHARS } from '../../scripts/utils/responsive-thresholds.js'
import { runSurfaceGate } from '../../scripts/utils/surface-gate.js'

let browser
beforeAll(async () => {
  browser = await chromium.launch({ headless: true })
})
afterAll(async () => {
  await browser?.close()
})

const MONO = 'font:16px/24px monospace;margin:0'

/** The line-length blocks the walk reports for a body of html. */
async function blocksOf(html, viewport = WIDE_VIEWPORT) {
  const page = await browser.newPage({ viewport })
  try {
    await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`)
    return (await collectLineLength(page)).blocks
  } finally {
    await page.close()
  }
}

// Twenty words of four letters and a space: 99 characters, so a 40ch column
// sets it on three lines of 39, 39 and 19.
const WORDS = Array.from({ length: 20 }, () => 'abcd').join(' ')

describe('the characters on each rendered line', () => {
  it('counts what a 40ch column holds, line by line', async () => {
    const [b] = await blocksOf(`<p style="${MONO};width:40ch">${WORDS}</p>`)
    expect(b.lines).toEqual([39, 39, 19])
    expect(b.words).toBe(20)
    expect(b.tag).toBe('p')
    expect(b.sizePx).toBe(16)
    // Forty monospace advances: 9.6px each at 16px, a hair more in some faces.
    expect(b.boxPx).toBeGreaterThanOrEqual(384)
    expect(b.boxPx).toBeLessThanOrEqual(386)
  })

  it('counts a block that sets on one line as that line', async () => {
    const [b] = await blocksOf(`<p style="${MONO}">${WORDS}</p>`)
    expect(b.lines).toEqual([WORDS.length])
  })

  it('counts the space between words held in inline children, and none the source lacks', async () => {
    // "alpha beta, gamma delta epsilon zeta eta theta" is 46 characters.
    const html = `<p style="${MONO}">alpha <em>beta</em>, <a href="#">gamma</a> <span>delta epsilon</span> zeta eta theta</p>`
    const [b] = await blocksOf(html)
    expect(b.lines).toEqual([46])
  })

  it('reads a paragraph whose every word sits in an inline child', async () => {
    const [b] = await blocksOf(`<p style="${MONO};width:40ch"><em>${WORDS}</em></p>`)
    expect(b.lines).toEqual([39, 39, 19])
  })

  it('counts a li and a blockquote as it counts a p', async () => {
    const html =
      `<ul style="${MONO};width:40ch"><li>${WORDS}</li></ul>` +
      `<blockquote style="${MONO};width:40ch">${WORDS}</blockquote>`
    const blocks = await blocksOf(html)
    expect(blocks.map((b) => b.tag)).toEqual(['li', 'blockquote'])
    expect(blocks.map((b) => b.lines)).toEqual([
      [39, 39, 19],
      [39, 39, 19],
    ])
  })

  it('counts at the width of the viewport it is run at', async () => {
    const html = `<p style="font:16px/24px monospace;margin:0">${WORDS.repeat(1)}</p>`
    const narrow = `<p style="font:16px/24px monospace;margin:0">${WORDS} ${WORDS} ${WORDS}</p>`
    const [wide] = await blocksOf(html)
    const [phone] = await blocksOf(narrow, NARROW_VIEWPORT)
    expect(wide.lines).toHaveLength(1)
    // 360px holds 37 monospace characters at 16px, so no line passes 37.
    expect(Math.max(...phone.lines)).toBeLessThanOrEqual(37)
    expect(phone.lines.length).toBeGreaterThan(3)
  })
})

describe('what is not running copy', () => {
  it('skips a block of fewer than eight words', async () => {
    expect(await blocksOf(`<p style="${MONO}">one two three four five six seven</p>`)).toEqual([])
    expect(
      await blocksOf(`<p style="${MONO}">one two three four five six seven eight</p>`)
    ).toHaveLength(1)
  })

  it('skips code, preformatted text and anything inside them', async () => {
    const html =
      `<pre style="${MONO}">${WORDS}</pre>` +
      `<code style="${MONO}"><p>${WORDS}</p></code>` +
      `<pre style="${MONO}"><p>${WORDS}</p></pre>`
    expect(await blocksOf(html)).toEqual([])
  })

  it('keeps inline code inside a paragraph as part of its line', async () => {
    const html = `<p style="${MONO}">alpha beta gamma delta <code>epsilon</code> zeta eta theta</p>`
    const [b] = await blocksOf(html)
    expect(b.lines).toEqual(['alpha beta gamma delta epsilon zeta eta theta'.length])
  })

  it('skips what a reader cannot see', async () => {
    const html =
      `<p style="${MONO};display:none">${WORDS}</p>` +
      `<p style="${MONO};visibility:hidden">${WORDS}</p>` +
      `<p style="${MONO};opacity:0">${WORDS}</p>`
    expect(await blocksOf(html)).toEqual([])
  })

  it('leaves out words a paragraph holds in a hidden inline child', async () => {
    const html = `<p style="${MONO}">alpha beta gamma delta epsilon zeta eta <span style="display:none">${WORDS}</span>theta</p>`
    const [b] = await blocksOf(html)
    expect(b.lines).toEqual(['alpha beta gamma delta epsilon zeta eta theta'.length])
  })

  it('skips a flex li that lays a number, a label and a sentence in columns', async () => {
    // The "lines" of a row of columns run across them; the block in each
    // column is what is measured.
    const html = `<ul style="${MONO}"><li style="display:flex;gap:16px"><span>01</span><span>Signals</span><p style="margin:0;width:30ch">${WORDS}</p></li></ul>`
    const blocks = await blocksOf(html)
    expect(blocks.map((b) => b.tag)).toEqual(['p'])
    // Only the paragraph's own lines, none of them run across the columns.
    expect(Math.max(...blocks[0].lines)).toBeLessThanOrEqual(30)
  })

  it('measures a p nested in a li for the p, not for the li', async () => {
    const html = `<ul style="${MONO};width:40ch"><li><p style="margin:0">${WORDS}</p></li></ul>`
    const blocks = await blocksOf(html)
    expect(blocks.map((b) => b.tag)).toEqual(['p'])
  })

  it('skips a block inside inline svg', async () => {
    const html = `<svg width="100" height="100"><foreignObject width="100" height="100"><p xmlns="http://www.w3.org/1999/xhtml">${WORDS}</p></foreignObject></svg>`
    expect(await blocksOf(html)).toEqual([])
  })
})

// A wide paragraph on each route: 150 monospace characters a line at 1440,
// 85 at the tablet, 37 at the phone. Only the phone passes.
const LONG = Array.from({ length: 60 }, () => 'abcd').join(' ')
const PAGES = {
  '/about': `<h1>About</h1><a href="/about">About</a><p style="${MONO}">${LONG}</p>`,
  '/': `<h1>Home</h1><a href="/about">About</a><p style="${MONO};max-width:40ch">${LONG}</p>`,
  '/experiments': `<h1>Lab</h1><p style="${MONO}">${LONG}</p>`,
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

describe('line length through runSurfaceGate', () => {
  it('reports the wide paragraph at the tablet and the desktop, once, and owns it by route', async () => {
    const server = await serve()
    try {
      const { port } = server.address()
      const { findings } = await runSurfaceGate({
        port,
        routes: [
          { id: 'home', route: '/' },
          { id: 'about', route: '/about' },
          { id: 'lab', route: '/experiments' },
        ],
      })
      const long = findings.filter((f) => f.kind === 'line-length')
      // One fault for `/about`, folded across the tablet and the desktop and
      // both schemes; one for `/experiments`, which no agent owns; none for
      // `/`, whose column is capped at 40ch.
      expect(long.map((f) => `${f.surface}:${f.owner}:${f.severity}`).sort()).toEqual([
        '/about:react-engineer:error',
        '/experiments:human:error',
      ])
      const about = long.find((f) => f.surface === '/about')
      // The worst reading is the widest rung.
      expect(about.width).toBe(WIDE_VIEWPORT.width)
      // Monospace advances differ by a hair between systems: 149 or 150.
      expect(about.detail).toMatch(/sets 1[45]\d characters on its longest line \(2 lines/)
      expect(about.detail).toContain(`over the ${LINE_LENGTH_MAX_CHARS} limit`)
      expect(about.detail).toMatch(/Also on \/about at 820px/)
    } finally {
      server.close()
    }
  }, 60_000)
})
