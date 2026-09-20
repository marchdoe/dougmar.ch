import { recencyMandate } from './recency-mandate.js'

/**
 * Hero-source variance mandate — applied to where today's hero phrase came
 * from (quote, composed, content-lifted, signal-event). Reads the
 * hero-source.json artifact persisted in recent build dirs (see HERO_SOURCE
 * block, Art Director) and soft-forbids repeating the same non-quote lane
 * on two consecutive days.
 *
 * Quote is the preferred lane now (#531): the Art Director reads for it
 * first and reaches past it only when today's quote can't carry a page.
 * Flagging a quote-sourced streak would fight that preference directly, so
 * quote is exempt from the repeat check. The other three lanes keep the
 * streak rule this mandate has always applied — two of the same lane
 * running is the sameness signal, not a quote three days ago with
 * something else in between. The read and the prose scaffolding live in
 * recency-mandate.js, shared with palette-formula-mandate (#225).
 */
const mandate = recencyMandate({
  artifact: 'hero-source.json',
  field: 'source',
  valueKey: 'source',
  historyKey: 'recentHeroSources',
  // Not "the last N distinct": two of the same lane running is the signal,
  // and quote is exempt from it entirely now that it is the preferred lane.
  forbid: (history) => {
    const lastTwo = history.slice(0, 2)
    if (lastTwo.length !== 2) return []
    const [latest, prior] = lastTwo
    return latest.source === prior.source && latest.source !== 'quote' ? [latest.source] : []
  },
  title: 'Hero Source Mandate',
  intro: `Computed from recent builds. Quote is the preferred hero lane: reach for it first, and reach past it only when today's quote genuinely can't carry a page. Repeating quote on consecutive days is not a fault; repeating any other lane two days running is.`,
  rationaleLabel: 'hero sources',
  emptyRationale: 'No recent hero-source history available; the source is open.',
  forbiddenBullet: (forbidden) =>
    `- **Hero sources used recently (avoid repeating):** ${forbidden.join(', ')} — the last two consecutive days both used this lane.`,
  emptyBullet: `- **Hero sources:** no non-quote streak to avoid.`,
  closing: `Quote first, and a quote-sourced streak needs no justification. If you reach past today's quote, or land on the same non-quote lane as yesterday, justify why in your hero rationale.`,
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
