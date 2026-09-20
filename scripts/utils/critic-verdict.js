/**
 * Shared verdict parser for the pipeline's critic gates.
 *
 * Every critic prompt (screenshot-critic, mockup-critic) ends
 * with a `===VERDICT===\n<VALUE>\n===END===` block. Parsing the verdict with a
 * bare `raw.includes('REVISE')` is wrong: any response that so much as mentions
 * the word REVISE — an echo of the "APPROVE | REVISE" template line, or prose
 * like "no need to REVISE" — flips the verdict, needlessly triggering an
 * expensive re-run on a passing design.
 *
 * This anchors on the verdict block instead:
 * - the token must sit alone on its line (rejects a template echo),
 * - the LAST occurrence wins (a quoted example earlier can't shadow the real
 *   verdict),
 * - a malformed/absent block fails closed to REVISE — never ship or approve
 *   something the critic could not be confirmed to have passed.
 *
 * @param {string} raw - the critic's raw response text
 * @param {string} positiveToken - the non-REVISE verdict for this critic
 *   ('SHIP' for screenshot-critic, 'APPROVE' for mockup-critic)
 * @returns {{ verdict: string, malformed: boolean }} verdict is either
 *   positiveToken or 'REVISE'; malformed is true when no valid block was found
 */
export function parseCriticVerdict(raw, positiveToken) {
  const re = new RegExp(`===VERDICT===\\s*\\r?\\n\\s*(${positiveToken}|REVISE)\\s*$`, 'gm')
  const matches = [...String(raw ?? '').matchAll(re)]
  if (matches.length === 0) {
    return { verdict: 'REVISE', malformed: true }
  }
  return { verdict: matches[matches.length - 1][1], malformed: false }
}

/**
 * Parse an optional "BAR: above|at|below — <reason>" line from the
 * screenshot-critic's response — its calibration verdict against the
 * owner's highest-rated past build, only asked when a reference image was
 * attached (see screenshot-critic.md). Tolerant by design: the BAR line is
 * advisory, never load-bearing, so absent or malformed input returns null
 * rather than throwing or failing a verdict closed.
 *
 * @param {string} raw - the critic's raw response text
 * @returns {{ position: 'above'|'at'|'below', reason: string } | null}
 */
export function parseBarLine(raw) {
  const m = /BAR:\s*(above|at|below)\b\s*[-—:]*\s*(.*)/i.exec(String(raw ?? ''))
  if (!m) return null
  return { position: m[1].toLowerCase(), reason: m[2].trim().split(/\r?\n/)[0].trim() }
}
