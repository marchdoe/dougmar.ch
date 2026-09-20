/**
 * Text contrast in the surface gate (#566).
 *
 * The gate measured one contrast ratio, the brand mark at 3:1, and none for
 * text. Small labels shipped under 4.5:1 in three of four nights: 09-18's
 * kicker at 1.87:1 with a ruled-line background running through it, 09-17's
 * "Specimen" at 2.19:1, 09-19's accent text at 3.75 to 4.37:1. Whether text
 * was readable was left to a model looking at a downscaled JPEG.
 *
 * The work is split on the page boundary. `text-contrast-page.js` runs in the
 * browser and reports, for each distinct piece of text, the colour it is set
 * in and the stack of backgrounds and opacities behind it. It resolves
 * nothing. The arithmetic (alpha over an opaque colour, opacity groups, the
 * WCAG ratio from `contrast.js`) runs here in Node, where it is unit-testable
 * without Chromium.
 *
 * Text is never measured over a background it cannot resolve. A
 * `background-image` (gradient, image, ruled lines) on an ancestor, a painted
 * positioned pseudo-element, a blend mode, or a positioned sibling that paints
 * over the text's box (09-18's ruled lines were a `position: absolute` div
 * beside the copy, not an ancestor of it) makes the ratio a guess. The text is
 * reported as `contrast-unresolved` (a warning, naming what is behind it) and
 * no ratio is produced.
 *
 * Large text (24px, or 18.66px and bold; WCAG's 18pt and 14pt) is not
 * measured. The issue asks for text under 24px, and a display line set in a
 * quiet colour is a design decision the critics read.
 *
 * @module
 */

import { contrastRatio, rgbToHex } from './contrast.js'

/** Under this a piece of text is an error: the engineer must revise. */
export const TEXT_CONTRAST_ERROR_BELOW = 3
/** Under this a piece of text is a warning. WCAG AA for text that is not large. */
export const TEXT_CONTRAST_WARN_BELOW = 4.5
/** WCAG large text: 18pt, or 14pt and bold. Text at or over these is not measured. */
export const LARGE_TEXT_PX = 24
export const LARGE_BOLD_TEXT_PX = 18.66
export const BOLD_WEIGHT = 700

/**
 * Findings one owner sees from the whole run, after deduplication. Six names
 * the shape of a bad night without sending the engineer a page per label;
 * the rest are counted in one closing line.
 */
export const MAX_TEXT_CONTRAST_REPORTED = 6
export const MAX_UNRESOLVED_REPORTED = 3

/**
 * Distinct texts the page walk hands back. A page of a few hundred text
 * elements is well under it; it bounds a pathological page.
 */
export const MAX_TEXT_CANDIDATES = 400

/** Positioned painters the walk remembers, and the share of a text's box one must cover. */
export const MAX_PAINTERS = 200
export const MIN_PAINTER_OVERLAP = 0.25

/**
 * Parts the orchestrator writes and no agent can edit. Text inside them is
 * measured and reported, but owned by 'human' so it never forces an engineer
 * revision the engineer cannot act on.
 *
 * `BrandLockup` has no marker of its own; its mark does, and the mark's
 * parent is the lockup's root element in every variant (see
 * scripts/templates/BrandLockup.tsx.template), hence `parent`.
 *
 * @type {ReadonlyArray<{ selector: string, name: string, parent?: boolean }>}
 */
export const ORCHESTRATOR_PARTS = Object.freeze([
  { selector: '[data-brand-mark]', name: 'BrandLockup', parent: true },
  { selector: '[data-site-callout]', name: 'SiteCallout' },
  { selector: '[data-white-paper]', name: 'WhitePaper' },
  { selector: '[data-ground-material]', name: 'Material' },
  { selector: '[data-archive-link]', name: 'the archive link' },
])

const WHITE = Object.freeze({ r: 255, g: 255, b: 255 })

/**
 * Options the page walk takes, in one place so the gate and the tests hand
 * it the same numbers.
 */
export const TEXT_CONTRAST_OPTIONS = Object.freeze({
  largePx: LARGE_TEXT_PX,
  largeBoldPx: LARGE_BOLD_TEXT_PX,
  boldWeight: BOLD_WEIGHT,
  maxCandidates: MAX_TEXT_CANDIDATES,
  maxPainters: MAX_PAINTERS,
  minOverlap: MIN_PAINTER_OVERLAP,
  parts: ORCHESTRATOR_PARTS,
})

/**
 * Source-over: `top` (channels 0-255, alpha 0-1) laid on an opaque `base`.
 *
 * @param {{ r: number, g: number, b: number, a?: number }} top
 * @param {{ r: number, g: number, b: number }} base
 * @returns {{ r: number, g: number, b: number }}
 */
export function compositeOver(top, base) {
  const a = top.a ?? 1
  return {
    r: top.r * a + base.r * (1 - a),
    g: top.g * a + base.g * (1 - a),
    b: top.b * a + base.b * (1 - a),
  }
}

/**
 * The colour of the text and of the ground behind it, as painted.
 *
 * `layers` run from the text's own element (index 0) up to html. Each is a
 * group: its background goes over what is behind it, everything inside goes
 * over that, and the whole group is blended with what was behind it at the
 * group's opacity. Opacity therefore dims the text and its ground together,
 * and lets whatever sits behind the group show through. Text alpha is
 * composited over the ground it sits on before any group's opacity applies.
 *
 * @param {{ r: number, g: number, b: number, a?: number }} text
 * @param {Array<{ bg: null | { r: number, g: number, b: number, a?: number }, opacity: number }>} layers
 * @param {{ r: number, g: number, b: number }} [canvas] behind html; white in a browser
 * @returns {{ fg: { r: number, g: number, b: number }, bg: { r: number, g: number, b: number } }}
 */
export function flattenLayers(text, layers, canvas = WHITE) {
  const paint = (i, backdrop) => {
    const layer = layers[i]
    const ground = layer.bg ? compositeOver(layer.bg, backdrop) : backdrop
    const inner = i === 0 ? { bg: ground, fg: compositeOver(text, ground) } : paint(i - 1, ground)
    return {
      bg: compositeOver({ ...inner.bg, a: layer.opacity }, backdrop),
      fg: compositeOver({ ...inner.fg, a: layer.opacity }, backdrop),
    }
  }
  return paint(layers.length - 1, canvas)
}

/**
 * The measured ratio for one page-walk candidate, or null when it is
 * unresolved.
 *
 * @param {{ fg: object, layers: Array<object>, unresolved: string|null }} c
 * @returns {null | { ratio: number, fg: object, bg: object }}
 */
export function measureCandidate(c) {
  if (c.unresolved) return null
  const { fg, bg } = flattenLayers(c.fg, c.layers)
  return { ratio: contrastRatio(fg, bg), fg, bg }
}

/** 4.499 must not print as 4.50 beside a "below 4.5" verdict. */
const shown = (ratio) => (Math.floor(ratio * 100) / 100).toFixed(2)

function describeText(c) {
  const bold = c.weight >= BOLD_WEIGHT ? ' bold' : ''
  const times = c.count > 1 ? ` (x${c.count})` : ''
  return `<${c.selector}> "${c.text}"${times} at ${c.sizePx}px${bold}`
}

function ownerNote(c) {
  return c.part
    ? ` ${c.part[0].toUpperCase()}${c.part.slice(1)} is written by the orchestrator, so this is reported for the owner and is not a revision.`
    : ''
}

function contrastFinding(c, measured, owner) {
  const { ratio, fg, bg } = measured
  const error = ratio < TEXT_CONTRAST_ERROR_BELOW
  const floor = error ? TEXT_CONTRAST_ERROR_BELOW : TEXT_CONTRAST_WARN_BELOW
  return {
    kind: 'contrast',
    severity: error ? 'error' : 'warning',
    owner,
    ratio,
    key: `contrast|${c.selector}|${rgbToHex(fg)}|${rgbToHex(bg)}`,
    detail:
      `${describeText(c)}: ${rgbToHex(fg)} on ${rgbToHex(bg)} is ${shown(ratio)}:1, under ` +
      `${floor}:1.${c.part ? ownerNote(c) : ' Set it in a token that clears 4.5:1 on its ground, or change the ground.'}`,
  }
}

function unresolvedFinding(c, owner) {
  return {
    kind: 'contrast-unresolved',
    severity: 'warning',
    owner,
    key: `contrast-unresolved|${c.selector}|${c.unresolved}`,
    detail:
      `${describeText(c)} sits over ${c.unresolved}; contrast is not measured because the ` +
      `ground is not a flat colour.${c.part ? ownerNote(c) : ' Keep small text on a flat ground.'}`,
  }
}

/**
 * The text-contrast findings for one measurement. Distinct by kind, element
 * chain and colour pair; the run-wide cap is {@link collapseTextContrast}'s.
 *
 * A candidate inside an orchestrator-owned part is owned by 'human', the
 * owner the gate already uses for what no agent can edit. Everything else
 * takes the owner of the route.
 *
 * @param {{ textContrast?: { candidates: Array<object> } }} m raw measurement
 * @param {'react-engineer'|'human'} surfaceOwner
 * @returns {Array<object>}
 */
export function textContrastFindings(m, surfaceOwner) {
  const byKey = new Map()
  for (const c of m.textContrast?.candidates ?? []) {
    const owner = c.part ? 'human' : surfaceOwner
    const measured = measureCandidate(c)
    if (!measured) {
      const f = unresolvedFinding(c, owner)
      if (!byKey.has(f.key)) byKey.set(f.key, f)
    } else if (measured.ratio < TEXT_CONTRAST_WARN_BELOW) {
      const f = contrastFinding(c, measured, owner)
      const prior = byKey.get(f.key)
      if (!prior || f.ratio < prior.ratio) byKey.set(f.key, f)
    }
  }
  return [...byKey.values()]
}

/** Errors first, then the lowest ratio. */
const worstFirst = (a, b) =>
  (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1) || a.ratio - b.ratio

function summaryFinding(omitted, kind) {
  const worst = omitted[0]
  const what = kind === 'contrast' ? 'low-contrast pairs' : 'texts over a textured ground'
  return {
    ...worst,
    severity: 'warning',
    key: `${kind}|summary|${worst.owner}`,
    detail:
      `${omitted.length} more distinct ${what} are not listed` +
      (kind === 'contrast' ? `; the worst is ${shown(worst.ratio)}:1.` : '.'),
  }
}

function capOwnerKind(group, kind) {
  const cap = kind === 'contrast' ? MAX_TEXT_CONTRAST_REPORTED : MAX_UNRESOLVED_REPORTED
  const ordered = kind === 'contrast' ? [...group].sort(worstFirst) : group
  if (ordered.length <= cap) return ordered
  return [...ordered.slice(0, cap), summaryFinding(ordered.slice(cap), kind)]
}

/** Split a run's findings into the others and the text-contrast ones, grouped by owner and key. */
function groupTextContrast(findings) {
  const others = []
  const groups = new Map()
  for (const f of findings) {
    if (f.kind !== 'contrast' && f.kind !== 'contrast-unresolved') {
      others.push(f)
      continue
    }
    const key = `${f.owner}|${f.key}`
    const held = groups.get(key) ?? { first: f, surfaces: [] }
    if (!held.surfaces.includes(f.surface)) held.surfaces.push(f.surface)
    if (f.ratio < held.first.ratio) held.first = f
    groups.set(key, held)
  }
  return { others, groups: [...groups.values()] }
}

/** One group as one finding: the worst reading, with the other routes named. */
function foldGroup({ first, surfaces }) {
  const rest = surfaces.filter((s) => s !== first.surface)
  return rest.length ? { ...first, detail: `${first.detail} Also on ${rest.join(', ')}.` } : first
}

/** Each owner's findings of each kind, capped, with a closing line counting the rest. */
function capByOwner(folded) {
  const capped = []
  for (const owner of new Set(folded.map((f) => f.owner))) {
    for (const kind of ['contrast', 'contrast-unresolved']) {
      capped.push(
        ...capOwnerKind(
          folded.filter((f) => f.owner === owner && f.kind === kind),
          kind
        )
      )
    }
  }
  return capped
}

/**
 * Fold the text-contrast findings of a whole run into one list. The same
 * element on the same colours turns up on every route and rung that renders
 * it; that is one fault, kept at its worst reading with the other routes
 * named. What is left is capped per owner, worst first, and a closing line
 * counts the rest, so a bad night is a short brief and not a page.
 *
 * Other findings pass through untouched, ahead of the text-contrast ones.
 *
 * @param {Array<object>} findings gate findings, each with `surface`
 * @returns {Array<object>}
 */
export function collapseTextContrast(findings) {
  const { others, groups } = groupTextContrast(findings)
  return [...others, ...capByOwner(groups.map(foldGroup))]
}
