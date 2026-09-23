/**
 * The gate between a passing build and the archive (#221): the surface
 * gate measures every route, the screenshot critic judges the render, the
 * engineer revises what either found (revision-rounds.js), and the ship
 * decision refuses a build that still carries engineer-owned faults.
 */
import { describeGateErrors, recordGateFailure } from '../utils/gate-outcome.js'
import { mockupDriftRecord } from '../utils/mockup-advisory.js'
import { blockingFaults, driftedVerdict } from '../utils/mockup-drift-gate.js'
import { snapshotPassingState } from './engineer-tools.js'
import { archiveFailedSources } from './run-state.js'
import { feedbackFor, runRevisionRounds } from './revision-rounds.js'
import { judgeOrNoVerdict, judgeScreenshot } from './screenshot-judge.js'

/**
 * Deterministic surface gate first. It walks every generated route at
 * three rungs in both schemes and measures whether the document fits the
 * screen — the class of defect that put `/experiments` 657px past a
 * 1440px viewport with its headline and nav off the edge (#215), which
 * the single-page critic could never have seen. Measurements cost no
 * tokens, so this runs in full on every build; its findings are handed
 * to the critic as text rather than as more image blocks.
 * @returns {Promise<object>} the functions the gate uses from surface-gate.js,
 *   copy-gate.js and screenshot-critic.js
 */
async function loadGateTools() {
  const surfaceGate = await import('../utils/surface-gate.js')
  const { runCopyGate } = await import('../utils/copy-gate.js')
  const { readRevisionRequest, describeRevision, logNoRevision, recordFinalJudgment } =
    await import('../agents/screenshot-critic.js')
  return {
    runSurfaceGate: surfaceGate.runSurfaceGate,
    faultsForOwner: surfaceGate.faultsForOwner,
    formatFindingsForCritic: surfaceGate.formatFindingsForCritic,
    formatMeasuredForCritic: surfaceGate.formatMeasuredForCritic,
    advisoryFaultsForOwner: surfaceGate.advisoryFaultsForOwner,
    formatAdvisoryForRepairBrief: surfaceGate.formatAdvisoryForRepairBrief,
    findingLocation: surfaceGate.findingLocation,
    allFindingsFresh: surfaceGate.allFindingsFresh,
    runCopyGate,
    readRevisionRequest,
    describeRevision,
    logNoRevision,
    recordFinalJudgment,
  }
}

/**
 * Log one round's mockup comparison and keep it for mockup-fidelity.json.
 * Advisory only: nothing here feeds `errorCount` or a verdict.
 * @param {import('./run-state.js').RunState} state
 * @param {number} round
 * @param {Array<object>|null|undefined} findings - null when nothing was compared
 * @returns {object|null} the archived record, or null
 */
function recordMockupDrift(state, round, findings) {
  if (!findings) return null
  const record = mockupDriftRecord(round, findings)
  state.mockupFidelityRounds.push(record)
  console.log(
    `  [mockup-fidelity] round ${round}: ${findings.length} finding(s), ${record.briefed.length} for the brief`
  )
  for (const line of record.briefed) console.log(`    ${line}`)
  return record
}

/**
 * Log and record one measured round: the trace step and the verdict.
 * @param {import('./run-state.js').RunState} state
 * @param {object} tools
 * @param {{ round: number, gate: object, copy: object, drift: object|null, t0Gate: number }} measuredRound
 */
function recordMeasurement(state, tools, { round, gate, copy, drift, t0Gate }) {
  const { faultsForOwner, findingLocation } = tools
  console.log(
    `  [surface-gate] round ${round}: ${gate.measured} measurements, ${copy.scanned} files read for copy, ${describeGateErrors(gate.errorCount, faultsForOwner(gate.findings, 'human').length)} in ${((Date.now() - t0Gate) / 1000).toFixed(1)}s`
  )
  for (const f of gate.findings) {
    console.log(`    [${f.severity}] ${findingLocation(f, { scheme: true })}: ${f.detail}`)
  }
  state.trace.addStep({
    name: 'surface-gate',
    phase: 4,
    input: { round },
    output: {
      measured: gate.measured,
      errorCount: gate.errorCount,
      findings: gate.findings,
      mockupDrift: drift,
    },
    durationMs: Date.now() - t0Gate,
  })
  state.verdicts.push({
    critic: 'surface-gate',
    round,
    verdict: gate.errorCount > 0 ? 'REVISE' : 'SHIP',
    feedback: gate.findings.length
      ? gate.findings.map((f) => `${findingLocation(f)}: ${f.detail}`).join('\n')
      : 'all surfaces fit their viewport',
    ts: Date.now(),
  })
}

/**
 * Measure every route and record what was found. Round 1 runs before
 * the critic; round 2 runs after a revision that rebuilt, so the archive
 * says whether the revision fixed what the gate measured (#306).
 *
 * The copy gate (#504) rides in the same list. Its rendered half runs
 * inside `runSurfaceGate`, off the same page walk; its static half
 * reads the engineer's files here and is merged in, so one list of
 * findings routes to the engineer, the critic and the repair brief.
 * @param {import('./run-state.js').RunState} state
 * @param {object} tools
 * @param {number} round
 * @returns {Promise<{findings: Array<object>, measured: number, errorCount: number}|null>}
 */
async function measureSurfaces(state, tools, round) {
  const { root, verdicts, trace } = state
  const t0Gate = Date.now()
  try {
    const measured = await tools.runSurfaceGate({
      root,
      mockupLayout: state.design.mockupScreenshot?.layout ?? null,
    })
    const copy = await tools.runCopyGate({ root })
    // A new object, not a push into the measured one: the caller's
    // result is its own to keep.
    const findings = [...measured.findings, ...copy.findings]
    const gate = {
      ...measured,
      findings,
      errorCount: findings.filter((f) => f.severity === 'error').length,
    }
    const drift = recordMockupDrift(state, round, gate.mockupFindings)
    recordMeasurement(state, tools, { round, gate, copy, drift, t0Gate })
    return gate
  } catch (err) {
    // Non-blocking, exactly like the critic: a gate that cannot run
    // must not stop a build that otherwise passed.
    console.warn(`  [surface-gate] failed (non-blocking): ${err.message}`)
    // A gate that threw looks like one that passed unless it says so
    // (#565): the verdict reaches verdicts.json and the rating issue,
    // the step reaches the trace, surface-gate.json reaches record.json.
    recordGateFailure({ verdicts, trace, round, err, durationMs: Date.now() - t0Gate })
    return null
  }
}

/**
 * Surfaces the critic can see but no agent can edit. `/work` and
 * `/experiments` are authored route files outside MUTABLE_FILES: the
 * 657px overflow on `/experiments` (#215) lived in a file the React
 * Engineer is never given, so routing that feedback to it produces a
 * confident edit to something it cannot open. This record is written
 * whenever a human-owned surface errors, independent of the critic's
 * verdict and of whether an engineer revision runs — a hand-written route
 * can break on a night the critic says SHIP, and that must still leave a
 * record (#468).
 * @param {import('./run-state.js').RunState} state
 * @param {object} tools
 * @param {Array<object>} surfaceFindings
 */
function recordHumanFaults(state, tools, surfaceFindings) {
  const humanFaults = tools.faultsForOwner(surfaceFindings, 'human')
  if (humanFaults.length === 0) return
  const unownableRoutes = [...new Set(humanFaults.map((f) => f.surface))]
  console.warn(
    `  [surface-gate] ${unownableRoutes.join(', ')} — authored route(s), no agent owns these files; needs a human`
  )
  state.verdicts.push({
    critic: 'surface-gate',
    verdict: 'NEEDS-HUMAN',
    feedback: `Authored routes outside MUTABLE_FILES failed the gate: ${unownableRoutes.join(', ')}\n\n${tools.formatFindingsForCritic(humanFaults)}`,
    ts: Date.now(),
  })
}

/**
 * The first screenshot judgment, recorded, and the revisions it or the
 * gate asks for. Only a critic that saw the build gets a vote:
 * judgeScreenshot says UNVERIFIED for a truncated reply or a text-only
 * fallback, and a REVISE from either is not a finding (09-09 paid the
 * engineer to revise against a sentence about token counts, #570). No
 * verdict skips the critic-driven revision and keeps the gate-driven one,
 * as the mockup-critic loop does for a malformed reply. A critic that
 * cannot be reached at all is the same case (#619).
 * @param {import('./run-state.js').RunState} state
 * @param {object} run
 * @returns {Promise<object|null>} the revision rounds' decision, or null when none ran
 */
async function judgeAndRevise(state, run) {
  const { tools, firstGate } = run
  const t0ScreenshotCritic = Date.now()
  const {
    verdict: screenshotVerdict,
    criticResponse,
    visionChannel,
    bar,
  } = await judgeOrNoVerdict((gate) => run.judge(gate, 'first'), firstGate)

  state.verdicts.push({
    critic: 'screenshot-critic',
    verdict: screenshotVerdict,
    feedback: criticResponse.slice(0, 2000),
    channel: visionChannel,
    ts: Date.now(),
    ...(bar ? { bar } : {}),
  })

  state.trace.addStep({
    name: 'screenshot-critic',
    phase: 4,
    input: {},
    output: {
      verdict: screenshotVerdict,
      feedback: criticResponse.slice(0, 500),
    },
    durationMs: Date.now() - t0ScreenshotCritic,
  })

  if (screenshotVerdict !== 'REVISE' && !run.gateDemandsRevision) {
    tools.logNoRevision(screenshotVerdict, visionChannel)
    return null
  }
  const { responsibleAgent, criticFeedback } = tools.readRevisionRequest(
    screenshotVerdict,
    criticResponse
  )
  // The measured faults ride along whether or not the critic mentioned
  // them: they are exact, and they are the reason a SHIP is being
  // revised when the gate forced it. The tap-target warnings ride
  // along too, after the errors (#488): a revision is already
  // opening this file, which is the cheapest point there ever is to
  // also widen a link.
  const feedback = feedbackFor(tools, firstGate, criticFeedback)

  console.log(
    tools.describeRevision(screenshotVerdict, responsibleAgent, run.engineerFaults.length)
  )
  console.log(`  feedback: ${feedback.slice(0, 200)}...`)

  return await runRevisionRounds(state, run, {
    responsibleAgent,
    feedback,
    verdict: screenshotVerdict,
  })
}

/**
 * Screenshot Critic Gate. The on-disk passing state must already be in
 * `state.passingSnapshot`: a post-critic revision that breaks the build
 * restores it.
 * @param {import('./run-state.js').RunState} state
 * @returns {Promise<{ remainingFaults: Array<object>, measured: boolean, rounds: number }>}
 */
async function runScreenshotCriticGate(state) {
  const tools = await loadGateTools()
  const firstGate = await measureSurfaces(state, tools, 1)
  const surfaceFindings = firstGate?.findings ?? []

  // The gate decides, not just measures. An error on a surface the
  // engineer owns forces a revision whether or not the critic, who looks
  // at three images, noticed it. Errors on authored routes are reported
  // for a human and cannot force anything: no agent can edit them.
  const engineerFaults = tools.faultsForOwner(surfaceFindings, 'react-engineer')
  const gateDemandsRevision = engineerFaults.length > 0
  if (gateDemandsRevision) {
    console.warn(
      `  [surface-gate] ${engineerFaults.length} error(s) on engineer-owned surfaces — a revision is required regardless of the critic's verdict`
    )
  }
  recordHumanFaults(state, tools, surfaceFindings)

  const run = {
    tools,
    firstGate,
    engineerFaults,
    gateDemandsRevision,
    measureSurfaces: (round) => measureSurfaces(state, tools, round),
    judge: (gate, purpose) => judgeScreenshot(state, gate, purpose, tools.formatMeasuredForCritic),
  }

  // What ships, or does not: the engineer-owned errors the last
  // measurement left, and whether anything was measured at all. Every
  // path below leaves this honest, including the ones that put the
  // round-1 build back on disk with its round-1 faults.
  let decision = { remainingFaults: engineerFaults, measured: firstGate != null, rounds: 0 }

  try {
    decision = (await judgeAndRevise(state, run)) ?? decision
  } catch (err) {
    if (err.fatal) throw err
    console.warn(`  [screenshot-critic] Failed (non-blocking): ${err.message}`)
    console.warn(
      decision.remainingFaults.length
        ? `  ${decision.remainingFaults.length} measured fault(s) stand — the ship decision follows`
        : '  Shipping without screenshot review'
    )
  }
  return decision
}

/**
 * The decision between the gate and the archive. Until 2026-09-21 there
 * was none: the gate returned nothing and `archive()` ran unconditionally,
 * so a build the gate had measured and condemned shipped on nine different
 * paths (#625) — after the one revision left faults, after a revision broke
 * the build and the round-1 build was put back, after the patch was
 * refused, after the deadline. The workflow's e2e gate then failed the
 * night on the same faults, with every call already paid for.
 *
 * A build with engineer-owned errors still on it does not ship. The
 * sources go to build-failed-sources-* and the run fails the way a build
 * failure does, so the failure issue carries the faults and the handoff
 * a resume can start from (#578). A run that could not measure at all
 * still ships: that is a tooling failure, and the e2e gate is its
 * backstop.
 *
 * @param {import('./run-state.js').RunState} state
 * @param {{ remainingFaults: Array<object>, measured: boolean, rounds: number }} decision
 */
async function refuseKnownFaults(state, decision) {
  const { measured, rounds } = decision
  // Drift from the mockup forced its revisions and ships whatever is left
  // of it, recorded for the rating issue (mockup-drift-gate.js).
  const drifted = measured ? driftedVerdict(decision.remainingFaults) : null
  if (drifted) {
    console.warn(
      `  [ship-gate] the build still drifts from the mockup after ${rounds} revision round(s) — shipping, recorded as ${drifted.verdict}`
    )
    state.verdicts.push(drifted)
  }
  const remainingFaults = blockingFaults(decision.remainingFaults)
  if (!measured) {
    console.warn(
      `  [ship-gate] the last round measured nothing — shipping unmeasured, ${remainingFaults.length} fault(s) known from the round before`
    )
    return
  }
  if (remainingFaults.length === 0) return
  const { formatFindingsForCritic } = await import('../utils/surface-gate.js')
  // Loosened on 2026-09-21 after six paid runs ended without a night
  // (#633): the rounds run, and what they leave ships with the record
  // saying so, until the first pass measures few enough errors for the
  // loop to clear (#634). Unset, the gate refuses as #626 intended.
  if (process.env.SHIP_GATE === 'lenient') {
    console.warn(
      `  [ship-gate] ${remainingFaults.length} engineer-owned fault(s) remain after ${rounds} revision round(s) — SHIP_GATE=lenient, shipping with the faults logged (#633)`
    )
    state.verdicts.push({
      critic: 'ship-gate',
      verdict: 'SHIPPED-WITH-FAULTS',
      feedback: formatFindingsForCritic(remainingFaults).slice(0, 2500),
      ts: Date.now(),
    })
    return
  }
  console.error(
    `  [ship-gate] ${remainingFaults.length} engineer-owned fault(s) remain after ${rounds} revision round(s) — refusing to ship`
  )
  await archiveFailedSources(state)
  throw new Error(
    `Refusing to ship: ${remainingFaults.length} engineer-owned fault(s) remain after ${rounds} revision round(s).\n\n${formatFindingsForCritic(remainingFaults).slice(0, 2500)}`
  )
}

/**
 * The gate phase: snapshot the passing build, run the gate and the
 * revisions, and refuse a build that still carries engineer-owned faults.
 * @param {import('./run-state.js').RunState} state
 */
export async function runGatePhase(state) {
  // Snapshot the exact on-disk passing state (mutable files plus any extra
  // paths the agents wrote). If a post-critic revision breaks the build we
  // restore THIS — originalBackup holds yesterday's files, incompatible
  // with today's preset.ts.
  await snapshotPassingState(state)
  await refuseKnownFaults(state, await runScreenshotCriticGate(state))
}
