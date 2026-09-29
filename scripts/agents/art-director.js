/**
 * Art Director — single-agent compositional decision.
 *
 * Replaces the historical brief-writer + Design Director + Token Designer
 * trio. Reads raw signals, content, chassis catalog, composition mandate,
 * color mandate, and impeccable references, then asks Claude to make ONE
 * unified decision: hero copy, composition tuple, chassis, full preset.ts,
 * visual spec, self-check. `archetype` survives only as an optional,
 * unvalidated descriptive label (see validateArtDirectorResult) — the
 * fixed 8-name archetype list this module used to hard-validate against
 * was removed 2026-08-23 (composition-grammar arc, Task 4).
 *
 * The orchestrator (scripts/design-agents.js) handles backup/restore,
 * Phase 2 (Unified Designer), build validation, and archive.
 */
import { writeFile } from 'node:fs/promises'
import { callTapedCLI } from '../utils/call-tape.js'
import { parseDelimiterResponse } from '../utils/delimiter-parser.js'
import {
  parseMeasurablesBlock,
  parseShellBlock,
  parseHeaderBlock,
  parseCompositionBlock,
  parseMobileBlock,
  parseTypeTreatmentBlock,
  parseMotionBlock,
} from '../utils/spec-blocks.js'
import { isValidTuple } from '../utils/composition-grammar.js'
import { isValidHeader } from '../utils/header-grammar.js'
import { isValidMobile } from '../utils/mobile-grammar.js'
import { isValidTypeTreatment } from '../utils/type-grammar.js'
import { isValidMotion } from '../utils/motion-grammar.js'
import { specFindings } from '../utils/ad-spec-checks.js'
import { CHASSIS_CATALOG } from '../../elements/chassis/index.js'
import { LOCKUP_IDS } from '../utils/brand-lockup.js'
import { MATERIAL_NAMES, isMaterialName } from '../utils/material.js'
import { modelFor } from '../utils/models.js'
import { budgetFor } from '../utils/budgets.js'
import { newBoundaryId, serialiseSignals, wrapAsData } from '../utils/data-boundary.js'
import { blockRequest, spliceBlockAnswer } from '../utils/ad-block-splice.js'

const BRAND_LOCKUP_IDS = new Set(LOCKUP_IDS)

/**
 * Assemble the user prompt for the Art Director call.
 * Pure function — no I/O — so unit tests can drive it directly.
 *
 * The signals, the design references and the archive briefs are text a
 * stranger or an earlier model run wrote. Each goes inside a tag ending in
 * `boundaryId`, which the system prompt names as data (data-boundary.js).
 * `runAgentSwarm` draws one id per run; without one a random id is drawn here.
 */
export function buildArtDirectorUserPrompt({
  boundaryId = newBoundaryId(),
  signals,
  contentSummary,
  chassisCatalogBlock,
  recentBriefs,
  recentRatings,
  references,
  colorMandateSection,
  shellMandateSection,
  paletteFormulaMandateSection,
  heroSourceMandateSection,
  compositionMandateSection,
  chassisMandateSection,
  typeTreatmentMandateSection,
  motionMandateSection,
  brandContract,
  weightsBlock,
  tasteMemoryBlock,
  voiceBlock,
  mobileLessonBlock,
  uniquenessBlock,
  retryContext,
}) {
  // Every block after the first three is optional and skipped when empty;
  // the order here is the order the Art Director reads them in.
  const sections = [
    `## Today's Raw Signals\n\n${wrapAsData('signals', `\`\`\`yaml\n${serialiseSignals(signals)}\n\`\`\``, boundaryId)}`,
    `## Site Content (read-only — for hero phrase mining)\n\n${contentSummary}`,
    `## Typography Chassis Catalog\n\n${chassisCatalogBlock}`,
    recentBriefs && `## Recent Archive Briefs\n\n${wrapAsData('briefs', recentBriefs, boundaryId)}`,
    recentRatings && `## User Design Ratings (learn from these)\n\n${recentRatings}`,
    references && `## Design References\n\n${wrapAsData('references', references, boundaryId)}`,
    colorMandateSection,
    shellMandateSection,
    paletteFormulaMandateSection,
    heroSourceMandateSection,
    compositionMandateSection,
    chassisMandateSection,
    typeTreatmentMandateSection,
    motionMandateSection,
    brandContract,
    weightsBlock && `## Creative Weights\n\n${weightsBlock}`,
    tasteMemoryBlock,
    voiceBlock,
    mobileLessonBlock,
    uniquenessBlock,
    retryContext,
  ]
  return sections.filter(Boolean).join('\n\n---\n\n')
}

/**
 * A validation error that names the one block that failed.
 * @param {string} block the delimiter name, without the `===`
 * @param {string} message
 */
function rejectBlock(block, message) {
  const err = new Error(message)
  err.block = block
  return err
}

/**
 * Validate that an Art Director response has all required blocks and a
 * valid composition tuple. Throws with a specific reason on failure so the
 * orchestrator can decide whether to retry or surface the error.
 *
 * `===ARCHETYPE===` is optional and never validated — the fixed 8-name list
 * this function used to hard-fail against is gone (composition-grammar
 * arc, Task 4). `===COMPOSITION===` is the real structural declaration now,
 * and it IS validated: every one of the nine axes must be present with a
 * value from that axis's fixed vocabulary (see composition-grammar.js).
 * `===COMPOSITION_RATIONALE===` is required alongside it — a tuple with no
 * stated reason is exactly the "invented archetype for its own sake"
 * failure mode a hard-fail-on-unknown-value coherence gate exists to catch.
 *
 * The last step compares the reply with itself (see ad-spec-checks.js): the
 * spec's colours with the preset it ships, `hero_scale` and `hero_step_360`
 * with the chassis ramp it picked. With `enforceSpec` those findings throw
 * like any other, which is what sends the first attempt to its retry. The
 * retry passes `enforceSpec: false` and gets the findings back as a list: a
 * spec that still disagrees with its preset after being told how is not worth
 * the night, and the second failure ends the run.
 *
 * Every rejection that one block can fix carries that block's delimiter name
 * as `err.block` ('MOBILE', 'FILE:elements/preset.ts'), so the retry can ask
 * for that block alone (ad-block-splice.js, spec 11 1a). The spec findings
 * carry none: each compares two blocks, and either one could be the fix.
 *
 * @param {object} parsed
 * @param {{ enforceSpec?: boolean }} [options]
 * @returns {string[]} the spec findings that were tolerated, empty when none
 */
export function validateArtDirectorResult(parsed, { enforceSpec = true } = {}) {
  if (!parsed.hero_copy || parsed.hero_copy.length < 3) {
    throw rejectBlock(
      'HERO_COPY',
      'Art Director response missing or empty hero_copy (===HERO_COPY===)'
    )
  }
  if (!parsed.composition) {
    throw rejectBlock('COMPOSITION', 'Art Director response missing ===COMPOSITION===')
  }
  const composition = parseCompositionBlock(parsed.composition)
  const { valid, errors } = isValidTuple(composition)
  if (!valid) {
    throw rejectBlock(
      'COMPOSITION',
      `Art Director composition tuple is invalid: ${errors.join('; ')}`
    )
  }
  if (!parsed.composition_rationale || parsed.composition_rationale.length < 10) {
    throw rejectBlock(
      'COMPOSITION_RATIONALE',
      'Art Director response missing or too-short ===COMPOSITION_RATIONALE==='
    )
  }
  if (!parsed.chassis_id) {
    throw rejectBlock('CHASSIS_ID', 'Art Director response missing chassis_id (===CHASSIS_ID===)')
  }
  if (!parsed.visual_spec) {
    throw rejectBlock('VISUAL_SPEC', 'Art Director response missing ===VISUAL_SPEC===')
  }
  if (!parsed.self_check) {
    throw rejectBlock('SELF_CHECK', 'Art Director response missing ===SELF_CHECK===')
  }
  const presetFile = (parsed.files || []).find((f) => f.path === 'elements/preset.ts')
  if (!presetFile?.content) {
    throw rejectBlock(
      'FILE:elements/preset.ts',
      'Art Director response missing ===FILE:elements/preset.ts=== block'
    )
  }
  if (!parsed.measurables) {
    throw rejectBlock('MEASURABLES', 'Art Director response missing ===MEASURABLES===')
  }
  const measurables = parseMeasurablesBlock(parsed.measurables)
  if (measurables.canvas_utilization_min === null) {
    throw rejectBlock('MEASURABLES', 'MEASURABLES block missing numeric canvas_utilization_min')
  }
  if (!parsed.shell) {
    throw rejectBlock('SHELL', 'Art Director response missing ===SHELL===')
  }
  const shell = parseShellBlock(parsed.shell)
  // `nav` is no longer a SHELL field — it moved to HEADER with the rest of
  // the header declaration (#254).
  for (const key of ['footer', 'brand_lockup', 'brand_color_mode']) {
    if (!shell[key]) throw rejectBlock('SHELL', `SHELL block missing ${key}`)
  }
  if (!['original', 'single-color'].includes(shell.brand_color_mode)) {
    throw rejectBlock(
      'SHELL',
      `SHELL brand_color_mode must be "original" or "single-color", got "${shell.brand_color_mode}"`
    )
  }
  if (!BRAND_LOCKUP_IDS.has(shell.brand_lockup)) {
    console.warn(
      `  [AD] brand_lockup "${shell.brand_lockup}" is not a Brand Contract id — accepting (warn-only)`
    )
  }
  // The texture on the hero field (#505) is enumerated the way
  // brand_color_mode is: the component draws exactly these six, and a name
  // it does not know renders nothing.
  if (!shell.ground_material) {
    throw rejectBlock('SHELL', 'SHELL block missing ground_material')
  }
  if (!isMaterialName(shell.ground_material)) {
    throw rejectBlock(
      'SHELL',
      `SHELL ground_material must be one of ${MATERIAL_NAMES.join(', ')}, got "${shell.ground_material}"`
    )
  }
  // HEADER is validated the way COMPOSITION is, and for the same reason: a
  // declaration nobody can check is a declaration the render can quietly
  // ignore. Three owner ratings running said the header was wrong and no
  // gate could have caught any of them (#254).
  if (!parsed.header) {
    throw rejectBlock('HEADER', 'Art Director response missing ===HEADER===')
  }
  const header = parseHeaderBlock(parsed.header)
  const headerCheck = isValidHeader(header, {
    shellPosture: composition.shell_posture,
    brandLockup: shell.brand_lockup,
  })
  if (!headerCheck.valid) {
    throw rejectBlock(
      'HEADER',
      `Art Director HEADER block is invalid: ${headerCheck.errors.join('; ')}`
    )
  }
  if (!header.nav) {
    throw rejectBlock('HEADER', 'HEADER block missing nav')
  }
  // MOBILE is validated the way HEADER is (#452): the composition's
  // `collapse` axis names what the canvas becomes on the phone, and this block says
  // what that means for today's page. A block that contradicts the axis is
  // rejected, not reconciled, the same as a placement that contradicts the
  // shell posture.
  if (!parsed.mobile) {
    throw rejectBlock('MOBILE', 'Art Director response missing ===MOBILE===')
  }
  const mobile = parseMobileBlock(parsed.mobile)
  const mobileCheck = isValidMobile(mobile, {
    collapse: composition.collapse,
    shellPosture: composition.shell_posture,
    columns: composition.columns,
    placement: header.placement,
    heroCopy: parsed.hero_copy,
  })
  if (!mobileCheck.valid) {
    throw rejectBlock(
      'MOBILE',
      `Art Director MOBILE block is invalid: ${mobileCheck.errors.join('; ')}`
    )
  }
  validateTypeTreatment(parsed)
  validateMotion(parsed)
  return validateSpec(parsed, enforceSpec)
}

/**
 * The reply checked against itself: colours, `hero_scale` and
 * `hero_step_360`, the three complaints the spec critic made on twelve of
 * seventeen September nights (#576). The finding text is what the retry
 * brief carries, so it names the field, the value and the valid options.
 */
function validateSpec(parsed, enforce) {
  const findings = specFindings({
    visualSpec: parsed.visual_spec,
    presetTs: parsed.files.find((f) => f.path === 'elements/preset.ts').content,
    chassisId: parsed.chassis_id,
    measurables: parseMeasurablesBlock(parsed.measurables),
    mobile: parseMobileBlock(parsed.mobile),
  })
  if (enforce && findings.length > 0) {
    throw new Error(
      `Art Director reply disagrees with its own chassis or preset:\n- ${findings.join('\n- ')}`
    )
  }
  return findings
}

/**
 * TYPE_TREATMENT is validated the way HEADER is (#502), against the chosen
 * chassis: an italic lead on a face that loads no italic, or a weight extreme
 * on a face that loads one weight, would render as a synthesized cut, so it is
 * rejected at declaration time rather than found in pixels. An unknown
 * chassis_id gets no cross-check here; the orchestrator warns and falls back.
 */
function validateTypeTreatment(parsed) {
  if (!parsed.type_treatment) {
    throw rejectBlock('TYPE_TREATMENT', 'Art Director response missing ===TYPE_TREATMENT===')
  }
  const chassis = CHASSIS_CATALOG.find((c) => c.id === parsed.chassis_id) ?? null
  const typeCheck = isValidTypeTreatment(parseTypeTreatmentBlock(parsed.type_treatment), {
    chassis,
  })
  if (!typeCheck.valid) {
    throw rejectBlock(
      'TYPE_TREATMENT',
      `Art Director TYPE_TREATMENT block is invalid: ${typeCheck.errors.join('; ')}`
    )
  }
}

/**
 * MOTION is validated the way TYPE_TREATMENT is (#506): three enumerated
 * fields, every one required, none cross-checked against anything else. A
 * page that holds still declares `none / static / none`; it does not omit the
 * block.
 */
function validateMotion(parsed) {
  if (!parsed.motion) {
    throw rejectBlock('MOTION', 'Art Director response missing ===MOTION===')
  }
  const motionCheck = isValidMotion(parseMotionBlock(parsed.motion))
  if (!motionCheck.valid) {
    throw rejectBlock(
      'MOTION',
      `Art Director MOTION block is invalid: ${motionCheck.errors.join('; ')}`
    )
  }
}

/**
 * Run the Art Director phase.
 *
 * @param {{
 *   boundaryId?: string,
 *   signals: object,
 *   contentSummary: string,
 *   chassisCatalog: object[],
 *   chassisCatalogBlock: string,
 *   recentBriefs: string,
 *   recentRatings: string,
 *   references: string,
 *   colorMandateSection: string,
 *   shellMandateSection?: string,
 *   paletteFormulaMandateSection?: string,
 *   heroSourceMandateSection?: string,
 *   compositionMandateSection?: string,
 *   chassisMandateSection?: string,
 *   typeTreatmentMandateSection?: string,
 *   motionMandateSection?: string,
 *   weightsBlock: string,
 *   tasteMemoryBlock: string,
 *   voiceBlock?: string,
 *   mobileLessonBlock?: string,
 *   uniquenessBlock?: string,
 *   retryContext?: string,
 *   purpose?: string,
 *   systemPrompt: string,
 *   designReferenceImages?: Array<{ data: string, media_type: string, title?: string }>,
 * }} ctx
 * @returns {Promise<{ heroCopy: string, heroRationale: string, heroSource: string, archetype: string, chassisId: string, presetTs: string, visualSpec: string, selfCheck: string, rationale: string, designBrief: string, colorScheme: object|null, shell: string, header: string, typeTreatment: string, mobile: string, motion: string, composition: string, compositionRationale: string, brief: string, reply: string }>}
 *   `reply` is the raw text the result was parsed from, which a block retry
 *   splices into. A rejected reply rides on the thrown error the same way, as
 *   `err.reply`, beside the `err.block` that names what failed.
 */
export async function runArtDirector(ctx) {
  return settleArtDirectorReply(await callArtDirector(ctx), ctx)
}

/**
 * Ask again for named blocks of an earlier reply, with the reason, and splice
 * the answer into that reply (spec 11, 1a). The model sees the same system
 * prompt and the same brief, then its previous reply and the request, and
 * returns only those blocks. The spliced reply is parsed and validated whole,
 * like a fresh one, and tolerates spec findings the way any retry does.
 *
 * Throws when the answer leaves out a requested block or the spliced reply
 * still fails validation; the caller decides whether a full ask follows. A
 * transport error arrives with `transport` set, as from `runArtDirector`.
 *
 * @param {Parameters<typeof runArtDirector>[0]} ctx as `runArtDirector`
 * @param {{ reply: string, blocks: string[], reason: string }} request `reply`
 *   is the earlier raw reply, `blocks` the delimiter names ('MOBILE',
 *   'FILE:elements/preset.ts'), `reason` what the model is told was wrong
 * @returns {ReturnType<typeof runArtDirector>}
 */
export async function runArtDirectorBlockRetry(ctx, { reply, blocks, reason }) {
  const blockCtx = {
    ...ctx,
    retryContext: blockRequest({ reply, blocks, reason }),
    purpose: 'block-retry',
  }
  const answer = await callArtDirector(blockCtx)
  const spliced = spliceBlockAnswer(reply, answer, blocks)
  if (!spliced.ok) throw new Error(`Art Director block retry did not splice: ${spliced.error}`)
  return settleArtDirectorReply(spliced.reply, blockCtx)
}

/**
 * One model call with the Art Director's prompt and budget.
 * @param {Parameters<typeof runArtDirector>[0]} ctx
 * @returns {Promise<string>} the raw reply
 */
function callArtDirector(ctx) {
  // 20-minute total / 15-minute stall headroom. AD calls in production
  // have run 7:45 (run 1) and 8:55 (run 2) at 5–9 weight settings; a
  // higher-inspiration prompt with the export-name guard added pushed
  // run 3 past the original 10-minute hard cap. Match the shape of the
  // unified-designer config (30 min total / 25 min stall) one register
  // tighter — the AD prompt is smaller and shouldn't need that much.
  return callTapedCLI('art-director', ctx.systemPrompt, buildArtDirectorUserPrompt(ctx), {
    ...budgetFor('art-director'),
    model: modelFor('art-director'),
    purpose: ctx.purpose,
  })
}

/** The parsed keys of the blocks every reply must carry, for the rejection log. */
const REQUIRED_KEYS = [
  'hero_copy',
  'composition',
  'composition_rationale',
  'chassis_id',
  'visual_spec',
  'self_check',
  'measurables',
  'shell',
  'header',
  'type_treatment',
  'mobile',
  'motion',
]

/**
 * Log a rejected reply, dump it, and attach it to the error as `err.reply`
 * for a block retry to splice into.
 * @param {Error & { block?: string, reply?: string }} err
 * @param {ReturnType<typeof parseDelimiterResponse>} parsed
 * @param {string} result the raw reply
 * @param {{ failureDumpPath?: string }} ctx
 */
async function reportRejectedReply(err, parsed, result, ctx) {
  const present = REQUIRED_KEYS.filter((k) => parsed[k])
  const absent = REQUIRED_KEYS.filter((k) => !parsed[k])
  console.error(
    `  [AD] validation failed — present: [${present.join(', ')}] absent: [${absent.join(', ')}]`
  )
  console.error(`  [AD] response head: ${result.slice(0, 300).replace(/\n/g, '↵')}`)
  if (ctx.failureDumpPath) {
    try {
      await writeFile(ctx.failureDumpPath, result, 'utf8')
    } catch {}
  }
  // A reply missing other blocks as well is broken wider than the one block
  // the validator stopped at, so it gets the full retry, not a block retry.
  if (absent.some((k) => k.toUpperCase() !== err.block)) delete err.block
  err.reply = result
}

/**
 * Parse and validate a raw reply, and compose the result the phase uses.
 * @param {string} result the raw reply
 * @param {Parameters<typeof runArtDirector>[0]} ctx
 * @returns {ReturnType<typeof runArtDirector>}
 */
async function settleArtDirectorReply(result, ctx) {
  let parsed
  try {
    parsed = parseDelimiterResponse(result)
  } catch (err) {
    throw new Error(`Art Director response unparseable: ${err.message}`)
  }

  try {
    // A retry tolerates spec findings and logs them; see validateArtDirectorResult.
    for (const finding of validateArtDirectorResult(parsed, { enforceSpec: !ctx.retryContext })) {
      console.warn(`  [AD] shipping a spec finding after the retry: ${finding}`)
    }
  } catch (err) {
    await reportRejectedReply(err, parsed, result, ctx)
    throw err
  }

  // Compose the human-readable brief used in archive/brief.md (the previous
  // pipeline produced this from interpret-signals.js; the Art Director must
  // still produce it — see spec, "Loss of brief-as-artifact").
  const brief = [
    `## Hero Copy`,
    parsed.hero_copy,
    '',
    `## Hero Rationale`,
    parsed.hero_rationale || '(none)',
    '',
    `## Archetype`,
    parsed.archetype || '(none declared — composition tuple below is the structural record)',
    '',
    `## Composition`,
    parsed.composition || '',
    '',
    `## Composition Rationale`,
    parsed.composition_rationale || '',
    '',
    `## Mobile`,
    parsed.mobile || '',
    '',
    `## Chassis`,
    parsed.chassis_id,
    '',
    `## Visual Specification`,
    parsed.visual_spec,
    '',
    `## Self-Check`,
    parsed.self_check,
    '',
    `## Rationale`,
    parsed.rationale || '',
  ].join('\n')

  return {
    heroCopy: parsed.hero_copy,
    heroRationale: parsed.hero_rationale || '',
    heroSource: parsed.hero_source || '',
    archetype: parsed.archetype || '',
    chassisId: parsed.chassis_id,
    presetTs: parsed.files.find((f) => f.path === 'elements/preset.ts').content,
    visualSpec: parsed.visual_spec,
    selfCheck: parsed.self_check,
    measurables: parsed.measurables,
    shell: parsed.shell,
    header: parsed.header,
    typeTreatment: parsed.type_treatment,
    mobile: parsed.mobile,
    motion: parsed.motion,
    composition: parsed.composition,
    compositionRationale: parsed.composition_rationale,
    rationale: parsed.rationale || '',
    designBrief: parsed.design_brief || '',
    colorScheme: parsed.color_scheme || null,
    brief,
    reply: result,
  }
}
