/**
 * Screenshot Critic — block assembly for the final pre-archive vision gate.
 * Pulled out of design-agents.js so the image-count guard and best-rated
 * reference wiring are unit-testable without the full orchestrator.
 */
import { imageBlock, textBlock } from '../utils/claude-sdk.js'

/**
 * Hard ceiling on image blocks per call: mockup + light at 1440 + the same
 * page at 360 + dark at 1440 + the two header crops + a project page + one
 * calibration reference.
 *
 * The header crops cost about 1.2k image tokens each and are the only place
 * the critic can read a mark size off (#254). The project-page capture is the
 * only place it sees anything but the homepage: `/work/<slug>` shipped its
 * prev/next navigation rendered twice at every viewport in both schemes, and
 * no critic had ever opened that route (#215). When the ceiling binds it is
 * the calibration reference that is dropped, then the route captures — never
 * a crop, and never the phone.
 *
 * The phone render took the share card's slot rather than a ninth block. A
 * 1200×630 OG card is a fixed composition measurement already covers, so
 * nothing about it is a layout judgement; the same page at 360 is where the
 * design either survives or stops existing, and on 2026-09-04 it stopped
 * existing while every automatic check passed. At 360 the image costs roughly
 * a fifth of a desktop one, so the swap is cheaper than what it replaced.
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
 *   rendered homepage: both schemes at 1440, plus the light scheme at 360
 * @param {Array<{ label: string, png: Buffer }>} [ctx.routeShots] - additional
 *   routes in the canonical scheme, appended while the ceiling allows
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
    // The phone sits next to the desktop shot it is judged against, before
    // the dark adaptation. Section 10 of the prompt is judged on this pair.
    ...shot(
      'The SAME page at 360×640 (PHONE), light scheme. Section 10 is judged on this against ' +
        'the image above it:',
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

  const countImages = () => blocks.filter((b) => b.type === 'image').length

  // Other surfaces the pipeline rewrites nightly. These are PNG, straight from
  // captureRouteScreenshot — not the JPEG pair captureScreenshot returns. They
  // are appended only while one slot is still left for the calibration
  // reference below.
  for (const [i, route] of (ctx.routeShots ?? []).entries()) {
    if (countImages() >= MAX_SCREENSHOT_CRITIC_IMAGES - 1) break
    if (i === 0) {
      blocks.push(
        textBlock(
          'Other surfaces this build rewrote. They wear the same design and are judged by the same brief, but they are not the homepage and should not be expected to repeat its composition.'
        )
      )
    }
    blocks.push(...shot(route.label, route.png, 'image/png'))
  }

  if (ctx.bestReference && countImages() < MAX_SCREENSHOT_CRITIC_IMAGES) {
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
