import path from 'node:path'
import { computeColorMandate, formatMandateForPrompt } from '../utils/color-mandate.js'
import { computeShellMandate, formatShellMandateForPrompt } from '../utils/shell-mandate.js'
import {
  computePaletteFormulaMandate,
  formatPaletteFormulaMandateForPrompt,
} from '../utils/palette-formula-mandate.js'
import {
  computeHeroSourceMandate,
  formatHeroSourceMandateForPrompt,
} from '../utils/hero-source-mandate.js'
import {
  computeCompositionMandate,
  formatCompositionMandateForPrompt,
} from '../utils/composition-mandate.js'
import { computeChassisMandate, formatChassisMandateForPrompt } from '../utils/chassis-mandate.js'
import {
  computeTypeTreatmentMandate,
  formatTypeTreatmentMandateForPrompt,
} from '../utils/type-treatment-mandate.js'
import { computeMotionMandate, formatMotionMandateForPrompt } from '../utils/motion-mandate.js'
import { HUE_FORBIDDEN_ZONE_RADIUS } from '../utils/hue-thresholds.js'

/**
 * The variance mandates, computed once per run.
 *
 * Deterministic and free — every one is a read over recent builds, no
 * model involved — and every one is advisory: a mandate that cannot be
 * computed degrades to an open field rather than stopping the run. That
 * "try, warn, carry on" shape was written out six times inline in
 * runAgentSwarm (#221); it is one loop here.
 *
 * The colour mandate is the odd one out. Its object is needed downstream
 * as data (validateSchemeAgainstMandate checks the Art Director's chosen
 * hue against it), so it is returned as well as formatted, and it has a
 * real permissive default rather than an empty section.
 */

/** A mandate that could not be computed: everything open. */
export const OPEN_COLOR_MANDATE = {
  targetHueRange: [0, 360],
  forbiddenHues: [],
  recentPrimaryHues: [],
  rationale: 'Mandate computation unavailable; palette is open.',
}

/**
 * @param {{ root: string, signals: object, date: string }} ctx
 * @returns {{ colorMandate: object, sections: { color: string, shell: string, paletteFormula: string, heroSource: string, composition: string, chassis: string, typeTreatment: string, motion: string } }}
 */
export function computeMandateSections({ root, signals, date }) {
  const archiveDir = path.join(root, 'archive')

  let colorMandate
  try {
    colorMandate = computeColorMandate({
      archiveDir,
      signals,
      lookbackDays: 7,
      zoneRadius: HUE_FORBIDDEN_ZONE_RADIUS,
    })
  } catch (err) {
    console.warn(`[color-mandate] computation failed, using permissive default: ${err.message}`)
    colorMandate = OPEN_COLOR_MANDATE
  }
  console.log(
    `  color-mandate: target ${colorMandate.targetHueRange[0]}-${colorMandate.targetHueRange[1]}°, ${colorMandate.forbiddenHues.length} forbidden zone(s)`
  )

  // Each formatter returns '' when there is no history to react to (old
  // archives predate these fields), so the section is omitted from the
  // prompt rather than showing empty guidance.
  const advisory = {
    shell: () => formatShellMandateForPrompt(computeShellMandate({ archiveDir, lookbackDays: 7 })),
    paletteFormula: () =>
      formatPaletteFormulaMandateForPrompt(
        computePaletteFormulaMandate({ archiveDir, lookbackDays: 7 })
      ),
    heroSource: () =>
      formatHeroSourceMandateForPrompt(computeHeroSourceMandate({ archiveDir, lookbackDays: 7 })),
    composition: () =>
      formatCompositionMandateForPrompt(
        computeCompositionMandate({ archiveDir, date, lookbackDays: 7 })
      ),
    // Chassis recency (#253) reads the chassis field record.json already
    // carries at the date level, so nothing new is persisted.
    chassis: () =>
      formatChassisMandateForPrompt(computeChassisMandate({ archiveDir, lookbackDays: 14 })),
    // How the type was set on recent nights (#502), per field.
    typeTreatment: () =>
      formatTypeTreatmentMandateForPrompt(
        computeTypeTreatmentMandate({ archiveDir, lookbackDays: 7 })
      ),
    // How the hero arrived on recent nights (#506), keyed on the entrance.
    motion: () =>
      formatMotionMandateForPrompt(computeMotionMandate({ archiveDir, lookbackDays: 7 })),
  }

  const sections = { color: formatMandateForPrompt(colorMandate) }
  for (const [key, compute] of Object.entries(advisory)) {
    try {
      sections[key] = compute()
    } catch (err) {
      console.warn(`[${LOG_NAMES[key]}] computation failed (non-blocking): ${err.message}`)
      sections[key] = ''
    }
  }

  return { colorMandate, sections }
}

/** The names the log lines have always used. */
const LOG_NAMES = {
  shell: 'shell-mandate',
  paletteFormula: 'palette-formula-mandate',
  heroSource: 'hero-source-mandate',
  composition: 'composition-mandate',
  chassis: 'chassis-mandate',
  typeTreatment: 'type-treatment-mandate',
  motion: 'motion-mandate',
}
