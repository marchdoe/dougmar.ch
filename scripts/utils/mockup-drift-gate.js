/**
 * The mockup drift that forces a revision but never blocks the ship.
 *
 * Most of what `compareLayouts` (mockup-fidelity.js) finds stays advisory
 * (mockup-advisory.js). Two faults lose the composition outright, so they
 * are raised to errors on `/` at 1440:
 *
 * - `mockup-hierarchy` where the build's largest text is a different text
 *   from the mockup's (the 2026-09-22 canary set a 44px caption at 122px over
 *   the hero);
 * - `mockup-scale` on one of the mockup's three largest texts, resized to
 *   under half or over twice its mockup size.
 *
 * As errors they go through `faultsForOwner` and force a revision like any
 * gate error. They do not count toward the ship gate or the #635 extra
 * round: whatever of them survives the rounds ships, recorded as a DRIFTED
 * verdict that the rating issue lists under "Drifted from the mockup".
 *
 * An error's `detail` is its instruction (`mockupInstruction`), built only
 * from its measured numbers, so the STILL PRESENT marker can match it round
 * to round.
 *
 * @module
 */

import { WIDE_VIEWPORT } from '../../elements/chassis/viewports.js'
import { mockupInstruction } from './mockup-advisory.js'

/** The one width these become errors at: the desktop the mockup is drawn at. */
export const DRIFT_ERROR_WIDTH = WIDE_VIEWPORT.width

/** Only the mockup's three largest texts can raise a scale error. */
export const DRIFT_SCALE_TOP_N = 3

/** A scale error is a resize outside this band (the advisory band is 0.6-1.6). */
export const DRIFT_SCALE_MIN = 0.5
export const DRIFT_SCALE_MAX = 2

/** The verdict a surviving drift error ships under. */
export const DRIFTED_VERDICT = 'DRIFTED'

function scaleForces(facts) {
  if (!facts || facts.mockupRank == null || facts.mockupRank >= DRIFT_SCALE_TOP_N) return false
  return facts.ratio < DRIFT_SCALE_MIN || facts.ratio > DRIFT_SCALE_MAX
}

/**
 * True when a comparison finding forces a revision.
 * @param {{ kind: string, width: number, facts?: object }} f
 * @returns {boolean}
 */
export function forcesRevision(f) {
  if (f.width !== DRIFT_ERROR_WIDTH) return false
  if (f.kind === 'mockup-hierarchy') return f.facts?.leaderLost === true
  if (f.kind === 'mockup-scale') return scaleForces(f.facts)
  return false
}

/**
 * The comparison's findings with the ones that force a revision raised to
 * `error`, their detail replaced by the instruction the engineer acts on.
 *
 * @param {Array<object>} findings
 * @returns {Array<object>}
 */
export function withDriftSeverity(findings) {
  return (findings ?? []).map((f) =>
    forcesRevision(f) ? { ...f, severity: 'error', detail: mockupInstruction(f) } : f
  )
}

/**
 * True for a drift error: counted for the revision, never for the ship.
 * @param {{ kind: string, severity: string }} f
 * @returns {boolean}
 */
export function isDriftError(f) {
  return f.severity === 'error' && (f.kind === 'mockup-hierarchy' || f.kind === 'mockup-scale')
}

/**
 * The faults that decide the ship and the extra round: all but drift errors.
 * @param {Array<object>} faults
 * @returns {Array<object>}
 */
export function blockingFaults(faults) {
  return (faults ?? []).filter((f) => !isDriftError(f))
}

/**
 * The verdict a night ships under when drift errors survived the rounds, or
 * null when none did. `needs-human.js` reads it back for the rating issue.
 *
 * @param {Array<object>} remainingFaults - the engineer-owned faults the last round left
 * @returns {{ critic: string, verdict: string, feedback: string, ts: number }|null}
 */
export function driftedVerdict(remainingFaults) {
  const drifted = (remainingFaults ?? []).filter(isDriftError)
  if (drifted.length === 0) return null
  return {
    critic: 'mockup-fidelity',
    verdict: DRIFTED_VERDICT,
    feedback: drifted.map((f) => `- / at ${f.width}px: ${f.detail}`).join('\n'),
    ts: Date.now(),
  }
}
