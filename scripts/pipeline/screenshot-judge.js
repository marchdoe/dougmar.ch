/**
 * The screenshot critic's capture-and-judge path (#221), shared by the
 * gate's first judgment and the final re-judge after the revisions (#467):
 * both go through the same capture and payload function, so a change to
 * either (the phone filmstrip, say) reaches both for free.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NARROW_VIEWPORT, WIDE_VIEWPORT } from '../../elements/chassis/viewports.js'
import { formatHeader } from '../utils/header-grammar.js'
import { formatTypeTreatment } from '../utils/type-grammar.js'
import { formatMobile } from '../utils/mobile-grammar.js'
import { formatMotion } from '../utils/motion-grammar.js'

/**
 * Round-1 judgment, or a verdict with no vote when the critic could not be
 * reached at all.
 *
 * On 2026-09-21 the API account ran out of credits between the engineer and
 * the critic: the SDK call and the CLI fallback both failed, the throw landed
 * in the gate's outer catch, and the run shipped 44 measured faults the
 * surface gate had already said required a revision (#619). Recording the
 * failure as UNVERIFIED keeps the gate-driven revision on the same path a
 * truncated or text-only reply takes (#570). A fatal error still propagates.
 *
 * @param {(gate: object) => Promise<object>} judge
 * @param {object} gate the round's surface-gate result
 * @returns {Promise<{ verdict: string, criticResponse: string, visionChannel: string, bar: object|null }>}
 */
export async function judgeOrNoVerdict(judge, gate) {
  try {
    return await judge(gate)
  } catch (err) {
    if (err.fatal) throw err
    console.warn(`  [screenshot-critic] Failed (non-blocking): ${err.message}`)
    return {
      verdict: 'UNVERIFIED',
      criticResponse: err.message,
      visionChannel: 'call-failed',
      bar: null,
    }
  }
}

/**
 * Phone filmstrips of `/about` and a case study route for the screenshot
 * critic — the pages the phone gate never covered before #466, when only the
 * home page ever got a mobile image, and only its first 640px at that.
 * Pulled out of `judgeScreenshot` so the shared capture-and-critic path
 * (#467) stays under the complexity budget: each capture is independent and
 * best-effort, one failing costs the critic one image, never the run.
 *
 * @param {{ route: string } | null | undefined} slugRoute - the first case
 *   study route, from `listGeneratedRoutes`, or null when none was found
 * @returns {Promise<Array<{ label: string, jpeg: Buffer }>>}
 */
async function capturePhoneFilmstripsForCritic(slugRoute) {
  try {
    const { captureRoutePhoneFilmstrip } = await import('../utils/snapshot.js')
    const filmstripRoutes = [
      { label: '/about', route: '/about' },
      slugRoute ? { label: slugRoute.route, route: slugRoute.route } : null,
    ].filter(Boolean)
    const phoneFilmstrips = []
    for (const r of filmstripRoutes) {
      const jpeg = await captureRoutePhoneFilmstrip(r.route)
      if (jpeg) {
        phoneFilmstrips.push({
          label:
            `A phone filmstrip of ${r.label}, light scheme: the whole page at ${NARROW_VIEWPORT.width} wide, ` +
            "cut into 640px folds and laid side by side (the fold labels are ours, not the site's):",
          jpeg,
        })
      }
    }
    console.log(`  [screenshot-critic] +${phoneFilmstrips.length} phone filmstrips`)
    return phoneFilmstrips
  } catch (err) {
    console.warn(
      `  [screenshot-critic] phone filmstrip capture failed (non-blocking): ${err.message}`
    )
    return []
  }
}

/**
 * The first case study route the build lists, or null when there is none or
 * the list cannot be read. It is the one the critic is sent images of.
 *
 * @param {string} root - repo root
 * @returns {Promise<{ route: string } | null>}
 */
async function firstCaseStudyRoute(root) {
  try {
    const { listGeneratedRoutes } = await import('../utils/surface-gate.js')
    return (await listGeneratedRoutes(root)).find((r) => r.route.startsWith('/work/')) ?? null
  } catch (err) {
    console.warn(`  [screenshot-critic] case study lookup failed (non-blocking): ${err.message}`)
    return null
  }
}

/**
 * The whole first case study at 1440, as one filmstrip for the screenshot
 * critic (#569). Best-effort like the phone filmstrips: a capture that fails
 * costs the critic one image, never the run.
 *
 * @param {{ route: string } | null | undefined} slugRoute - from {@link firstCaseStudyRoute}
 * @returns {Promise<Array<{ label: string, jpeg: Buffer }>>}
 */
async function captureDesktopFilmstripsForCritic(slugRoute) {
  if (!slugRoute) return []
  try {
    const { captureRouteDesktopFilmstrip } = await import('../utils/snapshot.js')
    const jpeg = await captureRouteDesktopFilmstrip(slugRoute.route)
    if (!jpeg) return []
    console.log('  [screenshot-critic] +1 desktop filmstrip')
    return [
      {
        label:
          `A desktop filmstrip of ${slugRoute.route}, light scheme: the whole page at ${WIDE_VIEWPORT.width} wide, ` +
          `cut into ${WIDE_VIEWPORT.height}px folds and laid two across, row by row (the fold labels are ours, not the site's). ` +
          'Judge what the page does with the width below the first fold:',
        jpeg,
      },
    ]
  } catch (err) {
    console.warn(
      `  [screenshot-critic] desktop filmstrip capture failed (non-blocking): ${err.message}`
    )
    return []
  }
}

/**
 * Self-eval calibration: the owner's highest-rated past own build, when one
 * has been auto-promoted into references/ (collect-ratings.js, grade A/B).
 * Best-effort — a missing/unreadable reference just means no calibration
 * question.
 * @param {string} root
 * @returns {Promise<{ buffer: Buffer, description: string }|null>}
 */
async function readBestReference(root) {
  const { findBestRatedReference } = await import('../utils/ratings.js')
  let bestReference = null
  try {
    const found = findBestRatedReference(path.join(root, 'references'))
    if (found) {
      bestReference = { buffer: await readFile(found.path), description: found.description }
      console.log(`  [screenshot-critic] calibrating against ${found.file} (grade ${found.grade})`)
    }
  } catch (err) {
    console.warn(
      `  [screenshot-critic] best-rated reference lookup failed (non-blocking): ${err.message}`
    )
  }
  return bestReference
}

/**
 * Capture the current build and ask the screenshot critic to judge it.
 * The capture becomes `state.finalScreenshot`.
 * @param {import('./run-state.js').RunState} state
 * @param {{ findings?: Array<object>, facts?: string }|null} gate - what the surface
 *   gate measured on this build: its findings, and the measurements that are not faults (#569)
 * @param {'first'|'rejudge'} purpose - why the critic is asked, for the ledger
 * @param {(gate: object|null) => string} formatMeasuredForCritic - surface-gate.js's, loaded by the gate
 * @returns {Promise<{verdict: string, criticResponse: string, visionChannel: string, bar: object|null}>}
 *   `verdict` is 'UNVERIFIED' unless the critic saw the build (#570).
 */
export async function judgeScreenshot(state, gate, purpose, formatMeasuredForCritic) {
  const { root, boundaryId } = state
  const { result: artDirectorResult, chosenComposition } = state.ad
  const { headerDecl, typeDecl, mobileDecl, motionDecl } = state.ad
  console.log('\n[screenshot-critic] Capturing screenshot...')
  const { captureScreenshot } = await import('../utils/snapshot.js')
  const screenshotBuffer = await captureScreenshot(undefined, {
    headerCrop: { placement: headerDecl.placement, heightPx: headerDecl.height_px },
    motion: motionDecl,
  })
  state.finalScreenshot = screenshotBuffer
  console.log(
    `  screenshot captured (png ${(screenshotBuffer.png.length / 1024).toFixed(0)}KB, jpeg ${(screenshotBuffer.jpeg.length / 1024).toFixed(0)}KB)`
  )

  console.log('[screenshot-critic] Evaluating design...')
  // Real image blocks via the SDK when an API key is present. Inlining
  // these JPEGs as base64 data-URIs in a CLI text prompt billed ~300k
  // tokens per image and the model never saw the pixels (a solid-red
  // probe read back as "light gray"). Three image blocks are ~5k tokens.
  const { buildScreenshotCriticBlocks, runScreenshotCritic } = await import(
    '../agents/screenshot-critic.js'
  )
  const bestReference = await readBestReference(root)

  // The first case study, seen whole: at the phone (#466) and at 1440
  // (#569). /work/<slug> is rewritten nightly and shipped its prev/next
  // navigation rendered twice, in two different type treatments, at every
  // viewport (#215); the geometry across every route is covered above by
  // measurement, and what measurement cannot see is a 568px column of
  // copy with the rest of the row empty. The 1440 still of the page's
  // first screen that used to go here is the first tile of the desktop
  // filmstrip now.
  const slugRoute = await firstCaseStudyRoute(root)
  const phoneFilmstrips = await capturePhoneFilmstripsForCritic(slugRoute)
  const desktopFilmstrips = await captureDesktopFilmstripsForCritic(slugRoute)

  const criticBlocks = buildScreenshotCriticBlocks({
    // enrichedBrief carries hero copy, rationale, and the full visual
    // spec. The nightly context has no `brief` key, so the old
    // `${brief}` here rendered the literal string "undefined".
    enrichedBrief: state.design.enrichedBrief,
    // The SHELL text, so the critic can read the declared
    // ground_material against the hero field (#505).
    shell: artDirectorResult.shell,
    header: formatHeader(headerDecl),
    typeTreatment: formatTypeTreatment(typeDecl),
    mobile: formatMobile(mobileDecl),
    collapse: chosenComposition.collapse,
    motion: formatMotion(motionDecl),
    references: state.inputs.references,
    boundaryId,
    mockupScreenshot: state.design.mockupScreenshot,
    screenshotBuffer,
    bestReference,
    phoneFilmstrips,
    desktopFilmstrips,
    measuredFaults: formatMeasuredForCritic(gate),
    purpose,
  })

  return await runScreenshotCritic({
    systemPrompt: state.prompts.screenshotCriticPrompt,
    contentBlocks: criticBlocks,
    wantsBar: Boolean(bestReference),
    purpose,
  })
}
