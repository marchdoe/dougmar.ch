/**
 * The in-page half of the copy gate, against real Chromium (#504).
 * `collectVisibleCopy` is serialised into the page with toString(), the
 * same way the clipping check is, so this proves it runs there.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  collectVisibleCopy,
  readRenderedCopy,
  renderedCopyFindings,
  scanRuns,
} from '../../scripts/utils/copy-gate.js'

const FIXTURES = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'fixtures',
  'copy-gate'
)

describe('collectVisibleCopy', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  it('returns the visible text and the text of allowed elements', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.setContent(
        '<!doctype html><html><body><h1>Select a busy man</h1>' +
          '<p style="display:none">hidden — text</p>' +
          '<blockquote data-allow-copy-tell>Hope — is the thing</blockquote>' +
          '<p>Rebuilt every night</p></body></html>'
      )
      const out = await page.evaluate(
        ([src]) => new Function(`return ${src}`)()(),
        [collectVisibleCopy.toString()]
      )
      expect(out.text).toContain('Select a busy man')
      expect(out.text).toContain('Rebuilt every night')
      expect(out.text).not.toContain('hidden')
      expect(out.allowed).toEqual(['Hope — is the thing'])
    } finally {
      await page.close()
    }
  })
})

describe('the orphan-separator rule in Chromium (#568)', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  /** Load markup, read it the way the gate does, and run the rule over it. */
  async function readPage(html, opts = {}) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    try {
      await page.setContent(`<!doctype html><html><body>${html}</body></html>`)
      const visible = await readRenderedCopy(page)
      return { visible, hits: scanRuns(visible.runs, opts) }
    } finally {
      await page.close()
    }
  }

  const fixture = (name) => readFileSync(path.join(FIXTURES, name), 'utf8')
  const orphans = (hits) => hits.map((h) => `${h.tag} ${h.position} ${h.text}`)

  it('flags the orphans on the real 2026-09-20 /about, and only those', async () => {
    const { visible, hits } = await readPage(fixture('about-2026-09-20-timeline.html'))
    const texts = visible.runs.map((r) => r.text)

    // The heading is one run although React split it into two text nodes.
    expect(texts).toContain(', iCapital')
    expect(orphans(hits)).toEqual([
      'span end 2025,',
      'div start , iCapital',
      'div start , Parallel Markets',
      'div start , Mandiant',
    ])
    // The rows with a role, and the range that reads "2022, 2025", pass.
    expect(texts).toContain('Founder & Consultant, Spaceman')
    expect(texts).toContain('2022, 2025')
  })

  it('flags the orphans on the real 2026-09-19 /about too', async () => {
    const { hits } = await readPage(fixture('about-2026-09-19-timeline.html'))
    expect(orphans(hits)).toEqual([
      'div end 2025 —',
      'div start · iCapital (current)',
      'div start · Parallel Markets',
      'div start · Mandiant',
    ])
  })

  it('reaches the surface gate as errors with the element and the fix', async () => {
    const { visible } = await readPage(fixture('about-2026-09-20-timeline.html'))
    const findings = renderedCopyFindings(visible, { severity: 'error' })
    expect(findings.map((f) => f.tell)).toEqual(Array(4).fill('orphan-separator'))
    expect(findings.every((f) => f.kind === 'copy-tell' && f.severity === 'error')).toBe(true)
    expect(findings[1].detail).toBe(
      'orphan separator in rendered copy: <div> ", iCapital" opens on ",". ' +
        'A field can be empty; render the separator only when both sides exist.'
    )
  })

  it('reads a block at a time, so a heading and the line under it are two runs', async () => {
    const { visible } = await readPage('<div><h2>Spaceman</h2><p>an agency</p></div>')
    expect(visible.runs).toEqual([
      { tag: 'h2', text: 'Spaceman', before: false, after: false },
      { tag: 'p', text: 'an agency', before: false, after: false },
    ])
  })

  it('reads inline children as part of their block', async () => {
    const { visible, hits } = await readPage(
      '<p><em>Doug</em>, <a href="/x">designer</a> and <strong>engineer</strong></p>'
    )
    expect(visible.runs.map((r) => r.text)).toEqual(['Doug, designer and engineer'])
    expect(hits).toEqual([])
  })

  it('counts text nodes only: a bullet the stylesheet draws is not copy', async () => {
    const { visible, hits } = await readPage(
      '<style>li::before{content:"· "}li::after{content:","}</style><ul><li>Product design</li></ul>'
    )
    expect(visible.runs.map((r) => r.text)).toEqual(['Product design'])
    expect(hits).toEqual([])
  })

  it('skips hidden blocks, script and style, and data-allow-copy-tell', async () => {
    const { visible, hits } = await readPage(
      '<p style="display:none">, hidden</p><script>var a = ", script"</script>' +
        '<p data-allow-copy-tell>— Emily</p><div data-allow-copy-tell><p>, inside</p></div>' +
        '<p>Emily, <span data-allow-copy-tell>— kept</span></p>'
    )
    expect(visible.runs.map((r) => r.text)).toEqual(['Emily,'])
    expect(orphans(hits)).toEqual(['p end Emily,'])
  })

  it('leaves a lone divider or an empty-value placeholder alone', async () => {
    const { hits } = await readPage(
      '<table><tr><td>Rate</td><td>—</td></tr></table>' +
        '<div style="display:flex"><span>01</span><span>/</span><span>08</span></div>'
    )
    expect(hits).toEqual([])
  })

  it('leaves a value or a path that starts with a dash or a slash alone', async () => {
    const { hits } = await readPage('<p>-12%</p><p>–3°</p><code>/about</code><p>--nightly</p>')
    expect(hits).toEqual([])
  })

  it('treats a separator that joins two flex items as a join', async () => {
    // A flex row splits "DET · off season · <b>no game</b>" into boxes; the
    // signal log on 2026-09-11 read this way on every page.
    const { hits } = await readPage(
      '<div style="display:flex; gap:8px"><span>sports</span> DET · off season · <b>no game</b></div>'
    )
    expect(hits).toEqual([])
  })

  it('treats the separator on every chip but the last as a join, and a dangling last one as an orphan', async () => {
    const chips = (items) =>
      `<div style="display:flex">${items.map((t) => `<span class="chip">${t}</span>`).join('')}</div>`
    const joined = await readPage(chips(['Product Design ·', 'Prototyping ·', 'Leadership']))
    expect(joined.hits).toEqual([])
    const dangling = await readPage(chips(['Product Design ·', 'Prototyping ·']))
    expect(orphans(dangling.hits)).toEqual(['span end Prototyping ·'])
  })

  it('treats a separator inside unclassed wrapper chips as a join too (2026-06-23)', async () => {
    const { hits } = await readPage(
      '<div style="display:flex">' +
        '<span><span class="t">Product Design</span><span class="d">·</span></span>' +
        '<span><span class="t">Prototyping</span><span class="d">·</span></span>' +
        '<span><span class="t">Leadership</span></span></div>'
    )
    expect(hits).toEqual([])
  })

  it('does not excuse the year beside a heading, which is a different kind of box', async () => {
    const { hits } = await readPage(
      '<div style="display:flex"><span class="year">2025,</span><div class="role">, iCapital</div></div>'
    )
    expect(orphans(hits)).toEqual(['span end 2025,', 'div start , iCapital'])
  })

  it('masks content the pipeline does not write, as the other tells do', async () => {
    const line = 'closing the gap, — every day'
    const { hits } = await readPage(`<p class="a">${line}</p><p class="b">, real orphan</p>`, {
      exemptions: { quoteText: '', contentTexts: [line] },
    })
    expect(orphans(hits)).toEqual(['p start , real orphan'])
  })

  it('reports a repeated run once, with a count', async () => {
    const { hits } = await readPage(
      '<h3 class="a">, a</h3><h3 class="b">, a</h3><h3 class="c">, a</h3>'
    )
    expect(hits).toEqual([{ tag: 'h3', text: ', a', position: 'start', separator: ',', count: 3 }])
  })
})
