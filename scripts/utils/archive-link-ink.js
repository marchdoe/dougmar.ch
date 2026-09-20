/**
 * The colour of the archive link, chosen against the night's ground (#566).
 *
 * The link ("Archive · N designs") is the secondary link on every page, so it
 * is meant to sit back. It did that with `opacity: 0.55`, which is a fixed
 * fraction of whatever colour the day's `text` is, over whatever the day's
 * `bg` is. A palette that changes nightly cannot hold a ratio that way: the
 * link measured 2.62 to 3.88:1 on 09-17, 09-18 and 09-19.
 *
 * The orchestrator writes `__root.tsx` and `SiteCallout.tsx` after the Art
 * Director's preset exists, so the choice is made at render time. Semantic
 * inks are tried from the quietest to the loudest and the first that reaches
 * {@link ARCHIVE_LINK_MIN_RATIO} against the link's ground wins; `text` is the
 * last resort, and clears 4.5:1 on `bg` by contract.
 *
 * A semantic token can carry a value per condition (`base`, `_light`,
 * `_dark`). The choice has to hold in every one that any of the two tokens
 * defines, so the ratio compared is the lowest across them.
 *
 * @module
 */

import { contrastRatio } from './contrast.js'
import { parsePreset } from './preset-parser.js'

/** WCAG AA for small text. The link is set at the chassis's smallest steps. */
export const ARCHIVE_LINK_MIN_RATIO = 4.5

/** Quietest first. `text` is the fallback and always the last. */
export const ARCHIVE_LINK_INKS = Object.freeze(['textFaint', 'textMuted', 'text'])

/** What the root link and the home callout's link sit on. */
export const ARCHIVE_LINK_GROUNDS = Object.freeze({ root: 'bg', callout: 'bgAlt' })

const CONDITIONS = ['_light', '_dark']
const MAX_REFERENCE_DEPTH = 6

function hexToRgb(value) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim())
  if (!m) return null
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1]
  return {
    r: Number.parseInt(h.slice(0, 2), 16),
    g: Number.parseInt(h.slice(2, 4), 16),
    b: Number.parseInt(h.slice(4, 6), 16),
  }
}

/** The value of a semantic token under one condition, falling back to `base`. */
function valueFor(token, condition) {
  if (typeof token === 'string') return token
  if (token && typeof token === 'object') return token[condition] ?? token.base ?? null
  return null
}

/**
 * Resolve a preset value to `{ r, g, b }`: a hex, or a `{colors.a.b}`
 * reference into the raw ramps or, for one-part names, another semantic token.
 */
function resolveColor(value, colors, condition, depth = 0) {
  if (typeof value !== 'string' || depth > MAX_REFERENCE_DEPTH) return null
  const hex = hexToRgb(value)
  if (hex) return hex
  const ref = /^\{colors\.([^}]+)\}$/.exec(value.trim())
  if (!ref) return null
  const path = ref[1].split('.')
  let node = colors.ramps
  for (const key of path) node = node?.[key]
  if (node === undefined && path.length === 1) node = valueFor(colors.semantic[path[0]], condition)
  return resolveColor(node, colors, condition, depth + 1)
}

/** The conditions any of these tokens defines, plus `base`. */
function conditionsOf(tokens) {
  const found = new Set(['base'])
  for (const token of tokens) {
    if (token && typeof token === 'object') {
      for (const c of CONDITIONS) if (c in token) found.add(c)
    }
  }
  return [...found]
}

/**
 * The lowest contrast between two semantic tokens across every condition
 * either defines. Null when either is missing or will not resolve.
 *
 * @param {{ ramps: object, semantic: object }} colors from `parsePreset`
 * @param {string} inkName
 * @param {string} groundName
 * @returns {number|null}
 */
export function semanticContrast(colors, inkName, groundName) {
  const ink = colors.semantic[inkName]
  const ground = colors.semantic[groundName]
  if (ink === undefined || ground === undefined) return null
  let lowest = Number.POSITIVE_INFINITY
  for (const condition of conditionsOf([ink, ground])) {
    const a = resolveColor(valueFor(ink, condition), colors, condition)
    const b = resolveColor(valueFor(ground, condition), colors, condition)
    if (!a || !b) return null
    lowest = Math.min(lowest, contrastRatio(a, b))
  }
  return lowest
}

/**
 * The token the archive link is set in against one ground.
 *
 * @param {{ ramps: object, semantic: object }} colors from `parsePreset`
 * @param {string} ground semantic token name, e.g. `bg`
 * @returns {{ token: string, ratio: number|null }} `ratio` is null when the
 *   preset defines no ground to measure against
 */
export function chooseInk(colors, ground) {
  const fallback = { token: 'text', ratio: semanticContrast(colors, 'text', ground) }
  for (const token of ARCHIVE_LINK_INKS.slice(0, -1)) {
    const ratio = semanticContrast(colors, token, ground)
    if (ratio !== null && ratio >= ARCHIVE_LINK_MIN_RATIO) return { token, ratio }
  }
  return fallback
}

/**
 * The ink for the root link and for the home callout's link, from the
 * night's `elements/preset.ts`. A preset that will not parse gets `text`.
 * A preset with no `bgAlt` (the July presets, before the contract) measures
 * the callout against `bg`.
 *
 * @param {string} presetSrc contents of elements/preset.ts
 * @returns {{ root: { token: string, ratio: number|null },
 *   callout: { token: string, ratio: number|null } }}
 */
export function archiveLinkInks(presetSrc) {
  let colors
  try {
    colors = parsePreset(presetSrc).colors
  } catch {
    const none = { token: 'text', ratio: null }
    return { root: none, callout: none }
  }
  const calloutGround = colors.semantic.bgAlt === undefined ? 'bg' : ARCHIVE_LINK_GROUNDS.callout
  return {
    root: chooseInk(colors, ARCHIVE_LINK_GROUNDS.root),
    callout: chooseInk(colors, calloutGround),
  }
}

/** Throws unless `token` is one the renderer may write into generated source. */
export function assertArchiveLinkInk(token) {
  if (!ARCHIVE_LINK_INKS.includes(token)) {
    throw new Error(
      `archive link ink must be one of ${ARCHIVE_LINK_INKS.join(', ')}, got: ${token}`
    )
  }
  return token
}
