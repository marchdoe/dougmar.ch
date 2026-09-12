/**
 * WCAG contrast arithmetic, kept apart from the surface gate so the same
 * maths can serve nav labels later (#503).
 *
 * Nothing in here touches a DOM. Callers hand in `{ r, g, b }` on a 0–255
 * scale, which is what a parsed `getComputedStyle(...).color` gives, and get
 * back the relative luminance and the contrast ratio the WCAG 2.x definitions
 * describe. Alpha is not composited: the gate treats "alpha > 0" as painted
 * and reads the channels as they are.
 *
 * @module
 */

/**
 * Relative luminance of an sRGB colour, per WCAG 2.x.
 *
 * @param {{ r: number, g: number, b: number }} rgb channels on 0–255
 * @returns {number} 0 for black, 1 for white
 */
export function relativeLuminance({ r, g, b }) {
  const channel = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/**
 * Contrast ratio between two colours: `(L1 + 0.05) / (L2 + 0.05)` with L1 the
 * lighter of the pair, so the result is always at least 1 and at most 21.
 *
 * @param {{ r: number, g: number, b: number }} a
 * @param {{ r: number, g: number, b: number }} b
 * @returns {number}
 */
export function contrastRatio(a, b) {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [light, dark] = la >= lb ? [la, lb] : [lb, la]
  return (light + 0.05) / (dark + 0.05)
}

/**
 * `#rrggbb` for a finding's detail line. Channels are rounded first because a
 * computed style can carry fractions once a colour has been through an
 * `oklch()` or `color-mix()`.
 *
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {string}
 */
export function rgbToHex({ r, g, b }) {
  const hex = (c) =>
    Math.max(0, Math.min(255, Math.round(c)))
      .toString(16)
      .padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}
