/**
 * What the surface gate did on a run, kept where the run's readers can see it.
 *
 * The gate is non-blocking: a throw is caught in `design-agents.js`, logged,
 * and the build carries on. That is the right call for a night that otherwise
 * passed, and it left nothing behind, so a gate that never measured looked
 * identical to one that measured and found nothing (#565). A failed round now
 * leaves a `GATE-FAILED` verdict in `verdicts.json`, a step in the trace, and a
 * `surface-gate.json` beside the record; `buildRecord` lifts that into
 * `record.json`, and `needs-human.js` prints it in the rating issue.
 *
 * @module
 */

/** The verdict a round that threw is recorded under. */
export const GATE_FAILED = 'GATE-FAILED'

/**
 * The `verdicts.json` entry for a gate round that threw.
 *
 * @param {number} round
 * @param {Error} err
 * @returns {{ critic: string, round: number, verdict: string, error: string, feedback: string, ts: number }}
 */
export function gateFailedVerdict(round, err) {
  return {
    critic: 'surface-gate',
    round,
    verdict: GATE_FAILED,
    error: err.message,
    feedback:
      `The surface gate threw in round ${round} and measured nothing: ${err.message}. ` +
      'No overflow, clipping, contrast or copy check ran on that build.',
    ts: Date.now(),
  }
}

/**
 * Leave the failed round where it can be found: a `GATE-FAILED` verdict for
 * `verdicts.json` and the rating issue, and a trace step so the stage view
 * shows the gate's row with what happened in it.
 *
 * @param {object} run
 * @param {Array<object>} run.verdicts the run's verdict list, pushed onto
 * @param {{ addStep: (step: object) => void }} run.trace
 * @param {number} run.round
 * @param {Error} run.err
 * @param {number} run.durationMs
 */
export function recordGateFailure({ verdicts, trace, round, err, durationMs }) {
  verdicts.push(gateFailedVerdict(round, err))
  trace.addStep({
    name: 'surface-gate',
    phase: 4,
    input: { round },
    output: { ran: false, error: err.message },
    durationMs,
  })
}

/**
 * The `surface-gate.json` payload: whether every measurement the run
 * attempted completed. A run whose round 1 threw and one whose round 2
 * threw are both `ran: false`; `round` says which, and `error` is the first
 * message.
 *
 * @param {Array<{ critic?: string, verdict?: string, round?: number|string, error?: string }>} verdicts
 * @returns {{ ran: boolean, error: string|null, round: number|null }}
 */
export function surfaceGateRecord(verdicts) {
  const failed = (verdicts ?? []).find(
    (v) => v?.critic === 'surface-gate' && v.verdict === GATE_FAILED
  )
  if (!failed) return { ran: true, error: null, round: null }
  return { ran: false, error: failed.error ?? null, round: Number(failed.round) || null }
}

/**
 * The error count for the gate's log line, split by who can act on it. An
 * error on an authored route (`/experiments`, `/work`) forces nothing and goes
 * to a person, so the line says how many of the total are theirs.
 *
 * @param {number} errorCount
 * @param {number} authoredCount errors on routes no agent owns
 * @returns {string}
 */
export function describeGateErrors(errorCount, authoredCount) {
  const authored = authoredCount > 0 ? ` (${authoredCount} on authored routes, for a human)` : ''
  return `${errorCount} error(s)${authored}`
}
