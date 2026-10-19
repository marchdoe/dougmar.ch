/**
 * Which colour mode the brand mark may use on a given ground.
 *
 * The owner's rule (2026-10-18): "almost always try to use the full color
 * logo, only use the monochromatic when it fails an accessibility test."
 * Before it, the Art Director picked whichever mode "sat better", and
 * `single-color` won 16 of 17 builds, so the green-and-blue mark almost
 * never reached the page.
 *
 * The test is WCAG 1.4.11 (non-text contrast, 3:1). The full-colour mark is
 * defined by three colours: its white disc, its green ring and its blue
 * tail. It passes on a ground when at least one of them reaches 3:1 against
 * that ground, because then the mark's shape still reads. When none does,
 * it fails, and the `single-color` mark is allowed, with its own ink held
 * to the same 3:1 (the surface gate's `brand-contrast`).
 *
 * The mockup pre-check and the surface gate both call this; nothing else
 * defines the test.
 *
 * @module
 */

import { contrastRatio, rgbToHex } from './contrast.js'

/** WCAG 1.4.11's floor for non-text graphics. */
export const MARK_CONTRAST_MIN = 3

/** The colours that define the full-colour mark (`app/assets/logo.svg`). */
const ORIGINAL_MARK_COLOURS = Object.freeze([
  { name: 'white disc', rgb: { r: 255, g: 255, b: 255 } },
  { name: 'green', rgb: { r: 122, g: 192, b: 66 } },
  { name: 'blue', rgb: { r: 0, g: 142, b: 211 } },
])

/**
 * The full-colour mark against one ground.
 *
 * @param {{ r: number, g: number, b: number }} ground channels on 0–255
 * @returns {{ passes: boolean,
 *   best: { name: string, hex: string, ratio: number },
 *   ratios: Array<{ name: string, hex: string, ratio: number }> }}
 *   `ratios` in disc, green, blue order; `best` is the highest of them
 */
export function originalMarkContrast(ground) {
  const ratios = ORIGINAL_MARK_COLOURS.map(({ name, rgb }) => ({
    name,
    hex: rgbToHex(rgb),
    ratio: contrastRatio(rgb, ground),
  }))
  const best = ratios.reduce((a, b) => (b.ratio > a.ratio ? b : a))
  return { passes: best.ratio >= MARK_CONTRAST_MIN, best, ratios }
}

/**
 * A ratio for a finding's detail, rounded down to one decimal so a 2.97
 * never prints as "3.0:1" beside "under 3:1".
 *
 * @param {number} ratio
 * @returns {string}
 */
export function formatMarkRatio(ratio) {
  return (Math.floor(ratio * 10) / 10).toFixed(1)
}

/** The two colour modes the mark has. */
export const BRAND_COLOR_MODES = Object.freeze(['original', 'single-color'])

/**
 * Read a `brand_color_mode` declaration into one mode per colour scheme.
 *
 * Two forms are valid. A bare mode (`original`, `single-color`) holds in
 * both schemes. The per-scheme form, `light=original dark=single-color`
 * (either order, comma or space between), is for a header whose ground
 * passes the contrast test in one scheme and fails it in the other (owner,
 * 2026-10-19): `<BrandLockup>` then renders both marks and the site's
 * `.light`/`.dark` class shows the one for the scheme in force.
 *
 * @param {string|null|undefined} value
 * @returns {{ light: string, dark: string }|null} null when it is neither form
 */
export function parseBrandColorMode(value) {
  const text = String(value ?? '')
    .toLowerCase()
    .trim()
  if (BRAND_COLOR_MODES.includes(text)) return { light: text, dark: text }
  const out = {}
  for (const part of text
    .replace(/\s*[=:]\s*/g, '=')
    .split(/[\s,]+/)
    .filter(Boolean)) {
    const m = /^(light|dark)=(.+)$/.exec(part)
    if (!m || !BRAND_COLOR_MODES.includes(m[2]) || out[m[1]]) return null
    out[m[1]] = m[2]
  }
  return out.light && out.dark ? { light: out.light, dark: out.dark } : null
}

/**
 * The canonical spelling of a parsed declaration: the bare mode when both
 * schemes agree, else `light=<mode> dark=<mode>`.
 *
 * @param {{ light: string, dark: string }} modes
 * @returns {string}
 */
export function formatBrandColorMode({ light, dark }) {
  return light === dark ? light : `light=${light} dark=${dark}`
}
