/**
 * Screenshot Critic — block assembly and the verdict read for the final
 * pre-archive vision gate. Pulled out of design-agents.js so the image-count
 * guard, the best-rated reference wiring and the no-verdict rule are
 * unit-testable without the full orchestrator.
 */
import { NARROW_VIEWPORT, TABLET_VIEWPORT } from '../../elements/chassis/viewports.js'
import { budgetFor } from '../utils/budgets.js'
import { imageBlock, textBlock } from '../utils/claude-sdk.js'
import { parseBarLine, parseCriticVerdict } from '../utils/critic-verdict.js'
import { newBoundaryId, wrapAsData } from '../utils/data-boundary.js'
import { describeHeaderCropAnchor } from '../utils/snapshot.js'
import { callVisionAgent } from '../utils/vision-router.js'
import { VisionTruncatedError } from '../utils/vision-truncated-error.js'

/**
 * Hard ceiling on image blocks per call: mockup + light at 1440 + a phone
 * filmstrip of the home page + a tablet still of the home page + dark at 1440
 * + the two header crops is seven, and the motion strip is the eighth on a
 * night that declared motion. The dark capture is only sent when it differs
 * from the light one, and it did on all ten sealed nights 2026-09-11 to
 * 2026-09-20; the motion strip was taken on six of them. What is left for the
 * case study's desktop filmstrip, the two phone filmstrips, a project page and
 * one calibration reference to compete over is one slot, or none.
 *
 * The header crops cost about 1.2k image tokens each and are the only place
 * the critic can read a mark size off (#254). `/work/<slug>` shipped its
 * prev/next navigation rendered twice at every viewport in both schemes, and
 * no critic had ever opened that route (#215).
 *
 * When the ceiling binds, the calibration reference drops first, then the
 * 1440 route captures, then the filmstrips in the order below: never a crop.
 * The tablet still (#565) took the eighth slot on a typical night, so that
 * night loses the calibration reference.
 *
 * The case study's desktop filmstrip (#569) is a fact no measurement has: the
 * gate cannot see a 568px column at the left with the rest of the row empty,
 * and `screenshot-critic.md` names it as a failure. It goes first among the
 * filmstrips, ahead of the two phone ones, which the phone gate measures at the
 * phone. It costs a slot the ceiling did not have, and on the ten nights above
 * no route capture of the case study reached the critic at all (the 1440 still
 * of it was squeezed out on every night that had a mockup and both crops), so
 * there was no image to trade it for. The ceiling goes from eight to nine
 * instead: that drops nothing that shipped on any of those nights. A dark-only
 * night now carries /about's phone filmstrip beside it, as before, and a
 * dark-and-motion night carries the desktop filmstrip and no phone filmstrip,
 * as before it carried none. The case study's phone filmstrip fits on neither.
 * Until #466 only the home page ever got a phone image at all, and it was a
 * single 640px crop rather than the whole page; `/about` at 9361px tall had
 * never been seen by a critic in any form.
 *
 * It stops at nine on purpose. The geometry of every route at every rung is
 * already covered by `surface-gate.js`, which measures rather than looks and
 * so costs nothing; images are reserved for the judgements measurement cannot
 * make. Raising this further buys re-litigation of facts the gate already
 * established, at roughly 1.5k tokens an image.
 */
export const MAX_SCREENSHOT_CRITIC_IMAGES = 9

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
 * Filmstrips of other routes: the phone filmstrips of /about and a case
 * study, which the phone gate never covered before #466, and the desktop
 * filmstrip of the case study (#569). Pushed ahead of the 1440 route captures
 * and the calibration reference so the ceiling squeezes those first: a design
 * that dies at 360 on /about is worse than losing a bar-setting comparison.
 * Returns the blocks to append; never mutates `existing`.
 *
 * @param {Array<{type: string}>} existing - blocks already assembled
 * @param {Array<{ label: string, jpeg: Buffer }>} [filmstrips] in the order
 *   the ceiling should keep them
 * @returns {Array<{type: string, text?: string, source?: object}>}
 */
function filmstripBlocks(existing, filmstrips) {
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
 * @param {string} [ctx.shell] - the day's ===SHELL=== declaration (#505); the ground material line is judged against it
 * @param {string} [ctx.header] - the day's ===HEADER=== declaration
 * @param {string} [ctx.typeTreatment] - the day's ===TYPE_TREATMENT=== declaration (#502); section 11 is judged against it
 * @param {string} [ctx.mobile] - the day's ===MOBILE=== declaration (#452); section 10 is judged against it
 * @param {string} [ctx.motion] - the day's ===MOTION=== declaration (#506); section 12 is judged against it
 * @param {string|null} [ctx.collapse] - the composition's collapse axis value
 * @param {string} [ctx.measuredFaults] - rendered output of
 *   `surface-gate.formatFindingsForCritic`; empty string when nothing is wrong
 * @param {string} [ctx.references] - design reference block, if any; it carries
 *   awwwards and sidebar titles a stranger wrote, so it goes inside a boundary tag
 * @param {string} [ctx.boundaryId] - the run's boundary suffix (data-boundary.js);
 *   a random one is drawn when the caller has none
 * @param {{ jpeg: Buffer, headerJpeg?: Buffer|null, headerCropAnchor?: 'mark'|'placement'|null } | null} [ctx.mockupScreenshot] - approved mockup, if any
 * @param {{ jpeg: Buffer, darkJpeg?: Buffer|null, headerJpeg?: Buffer|null, headerCropAnchor?: 'mark'|'placement'|null, mobileJpeg?: Buffer|null, tabletJpeg?: Buffer|null, motionStripJpeg?: Buffer|null }} ctx.screenshotBuffer -
 *   rendered homepage: both schemes at 1440 (the dark one only when it
 *   differs from the light one), plus a phone filmstrip of the
 *   whole page in the light scheme, plus the first screen at the tablet
 *   width (#565), plus the motion frame strip on a night
 *   that declared an entrance or a drifting ground (#506)
 * @param {Array<{ label: string, jpeg: Buffer }>} [ctx.phoneFilmstrips] -
 *   phone filmstrips of other routes (/about, a case study); prioritized
 *   over routeShots and bestReference when the ceiling binds
 * @param {Array<{ label: string, jpeg: Buffer }>} [ctx.desktopFilmstrips] -
 *   the whole case study at 1440 (#569); kept ahead of the phone filmstrips
 * @param {Array<{ label: string, png: Buffer }>} [ctx.routeShots] - additional
 *   routes in the canonical scheme at 1440, appended while the ceiling allows
 * @param {{ buffer: Buffer, description: string } | null} [ctx.bestReference] -
 *   the owner's highest-rated past build, for BAR calibration
 * @returns {Array<{type: string, text?: string, source?: object}>}
 */
export function buildScreenshotCriticBlocks(ctx) {
  const boundaryId = ctx.boundaryId ?? newBoundaryId()
  // Null when the dark capture matched the light one byte for byte, which is
  // every design that defines no `_light` tokens (see captureScreenshot).
  const hasDark = Boolean(ctx.screenshotBuffer.darkJpeg)
  const blocks = [
    // enrichedBrief carries hero copy, rationale, and the full visual spec.
    textBlock(`## Structured Brief\n\n${ctx.enrichedBrief}`),
    ...prose(ctx.shell && `## Shell Declaration\n\n${ctx.shell}`),
    ...prose(ctx.header && `## Header Declaration\n\n${ctx.header}`),
    ...prose(ctx.typeTreatment && `## Type Treatment (execute exactly)\n\n${ctx.typeTreatment}`),
    ...prose(
      ctx.mobile &&
        `## Mobile Declaration (section 10 is judged against this)\n\ncollapse: ${ctx.collapse ?? '?'}\n${ctx.mobile}`
    ),
    ...prose(
      ctx.motion && `## Motion Declaration (section 12 is judged against this)\n\n${ctx.motion}`
    ),
    ...prose(ctx.measuredFaults),
    ...prose(
      ctx.references &&
        `## Design References\n\n${wrapAsData('references', ctx.references, boundaryId)}`
    ),
    ...shot(
      'The APPROVED MOCKUP screenshot at 1440×900 (fidelity target):',
      ctx.mockupScreenshot?.jpeg
    ),
    textBlock(
      hasDark
        ? "The rendered homepage in BOTH color schemes follows. ONE of them (the design's canonical mode) must match the mockup; the other is an adaptation and must stay a coherent, committed version of the same design — never a washed-out inversion.\n\nLIGHT scheme, 1440×900 (DESKTOP):"
        : "The rendered homepage follows. This design defines one color scheme: captured with the dark scheme requested, the page comes out byte-identical, so that capture is not sent. This render is the design's canonical mode and must match the mockup.\n\nDESKTOP, 1440×900:"
    ),
    imageBlock(ctx.screenshotBuffer.jpeg),
    // The phone filmstrip sits next to the desktop shot it is judged against,
    // before the dark adaptation. Section 10 of the prompt is judged on this
    // pair. It is the whole home page at 360, cut into folds and laid side by
    // side — not the single 640px crop every critic used to receive.
    ...shot(
      `A phone filmstrip of that SAME page, light scheme: the whole page at ${NARROW_VIEWPORT.width} wide, cut into ` +
        "640px folds and laid side by side (the fold labels are ours, not the site's). Section " +
        '10 is judged on this against the image above it:',
      ctx.screenshotBuffer.mobileJpeg
    ),
    // One still of the home page's first screen at the tablet width (#565),
    // in the protected group with the phone and the crops: it is the only
    // image at a width between the other two. Section 10 says what it is for.
    ...shot(
      `The first screen of that SAME page at ${TABLET_VIEWPORT.width}×${TABLET_VIEWPORT.height} (TABLET), light scheme. Section 10 says what to look for:`,
      ctx.screenshotBuffer.tabletJpeg
    ),
    ...shot('DARK scheme, 1440×900 (DESKTOP):', ctx.screenshotBuffer.darkJpeg),
    // Two 2x crops of the header region, mockup first, then render. Section 9
    // of the prompt is judged off these — the full-page shots arrive at 1024px
    // wide, where a mark at a quarter of its declared size is indistinguishable
    // from one at full size (#254).
    ...shot(
      `A 2x crop of the APPROVED MOCKUP's header region.${describeHeaderCropAnchor(ctx.mockupScreenshot?.headerCropAnchor)}`,
      ctx.mockupScreenshot?.headerJpeg
    ),
    ...shot(
      `A 2x crop of the RENDERED page's header region, same viewport.${describeHeaderCropAnchor(ctx.screenshotBuffer.headerCropAnchor)} Measure the mark against the declared mark_px here, and against the mockup crop above:`,
      ctx.screenshotBuffer.headerJpeg
    ),
    // The motion strip (#506): four frames of the light 1440 render at 0,
    // 200, 500 and 1000ms after the hero first painted, laid side by side. Section
    // 12 is judged on it. It sits after the crops and before the
    // discretionary slots, so when the ceiling binds it costs the
    // calibration reference or a route capture, never a crop. Absent on a
    // night that declared no first-paint motion.
    ...shot(
      "A MOTION STRIP of the rendered homepage, light scheme, 1440 wide: four frames at 0, 200, 500 and 1000ms after the hero first painted, left to right (the offset labels are ours, not the site's). Section 12 is judged on this against the Motion Declaration:",
      ctx.screenshotBuffer.motionStripJpeg
    ),
  ]

  // The desktop filmstrip is first: the phone gate measures those pages at the
  // phone and nothing measures what a 568px column leaves empty at 1440, so
  // when the ceiling binds it is a phone filmstrip that goes.
  blocks.push(
    ...filmstripBlocks(blocks, [...(ctx.desktopFilmstrips ?? []), ...(ctx.phoneFilmstrips ?? [])])
  )
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

/**
 * Ask the screenshot critic and read its verdict.
 *
 * The verdict is only a verdict when the critic saw the build. A reply that
 * reached us on any channel other than `sdk-vision` — a text-only fallback,
 * a replayed fixture, or a max_tokens truncation, which the router throws as
 * VisionTruncatedError (#570) — comes back as `UNVERIFIED`. Before that, a
 * truncated call returned the error message as the reply, it parsed as a
 * fail-closed REVISE, and round 1 paid the engineer to revise against it.
 *
 * @param {object} args
 * @param {string} args.systemPrompt
 * @param {Array<{type: string, text?: string, source?: object}>} args.contentBlocks
 * @param {boolean} args.wantsBar - a calibration reference was attached, so a
 *   BAR line is expected in the reply
 * @param {string} [args.purpose] - why the call is made, for the ledger: 'first'
 *   for the build's first judgment, 'rejudge' for the re-judge after a revision
 * @returns {Promise<{ verdict: string, criticResponse: string, visionChannel: string,
 *   bar: { position: string, reason: string } | null }>} `criticResponse` is
 *   the reason, not critique, when the reply was truncated
 */
export async function runScreenshotCritic({ systemPrompt, contentBlocks, wantsBar, purpose }) {
  // Which channel answered. A SHIP reached without pixels is a different
  // claim from one reached with them, so verdicts.json says which it was.
  let visionChannel = 'unknown'
  let criticResponse
  try {
    criticResponse = await callVisionAgent({
      agentName: 'screenshot-critic',
      systemPrompt,
      contentBlocks,
      purpose,
      // The SDK path uses timeoutMs only; the CLI fallback uses both.
      ...budgetFor('screenshot-critic'),
      onChannel: (c) => {
        visionChannel = c
      },
    })
  } catch (err) {
    if (!(err instanceof VisionTruncatedError)) throw err
    console.warn(`  [screenshot-critic] ${err.message} — no verdict`)
    return {
      verdict: 'UNVERIFIED',
      criticResponse: err.message,
      visionChannel: err.channel,
      bar: null,
    }
  }

  if (visionChannel !== 'sdk-vision') {
    console.warn(
      `  [screenshot-critic] verdict reached WITHOUT images (${visionChannel}) — it did not see the design`
    )
    return { verdict: 'UNVERIFIED', criticResponse, visionChannel, bar: null }
  }
  const { verdict } = parseCriticVerdict(criticResponse, 'SHIP')
  // BAR is only expected when a reference image was actually attached;
  // parseBarLine is tolerant regardless — absent is fine either way.
  const bar = wantsBar ? parseBarLine(criticResponse) : null
  if (bar) console.log(`  [screenshot-critic] BAR: ${bar.position} — ${bar.reason}`)

  return { verdict, criticResponse, visionChannel, bar }
}

/**
 * Who the critic's finding goes to, and what it says to them. Only a REVISE
 * carries a finding: a gate-forced revision under a SHIP or an UNVERIFIED goes
 * to the engineer with no critique, since the measured faults are what it is
 * there to fix and `faultsForOwner` already attributed them to the engineer.
 *
 * The FEEDBACK block is taken if the critic emitted one, as
 * parseMockupCriticResponse already does. The old form stripped the first
 * literal "REVISE" anywhere in the prose, so a critic writing "REVISE the hero
 * scale" sent the engineer "the hero scale".
 *
 * @param {string} verdict
 * @param {string} criticResponse
 * @returns {{ responsibleAgent: string, criticFeedback: string }}
 */
export function readRevisionRequest(verdict, criticResponse) {
  const isRevise = verdict === 'REVISE'
  const agentMatch = criticResponse.match(/\*\*Responsible agent:\*\*\s*([\w-]+)/)
  const responsibleAgent = isRevise ? agentMatch?.[1] || 'react-engineer' : 'react-engineer'
  const feedbackBlock = criticResponse.match(/===FEEDBACK===\s*\n([\s\S]*?)(?:===END===|$)/)?.[1]
  const criticFeedback = isRevise
    ? (
        feedbackBlock ??
        criticResponse
          .replace(/===VERDICT===/, '')
          .replace(/===END===/, '')
          .replace(/^\s*REVISE\b/m, '')
      ).trim()
    : ''
  return { responsibleAgent, criticFeedback }
}

/**
 * The line logged when a revision is about to run: the critic's own REVISE, or
 * the gate forcing one on a critic that said SHIP or gave no verdict (#570).
 *
 * @param {string} verdict
 * @param {string} responsibleAgent
 * @param {number} faultCount - engineer-owned faults the gate measured
 * @returns {string}
 */
export function describeRevision(verdict, responsibleAgent, faultCount) {
  if (verdict === 'REVISE') {
    return `  [screenshot-critic] REVISE — responsible: ${responsibleAgent}`
  }
  const criticSaid = verdict === 'UNVERIFIED' ? 'critic gave no verdict' : 'critic said SHIP'
  return `  [surface-gate] ${criticSaid}; revising anyway for ${faultCount} measured fault(s)`
}

/**
 * Log why no revision runs: the critic said SHIP, or it gave no verdict and
 * the build ships as-is (#570).
 *
 * @param {string} verdict
 * @param {string} visionChannel
 */
export function logNoRevision(verdict, visionChannel) {
  if (verdict === 'UNVERIFIED') {
    console.warn(
      `  [screenshot-critic] no verdict (${visionChannel}) — no critic-driven revision, shipping the build as-is`
    )
  } else {
    console.log('  [screenshot-critic] SHIP')
  }
}

/**
 * Record the re-judge of the build a repair round produced (#467), pushing onto
 * `verdicts` and logging as it goes.
 *
 * The build that ships after a repair round only means something if the critic
 * that judged it actually saw it. A REVISE reached through a text-only fallback
 * (or a truncated SDK reply, #486) is not a verified fault: it is no verdict at
 * all, and must never become SHIPPED-WITH-FAULTS, a section that says "the
 * final critique still found a fault," which was never true when nothing was
 * re-seen.
 *
 * A final REVISE does not buy another repair (the owner's call, #467). The
 * build ships, and the fault is logged where the archive, the lessons block and
 * the rating issue can all find it.
 *
 * @param {Array<object>} verdicts - the run's verdict list
 * @param {{ verdict: string, criticResponse: string, visionChannel: string }} final
 * @param {string} remainingFaultsText - the engineer-owned faults the second
 *   measurement still found, already formatted; '' when none
 * @returns {string} the verdict that was recorded
 */
export function recordFinalJudgment(verdicts, final, remainingFaultsText) {
  const sawTheBuild = final.visionChannel === 'sdk-vision'
  const finalVerdict = sawTheBuild ? final.verdict : 'UNVERIFIED'
  verdicts.push({
    critic: 'screenshot-critic',
    round: 'final',
    verdict: finalVerdict,
    feedback: final.criticResponse.slice(0, 2000),
    channel: final.visionChannel,
    ts: Date.now(),
  })
  console.log(`  [screenshot-critic] final verdict: ${finalVerdict}`)

  if (!sawTheBuild) {
    console.warn(
      `  [screenshot-critic] final re-judge did not reach the SDK vision channel (${final.visionChannel}) — recording UNVERIFIED instead of a faults verdict`
    )
  } else if (finalVerdict === 'REVISE') {
    verdicts.push({
      critic: 'ship-gate',
      verdict: 'SHIPPED-WITH-FAULTS',
      feedback: [final.criticResponse.slice(0, 2000), remainingFaultsText]
        .filter(Boolean)
        .join('\n\n'),
      ts: Date.now(),
    })
    console.warn('  [ship-gate] final critic still says REVISE — shipping with the faults logged')
  }
  return finalVerdict
}
