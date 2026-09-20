// Hand-written declarations for contrast.js so app code can import the WCAG
// arithmetic without allowJs. Keep in sync with the JS exports.

/** Channels on a 0 to 255 scale. */
export interface Rgb {
  r: number
  g: number
  b: number
}

/** Relative luminance per WCAG 2.x: 0 for black, 1 for white. */
export function relativeLuminance(rgb: Rgb): number

/** Contrast ratio between two colours, from 1 to 21. */
export function contrastRatio(a: Rgb, b: Rgb): number

/** `#rrggbb` for a colour, channels rounded and clamped. */
export function rgbToHex(rgb: Rgb): string
