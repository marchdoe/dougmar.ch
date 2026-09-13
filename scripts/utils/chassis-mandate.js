import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { readRecentDates, lastDistinct } from './recent-builds.js'
import { CHASSIS_CATALOG } from '../../elements/chassis/index.js'

/**
 * Chassis variance mandate — the same shape as shell-mandate.js applied to
 * the typography chassis. Reads the `chassis` field of `record.json`, which
 * lives at the date level of the archive (not inside build dirs) and already
 * records the shipped build's chassis, so nothing new is persisted.
 *
 * Empirical audit (#253, 83 recorded builds): big-shoulders-atkinson,
 * bricolage-manrope and bebas-plex carried 71% of builds between them while
 * three chassis had never been used once. Every other varying surface (hue,
 * composition, shell, lane, hero source) already had a recency mandate;
 * typography had one sentence of "vary your pick". Guidance, never law:
 * fit > novelty, deviation is allowed when justified.
 *
 * Built directly on readRecentDates + lastDistinct rather than on a shared
 * recencyMandate helper — #225 tracks collapsing the mandate clones into
 * one, and this file stays minimal so that collapse can absorb it.
 */

/**
 * @param {string} archiveDir
 * @param {number} lookbackDays
 * @returns {Array<{ date: string, chassis: string }>} newest first, dates
 *   without a recorded chassis omitted (old records predate the field)
 */
export function extractRecentChassis(archiveDir, lookbackDays) {
  const dates = readRecentDates(archiveDir, { lookbackDays })

  const out = []
  for (const date of dates) {
    const recordPath = path.join(archiveDir, date, 'record.json')
    if (!existsSync(recordPath)) continue
    try {
      const record = JSON.parse(readFileSync(recordPath, 'utf8'))
      if (typeof record.chassis === 'string' && record.chassis) {
        out.push({ date, chassis: record.chassis })
      }
    } catch {
      /* ignore malformed */
    }
  }
  return out
}

/** The class each catalogue chassis belongs to, by id. */
const CLASS_OF = new Map(CHASSIS_CATALOG.map((c) => [c.id, c.class]))

/** Every class the catalogue carries, in catalogue order. */
const CLASSES = [...new Set(CHASSIS_CATALOG.map((c) => c.class))]

/**
 * A class the last three shipped chassis share (#502). The distinct-id rule
 * below let three different condensed pairs count as three different choices;
 * the eight nights that motivated the type treatment block did exactly that.
 *
 * @param {Array<{date: string, chassis: string}>} recentChassis newest first
 * @returns {{ class: string, unshipped: string[] }|null} the shared class and
 *   the classes that have not shipped in the window, or null when there is no
 *   streak
 */
export function classStreak(recentChassis) {
  const classes = recentChassis.map((c) => CLASS_OF.get(c.chassis) ?? null)
  const last = classes.slice(0, 3)
  if (last.length < 3 || !last[0] || last.some((k) => k !== last[0])) return null
  return { class: last[0], unshipped: CLASSES.filter((k) => !classes.includes(k)) }
}

/**
 * @param {{ archiveDir: string, lookbackDays?: number }} opts
 * @returns {{ recentChassis: Array<{date: string, chassis: string}>, softForbidden: string[], classStreak: { class: string, unshipped: string[] }|null, rationale: string }}
 */
export function computeChassisMandate({ archiveDir, lookbackDays = 14 }) {
  const recentChassis = extractRecentChassis(archiveDir, lookbackDays)
  const softForbidden = /** @type {string[]} */ (
    lastDistinct(
      recentChassis.map((c) => c.chassis),
      3
    )
  )
  const rationale = recentChassis.length
    ? `Last ${recentChassis.length} chassis: ${recentChassis.map((c) => `${c.date}: ${c.chassis}`).join(' | ')}`
    : 'No recent chassis history available; the catalog is open.'
  return { recentChassis, softForbidden, classStreak: classStreak(recentChassis), rationale }
}

/**
 * @param {object} mandate
 * @returns {string} markdown block for prompt injection, or '' when there is
 *   no chassis history to react to
 */
export function formatChassisMandateForPrompt(mandate) {
  if (!mandate.recentChassis.length) return ''
  const lines = [
    `## Chassis Mandate`,
    ``,
    `Computed from recent builds. The audit that motivated this mandate found three chassis carrying 71% of all recorded builds while three others had never shipped once. Treat this as strong guidance, not law.`,
    ``,
    mandate.softForbidden.length
      ? `- **Chassis used recently (avoid):** ${mandate.softForbidden.join(', ')}`
      : `- **Chassis:** no recent history.`,
    ...(mandate.classStreak
      ? [
          `- **Chassis class used three nights running (avoid):** ${mandate.classStreak.class}. Classes that have not shipped in the window: ${mandate.classStreak.unshipped.join(', ') || 'none'}.`,
        ]
      : []),
    ``,
    `- **Rationale:** ${mandate.rationale}`,
    ``,
    `If today's hero phrase genuinely demands a recently-used chassis, use it — justify why in your rationale. Fit > novelty.`,
  ]
  return lines.join('\n')
}
