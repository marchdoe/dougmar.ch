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
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env'), quiet: true })

import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { readContext } from './utils/site-context.js'
import { ROOT } from './utils/file-manager.js'
import { formatGeneratedFile } from './utils/build-validator.js'
import { archive } from './utils/archiver.js'
import { resetLedger } from './utils/cost-ledger.js'
import { startTape } from './utils/call-tape.js'
import { buildGoogleFontsUrl, renderRootTemplate } from './utils/chassis.js'
import { parseDelimiterResponse } from './utils/delimiter-parser.js'
import { runDate } from './utils/run-date.js'
import { isMain } from './utils/cli.js'
import { surfaceGateRecord } from './utils/gate-outcome.js'
import { loadRunContext } from './pipeline/context.js'
import { runArtDirectorPhase } from './pipeline/phase-art-director.js'
import { runMockupPhase } from './pipeline/phase-mockup.js'
import { runEngineerPhase } from './pipeline/phase-engineer.js'
import { runBuildPhase } from './pipeline/phase-build.js'
import { runGatePhase } from './pipeline/phase-gate.js'
import { createRunState, rollBackCheckout, saveTrace } from './pipeline/run-state.js'
import { countArchivedDesigns } from './utils/archive-count.js'
import { archiveLinkInks } from './utils/archive-link-ink.js'
import { newBoundaryId } from './utils/data-boundary.js'
export { parseDelimiterResponse }
export { resolveRiskWeight } from './pipeline/run-state.js'
export { describeRiskTier } from './pipeline/phase-art-director.js'
export { buildCompositionContractBlock } from './pipeline/phase-mockup.js'
export {
  dropOrchestratorFiles,
  dropUnwritableFiles,
  FILE_OWNERSHIP,
} from './pipeline/engineer-tools.js'
export { identifyFailingAgent, planRepairs } from './pipeline/phase-build.js'
export { EXTRA_REVISION_ROUND_CAP, MAX_REVISION_ROUNDS } from './pipeline/revision-rounds.js'

/**
 * Capture the runtime-generated /og card to public/og/<date>.png so it
 * serves at the og:image URL injected into __root.tsx. Best-effort: a
 * missing og.tsx or a capture failure must never block shipping.
 * @param {string} date YYYY-MM-DD
 * @param {{ root?: string, writtenPaths?: Set<string> }} [options] repo root
 *   to write under; `writtenPaths` receives the card's path when it is new
 */
async function captureOgCard(date, { root = ROOT, writtenPaths } = {}) {
  try {
    const { captureRouteScreenshot } = await import('./utils/snapshot.js')
    const ogBuffer = await captureRouteScreenshot('/og')
    const ogDir = path.join(root, 'public', 'og')
    await mkdir(ogDir, { recursive: true })
    const cardPath = path.join(ogDir, `${date}.png`)
    // A card this run creates is a new file in the checkout: record it so a
    // rollback after a later throw (archive() itself) removes it again.
    if (!existsSync(cardPath)) writtenPaths?.add(`public/og/${date}.png`)
    await writeFile(cardPath, ogBuffer)
    console.log(`  [og] captured public/og/${date}.png (${(ogBuffer.length / 1024).toFixed(0)}KB)`)
  } catch (err) {
    console.warn(`  [og] capture failed (non-blocking): ${err.message}`)
  }
}

/**
 * Write the day's archetype beside its record. Descriptive only: never
 * validated or enforced. The load-bearing structural record is
 * composition.json.
 * @param {string} date YYYY-MM-DD
 * @param {string|null|undefined} archetype
 * @param {{ root?: string }} [options] repo root to write under
 */
async function writeArchetype(date, archetype, { root = ROOT } = {}) {
  if (!archetype) return
  try {
    const datePath = path.join(root, 'archive', date)
    await mkdir(datePath, { recursive: true })
    await writeFile(path.join(datePath, 'archetype.txt'), archetype, 'utf8')
    console.log(`  [archetype] saved: ${archetype}`)
  } catch {}
}

/**
 * The per-build artifacts archive() writes beside the record, keyed by file
 * name. A null value means "write nothing", which the readers distinguish
 * from an empty file.
 *
 * Pulled out of archiveAndReturn so the assembly is a pure function with a
 * test, rather than nine defaults inside a closure nothing can reach.
 *
 * @param {object} run
 * @param {{png?: Buffer, darkPng?: Buffer, mobileJpeg?: Buffer, fingerprint?: object}|null} run.finalScreenshot
 * @param {{mockupHtml?: string}|null} run.mockup
 * @param {{png?: Buffer, mobileJpeg?: Buffer}|null} run.mockupScreenshot
 * @param {Array<object>} run.verdicts
 * @param {object} run.shellDecl
 * @param {object} run.headerDecl
 * @param {object} run.typeDecl
 * @param {object} run.mobileDecl
 * @param {string|null|undefined} run.heroSource
 * @param {object} run.chosenComposition
 * @param {{id: string, register: string}} run.chosenLane
 * @param {{canvas_utilization_min: number|null, hero_scale: string|null, color_coverage_min: number|null}|null|undefined} run.measurablesDecl
 *   the Art Director's parsed MEASURABLES block (#456) — persisted as the
 *   `declared` half of measurables.json; the `measured` half is added later
 *   by archiver.js once the responsive-scoring browser pass runs.
 * @param {Array<{round: number, measured: {canvas_utilization: number, color_coverage: number, hero_px: number}, measuredAt: string}>|null|undefined} run.mockupMeasurableRounds
 *   the design-fidelity numbers measured on the mockup itself, one entry per
 *   revision round the critic saw (#487) — the mockup-side counterpart to
 *   `measurablesDecl`/measurables.json, which only ever measured the built
 *   page.
 * @param {Array<{round: number, findings: Array<object>, briefed: Array<string>}>|null|undefined} run.mockupFidelityRounds
 *   where each surface-gate round's `/` drifted from the approved mockup, and
 *   what of it reached the engineer's brief (mockup-advisory.js)
 * @returns {Record<string, Buffer|string|null>}
 */
export function archiveArtifacts(run) {
  const json = (value) => JSON.stringify(value, null, 2)
  // One read for every image the final capture may or may not have taken:
  // null, never an empty file, for a capture that did not happen.
  const captured = (key) => run.finalScreenshot?.[key] ?? null
  return {
    'screenshot.png': captured('png'),
    'screenshot-dark.png': captured('darkPng'),
    // The phone filmstrip that traveled to the critics, archived beside the
    // captures it was judged with (#466) — until now it never reached disk.
    'screenshot-mobile.jpg': captured('mobileJpeg'),
    'mockup.html': run.mockup?.mockupHtml ?? null,
    'mockup-screenshot.png': run.mockupScreenshot?.png ?? null,
    'mockup-screenshot-mobile.jpg': run.mockupScreenshot?.mobileJpeg ?? null,
    'verdicts.json': json(run.verdicts),
    // Whether the surface gate measured at all (#565); a run whose gate threw
    // is otherwise indistinguishable from one that found nothing.
    'surface-gate.json': json(surfaceGateRecord(run.verdicts)),
    'shell.json': json(run.shellDecl),
    'header.json': json(run.headerDecl),
    // How the type is set (#502), beside the header it shares a page with.
    'type-treatment.json': json(run.typeDecl),
    // What the composition becomes at 360 (#452), beside the tuple whose
    // `collapse` axis it explains.
    'mobile.json': json(run.mobileDecl),
    // How the hero arrives (#506), and the four frames the critic judged it
    // on. The strip is null on a night that declared no first-paint motion.
    'motion.json': json(run.motionDecl),
    'motion-strip.jpg': captured('motionStripJpeg'),
    'hero-source.json': json({ source: run.heroSource || null }),
    'composition.json': json(run.chosenComposition),
    // The rendered silhouette (#255). Null when the capture failed, and
    // written as nothing rather than as an empty object so the uniqueness
    // index reads "no fingerprint" instead of "an empty page".
    'fingerprint.json': run.finalScreenshot?.fingerprint
      ? json(run.finalScreenshot.fingerprint)
      : null,
    'lane.json': json({ laneId: run.chosenLane.id, register: run.chosenLane.register }),
    // The declared MEASURABLES floors (#456), persisted for the first time —
    // previously parsed, logged, and discarded. `measured` is absent here on
    // purpose: archiver.js merges it into this same file once the responsive
    // scorer's browser pass produces it, after this artifact is on disk.
    'measurables.json': run.measurablesDecl
      ? json({ declared: run.measurablesDecl, declaredAt: new Date().toISOString() })
      : null,
    // The mockup-side measured numbers (#487), one entry per revision round —
    // the mockup-versus-build gap this file makes visible is a per-night
    // reading of measurables.json (the built page) beside this one (the
    // mockup the critic actually approved).
    'mockup-measurables.json': run.mockupMeasurableRounds?.length
      ? json({ rounds: run.mockupMeasurableRounds, declared: run.measurablesDecl ?? null })
      : null,
    // The build's `/` against the approved mockup's text, per gate round.
    // Nothing when no round had a mockup to compare against.
    'mockup-fidelity.json': run.mockupFidelityRounds?.length
      ? json({ rounds: run.mockupFidelityRounds })
      : null,
  }
}

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
  const { weights, writtenPaths, verdicts } = state

  let swarmError = null
  try {
    await loadRunContext(state)
    await runArtDirectorPhase(state)

    const {
      result: artDirectorResult,
      chosenArchetype,
      chosenChassis,
      shellDecl,
      headerDecl,
      typeDecl,
      mobileDecl,
      motionDecl,
      measurablesDecl,
      chosenComposition,
      tokenResult,
    } = state.ad

    await runMockupPhase(state)
    const { chosenLane, mockup, mockupScreenshot } = state.design

    await runEngineerPhase(state)

    // Shared success epilogue for the first-pass and Phase-5 retry paths:
    // archive artifacts, persist the archetype, shape the return value.
    // Behavior is identical between callers apart from the rationale suffix.
    async function archiveAndReturn(filesResult, rationaleSuffix = '') {
      await captureOgCard(today, { root, writtenPaths })

      // __root.tsx was written (and possibly rewritten, on a codegen retry)
      // before the capture above ran, so its og:image named today's PNG on
      // the strength of a capture that hadn't happened yet. Refresh it now
      // that the capture has had its one chance: buildOgMetaEntries checks
      // disk this time, so a failed capture ships default.png instead of a
      // 404 (#399).
      try {
        const { buildOgMetaEntries } = await import('./utils/og-meta.js')
        const finalOgMeta = buildOgMetaEntries({
          date: today,
          heroCopy: artDirectorResult.heroCopy,
          designBrief: artDirectorResult.designBrief,
          root,
        })
        const finalRootSrc = renderRootTemplate(
          buildGoogleFontsUrl(chosenChassis),
          finalOgMeta,
          countArchivedDesigns(path.join(root, 'archive')),
          archiveLinkInks(artDirectorResult.presetTs).root.token
        )
        await writeFile(path.join(root, 'app/routes/__root.tsx'), finalRootSrc, 'utf8')
        formatGeneratedFile('app/routes/__root.tsx', { root })
      } catch (err) {
        console.warn(`  __root.tsx og-image fallback check failed (non-blocking): ${err.message}`)
      }

      const allFiles = [...tokenResult.files, ...filesResult.files]
      const changedPaths = allFiles.map((f) => f.path)

      const rationale = tokenResult.rationale || `Agent swarm redesign${rationaleSuffix}`
      const designBrief = tokenResult.design_brief || `Multi-agent redesign${rationaleSuffix}`

      // Written BEFORE archive(), because archive() builds record.json and
      // buildRecord reads this file. Writing it afterwards meant every record
      // logged `record anomaly: missing archetype.txt` and stored
      // legacyArchetype: null while the archetype sat on disk seconds later —
      // an anomaly on every single run, which trains you to ignore the one
      // list that would report a real one.
      //
      // Descriptive only: never validated or enforced. The load-bearing
      // structural record is composition.json.
      await writeArchetype(today, chosenArchetype, { root })

      // `today` is runDate(signals). The five raw reads of the signals' date
      // field this replaces behaved differently on a missing date: path.join
      // threw (caught, trace lost) while archive() stringified it and created
      // archive/undefined/ (#302).
      await archive(
        today,
        signals,
        rationale,
        designBrief,
        changedPaths,
        // The weights this run actually used. Passing {} here meant archiver.js
        // fell back to `?? 5` for all four and wrote those into build.json, so
        // every archived night claimed the defaults — including the risk value
        // derived from the build date, which is the whole point of the dial.
        // Any later "did risk 9 produce better designs" reading was fiction.
        weights,
        tokenResult.color_scheme ?? null,
        chosenArchetype ?? null,
        archiveArtifacts({
          finalScreenshot: state.finalScreenshot,
          mockup,
          mockupScreenshot,
          verdicts,
          shellDecl,
          headerDecl,
          typeDecl,
          mobileDecl,
          motionDecl,
          heroSource: artDirectorResult.heroSource,
          chosenComposition,
          chosenLane,
          measurablesDecl,
          mockupMeasurableRounds: state.mockupMeasurableRounds,
          mockupFidelityRounds: state.mockupFidelityRounds,
        }),
        { root }
      )
      state.archiveRan = true

      return { rationale, design_brief: designBrief, files: allFiles }
    }

    await runBuildPhase(state)
    await runGatePhase(state)
    // MUST await: a bare `return promise` inside this try/finally lets the
    // finally (saveTrace) run while archiveAndReturn is still archiving —
    // archiveRan is still false, so a successful run writes a phantom
    // build-failed-* trace dir (observed 2026-07-10).
    return await archiveAndReturn(state.engineer.result, state.rationaleSuffix)
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
