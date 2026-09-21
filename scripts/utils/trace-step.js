/**
 * A trace step whose clock starts when the work does.
 *
 * The revision after the screenshot critic, the final re-judge and the engineer
 * output patches all ran with no step of their own: `trace.json` for 09-18 and
 * 09-20 ended at `surface-gate` while the ledger held the engineer calls that
 * followed (#578). These are long branches with several ways out, so the step
 * is opened where the work begins and closed at each exit with what happened.
 * Closing twice records once: a throw after the normal exit must not add a
 * second step for the same work.
 *
 * @module
 */

/**
 * A message cut to the length a trace step keeps, for a value that may be absent.
 * A helper rather than `(x || '').slice(...)` at the call site, because the
 * swarm's functions are held to a complexity ceiling and this is a branch.
 * @param {unknown} value
 * @param {number} max
 * @returns {string}
 */
export const clip = (value, max) => String(value ?? '').slice(0, max)

/** A trace that records nothing, for a caller that was not given one. */
export const NO_TRACE = Object.freeze({ addStep() {} })

/**
 * @param {{ addStep: (step: object) => void }} trace
 * @param {{ name: string, phase: number, input?: object }} step
 * @returns {(output: object) => void} records the step, once, with its duration so far
 */
export function openStep(trace, { name, phase, input = {} }) {
  const startedAt = Date.now()
  let closed = false
  return (output) => {
    if (closed) return
    closed = true
    trace.addStep({ name, phase, input, output, durationMs: Date.now() - startedAt })
  }
}
