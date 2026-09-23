/**
 * Phase 2a/2b: the Mockup Designer and the Mockup Critic loop (#221).
 *
 * Reads the tokens from disk, builds the enriched brief every later agent
 * reads, picks the lane, and runs up to MAX_MOCKUP_REVISIONS revision rounds
 * of designer, pre-check and critic. The pre-check (mockup-precheck.js)
 * decides the measurable checks in code; the critic judges the rest; either
 * sends the mockup back, and a revision is a patch (mockup-patch.js). A round
 * whose measured faults did not move ends the loop early. Leaves on
 * `state.design`: `tokenContext`,
 * `enrichedBrief`, `lessonsBlock`, `chosenLane`, and the settled `mockup` and
 * `mockupScreenshot`.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pastDeadline } from '../utils/run-budget.js'
import { noteRetry } from '../utils/cost-ledger.js'
import { loadPrompt } from '../utils/prompt-loader.js'
import { selectLane } from '../utils/select-lane.js'
import {
  assembleMockupDesignerSystemPrompt,
  MOCKUP_DESIGNER_PROMPT_MAX,
} from '../utils/mockup-designer-prompt.js'
import { buildGoogleFontsUrl } from '../utils/chassis.js'
import { formatClientMarksForPrompt, readClientMarkSources } from '../utils/client-marks.js'
import { formatHeader } from '../utils/header-grammar.js'
import { formatTypeTreatment } from '../utils/type-grammar.js'
import { formatMobile } from '../utils/mobile-grammar.js'
import { formatMotion } from '../utils/motion-grammar.js'
import { formatTuple } from '../utils/composition-grammar.js'
import { criticPurpose, designerPurpose, settleMockupRound } from '../utils/mockup-rounds.js'
import {
  declaredFromAd,
  evaluateMockupPrecheck,
  formatPrecheckForDesigner,
  precheckMadeProgress,
} from '../utils/mockup-precheck.js'

/**
 * The binding sentence per non-statement `hero_object` value (#501).
 * `statement` is today's behaviour and needs no contract. On `artifact` the
 * client set renders as its marks (#505): the files under public/clients/
 * that project.clients[].logo points at, name-only where an entry has none.
 *
 * @type {Record<string, string>}
 */
const HERO_OBJECT_CONTRACTS = {
  figure:
    "The largest element on the page is a number from today's signals (a score, a temperature, a date, holes in one) at hero_scale; the hero phrase is its caption, one step down at 2xl to 4xl, and is still the h1.",
  word: 'The largest element on the page is one word lifted from the hero phrase at hero_scale; the rest of the phrase is the deck beneath it at 2xl to 4xl, and the whole phrase is still the h1.',
  list: 'The largest element on the page is the work index: project titles, years and roles are the first thing rendered, titles at hero_scale; the hero phrase is the standfirst above it at 2xl to 4xl, and is still the h1.',
  artifact:
    "The largest element on the page is one piece of owned work: the featured project's title at hero_scale with its year, role and client set beside it, the clients rendered as their marks from project.clients[].logo (one <img> per mark, alt set to the client's name, name-only for an entry without a logo) at a size that reads as a set, never as a footer strip; the hero phrase is its caption at 2xl to 4xl, and is still the h1.",
}

/**
 * Build a composition-driven constraint block for injection into the Mockup
 * Designer prompt: on a genuinely sparse composition, forbid rendering
 * project cards or portfolio sections on the home page — only the hero
 * phrase and navigation should appear.
 *
 * Successor to buildArchetypeContractBlock(archetype), which fired on the
 * literal strings 'Specimen' and 'Poster'. Re-expressed against the
 * composition tuple instead of a name (composition-grammar arc, Task 4):
 * `density: sparse` is composition-grammar.js's own definition of "very
 * few elements, very large intervals; the page is mostly field" — a
 * project-card grid directly contradicts that regardless of which
 * field_ratio or hero_zone accompanies it. (Deviation from the task's
 * draft wording, which suggested `density: sparse` AND `field_ratio:
 * drenched` specifically: narrowing to density alone is more faithful to
 * the original rule's purpose — Poster's sparseness and Specimen's
 * type-as-canvas both violate "no cards" for the same underlying reason,
 * independent of field_ratio.)
 *
 * `hero_object` (#501) adds a second block, one binding sentence per
 * non-statement value: what leads, and what the phrase becomes. The phrase
 * stays the page's one h1 on every value.
 *
 * @param {Record<string, string>|null|undefined} tuple - the day's composition tuple
 * @returns {string}
 */
export function buildCompositionContractBlock(tuple) {
  const blocks = []
  if (tuple?.density === 'sparse') {
    blocks.push(`⚠ COMPOSITION CONTRACT — SPARSE:
Home page = hero phrase + navigation ONLY.
Do NOT render project cards, featured project, experiments, or any portfolio section.
index.tsx is a single-composition canvas today, not a portfolio hub.`)
  }
  const object = HERO_OBJECT_CONTRACTS[tuple?.hero_object]
  if (object) {
    blocks.push(`⚠ COMPOSITION CONTRACT, HERO OBJECT (${tuple.hero_object}):\n${object}`)
  }
  return blocks.join('\n\n')
}

/**
 * The brief every downstream agent reads: hero copy, rationale, the
 * composition declaration, the visual spec and the Art Director's rationale.
 * @param {import('./run-state.js').RunState} state
 * @returns {string}
 */
function buildEnrichedBrief(state) {
  const { result: artDirectorResult, chosenComposition, visualSpec } = state.ad
  return [
    `## Hero Copy (the page must execute this phrase at marquee scale)`,
    artDirectorResult.heroCopy,
    '',
    `## Hero Rationale`,
    artDirectorResult.heroRationale,
    '',
    // Structured, guaranteed-present composition declaration — every
    // downstream reader of enrichedBrief (mockup designer, react engineer,
    // screenshot critic) needs this without depending on the Art Director
    // having also restated it inside the free-text visual spec.
    `## Composition (structural declaration — execute exactly)`,
    formatTuple(chosenComposition),
    artDirectorResult.compositionRationale || '',
    '',
    `## Visual Specification (from the Art Director)`,
    visualSpec,
    '',
    `## Art Director Rationale`,
    artDirectorResult.rationale,
  ].join('\n')
}

/**
 * The designer's system prompt with the day's lane, budget-checked.
 *
 * polish.md is ALWAYS loaded for the designer — but in the USER prompt
 * (12.1KB; keeps the system prompt under the CLI 2.1.92 ~56KB failure
 * zone). bolder.md is conditional on a committed/drenched color stance;
 * overdrive.md is NOT loaded (size cap); refResponsive is NOT appended —
 * its rules are already salvaged into mockup-designer.md's Responsive
 * section.
 * @param {import('./run-state.js').RunState} state
 * @param {string} mockupDesignerPromptRaw
 * @returns {Promise<{ systemPrompt: string, chosenLane: object }>}
 */
async function assembleDesignerPrompt(state, mockupDesignerPromptRaw) {
  const { root, today } = state
  const { brandRegisterDeclaration, refTypography, refColor, refSpatial, brandContract } =
    state.prompts
  const { result: artDirectorResult, chosenComposition, visualSpec } = state.ad
  const colorStory =
    JSON.stringify(artDirectorResult.colorScheme || {}).toLowerCase() + visualSpec.toLowerCase()
  const isCommitted = /drench|committed|saturat|maximal/.test(colorStory)
  const conditionalRefs = []
  if (isCommitted) {
    conditionalRefs.push(await loadPrompt('impeccable/reference/bolder.md', { root }))
  }
  const {
    lane: chosenLane,
    laneCount,
    forbidden: forbiddenLanes,
  } = selectLane({
    archiveDir: state.inputs.archiveDir,
    date: today,
    tuple: chosenComposition,
  })
  console.log(
    `  injecting lane: ${chosenLane.id} (register: ${chosenLane.register}, ${laneCount} lanes` +
      (forbiddenLanes.includes(chosenLane.id) ? ', forbidden but strongest affinity match' : '') +
      `); conditional refs: ${conditionalRefs.length}`
  )
  const { text: mockupDesignerSystemPrompt, bytes: mockupDesignerPromptBytes } =
    assembleMockupDesignerSystemPrompt({
      raw: mockupDesignerPromptRaw,
      laneBody: chosenLane.body,
      brandRegisterDeclaration,
      refs: [refTypography, refColor, refSpatial, ...conditionalRefs],
      brandContract,
    })
  console.log(`  mockup-designer system prompt: ${(mockupDesignerPromptBytes / 1024).toFixed(0)}KB`)
  if (mockupDesignerPromptBytes > MOCKUP_DESIGNER_PROMPT_MAX) {
    // A budget, not a crash guard. The CLI 2.1.92 bug this ceiling used to
    // guard against does not reproduce on the 2.1.207 pin in
    // .github/workflows/daily-redesign.yml (PR #69, 2026-07-12). The
    // model reads the whole prompt every revision round, so growth past
    // this line is a cost and attention problem, not a correctness one.
    // Throw so the day's run rolls back cleanly instead of quietly getting
    // more expensive.
    throw new Error(
      `mockup-designer system prompt is ${(mockupDesignerPromptBytes / 1024).toFixed(0)}KB — over the ${(MOCKUP_DESIGNER_PROMPT_MAX / 1024).toFixed(0)}KB budget. Trim a reference doc.`
    )
  }
  return { systemPrompt: mockupDesignerSystemPrompt, chosenLane }
}

/**
 * Calibration: best recent owner grade as a text note (screenshots would
 * blow the prompt budget; the graded bar carries the value).
 * @param {string} root
 * @returns {Promise<string>}
 */
async function readCalibrationNote(root) {
  let calibrationNote = ''
  try {
    const { readRecentRatings } = await import('../utils/ratings.js')
    const rated = readRecentRatings(path.join(root, 'archive'), { lookbackDays: 30 })
    const best = rated.find((r) => r.grade === 'A') || rated.find((r) => r.grade === 'B')
    if (best)
      calibrationNote = `## Calibration\n\nThe owner graded ${best.date} an ${best.grade}${best.worked ? ` — what worked: ${best.worked}` : ''}. That is the execution bar.`
  } catch {
    /* non-blocking */
  }
  return calibrationNote
}

/**
 * Everything each designer call is asked with, but the round's feedback.
 * @param {import('./run-state.js').RunState} state
 * @param {{ enrichedBrief: string, tokenContext: string, lessonsBlock: string, systemPrompt: string, refPolish: string, calibrationNote: string }} parts
 */
async function buildDesignerContext(state, parts) {
  const { root, contentSummary } = state
  const { refPolish, calibrationNote, lessonsBlock } = parts
  const { result: artDirectorResult, chosenComposition, chosenChassis } = state.ad
  const { headerDecl, typeDecl, mobileDecl, motionDecl } = state.ad
  const compositionContractBlock = buildCompositionContractBlock(chosenComposition) || ''
  const brandSvg = await readFile(path.join(root, 'app/assets/logo.svg'), 'utf8')
  const brandMonoSvg = await readFile(path.join(root, 'app/assets/logo-mono.svg'), 'utf8')
  // The client marks reach the mockup as inline SVG (#505), and only on an
  // `artifact` day: the mockup is captured from a file:// URL where
  // `/clients/*` resolves to nothing, and eight marks are 45KB of prompt
  // the other four hero objects never draw.
  const clientMarksBlock =
    chosenComposition.hero_object === 'artifact'
      ? formatClientMarksForPrompt(readClientMarkSources({ root }))
      : ''
  const googleFontsUrl = buildGoogleFontsUrl(chosenChassis)

  return {
    enrichedBrief: parts.enrichedBrief,
    tokenContext: parts.tokenContext,
    contentSummary,
    measurables: artDirectorResult.measurables,
    shell: artDirectorResult.shell,
    header: formatHeader(headerDecl),
    typeTreatment: formatTypeTreatment(typeDecl),
    mobile: formatMobile(mobileDecl),
    collapse: chosenComposition.collapse,
    motion: formatMotion(motionDecl),
    brandSvg,
    brandMonoSvg,
    clientMarksBlock,
    googleFontsUrl,
    lessonsBlock,
    calibrationNote,
    compositionContractBlock,
    tasteMemoryBlock: state.inputs.tasteMemoryBlock,
    polishRef: refPolish,
    systemPrompt: parts.systemPrompt,
    failureDumpPath: path.join(root, 'signals', 'mockup-designer-last-failed.txt'),
  }
}

/**
 * How many times the critic may send the mockup back.
 */
const MAX_MOCKUP_REVISIONS = 2

/**
 * What a revision round is asked with, on top of the designer's context.
 * @typedef {object} RoundFeedback
 * @property {string} revisionFeedback the critic's REVISE feedback, or ''
 * @property {string} measuredFaults the pre-check's findings as a block, or ''
 * @property {string} previousMockupHtml the page both were about
 * @property {string} [previousInteriorNotes] carried over when a patch leaves them out
 * @property {string} [previousRationale] carried over when a patch leaves it out
 */

/**
 * One designer call, retried once with the reason on a rejection. Returns
 * false when a revision round failed but an earlier round's mockup stands,
 * which ends the loop; throws when there is no mockup to fall back to.
 * @param {import('./run-state.js').RunState} state
 * @param {object} loop - the loop's running state
 * @param {number} round
 * @param {number} t0Mockup
 * @param {RoundFeedback} feedback - what the critic and the pre-check said last
 *   round, and the page they said it about
 * @returns {Promise<boolean>}
 */
async function designMockup(state, loop, round, t0Mockup, feedback) {
  const { runMockupDesigner, ctx } = loop
  const { trace } = state
  try {
    loop.mockup = await runMockupDesigner({
      ...ctx,
      ...feedback,
      purpose: designerPurpose(round),
    })
    return true
  } catch (firstErr) {
    if (firstErr.transport) {
      // A dead model answers the retry the same way it answered the
      // first call (see the Art Director's identical guard, #432) — skip
      // straight to the same fallback/throw a crash always got.
      if (round > 0 && loop.mockup) {
        console.warn(
          `  Mockup Designer revision failed (round ${round}, non-blocking — proceeding with previous mockup): ${firstErr.message}`
        )
        return false
      }
      console.error(`  Mockup Designer failed (round ${round}): ${firstErr.message}`)
      throw new Error(`Mockup Designer failed: ${firstErr.message}`)
    }
    console.warn(`  Mockup Designer failed (${firstErr.message}) — retrying once with the reason`)
    noteRetry()
    trace.addStep({
      name: 'mockup-designer-rejected',
      phase: 2,
      input: { round },
      output: { error: firstErr.message },
      durationMs: Date.now() - t0Mockup,
    })
    return await retryDesign(state, loop, { round, t0Mockup, feedback, firstErr })
  }
}

/**
 * The designer's one retry after a rejected reply.
 * @param {import('./run-state.js').RunState} state
 * @param {object} loop
 * @param {{ round: number, t0Mockup: number, feedback: object, firstErr: Error }} attempt
 * @returns {Promise<boolean>}
 */
async function retryDesign(state, loop, { round, t0Mockup, feedback, firstErr }) {
  // A patch that did not apply falls back to the whole file: the retry is
  // asked for ===FILE:mockup.html=== and is not offered the patch format.
  const retryContext = firstErr.patchFailed
    ? `## Previous attempt was rejected\n\n${firstErr.message}\nReturn the complete revised page in a ===FILE:mockup.html=== block this time, JS-free, with ===INTERIOR_NOTES=== and ===RATIONALE===.`
    : `## Previous attempt was rejected\n\nYour previous mockup failed validation: ${firstErr.message}\nReturn a JS-free mockup.html and every required block this time.`
  try {
    loop.mockup = await loop.runMockupDesigner({
      ...loop.ctx,
      ...feedback,
      ...(firstErr.patchFailed ? { allowPatch: false } : {}),
      purpose: 'retry',
      retryContext,
    })
    return true
  } catch (err) {
    if (round > 0 && loop.mockup) {
      // A revision round crashed (twice) but a previous round produced
      // a complete mockup — don't throw away a viable design over a
      // failed polish pass. mockup/mockupScreenshot still hold the
      // previous round.
      console.warn(
        `  Mockup Designer revision failed (round ${round}, non-blocking — proceeding with previous mockup): ${err.message}`
      )
      return false
    }
    console.error(`  Mockup Designer failed after retry (round ${round}): ${err.message}`)
    state.trace.addStep({
      name: 'mockup-designer-rejected',
      phase: 2,
      input: { round },
      output: { error: err.message },
      durationMs: Date.now() - t0Mockup,
    })
    throw new Error(`Mockup Designer failed after retry: ${err.message}`)
  }
}

/**
 * Screenshot the mockup just written and keep the round. Returns false when
 * the capture failed, which ends the loop without a critic.
 * @param {import('./run-state.js').RunState} state
 * @param {object} loop
 * @param {number} round
 * @returns {Promise<boolean>}
 */
async function captureMockup(state, loop, round) {
  const { headerDecl } = state.ad
  try {
    loop.mockupScreenshot = await loop.captureHtmlFileScreenshot(loop.mockupPath, {
      width: 1440,
      height: 900,
      headerCrop: { placement: headerDecl.placement, heightPx: headerDecl.height_px },
    })
  } catch (err) {
    console.warn(`  mockup screenshot failed (non-blocking — skipping critic): ${err.message}`)
    // Don't let an earlier round's screenshot masquerade as this mockup —
    // a stale image would become the fidelity target and archive artifact.
    loop.mockupScreenshot = null
    return false
  }
  const { mockup, mockupScreenshot } = loop
  loop.kept.set(round, { mockup, mockupScreenshot })
  loop.findings = precheckMockup(state, mockupScreenshot)
  if (mockupScreenshot.measured) {
    state.mockupMeasurableRounds.push({
      round,
      measured: mockupScreenshot.measured,
      measuredAt: new Date().toISOString(),
      // What the pre-check found on this round (mockup-precheck.js), so an
      // archived night can be read back without re-rendering its mockups.
      ...(loop.findings
        ? { precheck: loop.findings.map(({ check, key, gap }) => ({ check, key, gap })) }
        : {}),
    })
    console.log(
      `  measured mockup — canvas=${mockupScreenshot.measured.canvas_utilization}% ` +
        `color=${mockupScreenshot.measured.color_coverage}% hero=${mockupScreenshot.measured.hero_px}px`
    )
  }
  return true
}

/**
 * The checks that are facts (mockup-precheck.js), on the round just
 * captured: Check 2's measured numbers against the declared floors, Check 4's
 * mark and lockup, and the measurable half of Check 6. Null when the capture
 * carried nothing to check, which is not the same as nothing found.
 * @param {import('./run-state.js').RunState} state
 * @param {object} mockupScreenshot
 * @returns {Array<{ check: number, key: string, gap: number, detail: string }>|null}
 */
function precheckMockup(state, mockupScreenshot) {
  const { measured } = mockupScreenshot
  const facts = mockupScreenshot.facts ?? {}
  if (!measured && !facts.wide && !facts.narrow) return null
  return evaluateMockupPrecheck({ measured, ...facts, declared: declaredFromAd(state.ad) })
}

/**
 * Record the round's pre-check as a verdict, beside the critic's, so
 * verdicts.json and the lessons carry the measured faults the designer was
 * given. Nothing is recorded for a round with nothing to check.
 * @param {import('./run-state.js').RunState} state
 * @param {number} round
 * @param {Array<object>|null} findings
 */
function recordPrecheck(state, round, findings) {
  if (!findings) return
  const verdict = findings.length ? 'REVISE' : 'APPROVE'
  if (findings.length) {
    console.log(
      `  [mockup-precheck] ${findings.length} measured fault(s): ${findings.map((f) => f.key).join(', ')}`
    )
  }
  state.verdicts.push({
    critic: 'mockup-precheck',
    round,
    verdict,
    feedback: findings
      .map((f) => `[check ${f.check}] ${f.detail}`)
      .join('\n')
      .slice(0, 2000),
    findings: findings.map(({ check, key, gap }) => ({ check, key, gap })),
    ts: Date.now(),
  })
}

/**
 * Ask the critic about this round's screenshot. Null when the critic could
 * not run, which accepts the mockup.
 * @param {import('./run-state.js').RunState} state
 * @param {object} loop
 * @param {number} round
 * @returns {Promise<object|null>}
 */
async function critiqueMockup(state, loop, round) {
  const { result: artDirectorResult, measurablesDecl, chosenComposition } = state.ad
  const { headerDecl, typeDecl, mobileDecl } = state.ad
  const { mockupScreenshot } = loop
  try {
    return await loop.runMockupCritic({
      systemPrompt: loop.criticSystemPrompt,
      screenshotBuffer: mockupScreenshot.jpeg,
      mobileScreenshot: mockupScreenshot.mobileJpeg,
      headerCrop: mockupScreenshot.headerJpeg,
      headerCropAnchor: mockupScreenshot.headerCropAnchor,
      enrichedBrief: loop.ctx.enrichedBrief,
      measurables: artDirectorResult.measurables,
      measured: mockupScreenshot.measured,
      measurablesDecl,
      shell: artDirectorResult.shell,
      header: formatHeader(headerDecl),
      typeTreatment: formatTypeTreatment(typeDecl),
      mobile: formatMobile(mobileDecl),
      collapse: chosenComposition.collapse,
      purpose: criticPurpose(round),
    })
  } catch (err) {
    console.warn(`  mockup critic failed (non-blocking — accepting mockup): ${err.message}`)
    return null
  }
}

/**
 * Whether the critic's verdict asks for a revision the designer can act on:
 * a REVISE with feedback. The fail-closed REVISE on a malformed reply carries
 * none, and neither does a critic that could not run.
 * @param {{ verdict: string, feedback: string }|null} critique
 * @returns {boolean}
 */
function criticAsksForRevision(critique) {
  if (!critique) return false
  if (critique.verdict === 'APPROVE') {
    console.log('  [mockup-critic] APPROVE')
    return false
  }
  if (critique.feedback.startsWith('malformed critic response')) {
    // The critic's fail-closed REVISE on a malformed response carries no
    // usable feedback — don't burn an Opus revision round on garbage.
    // Treated like a critic crash: the critic's half accepts the mockup
    // (the malformed response is still recorded in verdicts.json above).
    console.warn('  [mockup-critic] malformed response (non-blocking — accepting mockup)')
    return false
  }
  return true
}

/**
 * Whether the loop ends on a round that asked for a revision: out of rounds,
 * no measured progress since the round before, or out of time.
 * @param {object} loop
 * @param {number} round
 * @returns {boolean}
 */
function revisionEndsLoop(loop, round) {
  if (round === MAX_MOCKUP_REVISIONS) {
    console.warn(
      `  [mockup-critic] still REVISE after ${MAX_MOCKUP_REVISIONS} revisions — proceeding with latest mockup; findings persist to lessons via verdicts.json`
    )
    return true
  }
  if (!precheckMadeProgress(loop.previousFindings, loop.findings)) {
    // The same measured faults as the round before, none closer: another
    // Opus round on this page is money that buys no approval (eleven
    // September nights ran all three rounds and approved none).
    console.warn(
      `  [mockup-precheck] no progress on ${loop.findings.map((f) => f.key).join(', ')} since round ${round - 1} — proceeding without another revision`
    )
    return true
  }
  if (pastDeadline()) {
    console.warn('  [deadline] run budget exhausted — proceeding with latest mockup')
    return true
  }
  return false
}

/**
 * The designer's half of a round: call, write, and record a patch that was
 * applied. False when the round produced nothing new (see designMockup).
 * @param {import('./run-state.js').RunState} state
 * @param {object} loop
 * @param {number} round
 * @param {RoundFeedback} feedback
 * @returns {Promise<boolean>}
 */
async function designRound(state, loop, round, feedback) {
  // The optional steps check the deadline before starting; the two
  // required calls (this and the engineer below) did not, so an Art
  // Director that burned the budget on retries took the night down with
  // "timed out after 0 minutes" instead of a reason (#299).
  if (round === 0 && pastDeadline()) {
    throw new Error('run budget exhausted before the Mockup Designer could start — nothing to ship')
  }
  const t0Mockup = Date.now()
  if (!(await designMockup(state, loop, round, t0Mockup, feedback))) return false
  await writeFile(loop.mockupPath, loop.mockup.mockupHtml, 'utf8')
  loop.producedMockupRound = round
  const { patch, mockupHtml } = loop.mockup
  if (patch) {
    state.trace.addStep({
      name: 'mockup-patch',
      phase: 2,
      input: { round },
      output: { edits: patch.edits, bytes: mockupHtml.length },
      durationMs: Date.now() - t0Mockup,
    })
  }
  return true
}

/**
 * Put the critic's verdict on the record: verdicts.json and the trace.
 * @param {import('./run-state.js').RunState} state
 * @param {number} round
 * @param {{ verdict: string, feedback: string, channel?: string }} critique
 * @param {number} t0 when the round started
 */
function recordCritique(state, round, critique, t0) {
  state.verdicts.push({
    critic: 'mockup-critic',
    round,
    verdict: critique.verdict,
    feedback: critique.feedback.slice(0, 2000),
    // A verdict reached without pixels is a different thing from one
    // reached with them, and verdicts.json is where that has to stay
    // visible after the fact — the screenshot critic already records
    // this; the mockup critic dropped it on the way into the array (#304).
    channel: critique.channel,
    ts: Date.now(),
  })
  state.trace.addStep({
    name: 'mockup-critic',
    phase: 2,
    input: { round },
    output: { verdict: critique.verdict, feedback: critique.feedback.slice(0, 500) },
    durationMs: Date.now() - t0,
  })
}

/**
 * What the next round is asked to fix, or null when this round ends the
 * loop: nothing to fix, or a stop in revisionEndsLoop.
 * @param {object} loop
 * @param {number} round
 * @param {{ verdict: string, feedback: string }|null} critique
 * @returns {{ revisionFeedback: string, measuredFaults: string }|null}
 */
function nextRevision(loop, round, critique) {
  const criticRevise = criticAsksForRevision(critique)
  const faults = loop.findings ?? []
  if (!criticRevise && faults.length === 0) return null
  if (revisionEndsLoop(loop, round)) return null
  return {
    revisionFeedback: criticRevise ? critique.feedback : '',
    measuredFaults: formatPrecheckForDesigner(faults, { previous: loop.previousFindings }),
  }
}

/**
 * One round: design, write, capture, pre-check, critique. Returns what sends
 * the mockup back, or null when the loop ends here.
 * @param {import('./run-state.js').RunState} state
 * @param {object} loop
 * @param {number} round
 * @param {RoundFeedback} feedback
 * @returns {Promise<{ revisionFeedback: string, measuredFaults: string }|null>}
 */
async function runMockupRound(state, loop, round, feedback) {
  const t0 = Date.now()
  if (!(await designRound(state, loop, round, feedback))) return null

  console.log(`\n[phase-2b] Mockup Critic (round ${round})`)
  loop.findings = null
  if (!(await captureMockup(state, loop, round))) return null
  recordPrecheck(state, round, loop.findings)
  const critique = await critiqueMockup(state, loop, round)
  if (critique) recordCritique(state, round, critique, t0)
  return nextRevision(loop, round, critique)
}

/**
 * Phase 2: the mockup pipeline (reads tokens from disk).
 * @param {import('./run-state.js').RunState} state
 */
export async function runMockupPhase(state) {
  const { root, trace } = state
  const tokenContext = await readFile(path.join(root, 'elements/preset.ts'), 'utf8')
  const enrichedBrief = buildEnrichedBrief(state)

  console.log('\n[phase-2a] Mockup Designer')
  const { runMockupDesigner } = await import('../agents/mockup-designer.js')
  const { runMockupCritic } = await import('../agents/mockup-critic.js')
  const { captureHtmlFileScreenshot } = await import('../utils/snapshot.js')
  const { buildLessonsBlock } = await import('../utils/lessons.js')

  const mockupDesignerPromptRaw = await loadPrompt('mockup-designer.md', { root })
  const mockupCriticPromptRaw = await loadPrompt('mockup-critic.md', { root })
  const criticSystemPrompt = `${mockupCriticPromptRaw}\n\n## Design Critique Heuristics\n\n${state.prompts.refCritique}`
  const refPolish = await loadPrompt('impeccable/reference/polish.md', { root })
  const { systemPrompt, chosenLane } = await assembleDesignerPrompt(state, mockupDesignerPromptRaw)
  const calibrationNote = await readCalibrationNote(root)
  const lessonsBlock = buildLessonsBlock(path.join(root, 'archive'), { limit: 7 })
  const ctx = await buildDesignerContext(state, {
    enrichedBrief,
    tokenContext,
    lessonsBlock,
    systemPrompt,
    refPolish,
    calibrationNote,
  })

  const loop = {
    ctx,
    criticSystemPrompt,
    runMockupDesigner,
    runMockupCritic,
    captureHtmlFileScreenshot,
    mockupPath: path.join(root, 'signals', 'today.mockup.html'),
    mockup: undefined,
    mockupScreenshot: null,
    producedMockupRound: -1,
    // Every round's mockup and screenshot, so the loop can ship an earlier
    // round when the critic never approves one and a later round measured
    // worse (#573).
    kept: new Map(),
    // The pre-check's findings on the round just captured and on the round
    // before it, for STILL PRESENT and the no-progress stop.
    findings: null,
    previousFindings: null,
  }
  /** @type {RoundFeedback} */
  let feedback = { revisionFeedback: '', measuredFaults: '', previousMockupHtml: '' }
  for (let round = 0; round <= MAX_MOCKUP_REVISIONS; round++) {
    const revise = await runMockupRound(state, loop, round, feedback)
    if (!revise) break
    console.log(`  [mockup-critic] REVISE — feeding back to designer`)
    // Every other retry path counts itself in cost.json; this loop starts
    // another Mockup Designer call (Opus, the most expensive model in
    // PROD_MODELS) but never told the ledger, so `retries` undercounted
    // whether the critic loop earned its keep (#303).
    noteRetry()
    // The mockup the critic just reviewed. The designer revises this page
    // instead of regenerating one from the brief (#573), as a patch.
    feedback = {
      ...revise,
      previousMockupHtml: loop.mockup.mockupHtml,
      previousInteriorNotes: loop.mockup.interiorNotes,
      previousRationale: loop.mockup.rationale,
    }
    loop.previousFindings = loop.findings
  }

  // When the critic never approved, the last round is not necessarily the
  // best one; this ships the round with the smallest measured shortfall.
  const settled = await settleMockupRound({
    verdicts: state.verdicts,
    rounds: state.mockupMeasurableRounds,
    declared: state.ad.measurablesDecl,
    producedRound: loop.producedMockupRound,
    kept: loop.kept,
    current: { mockup: loop.mockup, mockupScreenshot: loop.mockupScreenshot },
    mockupPath: loop.mockupPath,
    trace,
  })

  state.design = {
    tokenContext,
    enrichedBrief,
    lessonsBlock,
    chosenLane,
    mockup: settled.mockup,
    mockupScreenshot: settled.mockupScreenshot,
  }
}

// Phase 2c: React Engineer — translates the approved mockup to TSX; see
// phase-engineer.js.
