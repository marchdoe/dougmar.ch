/**
 * The shell-overlap findings (#640): what the gate says when the night's
 * shell draws text over a hand-written route's, and who it says it to.
 */
import { describe, expect, it } from 'vitest'
import {
  evaluateMeasurement,
  faultsForOwner,
  formatFindingsForCritic,
} from '../../scripts/utils/surface-gate.js'
import {
  MAX_SHELL_OVERLAPS_REPORTED,
  shellOverlapFindings,
} from '../../scripts/utils/shell-overlap.js'
import { TABLET_RUNG, tabletMeasurement } from '../../scripts/utils/tablet-rung.js'

const hit = (over = {}) => ({
  selector: 'div > span.ff_display',
  text: 'Doug March',
  opacity: 1,
  lines: ['ELEMENTS'],
  count: 1,
  ...over,
})

const measured = (route, shellOverlap, viewport = 'desktop') => ({
  id: route,
  route,
  viewport,
  scheme: 'light',
  status: 200,
  scrollWidth: 1440,
  clientWidth: 1440,
  allowsXOverflow: false,
  consoleErrors: [],
  shellOverlap,
})

describe('shellOverlapFindings', () => {
  it("names the shell's text, where it is drawn, and the route's lines under it", () => {
    const [f] = shellOverlapFindings({ shellOverlap: [hit()] })
    expect(f).toMatchObject({ kind: 'shell-overlap', severity: 'error' })
    expect(f.detail).toContain('"Doug March"')
    expect(f.detail).toContain('<div > span.ff_display>')
    expect(f.detail).toContain('"ELEMENTS"')
    expect(f.detail).not.toContain('opacity')
  })

  it('says how faint a ghosted line is, and counts the lines it does not name', () => {
    const [f] = shellOverlapFindings({
      shellOverlap: [hit({ opacity: 0.08, lines: ['a', 'b', 'c', 'd', 'e'], count: 5 })],
    })
    expect(f.detail).toContain('at opacity 0.08')
    expect(f.detail).toContain('"a", "b", "c" and 2 more')
  })

  it('caps what one measurement reports', () => {
    const many = Array.from({ length: 6 }, (_, i) => hit({ text: `line ${i}` }))
    expect(shellOverlapFindings({ shellOverlap: many })).toHaveLength(MAX_SHELL_OVERLAPS_REPORTED)
  })

  it('reports nothing when nothing was measured', () => {
    expect(shellOverlapFindings({})).toEqual([])
    expect(shellOverlapFindings({ shellOverlap: null })).toEqual([])
  })
})

describe('the gate routes it by the route it was measured on', () => {
  it('to a human on the hand-written routes, forcing no engineer revision', () => {
    for (const route of ['/elements', '/experiments', '/work']) {
      const findings = evaluateMeasurement(measured(route, [hit()])).map((f) => ({
        surface: route,
        width: 1440,
        scheme: 'light',
        viewport: 'desktop',
        ...f,
      }))
      expect(findings.map((f) => f.kind)).toEqual(['shell-overlap'])
      expect(faultsForOwner(findings, 'human')).toHaveLength(1)
      expect(faultsForOwner(findings, 'react-engineer')).toEqual([])
      expect(formatFindingsForCritic(findings)).toContain(`${route} at 1440px`)
    }
  })

  it("asks /elements the shell's questions and nothing else", () => {
    // A specimen sheet sets tiny and huge type on purpose; the e2e spec holds
    // it to the preset. Only whether it loads, fits and clears the shell is asked here.
    const sheet = {
      ...measured('/elements', [hit()]),
      scrollWidth: 1500,
      worstCopy: { chars: 400, fontSizePx: 90, sample: 'x' },
      consoleErrors: ['boom'],
    }
    expect(evaluateMeasurement(sheet).map((f) => f.kind)).toEqual(['overflow', 'shell-overlap'])
    expect(evaluateMeasurement({ ...sheet, route: '/work' }).map((f) => f.kind)).toEqual([
      'overflow',
      'running-copy',
      'shell-overlap',
      'console',
    ])
  })

  it('at the tablet too, where 2026-09-21 put the lockup on /work', () => {
    const m = tabletMeasurement(
      { id: 'work-index', route: '/work', viewport: TABLET_RUNG, scheme: 'light' },
      {
        status: 200,
        box: { scrollWidth: 820, clientWidth: 820, allowsXOverflow: false },
        clipped: [],
        shellOverlap: [hit({ lines: ['Doug March'] })],
      }
    )
    expect(evaluateMeasurement(m).map((f) => f.kind)).toEqual(['shell-overlap'])
  })
})
