import { lastDistinct, readRecentArtifacts } from './recency.js'
import { FORBID_WINDOW } from './recency-mandate.js'
import { TYPE_FIELDS, TYPE_FIELD_NAMES } from './type-grammar.js'

/**
 * Type treatment variance mandate (#502), on the shell-mandate pattern:
 * several fields read out of one artifact, each soft-forbidden on its own
 * recency. Reads the TYPE_TREATMENT declaration persisted as
 * type-treatment.json in recent build dirs and marks recently-used values as
 * soft-forbidden, per field. Guidance, never law: fit > novelty, deviation
 * is allowed when justified.
 *
 * Recency is per field, as composition-mandate does per axis: a `case` used
 * on any of the last three builds is discouraged for `case` alone, so each
 * field is pushed independently rather than waiting for all five to repeat
 * at once.
 */

/**
 * @param {string} archiveDir
 * @param {number} lookbackDays
 * @returns {Array<{ date: string } & Record<string, string|null>>} newest
 *   first; dates whose build declared no treatment are omitted, so an archive
 *   that predates the block degrades to no history
 */
export function extractRecentTypeTreatments(archiveDir, lookbackDays) {
  return readRecentArtifacts(archiveDir, lookbackDays, ({ date, read }) => {
    const t = read('type-treatment.json')
    if (!t) return null
    const entry = { date }
    let any = false
    for (const field of TYPE_FIELD_NAMES) {
      const value = typeof t[field] === 'string' ? t[field].toLowerCase().trim() : null
      // Only values still in the vocabulary count as history. A retired value
      // should forbid nothing; there is nothing to repeat.
      entry[field] = value && TYPE_FIELDS[field].includes(value) ? value : null
      if (entry[field]) any = true
    }
    return any ? entry : null
  })
}

/**
 * The last three distinct values of one field, unless that covers the whole
 * vocabulary. A field with every value discouraged has nothing to push toward
 * (composition-mandate leaves such an axis alone for the same reason), so it
 * reads as open instead.
 *
 * @param {object[]} recent
 * @param {string} field
 * @returns {string[]}
 */
function forbidFor(recent, field) {
  const used = lastDistinct(
    recent.map((t) => t[field]),
    FORBID_WINDOW
  )
  return used.length < TYPE_FIELDS[field].length ? used : []
}

/**
 * @param {{ archiveDir: string, lookbackDays?: number }} opts
 * @returns {{ recentTreatments: object[], softForbidden: Record<string, string[]>, rationale: string }}
 */
export function computeTypeTreatmentMandate({ archiveDir, lookbackDays = 7 }) {
  const recentTreatments = extractRecentTypeTreatments(archiveDir, lookbackDays)
  const softForbidden = {}
  for (const field of TYPE_FIELD_NAMES) {
    softForbidden[field] = forbidFor(recentTreatments, field)
  }
  const rationale = recentTreatments.length
    ? `Last ${recentTreatments.length} type treatment${recentTreatments.length === 1 ? '' : 's'}: ${recentTreatments
        .map(
          (t) =>
            `${t.date}: ${TYPE_FIELD_NAMES.filter((f) => t[f])
              .map((f) => `${f}=${t[f]}`)
              .join(' ')}`
        )
        .join(' | ')}`
    : 'No recent type treatment history available; every field is open.'
  return { recentTreatments, softForbidden, rationale }
}

/** Bullet labels, in prompt order. */
const LABEL = {
  case: 'Case',
  lead: 'Lead',
  weight: 'Weight',
  alignment: 'Alignment',
  texture: 'Texture',
}

/**
 * @param {object} mandate
 * @returns {string} markdown block for prompt injection, or '' when there is
 *   no type treatment history to react to
 */
export function formatTypeTreatmentMandateForPrompt(mandate) {
  if (!mandate.recentTreatments?.length) return ''
  const lines = [
    `## Type Treatment Mandate`,
    ``,
    `Computed from recent builds. Eight builds in a row set their type the same way (mixed case, roman, left or centred, no texture) on eight different chassis, so the chassis carried all the variance. Case, lead, weight, alignment and texture are declared choices now, tracked per field. Treat this as strong guidance, not law.`,
    ``,
  ]
  for (const field of TYPE_FIELD_NAMES) {
    const used = mandate.softForbidden?.[field] ?? []
    lines.push(
      used.length
        ? `- **${LABEL[field]} used recently (avoid):** ${used.join(', ')}`
        : `- **${LABEL[field]}:** open.`
    )
  }
  lines.push(``)
  lines.push(`- **Rationale:** ${mandate.rationale}`)
  lines.push(``)
  lines.push(
    `If today's hero phrase genuinely calls for a recently-used value, use it, and say why in your rationale. Fit > novelty.`
  )
  return lines.join('\n')
}
