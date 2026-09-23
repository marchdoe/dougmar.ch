/**
 * One machine-readable line per pipeline phase transition, printed to
 * stdout for the dev panel's SSE forwarder
 * (app/dev-server/pipeline-runner.ts) to parse and app/dev/lib/pipeline.ts's
 * event tracker to read (#227). Before this, the panel's run pane worked out
 * which phase a run was in by matching substrings of ordinary log prose —
 * a hidden contract with whatever a phase happened to console.log.
 *
 * The `[phase] ` prefix is not a GitHub Actions workflow command (those are
 * `::name::`), so this line is inert in an Actions log: printed, never
 * parsed as a command.
 */

/** @typedef {'start'|'done'|'error'} PhaseEventStatus */

/**
 * Print one phase-transition line: `[phase] {"phase":"art-director","status":"start"}`.
 * @param {string} phase
 * @param {PhaseEventStatus} status
 * @param {{ error?: string }} [extra]
 */
export function emitPhase(phase, status, extra = {}) {
  console.log(`[phase] ${JSON.stringify({ phase, status, ...extra })}`)
}

/**
 * Run one named phase of the pipeline: emits `start`, awaits `fn`, emits
 * `done`, and returns what `fn` returned. On a throw, emits `error` with the
 * failure's message and rethrows unchanged. Every phase the swarm runs goes
 * through this, so the emitted line always matches what the pipeline
 * actually did rather than being a second, driftable description of it.
 * @template T
 * @param {string} phase
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function runPhase(phase, fn) {
  emitPhase(phase, 'start')
  try {
    const result = await fn()
    emitPhase(phase, 'done')
    return result
  } catch (err) {
    emitPhase(phase, 'error', { error: err instanceof Error ? err.message : String(err) })
    throw err
  }
}
