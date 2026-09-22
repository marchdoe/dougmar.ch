/**
 * The tablet rung of the surface gate (#565).
 *
 * The gate measured a phone and a desktop and nothing between them, so a
 * layout meant for 1440 that was only squeezed at 820 shipped: on 2026-09-20
 * the home register set 46.75px titles in 150px rows, and no measurement or
 * image was taken at that width. The rung answers the two questions that hold
 * at any width: does the document run past the screen, and is anything cut
 * off inside it. Line length rides along (#569): 820 is where a single column
 * is widest against its type, so it is the rung that check needs most. So
 * does the shell's text over a hand-written route's (#640): on 2026-09-21 the
 * lockup sat on /work's masthead at 820 and cleared it at 360 and 1440.
 *
 * Everything else the gate asks is either a phone question (tap targets), a
 * desktop question (the h1 inside the 900px fold, the words on the page, the
 * brand mark's height) or is settled once per route by the rungs that already
 * run it (text contrast, the type-size floors, console errors). A tablet
 * measurement carries none of those fields, so `evaluateMeasurement` reads it
 * without a branch: a check whose input is absent reports nothing.
 *
 * @module
 */

/** The name `VIEWPORT_RUNGS` gives the tablet, and the label on its findings. */
export const TABLET_RUNG = 'tablet'

/**
 * The measurement a tablet visit keeps.
 *
 * @param {object} base - `{ id, route, viewport, scheme }` from `measureRoute`
 * @param {object} seen - what the visit read off the page
 * @param {number|null} seen.status - the HTTP status of the navigation
 * @param {{ scrollWidth: number, clientWidth: number, allowsXOverflow: boolean }} seen.box
 * @param {Array<object>} seen.clipped - from `findClippedElements`
 * @param {{ blocks: Array<object> }|null} [seen.lineLength] - from `measureLegibility`;
 *   null in the dark scheme, where it is not taken
 * @param {Array<object>|null} [seen.shellOverlap] - from `measureShellOverlap` (#640);
 *   null in the dark scheme, where it is not taken
 * @returns {object} a measurement `evaluateMeasurement` reads
 */
export function tabletMeasurement(base, { status, box, clipped, lineLength, shellOverlap }) {
  const { scrollWidth, clientWidth, allowsXOverflow } = box
  return {
    ...base,
    status,
    scrollWidth,
    clientWidth,
    allowsXOverflow,
    clipped,
    ...(lineLength ? { lineLength } : {}),
    ...(shellOverlap ? { shellOverlap } : {}),
    consoleErrors: [],
  }
}
