/**
 * The rail-overlap findings (#702): what the gate says when a fixed element
 * sits on the site's rail, and who it says it to.
 */
import { describe, expect, it } from 'vitest'
import { evaluateMeasurement, faultsForOwner } from '../../scripts/utils/surface-gate.js'
import {
  MAX_RAIL_OVERLAPS_REPORTED,
  RAIL_OVERLAP_FIX,
  railOverlapFindings,
} from '../../scripts/utils/shell-overlap.js'

const hit = (over = {}) => ({
  selector: 'header.pos_fixed.top_0',
  text: 'Doug March Work About',
  top: 0,
  height: 72,
  overlapPx: 44,
  ...over,
})

const measured = (route, railOverlap) => ({
  id: route,
  route,
  viewport: 'desktop',
  scheme: 'light',
  status: 200,
  scrollWidth: 1440,
  clientWidth: 1440,
  allowsXOverflow: false,
  consoleErrors: [],
  railOverlap,
})

describe('railOverlapFindings', () => {
  it('names the fixed element and tells the engineer to pin it with sticky', () => {
    const [f] = railOverlapFindings({ railOverlap: [hit()] }, 'react-engineer')
    expect(f).toMatchObject({ kind: 'rail-overlap', severity: 'error', owner: 'react-engineer' })
    expect(f.detail).toContain('<header.pos_fixed.top_0>')
    expect(f.detail).toContain('covers 44px')
    expect(f.detail).toContain('position: sticky; top: 0')
    expect(f.detail).toContain(RAIL_OVERLAP_FIX)
  })

  it('caps what one measurement reports', () => {
    const many = Array.from({ length: 6 }, (_, i) => hit({ selector: `div.n${i}` }))
    expect(railOverlapFindings({ railOverlap: many }, 'react-engineer')).toHaveLength(
      MAX_RAIL_OVERLAPS_REPORTED
    )
  })

  it('reports nothing when nothing was measured or nothing sits on the rail', () => {
    expect(railOverlapFindings({}, 'react-engineer')).toEqual([])
    expect(railOverlapFindings({ railOverlap: null }, 'react-engineer')).toEqual([])
    expect(railOverlapFindings({ railOverlap: [] }, 'react-engineer')).toEqual([])
  })
})

describe('the gate', () => {
  it('forces an engineer revision on the routes that carry the rail', () => {
    for (const route of ['/', '/about', '/work/dougmar-ch']) {
      const findings = evaluateMeasurement(measured(route, [hit()])).map((f) => ({
        surface: route,
        width: 1440,
        ...f,
      }))
      expect(findings.map((f) => f.kind)).toContain('rail-overlap')
      expect(faultsForOwner(findings, 'react-engineer').map((f) => f.kind)).toContain(
        'rail-overlap'
      )
    }
  })
})
