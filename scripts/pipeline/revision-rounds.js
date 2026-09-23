/**
 * The engineer's revisions after the first passing build (#221): up to
 * MAX_REVISION_ROUNDS patches on what the screenshot critic and the surface
 * gate found, one more when #635's extra round is earned, and the final
 * re-judge. Every round leaves a build on disk that passed.
 */
import { cleanupOrphans, restore } from '../utils/file-manager.js'
import { validateBuild } from '../utils/build-validator.js'
import { pastDeadline } from '../utils/run-budget.js'
import { noteRetry } from '../utils/cost-ledger.js'
import { clip, openStep } from '../utils/trace-step.js'
import { blockingFaults } from '../utils/mockup-drift-gate.js'
import { callAgent } from './call-agent.js'
import { applyEngineerPatch, buildRepairBrief, snapshotPassingState } from './engineer-tools.js'

/**
 * How many engineer revisions a night may spend after its first passing
 * build. One was never enough on 2026-09-21 (#625): the revision fixed the
 * overflow on /about by narrowing the column, round 2 measured twenty words
 * broken across lines in it, the run shipped "with the record saying so",
 * and the workflow's e2e gate failed the night on the same fault after every
 * call had been paid for. A round costs what the first did (about $0.50); the
 * night it saves cost $4.73. Two was the edge, not the margin: the first two
 * nights through this loop went 124 → 10 → 0 and 101 → 73 → 9 (#630).
 */
export const MAX_REVISION_ROUNDS = 3

/**
 * The hard ceiling on revisions once #635's extra round is spent. Run 6 on
 * 2026-09-21 went 46 → 6 → (build broke, restored) → 3 errors, one
 * engineer-owned and freshly introduced by round 3's own fix; the round-3
 * cap left it no chance to try again, and the night was refused $5.31 in
 * over a fault a $0.50 round might have cleared. `earnsExtraRound` below
 * decides when that fourth round is worth spending; this constant is the
 * most it may ever spend.
 */
export const EXTRA_REVISION_ROUND_CAP = 4

/**
 * Only the engineer has a revision path. A critic that names another agent
 * (`**Responsible agent:** art-director`) used to fall through in silence:
 * no call, no log, an open trace step, and the round-1 build shipped with the
 * faults the critic had just named (#625).
 * @param {string} responsibleAgent - what the critic wrote
 * @returns {'react-engineer'}
 */
function engineerFor(responsibleAgent) {
  if (responsibleAgent !== 'react-engineer') {
    console.warn(
      `  [screenshot-critic] named ${responsibleAgent}, which has no revision path — the engineer revises instead`
    )
  }
  return 'react-engineer'
}

/** A gate round's findings, or null for a round that did not measure. */
export function findingsOf(gate) {
  return gate ? gate.findings : null
}

/**
 * Whether the round that just used up the loop's cap earns one more (#635):
 * one or two engineer-owned faults left, and every one of them fresh —
 * absent from the round before, so the fix that just ran moved a fault
 * rather than leaving it in place. A fault already STILL PRESENT once has
 * had its try; three faults or more is not a near miss worth a fourth round.
 * @param {Array<object>} remaining - this round's engineer-owned faults
 * @param {Array<object>|null} previousFindings - the round before's findings
 * @param {(findings: Array<object>, previousFindings: Array<object>|null) => boolean} allFindingsFresh
 *   `surface-gate.js`'s freshness check, passed in rather than imported at
 *   module scope: the gate loads `surface-gate.js` dynamically.
 * @returns {boolean}
 */
function earnsExtraRound(remaining, previousFindings, allFindingsFresh) {
  return (
    (remaining.length === 1 || remaining.length === 2) &&
    allFindingsFresh(remaining, previousFindings)
  )
}

/**
 * The revision loop's cap, extended by one (#635) when the round that just
 * used it up earns it, or left unchanged. Logs the grant; a cap that does not
 * change logs nothing, since `describeLeftover` right after already says the
 * round is spent. Pulled out of `runRevisionRounds` so the loop reads as one
 * decision per iteration rather than inlining the four conditions this needs.
 * @param {number} round
 * @param {number} cap
 * @param {Array<object>} remaining - this round's engineer-owned faults
 * @param {Array<object>|null} previousFindings - the round before's findings
 * @param {(findings: Array<object>, previousFindings: Array<object>|null) => boolean} allFindingsFresh
 * @returns {number}
 */
function grantExtraRoundIfEarned(round, cap, remaining, previousFindings, allFindingsFresh) {
  // Drift from the mockup never earns the extra round: it cannot block the
  // ship, so a round spent on it alone buys nothing the night needs.
  const blocking = blockingFaults(remaining)
  const earned =
    round === cap &&
    cap < EXTRA_REVISION_ROUND_CAP &&
    !pastDeadline() &&
    earnsExtraRound(blocking, previousFindings, allFindingsFresh)
  if (!earned) return cap
  console.warn(
    `  [surface-gate] round ${round} left ${blocking.length} fresh engineer-owned fault(s), none present before the last revision — spending one more round (#635)`
  )
  return cap + 1
}

/** The log line for a revision that rebuilt and still left measured faults. */
function describeLeftover(round, count, cap) {
  const next = round < cap ? ' — revising again' : ''
  return `  [surface-gate] revision ${round} left ${count} engineer-owned fault(s)${next}`
}

/**
 * The repair brief's report: the critic's words (if any), then the
 * measured errors on engineer-owned surfaces, then the warnings that
 * ride along for free: tap targets (#488) and where the build drifts
 * from the approved mockup.
 * @param {object} tools - surface-gate.js's formatters, loaded by the gate
 * @param {{ findings: Array<object>, mockupFindings?: Array<object>|null }|null} gate
 *   a gate round, or null when it did not measure
 * @param {string} [criticFeedback]
 * @param {{ previous?: Array<object>|null }} [opts] the round before, so a fault
 *   still there is marked as such in the brief
 * @returns {string}
 */
export function feedbackFor(tools, gate, criticFeedback = '', { previous = null } = {}) {
  const { faultsForOwner, formatFindingsForCritic } = tools
  const { advisoryFaultsForOwner, formatAdvisoryForRepairBrief } = tools
  const findings = findingsOf(gate) ?? []
  const advisories = [...findings, ...(gate?.mockupFindings ?? [])]
  return [
    criticFeedback,
    formatFindingsForCritic(faultsForOwner(findings, 'react-engineer'), { previous }),
    formatAdvisoryForRepairBrief(advisoryFaultsForOwner(advisories, 'react-engineer')),
  ]
    .filter(Boolean)
    .join('\n\n')
}

/**
 * Put the known-passing state back and the result that goes with it.
 * cleanupOrphans against the same snapshot deletes any paths the failed
 * revision invented beyond it.
 * @param {import('./run-state.js').RunState} state
 * @param {object} passingEngineerResult
 */
async function restorePassingState(state, passingEngineerResult) {
  const { root, passingSnapshot } = state
  await cleanupOrphans(state.writtenPaths, passingSnapshot, { root })
  await restore(passingSnapshot, { root })
  state.engineer.result = passingEngineerResult
}

/**
 * A revision that broke the build: restore the snapshot taken right after
 * the last passing build — NOT originalBackup — and prove it rebuilds;
 * falling through to archive() on faith is how broken hybrids ship.
 * @param {import('./run-state.js').RunState} state
 * @param {object} passingEngineerResult
 * @param {(outcome: object) => void} traceRevision
 * @param {{ applied: object, error: string|undefined }} broke
 */
async function restoreAfterBrokenBuild(state, passingEngineerResult, traceRevision, broke) {
  const { root, today } = state
  console.warn('  post-critic revision broke the build — restoring known-passing state')
  await restorePassingState(state, passingEngineerResult)

  const restoredBuild = validateBuild({ root, shell: state.ad.shellDecl, date: today })
  if (!restoredBuild.success) {
    const fatal = new Error(
      `Restore of passing state failed to rebuild after post-critic revision. Error:\n${restoredBuild.error?.slice(0, 1000)}`
    )
    fatal.fatal = true
    traceRevision({ outcome: 'restore-failed', error: fatal.message })
    throw fatal
  }
  console.log('  known-passing state restored and re-validated')
  const { applied } = broke
  traceRevision({
    outcome: 'build-broke-restored',
    replied: applied.replied,
    written: applied.written,
    deleted: applied.deleted,
    error: clip(broke.error, 2000),
  })
  return { outcome: 'build-broke-restored', error: clip(broke.error, 2000) }
}

/**
 * Brief, patch, build, re-measure — the part of a revision that can throw.
 * @param {import('./run-state.js').RunState} state
 * @param {object} run - the gate's round-1 measurement and tools
 * @param {{ agent: string, feedback: string, round: number }} args
 * @param {{ traceRevision: (outcome: object) => void, passingEngineerResult: object }} ctx
 */
async function reviseAndRebuild(state, run, args, ctx) {
  const { root, today } = state
  const { agent, feedback, round } = args
  const config = state.engineer.config
  const { traceRevision, passingEngineerResult } = ctx
  // A revision is a patch too (#432): the brief lists the files
  // that passed, the feedback is the error report, and the reply
  // is merged over the passing state rather than replacing it.
  const { owned, brief } = await buildRepairBrief(
    state,
    `The build passed. The screenshot critic and the surface gate found:\n\n${feedback}`
  )
  const retryResult = await callAgent(agent, config.patchPrompt, brief, {
    ...config.options,
    patch: true,
    purpose: 'revision',
  })
  const applied = await applyEngineerPatch(state, owned, retryResult, 'React Engineer revision')
  if (applied.problem) {
    // Nothing was written; the passing state is still on disk.
    console.warn(`  ⚠ ${applied.problem.message} — revision not applied`)
    traceRevision({ outcome: 'not-applied', problem: applied.problem.message })
    return { outcome: 'not-applied', error: applied.problem.message }
  }
  state.engineer.result = retryResult

  const retryBuild = validateBuild({ root, shell: state.ad.shellDecl, date: today })
  if (!retryBuild.success) {
    return await restoreAfterBrokenBuild(state, passingEngineerResult, traceRevision, {
      applied,
      error: retryBuild.error,
    })
  }

  console.log('  post-critic revision build passed')
  traceRevision({
    outcome: 'rebuilt',
    replied: applied.replied,
    written: applied.written,
    deleted: applied.deleted,
    merged: retryResult.files.length,
  })
  return { outcome: 'rebuilt', regate: await run.measureSurfaces(round + 1) }
}

/**
 * One engineer revision: brief, patch, build, re-measure. Leaves the
 * passing state on disk on every path but `rebuilt` (#432), and says
 * which path it took so the round loop can decide what to do next.
 *
 * @param {import('./run-state.js').RunState} state
 * @param {object} run - the gate's round-1 measurement and tools
 * @param {{ agent: string, feedback: string, round: number, verdict: string, cap?: number }} args
 *   `cap` is the round count this attempt is logged against — MAX_REVISION_ROUNDS
 *   unless #635's extra round has already been granted
 * @returns {Promise<{ outcome: string, regate?: object|null, error?: string }>}
 */
async function attemptRevision(state, run, args) {
  const { agent, feedback, round, verdict, cap = MAX_REVISION_ROUNDS } = args
  // The revision is a stage with its own row in the trace (#578): what
  // asked for it, and how it ended.
  const traceRevision = openStep(state.trace, {
    name: 'revision',
    phase: 4,
    input: {
      round,
      verdict,
      responsibleAgent: agent,
      gateForced: run.gateDemandsRevision,
      engineerFaults: run.engineerFaults.length,
      feedback: feedback.slice(0, 500),
    },
  })
  console.log(`  revision ${round}/${cap}: retrying ${agent} with the report...`)
  noteRetry()
  // The retry result replaces the engineer's result so the archive records
  // what's actually on disk; keep the passing result to fall back to.
  const passingEngineerResult = state.engineer.result
  try {
    return await reviseAndRebuild(state, run, args, { traceRevision, passingEngineerResult })
  } catch (err) {
    if (err.fatal) throw err
    console.warn(`  ${agent} revision failed (non-blocking): ${err.message}`)
    traceRevision({ outcome: 'failed', error: err.message.slice(0, 2000) })
    // A mid-batch writeFiles abort can leave a partial hybrid on
    // disk — put the known-passing state back before going on.
    await restorePassingState(state, passingEngineerResult)
    return { outcome: 'failed', error: err.message }
  }
}

/**
 * The final critic pass after the revisions (#467), traced as its own
 * step (#578). Non-blocking: a critic that cannot run must not stop a
 * build that otherwise passed.
 * @param {import('./run-state.js').RunState} state
 * @param {object} run
 * @param {object|null} gate - the last measurement
 * @param {Array<object>} remainingFaults
 */
async function rejudgeFinal(state, run, gate, remainingFaults) {
  const traceFinal = openStep(state.trace, {
    name: 'screenshot-critic-final',
    phase: 4,
    input: { remainingFaults: remainingFaults.length },
  })
  try {
    const final = await run.judge(gate, 'rejudge')
    const finalVerdict = run.tools.recordFinalJudgment(
      state.verdicts,
      final,
      run.tools.formatFindingsForCritic(remainingFaults)
    )
    traceFinal({
      verdict: finalVerdict,
      feedback: final.criticResponse.slice(0, 500),
      channel: final.visionChannel,
    })
  } catch (finalErr) {
    traceFinal({ verdict: 'ERROR', error: finalErr.message.slice(0, 500) })
    console.warn(`  [screenshot-critic] final re-judge failed (non-blocking): ${finalErr.message}`)
  }
}

/**
 * After a round that rebuilt: take the new passing snapshot and read what
 * the re-measure left. Returns null when the gate threw on this round.
 * @param {import('./run-state.js').RunState} state
 * @param {object} run
 * @param {object} loop - the round loop's running state
 * @param {{ round: number, regate: object|null }} rebuiltRound
 * @returns {Promise<boolean>} whether another round follows
 */
async function afterRebuilt(state, run, loop, { round, regate }) {
  const { faultsForOwner, allFindingsFresh } = run.tools
  loop.rebuilt = true
  await snapshotPassingState(state)
  const previous = loop.lastGate
  loop.lastGate = regate
  loop.measured = loop.lastGate != null
  if (!loop.measured) {
    // The gate threw on this round: the faults it would have found
    // are unknown, the ones before it are the best information there
    // is, and the ship decision says so rather than reading silence
    // as a clean pass.
    console.warn(
      `  [surface-gate] round ${round + 1} measured nothing — the last measurement stands`
    )
    return false
  }
  loop.remaining = faultsForOwner(loop.lastGate.findings, 'react-engineer')
  if (loop.remaining.length === 0) return false

  loop.cap = grantExtraRoundIfEarned(
    round,
    loop.cap,
    loop.remaining,
    findingsOf(previous),
    allFindingsFresh
  )
  console.warn(describeLeftover(round, loop.remaining.length, loop.cap))
  loop.report = feedbackFor(run.tools, loop.lastGate, '', { previous: findingsOf(previous) })
  return true
}

/**
 * Up to MAX_REVISION_ROUNDS revisions, each on the faults the previous
 * one left, plus one more (#635) when the round that hit that cap left
 * one or two engineer-owned faults and every one of them is fresh — the
 * fix moved the fault rather than leaving it in place, EXTRA_REVISION_
 * ROUND_CAP total. A round that rebuilt is re-measured; a round that did
 * not (patch refused, build broke, call failed) leaves the round-1 build
 * on disk, so the next round gets the original report plus what went
 * wrong. The final re-judge runs once, on whatever build is on disk.
 *
 * @param {import('./run-state.js').RunState} state
 * @param {object} run - the gate's round-1 measurement and tools
 * @param {{ responsibleAgent: string, feedback: string, verdict: string }} args
 * @returns {Promise<{ remainingFaults: Array<object>, measured: boolean, rounds: number }>}
 */
export async function runRevisionRounds(state, run, { responsibleAgent, feedback, verdict }) {
  // Only the engineer has a revision path. A critic that names another
  // agent (`**Responsible agent:** art-director`) used to fall through
  // here in silence: no call, no log, an open trace step, and the
  // round-1 build shipped with the faults the critic had just named.
  const agent = engineerFor(responsibleAgent)

  // What is on disk and what was measured on it. A round that rebuilt
  // moves both forward and refreshes the snapshot a later failure
  // restores, so the best build is always the one that stands. A round
  // that did not rebuild leaves the disk as it was: nothing written
  // (`not-applied`), or the snapshot put back (`build-broke-restored`,
  // `failed`). The review of #631 found the first version of this loop
  // resetting to the round-0 build on every failure, which after a
  // rebuilt round described faults that were no longer on disk and, when
  // round 0 had been clean, shipped a revision's faults as none.
  const loop = {
    remaining: run.engineerFaults,
    lastGate: run.firstGate,
    measured: run.firstGate != null,
    rebuilt: false,
    report: feedback,
    // Extended to EXTRA_REVISION_ROUND_CAP, once, when the round that hit
    // this cap earns the extra round.
    cap: MAX_REVISION_ROUNDS,
  }
  let rounds = 0
  for (let round = 1; round <= loop.cap; round++) {
    if (pastDeadline()) {
      console.warn(`  [deadline] run budget exhausted — skipping revision ${round}`)
      openStep(state.trace, { name: 'revision', phase: 4, input: { round } })({
        outcome: 'skipped-deadline',
      })
      break
    }
    rounds = round
    const attempt = await attemptRevision(state, run, {
      agent,
      feedback: loop.report,
      round,
      verdict,
      cap: loop.cap,
    })
    if (attempt.outcome !== 'rebuilt') {
      // A critic-only revision (nothing measured wrong on disk) ends
      // here, as it always did: the passing build stands.
      if (loop.remaining.length === 0) break
      loop.report = `${loop.report}\n\nThe previous revision was not kept (${attempt.outcome}): ${clip(attempt.error, 1500)}`
      continue
    }
    if (!(await afterRebuilt(state, run, loop, { round, regate: attempt.regate }))) break
  }

  if (loop.rebuilt) await rejudgeFinal(state, run, loop.lastGate, loop.remaining)
  return { remainingFaults: loop.remaining, measured: loop.measured, rounds }
}
