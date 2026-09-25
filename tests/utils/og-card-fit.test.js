/**
 * The share card's findings, and how they reach the engineer: measured once
 * at 1200x630 in light, asked only whether the card fits, owned by the
 * engineer, and worded the same every round so STILL PRESENT can match them.
 * The probe itself is proved against Chromium in og-card-fit-dom.test.js.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  describeOgFault,
  MAX_OG_FIT_REPORTED,
  OG_CARD_ROUTE,
  OG_CARD_VIEWPORT,
  OG_FIT_FIX,
  OG_SAFE_MARGIN_PX,
  ogFitFindings,
} from '../../scripts/utils/og-card-fit.js'
import {
  evaluateMeasurement,
  faultsForOwner,
  formatFindingsForCritic,
  gateJobs,
  ownerForSurface,
  VIEWPORT_RUNGS,
} from '../../scripts/utils/surface-gate.js'

/** 2026-09-23's second headline line, as the probe measured it on the replay. */
const BOTTOM = {
  name: 'headline',
  line: 2,
  text: 'Not a generalist.',
  fault: 'card',
  edge: 'bottom',
  px: 58,
}
/** 2026-09-25's mark, 40px past the left edge. */
const LEFT_MARK = { name: 'brand mark', fault: 'card', edge: 'left', px: 40 }

const ogMeasurement = (ogFit, extra = {}) => ({
  id: 'og',
  route: OG_CARD_ROUTE,
  viewport: OG_CARD_VIEWPORT.name,
  scheme: 'light',
  status: 200,
  ogFit,
  ...extra,
})

describe('describeOgFault', () => {
  it('names the element, the edge and the distance, then the fix', () => {
    expect(describeOgFault(BOTTOM)).toBe(
      `og: headline line 2 'Not a generalist.' ends 58px below the card's bottom edge. ${OG_FIT_FIX}`
    )
    expect(describeOgFault(LEFT_MARK)).toBe(
      `og: brand mark starts 40px left of the card's left edge. ${OG_FIT_FIX}`
    )
  })

  it('says which box cut a line, and how far inside the margin a line sits', () => {
    const cut = { ...BOTTOM, fault: 'clip', px: 30, by: 'div.ov_hidden', overflow: 'hidden' }
    expect(describeOgFault(cut)).toContain(
      "headline line 2 'Not a generalist.' is cut 30px at its bottom edge by <div.ov_hidden> (overflow: hidden)"
    )
    const near = {
      name: 'wordmark',
      line: 1,
      text: 'Doug March',
      fault: 'margin',
      edge: 'left',
      px: 10,
    }
    expect(describeOgFault(near)).toContain(
      `wordmark line 1 'Doug March' starts ${OG_SAFE_MARGIN_PX - 10}px from the card's left edge, ` +
        `inside the ${OG_SAFE_MARGIN_PX}px safe margin`
    )
  })

  it('never reports a negative distance for a line on the edge itself', () => {
    const onEdge = { ...BOTTOM, fault: 'margin', px: OG_SAFE_MARGIN_PX + 1 }
    expect(describeOgFault(onEdge)).toContain('ends 0px from')
  })
})

describe('ogFitFindings', () => {
  it('is an error per fault, capped', () => {
    const many = Array.from({ length: MAX_OG_FIT_REPORTED + 3 }, (_, i) => ({
      ...BOTTOM,
      line: i + 1,
    }))
    const findings = ogFitFindings({ ogFit: many })
    expect(findings).toHaveLength(MAX_OG_FIT_REPORTED)
    expect(findings.every((f) => f.kind === 'og-fit' && f.severity === 'error')).toBe(true)
  })

  it('is nothing for a measurement that did not probe the card', () => {
    expect(ogFitFindings({})).toEqual([])
    expect(ogFitFindings({ ogFit: null })).toEqual([])
  })
})

describe('the share card in the surface gate', () => {
  it('is measured once, at the capture size in light, whatever the rungs', () => {
    const jobs = gateJobs(
      [
        { id: 'home', route: '/' },
        { id: 'og', route: OG_CARD_ROUTE },
      ],
      VIEWPORT_RUNGS,
      ['light', 'dark']
    )
    const og = jobs.filter((j) => j.surface.route === OG_CARD_ROUTE)
    expect(og).toEqual([
      { surface: { id: 'og', route: OG_CARD_ROUTE }, viewport: OG_CARD_VIEWPORT, scheme: 'light' },
    ])
    expect(OG_CARD_VIEWPORT).toMatchObject({ width: 1200, height: 630 })
    expect(jobs.filter((j) => j.surface.route === '/')).toHaveLength(VIEWPORT_RUNGS.length * 2)
  })

  it('measures the size and scheme the archive phase captures', () => {
    // captureRouteScreenshot opens its page with no colour scheme, which is light.
    const src = readFileSync(new URL('../../scripts/utils/snapshot.js', import.meta.url), 'utf8')
    const capture = src.slice(src.indexOf('export async function captureRouteScreenshot'))
    expect(capture).toContain(
      `{ port, width = ${OG_CARD_VIEWPORT.width}, height = ${OG_CARD_VIEWPORT.height} }`
    )
    expect(capture.slice(0, capture.indexOf('newPage(') + 80)).not.toContain('colorScheme')
  })

  it('asks the card only whether it loaded and whether it fits', () => {
    // A card has no nav, no fold and no running copy; those page checks
    // would otherwise fire on it.
    const findings = evaluateMeasurement(
      ogMeasurement([BOTTOM], {
        h1Count: 0,
        visibleAboutLinks: 0,
        scrollWidth: 1400,
        clientWidth: 1200,
      })
    )
    expect(findings.map((f) => f.kind)).toEqual(['og-fit'])
    expect(evaluateMeasurement(ogMeasurement([], { status: 404 })).map((f) => f.kind)).toEqual([
      'status',
    ])
  })

  it('passes a card that fits', () => {
    expect(evaluateMeasurement(ogMeasurement([]))).toEqual([])
  })

  it("is the engineer's, so it forces a revision", () => {
    expect(ownerForSurface(OG_CARD_ROUTE)).toBe('react-engineer')
    const placed = evaluateMeasurement(ogMeasurement([BOTTOM, LEFT_MARK])).map((f) => ({
      surface: OG_CARD_ROUTE,
      viewport: OG_CARD_VIEWPORT.name,
      width: OG_CARD_VIEWPORT.width,
      scheme: 'light',
      ...f,
    }))
    expect(faultsForOwner(placed, 'react-engineer')).toHaveLength(2)
    expect(faultsForOwner(placed, 'human')).toEqual([])
  })

  it('marks the same fault STILL PRESENT in the next round', () => {
    const place = (f) => ({
      surface: OG_CARD_ROUTE,
      viewport: OG_CARD_VIEWPORT.name,
      width: OG_CARD_VIEWPORT.width,
      scheme: 'light',
      ...f,
    })
    const round1 = evaluateMeasurement(ogMeasurement([BOTTOM])).map(place)
    const round2 = evaluateMeasurement(ogMeasurement([BOTTOM])).map(place)
    const brief = formatFindingsForCritic(round2, { previous: round1 })
    expect(brief).toContain(`${OG_CARD_ROUTE} at 1200px (light)`)
    expect(brief).toContain('STILL PRESENT')
  })
})
