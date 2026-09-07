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
import { callClaudeCLI } from '../utils/claude-cli.js'
import { parseDelimiterResponse } from '../utils/delimiter-parser.js'
import {
  parseMeasurablesBlock,
  parseShellBlock,
  parseHeaderBlock,
  parseCompositionBlock,
  parseMobileBlock,
} from '../utils/spec-blocks.js'
import { isValidTuple } from '../utils/composition-grammar.js'
import { isValidHeader } from '../utils/header-grammar.js'
import { isValidMobile } from '../utils/mobile-grammar.js'
import { LOCKUP_IDS } from '../utils/brand-lockup.js'
import { modelFor } from '../utils/models.js'
import { budgetFor } from '../utils/budgets.js'

const BRAND_LOCKUP_IDS = new Set(LOCKUP_IDS)

/**
 * Assemble the user prompt for the Art Director call.
 * Pure function — no I/O — so unit tests can drive it directly.
 */
export function buildArtDirectorUserPrompt({
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
  brandContract,
  weightsBlock,
  tasteMemoryBlock,
  mobileLessonBlock,
  uniquenessBlock,
  retryContext,
}) {
  const sections = []
  sections.push(`## Today's Raw Signals\n\n\`\`\`yaml\n${formatSignalsAsYaml(signals)}\n\`\`\``)
  sections.push(`## Site Content (read-only — for hero phrase mining)\n\n${contentSummary}`)
  sections.push(`## Typography Chassis Catalog\n\n${chassisCatalogBlock}`)
  if (recentBriefs) sections.push(`## Recent Archive Briefs\n\n${recentBriefs}`)
  if (recentRatings) sections.push(`## User Design Ratings (learn from these)\n\n${recentRatings}`)
  if (references) sections.push(`## Design References\n\n${references}`)
  if (colorMandateSection) sections.push(colorMandateSection)
  if (shellMandateSection) sections.push(shellMandateSection)
  if (paletteFormulaMandateSection) sections.push(paletteFormulaMandateSection)
  if (heroSourceMandateSection) sections.push(heroSourceMandateSection)
  if (compositionMandateSection) sections.push(compositionMandateSection)
  if (chassisMandateSection) sections.push(chassisMandateSection)
  if (brandContract) sections.push(brandContract)
  if (weightsBlock) sections.push(`## Creative Weights\n\n${weightsBlock}`)
  if (tasteMemoryBlock) sections.push(tasteMemoryBlock)
  if (mobileLessonBlock) sections.push(mobileLessonBlock)
  if (uniquenessBlock) sections.push(uniquenessBlock)
  if (retryContext) sections.push(retryContext)
  return sections.join('\n\n---\n\n')
}

function formatSignalsAsYaml(signals) {
  return Object.entries(signals)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => (typeof v === 'string' ? `${k}: '${v}'` : `${k}: ${JSON.stringify(v)}`))
    .join('\n')
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
 */
export function validateArtDirectorResult(parsed) {
  if (!parsed.hero_copy || parsed.hero_copy.length < 3) {
    throw new Error('Art Director response missing or empty hero_copy (===HERO_COPY===)')
  }
  if (!parsed.composition) {
    throw new Error('Art Director response missing ===COMPOSITION===')
  }
  const composition = parseCompositionBlock(parsed.composition)
  const { valid, errors } = isValidTuple(composition)
  if (!valid) {
    throw new Error(`Art Director composition tuple is invalid: ${errors.join('; ')}`)
  }
  if (!parsed.composition_rationale || parsed.composition_rationale.length < 10) {
    throw new Error('Art Director response missing or too-short ===COMPOSITION_RATIONALE===')
  }
  if (!parsed.chassis_id) {
    throw new Error('Art Director response missing chassis_id (===CHASSIS_ID===)')
  }
  if (!parsed.visual_spec) {
    throw new Error('Art Director response missing ===VISUAL_SPEC===')
  }
  if (!parsed.self_check) {
    throw new Error('Art Director response missing ===SELF_CHECK===')
  }
  const presetFile = (parsed.files || []).find((f) => f.path === 'elements/preset.ts')
  if (!presetFile?.content) {
    throw new Error('Art Director response missing ===FILE:elements/preset.ts=== block')
  }
  if (!parsed.measurables) {
    throw new Error('Art Director response missing ===MEASURABLES===')
  }
  const measurables = parseMeasurablesBlock(parsed.measurables)
  if (measurables.canvas_utilization_min === null) {
    throw new Error('MEASURABLES block missing numeric canvas_utilization_min')
  }
  if (!parsed.shell) {
    throw new Error('Art Director response missing ===SHELL===')
  }
  const shell = parseShellBlock(parsed.shell)
  // `nav` is no longer a SHELL field — it moved to HEADER with the rest of
  // the header declaration (#254).
  for (const key of ['footer', 'brand_lockup', 'brand_color_mode']) {
    if (!shell[key]) throw new Error(`SHELL block missing ${key}`)
  }
  if (!['original', 'single-color'].includes(shell.brand_color_mode)) {
    throw new Error(
      `SHELL brand_color_mode must be "original" or "single-color", got "${shell.brand_color_mode}"`
    )
  }
  if (!BRAND_LOCKUP_IDS.has(shell.brand_lockup)) {
    console.warn(
      `  [AD] brand_lockup "${shell.brand_lockup}" is not a Brand Contract id — accepting (warn-only)`
    )
  }
  // HEADER is validated the way COMPOSITION is, and for the same reason: a
  // declaration nobody can check is a declaration the render can quietly
  // ignore. Three owner ratings running said the header was wrong and no
  // gate could have caught any of them (#254).
  if (!parsed.header) {
    throw new Error('Art Director response missing ===HEADER===')
  }
  const header = parseHeaderBlock(parsed.header)
  const headerCheck = isValidHeader(header, {
    shellPosture: composition.shell_posture,
    brandLockup: shell.brand_lockup,
  })
  if (!headerCheck.valid) {
    throw new Error(`Art Director HEADER block is invalid: ${headerCheck.errors.join('; ')}`)
  }
  if (!header.nav) {
    throw new Error('HEADER block missing nav')
  }
  // MOBILE is validated the way HEADER is (#452): the composition's
  // `collapse` axis names what the canvas becomes at 360, and this block says
  // what that means for today's page. A block that contradicts the axis is
  // rejected, not reconciled, the same as a placement that contradicts the
  // shell posture.
  if (!parsed.mobile) {
    throw new Error('Art Director response missing ===MOBILE===')
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
    throw new Error(`Art Director MOBILE block is invalid: ${mobileCheck.errors.join('; ')}`)
  }
}

/**
 * Run the Art Director phase.
 *
 * @param {{
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
 *   weightsBlock: string,
 *   tasteMemoryBlock: string,
 *   mobileLessonBlock?: string,
 *   uniquenessBlock?: string,
 *   retryContext?: string,
 *   systemPrompt: string,
 *   designReferenceImages?: Array<{ data: string, media_type: string, title?: string }>,
 * }} ctx
 * @returns {Promise<{ heroCopy: string, heroRationale: string, heroSource: string, archetype: string, chassisId: string, presetTs: string, visualSpec: string, selfCheck: string, rationale: string, designBrief: string, colorScheme: object|null, shell: string, header: string, mobile: string, composition: string, compositionRationale: string, brief: string }>}
 */
export async function runArtDirector(ctx) {
  const userPrompt = buildArtDirectorUserPrompt(ctx)

  // 20-minute total / 15-minute stall headroom. AD calls in production
  // have run 7:45 (run 1) and 8:55 (run 2) at 5–9 weight settings; a
  // higher-inspiration prompt with the export-name guard added pushed
  // run 3 past the original 10-minute hard cap. Match the shape of the
  // unified-designer config (30 min total / 25 min stall) one register
  // tighter — the AD prompt is smaller and shouldn't need that much.
  const result = await callClaudeCLI('art-director', ctx.systemPrompt, userPrompt, {
    ...budgetFor('art-director'),
    model: modelFor('art-director'),
  })

  let parsed
  try {
    parsed = parseDelimiterResponse(result)
  } catch (err) {
    throw new Error(`Art Director response unparseable: ${err.message}`)
  }

  try {
    validateArtDirectorResult(parsed)
  } catch (err) {
    const present = [
      'hero_copy',
      'composition',
      'composition_rationale',
      'chassis_id',
      'visual_spec',
      'self_check',
      'measurables',
      'shell',
      'header',
      'mobile',
    ].filter((k) => parsed[k])
    const absent = [
      'hero_copy',
      'composition',
      'composition_rationale',
      'chassis_id',
      'visual_spec',
      'self_check',
      'measurables',
      'shell',
      'header',
      'mobile',
    ].filter((k) => !parsed[k])
    console.error(
      `  [AD] validation failed — present: [${present.join(', ')}] absent: [${absent.join(', ')}]`
    )
    console.error(`  [AD] response head: ${result.slice(0, 300).replace(/\n/g, '↵')}`)
    if (ctx.failureDumpPath) {
      try {
        await writeFile(ctx.failureDumpPath, result, 'utf8')
      } catch {}
    }
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
    mobile: parsed.mobile,
    composition: parsed.composition,
    compositionRationale: parsed.composition_rationale,
    rationale: parsed.rationale || '',
    designBrief: parsed.design_brief || '',
    colorScheme: parsed.color_scheme || null,
    brief,
  }
}
