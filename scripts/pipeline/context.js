/**
 * What the swarm reads before any agent is asked (#221): the prompts and
 * design references, the pre-run backup, the archive's recent briefs and
 * ratings, the owner's taste and voice, the mobile lessons, today's
 * references and the variance mandates. Everything lands on `state.prompts`
 * and `state.inputs`; the backup lands on `state.originalBackup`.
 */
import { readFile } from 'node:fs/promises'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { MUTABLE_FILES } from '../utils/site-context.js'
import { backup } from '../utils/file-manager.js'
import { loadPrompt } from '../utils/prompt-loader.js'
import { formatSemanticContractForPrompt } from '../utils/semantic-contract.js'
import { formatPatternPropsForPrompt, readPatternProps } from '../utils/pattern-props.js'
import { computeMandateSections } from './mandates.js'

/**
 * Read all prompts and design references.
 * Design references are vendored from pbakaus/impeccable (Apache 2.0) — see
 * scripts/prompts/impeccable/README.md. They replace the previous library-*.md
 * files which authored generic guidance; impeccable provides anti-pattern-aware,
 * OKLCH-native, register-aware design knowledge tuned to fight AI design slop.
 * Every prompt file comes through loadPrompt, which fills the phone
 * width; a bare readFile here would send `{{NARROW_PX}}` to a model.
 * @param {string} root
 */
async function loadPrompts(root) {
  const [
    screenshotCriticPromptRaw,
    designSystemRef,
    refBrand,
    refTypography,
    refColor,
    refSpatial,
    refCritique,
    brandContract,
  ] = await Promise.all([
    loadPrompt('screenshot-critic.md', { root }),
    loadPrompt('design-system-reference.md', { root }),
    loadPrompt('impeccable/reference/brand.md', { root }),
    loadPrompt('impeccable/reference/typography.md', { root }),
    loadPrompt('impeccable/reference/color-and-contrast.md', { root }),
    loadPrompt('impeccable/reference/spatial-design.md', { root }),
    loadPrompt('impeccable/reference/critique.md', { root }),
    loadPrompt('brand-contract.md', { root }),
  ])

  // Brand-register declaration. dougmar.ch is BRAND register — a personal
  // portfolio where design IS the product. Inject this into every design agent
  // so they apply brand-register conventions (expressive composition, committed
  // color strategy, typographic risk) rather than product-register reflexes
  // (dense dashboards, restrained palette, generic card grids).
  const brandRegisterDeclaration = `\n\n## Project Register: BRAND\n\nThis project is BRAND register — a personal portfolio where design IS the product. Apply brand-register conventions throughout. The detailed brand-register reference follows.\n\n${refBrand}`

  const screenshotCriticPrompt = `${screenshotCriticPromptRaw}\n\n## Design Critique Heuristics\n\n${refCritique}`

  // The semantic colour contract is generated from scripts/utils/semantic-contract.js
  // at assembly time and injected into all three prompts that document it, so the
  // list the agents read cannot drift from the list the validator enforces (#255).
  // react-engineer.md spent months telling the engineer to reach for `bg.side` and
  // `accent.glow`, names no preset has ever defined.
  if (!designSystemRef.includes('{{SEMANTIC_COLOR_CONTRACT}}')) {
    throw new Error(
      'design-system-reference.md is missing its {{SEMANTIC_COLOR_CONTRACT}} placeholder'
    )
  }

  // The pattern-prop list is generated from styled-system/patterns/*.d.ts at
  // assembly time, so the engineer prompt cannot list a prop a pattern doesn't
  // have — that's how `wrap` ended up on HStack, `align` on VStack, and `href`
  // on `<Box as="a">` in the run that failed issue #432.
  if (!designSystemRef.includes('{{PATTERN_PROPS}}')) {
    throw new Error('design-system-reference.md is missing its {{PATTERN_PROPS}} placeholder')
  }
  const designSystemReference = designSystemRef
    .replace('{{SEMANTIC_COLOR_CONTRACT}}', formatSemanticContractForPrompt())
    .replace('{{PATTERN_PROPS}}', formatPatternPropsForPrompt(readPatternProps(root)))

  return {
    screenshotCriticPrompt,
    designSystemReference,
    brandRegisterDeclaration,
    refTypography,
    refColor,
    refSpatial,
    refCritique,
    brandContract,
  }
}

/**
 * Recent archive briefs, for the Art Director's context.
 * @param {string} archiveDir
 * @returns {string}
 */
function readRecentBriefs(archiveDir) {
  let recentBriefs = ''
  try {
    const dirs = readdirSync(archiveDir)
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort()
      .reverse()
      .slice(0, 7)
    const recentDirs5 = dirs.slice(0, 5)
    for (const dir of recentDirs5) {
      const briefPath = path.join(archiveDir, dir, 'brief.md')
      if (existsSync(briefPath)) {
        recentBriefs += `\n### ${dir}\n${readFileSync(briefPath, 'utf8')}\n`
      }
    }
  } catch {}
  return recentBriefs
}

/**
 * The archive and owner inputs every design agent reads.
 * @param {string} root
 */
async function readHistory(root) {
  const archiveDir = path.join(root, 'archive')
  const recentBriefs = readRecentBriefs(archiveDir)

  // Recent ratings for taste feedback (new-schema GitHub-issue ratings)
  const { buildRecentRatingsBlock } = await import('../utils/ratings.js')
  const recentRatings = buildRecentRatingsBlock(path.join(root, 'archive'), { lookbackDays: 10 })

  // Owner-curated permanent taste memory (signals/taste.md) — unlike the
  // 10-build ratings window above, this is hand-maintained and all-time.
  // Fed to both the Art Director and the Mockup Designer.
  const { buildTasteMemoryBlock, buildVoiceBlock } = await import('../utils/taste-memory.js')
  const tasteMemoryBlock = buildTasteMemoryBlock(root)
  // The owner's voice (signals/voice.md, #504): first person, hand-written,
  // read the same way. Fed to the Art Director beside the taste block, so
  // the hero and deck lines have a register to match.
  const voiceBlock = buildVoiceBlock(root)

  // What the last several shipped nights' compositions actually became on
  // a phone — 360px surface-gate findings and critic phone notes, dated
  // and tagged with each night's tuple (#470). Fed to the Art Director so
  // it sees its own mobile track record before picking today's tuple,
  // rather than only the mockup designer and engineer seeing it via
  // lessonsBlock further down.
  const { buildMobileLessonBlock } = await import('../utils/lessons.js')
  const mobileLessonBlock = buildMobileLessonBlock(archiveDir)

  // Design references (collected by collect-references.js)
  const referencesPath = path.resolve(root, 'signals/today.references.md')
  let references = ''
  if (existsSync(referencesPath)) {
    references = await readFile(referencesPath, 'utf8')
    console.log(`  using references (${references.length} chars)`)
  }

  return {
    archiveDir,
    recentBriefs,
    recentRatings,
    tasteMemoryBlock,
    voiceBlock,
    mobileLessonBlock,
    references,
  }
}

/**
 * Load everything the agents are asked with, and back up the mutable files.
 * Throws when a prompt is missing a placeholder the assembly fills.
 * @param {import('./run-state.js').RunState} state
 */
export async function loadRunContext(state) {
  const { root, signals, brief, trace, today } = state
  state.prompts = await loadPrompts(root)

  // Backup all mutable files
  console.log('\n[backup] Backing up mutable files...')
  state.originalBackup = await backup(MUTABLE_FILES, { root })
  console.log(`  backed up ${state.originalBackup.size} files`)

  const history = await readHistory(root)

  // Trace: record signals and brief loaded
  trace.addStep({
    name: 'signals-loaded',
    phase: 0,
    input: { providersAvailable: Object.keys(signals).length },
    output: signals,
    durationMs: 0,
  })
  if (brief) {
    trace.addStep({
      name: 'brief-loaded',
      phase: 0,
      input: {},
      output: { brief: brief.slice(0, 500), charCount: brief.length },
      durationMs: 0,
    })
  }

  // The variance mandates: deterministic, free, advisory. Computed in one
  // place so the six "try, warn, carry on" blocks that sat here are one.
  const { colorMandate, sections: mandate } = computeMandateSections({
    root,
    signals,
    date: today,
  })
  state.inputs = { ...history, colorMandate, mandate }
}
