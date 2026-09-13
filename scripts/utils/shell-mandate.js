import { lastDistinct, readRecentArtifacts } from './recency.js'
import { FORBID_WINDOW } from './recency-mandate.js'

/**
 * Shell variance mandate — applied to the page shell (footer treatment,
 * brand lockup) and to the header (placement, nav treatment, mark size
 * band). Reads the SHELL and HEADER declarations persisted as shell.json and
 * header.json in recent build dirs and marks recently-used treatments as
 * soft-forbidden. Guidance, never law: "Fit > novelty" — deviation is
 * allowed when justified.
 *
 * The header half arrived with #254. Before it, `nav` was a line of prose
 * inside SHELL and the mark's size was nowhere at all, so the mandate could
 * push the nav around and had nothing to say about the thing three owner
 * ratings running complained about.
 *
 * The walk over recent builds lives in recency.js, and the discouraged
 * window is the one recency-mandate.js hands the others. The rest stays
 * here: this mandate reads five keys across two artifacts and carries a
 * colour-mode nudge, so putting it through the factory would cost more
 * config than the shared code saves (#225).
 */

/**
 * Size bands for the declared mark, coarse enough that two adjacent nights
 * landing on 44px and 46px count as the same choice — which, on the page,
 * they are.
 *
 * @param {number|null|undefined} px
 * @returns {string|null}
 */
export function markBand(px) {
  if (typeof px !== 'number' || !Number.isFinite(px) || px <= 0) return null
  if (px < 28) return 'under-28'
  if (px < 44) return '28-44'
  if (px < 64) return '44-64'
  return 'over-64'
}

/**
 * @param {string} archiveDir
 * @param {number} lookbackDays
 * @returns {Array<{ date: string, nav: string|null, footer: string|null, brand_lockup: string|null, brand_color_mode: string|null, ground_material: string|null, placement: string|null, mark_band: string|null }>} newest first
 */
export function extractRecentShells(archiveDir, lookbackDays) {
  return readRecentArtifacts(archiveDir, lookbackDays, ({ date, read }) => {
    const s = read('shell.json')
    const h = read('header.json')
    if (!s && !h) return null
    return {
      date,
      // nav moved from shell.json to header.json on 2026-08-30. Archived
      // builds from before then only have the shell copy, so read both.
      nav: h?.nav ?? s?.nav ?? null,
      footer: s?.footer ?? null,
      brand_lockup: s?.brand_lockup ?? null,
      brand_color_mode: s?.brand_color_mode ?? null,
      // The hero field's texture (#505). Null before the field existed.
      ground_material: s?.ground_material ?? null,
      placement: h?.placement ?? null,
      mark_band: markBand(h?.mark_px),
    }
  })
}

/** Keys the mandate soft-forbids, in prompt order. */
const FORBID_KEYS = ['placement', 'nav', 'footer', 'brand_lockup', 'mark_band', 'ground_material']

/**
 * @param {{ archiveDir: string, lookbackDays?: number }} opts
 * @returns {{ recentShells: object[], softForbidden: Record<string, string[]>, colorModeNudge: string|null, rationale: string }}
 */
export function computeShellMandate({ archiveDir, lookbackDays = 7 }) {
  const recentShells = extractRecentShells(archiveDir, lookbackDays)
  const softForbidden = {}
  for (const key of FORBID_KEYS) {
    softForbidden[key] = lastDistinct(
      recentShells.map((s) => s[key]),
      FORBID_WINDOW
    )
  }

  // The mark has two colour modes and one of them has effectively never
  // shipped: across 17 builds carrying a shell.json, `single-color` was
  // chosen 16 times, so the green-and-blue mark almost never appears. Nudge
  // toward `original` only when the window genuinely has none of it —
  // a nudge that fires every night is a nudge nobody reads.
  const modes = recentShells.map((s) => s.brand_color_mode).filter(Boolean)
  const colorModeNudge =
    modes.length > 0 && !modes.includes('original')
      ? `\`brand_color_mode: original\` has not been used in the last ${modes.length} builds. The mark's own green and blue is half the brand contract and it almost never reaches the page — choose it today unless today's palette genuinely fights it.`
      : null

  const rationale = recentShells.length
    ? `Last ${recentShells.length} shells: ${recentShells
        .map(
          (s) =>
            `${s.date}: placement=${s.placement}, nav=${s.nav}, footer=${s.footer}, lockup=${s.brand_lockup} (${s.brand_color_mode}), mark=${s.mark_band}, material=${s.ground_material}`
        )
        .join(' | ')}`
    : 'No recent shell history available; the shell is open.'
  return { recentShells, softForbidden, colorModeNudge, rationale }
}

/**
 * @param {object} mandate
 * @returns {string} markdown block for prompt injection
 */
export function formatShellMandateForPrompt(mandate) {
  const lines = [
    `## Shell Mandate`,
    ``,
    `Computed from recent builds. The page shell (footer treatment, brand lockup) and the header (placement, nav treatment, mark size) must be DECLARED choices, not defaults. Treat this as strong guidance, not law.`,
    ``,
  ]
  const label = {
    placement: 'Header placements',
    nav: 'Nav treatments',
    footer: 'Footer treatments',
    brand_lockup: 'Brand lockups',
    mark_band: 'Mark size bands',
    ground_material: 'Ground materials',
  }
  for (const key of FORBID_KEYS) {
    const used = mandate.softForbidden?.[key] ?? []
    lines.push(
      used.length
        ? `- **${label[key]} used recently (avoid):** ${used.join(', ')}`
        : `- **${label[key]}:** no recent history.`
    )
  }
  lines.push(``)
  if (mandate.colorModeNudge) {
    lines.push(`- **Color mode:** ${mandate.colorModeNudge}`)
    lines.push(``)
  }
  lines.push(`- **Rationale:** ${mandate.rationale}`)
  lines.push(``)
  lines.push(
    `If today's brief genuinely calls for a recently-used treatment, you may reuse it — justify why in your rationale. Fit > novelty.`
  )
  return lines.join('\n')
}
