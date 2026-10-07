/**
 * Text contrast against the pixels behind it (spec 11, 1c).
 *
 * The CSS walk (#566, `text-contrast.js`) cannot resolve a ground that is not
 * a flat colour: a background-image, ruled lines, a blend mode, a positioned
 * layer over the text's box. It reported those as `contrast-unresolved`, a
 * warning with no ratio, and 2026-09-28 shipped a label and a deck set in
 * white across high-contrast white rules that way. The owner found the copy
 * hard to read; every gate had passed it.
 *
 * For each of those texts the page half (`pixel-contrast-page.js`) renders
 * the page with that text alone made transparent, screenshots the text's box
 * and hands back every pixel row inside its line boxes. This module does the
 * arithmetic, one row at a time: a text fails when any row through its
 * glyphs sits under the floor across {@link ROW_FRACTION} or more of the
 * line's width. That is a rule drawn through the text, however thin. The
 * first version took the 10th percentile of the whole box instead, and it
 * passed the 09-28 label: the 1px rule through its baseline was 5.6% of an
 * 18px box. A texture that dips under the floor in patches, or one dark
 * pixel, fails no row.
 *
 * Outlined text (a transparent fill with a stroke) is measured in its stroke
 * colour. Text under `aria-hidden` is not probed: it is texture, not copy.
 *
 * Thresholds are WCAG AA: 4.5:1 for text under the large size, 3:1 for large
 * text (24px, or 18.66px and bold). The CSS path still leaves large text
 * alone ("a display line set in a quiet colour is a design decision the
 * critics read"); the 3:1 floor applies only here, where the ground is a
 * pattern or a picture and nothing else measures it.
 *
 * A failure is a `legibility` error, shaped like `clipped`: the element
 * chain, the ratio and the threshold. It is the one finding the lenient ship
 * gate does not wave through (`phase-gate.js`), and it runs on the mockup
 * pre-check too (`mockup-precheck.js`), so the designer fixes it before code
 * exists.
 *
 * @module
 */

import { contrastRatio, rgbToHex } from './contrast.js'
import {
  compositeOver,
  contrastFixLine,
  contrastOwner,
  TEXT_CONTRAST_OPTIONS,
} from './text-contrast.js'

/** The finding kind, and the one the lenient ship gate refuses on. */
export const LEGIBILITY_KIND = 'legibility'

/**
 * The share of one pixel row through the glyphs that must be under the floor
 * for the text to fail: "across most of its width" (Doug, 2026-09-29). Over
 * seven nights (09-22, 09-24 to 09-29) every text's worst row was either
 * under the floor across all of its width or across at most 13.9% (09-26's
 * "Detroit" over its texture), so anything from 0.2 to 1 draws the same line.
 * Half is "most" read plainly, three times the worst passing row.
 */
export const ROW_FRACTION = 0.5

/** WCAG AA for text under the large size, and for large text. */
export const LEGIBILITY_MIN = 4.5
export const LEGIBILITY_LARGE_MIN = 3

/**
 * Texts probed on one page. Each costs a screenshot; 09-28's home page had
 * eleven unresolved texts at 360. Past this the rest stay `contrast-unresolved`
 * warnings, so a page with a hundred textured labels is not a minute's work.
 */
export const MAX_PROBES = 24

/** Pixels read back per row, strided across the line. Every row is kept. */
export const MAX_ROW_COLUMNS = 160

export const LEGIBILITY_FIX =
  'Give the text a flat ground that clears the ratio (a background on its own box), or stop ' +
  'the lines, image or layer behind it short of the text.'

/** Findings one owner sees from a whole run, after folding; the rest are counted. */
export const MAX_LEGIBILITY_REPORTED = 6

/** What the page half is handed: the #566 walk's options plus the probe's caps. */
export const PIXEL_CONTRAST_OPTIONS = Object.freeze({
  ...TEXT_CONTRAST_OPTIONS,
  maxProbes: MAX_PROBES,
  maxColumns: MAX_ROW_COLUMNS,
})

/**
 * The floor for one text.
 *
 * @param {boolean} large
 * @returns {number}
 */
export function legibilityThreshold(large) {
  return large ? LEGIBILITY_LARGE_MIN : LEGIBILITY_MIN
}

/**
 * The value at the low `p` share of `values`, by nearest rank: the smallest
 * value at or above which `1 - p` of them sit. 10 values at p 0.1 is the
 * lowest; 20 is the second lowest.
 *
 * @param {number[]} values
 * @param {number} p between 0 and 1
 * @returns {{ value: number, index: number }|null} index into `values`; null when empty
 */
export function lowPercentile(values, p) {
  if (!values.length) return null
  const order = values.map((_, i) => i).sort((a, b) => values[a] - values[b])
  const rank = Math.max(0, Math.ceil(p * values.length) - 1)
  const index = order[Math.min(rank, order.length - 1)]
  return { value: values[index], index }
}

/**
 * Samples, flat `[r, g, b, r, g, b, ...]`, as colours.
 *
 * @param {number[]} samples
 * @returns {Array<{ r: number, g: number, b: number }>}
 */
export function samplesToColors(samples) {
  const colors = []
  for (let i = 0; i + 2 < samples.length; i += 3) {
    colors.push({ r: samples[i], g: samples[i + 1], b: samples[i + 2] })
  }
  return colors
}

/**
 * One pixel row: the ratio at its low {@link ROW_FRACTION} mark, and the
 * share of it under `threshold`. A text colour with alpha (its own, times
 * its groups' opacity) is laid over each pixel before the ratio is taken, as
 * the browser lays it.
 *
 * @param {{ r: number, g: number, b: number, a?: number }} fg
 * @param {number[]} row flat r, g, b
 * @param {number} threshold
 * @returns {null | { ratio: number, under: number, fg: object, bg: object }}
 */
export function measureRow(fg, row, threshold) {
  const ground = samplesToColors(row)
  if (!ground.length) return null
  const inks = ground.map((px) => compositeOver(fg, px))
  const ratios = ground.map((px, i) => contrastRatio(inks[i], px))
  const at = lowPercentile(ratios, ROW_FRACTION)
  return {
    ratio: at.value,
    under: ratios.filter((r) => r < threshold).length / ratios.length,
    fg: inks[at.index],
    bg: ground[at.index],
  }
}

/**
 * A text's worst row. Its ratio is under the threshold exactly when that row
 * has {@link ROW_FRACTION} or more of its pixels under it.
 *
 * @param {{ fg: { r: number, g: number, b: number, a?: number }, rows: number[][],
 *   large: boolean }} probe
 * @returns {null | { ratio: number, under: number, threshold: number, fg: object, bg: object }}
 */
export function measureProbe(probe) {
  const threshold = legibilityThreshold(probe.large)
  let worst = null
  for (const row of probe.rows ?? []) {
    const m = measureRow(probe.fg, row, threshold)
    if (m && (!worst || m.ratio < worst.ratio)) worst = m
  }
  return worst ? { ...worst, threshold } : null
}

/** 4.499 must not print as 4.50 beside a "under 4.5" verdict. */
const shown = (ratio) => (Math.floor(ratio * 100) / 100).toFixed(2)

/**
 * The words for one text that fails, without the fix line.
 *
 * @param {{ selector: string, text: string, sizePx: number, unresolved: string,
 *   outlined?: boolean }} p
 * @param {{ ratio: number, under: number, threshold: number, fg: object, bg: object }} measured
 * @returns {string}
 */
export function describeLegibility(p, measured) {
  const { ratio, under, threshold, fg, bg } = measured
  const outlined = p.outlined ? ' outlined' : ''
  return (
    `<${p.selector}> "${p.text}" at ${p.sizePx}px${outlined} over ${p.unresolved}: ` +
    `${rgbToHex(fg)} is under ${threshold}:1 across ${Math.round(under * 100)}% of one pixel ` +
    `row through its glyphs (${shown(ratio)}:1 on ${rgbToHex(bg)}).`
  )
}

/**
 * The probes on one measurement that fail their floor, measured.
 *
 * @param {{ probes?: Array<object> }|null|undefined} result the page half's return
 * @returns {Array<{ probe: object, measured: ReturnType<typeof measureProbe> }>}
 */
export function failingProbes(result) {
  const failing = []
  for (const probe of result?.probes ?? []) {
    const measured = measureProbe(probe)
    if (measured && measured.ratio < measured.threshold) failing.push({ probe, measured })
  }
  return failing
}

/**
 * The legibility findings for one measurement, one per element chain at its
 * worst reading. Owner-aware the way `textContrastFindings` is: text inside
 * an orchestrator part is the human's, unless the pixels that fail it are
 * painted from outside the part and it clears its floor on the page's own
 * ground. Then the engineer laid something behind the orchestrator's text,
 * and the finding is the route owner's error, naming the layer (#705).
 *
 * @param {{ pixelContrast?: { probes: Array<object> } }} m raw measurement
 * @param {'react-engineer'|'human'} surfaceOwner
 * @returns {Array<object>}
 */
export function legibilityFindings(m, surfaceOwner) {
  const bySelector = new Map()
  for (const { probe, measured } of failingProbes(m.pixelContrast)) {
    const prior = bySelector.get(probe.selector)
    if (prior && prior.gap >= measured.threshold - measured.ratio) continue
    bySelector.set(probe.selector, {
      kind: LEGIBILITY_KIND,
      severity: 'error',
      owner: contrastOwner(probe, measured.threshold, surfaceOwner),
      selector: probe.selector,
      ratio: measured.ratio,
      threshold: measured.threshold,
      gap: measured.threshold - measured.ratio,
      key: `${LEGIBILITY_KIND}|${probe.selector}`,
      detail: `${describeLegibility(probe, measured)}${contrastFixLine(probe, measured.threshold, LEGIBILITY_FIX)}`,
    })
  }
  return [...bySelector.values()]
}

const placeOf = (f) => `${f.surface} at ${f.width}px`

/** The same chain on other routes, rungs and schemes is one fault, kept at its worst. */
function foldGroup(group) {
  const first = group.reduce((a, b) => (b.gap > a.gap ? b : a))
  const rest = [...new Set(group.map(placeOf))].filter((p) => p !== placeOf(first))
  return rest.length ? { ...first, detail: `${first.detail} Also on ${rest.join(', ')}.` } : first
}

function capOwner(group) {
  const ordered = [...group].sort((a, b) => b.gap - a.gap)
  if (ordered.length <= MAX_LEGIBILITY_REPORTED) return ordered
  const omitted = ordered.slice(MAX_LEGIBILITY_REPORTED)
  return [
    ...ordered.slice(0, MAX_LEGIBILITY_REPORTED),
    {
      ...omitted[0],
      key: `${LEGIBILITY_KIND}|summary|${omitted[0].owner}`,
      detail: `${omitted.length} more texts under their floor over a textured ground are not listed.`,
    },
  ]
}

/**
 * Fold a run's legibility findings: one per owner and chain, worst first,
 * capped per owner with a closing line that keeps the error severity, so it
 * still reaches the repair brief. Other findings pass through, ahead.
 *
 * @param {Array<object>} findings gate findings, each with `surface` and `width`
 * @returns {Array<object>}
 */
export function collapseLegibility(findings) {
  const groups = new Map()
  const others = []
  for (const f of findings) {
    if (f.kind !== LEGIBILITY_KIND) {
      others.push(f)
      continue
    }
    const key = `${f.owner}|${f.key}`
    groups.set(key, [...(groups.get(key) ?? []), f])
  }
  const folded = [...groups.values()].map(foldGroup)
  const capped = []
  for (const owner of new Set(folded.map((f) => f.owner))) {
    capped.push(...capOwner(folded.filter((f) => f.owner === owner)))
  }
  return [...others, ...capped]
}

/**
 * The legibility faults in a list of engineer-owned faults: what the lenient
 * ship gate refuses on (spec 11).
 *
 * @param {Array<object>|null|undefined} faults
 * @returns {Array<object>}
 */
export function legibilityFaults(faults) {
  return (faults ?? []).filter((f) => f.kind === LEGIBILITY_KIND)
}
