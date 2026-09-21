/**
 * Line length in the surface gate (#569).
 *
 * Nothing gated on how long a line of running copy is. The archive scorer has
 * a 75-character average nothing reads, and the engineer prompt said nothing
 * about a measure. 2026-09-20's case studies capped their paragraphs at
 * `62ch` and set them at 80 to 87 characters a line: `ch` is the width of a
 * `0`, and Archivo's letters are narrower than its zero, so a `ch` value
 * overshoots in a narrow face. The check counts the characters the browser
 * laid on each line instead.
 *
 * `line-length-page.js` finds every block of running copy (`p`, `li`,
 * `blockquote`, eight words or more, visible, not code) and reports the
 * characters on each of its rendered lines. This module decides:
 *
 * - A block fails when its longest line holds more than
 *   {@link LINE_LENGTH_MAX_CHARS} characters, WCAG 1.4.8's ceiling. The
 *   longest line, not the median: the width is what an engineer sets, and the
 *   longest line is what that width allows. A block that sets on one line is
 *   judged on that line.
 * - It is measured at all three rungs in the light scheme. At the phone no
 *   line of the last ten nights passed 53 characters. The tablet is where a
 *   single column is widest against its type: on four of the ten nights a
 *   chain was over the limit at 820 and not at 1440, and on two of them
 *   (09-15, 09-19) that was the only place it showed.
 * - It is an error, and every text is fixed the same way, by capping the
 *   block's width. Calibrated in docs/evidence/legibility-measurements/.
 *
 * Text inside a part the orchestrator writes (see `ORCHESTRATOR_PARTS` in
 * `text-contrast.js`) is owned by 'human', so it is reported and never forces
 * a revision the engineer cannot make.
 *
 * @module
 */

import { LINE_LENGTH_MAX_CHARS } from './responsive-thresholds.js'
import { SMALL_TEXT_OPTIONS } from './small-text.js'
import { ownerNote } from './text-contrast.js'

/** What the page walk needs. */
export const LINE_LENGTH_OPTIONS = Object.freeze({
  runningTags: SMALL_TEXT_OPTIONS.runningTags,
  /** Fewer words than this is a label or a chip, not a sentence. */
  minWords: 8,
  /** Blocks the walk hands back; a page of a few hundred paragraphs is far under it. */
  maxBlocks: 400,
})

/**
 * Findings one owner sees from a whole run, after folding. Six names the
 * shape of a bad night; the rest are counted in one closing line, as with
 * contrast, the type-size floors and render health.
 */
export const MAX_LINE_LENGTH_REPORTED = 6

/** Other places a folded finding names before it counts the rest. */
const MAX_PLACES_NAMED = 3

export const LINE_LENGTH_FIX =
  'Cap the block with max-width so its lines stay under ' +
  `${LINE_LENGTH_MAX_CHARS} characters. ch overshoots in a narrow face, so 45 to 50ch is the ` +
  'working number. A narrower column is no reason to leave the rest of the row empty: set the ' +
  'copy beside something.'

/** The middle of the lines that are full, the last line of a block being whatever was left over. */
export function medianFullLine(lines) {
  const full = lines.length > 1 ? lines.slice(0, -1) : lines
  const sorted = [...full].sort((a, b) => a - b)
  const mid = sorted.length >> 1
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/** The most characters on any line of the block. */
export const longestLine = (lines) => Math.max(0, ...lines)

/** Characters a block holds on its longest line, and the middle of its full lines. */
function readingOf(block) {
  return { longest: longestLine(block.lines), median: medianFullLine(block.lines) }
}

/** The words for one block, in the form the brief lists it. */
export function describeBlock(b, reading, count = 1) {
  const times = count > 1 ? ` (x${count})` : ''
  const shape =
    b.lines.length === 1
      ? 'on one line'
      : `on its longest line (${b.lines.length} lines, median ${reading.median})`
  return (
    `<${b.selector}> "${b.sample}"${times} sets ${reading.longest} characters ${shape} at ` +
    `${b.sizePx}px in a ${b.boxPx}px box, over the ${LINE_LENGTH_MAX_CHARS} limit`
  )
}

/**
 * The line-length findings for one measurement: one per distinct element
 * chain, at its worst block, with a count of the blocks that share it.
 * The run-wide fold and cap are {@link collapseLineLength}'s.
 *
 * @param {{ lineLength?: { blocks: Array<object> } }} m raw measurement
 * @param {'react-engineer'|'human'} surfaceOwner
 * @returns {Array<object>}
 */
export function lineLengthFindings(m, surfaceOwner) {
  const worst = new Map()
  for (const b of m.lineLength?.blocks ?? []) {
    const reading = readingOf(b)
    if (reading.longest <= LINE_LENGTH_MAX_CHARS) continue
    const held = worst.get(b.selector)
    if (!held) worst.set(b.selector, { b, reading, count: 1 })
    else {
      held.count++
      if (reading.longest > held.reading.longest) Object.assign(held, { b, reading })
    }
  }
  return [...worst.values()].map(({ b, reading, count }) => ({
    kind: 'line-length',
    severity: 'error',
    owner: b.part ? 'human' : surfaceOwner,
    rank: reading.longest,
    key: `line-length|${b.selector}`,
    detail: `${describeBlock(b, reading, count)}. ${b.part ? ownerNote(b).trim() : LINE_LENGTH_FIX}`,
  }))
}

const isLineLength = (f) => f.kind === 'line-length'

const placeOf = (f) => `${f.surface} at ${f.width}px`

/** Worst first, then by key so a run's brief reads the same each time. */
const worstFirst = (a, b) => b.rank - a.rank || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0)

/** The same chain at other routes and rungs is one fault, at its worst reading with the places named. */
function foldGroup(group) {
  const first = group.reduce((a, b) => (b.rank > a.rank ? b : a))
  const rest = [...new Set(group.map(placeOf))].filter((p) => p !== placeOf(first))
  if (!rest.length) return first
  const named = rest.slice(0, MAX_PLACES_NAMED).join(', ')
  const more = rest.length > MAX_PLACES_NAMED ? ` and ${rest.length - MAX_PLACES_NAMED} more` : ''
  return { ...first, detail: `${first.detail} Also on ${named}${more}.` }
}

function capOwner(group) {
  const ordered = [...group].sort(worstFirst)
  if (ordered.length <= MAX_LINE_LENGTH_REPORTED) return ordered
  const omitted = ordered.slice(MAX_LINE_LENGTH_REPORTED)
  return [
    ...ordered.slice(0, MAX_LINE_LENGTH_REPORTED),
    {
      ...omitted[0],
      key: `line-length|summary|${omitted[0].owner}`,
      detail: `${omitted.length} more distinct blocks run over the ${LINE_LENGTH_MAX_CHARS}-character limit and are not listed; the longest line among them is ${omitted[0].rank} characters.`,
    },
  ]
}

/**
 * Fold the line-length findings of a whole run into one list. The same block
 * turns up at every rung and on every route that shares its component; that
 * is one fault, at its worst reading, with the other places named. What is
 * left is capped per owner, worst first, and a closing line counts the rest.
 * Other findings pass through untouched, ahead of these.
 *
 * @param {Array<object>} findings gate findings, each with `surface` and `width`
 * @returns {Array<object>}
 */
export function collapseLineLength(findings) {
  const groups = new Map()
  for (const f of findings.filter(isLineLength)) {
    const key = `${f.owner}|${f.key}`
    groups.set(key, [...(groups.get(key) ?? []), f])
  }
  const folded = [...groups.values()].map(foldGroup)
  const capped = []
  for (const owner of new Set(folded.map((f) => f.owner))) {
    capped.push(...capOwner(folded.filter((f) => f.owner === owner)))
  }
  return [...findings.filter((f) => !isLineLength(f)), ...capped]
}
