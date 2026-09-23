/**
 * The state one `runAgentSwarm` run carries between its phases (#221).
 *
 * The swarm used to be one closure over about thirty locals, with nested
 * functions reaching into them. The phases under scripts/pipeline/ each take
 * this object instead: they read what the phases before them left on it and
 * write what they produce. What the rollback and the failure archive need
 * (the backup map, the written paths, whether archive() ran) lives here too,
 * so `saveTrace`, `archiveFailedSources` and `rollBackCheckout` are plain
 * functions of the state rather than closures.
 */
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { setRunDeadline } from '../utils/run-budget.js'
import { cleanupOrphans, restore } from '../utils/file-manager.js'
import { writeFailureRecords, writeShippedHandoff } from '../utils/failure-record.js'
import { createTrace } from '../utils/trace.js'
import { traceReplay } from '../utils/call-tape.js'
import { hashToRange } from '../utils/deterministic-hash.js'
import { modelFor, isDevModelTier } from '../utils/models.js'

/**
 * Resolve the WEIGHT_RISK creative weight. An explicitly-set env value
 * (anything other than undefined or the empty string — including '0',
 * which is falsy in JS but not "unset") always wins. Otherwise risk is
 * derived deterministically from the build date via {@link hashToRange},
 * range 3-10 inclusive — same date always derives the same risk (a
 * re-run of today's build doesn't change today's risk), different dates
 * spread across the range instead of a fixed constant.
 *
 * Before this, the fallback was a constant '8', which meant every day the
 * owner panel left WEIGHT_RISK unset produced the exact same risk value
 * and therefore the exact same Creative Weights prompt sentence.
 *
 * @param {string|undefined} envValue - raw process.env.WEIGHT_RISK
 * @param {string} date - build date, 'YYYY-MM-DD'
 * @returns {{ risk: number, explicitlySet: boolean }}
 */
export function resolveRiskWeight(envValue, date) {
  const derived = () => ({ risk: hashToRange(`risk:${date}`, 3, 10), explicitlySet: false })
  if (envValue === undefined || envValue === '') return derived()
  const risk = Number.parseInt(envValue, 10)
  // The other three dials fall back on a non-number and say so; this one
  // carried NaN through (#301). describeRiskTier(NaN) fails every >= and
  // reads as SAFE, the log printed risk=NaN, and archiver's `?? 5` does not
  // catch NaN so build.json stored null. The owner panel writes this as a
  // repo variable and the workflow passes it through raw.
  if (Number.isNaN(risk)) {
    console.warn(
      `  WEIGHT_RISK=${JSON.stringify(envValue)} is not a number — deriving from the date`
    )
    return derived()
  }
  return { risk, explicitlySet: true }
}

/**
 * A repo var set to something that is not a number used to reach the prompt
 * as "signals=NaN". Fall back to the default, and say so.
 * @param {string} name
 * @param {number} fallback
 * @returns {number}
 */
function weightFromEnv(name, fallback) {
  const raw = process.env[name]
  if (raw === undefined || raw === '') return fallback
  const n = Number.parseInt(raw, 10)
  if (Number.isNaN(n)) {
    console.warn(`  ${name}=${JSON.stringify(raw)} is not a number — using ${fallback}`)
    return fallback
  }
  return n
}

/**
 * The creative weights this run uses, logged. WEIGHT_RISK is the one dial
 * that varies by date rather than falling back to a constant: a fixed
 * fallback (the old default was '8') meant every day the owner panel left
 * WEIGHT_RISK unset rendered the exact same "BOLD" prompt sentence. When the
 * env var is absent or empty (the owner panel writes a real value when it
 * wants to override), risk 3-10 is derived from the build date instead —
 * reproducible per day, varied across days. An explicitly-set repo var
 * (including '0', which is falsy in JS but not "unset") always wins over the
 * derived value.
 * @param {string} today
 * @returns {{ signals: number, inspiration: number, ratings: number, risk: number }}
 */
function readWeights(today) {
  const { risk: riskWeight, explicitlySet: riskExplicitlySet } = resolveRiskWeight(
    process.env.WEIGHT_RISK,
    today
  )
  const weights = {
    signals: weightFromEnv('WEIGHT_SIGNALS', 5),
    inspiration: weightFromEnv('WEIGHT_INSPIRATION', 5),
    ratings: weightFromEnv('WEIGHT_RATINGS', 5),
    risk: riskWeight,
  }
  console.log(
    `  creative weights: signals=${weights.signals} inspiration=${weights.inspiration} ratings=${weights.ratings} risk=${weights.risk}${riskExplicitlySet ? '' : ' (derived from date — WEIGHT_RISK unset)'}`
  )
  console.log(
    `  model tier: ${isDevModelTier() ? 'DEV (sonnet ceiling — local Max-plan, no Opus)' : 'PROD (best per job — opus mockup designer)'} | mockup-designer=${modelFor('mockup-designer')}`
  )
  return weights
}

/**
 * @typedef {object} RunState
 * @property {string} root - the checkout the run reads and writes under
 * @property {Array<object>|undefined} tape - paid responses an earlier run left
 * @property {string} today - runDate(signals)
 * @property {object} signals
 * @property {string|undefined} brief
 * @property {string} contentSummary
 * @property {string} boundaryId - the run's data-boundary suffix
 * @property {{ signals: number, inspiration: number, ratings: number, risk: number }} weights
 * @property {number} deadline - epoch ms the run must be done by
 * @property {ReturnType<typeof createTrace>} trace
 * @property {Map<string, string|null>|null} originalBackup - the pre-run snapshot of
 *   MUTABLE_FILES; null until the first write is about to happen
 * @property {Map<string, string|null>|null} passingSnapshot - the on-disk state that last
 *   passed a build, once there is one
 * @property {Set<string>} writtenPaths - every path the run wrote
 * @property {boolean} archiveRan - archive() returned: the night shipped
 * @property {Array<object>} verdicts - every critic and gate verdict, for verdicts.json
 * @property {object|null} finalScreenshot - the screenshot critic's capture of the build
 * @property {Array<object>} mockupMeasurableRounds - mockup-measurables.json
 * @property {Array<object>} mockupFidelityRounds - mockup-fidelity.json
 * @property {object} prompts - loaded by context.js
 * @property {object} inputs - loaded by context.js: archive history, taste, mandates
 * @property {object} ad - the Art Director phase's settled result and declarations
 * @property {object} design - the mockup phase's brief, lane and approved mockup
 * @property {object} engineer - the engineer's config, latest result and repair brief template
 * @property {string} rationaleSuffix - ` (repair N)` when a repair passed the build
 * @property {{ rationale: string, design_brief: string, files: Array<object> }|null} result -
 *   what runAgentSwarm returns, set by the archive phase
 */

/**
 * Build the state at entry. Logs the creative weights, publishes the run
 * deadline and starts the trace, in that order.
 * @param {{ signals: object, brief?: string, contentSummary: string, boundaryId: string }} context
 * @param {{ root: string, tape?: Array<object>, today: string, onTraceStep?: Function }} options
 * @returns {RunState}
 */
export function createRunState(context, { root, tape, today, onTraceStep }) {
  const { signals, brief, contentSummary, boundaryId } = context
  const weights = readWeights(today)

  // Run-level deadline: per-call timeouts protect against hangs, not
  // against an honest slow day blowing the Actions job timeout mid-run
  // (which kills the process with no trace). Past the deadline we stop
  // STARTING expensive optional work and ship what we have.
  const deadline = Date.now() + parseInt(process.env.RUN_BUDGET_MINUTES || '60', 10) * 60000
  // Publish it so every model call clamps its own timeout to what is left,
  // rather than each agent's cap being checked only between phases.
  // pastDeadline() is run-budget's: "past" means less than one call's worth
  // remains, the same floor the clamp refuses at, so a phase never starts a
  // call the clamp is about to throw on (#299).
  setRunDeadline(deadline)

  const trace = createTrace(today, {
    onStep: (step) => {
      console.log(`[TRACE] ${JSON.stringify(step)}`)
      onTraceStep?.(step)
    },
  })
  traceReplay(trace)

  return {
    root,
    tape,
    today,
    signals,
    brief,
    contentSummary,
    boundaryId,
    weights,
    deadline,
    trace,
    // Whether archive() succeeded in this run, so saveTrace() knows whether
    // to write into the current build dir or create a failed-build dir.
    archiveRan: false,
    // Every path written during the swarm, so orphan files (paths the AI
    // invented beyond MUTABLE_FILES) are cleaned up on any failure.
    // restore(originalBackup) only reverts paths in the backup; files created
    // by the AI outside that set would leak without this tracking.
    writtenPaths: new Set(),
    // The pre-run snapshot of MUTABLE_FILES, taken once the prompts have
    // loaded, so the rollback can restore it from any throw after the first
    // write; null means nothing was written yet.
    originalBackup: null,
    passingSnapshot: null,
    // Critic verdicts collected across the run; persisted as verdicts.json
    verdicts: [],
    // Final-render screenshot captured by the screenshot critic; persisted
    // as screenshot.png (also becomes public/archive/{date}.png and the
    // calibration source for future runs).
    finalScreenshot: null,
    // The measured design-fidelity numbers (#487) per mockup revision round,
    // so the mockup-versus-build gap is visible for every round the critic
    // saw, not only the last — archived as mockup-measurables.json.
    mockupMeasurableRounds: [],
    // Where each surface-gate round's build drifted from the approved mockup,
    // archived as mockup-fidelity.json. Only rounds that had a mockup to
    // compare against are recorded.
    mockupFidelityRounds: [],
    prompts: {},
    inputs: {},
    ad: {},
    design: {},
    engineer: {},
    rationaleSuffix: '',
    result: null,
  }
}

/**
 * The newest shipped build dir under archive/<date>/, or undefined.
 * @param {string} archiveDateDir
 */
function latestBuildDir(archiveDateDir) {
  return readdirSync(archiveDateDir, { withFileTypes: true })
    .filter(
      (b) =>
        b.isDirectory() &&
        b.name.startsWith('build-') &&
        !b.name.startsWith('build-failed-') &&
        !b.name.startsWith('build-pre-')
    )
    .sort()
    .reverse()[0]
}

/**
 * Write the run's trace: into the build dir archive() just made when the
 * night shipped, or into a new build-failed-* dir with the error, the spend
 * and the paid responses when it did not. Never throws.
 * @param {RunState} state
 * @param {Error|null} error - what ended the run, if anything
 */
export async function saveTrace(state, error) {
  const { root, today, signals, trace } = state
  try {
    const archiveDateDir = path.join(root, 'archive', today)

    if (state.archiveRan) {
      await writeShippedHandoff({ root, date: today, signals })
      // Success path: find the build dir that archive() just created
      const build = latestBuildDir(archiveDateDir)
      if (build) {
        await writeFile(path.join(archiveDateDir, build.name, 'trace.json'), trace.toJSON(), 'utf8')
        console.log(`  trace saved to ${build.name}/trace.json`)
        return
      }
    }

    // Failure path: create a dedicated build-failed-* dir so failure
    // diagnostics are preserved without corrupting prior successful builds
    const failedDir = path.join(archiveDateDir, `build-failed-${Date.now()}`)
    await mkdir(failedDir, { recursive: true })
    await writeFile(path.join(failedDir, 'trace.json'), trace.toJSON(), 'utf8')
    if (error) {
      await writeFile(
        path.join(failedDir, 'error.txt'),
        `${error.message || String(error)}\n\n${error.stack || ''}`,
        'utf8'
      )
    }
    // A failed night's spend used to vanish: archive()'s cost.json only
    // exists on the success path (#432), and the paid responses of its first
    // stages went with the runner (#578). Both are kept beside the trace.
    await writeFailureRecords(failedDir, { root, date: today, signals })
    console.log(`  failure trace saved to ${path.basename(failedDir)}/trace.json`)
    // Also emit trace to stdout so it's captured in Actions logs even if
    // the filesystem write fails for some reason.
    console.log(`[TRACE-FINAL] ${trace.toJSON()}`)
  } catch (err) {
    console.warn(`  trace save failed (non-blocking): ${err.message}`)
    // Last-ditch: emit to stdout so logs always have it
    try {
      console.log(`[TRACE-FINAL] ${trace.toJSON()}`)
    } catch {}
  }
}

/**
 * Snapshot the agent-written files into the failure archive BEFORE
 * restore() reverts them. Without this, a build failure destroys the only
 * copy of the failing sources — error.txt tells you WHAT broke but the
 * code that broke it is gone (every build-failed-* dir before 2026-07-10
 * has exactly this gap). Never throws.
 * @param {RunState} state
 */
export async function archiveFailedSources(state) {
  const { root, today, writtenPaths } = state
  try {
    const dir = path.join(root, 'archive', today, `build-failed-sources-${Date.now()}`)
    let count = 0
    for (const relPath of writtenPaths) {
      const abs = path.join(root, relPath)
      if (!existsSync(abs)) continue
      const dest = path.join(dir, relPath)
      await mkdir(path.dirname(dest), { recursive: true })
      await copyFile(abs, dest)
      count++
    }
    if (count > 0)
      console.log(`  failing sources (${count} files) archived to ${path.basename(dir)}/`)
  } catch (err) {
    console.warn(`  failed-source archive failed (non-blocking): ${err.message}`)
  }
}

/**
 * The one rollback. "A run either ships a night or fails and rolls the
 * checkout back" (CONTEXT.md), so every throw between the first write and
 * archive() ends here through runAgentSwarm's catch, whichever phase raised
 * it. Once archive() has returned the night shipped and there is nothing to
 * undo. A rollback that itself fails must not replace the error that ended
 * the run.
 * @param {RunState} state
 */
export async function rollBackCheckout(state) {
  const { originalBackup, root } = state
  if (!originalBackup || state.archiveRan) return
  try {
    await cleanupOrphans(state.writtenPaths, originalBackup, { root })
    await restore(originalBackup, { root })
  } catch (rollbackErr) {
    console.error(`  rollback failed (checkout may be dirty): ${rollbackErr.message}`)
  }
}
