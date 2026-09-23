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
import { pastDeadline } from './utils/run-budget.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env'), quiet: true })

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { callClaudeCLI } from './utils/claude-cli.js'
import {
  MUTABLE_FILES,
  ORCHESTRATOR_FILES,
  ENGINEER_FILES,
  readContext,
} from './utils/site-context.js'
import {
  backup,
  writeFiles,
  restore,
  cleanupOrphans,
  isWritablePath,
  ROOT,
} from './utils/file-manager.js'
import { validateBuild, formatGeneratedFile } from './utils/build-validator.js'
import { archive } from './utils/archiver.js'
import { resetLedger, noteRetry } from './utils/cost-ledger.js'
import { startTape } from './utils/call-tape.js'
import { clip, openStep } from './utils/trace-step.js'
import { buildGoogleFontsUrl, renderRootTemplate } from './utils/chassis.js'
import { formatSemanticContractForPrompt } from './utils/semantic-contract.js'
import {
  collectGateRules,
  formatGateRulesForPrompt,
  formatRequiredFilesSection,
} from './utils/gate-rules.js'
import { fillContentGaps } from './utils/content-gaps.js'
import { loadPrompt } from './utils/prompt-loader.js'
import { parseDelimiterResponse } from './utils/delimiter-parser.js'
import { modelFor } from './utils/models.js'
import { budgetFor } from './utils/budgets.js'
import { runDate } from './utils/run-date.js'
import { isMain } from './utils/cli.js'
import { describeGateErrors, recordGateFailure, surfaceGateRecord } from './utils/gate-outcome.js'
import { loadRunContext } from './pipeline/context.js'
import { runArtDirectorPhase } from './pipeline/phase-art-director.js'
import { runMockupPhase } from './pipeline/phase-mockup.js'
import {
  archiveFailedSources,
  createRunState,
  rollBackCheckout,
  saveTrace,
} from './pipeline/run-state.js'
import { formatMaterialContractBlock, materialSeed } from './utils/material.js'
import { formatHeader } from './utils/header-grammar.js'
import { formatTypeTreatment } from './utils/type-grammar.js'
import { formatMobile } from './utils/mobile-grammar.js'
import { formatMotion, wantsMotionReference } from './utils/motion-grammar.js'
import { NARROW_VIEWPORT, WIDE_VIEWPORT } from '../elements/chassis/viewports.js'
import { formatTuple } from './utils/composition-grammar.js'
import { findEngineerOutputProblem } from './utils/engineer-output-check.js'
import { patchOutputProblem } from './utils/engineer-output-patch.js'
import {
  readOwnedFiles,
  loadRepairBriefTemplate,
  renderRepairBrief,
  mergeEngineerPatch,
  deleteFiles,
} from './utils/engineer-patch.js'
import { sweepGenerated } from './utils/generated-sweep.js'
import { countArchivedDesigns } from './utils/archive-count.js'
import { archiveLinkInks } from './utils/archive-link-ink.js'
import { mockupDriftRecord } from './utils/mockup-advisory.js'
import { blockingFaults, driftedVerdict } from './utils/mockup-drift-gate.js'
import { newBoundaryId } from './utils/data-boundary.js'
export { parseDelimiterResponse }
export { resolveRiskWeight } from './pipeline/run-state.js'
export { describeRiskTier } from './pipeline/phase-art-director.js'
export { buildCompositionContractBlock } from './pipeline/phase-mockup.js'

/**
 * Drop any orchestrator-owned file from an agent's output.
 *
 * react-engineer.md has told the engineer not to emit `__root.tsx`,
 * `preset.ts` or `chassis-preset.ts` for months, and nothing enforced it —
 * a stray block would simply overwrite the generated file after the
 * orchestrator wrote it. `app/components/BrandLockup.tsx` joined that list
 * with #254, and it is the one that matters most: the whole point of the
 * component is that no model authors the mark.
 *
 * @param {Array<{path: string, content: string}>} files
 * @param {string} agentName for the log line
 * @returns {Array<{path: string, content: string}>}
 */
export function dropOrchestratorFiles(files, agentName = 'agent') {
  const kept = []
  for (const file of files ?? []) {
    if (ORCHESTRATOR_FILES.includes(file.path)) {
      console.warn(
        `  ⚠ ${agentName} emitted ${file.path}, which the orchestrator owns — discarding that block`
      )
      continue
    }
    kept.push(file)
  }
  return kept
}

/**
 * Discard files the write allowlist would refuse.
 *
 * `findEngineerOutputProblem` asks the engineer to move these itself, which is
 * the outcome worth having because it fixes the imports too. This is the floor
 * under that: the retry is allowed to fail, and on 2026-09-20 the alternative
 * to a floor was `validateWritePath` throwing out of `applyEngineerPatch`,
 * past `runAgentSwarm`, and ending a run 31 minutes in over one misplaced
 * component. A dropped file whose import survives fails the build gate, which
 * is a repair round. A throw is the whole night.
 *
 * @param {Array<{path: string, content: string}>} files
 * @param {string} agentName for the log line
 * @returns {Array<{path: string, content: string}>}
 */
export function dropUnwritableFiles(files, agentName = 'agent') {
  const kept = []
  for (const file of files ?? []) {
    if (!isWritablePath(file.path)) {
      console.warn(
        `  ⚠ ${agentName} emitted ${file.path}, which is not a path it may write — discarding that block`
      )
      continue
    }
    kept.push(file)
  }
  return kept
}

/**
 * How a full engineer generation reaches disk.
 *
 * Three call sites used to write engineer output: the primary Phase 2c pass,
 * the post-critic revision, and the Phase 5 repair. The drop above was applied
 * at the first, added to the third after a repair overwrote __root.tsx, and
 * never reached the second (#296) — so a revision answering "the header is
 * wrong" could overwrite BrandLockup.tsx after the orchestrator wrote it, and
 * nothing logged it. The revision and the repair are patches now (#432) and
 * go through `applyEngineerPatch` inside the swarm, which applies the same
 * drop before it merges; this stays the one path for a whole generation.
 *
 * Mutates `result.files` so the archive records what was actually written.
 *
 * @param {{ files: Array<{path: string, content: string}> }} result
 * @param {string} agentLabel for the log line
 * @param {{ root?: string }} [options] repo root to write under
 * @returns {Promise<string[]>} the paths written
 */
async function writeEngineerFiles(result, agentLabel, { root = ROOT, backup } = {}) {
  result.files = dropUnwritableFiles(dropOrchestratorFiles(result.files, agentLabel), agentLabel)
  return await writeFiles(result.files, { root, backup })
}

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
function findingsOf(gate) {
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
 *   module scope: `runAgentSwarm` loads `surface-gate.js` dynamically.
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
 * Round-1 judgment, or a verdict with no vote when the critic could not be
 * reached at all.
 *
 * On 2026-09-21 the API account ran out of credits between the engineer and
 * the critic: the SDK call and the CLI fallback both failed, the throw landed
 * in the gate's outer catch, and the run shipped 44 measured faults the
 * surface gate had already said required a revision (#619). Recording the
 * failure as UNVERIFIED keeps the gate-driven revision on the same path a
 * truncated or text-only reply takes (#570). A fatal error still propagates.
 *
 * @param {(gate: object) => Promise<object>} judge
 * @param {object} gate the round's surface-gate result
 * @returns {Promise<{ verdict: string, criticResponse: string, visionChannel: string, bar: object|null }>}
 */
async function judgeOrNoVerdict(judge, gate) {
  try {
    return await judge(gate)
  } catch (err) {
    if (err.fatal) throw err
    console.warn(`  [screenshot-critic] Failed (non-blocking): ${err.message}`)
    return {
      verdict: 'UNVERIFIED',
      criticResponse: err.message,
      visionChannel: 'call-failed',
      bar: null,
    }
  }
}

/**
 * Phone filmstrips of `/about` and a case study route for the screenshot
 * critic — the pages the phone gate never covered before #466, when only the
 * home page ever got a mobile image, and only its first 640px at that.
 * Pulled out of `judgeScreenshot` so the shared capture-and-critic path
 * (#467) stays under the complexity budget: each capture is independent and
 * best-effort, one failing costs the critic one image, never the run.
 *
 * @param {{ route: string } | null | undefined} slugRoute - the first case
 *   study route, from `listGeneratedRoutes`, or null when none was found
 * @returns {Promise<Array<{ label: string, jpeg: Buffer }>>}
 */
async function capturePhoneFilmstripsForCritic(slugRoute) {
  try {
    const { captureRoutePhoneFilmstrip } = await import('./utils/snapshot.js')
    const filmstripRoutes = [
      { label: '/about', route: '/about' },
      slugRoute ? { label: slugRoute.route, route: slugRoute.route } : null,
    ].filter(Boolean)
    const phoneFilmstrips = []
    for (const r of filmstripRoutes) {
      const jpeg = await captureRoutePhoneFilmstrip(r.route)
      if (jpeg) {
        phoneFilmstrips.push({
          label:
            `A phone filmstrip of ${r.label}, light scheme: the whole page at ${NARROW_VIEWPORT.width} wide, ` +
            "cut into 640px folds and laid side by side (the fold labels are ours, not the site's):",
          jpeg,
        })
      }
    }
    console.log(`  [screenshot-critic] +${phoneFilmstrips.length} phone filmstrips`)
    return phoneFilmstrips
  } catch (err) {
    console.warn(
      `  [screenshot-critic] phone filmstrip capture failed (non-blocking): ${err.message}`
    )
    return []
  }
}

/**
 * The first case study route the build lists, or null when there is none or
 * the list cannot be read. It is the one the critic is sent images of.
 *
 * @param {string} root - repo root
 * @returns {Promise<{ route: string } | null>}
 */
async function firstCaseStudyRoute(root) {
  try {
    const { listGeneratedRoutes } = await import('./utils/surface-gate.js')
    return (await listGeneratedRoutes(root)).find((r) => r.route.startsWith('/work/')) ?? null
  } catch (err) {
    console.warn(`  [screenshot-critic] case study lookup failed (non-blocking): ${err.message}`)
    return null
  }
}

/**
 * The whole first case study at 1440, as one filmstrip for the screenshot
 * critic (#569). Best-effort like the phone filmstrips: a capture that fails
 * costs the critic one image, never the run.
 *
 * @param {{ route: string } | null | undefined} slugRoute - from {@link firstCaseStudyRoute}
 * @returns {Promise<Array<{ label: string, jpeg: Buffer }>>}
 */
async function captureDesktopFilmstripsForCritic(slugRoute) {
  if (!slugRoute) return []
  try {
    const { captureRouteDesktopFilmstrip } = await import('./utils/snapshot.js')
    const jpeg = await captureRouteDesktopFilmstrip(slugRoute.route)
    if (!jpeg) return []
    console.log('  [screenshot-critic] +1 desktop filmstrip')
    return [
      {
        label:
          `A desktop filmstrip of ${slugRoute.route}, light scheme: the whole page at ${WIDE_VIEWPORT.width} wide, ` +
          `cut into ${WIDE_VIEWPORT.height}px folds and laid two across, row by row (the fold labels are ours, not the site's). ` +
          'Judge what the page does with the width below the first fold:',
        jpeg,
      },
    ]
  } catch (err) {
    console.warn(
      `  [screenshot-critic] desktop filmstrip capture failed (non-blocking): ${err.message}`
    )
    return []
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
// Constants
// ---------------------------------------------------------------------------

/** Maps every mutable file owned by an LLM agent to that agent name.
 *  Token-designer ownership was removed in the Art Director pipeline —
 *  preset.ts is now written by the Art Director. The Art Director's
 *  files are not retried via this map; retries go through the
 *  React Engineer, so a build error that names only the Art Director's
 *  files ends the run without one (`planRepairs`). The Mockup Designer's
 *  HTML never enters the build.
 */
export const FILE_OWNERSHIP = Object.fromEntries([
  ['elements/preset.ts', 'art-director'],
  ...ENGINEER_FILES.map((f) => [f, 'react-engineer']),
])

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

// ---------------------------------------------------------------------------
// Internal: callAgent
// ---------------------------------------------------------------------------

/**
 * The delimiter-format reminder appended to every call's user prompt. A
 * patch reply sends only the files that changed — "write complete file
 * contents after each delimiter" reads as "regenerate everything" and
 * contradicted the brief's "return ONLY the files that must change" (#447)
 * — so a patch call drops that sentence.
 * @param {boolean} patch
 * @returns {string}
 */
function formatFileDelimiterReminder(patch) {
  return patch
    ? `\n\n---\n\nIMPORTANT: Use the ===FILE:path=== delimiter format described in your instructions. No JSON, no markdown code fences, no explanation — just the delimiters and raw file content.`
    : `\n\n---\n\nIMPORTANT: Use the ===FILE:path=== delimiter format described in your instructions. Write complete file contents after each delimiter. No JSON, no markdown code fences, no explanation — just the delimiters and raw file content.`
}

/**
 * Throws when `raw` is missing `placeholder`. A tiny standalone check so a
 * new one (like {{REQUIRED_FILES}}, #447) doesn't add another inline branch
 * to runAgentSwarm's already-overridden complexity budget.
 * @param {string} raw
 * @param {string} placeholder
 * @param {string} promptName for the error message
 */
function assertPromptPlaceholder(raw, placeholder, promptName) {
  if (!raw.includes(placeholder)) {
    throw new Error(`${promptName} is missing its ${placeholder} placeholder`)
  }
}

/**
 * Spawn a `claude` CLI process for one agent.
 *
 * The build error used to be appended here, after the agent's whole original
 * task, and the reply was a regeneration of everything (#432). A repair or
 * revision now sends a repair brief as `userPrompt` instead, with
 * `options.patch` set so an empty `===FILE:path===` block survives parsing
 * as the instruction to delete that file.
 *
 * @param {string} agentName
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {{ timeoutMs?: number, stallTimeoutMs?: number, model?: string, patch?: boolean, purpose?: string, effort?: string }} [options]
 * @returns {Promise<{ files: Array<{path: string, content: string}>, rationale?: string, design_brief?: string }>}
 */
async function callAgent(agentName, systemPrompt, userPrompt, options = {}) {
  let fullPrompt = userPrompt

  fullPrompt += formatFileDelimiterReminder(options.patch === true)

  // Explicit IDs only — the 'sonnet' alias this used to fall back to is what
  // models.js exists to prevent (a pinned CLI freezes what the alias means).
  if (!options.model) throw new Error(`[${agentName}] callAgent requires an explicit model ID`)
  const budget = budgetFor(agentName)
  const result = await callClaudeCLI(agentName, systemPrompt, fullPrompt, {
    timeoutMs: options.timeoutMs ?? budget.timeoutMs,
    stallTimeoutMs: options.stallTimeoutMs ?? budget.stallTimeoutMs,
    model: options.model,
    purpose: options.purpose,
    effort: options.effort,
  })

  // Two response shapes remain: a critic verdict, or delimited files. The
  // ===VISUAL_SPEC=== branch served the Design Director (retired 2026-04-29)
  // and the three-stage JSON fallback served the Unified Designer (also
  // retired); neither agent exists, so neither shape can arrive.
  let parsed

  if (result.includes('===VERDICT===')) {
    // Critic response (mockup-critic, screenshot-critic) — extract verdict and feedback.
    // _fullResponse keeps the undelimited text: parseCriticVerdict anchors on the
    // ===VERDICT=== block, so it must see the full response, not the stripped body.
    const verdictMatch = result.match(/===VERDICT===([\s\S]*?)===END===/)
    const verdictBody = verdictMatch ? verdictMatch[1].trim() : result.trim()
    parsed = {
      files: [],
      rationale: verdictBody,
      design_brief: '',
      _rawResponse: verdictBody,
      _fullResponse: result,
    }
  } else if (result.match(/^===FILE:/m)) {
    parsed = parseDelimiterResponse(result, { keepEmptyFiles: options.patch === true })
  } else {
    throw new Error(
      `[${agentName}] response is neither a ===VERDICT=== block nor ===FILE:=== delimited\nFirst 300 chars: ${result.slice(0, 300)}`
    )
  }

  // A critic verdict carries no files; that is fine.
  if (!parsed.files) parsed.files = []
  if (!Array.isArray(parsed.files)) {
    throw new Error(
      `[${agentName}] response missing files array. Got keys: ${Object.keys(parsed).join(', ')}`
    )
  }

  console.log(
    `  [${agentName}] responded with ${parsed.files.length} files${parsed._rawResponse ? ' + visual spec' : ''}`
  )

  return parsed
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
  const { weights, trace, writtenPaths, verdicts } = state

  let swarmError = null
  try {
    await loadRunContext(state)
    await runArtDirectorPhase(state)

    const { screenshotCriticPrompt, designSystemReference, brandRegisterDeclaration } =
      state.prompts
    const { references } = state.inputs
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
    const { tokenContext, enrichedBrief, lessonsBlock, chosenLane, mockup, mockupScreenshot } =
      state.design

    // -----------------------------------------------------------------------
    // Phase 2c: React Engineer — translate the approved mockup to TSX
    // -----------------------------------------------------------------------
    console.log('\n[phase-2c] React Engineer')
    const reactEngineerPromptRaw = await loadPrompt('react-engineer.md', { root })
    if (!reactEngineerPromptRaw.includes('{{SEMANTIC_COLOR_CONTRACT}}')) {
      throw new Error('react-engineer.md is missing its {{SEMANTIC_COLOR_CONTRACT}} placeholder')
    }
    // The gate list is generated from the validator's own exported constants
    // at assembly time, so `react-engineer.md` cannot state a host allowlist
    // or a forbidden-pattern list that has drifted from what actually fails
    // the build the way it did for #432.
    if (!reactEngineerPromptRaw.includes('{{GATES}}')) {
      throw new Error('react-engineer.md is missing its {{GATES}} placeholder')
    }
    // The required-files section states one contract for a full generation
    // and the opposite one for a patch (a repair or a revision) — #447 found
    // the two calls sharing the full-generation wording, which told a patch
    // reply to resend every required file while the brief in the same call
    // asked for only what changed.
    assertPromptPlaceholder(reactEngineerPromptRaw, '{{REQUIRED_FILES}}', 'react-engineer.md')
    // Which content fields are empty today, read from app/content (#568), so
    // the engineer does not print a separator beside a field that has no text.
    const semanticColorContractBlock = formatSemanticContractForPrompt()
    const buildReactEngineerPrompt = (patch) =>
      fillContentGaps(
        reactEngineerPromptRaw
          .replace('{{SEMANTIC_COLOR_CONTRACT}}', semanticColorContractBlock)
          .replace('{{REQUIRED_FILES}}', formatRequiredFilesSection({ patch }))
          .replace('{{GATES}}', formatGateRulesForPrompt(collectGateRules({ root, patch }))),
        { root }
      )
    const reactEngineerPrompt = await buildReactEngineerPrompt(false)
    const reactEngineerPatchPrompt = await buildReactEngineerPrompt(true)
    const reactEngineerSystemPrompt = `${reactEngineerPrompt}\n\n${designSystemReference}${brandRegisterDeclaration}`
    // Used for every patch call — a repair or a revision (`patch: true`) —
    // so its required-files wording matches the repair brief's "return only
    // what changed" instead of contradicting it (#447).
    const reactEngineerPatchSystemPrompt = `${reactEngineerPatchPrompt}\n\n${designSystemReference}${brandRegisterDeclaration}`

    // The motion-design reference (#506) rides in the engineer's user prompt
    // on a night with an entrance or a scroll reveal to time. The engineer
    // prompt has no size cap (only the mockup designer's is budgeted, see
    // utils/mockup-designer-prompt.js), so the whole reference goes in.
    const refMotion = wantsMotionReference(motionDecl)
      ? await loadPrompt('impeccable/reference/motion-design.md', { root })
      : ''
    const buildEngineerUserPrompt = () =>
      [
        '## Approved Mockup (mockup.html — your fidelity target)\n\n```html\n' +
          mockup.mockupHtml +
          '\n```',
        `## Interior Notes (how About/Work adapt the system)\n\n${mockup.interiorNotes}`,
        `## Design Tokens (elements/preset.ts)\n\n\`\`\`typescript\n${tokenContext}\n\`\`\``,
        `## Hero Copy\n\n${artDirectorResult.heroCopy}`,
        `## Composition\n\n${formatTuple(chosenComposition)}`,
        `## Shell Declaration\n\n${artDirectorResult.shell}`,
        // The declared material as the exact JSX line to place (#505). The
        // seed is the day's, so a re-run draws the same grain.
        formatMaterialContractBlock(shellDecl.ground_material, materialSeed(today)),
        `## Header Declaration (execute these numbers exactly)\n\n${formatHeader(headerDecl)}`,
        `## Type Treatment (execute exactly)\n\n${formatTypeTreatment(typeDecl)}`,
        `## Mobile Declaration (the design at base; the mockup already renders it, keep it)\n\n${formatMobile(mobileDecl)}`,
        `## Motion (execute exactly; see the Motion section of your instructions)\n\n${formatMotion(motionDecl)}`,
        '## One-line Design Brief (for og:description context)\n\n' +
          (artDirectorResult.designBrief || ''),
        // The engineer previously received zero historical feedback despite
        // being the agent screenshot-critic failures usually blame — same
        // capped block the mockup designer sees.
        lessonsBlock,
        refMotion &&
          `## Motion Design Reference (timing, easing, stagger, reduced motion)\n\n${refMotion}`,
      ]
        .filter(Boolean)
        .join('\n\n---\n\n')

    // Single source of truth for invoking the React Engineer. The
    // screenshot-critic retry and the Phase 5 retry both reference this, so
    // model/timeout choices can't drift out of sync with each other.
    const reactEngineerAgentConfig = {
      prompt: reactEngineerSystemPrompt,
      // Every repair and revision call (`patch: true`) uses this instead —
      // see reactEngineerPatchSystemPrompt above (#447).
      patchPrompt: reactEngineerPatchSystemPrompt,
      user: buildEngineerUserPrompt,
      options: { model: modelFor('react-engineer'), ...budgetFor('react-engineer') },
    }

    const engineerUserPrompt = buildEngineerUserPrompt()

    let engineerResult
    if (pastDeadline()) {
      throw new Error(
        'run budget exhausted before the React Engineer could start — nothing to ship'
      )
    }
    const t0Engineer = Date.now()
    try {
      engineerResult = await callAgent(
        'react-engineer',
        reactEngineerSystemPrompt,
        engineerUserPrompt,
        { ...reactEngineerAgentConfig.options, purpose: 'first' }
      )
    } catch (err) {
      // A 0KB stall is usually transient (a throttled account, a flaky CLI
      // turn) rather than a bad prompt — it shouldn't throw away the whole
      // run (AD + 3 mockup rounds) when one more attempt often succeeds.
      // Retry ONCE on a stall, unless we're already past the run deadline.
      const isStall = /stalled|0KB|no output/i.test(err.message)
      if (isStall && !err.transport && !pastDeadline()) {
        console.warn(`  React Engineer stalled (${err.message}) — retrying once`)
        noteRetry()
        try {
          engineerResult = await callAgent(
            'react-engineer',
            reactEngineerSystemPrompt,
            engineerUserPrompt,
            { ...reactEngineerAgentConfig.options, purpose: 'retry' }
          )
        } catch (retryErr) {
          console.error(`  React Engineer failed after stall retry: ${retryErr.message}`)
          throw new Error(`React Engineer failed after stall retry: ${retryErr.message}`)
        }
      } else {
        console.error(`  React Engineer failed: ${err.message}`)
        throw new Error(`React Engineer failed: ${err.message}`)
      }
    }

    // The response must be complete (every required file) and respect the
    // declared shell posture. Judged as it arrived, before the write drops
    // anything: the write discards a path the engineer may not write, and
    // that is the problem to report. It is fixed below, once the reply is on
    // disk, by a patch (#577).
    const arrivedProblem = findEngineerOutputProblem(
      engineerResult.files,
      chosenComposition.shell_posture
    )

    // The on-disk state that last passed a build, once there is one. The sweep
    // records what it removes here as well as in originalBackup, because a
    // failed revision restores this map, not the original.
    let passingSnapshot = null
    // Loaded on the first repair brief, which the output patch below can be.
    let repairBriefTemplate = null

    /**
     * The decision between the gate and the archive. Until 2026-09-21 there
     * was none: `runScreenshotCriticGate` returned nothing and `archive()`
     * ran unconditionally, so a build the gate had measured and condemned
     * shipped on nine different paths (#625) — after the one revision left
     * faults, after a revision broke the build and the round-1 build was put
     * back, after the patch was refused, after the deadline. The workflow's
     * e2e gate then failed the night on the same faults, with every call
     * already paid for.
     *
     * A build with engineer-owned errors still on it does not ship. The
     * sources go to build-failed-sources-* and the run fails the way a build
     * failure does, so the failure issue carries the faults and the handoff
     * a resume can start from (#578). A run that could not measure at all
     * still ships: that is a tooling failure, and the e2e gate is its
     * backstop.
     *
     * @param {{ remainingFaults: Array<object>, measured: boolean, rounds: number }} decision
     */
    async function refuseKnownFaults(decision) {
      const { measured, rounds } = decision
      // Drift from the mockup forced its revisions and ships whatever is left
      // of it, recorded for the rating issue (mockup-drift-gate.js).
      const drifted = measured ? driftedVerdict(decision.remainingFaults) : null
      if (drifted) {
        console.warn(
          `  [ship-gate] the build still drifts from the mockup after ${rounds} revision round(s) — shipping, recorded as ${drifted.verdict}`
        )
        verdicts.push(drifted)
      }
      const remainingFaults = blockingFaults(decision.remainingFaults)
      if (!measured) {
        console.warn(
          `  [ship-gate] the last round measured nothing — shipping unmeasured, ${remainingFaults.length} fault(s) known from the round before`
        )
        return
      }
      if (remainingFaults.length === 0) return
      const { formatFindingsForCritic } = await import('./utils/surface-gate.js')
      // Loosened on 2026-09-21 after six paid runs ended without a night
      // (#633): the rounds run, and what they leave ships with the record
      // saying so, until the first pass measures few enough errors for the
      // loop to clear (#634). Unset, the gate refuses as #626 intended.
      if (process.env.SHIP_GATE === 'lenient') {
        console.warn(
          `  [ship-gate] ${remainingFaults.length} engineer-owned fault(s) remain after ${rounds} revision round(s) — SHIP_GATE=lenient, shipping with the faults logged (#633)`
        )
        verdicts.push({
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
     * Snapshot the exact on-disk passing state: every mutable file plus any
     * extra path the agents wrote.
     * @returns {Promise<Map<string, string|null>>}
     */
    async function snapshotPassingState() {
      passingSnapshot = await backup([...new Set([...MUTABLE_FILES, ...writtenPaths])], { root })
      return passingSnapshot
    }

    /**
     * Delete every file under app/components/generated/ that nothing on disk
     * imports, each recorded into the run's backup first so a rollback puts
     * it back (#448). Runs after every engineer write and before the build,
     * so a component from a previous night that today's files dropped never
     * reaches tsc or fallow. The required files live outside the directory
     * and are never candidates.
     * @param {3|5} phase
     * @param {string} after the write this sweep follows, for the trace
     */
    async function sweepAndTrace(phase, after) {
      const t0Sweep = Date.now()
      // Both maps a rollback may restore from. Once a build has passed, a
      // revision that fails to rebuild puts the passing snapshot back, and a
      // file swept out of that state has to be in it.
      const { kept, removed } = await sweepGenerated({
        root,
        backup: [state.originalBackup, passingSnapshot],
      })
      console.log(
        `  [generated-sweep] kept ${kept.length}, removed ${removed.length}${
          removed.length ? `: ${removed.join(', ')}` : ''
        }`
      )
      trace.addStep({
        name: 'generated-sweep',
        phase,
        input: { after },
        output: { kept, removed },
        durationMs: Date.now() - t0Sweep,
      })
    }

    // Write all files. Orchestrator-owned paths are dropped first — the
    // engineer is told not to emit them and nothing used to check.
    for (const p of await writeEngineerFiles(engineerResult, 'React Engineer', {
      root,
      backup: state.originalBackup,
    }))
      writtenPaths.add(p)

    // A problem with what arrived is a repair brief and a patch reply, merged
    // over the files just written (#577); only a reply that left nothing of the
    // engineer's on disk is asked for again in full. `engineerResult` keeps
    // its rationale and takes the merged files, so the archive records what
    // shipped.
    const { reply: outputPatch } = await patchOutputProblem({
      problem: arrivedProblem,
      taskPrompt: engineerUserPrompt,
      buildBrief: buildRepairBrief,
      askEngineer: (prompt) =>
        callAgent('react-engineer', reactEngineerAgentConfig.patchPrompt, prompt, {
          ...reactEngineerAgentConfig.options,
          patch: true,
          purpose: 'output-patch',
        }),
      applyPatch: (owned, reply) =>
        applyEngineerPatch(owned, reply, 'React Engineer output patch', 3),
      pastDeadline,
      noteRetry,
      trace,
    })
    if (outputPatch) engineerResult = { ...engineerResult, files: outputPatch.files }

    trace.addStep({
      name: 'react-engineer',
      phase: 3,
      input: {
        tokenContext: tokenContext.length,
        briefLength: enrichedBrief.length,
        mockupLength: mockup.mockupHtml.length,
      },
      output: {
        files: engineerResult.files.map((f) => f.path),
        rationale: (engineerResult.rationale || '').slice(0, 500),
      },
      durationMs: Date.now() - t0Engineer,
    })

    // Verify Layout.tsx was written (critical for the site to function)
    const layoutPath = path.join(root, 'app/components/Layout.tsx')
    if (!existsSync(layoutPath)) {
      throw new Error('React Engineer did not produce Layout.tsx — site cannot function without it')
    }

    await sweepAndTrace(3, 'react-engineer')

    // -----------------------------------------------------------------------
    // Phase 4: Build validation
    // -----------------------------------------------------------------------
    console.log('\n[phase-4] Build validation')
    const buildResult = validateBuild({ root, shell: shellDecl, date: today })

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

    // -----------------------------------------------------------------------
    // A repair is a patch (#432, docs/adr/0001-repair-as-a-patch.md). The
    // Phase 5 repair and the post-critic revision both go through these two.
    // -----------------------------------------------------------------------

    /**
     * The user prompt for a repair or revision call: the engineer's files as
     * they stand on disk, the Art Director's preset read-only, and the
     * report verbatim. The system prompt is the engineer's own patch
     * variant (#447): every rule it was given, with the required-files
     * section and gate line stating the patch contract instead of the
     * full-generation one.
     * @param {string} errors a build error, or the critic's feedback plus the
     *   measured faults
     * @returns {Promise<{ owned: Array<{path: string, content: string}>, brief: string }>}
     */
    async function buildRepairBrief(errors) {
      repairBriefTemplate ??= await loadRepairBriefTemplate({ root })
      const owned = await readOwnedFiles(writtenPaths, FILE_OWNERSHIP, { root })
      return {
        owned,
        brief: renderRepairBrief(repairBriefTemplate, { owned, errors, preset: tokenContext }),
      }
    }

    /**
     * Merge a patch reply over the owned files and apply it.
     *
     * The required-file and shell-posture check runs on the MERGED set: a
     * reply that changes one file omits every other required file by design,
     * so the reply alone can never pass it. When the merged set fails, nothing
     * is written and the problem comes back for the caller to spend the
     * attempt on. Otherwise the reply's files are written, its empty blocks
     * delete the owned files they name, and everything else stays as it is.
     *
     * Mutates `reply.files` to the merged set so the archive records what
     * shipped, not the three files the reply happened to carry.
     *
     * @param {Array<{path: string, content: string}>} owned from buildRepairBrief
     * @param {{ files: Array<{path: string, content: string}> }} reply
     * @param {string} label for the log lines
     * @param {3|5} [phase] the phase the sweep after the write is traced under
     * @returns {Promise<{ problem: import('./utils/engineer-output-check.js').OutputProblem|null,
     *   replied: number, written: number, deleted: number }>}
     */
    async function applyEngineerPatch(owned, reply, label, phase = 5) {
      // The error text has named __root.tsx before, which invites the agent to
      // "fix" a file it does not own.
      const files = dropUnwritableFiles(dropOrchestratorFiles(reply.files, label), label)
      const patch = mergeEngineerPatch(owned, files)
      const summary = {
        replied: files.length,
        written: patch.writes.length,
        deleted: patch.deletes.length,
      }
      const problem = findEngineerOutputProblem(patch.files, chosenComposition.shell_posture)
      if (problem) return { problem, ...summary }

      for (const p of patch.ignoredDeletes) {
        console.warn(`  ⚠ ${label} emptied ${p}, which it does not own this run — ignoring`)
      }
      for (const p of await writeFiles(patch.writes, { root, backup: state.originalBackup }))
        writtenPaths.add(p)
      await deleteFiles(patch.deletes, { root, backup: state.originalBackup })
      reply.files = patch.files
      console.log(
        `  ${label}: ${summary.written} written, ${summary.deleted} deleted, ${patch.files.length} on disk`
      )
      // The merged set may have stopped importing a generated file; the
      // build that follows must not see it.
      await sweepAndTrace(phase, label)
      return { problem: null, ...summary }
    }

    // -----------------------------------------------------------------------
    // Screenshot Critic Gate — shared by the first-pass and Phase-5 retry
    // success paths. Mutates the enclosing `engineerResult` and
    // `finalScreenshot` directly. `passingBackup` is the snapshot of the
    // on-disk passing state to restore if a post-critic revision breaks the
    // build (the caller takes it right after its successful build).
    // -----------------------------------------------------------------------
    async function runScreenshotCriticGate(passingBackup) {
      // Deterministic surface gate first. It walks every generated route at
      // three rungs in both schemes and measures whether the document fits the
      // screen — the class of defect that put `/experiments` 657px past a
      // 1440px viewport with its headline and nav off the edge (#215), which
      // the single-page critic could never have seen. Measurements cost no
      // tokens, so this runs in full on every build; its findings are handed
      // to the critic below as text rather than as more image blocks.
      const {
        runSurfaceGate,
        faultsForOwner,
        formatFindingsForCritic,
        formatMeasuredForCritic,
        advisoryFaultsForOwner,
        formatAdvisoryForRepairBrief,
        findingLocation,
        allFindingsFresh,
      } = await import('./utils/surface-gate.js')
      const { runCopyGate } = await import('./utils/copy-gate.js')
      const { readRevisionRequest, describeRevision, logNoRevision, recordFinalJudgment } =
        await import('./agents/screenshot-critic.js')

      /**
       * Measure every route and record what was found. Round 1 runs before
       * the critic; round 2 runs after a revision that rebuilt, so the archive
       * says whether the revision fixed what the gate measured (#306).
       *
       * The copy gate (#504) rides in the same list. Its rendered half runs
       * inside `runSurfaceGate`, off the same page walk; its static half
       * reads the engineer's files here and is merged in, so one list of
       * findings routes to the engineer, the critic and the repair brief.
       * @param {number} round
       * @returns {Promise<{findings: Array<object>, measured: number, errorCount: number}|null>}
       */
      async function measureSurfaces(round) {
        const t0Gate = Date.now()
        try {
          const measured = await runSurfaceGate({
            root,
            mockupLayout: mockupScreenshot?.layout ?? null,
          })
          const copy = await runCopyGate({ root })
          // A new object, not a push into the measured one: the caller's
          // result is its own to keep.
          const findings = [...measured.findings, ...copy.findings]
          const gate = {
            ...measured,
            findings,
            errorCount: findings.filter((f) => f.severity === 'error').length,
          }
          const drift = recordMockupDrift(round, gate.mockupFindings)
          console.log(
            `  [surface-gate] round ${round}: ${gate.measured} measurements, ${copy.scanned} files read for copy, ${describeGateErrors(gate.errorCount, faultsForOwner(gate.findings, 'human').length)} in ${((Date.now() - t0Gate) / 1000).toFixed(1)}s`
          )
          for (const f of gate.findings) {
            console.log(`    [${f.severity}] ${findingLocation(f, { scheme: true })}: ${f.detail}`)
          }
          trace.addStep({
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
          verdicts.push({
            critic: 'surface-gate',
            round,
            verdict: gate.errorCount > 0 ? 'REVISE' : 'SHIP',
            feedback: gate.findings.length
              ? gate.findings.map((f) => `${findingLocation(f)}: ${f.detail}`).join('\n')
              : 'all surfaces fit their viewport',
            ts: Date.now(),
          })
          return gate
        } catch (err) {
          // Non-blocking, exactly like the critic below: a gate that cannot run
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
       * Log one round's mockup comparison and keep it for mockup-fidelity.json.
       * Advisory only: nothing here feeds `errorCount` or a verdict.
       * @param {number} round
       * @param {Array<object>|null|undefined} findings - null when nothing was compared
       * @returns {object|null} the archived record, or null
       */
      function recordMockupDrift(round, findings) {
        if (!findings) return null
        const record = mockupDriftRecord(round, findings)
        state.mockupFidelityRounds.push(record)
        console.log(
          `  [mockup-fidelity] round ${round}: ${findings.length} finding(s), ${record.briefed.length} for the brief`
        )
        for (const line of record.briefed) console.log(`    ${line}`)
        return record
      }

      const firstGate = await measureSurfaces(1)
      const surfaceFindings = firstGate?.findings ?? []

      // The gate decides, not just measures. An error on a surface the
      // engineer owns forces a revision whether or not the critic, who looks
      // at three images, noticed it. Errors on authored routes are reported
      // for a human below and cannot force anything: no agent can edit them.
      const engineerFaults = faultsForOwner(surfaceFindings, 'react-engineer')
      const gateDemandsRevision = engineerFaults.length > 0
      if (gateDemandsRevision) {
        console.warn(
          `  [surface-gate] ${engineerFaults.length} error(s) on engineer-owned surfaces — a revision is required regardless of the critic's verdict`
        )
      }

      // Surfaces the critic can see but no agent can edit. `/work` and
      // `/experiments` are authored route files outside MUTABLE_FILES: the
      // 657px overflow on `/experiments` (#215) lived in a file the React
      // Engineer is never given, so routing that feedback to it produces a
      // confident edit to something it cannot open. This record is written
      // whenever a human-owned surface errors, independent of the critic's
      // verdict and of whether an engineer revision runs below — a hand-
      // written route can break on a night the critic says SHIP, and that
      // must still leave a record (#468).
      const humanFaults = faultsForOwner(surfaceFindings, 'human')
      if (humanFaults.length > 0) {
        const unownableRoutes = [...new Set(humanFaults.map((f) => f.surface))]
        console.warn(
          `  [surface-gate] ${unownableRoutes.join(', ')} — authored route(s), no agent owns these files; needs a human`
        )
        verdicts.push({
          critic: 'surface-gate',
          verdict: 'NEEDS-HUMAN',
          feedback: `Authored routes outside MUTABLE_FILES failed the gate: ${unownableRoutes.join(', ')}\n\n${formatFindingsForCritic(humanFaults)}`,
          ts: Date.now(),
        })
      }

      /**
       * Capture the current build and ask the screenshot critic to judge it.
       * Shared by the first pass and the final re-judge after a repair round
       * (#467): both go through the same capture and payload function, so a
       * change to either (the phone filmstrip, say) reaches both for free.
       * @param {{ findings?: Array<object>, facts?: string }|null} gate - what the surface
       *   gate measured on this build: its findings, and the measurements that are not faults (#569)
       * @param {'first'|'rejudge'} purpose - why the critic is asked, for the ledger
       * @returns {Promise<{verdict: string, criticResponse: string, visionChannel: string, bar: object|null}>}
       *   `verdict` is 'UNVERIFIED' unless the critic saw the build (#570).
       */
      async function judgeScreenshot(gate, purpose) {
        console.log('\n[screenshot-critic] Capturing screenshot...')
        const { captureScreenshot } = await import('./utils/snapshot.js')
        const screenshotBuffer = await captureScreenshot(undefined, {
          headerCrop: { placement: headerDecl.placement, heightPx: headerDecl.height_px },
          motion: motionDecl,
        })
        state.finalScreenshot = screenshotBuffer
        console.log(
          `  screenshot captured (png ${(screenshotBuffer.png.length / 1024).toFixed(0)}KB, jpeg ${(screenshotBuffer.jpeg.length / 1024).toFixed(0)}KB)`
        )

        console.log('[screenshot-critic] Evaluating design...')
        // Real image blocks via the SDK when an API key is present. Inlining
        // these JPEGs as base64 data-URIs in a CLI text prompt billed ~300k
        // tokens per image and the model never saw the pixels (a solid-red
        // probe read back as "light gray"). Three image blocks are ~5k tokens.
        const { buildScreenshotCriticBlocks, runScreenshotCritic } = await import(
          './agents/screenshot-critic.js'
        )
        const { findBestRatedReference } = await import('./utils/ratings.js')

        // Self-eval calibration: attach the owner's highest-rated past own
        // build alongside today's render, when one has been auto-promoted
        // into references/ (collect-ratings.js, grade A/B). Best-effort —
        // a missing/unreadable reference just means no calibration question.
        let bestReference = null
        try {
          const found = findBestRatedReference(path.join(root, 'references'))
          if (found) {
            bestReference = { buffer: await readFile(found.path), description: found.description }
            console.log(
              `  [screenshot-critic] calibrating against ${found.file} (grade ${found.grade})`
            )
          }
        } catch (err) {
          console.warn(
            `  [screenshot-critic] best-rated reference lookup failed (non-blocking): ${err.message}`
          )
        }

        // The first case study, seen whole: at the phone (#466) and at 1440
        // (#569). /work/<slug> is rewritten nightly and shipped its prev/next
        // navigation rendered twice, in two different type treatments, at every
        // viewport (#215); the geometry across every route is covered above by
        // measurement, and what measurement cannot see is a 568px column of
        // copy with the rest of the row empty. The 1440 still of the page's
        // first screen that used to go here is the first tile of the desktop
        // filmstrip now. Both are extracted so this shared capture-and-critic
        // path (#467) stays under the complexity budget.
        const slugRoute = await firstCaseStudyRoute(root)
        const phoneFilmstrips = await capturePhoneFilmstripsForCritic(slugRoute)
        const desktopFilmstrips = await captureDesktopFilmstripsForCritic(slugRoute)

        const criticBlocks = buildScreenshotCriticBlocks({
          // enrichedBrief carries hero copy, rationale, and the full visual
          // spec. The nightly context has no `brief` key, so the old
          // `${brief}` here rendered the literal string "undefined".
          enrichedBrief,
          // The SHELL text, so the critic can read the declared
          // ground_material against the hero field (#505).
          shell: artDirectorResult.shell,
          header: formatHeader(headerDecl),
          typeTreatment: formatTypeTreatment(typeDecl),
          mobile: formatMobile(mobileDecl),
          collapse: chosenComposition.collapse,
          motion: formatMotion(motionDecl),
          references,
          boundaryId,
          mockupScreenshot,
          screenshotBuffer,
          bestReference,
          phoneFilmstrips,
          desktopFilmstrips,
          measuredFaults: formatMeasuredForCritic(gate),
          purpose,
        })

        return await runScreenshotCritic({
          systemPrompt: screenshotCriticPrompt,
          contentBlocks: criticBlocks,
          wantsBar: Boolean(bestReference),
          purpose,
        })
      }

      /**
       * The repair brief's report: the critic's words (if any), then the
       * measured errors on engineer-owned surfaces, then the warnings that
       * ride along for free: tap targets (#488) and where the build drifts
       * from the approved mockup.
       * @param {{ findings: Array<object>, mockupFindings?: Array<object>|null }|null} gate
       *   a gate round, or null when it did not measure
       * @param {string} [criticFeedback]
       * @param {{ previous?: Array<object>|null }} [opts] the round before, so a fault
       *   still there is marked as such in the brief
       * @returns {string}
       */
      function feedbackFor(gate, criticFeedback = '', { previous = null } = {}) {
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
       * One engineer revision: brief, patch, build, re-measure. Leaves the
       * passing state on disk on every path but `rebuilt` (#432), and says
       * which path it took so the round loop can decide what to do next.
       *
       * @param {{ agent: string, feedback: string, round: number, verdict: string, cap?: number }} args
       *   `cap` is the round count this attempt is logged against — MAX_REVISION_ROUNDS
       *   unless #635's extra round has already been granted
       * @returns {Promise<{ outcome: string, regate?: object|null, error?: string }>}
       */
      async function attemptRevision({
        agent,
        feedback,
        round,
        verdict,
        cap = MAX_REVISION_ROUNDS,
      }) {
        const config = reactEngineerAgentConfig
        // The revision is a stage with its own row in the trace (#578): what
        // asked for it, and how it ended.
        const traceRevision = openStep(trace, {
          name: 'revision',
          phase: 4,
          input: {
            round,
            verdict,
            responsibleAgent: agent,
            gateForced: gateDemandsRevision,
            engineerFaults: engineerFaults.length,
            feedback: feedback.slice(0, 500),
          },
        })
        console.log(`  revision ${round}/${cap}: retrying ${agent} with the report...`)
        noteRetry()
        // The retry result replaces engineerResult so the archive records
        // what's actually on disk; keep the passing result to fall back to.
        const passingEngineerResult = engineerResult
        try {
          // A revision is a patch too (#432): the brief lists the files
          // that passed, the feedback is the error report, and the reply
          // is merged over the passing state rather than replacing it.
          const { owned, brief } = await buildRepairBrief(
            `The build passed. The screenshot critic and the surface gate found:\n\n${feedback}`
          )
          const retryResult = await callAgent(agent, config.patchPrompt, brief, {
            ...config.options,
            patch: true,
            purpose: 'revision',
          })
          const applied = await applyEngineerPatch(owned, retryResult, 'React Engineer revision')
          if (applied.problem) {
            // Nothing was written; the passing state is still on disk.
            console.warn(`  ⚠ ${applied.problem.message} — revision not applied`)
            traceRevision({ outcome: 'not-applied', problem: applied.problem.message })
            return { outcome: 'not-applied', error: applied.problem.message }
          }
          engineerResult = retryResult

          const retryBuild = validateBuild({ root, shell: shellDecl, date: today })
          if (!retryBuild.success) {
            console.warn('  post-critic revision broke the build — restoring known-passing state')
            // Restore the snapshot taken right after the first passing
            // build — NOT originalBackup. cleanupOrphans against the same
            // snapshot deletes any paths the failed revision invented
            // beyond it.
            await cleanupOrphans(writtenPaths, passingBackup, { root })
            await restore(passingBackup, { root })
            engineerResult = passingEngineerResult

            // Prove the restored state actually rebuilds — falling
            // through to archive() on faith is how broken hybrids ship.
            const restoredBuild = validateBuild({ root, shell: shellDecl, date: today })
            if (!restoredBuild.success) {
              const fatal = new Error(
                `Restore of passing state failed to rebuild after post-critic revision. Error:\n${restoredBuild.error?.slice(0, 1000)}`
              )
              fatal.fatal = true
              traceRevision({ outcome: 'restore-failed', error: fatal.message })
              throw fatal
            }
            console.log('  known-passing state restored and re-validated')
            traceRevision({
              outcome: 'build-broke-restored',
              replied: applied.replied,
              written: applied.written,
              deleted: applied.deleted,
              error: clip(retryBuild.error, 2000),
            })
            return { outcome: 'build-broke-restored', error: clip(retryBuild.error, 2000) }
          }

          console.log('  post-critic revision build passed')
          traceRevision({
            outcome: 'rebuilt',
            replied: applied.replied,
            written: applied.written,
            deleted: applied.deleted,
            merged: retryResult.files.length,
          })
          return { outcome: 'rebuilt', regate: await measureSurfaces(round + 1) }
        } catch (err) {
          if (err.fatal) throw err
          console.warn(`  ${agent} revision failed (non-blocking): ${err.message}`)
          traceRevision({ outcome: 'failed', error: err.message.slice(0, 2000) })
          // A mid-batch writeFiles abort can leave a partial hybrid on
          // disk — put the known-passing state back before going on.
          await cleanupOrphans(writtenPaths, passingBackup, { root })
          await restore(passingBackup, { root })
          engineerResult = passingEngineerResult
          return { outcome: 'failed', error: err.message }
        }
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
       * @param {{ responsibleAgent: string, feedback: string, verdict: string }} args
       * @returns {Promise<{ remainingFaults: Array<object>, measured: boolean, rounds: number }>}
       */
      async function runRevisionRounds({ responsibleAgent, feedback, verdict }) {
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
        let remaining = engineerFaults
        let lastGate = firstGate
        let measured = firstGate != null
        let rebuilt = false
        let report = feedback
        let rounds = 0
        // Extended to EXTRA_REVISION_ROUND_CAP, once, when the round that hit
        // this cap earns the extra round below.
        let cap = MAX_REVISION_ROUNDS
        for (let round = 1; round <= cap; round++) {
          if (pastDeadline()) {
            console.warn(`  [deadline] run budget exhausted — skipping revision ${round}`)
            openStep(trace, { name: 'revision', phase: 4, input: { round } })({
              outcome: 'skipped-deadline',
            })
            break
          }
          rounds = round
          const attempt = await attemptRevision({ agent, feedback: report, round, verdict, cap })
          if (attempt.outcome !== 'rebuilt') {
            // A critic-only revision (nothing measured wrong on disk) ends
            // here, as it always did: the passing build stands.
            if (remaining.length === 0) break
            report = `${report}\n\nThe previous revision was not kept (${attempt.outcome}): ${clip(attempt.error, 1500)}`
            continue
          }
          rebuilt = true
          passingBackup = await snapshotPassingState()
          const previous = lastGate
          lastGate = attempt.regate
          measured = lastGate != null
          if (!measured) {
            // The gate threw on this round: the faults it would have found
            // are unknown, the ones before it are the best information there
            // is, and the ship decision says so rather than reading silence
            // as a clean pass.
            console.warn(
              `  [surface-gate] round ${round + 1} measured nothing — the last measurement stands`
            )
            break
          }
          remaining = faultsForOwner(lastGate.findings, 'react-engineer')
          if (remaining.length === 0) break

          cap = grantExtraRoundIfEarned(
            round,
            cap,
            remaining,
            findingsOf(previous),
            allFindingsFresh
          )
          console.warn(describeLeftover(round, remaining.length, cap))
          report = feedbackFor(lastGate, '', { previous: findingsOf(previous) })
        }

        if (rebuilt) await rejudgeFinal(lastGate, remaining)
        return { remainingFaults: remaining, measured, rounds }
      }

      /**
       * The final critic pass after the revisions (#467), traced as its own
       * step (#578). Non-blocking: a critic that cannot run must not stop a
       * build that otherwise passed.
       * @param {object|null} gate - the last measurement
       * @param {Array<object>} remainingFaults
       */
      async function rejudgeFinal(gate, remainingFaults) {
        const traceFinal = openStep(trace, {
          name: 'screenshot-critic-final',
          phase: 4,
          input: { remainingFaults: remainingFaults.length },
        })
        try {
          const final = await judgeScreenshot(gate, 'rejudge')
          const finalVerdict = recordFinalJudgment(
            verdicts,
            final,
            formatFindingsForCritic(remainingFaults)
          )
          traceFinal({
            verdict: finalVerdict,
            feedback: final.criticResponse.slice(0, 500),
            channel: final.visionChannel,
          })
        } catch (finalErr) {
          traceFinal({ verdict: 'ERROR', error: finalErr.message.slice(0, 500) })
          console.warn(
            `  [screenshot-critic] final re-judge failed (non-blocking): ${finalErr.message}`
          )
        }
      }

      // What ships, or does not: the engineer-owned errors the last
      // measurement left, and whether anything was measured at all. Every
      // path below leaves this honest, including the ones that put the
      // round-1 build back on disk with its round-1 faults.
      let decision = { remainingFaults: engineerFaults, measured: firstGate != null, rounds: 0 }

      try {
        const t0ScreenshotCritic = Date.now()
        // Only a critic that saw the build gets a vote: judgeScreenshot says
        // UNVERIFIED for a truncated reply or a text-only fallback, and a
        // REVISE from either is not a finding (09-09 paid the engineer to
        // revise against a sentence about token counts, #570). No verdict
        // skips the critic-driven revision and keeps the gate-driven one,
        // as the mockup-critic loop does for a malformed reply.
        // A critic that cannot be reached at all is the same case (#619).
        const {
          verdict: screenshotVerdict,
          criticResponse,
          visionChannel,
          bar,
        } = await judgeOrNoVerdict((gate) => judgeScreenshot(gate, 'first'), firstGate)

        verdicts.push({
          critic: 'screenshot-critic',
          verdict: screenshotVerdict,
          feedback: criticResponse.slice(0, 2000),
          channel: visionChannel,
          ts: Date.now(),
          ...(bar ? { bar } : {}),
        })

        trace.addStep({
          name: 'screenshot-critic',
          phase: 4,
          input: {},
          output: {
            verdict: screenshotVerdict,
            feedback: criticResponse.slice(0, 500),
          },
          durationMs: Date.now() - t0ScreenshotCritic,
        })

        if (screenshotVerdict === 'REVISE' || gateDemandsRevision) {
          const { responsibleAgent, criticFeedback } = readRevisionRequest(
            screenshotVerdict,
            criticResponse
          )
          // The measured faults ride along whether or not the critic mentioned
          // them: they are exact, and they are the reason a SHIP is being
          // revised when the gate forced it. The tap-target warnings ride
          // along too, after the errors (#488): a revision is already
          // opening this file, which is the cheapest point there ever is to
          // also widen a link.
          const feedback = feedbackFor(firstGate, criticFeedback)

          console.log(describeRevision(screenshotVerdict, responsibleAgent, engineerFaults.length))
          console.log(`  feedback: ${feedback.slice(0, 200)}...`)

          decision = await runRevisionRounds({
            responsibleAgent,
            feedback,
            verdict: screenshotVerdict,
          })
        } else {
          logNoRevision(screenshotVerdict, visionChannel)
        }
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

    if (buildResult.success) {
      console.log('\n=== Build passed! ===')

      // Snapshot the exact on-disk passing state (mutable files plus any extra
      // paths the agents wrote). If a post-critic revision breaks the build we
      // restore THIS — originalBackup holds yesterday's files, incompatible
      // with today's preset.ts.
      const passingBackup = await snapshotPassingState()
      await refuseKnownFaults(await runScreenshotCriticGate(passingBackup))
      // MUST await: a bare `return promise` inside this try/finally lets the
      // finally (saveTrace) run while archiveAndReturn is still archiving —
      // archiveRan is still false, so a successful run writes a phantom
      // build-failed-* trace dir (observed 2026-07-10).
      return await archiveAndReturn(engineerResult)
    }

    // -----------------------------------------------------------------------
    // Phase 5: Build failed — identify failing agent and retry
    // -----------------------------------------------------------------------
    console.log('\n[phase-5] Build failed — retrying failing agent(s)')

    const failingAgent = identifyFailingAgent(buildResult.error)
    console.log(`  identified failing agent: ${failingAgent}`)

    // Nothing is restored or reset before the repairs. Phase 3's files ARE
    // the base a repair patches (#432): the engineer is told what is on disk
    // and returns only what must change. The restore of the engineer's files
    // from originalBackup that used to run here would put yesterday's
    // Layout.tsx under today's patched og.tsx, and the slate reset #437 added
    // for full regenerations (drop what the reply omits) would delete the
    // very files a patch leaves alone on purpose, so both are gone. Art
    // Director files were never restored here: a build failure involving
    // preset.ts is handled by the engineer adapting to today's tokens, since
    // codegen is not re-run in Phase 5.

    // Build agent lookup for retry. Per-agent `options` carry the model +
    // timeout overrides so new agents added later don't need re-wiring at the
    // callAgent site. react-engineer shares reactEngineerAgentConfig with the
    // primary Phase 2c invocation so the configs can't drift apart.
    const agentConfig = {
      'react-engineer': reactEngineerAgentConfig,
    }

    // Build failures are almost always in the React Engineer's TSX.
    // The Art Director's preset.ts is validated by codegen earlier in
    // the pipeline, so a build failure on preset.ts at this stage means
    // a downstream typing problem — best handled by React Engineer
    // retry rather than full Art Director re-run (which is more expensive).
    // One attempt was never enough. The engineer averages about one small slip
    // per generation, and while a repair regenerated every file it owned a
    // single attempt reliably traded the error it was given for a different
    // one and the night was lost. Observed three times in one day on 2026-09-01:
    //
    //   CI dry run   width: 'full'  -> repair -> bg: 'surfaceDeep'
    //   local run 3  gap: '10'      -> repair -> Footer.tsx TS2769
    //
    // A repair is a patch now (#432), which shrinks the surface each attempt
    // can break; the bound stays because a patch can still miss. A lost night
    // costs the whole run, so the trade is worth making up to a bound. Attempts stop
    // early when the run budget is spent — a repair that starts after the
    // deadline cannot finish and archive.
    const MAX_REPAIR_ATTEMPTS = 3
    const engineerConfig = agentConfig['react-engineer']
    const repairPlan = planRepairs(failingAgent, buildResult.error, MAX_REPAIR_ATTEMPTS)

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

      console.log(
        `\n  repair attempt ${attempt}/${MAX_REPAIR_ATTEMPTS} — sending react-engineer a repair brief...`
      )
      noteRetry()
      const t0Repair = Date.now()
      // Snapshotted before this attempt can reassign `repairError` below —
      // the trace step for this attempt must record what THIS attempt was
      // given, not what the next one will be.
      const errorGivenToAttempt = repairError
      let retryResult
      let owned
      try {
        const briefed = await buildRepairBrief(repairError)
        owned = briefed.owned
        retryResult = await callAgent('react-engineer', engineerConfig.patchPrompt, briefed.brief, {
          ...engineerConfig.options,
          patch: true,
          purpose: 'repair',
        })
      } catch (err) {
        console.error(`  react-engineer repair failed: ${err.message}`)
        trace.addStep({
          name: 'repair',
          phase: 5,
          input: { attempt, error: errorGivenToAttempt?.slice(0, 2000) },
          output: { files: 0, success: false, error: err.message.slice(0, 2000) },
          durationMs: Date.now() - t0Repair,
        })
        // If the repair agent itself crashed, don't silently continue to
        // validateBuild — bail out with the real error so debugging points
        // at the actual cause (code review #14).
        await archiveFailedSources(state)
        throw new Error(`react-engineer repair crashed: ${err.message}`)
      }

      // The merged set (disk plus the reply) must still hold every required
      // file and respect the posture: a reply that empties Sidebar.tsx, or a
      // nav the posture forbids, would otherwise ship as "repair N" (#297).
      // applyEngineerPatch checks before it writes, so a reply that fails
      // never touches disk; the attempt is spent on the problem, not a build.
      const applied = await applyEngineerPatch(owned, retryResult, 'React Engineer repair')
      if (applied.problem) {
        console.warn(`  ⚠ ${applied.problem.message} — repair attempt ${attempt} not built`)
        repairError = `${applied.problem.message}\n\n${applied.problem.reminder}`
        trace.addStep({
          name: 'repair',
          phase: 5,
          input: { attempt, error: errorGivenToAttempt?.slice(0, 2000) },
          output: {
            files: applied.replied,
            success: false,
            error: repairError.slice(0, 2000),
          },
          durationMs: Date.now() - t0Repair,
        })
        continue
      }

      // The merged set, so the archive records what is on disk after the
      // patch rather than the files the reply happened to carry.
      engineerResult = retryResult

      const attemptBuild = validateBuild({ root, shell: shellDecl, date: today })
      if (attemptBuild.success) {
        console.log(`\n=== Repair build passed on attempt ${attempt}! ===`)
        trace.addStep({
          name: 'repair',
          phase: 5,
          input: { attempt, error: errorGivenToAttempt?.slice(0, 2000) },
          output: {
            files: applied.replied,
            written: applied.written,
            deleted: applied.deleted,
            merged: retryResult.files.length,
            success: true,
            error: undefined,
          },
          durationMs: Date.now() - t0Repair,
        })
        const passingBackup = await snapshotPassingState()
        await refuseKnownFaults(await runScreenshotCriticGate(passingBackup))
        // await required — see first-pass call site
        return await archiveAndReturn(engineerResult, ` (repair ${attempt})`)
      }

      repairError = attemptBuild.error
      trace.addStep({
        name: 'repair',
        phase: 5,
        input: { attempt, error: errorGivenToAttempt?.slice(0, 2000) },
        output: {
          files: applied.replied,
          written: applied.written,
          deleted: applied.deleted,
          merged: retryResult.files.length,
          success: false,
          error: repairError?.slice(0, 2000),
        },
        durationMs: Date.now() - t0Repair,
      })
      console.warn(`  repair attempt ${attempt} did not pass — carrying the new error forward`)
    }

    // All attempts exhausted — snapshot the failing sources, then throw; the
    // outer catch restores the checkout
    await archiveFailedSources(state)
    throw new Error(
      `Build failed after ${attempt} repair attempt(s). Error:\n${repairError?.slice(0, 2500)}`
    )
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
