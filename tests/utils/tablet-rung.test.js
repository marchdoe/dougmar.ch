/**
 * The surface gate's tablet rung (#565).
 *
 * The gate measured a phone and a desktop and nothing between them. The tablet
 * rung asks two questions at the width in between: does the document overflow,
 * and is anything cut off. Every other check stays where it was, and these
 * tests hold that: the tablet measurement carries no tap targets, no brand
 * mark, no text contrast, no h1 or nav facts, so a phone-only or desktop-only
 * finding cannot appear at 820, and a contrast finding cannot be reported
 * three times.
 */
import { describe, expect, it } from 'vitest'
import {
  NARROW_VIEWPORT,
  TABLET_VIEWPORT,
  WIDE_VIEWPORT,
} from '../../elements/chassis/viewports.js'
import {
  VIEWPORT_RUNGS,
  evaluateMeasurement,
  faultsForOwner,
  findingLocation,
  formatFindingsForCritic,
  measureRoute,
} from '../../scripts/utils/surface-gate.js'
import { TABLET_RUNG, tabletMeasurement } from '../../scripts/utils/tablet-rung.js'

const tabletRung = VIEWPORT_RUNGS.find((v) => v.name === TABLET_RUNG)

describe('the rungs', () => {
  it('are the phone, the tablet and the desktop, in width order', () => {
    expect(VIEWPORT_RUNGS.map((v) => v.name)).toEqual(['mobile', TABLET_RUNG, 'desktop'])
    expect(VIEWPORT_RUNGS.map((v) => v.width)).toEqual([
      NARROW_VIEWPORT.width,
      TABLET_VIEWPORT.width,
      WIDE_VIEWPORT.width,
    ])
  })

  it('give the tablet its constant, height included', () => {
    expect({ width: tabletRung.width, height: tabletRung.height }).toEqual({
      width: TABLET_VIEWPORT.width,
      height: TABLET_VIEWPORT.height,
    })
  })

  it('put the tablet strictly between the phone and the desktop', () => {
    expect(TABLET_VIEWPORT.width).toBeGreaterThan(NARROW_VIEWPORT.width)
    expect(TABLET_VIEWPORT.width).toBeLessThan(WIDE_VIEWPORT.width)
  })
})

describe('tabletMeasurement', () => {
  const base = { id: 'home', route: '/', viewport: TABLET_RUNG, scheme: 'light' }
  const box = {
    scrollWidth: 900,
    clientWidth: 820,
    allowsXOverflow: false,
    h1Count: 0,
    visibleAboutLinks: 0,
    worstCopy: { chars: 400, fontSizePx: 90, sample: 'x' },
  }

  it('keeps what the two tablet questions read, and nothing the other rungs answer', () => {
    const m = tabletMeasurement(base, { status: 200, box, clipped: [] })
    expect(m).toEqual({
      ...base,
      status: 200,
      scrollWidth: 900,
      clientWidth: 820,
      allowsXOverflow: false,
      clipped: [],
      consoleErrors: [],
    })
  })

  it('reads clean through evaluateMeasurement even for a page that would fail every desktop check', () => {
    // h1Count 0, no /about link and 90px prose would each be an error at the
    // other rungs. At the tablet none of that was measured, so none is reported.
    const m = tabletMeasurement(base, {
      status: 200,
      box: { ...box, scrollWidth: 820 },
      clipped: [],
    })
    expect(evaluateMeasurement(m)).toEqual([])
  })
})

describe('what the tablet reports', () => {
  const at = (extra) =>
    tabletMeasurement(
      { id: 'home', route: '/', viewport: TABLET_RUNG, scheme: 'light' },
      {
        status: 200,
        box: { scrollWidth: 820, clientWidth: 820, allowsXOverflow: false },
        clipped: [],
        ...extra,
      }
    )

  it('an overflowing document is an error that names the tablet width', () => {
    const findings = evaluateMeasurement(
      at({ box: { scrollWidth: 1000, clientWidth: 820, allowsXOverflow: false } })
    )
    expect(findings).toHaveLength(1)
    expect(findings[0]).toMatchObject({ kind: 'overflow', severity: 'error' })
    expect(findings[0].detail).toContain(`${TABLET_VIEWPORT.width}px viewport`)
  })

  it('cut-off text is an error and a cut-off box without text is a warning', () => {
    const findings = evaluateMeasurement(
      at({
        clipped: [
          { tag: 'H2', text: 'Design systems', cause: 'text', right: 700, over: 40, boxWidth: 300 },
          { tag: 'DIV', text: '', cause: 'viewport', right: 900, over: 80, boxWidth: 900 },
        ],
      })
    )
    expect(findings.map((f) => `${f.kind}:${f.severity}`)).toEqual([
      'clipped:error',
      'clipped:warning',
    ])
  })

  it('a phone-only advisory does not ride along even when the measurement carries one', () => {
    const withTapTargets = { ...at(), tapTargets: [{ text: 'work', count: 1, w: 30, h: 20 }] }
    expect(evaluateMeasurement(withTapTargets).map((f) => f.kind)).not.toContain('tap-target')
  })

  it('an unreachable page is still an error at the tablet', () => {
    const findings = evaluateMeasurement({
      id: 'home',
      route: '/',
      viewport: TABLET_RUNG,
      scheme: 'light',
      error: 'net::ERR_TIMED_OUT',
    })
    expect(findings).toEqual([
      { kind: 'unreachable', severity: 'error', detail: 'net::ERR_TIMED_OUT' },
    ])
  })
})

describe('the tablet finding, as the repair brief and the archive print it', () => {
  const finding = {
    surface: '/',
    viewport: TABLET_RUNG,
    width: TABLET_VIEWPORT.width,
    scheme: 'light',
    kind: 'overflow',
    severity: 'error',
    detail: 'document is 180px wider than the 820px viewport (scrollWidth 1000)',
  }

  it('is labelled @<width> in a log line and in the archived feedback', () => {
    expect(findingLocation(finding)).toBe(`/ @${TABLET_VIEWPORT.width}`)
    expect(findingLocation(finding, { scheme: true })).toBe(`/ @${TABLET_VIEWPORT.width} (light)`)
  })

  it('names its width in the block the engineer is handed', () => {
    const out = formatFindingsForCritic([finding, { ...finding, scheme: 'dark' }])
    expect(out).toContain(`- [error] / at ${TABLET_VIEWPORT.width}px (both schemes):`)
  })

  it('is an engineer-owned fault on an engineer-owned route', () => {
    expect(faultsForOwner([finding], 'react-engineer')).toEqual([finding])
    expect(faultsForOwner([{ ...finding, surface: '/experiments' }], 'react-engineer')).toEqual([])
  })
})

/**
 * A stand-in page that records which in-page function each evaluate was
 * handed, the way surface-gate.test.js does for the phone guard.
 */
function fakeBrowser() {
  const ran = []
  const page = {
    on() {},
    async goto() {
      return { status: () => 200 }
    },
    async waitForTimeout() {},
    viewportSize() {
      return null
    },
    async evaluate(_fn, arg) {
      const src = Array.isArray(arg) ? arg[0] : null
      let name = null
      if (typeof src === 'string') name = src.match(/^function (\w+)/)?.[1] ?? null
      else if (src && typeof src === 'object' && 'collect' in src) name = 'collectTextContrast'
      if (name) ran.push(name)
      if (name === 'findClippedElements') return []
      return name ? null : { scrollWidth: 820, clientWidth: 820 }
    },
    async close() {},
  }
  return { ran, browser: { newPage: async () => page } }
}

describe('measureRoute on the tablet rung', () => {
  const surface = { id: 'home', route: '/' }

  it('asks for clipping and nothing that belongs to another rung', async () => {
    const { ran, browser } = fakeBrowser()
    const m = await measureRoute(browser, 'http://x', surface, tabletRung, 'light')
    expect(ran).toContain('findClippedElements')
    for (const other of ['findTapTargetFailures', 'findBrandMark', 'collectTextContrast']) {
      expect(ran).not.toContain(other)
    }
    expect(m.viewport).toBe(TABLET_RUNG)
    expect(m.tapTargets).toBeUndefined()
    expect(m.brand).toBeUndefined()
    expect(m.textContrast).toBeUndefined()
    expect(m.visibleCopy).toBeUndefined()
  })

  it('leaves the phone and desktop rungs asking what they asked before', async () => {
    const phone = fakeBrowser()
    await measureRoute(phone.browser, 'http://x', surface, VIEWPORT_RUNGS[0], 'light')
    expect(phone.ran).toEqual(
      expect.arrayContaining(['findClippedElements', 'findBrandMark', 'findTapTargetFailures'])
    )
    const desktop = fakeBrowser()
    await measureRoute(desktop.browser, 'http://x', surface, VIEWPORT_RUNGS[2], 'light')
    expect(desktop.ran).toEqual(expect.arrayContaining(['findClippedElements', 'findBrandMark']))
    expect(desktop.ran).not.toContain('findTapTargetFailures')
  })
})
