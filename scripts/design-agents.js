#!/usr/bin/env node

/**
 * Designer Agent Swarm Orchestrator
 *
 * Dispatches specialized Claude CLI agents sequentially:
 *   Phase 0+1: Art Director   — hero copy, archetype, chassis, preset.ts,
 *                                visual spec (orchestrator generates
 *                                __root.tsx + chassis-preset.ts deterministically
 *                                from the Director-chosen typography chassis)
 *   Phase 2a:  Mockup Designer — one self-contained mockup.html (Opus)
 *   Phase 2b:  Mockup Critic   — blocking vision gate over a screenshot of
 *                                the mockup; ≤2 REVISE rounds back to 2a
 *   Phase 2c:  React Engineer  — translates the approved mockup into the
 *                                production TSX files (Sonnet)
 *
 * Each agent gets the creative brief, relevant reference files, and (after
 * Phase 1) the design tokens from preset.ts. Build validation and retry
 * logic ensure the final output compiles.
 *
 * The phases live under scripts/pipeline/ (#221), each a function of the
 * run's state (run-state.js) that throws on failure:
 *   context.js             prompts, references, backup, archive history, mandates
 *   phase-art-director.js  Art Director, generated files, codegen
 *   phase-mockup.js        Mockup Designer and Mockup Critic rounds
 *   phase-engineer.js      React Engineer and the output patch
 *   phase-build.js         build validation and the repair patches
 *   phase-gate.js          surface gate, screenshot critic, revision rounds, ship gate
 *   phase-archive.js       og card, archetype, archive()
 * runAgentSwarm runs them in order; its catch rolls the checkout back and
 * its finally saves the trace.
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env'), quiet: true })

import { readContext } from './utils/site-context.js'
import { ROOT } from './utils/file-manager.js'
import { resetLedger } from './utils/cost-ledger.js'
import { startTape } from './utils/call-tape.js'
import { parseDelimiterResponse } from './utils/delimiter-parser.js'
import { runDate } from './utils/run-date.js'
import { isMain } from './utils/cli.js'
import { loadRunContext } from './pipeline/context.js'
import { runArtDirectorPhase } from './pipeline/phase-art-director.js'
import { runMockupPhase } from './pipeline/phase-mockup.js'
import { runEngineerPhase } from './pipeline/phase-engineer.js'
import { runBuildPhase } from './pipeline/phase-build.js'
import { runGatePhase } from './pipeline/phase-gate.js'
import { runArchivePhase } from './pipeline/phase-archive.js'
import { createRunState, rollBackCheckout, saveTrace } from './pipeline/run-state.js'
import { newBoundaryId } from './utils/data-boundary.js'
export { parseDelimiterResponse }
export { resolveRiskWeight } from './pipeline/run-state.js'
export { archiveArtifacts } from './pipeline/phase-archive.js'
export { describeRiskTier } from './pipeline/phase-art-director.js'
export { buildCompositionContractBlock } from './pipeline/phase-mockup.js'
export {
  dropOrchestratorFiles,
  dropUnwritableFiles,
  FILE_OWNERSHIP,
} from './pipeline/engineer-tools.js'
export { identifyFailingAgent, planRepairs } from './pipeline/phase-build.js'
export { EXTRA_REVISION_ROUND_CAP, MAX_REVISION_ROUNDS } from './pipeline/revision-rounds.js'

// ---------------------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------------------

/**
 * Run the design agent swarm.
 *
 * Phase 0+1: Art Director (hero copy, archetype, chassis, preset.ts,
 *            visual spec; orchestrator deterministically generates
 *            __root.tsx + chassis-preset.ts)
 * Phase 2a: Mockup Designer — one self-contained mockup.html
 * Phase 2b: Mockup Critic — blocking vision gate, ≤2 revision rounds
 * Phase 2c: React Engineer — translates the approved mockup to TSX
 * Phase 4: Build validation
 * Phase 5: Retry on failure
 *
 * @param {{ signals: object, brief: string, contentSummary: string, boundaryId?: string }} context
 *   `boundaryId` is the run's data-boundary suffix (utils/data-boundary.js): a
 *   fresh random one by default, fixed by a test so a prompt snapshot stays
 *   byte for byte
 * @param {{ onTraceStep?: Function, root?: string, tape?: Array<object> }} [options]
 *   `root` is the checkout the swarm reads prompts from and writes generated
 *   files, signals and the archive under; defaults to the repo. `tape` is the
 *   paid responses an earlier run left (utils/call-tape.js): the Art Director
 *   and the mockup loop are answered from it, and the engineer is asked live
 * @returns {Promise<{ rationale: string, design_brief: string, files: Array<{path: string, content: string}> }>}
 */
export async function runAgentSwarm(context, { onTraceStep, root = ROOT, tape } = {}) {
  const { signals, boundaryId = newBoundaryId() } = context

  // Start this run's cost accounting from zero. The ledger is module-level,
  // so a second swarm in the same process (the dev panel's Run button) would
  // otherwise bill the previous run's calls to this one.
  resetLedger()
  startTape(tape)

  const today = runDate(signals)
  const state = createRunState({ ...context, boundaryId }, { root, tape, today, onTraceStep })

  let swarmError = null
  try {
    await loadRunContext(state)
    await runArtDirectorPhase(state)
    await runMockupPhase(state)
    await runEngineerPhase(state)
    await runBuildPhase(state)
    await runGatePhase(state)
    // Awaited before the return: the finally (saveTrace) must not run while
    // the archive is still being written, or archiveRan is still false and a
    // successful run writes a phantom build-failed-* trace dir (observed
    // 2026-07-10).
    await runArchivePhase(state)
    return state.result
  } catch (err) {
    swarmError = err
    await rollBackCheckout(state)
    throw err
  } finally {
    await saveTrace(state, swarmError)
  }
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

if (isMain(import.meta.url)) {
  ;(async () => {
    console.log('\n=== Designer Agent Swarm ===\n')

    // The nightly (daily-redesign.js) passes readContext() straight in; the
    // Art Director writes today's brief itself. This entry used to refuse to
    // start without signals/today.brief.md, which nothing else produced, so
    // it could not run on a clean checkout.
    const context = await readContext()

    try {
      const result = await runAgentSwarm(context)
      console.log(`\nDone. ${result.files.length} files written.`)
      console.log(`Brief: ${result.design_brief}`)
    } catch (err) {
      console.error(`\nFatal: ${err.message}`)
      process.exit(1)
    }
  })()
}
