/**
 * Screenshot Critic — block assembly for the final pre-archive vision gate.
 * Pulled out of design-agents.js so the image-count guard and best-rated
 * reference wiring are unit-testable without the full orchestrator.
 */
import { imageBlock, textBlock } from '../utils/claude-sdk.js'

/**
 * Hard ceiling on image blocks per call: mockup + light at 1440 + a phone
 * filmstrip of the home page + dark at 1440 + the two header crops leaves two
 * slots for the /about and case-study phone filmstrips, a project page, and
 * one calibration reference to compete over.
 *
 * The header crops cost about 1.2k image tokens each and are the only place
 * the critic can read a mark size off (#254). The project-page capture is the
 * only 1440 capture that sees anything but the homepage: `/work/<slug>`
 * shipped its prev/next navigation rendered twice at every viewport in both
 * schemes, and no critic had ever opened that route (#215).
 *
 * When the ceiling binds, the calibration reference drops first, then the
 * 1440 route captures — never a crop, and never a phone filmstrip. Until
 * #466 only the home page ever got a phone image at all, and it was a single
 * 640px crop rather than the whole page; `/about` at 9361px tall had never
 * been seen by a critic in any form. A phone filmstrip surviving the ceiling
 * squeeze that used to protect the calibration reference is the point of
 * that reordering.
 *
 * It stops at eight on purpose. The geometry of every route at both rungs is
 * already covered by `surface-gate.js`, which measures rather than looks and
 * so costs nothing; images are reserved for the judgements measurement cannot
 * make. Raising this further buys re-litigation of facts the gate already
 * established, at roughly 1.7k tokens an image.
 */
export const MAX_SCREENSHOT_CRITIC_IMAGES = 8

/**
 * A labelled image, or nothing at all when that capture failed. Every optional
 * image in the turn is a pair — the label is what tells the model which width
 * or which surface it is looking at, so a label without its image is worse
 * than neither.
 *
 * @param {string} label
 * @param {Buffer|null|undefined} buffer
 * @param {string} [mediaType]
 * @returns {Array<{type: string, text?: string, source?: object}>}
 */
function shot(label, buffer, mediaType) {
  return buffer ? [textBlock(label), imageBlock(buffer, mediaType)] : []
}

/** An optional text block, or nothing. */
function prose(text) {
  return text ? [textBlock(text)] : []
}

/** Count of image blocks already assembled — the ceiling only counts images. */
function imageCount(blocks) {
  return blocks.filter((b) => b.type === 'image').length
}

/**
 * Phone filmstrips of /about and a case study — the pages the phone gate
 * never covered before #466. Pushed ahead of the 1440 route captures and
 * the calibration reference so the ceiling squeezes those first: a design
 * that dies at 360 on /about is worse than losing a bar-setting comparison.
 * Returns the blocks to append; never mutates `existing`.
 *
 * @param {Array<{type: string}>} existing - blocks already assembled
 * @param {Array<{ label: string, jpeg: Buffer }>} [filmstrips]
 * @returns {Array<{type: string, text?: string, source?: object}>}
 */
function phoneFilmstripBlocks(existing, filmstrips) {
  const appended = []
  for (const filmstrip of filmstrips ?? []) {
    if (imageCount(existing) + imageCount(appended) >= MAX_SCREENSHOT_CRITIC_IMAGES) break
    appended.push(...shot(filmstrip.label, filmstrip.jpeg))
  }
  return appended
}

/**
 * Other surfaces the pipeline rewrites nightly, announced once. These are
 * PNG, straight from captureRouteScreenshot — not the JPEG pair
 * captureScreenshot returns. Appended only while one slot is still left for
 * the calibration reference. Returns the blocks to append; never mutates
 * `existing`.
 *
 * @param {Array<{type: string}>} existing - blocks already assembled
 * @param {Array<{ label: string, png: Buffer }>} [routeShots]
 * @returns {Array<{type: string, text?: string, source?: object}>}
 */
function routeShotBlocks(existing, routeShots) {
  const appended = []
  for (const [i, route] of (routeShots ?? []).entries()) {
    if (imageCount(existing) + imageCount(appended) >= MAX_SCREENSHOT_CRITIC_IMAGES - 1) break
    if (i === 0) {
      appended.push(
        textBlock(
          'Other surfaces this build rewrote. They wear the same design and are judged by the same brief, but they are not the homepage and should not be expected to repeat its composition.'
        )
      )
    }
    appended.push(...shot(route.label, route.png, 'image/png'))
  }
  return appended
}

/**
 * Assemble the screenshot-critic's user turn.
 *
 * Ordering is deliberate: brief, header declaration, then measured faults,
 * then references, then pixels. The model should know what is already
 * established before it starts forming opinions from a downscaled JPEG.
 *
 * Among the pixels, each image sits next to what it is judged against: the
 * phone render follows the desktop render of the same scheme, and both header
 * crops follow the full-page shots they were cropped from.
 *
 * @param {object} ctx
 * @param {string} ctx.enrichedBrief - hero copy, rationale, visual spec
 * @param {string} [ctx.header] - the day's ===HEADER=== declaration
 * @param {string} [ctx.mobile] - the day's ===MOBILE=== declaration (#452); section 10 is judged against it
 * @param {string|null} [ctx.collapse] - the composition's collapse axis value
 * @param {string} [ctx.measuredFaults] - rendered output of
 *   `surface-gate.formatFindingsForCritic`; empty string when nothing is wrong
 * @param {string} [ctx.references] - design reference block, if any
 * @param {{ jpeg: Buffer, headerJpeg?: Buffer|null } | null} [ctx.mockupScreenshot] - approved mockup, if any
 * @param {{ jpeg: Buffer, darkJpeg: Buffer, headerJpeg?: Buffer|null, mobileJpeg?: Buffer|null }} ctx.screenshotBuffer -
 *   rendered homepage: both schemes at 1440, plus a phone filmstrip of the
 *   whole page in the light scheme
 * @param {Array<{ label: string, jpeg: Buffer }>} [ctx.phoneFilmstrips] -
 *   phone filmstrips of other routes (/about, a case study); prioritized
 *   over routeShots and bestReference when the ceiling binds
 * @param {Array<{ label: string, png: Buffer }>} [ctx.routeShots] - additional
 *   routes in the canonical scheme at 1440, appended while the ceiling allows
 * @param {{ buffer: Buffer, description: string } | null} [ctx.bestReference] -
 *   the owner's highest-rated past build, for BAR calibration
 * @returns {Array<{type: string, text?: string, source?: object}>}
 */
export function buildScreenshotCriticBlocks(ctx) {
  const blocks = [
    // enrichedBrief carries hero copy, rationale, and the full visual spec.
    textBlock(`## Structured Brief\n\n${ctx.enrichedBrief}`),
    ...prose(ctx.header && `## Header Declaration\n\n${ctx.header}`),
    ...prose(
      ctx.mobile &&
        `## Mobile Declaration (section 10 is judged against this)\n\ncollapse: ${ctx.collapse ?? '?'}\n${ctx.mobile}`
    ),
    ...prose(ctx.measuredFaults),
    ...prose(ctx.references && `## Design References\n\n${ctx.references}`),
    ...shot(
      'The APPROVED MOCKUP screenshot at 1440×900 (fidelity target):',
      ctx.mockupScreenshot?.jpeg
    ),
    textBlock(
      "The rendered homepage in BOTH color schemes follows. ONE of them (the design's canonical mode) must match the mockup; the other is an adaptation and must stay a coherent, committed version of the same design — never a washed-out inversion.\n\nLIGHT scheme, 1440×900 (DESKTOP):"
    ),
    imageBlock(ctx.screenshotBuffer.jpeg),
    // The phone filmstrip sits next to the desktop shot it is judged against,
    // before the dark adaptation. Section 10 of the prompt is judged on this
    // pair. It is the whole home page at 360, cut into folds and laid side by
    // side — not the single 640px crop every critic used to receive.
    ...shot(
      'A phone filmstrip of that SAME page, light scheme: the whole page at 360 wide, cut into ' +
        "640px folds and laid side by side (the fold labels are ours, not the site's). Section " +
        '10 is judged on this against the image above it:',
      ctx.screenshotBuffer.mobileJpeg
    ),
    textBlock('DARK scheme, 1440×900 (DESKTOP):'),
    imageBlock(ctx.screenshotBuffer.darkJpeg),
    // Two 2x crops of the header region, mockup first, then render. Section 9
    // of the prompt is judged off these — the full-page shots arrive at 1024px
    // wide, where a mark at a quarter of its declared size is indistinguishable
    // from one at full size (#254).
    ...shot("A 2x crop of the APPROVED MOCKUP's header region:", ctx.mockupScreenshot?.headerJpeg),
    ...shot(
      "A 2x crop of the RENDERED page's header region, same viewport and same region. Measure the mark against the declared mark_px here, and against the mockup crop above:",
      ctx.screenshotBuffer.headerJpeg
    ),
  ]

  blocks.push(...phoneFilmstripBlocks(blocks, ctx.phoneFilmstrips))
  blocks.push(...routeShotBlocks(blocks, ctx.routeShots))

  if (ctx.bestReference && imageCount(blocks) < MAX_SCREENSHOT_CRITIC_IMAGES) {
    // The promoted reference is the archived screenshot.png (findBestScreenshot
    // in collect-ratings.js only ever copies the PNG) — PNG media type, not
    // the default JPEG imageBlock assumes.
    blocks.push(
      ...shot(
        "The owner's highest-rated past build, for calibration:",
        ctx.bestReference.buffer,
        'image/png'
      )
    )
  }

  return blocks
}
