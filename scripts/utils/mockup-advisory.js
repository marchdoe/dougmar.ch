/**
 * The mockup-fidelity findings the react-engineer is told about, and how.
 *
 * `compareLayouts` (mockup-fidelity.js) reports five kinds. Four go into the
 * repair brief as advisories: they never force a revision, they ride along
 * when one runs for another reason, the way the tap-target warnings do
 * (#488). `mockup-shift` is recorded in mockup-fidelity.json and left out of
 * the brief: at 360 the nav rows cross the fold on most nights, and a list
 * of moved labels would bury the one line about a hero set at a third of its
 * size.
 *
 * Two of them can be errors instead (mockup-drift-gate.js): the lost leader
 * and a top-three text resized past 2x at 1440. Those go to the engineer
 * with the measured faults and are left out of this section.
 *
 * Every line is phrased as something to do, and is built only from the
 * finding's own numbers, so the same fault reads the same way round to round.
 *
 * @module
 */

/** The kinds that reach the brief, in the order they are listed. */
export const MOCKUP_BRIEF_KINDS = Object.freeze([
  'mockup-hierarchy',
  'mockup-missing',
  'mockup-scale',
  'text-cut',
])

/** At most this many lines, so a night that lost its whole composition still
 * leaves the errors above it readable. */
export const MOCKUP_ADVISORY_CAP = 8

/** Quoted text longer than this is cut, so a missing paragraph costs one
 * line in the brief rather than five. */
export const QUOTE_MAX_CHARS = 60

export const MOCKUP_ADVISORY_HEADING =
  '## Advisory: where the build drifts from the approved mockup'

/**
 * True for a finding this section carries: a briefable kind, and not one
 * already raised to an error.
 * @param {{ kind: string, severity?: string }} f
 * @returns {boolean}
 */
export function isMockupAdvisory(f) {
  return MOCKUP_BRIEF_KINDS.includes(f.kind) && f.severity !== 'error'
}

/** How far a scale finding is from 1x, either way: 0.5x and 2x rank alike. */
function scaleDistance(f) {
  const ratio = f.facts?.ratio ?? 1
  return ratio > 0 ? Math.max(ratio, 1 / ratio) : 0
}

function byBriefOrder(a, b) {
  const rank = MOCKUP_BRIEF_KINDS.indexOf(a.kind) - MOCKUP_BRIEF_KINDS.indexOf(b.kind)
  if (rank !== 0) return rank
  if (a.kind === 'mockup-scale') return scaleDistance(b) - scaleDistance(a)
  return b.width - a.width
}

function quote(text) {
  const t = text ?? ''
  return t.length > QUOTE_MAX_CHARS ? `'${t.slice(0, QUOTE_MAX_CHARS - 3)}...'` : `'${t}'`
}

function hierarchyLine(facts) {
  if (facts.shape === 'flattened') {
    const { leader, runnerUp } = facts
    return (
      `The mockup sets ${quote(leader.text)} at ${leader.mockupPx}px over ${quote(runnerUp.text)} ` +
      `at ${runnerUp.mockupPx}px, a ${facts.mockupGap}x lead; the build sets them at ` +
      `${leader.buildPx}px and ${runnerUp.buildPx}px. Restore the mockup's sizes so ` +
      `${quote(leader.text)} leads.`
    )
  }
  const { leader, buildLeader } = facts
  if (facts.shape === 'reordered') {
    const dropped = (facts.dropped ?? []).map((d) => `${quote(d.text)} (${d.mockupPx}px)`)
    return (
      `${quote(leader.text)} still leads, but the mockup's ${dropped.join(', ')} ` +
      `fell out of the build's three largest texts. Restore the mockup's sizes.`
    )
  }
  const restore =
    buildLeader.mockupPx != null
      ? `${quote(buildLeader.text)} is ${buildLeader.mockupPx}px in the mockup.`
      : `${quote(leader.text)} should be the largest text on the page.`
  return (
    `The mockup's largest text is ${quote(leader.text)} at ${leader.mockupPx}px; ` +
    `the build sets ${quote(buildLeader.text)} at ${buildLeader.buildPx}px. ` +
    `Restore the mockup's hierarchy: ${restore}`
  )
}

function missingLine(facts) {
  if (facts.hidden) {
    return (
      `The mockup sets ${quote(facts.text)} at ${facts.mockupPx}px; the build has it but does not ` +
      'show it (opacity near 0, clipped, or off the page). Make it visible.'
    )
  }
  return (
    `The mockup sets ${quote(facts.text)} at ${facts.mockupPx}px; the build has nothing like it ` +
    'at a comparable size. Render it where and how the mockup does.'
  )
}

function scaleLine(facts) {
  return (
    `${quote(facts.text)} is ${facts.mockupPx}px in the mockup and ${facts.buildPx}px in the build ` +
    `(${facts.ratio}x). Set it back to ${facts.mockupPx}px.`
  )
}

function textCutLine(facts) {
  return (
    `${quote(facts.text)} shows ${facts.visiblePct}% of itself; its box cuts the rest off. ` +
    'Let it wrap or give its box the room.'
  )
}

const LINE_FOR = {
  'mockup-hierarchy': hierarchyLine,
  'mockup-missing': missingLine,
  'mockup-scale': scaleLine,
  'text-cut': textCutLine,
}

/**
 * One finding as an instruction. A finding without `facts` (one from before
 * they were recorded) falls back to its `detail`.
 *
 * @param {{ kind: string, detail: string, facts?: object }} f
 * @returns {string}
 */
export function mockupInstruction(f) {
  const line = LINE_FOR[f.kind]
  return f.facts && line ? line(f.facts) : f.detail
}

/**
 * One finding as a brief line, prefixed with where it was measured.
 *
 * @param {{ kind: string, width: number, detail: string, facts?: object }} f
 * @returns {string}
 */
export function mockupAdvisoryLine(f) {
  return `- / at ${f.width}px: ${mockupInstruction(f)}`
}

/**
 * The lines the brief lists: briefable kinds only, hierarchy first, then
 * missing, then scale by how far off it is, then cut text; desktop before
 * phone within a kind. Two findings that read the same (two leaderboard rows
 * with the same score, resized alike) are one line. Capped at
 * `MOCKUP_ADVISORY_CAP`.
 *
 * @param {Array<object>} findings
 * @returns {Array<string>}
 */
export function mockupBriefLines(findings) {
  const sorted = (findings ?? []).filter(isMockupAdvisory).sort(byBriefOrder)
  return [...new Set(sorted.map(mockupAdvisoryLine))].slice(0, MOCKUP_ADVISORY_CAP)
}

/**
 * The repair brief's mockup section, or '' when nothing briefable was found.
 *
 * @param {Array<object>} findings - mockup-fidelity findings, any kinds
 * @returns {string}
 */
export function formatMockupAdvisory(findings) {
  const lines = mockupBriefLines(findings)
  if (lines.length === 0) return ''
  return [
    MOCKUP_ADVISORY_HEADING,
    '',
    'Measured on the rendered page against the mockup the critic approved. These do not block',
    'the build. Fix them in the files this revision already opens.',
    '',
    ...lines,
  ].join('\n')
}

/**
 * One gate round's comparison as mockup-fidelity.json keeps it: every
 * finding, shifts included, and the lines the brief carried for them.
 *
 * @param {number} round
 * @param {Array<object>} findings
 * @returns {{ round: number, findings: Array<object>, briefed: Array<string> }}
 */
export function mockupDriftRecord(round, findings) {
  return {
    round,
    findings,
    briefed: mockupBriefLines(findings),
  }
}
