/**
 * The brand lockup contract, as code.
 *
 * The mark was rebuilt from scratch every night and kept shipping wrong: it
 * was dropped entirely on 2026-07-10, graded down as "a gray box" on
 * 2026-07-22, and shipped at 11px on 2026-08-30 against a mockup that had it
 * at 44px. Every one of those had a different proximate cause and the same
 * root cause — no component owned the lockup, so a model redrew it under a
 * fidelity prompt each night with nothing to check it against (#254).
 *
 * This module is the half of the fix that lives outside React:
 *
 *   LOCKUP_VARIANTS         the four Brand Contract ids, with the ramp step
 *                           each renders at and its permitted mark band
 *   renderBrandLockupFile   app/components/BrandLockup.tsx, written by the
 *                           orchestrator every run the same way __root.tsx is
 *   MARK_PATH_FINGERPRINTS  coordinates unique to the mark, so the validator
 *                           can tell when somebody pasted the paths again
 *
 * Kept out of chassis.js on purpose: that file is the type-ramp's, and the
 * only thing the lockup needs from a chassis is which display weights it
 * actually loads.
 *
 * @module
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATE_PATH = resolve(__dirname, '../templates/BrandLockup.tsx.template')

/**
 * Cap-height as a fraction of the em, averaged across the chassis catalog's
 * display faces. Nothing in CSS exposes a face's real cap-height, and the
 * spread across the ten catalog display faces is small enough (0.68–0.73)
 * that one constant beats a per-chassis table nobody can verify.
 */
export const CAP_RATIO = 0.7

/**
 * How many cap-heights tall the mark stands beside the wordmark. Derived
 * from the Brand Contract's own bands: `horizontal-md` wants a 32–48px mark
 * against a wordmark at the `lg` step, which on a 1rem/1.25 ramp is a 25px
 * face with a ~17.5px cap — 2.4 caps lands at 42px, mid-band.
 */
export const MARK_TO_CAP = 2.4

/** Mark height as a multiple of the lockup's own font-size. */
export const MARK_EM = Math.round(CAP_RATIO * MARK_TO_CAP * 1000) / 1000

/**
 * The four lockup ids from the Brand Contract.
 *
 * There were six until #503. `horizontal-sm` (20–28px) and `mark-only-sm`
 * (24–32px) were retired because two nightly builds shipped a 24px mark that
 * read as a speck at 1440; every remaining band floors at 32px, so the size
 * floor falls out of the catalogue rather than needing a separate rule.
 *
 * `step` is the ramp step the wordmark renders at, which is also what the
 * mark's height is derived from — pick the step and the mark follows, so the
 * lockup grows and shrinks with the day's chassis instead of against it.
 * `markMinPx`/`markMaxPx` are the contract's published bands. The component
 * bounds the STEP to keep the mark inside them, rather than bounding the mark:
 * clamping the mark alone would leave the wordmark at full ramp size beside a
 * mark cut down to fit, which on a 1.5-ratio chassis put an 81px "Doug March"
 * next to a 96px mark. See stepClamp below.
 */
export const LOCKUP_VARIANTS = {
  'mark-only-md': { orientation: 'mark', step: 'lg', markMinPx: 40, markMaxPx: 56 },
  'horizontal-md': { orientation: 'row', step: 'lg', markMinPx: 32, markMaxPx: 48 },
  'stacked-md': { orientation: 'column', step: 'lg', markMinPx: 40, markMaxPx: 56 },
  'stacked-lg': { orientation: 'column', step: '2xl', markMinPx: 64, markMaxPx: 96 },
}

/** The four ids, in contract order. @type {string[]} */
export const LOCKUP_IDS = Object.keys(LOCKUP_VARIANTS)

/**
 * The `font-size` a lockup variant is set at: its ramp step, bounded either
 * side so that a mark of MARK_EM lands inside the variant's published band.
 *
 * The Panda `token()` call resolves at extract time to the chassis ramp's CSS
 * variable, so the middle term follows the day's type and the two ends hold
 * the contract. Bounds are the band divided by MARK_EM.
 *
 * @param {string} id one of LOCKUP_IDS
 * @returns {string} a CSS clamp()
 */
export function stepClamp(id) {
  const v = LOCKUP_VARIANTS[id]
  if (!v) throw new Error(`unknown lockup variant: ${id}`)
  const px = (n) => `${Number((n / MARK_EM).toFixed(3))}px`
  return `clamp(${px(v.markMinPx)}, token(fontSizes.${v.step}), ${px(v.markMaxPx)})`
}

/**
 * Coordinate strings that appear in the mark's path data and nowhere else in
 * this codebase. The validator matches these against whitespace-collapsed
 * source, so a reformatted or re-indented paste is still caught.
 *
 * One from each of the three shapes an engineer has historically pasted: the
 * outer ring, the inner hairline circle, and the blue tail.
 */
export const MARK_PATH_FINGERPRINTS = ['29.8925 0.440186', '47.8611 29.3418', '68.9722 9.76277']

/**
 * The display weight the wordmark is set in.
 *
 * Two things constrain it. The chassis only loads the weights in its own
 * `weights` array, and asking for one it did not load gets a synthesized
 * bold that distorts the letterforms. And a display face's heaviest cut is
 * often a 900 black drawn for headlines, which reads as shouting at wordmark
 * size. So: the heaviest loaded weight at or below 700, falling back to the
 * lightest loaded weight when a face loads nothing that light.
 *
 * `declared` is the Art Director's `wordmark_weight` from the HEADER block.
 * It is a preference, not an override — the nearest loaded weight at or
 * below the ceiling wins, because a weight that isn't loaded doesn't render.
 *
 * @param {{ fonts: { display: { weights: number[] } } }} chassis
 * @param {number|null|undefined} [declared] the declared wordmark_weight
 * @returns {number}
 */
export function resolveWordmarkWeight(chassis, declared) {
  const weights = [...(chassis?.fonts?.display?.weights ?? [])].sort((a, b) => a - b)
  if (weights.length === 0) return 600
  const eligible = weights.filter((w) => w <= 700)
  if (eligible.length === 0) return weights[0]
  const target = typeof declared === 'number' && declared > 0 ? declared : 600
  // Nearest eligible weight to the target; ties go heavier, since a wordmark
  // under-setting its face reads as an accident and over-setting reads as a
  // decision.
  return eligible.reduce((best, w) => (Math.abs(w - target) <= Math.abs(best - target) ? w : best))
}

/**
 * Render `app/components/BrandLockup.tsx` for the day's chassis.
 *
 * Same pattern as `renderRootTemplate` in chassis.js: the orchestrator writes
 * this file every run, no agent ever authors it, and the template is read
 * fresh on each call so a dev loop sees edits without a node restart.
 *
 * @param {object} chassis the chosen chassis entry
 * @param {{ wordmarkWeight?: number|null }} [opts]
 * @returns {string} TSX source
 */
export function renderBrandLockupFile(chassis, { wordmarkWeight } = {}) {
  const template = readFileSync(TEMPLATE_PATH, 'utf8')
  if (!template.includes('{{WORDMARK_WEIGHT}}')) {
    throw new Error('BrandLockup.tsx.template missing {{WORDMARK_WEIGHT}} placeholder')
  }
  const weight = resolveWordmarkWeight(chassis, wordmarkWeight)
  return template.replaceAll('{{WORDMARK_WEIGHT}}', String(weight))
}

/**
 * Whether the day's declaration puts a lockup on the page at all.
 *
 * `placement: none` still renders one — the composition grammar's `none`
 * posture removes the nav, not the brand. Only an explicitly absent lockup
 * counts as absent, which is why this reads the lockup and not the placement.
 *
 * @param {{ brand_lockup?: string|null }|null} shell
 * @returns {boolean}
 */
export function lockupIsDeclared(shell) {
  const id = shell?.brand_lockup
  if (!id) return false
  const normalized = String(id).toLowerCase().trim()
  if (normalized === 'none' || normalized === 'absent') return false
  return true
}

/**
 * The lockup table as markdown, for the Art Director and Mockup Designer
 * prompts. Generated rather than retyped so the prompt and the component
 * cannot drift apart.
 *
 * @returns {string}
 */
export function formatLockupTableForPrompt() {
  const rows = LOCKUP_IDS.map((id) => {
    const v = LOCKUP_VARIANTS[id]
    const shape =
      v.orientation === 'mark'
        ? 'mark alone'
        : v.orientation === 'row'
          ? 'mark + wordmark on one line'
          : 'mark above wordmark, centered'
    return `| \`${id}\` | ${shape} | \`${v.step}\` | ${v.markMinPx}–${v.markMaxPx}px |`
  })
  return ['| id | composition | wordmark step | mark_px band |', '|---|---|---|---|', ...rows].join(
    '\n'
  )
}
