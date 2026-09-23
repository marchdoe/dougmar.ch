/**
 * The mockup pre-check: the pure half against hand-built facts, and
 * `readMockupFacts` against real Chromium (layout needs a browser, the way
 * mockup-fidelity-dom.test.js does).
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  evaluateMockupPrecheck,
  formatPrecheckForDesigner,
  lockupOrientation,
  PRECHECK_HEADING,
  precheckMadeProgress,
  readMockupFacts,
} from '../../scripts/utils/mockup-precheck.js'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const LOGO = readFileSync(path.join(REPO, 'app/assets/logo.svg'), 'utf8')
const LOGO_MONO = readFileSync(path.join(REPO, 'app/assets/logo-mono.svg'), 'utf8')

const DECL = {
  measurables: {
    canvas_utilization_min: 76,
    color_coverage_min: 40,
    hero_scale: 'clamp(56px, 8.5vw, 122px)',
  },
  markPx: 44,
  lockup: 'horizontal-md',
  colorMode: 'original',
}

const wideOk = {
  width: 1440,
  height: 900,
  scrollWidth: 1440,
  markCount: 1,
  mark: { heightPx: 44, top: 20, inFold: true, original: true },
  wordmark: { orientation: 'row', gapPx: 12 },
  cutText: [],
}
const narrowOk = { ...wideOk, width: 360, height: 640, scrollWidth: 360 }
const measuredOk = { canvas_utilization: 80, color_coverage: 45, hero_px: 122 }

const keys = (findings) => findings.map((f) => f.key)

describe('evaluateMockupPrecheck', () => {
  it('finds nothing on a page that meets every declaration', () => {
    expect(
      evaluateMockupPrecheck({
        measured: measuredOk,
        wide: wideOk,
        narrow: narrowOk,
        declared: DECL,
      })
    ).toEqual([])
  })

  it('reads 2026-09-11 round 0 as canvas and hero faults (52.1%, 44px)', () => {
    const f = evaluateMockupPrecheck({
      measured: { canvas_utilization: 52.1, color_coverage: 40.2, hero_px: 44 },
      declared: DECL,
    })
    expect(keys(f)).toEqual(['canvas', 'hero'])
    expect(f[0]).toMatchObject({ check: 2, gap: 23.9 })
    expect(f[0].detail).toContain(
      'Canvas utilization measured 52.1% at 1440x900 against a declared floor of 76%'
    )
    expect(f[1].detail).toContain('measures 44px')
    expect(f[1].detail).toContain('122px')
  })

  it('leaves a floor missed by 5 points or less, and a hero inside the band, alone', () => {
    expect(
      evaluateMockupPrecheck({
        measured: { canvas_utilization: 71, color_coverage: 35, hero_px: 100 },
        declared: DECL,
      })
    ).toEqual([])
  })

  it('names a hero that overshoots its clamp (2026-09-16 round 1, 520px against 340px)', () => {
    const f = evaluateMockupPrecheck({
      measured: { canvas_utilization: 100, color_coverage: 100, hero_px: 520 },
      declared: { measurables: { hero_scale: 'clamp(140px, 24vw, 340px)' } },
    })
    expect(keys(f)).toEqual(['hero'])
    expect(f[0].detail).toMatch(/over the 75-125% band/)
  })

  it('reports a missing mark once, not its size and lockup too', () => {
    const f = evaluateMockupPrecheck({
      wide: { ...wideOk, markCount: 0, mark: null, wordmark: null },
      declared: DECL,
    })
    expect(keys(f)).toEqual(['mark-missing'])
    expect(f[0].detail).toContain('at 44px tall')
  })

  it('reports a mark under 60% of mark_px, and not one at 70%', () => {
    const small = evaluateMockupPrecheck({
      wide: { ...wideOk, mark: { ...wideOk.mark, heightPx: 24 } },
      declared: DECL,
    })
    expect(keys(small)).toEqual(['mark-size'])
    expect(small[0]).toMatchObject({ check: 4, gap: 20 })
    const fine = evaluateMockupPrecheck({
      wide: { ...wideOk, mark: { ...wideOk.mark, heightPx: 31 } },
      declared: DECL,
    })
    expect(fine).toEqual([])
  })

  it('reports the wrong colour mode both ways', () => {
    const mono = { ...wideOk, mark: { ...wideOk.mark, original: false } }
    expect(keys(evaluateMockupPrecheck({ wide: mono, declared: DECL }))).toEqual(['mark-mode'])
    expect(
      keys(
        evaluateMockupPrecheck({ wide: wideOk, declared: { ...DECL, colorMode: 'single-color' } })
      )
    ).toEqual(['mark-mode'])
  })

  it('reports a lockup the page does not set', () => {
    const stacked = { ...wideOk, wordmark: { orientation: 'column', gapPx: 8 } }
    expect(evaluateMockupPrecheck({ wide: stacked, declared: DECL })[0].detail).toMatch(
      /declared horizontal-md .*sets the name under the mark/
    )
    const apart = { ...wideOk, wordmark: { orientation: 'apart', gapPx: 600 } }
    expect(evaluateMockupPrecheck({ wide: apart, declared: DECL })[0].detail).toContain(
      'nearest is 600px away'
    )
    expect(
      keys(evaluateMockupPrecheck({ wide: wideOk, declared: { ...DECL, lockup: 'mark-only-md' } }))
    ).toEqual(['lockup'])
    const unclear = { ...wideOk, wordmark: { orientation: 'unclear', gapPx: 10 } }
    expect(evaluateMockupPrecheck({ wide: unclear, declared: DECL })).toEqual([])
  })

  it('reports the phone: mark below the fold, horizontal scroll, cut text', () => {
    const f = evaluateMockupPrecheck({
      wide: wideOk,
      narrow: {
        ...narrowOk,
        scrollWidth: 412,
        mark: { ...narrowOk.mark, top: 900, inFold: false },
        cutText: [{ text: 'TWENTY-SIX', left: 12, right: 520 }],
      },
      declared: DECL,
    })
    expect(keys(f)).toEqual(['mark-fold-360', 'overflow-360', 'text-cut-360'])
    expect(f.every((x) => x.check === 6)).toBe(true)
    expect(f[1].gap).toBe(52)
    expect(f[2].detail).toContain('"TWENTY-SIX" (x 12 to 520)')
  })

  it('skips what it was not given', () => {
    expect(evaluateMockupPrecheck({ measured: null, wide: null, narrow: null })).toEqual([])
  })
})

describe('lockupOrientation', () => {
  it('reads the prefix, retired ids included', () => {
    expect(lockupOrientation('horizontal-sm')).toBe('row')
    expect(lockupOrientation('stacked-lg')).toBe('column')
    expect(lockupOrientation('mark-only-md')).toBe('mark')
    expect(lockupOrientation(null)).toBeNull()
  })
})

describe('formatPrecheckForDesigner', () => {
  const f = [
    { check: 2, key: 'canvas', gap: 10, detail: 'Canvas low.' },
    { check: 4, key: 'mark-missing', gap: 1, detail: 'No mark.' },
  ]
  it('is empty with nothing to say', () => {
    expect(formatPrecheckForDesigner([])).toBe('')
  })
  it('lists the faults under the heading and marks the repeated one STILL PRESENT', () => {
    const text = formatPrecheckForDesigner(f, { previous: [{ key: 'mark-missing' }] })
    expect(text.startsWith(PRECHECK_HEADING)).toBe(true)
    expect(text).toContain('- [check 2] Canvas low.\n')
    expect(text).toMatch(/- \[check 4\] No mark\. STILL PRESENT after your last revision/)
    expect(text).not.toMatch(/Canvas low\. STILL PRESENT/)
  })
})

describe('precheckMadeProgress', () => {
  const canvas = (gap) => ({ key: 'canvas', gap })
  it('counts a first round, a clean round and a cleared fault as progress', () => {
    expect(precheckMadeProgress(null, [canvas(10)])).toBe(true)
    expect(precheckMadeProgress([canvas(10)], [])).toBe(true)
    expect(precheckMadeProgress([canvas(10), { key: 'hero', gap: 5 }], [canvas(12)])).toBe(true)
  })
  it('counts a gap closed by a quarter or more as progress (2026-09-11: 23.9 to 14.1)', () => {
    expect(precheckMadeProgress([canvas(23.9)], [canvas(14.1)])).toBe(true)
  })
  it('stops on the same faults, no closer (2026-09-09: 44.5 then 45.5)', () => {
    expect(precheckMadeProgress([canvas(44.5)], [canvas(45.5)])).toBe(false)
    expect(
      precheckMadeProgress([{ key: 'mark-missing', gap: 1 }], [{ key: 'mark-missing', gap: 1 }])
    ).toBe(false)
  })
  it('stops when a new fault arrives and nothing old moved', () => {
    expect(precheckMadeProgress([canvas(20)], [canvas(19), { key: 'hero', gap: 30 }])).toBe(false)
  })
})

describe('readMockupFacts (Chromium)', () => {
  let browser
  beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })
  afterAll(async () => {
    await browser?.close()
  })

  async function facts(body, { width = 1440, height = 900 } = {}) {
    const page = await browser.newPage({ viewport: { width, height } })
    try {
      await page.setContent(
        `<!doctype html><html><head><style>html,body{margin:0;padding:0}</style></head><body>${body}</body></html>`
      )
      return await page.evaluate(readMockupFacts)
    } finally {
      await page.close()
    }
  }

  const sized = (svg, css) => svg.replace('<svg ', `<svg style="${css}" `)

  it('measures the pasted mark, its colour mode and a horizontal lockup', async () => {
    const f = await facts(
      `<header style="display:flex;align-items:center;gap:12px;padding:20px">${sized(
        LOGO,
        'height:44px;width:auto'
      )}<span style="font-size:24px">Doug March</span></header>`
    )
    expect(f.markCount).toBe(1)
    expect(f.mark).toMatchObject({ heightPx: 44, inFold: true, original: true })
    expect(f.wordmark.orientation).toBe('row')
    expect(f.cutText).toEqual([])
  })

  it('finds the mark by its viewBox when the data attribute was dropped, and reads a stacked lockup', async () => {
    const svg = sized(
      LOGO_MONO.replace('data-brand-mark=""', ''),
      'height:64px;width:auto;color:#222'
    )
    const f = await facts(
      `<header style="display:flex;flex-direction:column;align-items:flex-start;padding:20px">${svg}<span>Doug <b>March</b></span></header>`
    )
    expect(f.mark).toMatchObject({ heightPx: 64, original: false })
    expect(f.wordmark.orientation).toBe('column')
  })

  it('finds a wordmark broken with <br> (2026-09-22)', async () => {
    const f = await facts(
      `<header style="padding:20px">${sized(LOGO_MONO, 'height:52px;width:auto;display:block')}<div style="font-size:28px">Doug<br>March</div></header>`
    )
    expect(f.wordmark.orientation).toBe('column')
  })

  it('reads a mark sized by width alone at its circle height', async () => {
    const f = await facts(sized(LOGO, 'width:71px;height:auto'))
    expect(f.mark.heightPx).toBeCloseTo(59, 0)
  })

  it('reports no mark, and a mark below the fold', async () => {
    expect((await facts('<p>Doug March</p>')).markCount).toBe(0)
    const low = await facts(`<div style="height:1200px"></div>${sized(LOGO, 'height:44px')}`)
    expect(low.mark.inFold).toBe(false)
    expect(low.mark.top).toBe(1200)
  })

  it('lists text cut at the phone edge and horizontal scroll, not ghost texture', async () => {
    const f = await facts(
      `<h1 style="font-size:120px;white-space:nowrap;margin:0">TWENTY-SIX UNDER</h1>` +
        `<div aria-hidden="true" style="font-size:200px;white-space:nowrap">James Castillo</div>` +
        `<div style="opacity:0.08;font-size:200px;white-space:nowrap">Shipley Poston</div>`,
      { width: 360, height: 640 }
    )
    expect(f.scrollWidth).toBeGreaterThan(360)
    expect(f.cutText.map((c) => c.text)).toEqual(['TWENTY-SIX UNDER'])
  })
})
