/**
 * Which mockup drift forces a revision, and that none of it blocks the ship
 * (mockup-drift-gate.js).
 */
import { describe, expect, it } from 'vitest'
import {
  MOCKUP_ADVISORY_HEADING,
  formatMockupAdvisory,
} from '../../scripts/utils/mockup-advisory.js'
import {
  blockingFaults,
  DRIFTED_VERDICT,
  driftedVerdict,
  forcesRevision,
  isDriftError,
  withDriftSeverity,
} from '../../scripts/utils/mockup-drift-gate.js'

function finding(kind, facts, width = 1440) {
  return { surface: '/', kind, severity: 'warning', width, detail: `${kind} detail`, facts }
}

const LOST = finding('mockup-hierarchy', {
  shape: 'replaced',
  dropped: [],
  leaderLost: true,
  leader: { text: 'both', mockupPx: 158 },
  buildLeader: { text: 'deep in', buildPx: 122, mockupPx: 44 },
})
const KEPT = finding('mockup-hierarchy', {
  shape: 'reordered',
  dropped: [{ text: 'design', mockupPx: 20 }],
  leaderLost: false,
  leader: { text: 'both', mockupPx: 158 },
  buildLeader: { text: 'both', buildPx: 150, mockupPx: 158 },
})
const scale = (ratio, mockupRank, width = 1440) =>
  finding(
    'mockup-scale',
    { text: 'deep in', mockupPx: 44, buildPx: 44 * ratio, ratio, mockupRank },
    width
  )

describe('forcesRevision', () => {
  it('forces on a lost leader at 1440, not at 360 and not when the leader held', () => {
    expect(forcesRevision(LOST)).toBe(true)
    expect(forcesRevision({ ...LOST, width: 360 })).toBe(false)
    expect(forcesRevision(KEPT)).toBe(false)
  })

  it('forces on a top-three text resized outside 0.5-2.0x at 1440', () => {
    expect(forcesRevision(scale(2.77, 2))).toBe(true)
    expect(forcesRevision(scale(0.45, 0))).toBe(true)
    expect(forcesRevision(scale(1.9, 0))).toBe(false)
    expect(forcesRevision(scale(0.55, 1))).toBe(false)
    expect(forcesRevision(scale(2.77, 3))).toBe(false)
    expect(forcesRevision(scale(2.77, 0, 360))).toBe(false)
  })

  it('never forces on missing, cut or shifted text', () => {
    for (const kind of ['mockup-missing', 'text-cut', 'mockup-shift']) {
      expect(forcesRevision(finding(kind, {}))).toBe(false)
    }
  })
})

describe('withDriftSeverity', () => {
  it('raises only the forcing findings to error, with the instruction as their detail', () => {
    const [lost, kept] = withDriftSeverity([LOST, KEPT])
    expect(lost.severity).toBe('error')
    expect(lost.detail).toBe(
      "The mockup's largest text is 'both' at 158px; the build sets 'deep in' at 122px. " +
        "Restore the mockup's hierarchy: 'deep in' is 44px in the mockup."
    )
    expect(kept).toBe(KEPT)
  })

  it('gives the same detail for the same measurement, so STILL PRESENT can match it', () => {
    expect(withDriftSeverity([LOST])[0].detail).toBe(withDriftSeverity([{ ...LOST }])[0].detail)
  })

  it('leaves the errors out of the advisory section', () => {
    const raised = withDriftSeverity([LOST, KEPT])
    const section = formatMockupAdvisory(raised)
    expect(section.startsWith(MOCKUP_ADVISORY_HEADING)).toBe(true)
    expect(section).not.toContain("'deep in' is 44px in the mockup")
    expect(formatMockupAdvisory(withDriftSeverity([LOST]))).toBe('')
  })
})

describe('the ship', () => {
  const raised = withDriftSeverity([LOST])[0]
  const overflow = { surface: '/', kind: 'overflow', severity: 'error', detail: 'too wide' }

  it('counts every fault but drift errors', () => {
    expect(isDriftError(raised)).toBe(true)
    expect(isDriftError(LOST)).toBe(false)
    expect(blockingFaults([raised, overflow])).toEqual([overflow])
    expect(blockingFaults(undefined)).toEqual([])
  })

  it('records surviving drift as one DRIFTED verdict, and nothing when none survived', () => {
    expect(driftedVerdict([raised, overflow])).toMatchObject({
      critic: 'mockup-fidelity',
      verdict: DRIFTED_VERDICT,
      feedback: `- / at 1440px: ${raised.detail}`,
    })
    expect(driftedVerdict([overflow])).toBeNull()
  })
})
