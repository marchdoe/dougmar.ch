/**
 * Which mockup-fidelity findings reach the react-engineer's repair brief, in
 * what order, how many, and in what words (mockup-advisory.js).
 */
import { describe, expect, it } from 'vitest'
import {
  MOCKUP_ADVISORY_CAP,
  MOCKUP_ADVISORY_HEADING,
  formatMockupAdvisory,
  isMockupAdvisory,
  mockupAdvisoryLine,
  mockupBriefLines,
  mockupDriftRecord,
} from '../../scripts/utils/mockup-advisory.js'

function finding(kind, facts, { width = 1440, detail = `${kind} detail` } = {}) {
  return {
    surface: '/',
    route: '/',
    scheme: 'light',
    kind,
    severity: 'warning',
    viewport: width <= 480 ? 'phone' : 'desktop',
    width,
    detail,
    facts,
  }
}

/** The local canary that prompted this: BOTH at 158px, its caption at 122px. */
const HIERARCHY = finding('mockup-hierarchy', {
  shape: 'replaced',
  dropped: [],
  leader: { text: 'both', mockupPx: 158 },
  buildLeader: { text: 'deep in', buildPx: 122, mockupPx: 44 },
})
const MISSING = finding('mockup-missing', { text: 'gap', mockupPx: 389, hidden: false })
const HIDDEN = finding('mockup-missing', { text: 'selected work', mockupPx: 28, hidden: true })
const scale = (text, mockupPx, buildPx, width = 1440) =>
  finding(
    'mockup-scale',
    { text, mockupPx, buildPx, ratio: Number((buildPx / mockupPx).toFixed(2)) },
    { width }
  )
const CUT = finding('text-cut', { text: 'doug march', buildPx: 22, visiblePct: 84 })
const SHIFT = finding('mockup-shift', null, {
  width: 360,
  detail: "'work' moved from (40, 600) in the mockup to (40, 700) in the build; crossed the fold",
})

describe('isMockupAdvisory', () => {
  it('carries hierarchy, missing, scale and text-cut, and not shift', () => {
    expect([HIERARCHY, MISSING, scale('a', 10, 30), CUT].every(isMockupAdvisory)).toBe(true)
    expect(isMockupAdvisory(SHIFT)).toBe(false)
    expect(isMockupAdvisory({ kind: 'tap-target' })).toBe(false)
  })
})

describe('mockupAdvisoryLine', () => {
  it('phrases the BOTH canary as an instruction the engineer can act on', () => {
    expect(mockupAdvisoryLine(HIERARCHY)).toBe(
      "- / at 1440px: The mockup's largest text is 'both' at 158px; the build sets 'deep in' at 122px. " +
        "Restore the mockup's hierarchy: 'deep in' is 44px in the mockup."
    )
  })

  it('says a flattened lead in both sizes', () => {
    const line = mockupAdvisoryLine(
      finding('mockup-hierarchy', {
        shape: 'flattened',
        leader: { text: '-26', mockupPx: 160, buildPx: 128 },
        runnerUp: { text: '-26', mockupPx: 56, buildPx: 120 },
        mockupGap: 2.9,
        buildGap: 1.1,
      })
    )
    expect(line).toContain('at 160px over')
    expect(line).toContain('the build sets them at 128px and 120px')
  })

  it('names what fell out of the top three when the leader held', () => {
    const line = mockupAdvisoryLine(
      finding('mockup-hierarchy', {
        shape: 'reordered',
        dropped: [{ text: 'selected work', mockupPx: 28 }],
        leader: { text: 'spaceman', mockupPx: 64 },
        buildLeader: { text: 'spaceman', buildPx: 64, mockupPx: 64 },
      })
    )
    expect(line).toContain("'spaceman' still leads")
    expect(line).toContain("'selected work' (28px)")
  })

  it('tells hidden text apart from absent text', () => {
    expect(mockupAdvisoryLine(HIDDEN)).toContain('does not show it')
    expect(mockupAdvisoryLine(MISSING)).toContain('nothing like it')
  })

  it('gives the size to set a resized segment back to, and a cut segment its room', () => {
    expect(mockupAdvisoryLine(scale('deep in', 44, 122))).toBe(
      "- / at 1440px: 'deep in' is 44px in the mockup and 122px in the build (2.77x). Set it back to 44px."
    )
    expect(mockupAdvisoryLine(CUT)).toContain('shows 84% of itself')
  })

  it('cuts a long quote so a missing paragraph costs one short line', () => {
    const long = 'a'.repeat(200)
    const line = mockupAdvisoryLine(
      finding('mockup-missing', { text: long, mockupPx: 17, hidden: false })
    )
    expect(line).not.toContain(long)
    expect(line).toContain('...')
  })

  it('falls back to the detail for a finding with no facts', () => {
    expect(mockupAdvisoryLine({ ...MISSING, facts: undefined })).toBe(
      '- / at 1440px: mockup-missing detail'
    )
  })

  it('writes no em dashes', () => {
    for (const f of [HIERARCHY, MISSING, HIDDEN, scale('x', 10, 30), CUT]) {
      expect(mockupAdvisoryLine(f)).not.toMatch(/[—–]/)
    }
  })
})

describe('mockupBriefLines', () => {
  it('lists hierarchy, then missing, then scale by how far off it is, then cut text', () => {
    const lines = mockupBriefLines([
      CUT,
      scale('near', 50, 85),
      MISSING,
      scale('far', 20, 100),
      HIERARCHY,
    ])
    expect(lines.map((l) => l.slice(0, 40))).toEqual(
      [HIERARCHY, MISSING, scale('far', 20, 100), scale('near', 50, 85), CUT].map((f) =>
        mockupAdvisoryLine(f).slice(0, 40)
      )
    )
  })

  it('leaves shift out', () => {
    expect(mockupBriefLines([SHIFT])).toEqual([])
    expect(mockupBriefLines([SHIFT, CUT])).toHaveLength(1)
  })

  it(`caps the list at ${MOCKUP_ADVISORY_CAP}, keeping the hierarchy line`, () => {
    const many = Array.from({ length: 20 }, (_, i) => scale(`label ${i}`, 20, 40 + i))
    const lines = mockupBriefLines([...many, HIERARCHY])
    expect(lines).toHaveLength(MOCKUP_ADVISORY_CAP)
    expect(lines[0]).toBe(mockupAdvisoryLine(HIERARCHY))
  })

  it('folds two findings that read the same into one line before capping', () => {
    const twin = scale('-23', 44, 90)
    expect(mockupBriefLines([twin, { ...twin }])).toHaveLength(1)
  })

  it('is stable: the same findings give the same lines in any input order', () => {
    const set = [CUT, MISSING, HIERARCHY, scale('a', 20, 50), scale('b', 20, 60, 360)]
    expect(mockupBriefLines([...set].reverse())).toEqual(mockupBriefLines(set))
  })
})

describe('formatMockupAdvisory', () => {
  it('is empty when nothing briefable was found', () => {
    expect(formatMockupAdvisory([])).toBe('')
    expect(formatMockupAdvisory(undefined)).toBe('')
    expect(formatMockupAdvisory([SHIFT])).toBe('')
  })

  it('opens with its heading and says it does not block', () => {
    const out = formatMockupAdvisory([HIERARCHY])
    expect(out.startsWith(MOCKUP_ADVISORY_HEADING)).toBe(true)
    expect(out).toContain('do not block')
    expect(out).toContain(mockupAdvisoryLine(HIERARCHY))
  })
})

describe('mockupDriftRecord', () => {
  it('keeps every finding, shift included, beside the lines the brief carried', () => {
    const record = mockupDriftRecord(2, [SHIFT, HIERARCHY])
    expect(record.round).toBe(2)
    expect(record.findings).toEqual([SHIFT, HIERARCHY])
    expect(record.briefed).toEqual([mockupAdvisoryLine(HIERARCHY)])
  })
})
