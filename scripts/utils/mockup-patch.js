/**
 * A mockup revision is a patch.
 *
 * Every revision round used to regenerate the whole mockup.html, 15-50KB of
 * HTML re-typed by Opus to move a mark or raise a font-size. #447 made the
 * engineer's revisions patch-sized; this is the same idea for the one file
 * the mockup designer owns. The reply carries only the regions that change,
 * each as an exact FIND and its REPLACE, and the orchestrator applies them to
 * the page the critic reviewed.
 *
 * The format, inside a `===PATCH:mockup.html===` block:
 *
 *     <<<<<<< FIND
 *     (text copied exactly from the previous mockup)
 *     =======
 *     (what replaces it)
 *     >>>>>>> REPLACE
 *
 * Edits apply in order, each to the result of the one before. A FIND must
 * occur exactly once; one that is missing or ambiguous fails the whole patch
 * rather than applying half of it, and the caller falls back to asking for
 * the complete file.
 *
 * @module
 */

export const PATCH_BLOCK = '===PATCH:mockup.html==='

const EDIT_RE =
  /^<<<<<<< FIND[ \t]*\n([\s\S]*?)\n?^=======[ \t]*\n([\s\S]*?)\n?^>>>>>>> REPLACE[ \t]*$/gm

/**
 * The edits in a reply's PATCH block, or null when the reply has none.
 * @param {string} raw the model's whole reply
 * @returns {Array<{ find: string, replace: string }>|null}
 */
export function parseMockupPatch(raw) {
  const text = String(raw ?? '')
  const start = text.indexOf(PATCH_BLOCK)
  if (start === -1) return null
  const after = text.slice(start + PATCH_BLOCK.length)
  // The block runs to the next ===NAME=== line or the end of the reply.
  const end = after.search(/^===[A-Z_]+(?::[^=\n]+)?===[ \t]*$/m)
  const body = end === -1 ? after : after.slice(0, end)
  const edits = [...body.matchAll(EDIT_RE)].map((m) => ({ find: m[1], replace: m[2] }))
  return edits
}

/** Occurrences of `needle` in `hay`, stopping at two. */
function countUpToTwo(hay, needle) {
  const first = hay.indexOf(needle)
  if (first === -1) return 0
  return hay.indexOf(needle, first + 1) === -1 ? 1 : 2
}

/**
 * Apply edits to the previous mockup.
 *
 * A FIND that is not in the page exactly is tried once more with trailing
 * whitespace stripped from every line of both, which is the difference a
 * model most often introduces when it copies a region back.
 *
 * @param {string} html the previous round's mockup
 * @param {Array<{ find: string, replace: string }>} edits
 * @returns {{ ok: true, html: string, applied: number } | { ok: false, error: string }}
 */
export function applyMockupPatch(html, edits) {
  if (!edits?.length) return { ok: false, error: 'the PATCH block holds no FIND/REPLACE edits' }
  let out = html
  for (const [i, { find, replace }] of edits.entries()) {
    const n = i + 1
    if (!find.trim()) return { ok: false, error: `edit ${n} has an empty FIND` }
    let count = countUpToTwo(out, find)
    let target = find
    if (count === 0) {
      const strip = (s) => s.replace(/[ \t]+$/gm, '')
      const stripped = strip(out)
      const strippedFind = strip(find)
      if (countUpToTwo(stripped, strippedFind) === 1) {
        out = stripped
        target = strippedFind
        count = 1
      }
    }
    if (count === 0) {
      return {
        ok: false,
        error: `edit ${n}'s FIND text is not in the previous mockup: "${find.slice(0, 80)}"`,
      }
    }
    if (count > 1) {
      return {
        ok: false,
        error: `edit ${n}'s FIND text occurs more than once in the previous mockup; it must be unique: "${find.slice(0, 80)}"`,
      }
    }
    const at = out.indexOf(target)
    out = out.slice(0, at) + replace + out.slice(at + target.length)
  }
  return { ok: true, html: out, applied: edits.length }
}

/**
 * The instruction a revision round's user prompt carries, after the previous
 * mockup and before the feedback.
 */
export const PATCH_INSTRUCTIONS = `## HOW TO RETURN THIS REVISION — a patch, not the whole file

Return only the regions of the previous mockup that change, in one ${PATCH_BLOCK} block, in place of the ===FILE:mockup.html=== block. Each edit is:

<<<<<<< FIND
(text copied exactly, character for character, from the PREVIOUS MOCKUP above)
=======
(the text that replaces it)
>>>>>>> REPLACE

Edits apply in order. Each FIND must appear exactly once in the page, so include enough surrounding lines to make it unique, and keep it short: a CSS rule, an element, a few lines. To add something, FIND the line it goes after and REPLACE with that line plus the addition. ===INTERIOR_NOTES=== and ===RATIONALE=== may be left out when they have not changed. Return the complete file in a ===FILE:mockup.html=== block only when the revision rewrites most of the page.`
