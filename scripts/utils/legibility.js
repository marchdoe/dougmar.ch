/**
 * What the gate reads off a page for legibility (#569): the characters on
 * every line of running copy, and, at the phone, the boxes of all visible
 * text. Both are read with the page revealed, so text that fades in as it
 * scrolls into view is there to be measured, and both in the light scheme
 * only: the layout is the same in the dark one.
 *
 * The line-length probe is `line-length-page.js` and the density probe is
 * `text-density-page.js`; what they mean is `line-length.js` and
 * `text-density.js`.
 *
 * @module
 */

import { collectLineLength } from './line-length-page.js'
import { withRevealedPage } from './text-contrast-page.js'
import { collectTextRects } from './text-density-page.js'

/** The rung whose density is measured: the phone, where a fold is a screen. */
export const DENSITY_RUNG = 'mobile'

/** The scheme both are measured in. */
export const LEGIBILITY_SCHEME = 'light'

/**
 * @param {import('playwright').Page} page
 * @param {{ viewport: { name: string }, scheme: string }} args
 * @returns {Promise<{ lineLength: { blocks: Array<object> }|null,
 *   textDensity: { width: number, height: number, rects: Array<number[]> }|null }>}
 */
export async function measureLegibility(page, { viewport, scheme }) {
  if (scheme !== LEGIBILITY_SCHEME) return { lineLength: null, textDensity: null }
  return await withRevealedPage(page, async () => ({
    lineLength: await collectLineLength(page),
    textDensity: viewport.name === DENSITY_RUNG ? await collectTextRects(page) : null,
  }))
}
