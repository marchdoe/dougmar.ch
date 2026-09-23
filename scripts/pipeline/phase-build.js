/**
 * Phase 4 and 5: build validation, and the React Engineer's repairs when the
 * first build fails (#221). Returns once a build passes, with the files on
 * disk in `state.engineer.result` and `state.rationaleSuffix` naming the
 * repair that passed; throws when the repairs run out.
 */
import { pastDeadline } from '../utils/run-budget.js'
import { noteRetry } from '../utils/cost-ledger.js'
import { validateBuild } from '../utils/build-validator.js'
import { callAgent } from './call-agent.js'
import { applyEngineerPatch, buildRepairBrief, FILE_OWNERSHIP } from './engineer-tools.js'
import { archiveFailedSources } from './run-state.js'

/**
 * Identify which agent's files appear in a build error.
 *
 * @param {string} errorOutput
 * @returns {'art-director'|'react-engineer'|'both'}
 */
export function identifyFailingAgent(errorOutput) {
  const agents = new Set()

  for (const [filePath, agent] of Object.entries(FILE_OWNERSHIP)) {
    if (errorOutput.includes(filePath)) {
      agents.add(agent)
    }
  }

  if (agents.size === 0) return 'both'
  if (agents.size === 2) return 'both'
  return [...agents][0]
}

/**
 * How a failed build is repaired: how many attempts, and the error the first
 * one is given.
 *
 * Every repair goes to the React Engineer, and it has no way to fix a failure
 * that names only `elements/preset.ts`. Its repair brief lists just the files
 * it owns (`engineerOwnedPaths` leaves the preset out), so it never sees the
 * file, and its prompt says never to emit it. A reply block for the preset
 * would still be written, but it would be a blind rewrite of the Art
 * Director's palette. The failures that name only the preset are about the
 * preset itself, a semantic colour the frozen set is missing or has extra or
 * a token that references itself, and no edit to the engineer's files
 * touches them. Three attempts on such an error can only repeat it, so none
 * are made and the run fails with the reason.
 *
 * `identifyFailingAgent` answers 'both' whenever the error also names an
 * engineer file or names none, so those still get every attempt.
 *
 * @param {'art-director'|'react-engineer'|'both'} failingAgent
 * @param {string} error the build error
 * @param {number} maxAttempts the bound when a repair can help
 * @returns {{ attempts: number, error: string }}
 */
export function planRepairs(failingAgent, error, maxAttempts) {
  if (failingAgent !== 'art-director') return { attempts: maxAttempts, error }
  return {
    attempts: 0,
    error:
      "The failure is in elements/preset.ts, which the Art Director wrote. The React Engineer's repair brief does not include that file and its instructions forbid writing it, so no repair was attempted.\n\n" +
      error,
  }
}

/**
 * Build failures are almost always in the React Engineer's TSX.
 * The Art Director's preset.ts is validated by codegen earlier in
 * the pipeline, so a build failure on preset.ts at this stage means
 * a downstream typing problem — best handled by React Engineer
 * retry rather than full Art Director re-run (which is more expensive).
 * One attempt was never enough. The engineer averages about one small slip
 * per generation, and while a repair regenerated every file it owned a
 * single attempt reliably traded the error it was given for a different
 * one and the night was lost. Observed three times in one day on 2026-09-01:
 *
 *   CI dry run   width: 'full'  -> repair -> bg: 'surfaceDeep'
 *   local run 3  gap: '10'      -> repair -> Footer.tsx TS2769
 *
 * A repair is a patch now (#432), which shrinks the surface each attempt
 * can break; the bound stays because a patch can still miss. A lost night
 * costs the whole run, so the trade is worth making up to a bound. Attempts stop
 * early when the run budget is spent — a repair that starts after the
 * deadline cannot finish and archive.
 */
const MAX_REPAIR_ATTEMPTS = 3

/**
 * Record one repair attempt in the trace.
 * @param {import('./run-state.js').RunState} state
 * @param {{ attempt: number, errorGiven: string, t0: number, output: object }} step
 */
function traceRepair(state, { attempt, errorGiven, t0, output }) {
  state.trace.addStep({
    name: 'repair',
    phase: 5,
    input: { attempt, error: errorGiven?.slice(0, 2000) },
    output,
    durationMs: Date.now() - t0,
  })
}

/**
 * Brief the engineer and take its patch reply. A repair call that itself
 * crashes ends the run with the real error rather than building on it.
 * @param {import('./run-state.js').RunState} state
 * @param {string} repairError
 * @param {{ attempt: number, errorGiven: string, t0: number }} step
 */
async function askForRepair(state, repairError, step) {
  const config = state.engineer.config
  try {
    const briefed = await buildRepairBrief(state, repairError)
    const reply = await callAgent('react-engineer', config.patchPrompt, briefed.brief, {
      ...config.options,
      patch: true,
      purpose: 'repair',
    })
    return { owned: briefed.owned, reply }
  } catch (err) {
    console.error(`  react-engineer repair failed: ${err.message}`)
    traceRepair(state, {
      ...step,
      output: { files: 0, success: false, error: err.message.slice(0, 2000) },
    })
    // If the repair agent itself crashed, don't silently continue to
    // validateBuild — bail out with the real error so debugging points
    // at the actual cause (code review #14).
    await archiveFailedSources(state)
    throw new Error(`react-engineer repair crashed: ${err.message}`)
  }
}

/**
 * One repair attempt: brief, patch, build. Returns the error the next
 * attempt is given, or null when the build passed.
 * @param {import('./run-state.js').RunState} state
 * @param {number} attempt
 * @param {string} repairError
 * @returns {Promise<string|null>}
 */
async function attemptRepair(state, attempt, repairError) {
  const { root, today } = state
  console.log(
    `\n  repair attempt ${attempt}/${MAX_REPAIR_ATTEMPTS} — sending react-engineer a repair brief...`
  )
  noteRetry()
  // Snapshotted before this attempt can move the error on — the trace step
  // for this attempt must record what THIS attempt was given, not what the
  // next one will be.
  const step = { attempt, errorGiven: repairError, t0: Date.now() }
  const { owned, reply: retryResult } = await askForRepair(state, repairError, step)

  // The merged set (disk plus the reply) must still hold every required
  // file and respect the posture: a reply that empties Sidebar.tsx, or a
  // nav the posture forbids, would otherwise ship as "repair N" (#297).
  // applyEngineerPatch checks before it writes, so a reply that fails
  // never touches disk; the attempt is spent on the problem, not a build.
  const applied = await applyEngineerPatch(state, owned, retryResult, 'React Engineer repair')
  if (applied.problem) {
    console.warn(`  ⚠ ${applied.problem.message} — repair attempt ${attempt} not built`)
    const nextError = `${applied.problem.message}\n\n${applied.problem.reminder}`
    traceRepair(state, {
      ...step,
      output: { files: applied.replied, success: false, error: nextError.slice(0, 2000) },
    })
    return nextError
  }

  // The merged set, so the archive records what is on disk after the
  // patch rather than the files the reply happened to carry.
  state.engineer.result = retryResult

  const attemptBuild = validateBuild({ root, shell: state.ad.shellDecl, date: today })
  const output = {
    files: applied.replied,
    written: applied.written,
    deleted: applied.deleted,
    merged: retryResult.files.length,
  }
  if (attemptBuild.success) {
    console.log(`\n=== Repair build passed on attempt ${attempt}! ===`)
    traceRepair(state, { ...step, output: { ...output, success: true, error: undefined } })
    return null
  }

  traceRepair(state, {
    ...step,
    output: { ...output, success: false, error: attemptBuild.error?.slice(0, 2000) },
  })
  console.warn(`  repair attempt ${attempt} did not pass — carrying the new error forward`)
  return attemptBuild.error
}

/**
 * Phase 5: the build failed — identify the failing agent and repair. Nothing
 * is restored or reset before the repairs. Phase 3's files ARE the base a
 * repair patches (#432): the engineer is told what is on disk and returns
 * only what must change. The restore of the engineer's files from
 * originalBackup that used to run here would put yesterday's Layout.tsx
 * under today's patched og.tsx, and the slate reset #437 added for full
 * regenerations (drop what the reply omits) would delete the very files a
 * patch leaves alone on purpose, so both are gone. Art Director files were
 * never restored here: a build failure involving preset.ts is handled by
 * the engineer adapting to today's tokens, since codegen is not re-run in
 * Phase 5.
 * @param {import('./run-state.js').RunState} state
 * @param {string} buildError
 */
async function repairBuild(state, buildError) {
  console.log('\n[phase-5] Build failed — retrying failing agent(s)')

  const failingAgent = identifyFailingAgent(buildError)
  console.log(`  identified failing agent: ${failingAgent}`)

  const repairPlan = planRepairs(failingAgent, buildError, MAX_REPAIR_ATTEMPTS)
  let repairError = repairPlan.error
  let attempt = 0

  while (attempt < repairPlan.attempts) {
    if (pastDeadline()) {
      console.warn(
        `  [deadline] run budget exhausted after ${attempt} repair attempt(s) — stopping`
      )
      break
    }
    attempt++
    const nextError = await attemptRepair(state, attempt, repairError)
    if (nextError === null) {
      state.rationaleSuffix = ` (repair ${attempt})`
      return
    }
    repairError = nextError
  }

  // All attempts exhausted — snapshot the failing sources, then throw;
  // runAgentSwarm's catch restores the checkout
  await archiveFailedSources(state)
  throw new Error(
    `Build failed after ${attempt} repair attempt(s). Error:\n${repairError?.slice(0, 2500)}`
  )
}

/**
 * Phase 4: validate the build; on a failure, repair it (Phase 5).
 * @param {import('./run-state.js').RunState} state
 */
export async function runBuildPhase(state) {
  const { root, today, trace } = state
  console.log('\n[phase-4] Build validation')
  const buildResult = validateBuild({ root, shell: state.ad.shellDecl, date: today })

  trace.addStep({
    name: 'build-validation',
    phase: 4,
    input: {},
    output: {
      success: buildResult.success,
      // 500 cut the token gate's message mid-filename, before the part that
      // names the property and the value that did not resolve — so the one
      // artifact left behind by a lost night could not say what broke.
      error: buildResult.success ? undefined : (buildResult.error || '').slice(0, 4000),
    },
    durationMs: 0,
  })

  if (buildResult.success) {
    console.log('\n=== Build passed! ===')
    return
  }
  await repairBuild(state, buildResult.error)
}
