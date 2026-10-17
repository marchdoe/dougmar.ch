import { recencyMandate } from './recency-mandate.js'

/**
 * Hero-source variance mandate — applied to where today's hero phrase came
 * from (quote, composed, content-lifted, signal-event). Reads the
 * hero-source.json artifact persisted in recent build dirs (see HERO_SOURCE
 * block, Art Director) and soft-forbids repeating the same lane on two
 * consecutive days.
 *
 * All four lanes are equal (spec 13, 2026-10-17). #531 made quote the
 * preferred lane and exempted it from this check; a stranger's quote then led
 * 14 of the 20 nights from 09-25 to 10-17, against taste.md's "the subject is
 * Doug". Quote is back under the streak rule like the other three: two of the
 * same lane running is the sameness signal, not a quote three days ago with
 * something else in between. The read and the prose scaffolding live in
 * recency-mandate.js, shared with palette-formula-mandate (#225).
 */
const mandate = recencyMandate({
  artifact: 'hero-source.json',
  field: 'source',
  valueKey: 'source',
  historyKey: 'recentHeroSources',
  // Not "the last N distinct": two of the same lane running is the signal.
  forbid: (history) => {
    const lastTwo = history.slice(0, 2)
    if (lastTwo.length !== 2) return []
    const [latest, prior] = lastTwo
    return latest.source === prior.source ? [latest.source] : []
  },
  title: 'Hero Source Mandate',
  intro: `Computed from recent builds. The four hero lanes are equal; none is the default. Repeating any lane two days running is a fault.`,
  rationaleLabel: 'hero sources',
  emptyRationale: 'No recent hero-source history available; the source is open.',
  forbiddenBullet: (forbidden) =>
    `- **Hero sources used recently (avoid repeating):** ${forbidden.join(', ')} — the last two consecutive days both used this lane.`,
  emptyBullet: `- **Hero sources:** no streak to avoid.`,
  closing: `If you land on the same lane as yesterday, justify why in your hero rationale.`,
})

/**
 * @param {string} archiveDir
 * @param {number} lookbackDays
 * @returns {Array<{ date: string, source: string }>} newest first, entries without a declared source omitted
 */
export const extractRecentHeroSources = mandate.extract

/**
 * @param {{ archiveDir: string, lookbackDays?: number }} opts
 * @returns {{ recentHeroSources: object[], softForbidden: string[], rationale: string }}
 */
export const computeHeroSourceMandate = mandate.compute

/**
 * @param {object} mandate
 * @returns {string} markdown block for prompt injection, or '' when there is
 *   no hero-source history to react to
 */
export const formatHeroSourceMandateForPrompt = mandate.format
