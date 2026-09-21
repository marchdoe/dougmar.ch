/**
 * The page half of the type-size floors (#567), against real Chromium.
 *
 * small-text.test.js feeds the rules records built by hand. This proves the
 * records: that the walk finds running copy by its own tag and size, finds any
 * visible text by size whatever the tag, and leaves out what a reader cannot
 * see. Each case is a page shape that shipped, or one the walk could get wrong.
 */
import { createServer } from 'node:http'
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { NARROW_VIEWPORT, WIDE_VIEWPORT } from '../../elements/chassis/viewports.js'
import {
  SMALL_COPY_FLOOR_PX,
  SMALL_TEXT_FLOOR_PX,
} from '../../scripts/utils/responsive-thresholds.js'
import { SMALL_TEXT_OPTIONS, smallTextFindings } from '../../scripts/utils/small-text.js'
import { faultsForOwner, runSurfaceGate } from '../../scripts/utils/surface-gate.js'
import { collectTextContrast } from '../../scripts/utils/text-contrast-page.js'

let browser
beforeAll(async () => {
  browser = await chromium.launch({ headless: true })
})
afterAll(async () => {
  await browser?.close()
})

const RUNGS = {
  mobile: NARROW_VIEWPORT,
  desktop: WIDE_VIEWPORT,
}

/** The page walk's small-text records for a body of html. */
async function walk(html, rung = 'mobile') {
  const page = await browser.newPage({ viewport: RUNGS[rung] })
  try {
    await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`)
    return (await collectTextContrast(page)).smallText.entries
  } finally {
    await page.close()
  }
}

/** What the gate would report for the page, engineer-owned route. */
async function findingsFor(html, rung = 'mobile') {
  const entries = await walk(html, rung)
  return smallTextFindings(
    { viewport: rung, textContrast: { smallText: { entries } } },
    'react-engineer'
  )
}

const kinds = (findings) => findings.map((f) => f.kind)
const sized = (tag, px, text = 'Design systems, mostly.') =>
  `<${tag} style="font-size:${px}px">${text}</${tag}>`

/** A hair under a floor, at a size a browser reports exactly. */
const UNDER_COPY = SMALL_COPY_FLOOR_PX - 0.1
const UNDER_TEXT = SMALL_TEXT_FLOOR_PX - 0.1

describe.each(['mobile', 'desktop'])(
  'running copy at the %s rung, by its own tag and size',
  (rung) => {
    const inMain = (html) => `<main>${html}</main>`

    it.each(['p', 'li', 'blockquote'])('flags a <%s> just under the floor', async (tag) => {
      const html = tag === 'li' ? `<ul>${sized('li', UNDER_COPY)}</ul>` : sized(tag, UNDER_COPY)
      const findings = await findingsFor(inMain(html), rung)
      expect(kinds(findings)).toEqual(['small-copy'])
      expect(findings[0].sizePx).toBe(UNDER_COPY)
      expect(findings[0].severity).toBe('error')
      expect(findings[0].detail).toContain(tag)
    })

    it.each(['p', 'li', 'blockquote'])('leaves a <%s> at the floor alone', async (tag) => {
      const html =
        tag === 'li'
          ? `<ul>${sized('li', SMALL_COPY_FLOOR_PX)}</ul>`
          : sized(tag, SMALL_COPY_FLOOR_PX)
      expect(await findingsFor(inMain(html), rung)).toEqual([])
    })

    it('reads a paragraph whose words all sit in an inline child', async () => {
      // The paragraph has no text node of its own, so only its tag finds it.
      const html = `<p style="font-size:${UNDER_COPY}px"><em>Design systems, mostly.</em></p>`
      expect(kinds(await findingsFor(inMain(html), rung))).toEqual(['small-copy'])
    })

    it('skips a paragraph shorter than eight characters', async () => {
      expect(await findingsFor(inMain(sized('p', UNDER_COPY, 'Seven c')), rung)).toEqual([])
    })

    it('does not call a small span inside a full-size paragraph running copy', async () => {
      const html = `<p style="font-size:${SMALL_COPY_FLOOR_PX}px">Design systems, <span style="font-size:${UNDER_TEXT}px">mostly</span>.</p>`
      expect(kinds(await findingsFor(inMain(html), rung))).toEqual(['small-text'])
    })

    it('does not look for running copy outside main, when there is a main', async () => {
      const html = `<main>${sized('p', SMALL_COPY_FLOOR_PX)}</main><footer>${sized('p', UNDER_COPY)}</footer>`
      expect(await findingsFor(html, rung)).toEqual([])
    })

    it('looks in the whole body when there is no main', async () => {
      expect(kinds(await findingsFor(sized('p', UNDER_COPY), rung))).toEqual(['small-copy'])
    })
  }
)

describe('running copy records', () => {
  it('are one record for a repeated chain, with a count', async () => {
    const items = Array.from({ length: 5 }, () => sized('li', 12)).join('')
    const entries = await walk(`<main><ul>${items}</ul></main>`)
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({ tag: 'li', sizePx: 12, running: true, count: 5 })
  })

  it('keep two sizes of one chain apart', async () => {
    const html = `<main><ul>${sized('li', 12)}${sized('li', 13)}</ul></main>`
    expect((await walk(html)).map((e) => e.sizePx).sort()).toEqual([12, 13])
  })
})

describe('any visible text, whatever its tag', () => {
  it.each(['span', 'div', 'dt', 'small', 'h3', 'a', 'button', 'label', 'p', 'li'])(
    'flags a <%s> just under the text floor and not at it, at both rungs',
    async (tag) => {
      const wrap = (inner) => `<main>${inner}</main>`
      for (const rung of ['mobile', 'desktop']) {
        const small = await findingsFor(wrap(sized(tag, UNDER_TEXT, 'Specimen No 4')), rung)
        expect(small.map((f) => f.sizePx)).toEqual([UNDER_TEXT])
        expect(small[0].severity).toBe('error')
        const atFloor = await findingsFor(
          wrap(sized(tag, SMALL_TEXT_FLOOR_PX, 'Specimen No 4')),
          rung
        )
        // Running copy at the text floor is still under the running-copy floor.
        expect(kinds(atFloor).filter((k) => k === 'small-text')).toEqual([])
      }
    }
  )

  it('is one small-copy finding, not two, for a paragraph under both floors', async () => {
    expect(kinds(await findingsFor(`<main>${sized('p', UNDER_TEXT)}</main>`))).toEqual([
      'small-copy',
    ])
  })

  it('reports a label under the text floor', async () => {
    const html = `<main><span style="font-size:${UNDER_TEXT}px;text-transform:uppercase">Field notes</span></main>`
    const [f] = await findingsFor(html, 'desktop')
    expect(f).toMatchObject({ kind: 'small-text', sizePx: UNDER_TEXT, owner: 'react-engineer' })
    expect(f.detail).toContain('Field notes')
  })

  it('takes text with no letters or digits for decoration', async () => {
    expect(await findingsFor(`<main>${sized('span', 8, '/ — ·')}</main>`)).toEqual([])
  })

  it('reports the size a child inherits, on the child that holds the words', async () => {
    const html = `<main><div style="font-size:10px"><b>Inherited</b></div></main>`
    const entries = await walk(html)
    expect(entries.map((e) => [e.tag, e.sizePx])).toEqual([['b', 10]])
  })
})

describe('text a reader cannot see', () => {
  const tiny = 'font-size:9px'
  const cases = {
    'display: none': `<span style="${tiny};display:none">Hidden label</span>`,
    'the hidden attribute': `<span hidden style="${tiny}">Hidden label</span>`,
    'visibility: hidden': `<span style="${tiny};visibility:hidden">Hidden label</span>`,
    'opacity: 0': `<span style="${tiny};opacity:0">Hidden label</span>`,
    'a parent at opacity: 0': `<div style="opacity:0"><span style="${tiny}">Hidden label</span></div>`,
    'a parent at display: none': `<div style="display:none"><span style="${tiny}">Hidden label</span></div>`,
    'the sr-only pattern': `<span style="${tiny};position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">Skip to content</span>`,
    'a box parked off the left edge': `<span style="${tiny};position:absolute;left:-9999px">Hidden label</span>`,
    'a box parked off the top edge': `<span style="${tiny};position:absolute;top:-9999px">Hidden label</span>`,
    'inline svg': `<svg width="200" height="40"><text x="0" y="20" font-size="9">Axis label</text></svg>`,
    'fully transparent ink': `<span style="${tiny};color:transparent">Hidden label</span>`,
  }

  for (const [name, html] of Object.entries(cases)) {
    it(`is not reported: ${name}`, async () => {
      expect(await walk(`<main>${html}</main>`)).toEqual([])
      expect(await findingsFor(`<main>${html}</main>`, 'desktop')).toEqual([])
    })
  }

  it('is not reported for running copy that is hidden either', async () => {
    const html = `<main><p style="font-size:12px;display:none">Design systems, mostly.</p><ul style="opacity:0"><li style="font-size:12px">Design systems, mostly.</li></ul></main>`
    expect(await findingsFor(html)).toEqual([])
  })

  it('still reports the visible neighbour of a hidden one', async () => {
    const html = `<main><span style="${tiny};display:none">Hidden label</span><span style="${tiny}">Shown label</span></main>`
    expect((await walk(html)).map((e) => e.sample)).toEqual(['Shown label'])
  })
})

describe('parts the orchestrator writes', () => {
  const parts = [
    [
      'BrandLockup',
      '<div><span data-brand-mark></span><span style="font-size:10px">Doug March</span></div>',
    ],
    [
      'SiteCallout',
      '<aside data-site-callout><span style="font-size:10px">How this is made</span></aside>',
    ],
    [
      'WhitePaper',
      '<section data-white-paper><span style="font-size:10px">Read the paper</span></section>',
    ],
    ['Material', '<div data-ground-material><span style="font-size:10px">Paper grain</span></div>'],
    [
      'the archive link',
      '<nav data-archive-link><a href="/archive" style="font-size:10px">Archive</a></nav>',
    ],
  ]

  for (const [name, html] of parts) {
    it(`is owned by the human: ${name}`, async () => {
      const findings = await findingsFor(`<main>${html}</main>`, 'desktop')
      expect(findings).toHaveLength(1)
      expect(findings[0]).toMatchObject({ kind: 'small-text', owner: 'human', severity: 'error' })
      expect(findings[0].detail).toContain('written by the orchestrator')
    })
  }

  it('is owned by the human for running copy inside a part too', async () => {
    const html = `<main><aside data-site-callout>${sized('p', UNDER_COPY)}</aside>${sized('p', UNDER_COPY)}</main>`
    const findings = await findingsFor(html)
    expect(findings.map((f) => f.owner).sort()).toEqual(['human', 'react-engineer'])
  })
})

describe('the walk is bounded', () => {
  it('hands back no more distinct chains than it is allowed', async () => {
    const spans = Array.from(
      { length: SMALL_TEXT_OPTIONS.maxCandidates + 50 },
      (_, i) => `<span class="c${i}" style="font-size:10px">Label ${i}</span>`
    ).join('')
    const entries = await walk(`<main>${spans}</main>`)
    expect(entries).toHaveLength(SMALL_TEXT_OPTIONS.maxCandidates)
  })
})

describe('through runSurfaceGate, the whole path', () => {
  // A page served over http, walked at both rungs in both schemes: four
  // measurements of one route, folded to one finding per fault.
  const PAGE = `<!doctype html><html><body><main>
    <h1>Title</h1>
    <p style="font-size:${UNDER_COPY}px">Design systems, mostly.</p>
    <span style="font-size:${UNDER_TEXT}px">Field notes</span>
    <aside data-site-callout><span style="font-size:${UNDER_TEXT}px">How this is made</span></aside>
  </main></body></html>`

  it('reports each fault once, as an error, routed by owner', async () => {
    const server = createServer((_req, res) => {
      res.setHeader('content-type', 'text/html')
      res.end(PAGE)
    })
    await new Promise((resolve) => server.listen(0, resolve))
    try {
      const { port } = server.address()
      const { findings, errorCount } = await runSurfaceGate({
        port,
        routes: [{ id: 'home', route: '/' }],
      })
      const small = findings.filter((f) => f.kind === 'small-copy' || f.kind === 'small-text')
      expect(small.map((f) => `${f.kind}:${f.owner}`).sort()).toEqual([
        'small-copy:react-engineer',
        'small-text:human',
        'small-text:react-engineer',
      ])
      expect(small.every((f) => f.severity === 'error')).toBe(true)
      expect(errorCount).toBeGreaterThanOrEqual(small.length)
      const mine = faultsForOwner(findings, 'react-engineer').filter((f) => small.includes(f))
      expect(mine.map((f) => f.kind).sort()).toEqual(['small-copy', 'small-text'])
    } finally {
      await new Promise((resolve) => server.close(resolve))
    }
  }, 60000)
})
