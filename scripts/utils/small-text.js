/**
 * Type-size floors in the surface gate (#567).
 *
 * The gate had one, running copy under 16px at the phone, and it was a
 * warning: a 12px paragraph shipped. It looked at three tags, so an 11px label
 * passed everywhere by design (#469), and it looked at the phone only. Two
 * findings replace it, both errors:
 *
 * - `small-copy`: `p`, `li` or `blockquote` with eight characters or more under
 *   {@link SMALL_COPY_FLOOR_PX}, at either rung.
 * - `small-text`: any visible text, whatever its tag, under
 *   {@link SMALL_TEXT_FLOOR_PX}, at either rung.
 *
 * The issue asked for 16px at the phone, 14px at desktop and 12px for any
 * text. Measured over the last ten nights those floors send every night to a
 * revision, because the ramp's own steps sit under them: `sm` is 14.22px and
 * `2xs` 11.23px on all fifteen chassis. The floors here are the ones the ramp
 * clears; the numbers and the alternatives are in
 * docs/evidence/font-size-floor/.
 *
 * `small-text-page.js` finds the elements in the same walk as the contrast
 * gate and hands back one record per element chain and size. This module
 * applies the floors, routes each finding to its owner, and folds a whole
 * run's findings into a short list.
 *
 * Text inside a part the orchestrator writes (see `ORCHESTRATOR_PARTS` in
 * `text-contrast.js`) is owned by 'human': the engineer cannot edit it, so it
 * is reported and never forces a revision.
 *
 * @module
 */

import { SMALL_COPY_FLOOR_PX, SMALL_TEXT_FLOOR_PX } from './responsive-thresholds.js'

/** What the page walk needs. */
export const SMALL_TEXT_OPTIONS = Object.freeze({
  runningTags: Object.freeze(['P', 'LI', 'BLOCKQUOTE']),
  runningMinChars: 8,
  /** The page skips anything at or over the larger floor before reading it. */
  scanBelowPx: Math.max(SMALL_COPY_FLOOR_PX, SMALL_TEXT_FLOOR_PX),
  textMinPx: SMALL_TEXT_FLOOR_PX,
  /** Distinct element chains and sizes the walk hands back. */
  maxCandidates: 200,
})

/**
 * Findings of each kind one owner sees from a whole run, after
 * deduplication. Six names the shape of a bad night; the rest are counted in
 * one closing line, as with contrast.
 */
export const MAX_SMALL_TEXT_REPORTED = 6

/** The fix lines the two findings end with, quoted by the engineer prompt's checklist (#634). */
export const SMALL_COPY_FIX = 'Set it on the `sm` step or larger.'
export const SMALL_TEXT_FIX = `Set it at ${SMALL_TEXT_FLOOR_PX}px or larger, or take it out.`

const KINDS = ['small-copy', 'small-text']

function describeEntry(e) {
  const times = e.count > 1 ? ` (x${e.count})` : ''
  return `<${e.selector}> "${e.sample}"${times}`
}

function ownerNote(e) {
  return e.part
    ? ` ${e.part[0].toUpperCase()}${e.part.slice(1)} is written by the orchestrator, so this is reported for the owner and is not a revision.`
    : ''
}

function smallCopyFinding(e, owner) {
  return {
    kind: 'small-copy',
    severity: 'error',
    owner,
    sizePx: e.sizePx,
    key: `small-copy|${e.selector}|${e.sizePx}`,
    detail:
      `${describeEntry(e)} is running copy at ${e.sizePx}px, under the ${SMALL_COPY_FLOOR_PX}px floor.` +
      (e.part ? ownerNote(e) : ` ${SMALL_COPY_FIX}`),
  }
}

function smallTextFinding(e, owner) {
  return {
    kind: 'small-text',
    severity: 'error',
    owner,
    sizePx: e.sizePx,
    key: `small-text|${e.selector}|${e.sizePx}`,
    detail:
      `${describeEntry(e)} is set at ${e.sizePx}px, under the ${SMALL_TEXT_FLOOR_PX}px floor for any visible text.` +
      (e.part ? ownerNote(e) : ` ${SMALL_TEXT_FIX}`),
  }
}

/**
 * The small-text findings for one measurement. Distinct by kind, element
 * chain and size; the run-wide cap is {@link collapseSmallText}'s. An entry
 * that is both running copy and under the text floor is one `small-copy`
 * finding, the stricter of the two statements.
 *
 * @param {{ textContrast?: { smallText?: { entries: Array<object> } } }} m raw measurement
 * @param {'react-engineer'|'human'} surfaceOwner
 * @returns {Array<object>}
 */
export function smallTextFindings(m, surfaceOwner) {
  const byKey = new Map()
  for (const e of m.textContrast?.smallText?.entries ?? []) {
    const owner = e.part ? 'human' : surfaceOwner
    let f = null
    if (e.running && e.sizePx < SMALL_COPY_FLOOR_PX) f = smallCopyFinding(e, owner)
    else if (e.visibleText && e.sizePx < SMALL_TEXT_FLOOR_PX) f = smallTextFinding(e, owner)
    if (f && !byKey.has(f.key)) byKey.set(f.key, f)
  }
  return [...byKey.values()]
}

/** Smallest first; ties by key so a run's brief reads the same each time. */
const smallestFirst = (a, b) => a.sizePx - b.sizePx || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0)

function isSmallText(f) {
  return KINDS.includes(f.kind)
}

/** Split a run's findings into the others and the small-text ones, grouped by owner and key. */
function groupSmallText(findings) {
  const others = []
  const groups = new Map()
  for (const f of findings) {
    if (!isSmallText(f)) {
      others.push(f)
      continue
    }
    const key = `${f.owner}|${f.key}`
    const held = groups.get(key) ?? { first: f, surfaces: [] }
    if (!held.surfaces.includes(f.surface)) held.surfaces.push(f.surface)
    groups.set(key, held)
  }
  return { others, groups: [...groups.values()] }
}

/** One group as one finding, with the other routes named. */
function foldGroup({ first, surfaces }) {
  const rest = surfaces.filter((s) => s !== first.surface)
  return rest.length ? { ...first, detail: `${first.detail} Also on ${rest.join(', ')}.` } : first
}

/**
 * The closing line for what the cap cut. An error, unlike contrast's: it is
 * only ever produced beside {@link MAX_SMALL_TEXT_REPORTED} errors, so the
 * revision is already forced, and as an error it reaches the repair brief and
 * tells the engineer how much more there is.
 */
function summaryFinding(omitted, kind) {
  const worst = omitted[0]
  const what = kind === 'small-copy' ? 'running copy under its floor' : 'texts under the text floor'
  return {
    ...worst,
    key: `${kind}|summary|${worst.owner}`,
    detail: `${omitted.length} more distinct ${what} are not listed; the smallest is ${worst.sizePx}px.`,
  }
}

function capOwnerKind(group, kind) {
  const ordered = [...group].sort(smallestFirst)
  if (ordered.length <= MAX_SMALL_TEXT_REPORTED) return ordered
  return [
    ...ordered.slice(0, MAX_SMALL_TEXT_REPORTED),
    summaryFinding(ordered.slice(MAX_SMALL_TEXT_REPORTED), kind),
  ]
}

/**
 * Fold the small-text findings of a whole run into one list. The same
 * element at the same size turns up on every route and rung that renders it;
 * that is one fault, with the other routes named. What is left is capped per
 * owner and kind, smallest first, and a closing line counts the rest.
 *
 * Other findings pass through untouched, ahead of the small-text ones.
 *
 * @param {Array<object>} findings gate findings, each with `surface`
 * @returns {Array<object>}
 */
export function collapseSmallText(findings) {
  const { others, groups } = groupSmallText(findings)
  const folded = groups.map(foldGroup)
  const capped = []
  for (const owner of new Set(folded.map((f) => f.owner))) {
    for (const kind of KINDS) {
      capped.push(
        ...capOwnerKind(
          folded.filter((f) => f.owner === owner && f.kind === kind),
          kind
        )
      )
    }
  }
  return [...others, ...capped]
}
