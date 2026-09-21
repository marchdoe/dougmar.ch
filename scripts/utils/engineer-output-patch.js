/**
 * An engineer reply that arrived incomplete or against the shell posture is
 * fixed by a patch, not by asking for the whole site again (#577).
 *
 * The first answer to such a reply was to resend the full engineer prompt with
 * a reminder and take a second complete generation, up to twice. On
 * 2026-09-18 that was 52.8k output tokens and $0.97 to restore one file. What
 * arrived is on disk by the time this runs, so the problem goes to the
 * engineer as the report of a repair brief (ADR 0001) and the reply is merged
 * over the files, the way a Phase 5 repair is.
 *
 * One class still gets the full task: a reply that left no engineer file on
 * disk. A patch needs something to patch, and the brief carries neither the
 * mockup nor the declarations, so with nothing on disk the engineer is asked
 * for the whole response again.
 *
 * The wiring is injected: the brief, the model call and the merge are closures
 * inside `runAgentSwarm`, because they share its root, backup and write list.
 */

/** Patch rounds before the swarm goes on with what arrived. */
export const MAX_OUTPUT_PATCH_ROUNDS = 2

/**
 * The report for a round. After a rejected round it also says why, because
 * the files on disk did not change and the same brief would get the same
 * reply.
 * @param {import('./engineer-output-check.js').OutputProblem} problem
 * @param {import('./engineer-output-check.js').OutputProblem|null} rejected
 * @returns {string}
 */
export function outputProblemReport(problem, rejected) {
  if (!rejected) return problem.reminder
  return (
    `${problem.reminder}\n\n` +
    `Your last reply to this was not applied, so the files above are unchanged. ` +
    `With it they would still have failed: ${rejected.message}`
  )
}

/**
 * The prompt for a round with no engineer file on disk: the original task and
 * a note that none of the previous reply was kept.
 * @param {string} taskPrompt the engineer's original user prompt
 * @param {import('./engineer-output-check.js').OutputProblem} problem
 * @param {import('./engineer-output-check.js').OutputProblem|null} rejected
 * @returns {string}
 */
export function regenerationPrompt(taskPrompt, problem, rejected) {
  return (
    `${taskPrompt}\n\n---\n\n## NOTHING USABLE ARRIVED\n\n${problem.message}. ` +
    `None of your previous reply is on disk. Write your complete response: every required file, in full.` +
    (rejected ? `\n\nThe reply before this one still failed: ${rejected.message}` : '')
  )
}

/**
 * Ask the engineer for patches until the files on disk pass the output check
 * or the rounds run out. A round that fails the check writes nothing.
 *
 * A round whose model call fails is spent and the loop goes on, as the
 * regeneration it replaces did. A failure while applying a reply is not
 * caught: a write that stops part-way leaves a hybrid on disk, and the swarm's
 * rollback is the answer to that.
 *
 * @param {object} params
 * @param {import('./engineer-output-check.js').OutputProblem|null} params.problem
 *   what is wrong with the files as they arrived; null does nothing
 * @param {string} params.taskPrompt the engineer's original user prompt, for a
 *   round with no engineer file on disk
 * @param {(report: string) => Promise<{ owned: Array<{path: string, content: string}>, brief: string }>} params.buildBrief
 * @param {(prompt: string) => Promise<{ files: Array<{path: string, content: string}> }>} params.askEngineer
 * @param {(owned: Array<{path: string, content: string}>, reply: { files: Array<{path: string, content: string}> }) => Promise<{ problem: import('./engineer-output-check.js').OutputProblem|null }>} params.applyPatch
 *   merges the reply over the files, writes it when the merged set passes,
 *   and sets `reply.files` to the merged set
 * @param {() => boolean} params.pastDeadline
 * @param {() => void} params.noteRetry
 * @param {number} [params.rounds]
 * @returns {Promise<{ reply: { files: Array<{path: string, content: string}> }|null }>}
 *   the reply that resolved the problem, its files the merged set; null when
 *   nothing was applied
 */
export async function patchOutputProblem({
  problem,
  taskPrompt,
  buildBrief,
  askEngineer,
  applyPatch,
  pastDeadline,
  noteRetry,
  rounds = MAX_OUTPUT_PATCH_ROUNDS,
}) {
  let rejected = null
  for (let round = 1; problem && round <= rounds; round++) {
    if (pastDeadline()) {
      console.warn(
        `  ⚠ ${problem.message} — [deadline] run budget exhausted, skipping patch and proceeding with original output`
      )
      return { reply: null }
    }
    noteRetry()
    const { owned, brief } = await buildBrief(outputProblemReport(problem, rejected))
    const patching = owned.length > 0
    console.warn(
      `  ⚠ ${problem.message} — ${patching ? 'asking for a patch' : 'nothing on disk, asking for the whole response'} (round ${round}/${rounds})`
    )
    let reply
    try {
      reply = await askEngineer(
        patching ? brief : regenerationPrompt(taskPrompt, problem, rejected)
      )
    } catch (err) {
      console.warn(`  ⚠ patch request failed: ${err.message} — proceeding with original output`)
      continue
    }
    const applied = await applyPatch(owned, reply)
    if (!applied.problem) {
      console.log(`  ✓ patch resolved: ${problem.kind}`)
      return { reply }
    }
    rejected = applied.problem
    console.warn(`  ⚠ patch not applied: ${rejected.message} — keeping original output`)
  }
  return { reply: null }
}
