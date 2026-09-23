/**
 * Phase 0+1: the Art Director (#221). One decision: hero copy, archetype,
 * chassis, the full preset.ts and the visual spec. Replaces the historical
 * Director + spec-critic gate + Token Designer trio.
 *
 * The phase writes the preset, generates the orchestrator-owned files from
 * the chosen chassis, runs codegen (asking the Art Director once more on a
 * failure), and leaves the settled result and its parsed declarations on
 * `state.ad`.
 */
import { writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { CHASSIS_CATALOG } from '../../elements/chassis/index.js'
import { runArtDirector } from '../agents/art-director.js'
import { writeFiles, restore } from '../utils/file-manager.js'
import { formatGeneratedFile } from '../utils/build-validator.js'
import { noteRetry } from '../utils/cost-ledger.js'
import {
  buildGoogleFontsUrl,
  renderRootTemplate,
  renderChassisPresetFile,
  formatChassisCatalogForPrompt,
  formatChassisSelectionForPrompt,
} from '../utils/chassis.js'
import { formatSemanticContractForArtDirector } from '../utils/semantic-contract.js'
import { loadPrompt } from '../utils/prompt-loader.js'
import { STEP_BUDGETS } from '../utils/budgets.js'
import { runDate } from '../utils/run-date.js'
import {
  parseCompositionBlock,
  parseHeaderBlock,
  parseMobileBlock,
  parseTypeTreatmentBlock,
  parseMotionBlock,
} from '../utils/spec-blocks.js'
import { renderBrandLockupFile } from '../utils/brand-lockup.js'
import { renderSiteCalloutFile, SITE_CALLOUT_OWNER } from '../utils/site-callout.js'
import { renderMaterialFile } from '../utils/material.js'
import { renderWhitePaperFile } from '../utils/white-paper.js'
import { formatTypeTreatment } from '../utils/type-grammar.js'
import { formatMotion } from '../utils/motion-grammar.js'
import { formatTuple } from '../utils/composition-grammar.js'
import { countArchivedDesigns } from '../utils/archive-count.js'
import { archiveLinkInks } from '../utils/archive-link-ink.js'

/**
 * Render the Creative Weights risk sentence for the Art Director prompt.
 * Four distinct buckets (3-4 / 5-6 / 7-8 / 9-10) so risk is a real dial —
 * previously only 3 buckets existed and the >=7 sentence ("BOLD,
 * EXPERIMENTAL") fired for every risk value from 7 through 10, including
 * the constant risk=8 default that ran every day before WEIGHT_RISK
 * started varying by date.
 *
 * risk >= 9 references the Max-Risk License in art-director.md — the one
 * day the Art Director may deliberately break a single named anti-pattern
 * from the chosen lane, or land one composition axis on a value the
 * Composition Mandate soft-forbade. (Not a custom chassis: an unrecognized
 * CHASSIS_ID is silently replaced with CHASSIS_CATALOG[0], so that
 * deviation would never survive the run — the license targets levers that
 * actually do. Composition itself is no longer a hard-validated fixed set
 * the way it was when this comment described an 8-name ARCHETYPE
 * whitelist — every axis VALUE is still validated against its own fixed
 * vocabulary, but the tuple of values is open, so "invent a value" was
 * never the risk this license needed to cover in the first place.)
 *
 * @param {number} risk
 * @returns {string}
 */
export function describeRiskTier(risk) {
  if (risk >= 9) {
    return 'MAXIMUM RISK today. You may invoke the Max-Risk License below (break exactly ONE named anti-pattern from the lane, or land one composition axis on a soft-forbidden value) if the hero phrase genuinely demands it. Using it is optional — a strong, fully-compliant execution is still a valid MAXIMUM RISK day. Do not hedge: whatever you choose, commit harder than a normal day would.'
  }
  if (risk >= 7) {
    return 'BOLD today. Push for a committed gesture — fuller color saturation, a more aggressive archetype commitment, less hedging toward the safe middle.'
  }
  if (risk >= 5) {
    return 'Balanced. Mix proven patterns with one deliberate point of risk — not maximum safety, not maximum novelty.'
  }
  return 'SAFE, POLISHED today. Proven patterns, minimal deviation from what has worked before.'
}

/**
 * Run `pnpm panda codegen` to regenerate styled-system from the new preset.
 * @param {{ root: string }} options repo root to run in
 * @returns {{ success: boolean, error?: string }}
 */
function validateCodegen({ root }) {
  console.log('  running pnpm panda codegen...')
  const result = spawnSync('pnpm', ['panda', 'codegen'], {
    cwd: root,
    encoding: 'utf8',
    timeout: STEP_BUDGETS.codegenMs,
  })

  if (result.status === 0) {
    console.log('  codegen succeeded')
    return { success: true }
  }

  const combined = (result.stderr ?? '') + (result.stdout ?? '')
  const error = combined.slice(-3000)
  console.log('  codegen failed')
  console.log('  --- last 500 chars ---')
  console.log(combined.slice(-500))
  console.log('  ---')
  return { success: false, error }
}

/**
 * Repetition feedback from the previous build (Task 6). Deterministic and
 * free, so it runs every day whether or not an owner rating exists.
 * Computed rather than read back from uniqueness.json, which only exists
 * for builds made after the index shipped.
 * @param {import('./run-state.js').RunState} state
 * @returns {Promise<string>}
 */
async function readUniquenessBlock(state) {
  const { root, signals } = state
  let uniquenessBlock = ''
  try {
    const { readUniquenessHistory } = await import('../utils/read-uniqueness-history.js')
    const { computeUniqueness, formatUniquenessForPrompt } = await import(
      '../utils/uniqueness-index.js'
    )
    const todayStr = runDate(signals)
    const [previous, ...before] = await readUniquenessHistory({
      root,
      limit: 8,
      before: todayStr,
    })
    if (previous) {
      uniquenessBlock = formatUniquenessForPrompt(computeUniqueness(previous, before))
      if (uniquenessBlock) console.log(`  repetition check: scored ${previous.date}`)
    }
  } catch (err) {
    console.warn(`  uniqueness feedback skipped (non-blocking): ${err.message}`)
  }
  return uniquenessBlock
}

/**
 * Art Director system prompt: art-director.md + brand register +
 * typography + color. Trim to brand+color+typography per spec to keep
 * assembled prompt <= ~50KB (iter-2 failed at 60KB).
 * @param {import('./run-state.js').RunState} state
 * @returns {Promise<string>}
 */
async function loadArtDirectorSystemPrompt(state) {
  const { brandRegisterDeclaration, refTypography, refColor } = state.prompts
  const artDirectorPromptRaw = await loadPrompt('art-director.md', { root: state.root })
  // The chassis-selection numbers are generated from the catalog at
  // assembly time.
  if (!artDirectorPromptRaw.includes('{{CHASSIS_SELECTION_FACTS}}')) {
    throw new Error('art-director.md is missing its {{CHASSIS_SELECTION_FACTS}} placeholder')
  }
  if (!artDirectorPromptRaw.includes('{{SEMANTIC_COLOR_CONTRACT}}')) {
    throw new Error('art-director.md is missing its {{SEMANTIC_COLOR_CONTRACT}} placeholder')
  }
  return `${artDirectorPromptRaw
    .replace('{{CHASSIS_SELECTION_FACTS}}', formatChassisSelectionForPrompt(CHASSIS_CATALOG))
    .replace(
      '{{SEMANTIC_COLOR_CONTRACT}}',
      formatSemanticContractForArtDirector()
    )}${brandRegisterDeclaration}\n\n${refTypography}\n\n${refColor}`
}

/**
 * Everything the Art Director is asked with, once. The asks differ only in
 * why they are made and what they were told about the last one, which is
 * what the returned function takes.
 * @param {import('./run-state.js').RunState} state
 * @returns {Promise<(extra: object) => Promise<object>>}
 */
async function prepareArtDirector(state) {
  const { root, signals, contentSummary, boundaryId, weights } = state
  const { brandContract } = state.prompts
  const {
    recentBriefs,
    recentRatings,
    references,
    tasteMemoryBlock,
    voiceBlock,
    mobileLessonBlock,
    mandate,
  } = state.inputs
  const {
    color: colorMandateSection,
    shell: shellMandateSection,
    paletteFormula: paletteFormulaMandateSection,
    heroSource: heroSourceMandateSection,
    composition: compositionMandateSection,
    chassis: chassisMandateSection,
    typeTreatment: typeTreatmentMandateSection,
    motion: motionMandateSection,
  } = mandate

  const uniquenessBlock = await readUniquenessBlock(state)
  const chassisCatalogBlock = formatChassisCatalogForPrompt(CHASSIS_CATALOG)
  const weightsBlock = `Signals: ${weights.signals}/10 | Inspiration: ${weights.inspiration}/10 | Ratings: ${weights.ratings}/10 | Risk: ${weights.risk}/10\n\n${describeRiskTier(weights.risk)}`
  const artDirectorSystemPrompt = await loadArtDirectorSystemPrompt(state)

  return (extra) =>
    runArtDirector({
      boundaryId,
      signals,
      contentSummary,
      chassisCatalog: CHASSIS_CATALOG,
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
      failureDumpPath: path.join(root, 'signals', 'art-director-last-failed.txt'),
      systemPrompt: artDirectorSystemPrompt,
      ...extra,
    })
}

/**
 * The first ask, and one retry with the reason when the reply was rejected.
 * @param {(extra: object) => Promise<object>} askArtDirector
 * @returns {Promise<object>}
 */
async function askWithRetry(askArtDirector) {
  try {
    return await askArtDirector({ purpose: 'first' })
  } catch (firstErr) {
    if (firstErr.transport) {
      // A dead model (no credits, an outage) answers the retry the same way
      // it answered the first call. Twenty-six August nights spent their
      // retry on exactly that and reported it as a missing block (#432).
      console.error(`  Art Director failed: ${firstErr.message}`)
      throw new Error(`Art Director failed: no response from the model — ${firstErr.message}`)
    }
    console.warn(`  Art Director failed (${firstErr.message}) — retrying once with error context`)
    noteRetry()
    try {
      return await askArtDirector({
        purpose: 'retry',
        retryContext: `## Previous attempt was rejected\n\nYour previous response failed validation: ${firstErr.message}\nEmit ALL required blocks with exact delimiters and exact field formats this time.`,
      })
    } catch (err) {
      console.error(`  Art Director failed after retry: ${err.message}`)
      throw new Error(`Art Director failed after retry: ${err.message}`)
    }
  }
}

/**
 * The chassis the Art Director picked, or the catalog's first when it named
 * one that does not exist.
 * @param {string} chassisId
 */
function resolveChassis(chassisId) {
  const chosen = CHASSIS_CATALOG.find((c) => c.id === chassisId)
  if (chosen) return chosen
  console.warn(
    `  ⚠ Art Director picked unknown chassis "${chassisId}" — falling back to "${CHASSIS_CATALOG[0].id}"`
  )
  return CHASSIS_CATALOG[0]
}

/**
 * Log the first answer and record it in the trace. The composition, header
 * and phone declarations are parsed again after any codegen retry; these
 * early values only back the log lines and this trace step.
 * @param {import('./run-state.js').RunState} state
 * @param {object} artDirectorResult
 * @param {object} chosenChassis
 * @param {number} t0Director
 */
function traceFirstAnswer(state, artDirectorResult, chosenChassis, t0Director) {
  const chosenArchetype = artDirectorResult.archetype
  const chosenComposition = parseCompositionBlock(artDirectorResult.composition)
  const mobileDecl = parseMobileBlock(artDirectorResult.mobile)
  const visualSpec = artDirectorResult.visualSpec
  console.log(
    `  hero: "${artDirectorResult.heroCopy.slice(0, 60)}${artDirectorResult.heroCopy.length > 60 ? '...' : ''}"`
  )
  console.log(
    `  composition: ${formatTuple(chosenComposition).replace(/\n/g, ' | ')} | chassis: ${chosenChassis.id}`
  )
  if (chosenArchetype) console.log(`  archetype (descriptive, unvalidated): ${chosenArchetype}`)
  console.log(`  visual spec: ${(visualSpec.length / 1024).toFixed(0)}KB`)

  state.trace.addStep({
    name: 'art-director',
    phase: 1,
    input: { compositionMandate: state.inputs.mandate.composition.slice(0, 500) },
    output: {
      hero_copy: artDirectorResult.heroCopy.slice(0, 200),
      archetype: chosenArchetype || 'unknown',
      composition: chosenComposition,
      mobile: mobileDecl,
      chassisId: chosenChassis?.id || 'unknown',
      specLength: visualSpec.length,
      specPreview: visualSpec.slice(0, 500),
      selfCheck: artDirectorResult.selfCheck.slice(0, 300),
    },
    durationMs: Date.now() - t0Director,
  })
}

/**
 * Write one orchestrator-owned file, format it and record the path.
 * @param {import('./run-state.js').RunState} state
 * @param {string} relPath
 * @param {string} src
 */
async function writeGenerated(state, relPath, src) {
  await writeFile(path.join(state.root, relPath), src, 'utf8')
  formatGeneratedFile(relPath, { root: state.root })
  state.writtenPaths.add(relPath)
}

/**
 * The orchestrator generates the chassis preset (fonts + fontSizes) and
 * __root.tsx (Google Fonts URL substituted into the frozen template), plus
 * the lockup, the material library, the callout and the white paper. These
 * files are NEVER written by an agent.
 * @param {import('./run-state.js').RunState} state
 * @param {object} artDirectorResult
 * @param {object} chosenChassis
 */
async function writeChassisFiles(state, artDirectorResult, chosenChassis) {
  const { root, signals } = state
  try {
    const chassisPresetSrc = renderChassisPresetFile(chosenChassis)
    const chassisPresetPath = path.join(root, 'elements/chassis-preset.ts')
    await writeFile(chassisPresetPath, chassisPresetSrc, 'utf8')
    state.writtenPaths.add('elements/chassis-preset.ts')
    console.log(`  [chassis] wrote chassis-preset.ts (${chosenChassis.id})`)

    const { buildOgMetaEntries } = await import('../utils/og-meta.js')
    const ogMeta = buildOgMetaEntries({
      date: runDate(signals),
      heroCopy: artDirectorResult.heroCopy,
      designBrief: artDirectorResult.designBrief,
    })
    // The archive link's ink, chosen against tonight's bg and bgAlt now
    // that the preset exists (#566).
    const archiveInks = archiveLinkInks(artDirectorResult.presetTs)
    const rootSrc = renderRootTemplate(
      buildGoogleFontsUrl(chosenChassis),
      ogMeta,
      countArchivedDesigns(path.join(root, 'archive')),
      archiveInks.root.token
    )
    await writeGenerated(state, 'app/routes/__root.tsx', rootSrc)
    console.log(`  [chassis] wrote __root.tsx from template`)

    // The brand lockup, same ownership rule as __root.tsx: generated from a
    // frozen template every run, never authored by an agent. The engineer
    // places it and may tint it; it may not draw the mark (#254).
    const lockupSrc = renderBrandLockupFile(chosenChassis, {
      wordmarkWeight: parseHeaderBlock(artDirectorResult.header).wordmark_weight,
    })
    await writeGenerated(state, 'app/components/BrandLockup.tsx', lockupSrc)
    console.log(`  [chassis] wrote BrandLockup.tsx from template`)

    // The material library (#505), on the same terms: the engineer places
    // <Ground> where the SHELL declaration asks for one and never draws a
    // material itself.
    await writeGenerated(state, 'app/components/Material.tsx', renderMaterialFile())
    console.log(`  [chassis] wrote Material.tsx from template`)

    // The home page callout (#532), same ownership again. The run's date
    // picks its line and the count feeds its archive link, so neither
    // moves on a codegen retry. The link's ink follows the preset, so the
    // retry below writes this file again (#566).
    await writeGenerated(
      state,
      SITE_CALLOUT_OWNER,
      renderSiteCalloutFile({
        date: runDate(signals),
        archiveCount: countArchivedDesigns(path.join(root, 'archive')),
        archiveLinkInk: archiveInks.callout.token,
      })
    )
    console.log(`  [chassis] wrote SiteCallout.tsx from template`)

    // The white paper's fixed page (#533), on the same terms. It takes
    // nothing from the chassis or the Art Director, so the codegen retry
    // below has no reason to write it again.
    await writeGenerated(state, 'app/components/WhitePaper.tsx', renderWhitePaperFile())
    console.log(`  [chassis] wrote WhitePaper.tsx from template`)
  } catch (err) {
    throw new Error(`Chassis file generation failed: ${err.message}`)
  }
}

/**
 * Write today's brief.md so the archive has a human-readable artifact
 * (replaces the old signals/today.brief.md from interpret-signals.js).
 * @param {import('./run-state.js').RunState} state
 * @param {object} artDirectorResult
 */
async function writeBriefArtifact(state, artDirectorResult) {
  try {
    const briefArtifactPath = path.join(state.root, 'signals', 'today.brief.md')
    await writeFile(
      briefArtifactPath,
      `# Signals Brief — ${state.today}\n\n${artDirectorResult.brief}\n`,
      'utf8'
    )
  } catch (err) {
    console.warn(`  brief artifact write failed (non-blocking): ${err.message}`)
  }
}

/**
 * Write one generated file again after the codegen retry, formatted.
 * @param {string} root
 * @param {string} relPath
 * @param {string} src
 */
async function rewriteGenerated(root, relPath, src) {
  await writeFile(path.join(root, relPath), src, 'utf8')
  formatGeneratedFile(relPath, { root })
}

/**
 * The codegen retry re-ran the Art Director, so heroCopy/designBrief may
 * have changed since __root.tsx was first written. Regenerate it so the
 * og:title/og:description reflect the settled result, not the stale one,
 * and the lockup, material and callout with it. Non-blocking.
 * @param {import('./run-state.js').RunState} state
 * @param {object} artDirectorResult
 * @param {object} chosenChassis
 */
async function refreshGeneratedAfterRetry(state, artDirectorResult, chosenChassis) {
  const { root, signals } = state
  try {
    const { buildOgMetaEntries } = await import('../utils/og-meta.js')
    const retryOgMeta = buildOgMetaEntries({
      date: runDate(signals),
      heroCopy: artDirectorResult.heroCopy,
      designBrief: artDirectorResult.designBrief,
    })
    const retryRootSrc = renderRootTemplate(
      buildGoogleFontsUrl(chosenChassis),
      retryOgMeta,
      countArchivedDesigns(path.join(root, 'archive')),
      archiveLinkInks(artDirectorResult.presetTs).root.token
    )
    await rewriteGenerated(root, 'app/routes/__root.tsx', retryRootSrc)
    console.log('  [chassis] regenerated __root.tsx after codegen retry (og meta refreshed)')
    // The retry may have moved the chassis or the declared wordmark
    // weight, and both are baked into the lockup.
    const headerDecl = parseHeaderBlock(artDirectorResult.header)
    await rewriteGenerated(
      root,
      'app/components/BrandLockup.tsx',
      renderBrandLockupFile(chosenChassis, { wordmarkWeight: headerDecl.wordmark_weight })
    )
    console.log('  [chassis] regenerated BrandLockup.tsx after codegen retry')
    await rewriteGenerated(root, 'app/components/Material.tsx', renderMaterialFile())
    console.log('  [chassis] regenerated Material.tsx after codegen retry')
    // The callout's archive link is set in a token chosen against the
    // preset's bgAlt, and the retry brought a new preset (#566).
    await rewriteGenerated(
      root,
      SITE_CALLOUT_OWNER,
      renderSiteCalloutFile({
        date: runDate(signals),
        archiveCount: countArchivedDesigns(path.join(root, 'archive')),
        archiveLinkInk: archiveLinkInks(artDirectorResult.presetTs).callout.token,
      })
    )
    console.log('  [chassis] regenerated SiteCallout.tsx after codegen retry')
  } catch (rootErr) {
    console.warn(
      `  __root.tsx og-meta refresh after retry failed (non-blocking): ${rootErr.message}`
    )
  }
}

/**
 * Codegen on the Art Director's preset.ts. On a failure the preset is put
 * back, the Art Director is asked once more with the error, and codegen
 * runs again; a second failure ends the run.
 * @param {import('./run-state.js').RunState} state
 * @param {(extra: object) => Promise<object>} askArtDirector
 * @param {object} artDirectorResult
 * @param {object} chosenChassis
 * @returns {Promise<object>} the settled result
 */
async function settleCodegen(state, askArtDirector, artDirectorResult, chosenChassis) {
  const { root } = state
  const codegenResult = validateCodegen({ root })
  if (codegenResult.success) return artDirectorResult

  console.log('  codegen failed — retrying Art Director with error context...')
  noteRetry()
  // Restore preset.ts before retry
  const presetBackup = new Map()
  for (const [k, v] of state.originalBackup.entries()) {
    if (k === 'elements/preset.ts') presetBackup.set(k, v)
  }
  await restore(presetBackup, { root })
  let settled
  try {
    // Re-invoke Art Director with codegen error appended to context.
    // The full Director re-run is expensive but rare — codegen failures
    // are uncommon now that the Art Director sees PandaCSS rules.
    settled = await askArtDirector({
      purpose: 'retry',
      retryContext: `## Previous attempt failed codegen\n\n${codegenResult.error?.slice(0, 1500) || ''}`,
    })
    const retryPresetFile = { path: 'elements/preset.ts', content: settled.presetTs }
    for (const p of await writeFiles([retryPresetFile], { root, backup: state.originalBackup }))
      state.writtenPaths.add(p)
    await refreshGeneratedAfterRetry(state, settled, chosenChassis)
  } catch (err) {
    throw new Error(`Art Director codegen retry failed: ${err.message}`)
  }
  const retryCodegen = validateCodegen({ root })
  if (!retryCodegen.success) {
    throw new Error(`Codegen failed after Art Director retry: ${retryCodegen.error?.slice(0, 500)}`)
  }
  return settled
}

/**
 * Parse shell + measurables + composition from the final settled
 * artDirectorResult (computed after any codegen retry, so they always
 * reflect the live result). shellDecl (which carries ground_strategy — see
 * SHELL block) and chosenComposition are also archive artifacts
 * (shell.json, composition.json).
 * @param {object} artDirectorResult
 */
async function parseDeclarations(artDirectorResult) {
  const { parseShellBlock, parseMeasurablesBlock } = await import('../utils/spec-blocks.js')
  return {
    shellDecl: parseShellBlock(artDirectorResult.shell),
    headerDecl: parseHeaderBlock(artDirectorResult.header),
    typeDecl: parseTypeTreatmentBlock(artDirectorResult.typeTreatment),
    mobileDecl: parseMobileBlock(artDirectorResult.mobile),
    motionDecl: parseMotionBlock(artDirectorResult.motion),
    measurablesDecl: parseMeasurablesBlock(artDirectorResult.measurables),
    chosenComposition: parseCompositionBlock(artDirectorResult.composition),
  }
}

/**
 * The settled declarations, one line each.
 * @param {object} artDirectorResult
 * @param {Awaited<ReturnType<typeof parseDeclarations>>} decl
 */
function logDeclarations(artDirectorResult, decl) {
  const { headerDecl, typeDecl, motionDecl, shellDecl, measurablesDecl, chosenComposition } = decl
  const { mobileDecl } = decl
  console.log(
    `  header: ${headerDecl.placement} @ ${headerDecl.height_px}px | mark=${headerDecl.mark_px}px | wordmark=${headerDecl.wordmark_step}/${headerDecl.wordmark_weight} | role=${headerDecl.role_line} | nav=${headerDecl.nav} (${headerDecl.nav_step}, ${headerDecl.nav_case})`
  )
  console.log(`  type: ${formatTypeTreatment(typeDecl).replace(/\n/g, ' | ')}`)
  console.log(`  motion: ${formatMotion(motionDecl).replace(/\n/g, ' | ')}`)
  console.log(
    `  shell: footer=${shellDecl.footer} | lockup=${shellDecl.brand_lockup} (${shellDecl.brand_color_mode}) | ground=${shellDecl.ground_strategy}`
  )
  console.log(
    `  measurables: canvas>=${measurablesDecl.canvas_utilization_min}% color>=${measurablesDecl.color_coverage_min}% hero=${measurablesDecl.hero_scale}`
  )
  console.log(`  composition: ${formatTuple(chosenComposition).replace(/\n/g, ' | ')}`)
  console.log(
    `  composition rationale: ${(artDirectorResult.compositionRationale || '').slice(0, 200)}`
  )
  console.log(
    `  mobile: collapse=${chosenComposition.collapse} | hero_step_360=${mobileDecl.hero_step_360} | order=${mobileDecl.order} | carrier=${(mobileDecl.carrier || '').slice(0, 120)}`
  )
  console.log(`  hero-source: ${artDirectorResult.heroSource || '(none declared)'}`)
}

/**
 * Color-scheme monitoring (warnings only).
 * @param {object} artDirectorResult
 * @param {object} colorMandate
 */
async function warnOnColorScheme(artDirectorResult, colorMandate) {
  if (!artDirectorResult.colorScheme || artDirectorResult.colorScheme.__parse_error) return
  const { detectCoffeeShopPalette, validateSchemeAgainstPreset, validateSchemeAgainstMandate } =
    await import('../utils/color-validation.js')
  const consistency = validateSchemeAgainstPreset(
    artDirectorResult.colorScheme,
    artDirectorResult.presetTs
  )
  for (const w of consistency.warnings) console.warn(`[color-scheme] ${w}`)
  const rut = detectCoffeeShopPalette(artDirectorResult.colorScheme, artDirectorResult.presetTs)
  for (const w of rut.warnings) console.warn(`[color-scheme] ${w}`)
  const mandateCheck = validateSchemeAgainstMandate(artDirectorResult.colorScheme, colorMandate)
  for (const w of mandateCheck.warnings) console.warn(`[color-scheme] ${w}`)
}

/**
 * Phase 0+1. Leaves `state.ad`: the settled `result`, `chosenArchetype`,
 * `chosenChassis`, `visualSpec`, the parsed declarations and `tokenResult`.
 * @param {import('./run-state.js').RunState} state
 */
export async function runArtDirectorPhase(state) {
  const { root } = state
  console.log('\n[phase-0+1] Art Director')

  const askArtDirector = await prepareArtDirector(state)
  const t0Director = Date.now()
  const firstResult = await askWithRetry(askArtDirector)

  const chosenArchetype = firstResult.archetype
  const chosenChassis = resolveChassis(firstResult.chassisId)
  const visualSpec = firstResult.visualSpec
  traceFirstAnswer(state, firstResult, chosenChassis, t0Director)

  // Write the Art Director's preset.ts to disk
  const presetFile = { path: 'elements/preset.ts', content: firstResult.presetTs }
  for (const p of await writeFiles([presetFile], { root, backup: state.originalBackup }))
    state.writtenPaths.add(p)

  await writeChassisFiles(state, firstResult, chosenChassis)
  await writeBriefArtifact(state, firstResult)

  const artDirectorResult = await settleCodegen(state, askArtDirector, firstResult, chosenChassis)
  const decl = await parseDeclarations(artDirectorResult)
  logDeclarations(artDirectorResult, decl)
  await warnOnColorScheme(artDirectorResult, state.inputs.colorMandate)

  state.ad = {
    result: artDirectorResult,
    chosenArchetype,
    chosenChassis,
    visualSpec,
    ...decl,
    // Synthetic tokenResult for the rest of the orchestrator (Phase 2 archive)
    tokenResult: {
      files: [presetFile],
      rationale: artDirectorResult.rationale,
      design_brief: artDirectorResult.designBrief,
      color_scheme: artDirectorResult.colorScheme,
    },
  }
}
