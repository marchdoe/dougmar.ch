import { recencyMandate } from './recency-mandate.js'

/**
 * Motion variance mandate (#506), applied to how the hero arrives. Reads the
 * `entrance` field out of motion.json in recent build dirs and soft-forbids
 * the last three distinct values, the way the palette-formula mandate reads
 * ground_strategy out of shell.json.
 *
 * Keyed on `entrance` alone: `ground` has two values and `reveal` two, so a
 * recency window on either would forbid everything after two nights. The
 * entrance is the one gesture the strip is judged on, and the one worth
 * pushing around.
 *
 * Old archives predate motion.json entirely; those builds are skipped, so
 * history degrades to no history rather than to a history of nulls.
 */
const mandate = recencyMandate({
  artifact: 'motion.json',
  field: 'entrance',
  valueKey: 'entrance',
  historyKey: 'recentEntrances',
  title: 'Motion Mandate',
  intro: `Computed from recent builds. The entrance is one gesture, not a cascade, and the same gesture three nights running reads as a template. Treat this as strong guidance, not law.`,
  rationaleLabel: 'declared entrances',
  emptyRationale: 'No recent motion history available; the entrance is open.',
  forbiddenBullet: (forbidden) => `- **Entrances used recently (avoid):** ${forbidden.join(', ')}`,
  emptyBullet: `- **Entrances:** no recent history.`,
  closing: `Prefer an entrance NOT in the recent list (none, settle, rise, wipe). \`none\` is a real choice on a poster day. If today's hero genuinely calls for a recently-used entrance, use it, and say why in your rationale. Fit > novelty.`,
})

/**
 * @param {string} archiveDir
 * @param {number} lookbackDays
 * @returns {Array<{ date: string, entrance: string }>} newest first, entries without a declared entrance omitted
 */
export const extractRecentEntrances = mandate.extract

/**
 * @param {{ archiveDir: string, lookbackDays?: number }} opts
 * @returns {{ recentEntrances: object[], softForbidden: string[], rationale: string }}
 */
export const computeMotionMandate = mandate.compute

/**
 * @param {object} mandate
 * @returns {string} markdown block for prompt injection, or '' when there is
 *   no motion history to react to
 */
export const formatMotionMandateForPrompt = mandate.format
