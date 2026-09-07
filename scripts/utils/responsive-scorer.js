import { chromium } from '@playwright/test'
import { OVERFLOW_TOLERANCE_PX, findClippedElements } from './surface-gate.js'
import { measureDesignFidelity } from './design-fidelity.js'
import { BODY_TEXT_MIN_PX, TAP_TARGET_MIN_PX } from './responsive-thresholds.js'

/**
 * What each check measures against. The checks below run inside the page
 * via page.evaluate, where module scope does not exist, so these are passed
 * in as an argument rather than closed over — that is why they were bare
 * numbers in three places until #225. Values unchanged.
 */
export const RESPONSIVE_THRESHOLDS = {
  /** Smallest body text that is comfortably readable on a phone. */
  bodyTextMinPx: BODY_TEXT_MIN_PX,
  /** WCAG 2.5.5 target size, and Apple's HIG minimum. */
  tapTargetMinPx: TAP_TARGET_MIN_PX,
  /** Tap targets are only judged at widths a thumb operates. */
  tapTargetMaxViewportPx: 768,
  /** Average characters per rendered line before a paragraph reads as a wall. */
  lineLengthMaxChars: 75,
  /**
   * The surface gate's own overflow tolerance, imported rather than
   * redeclared, so this check and evaluateMeasurement in surface-gate.js
   * never disagree on what counts as overflow (#319).
   */
  overflowTolerancePx: OVERFLOW_TOLERANCE_PX,
}

const CHECKS = {
  // window.innerWidth includes the vertical scrollbar; clientWidth does not,
  // so the two disagreed on any overflow smaller than a scrollbar. Matching
  // the surface gate's own scrollWidth - clientWidth definition, with the
  // same tolerance, keeps the two from disagreeing in the nightly record
  // (#319).
  horizontalScroll: (_vw, t) =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth >
    t.overflowTolerancePx,
  // The surface gate's own detector, imported rather than kept as a second
  // copy. This one used to be the only place clipping was measured, it
  // double-counted a clipped parent and its children, it honoured no opt-out,
  // and the file it wrote had no reader. The gate now fails a build on the
  // same numbers, so the two must not be able to disagree.
  clippedElements: findClippedElements,
  headerOverlap: () => {
    const header = document.querySelector('header') || document.querySelector('nav')
    if (!header) return []
    const kids = [...header.children].map((el) => ({ el, r: el.getBoundingClientRect() }))
    const overlaps = []
    for (let i = 0; i < kids.length; i++) {
      for (let j = i + 1; j < kids.length; j++) {
        const a = kids[i].r,
          b = kids[j].r
        const xOverlap = !(a.right <= b.left || b.right <= a.left)
        const yOverlap = !(a.bottom <= b.top || b.bottom <= a.top)
        if (xOverlap && yOverlap) {
          overlaps.push({
            a: kids[i].el.tagName + (kids[i].el.className ? `.${kids[i].el.className}` : ''),
            b: kids[j].el.tagName + (kids[j].el.className ? `.${kids[j].el.className}` : ''),
          })
        }
      }
    }
    return overlaps
  },
  // Running copy only: paragraphs, list items and block quotes. This used to
  // take the minimum over every text node in main, and since the chassis
  // `small` step is 11.2px (#257) a caption or label failed it every night,
  // which made the mobile score noise (#469). The 16px floor is a reading
  // floor; captions sit below it by design.
  bodyTextSize: (_vw, t) => {
    const root = document.querySelector('main') || document.body
    let min = Infinity
    for (const el of root.querySelectorAll('p, li, blockquote')) {
      const text = (el.textContent || '').trim()
      if (text.length < 8) continue
      const fs = parseFloat(getComputedStyle(el).fontSize)
      if (fs && fs < min) min = fs
    }
    if (min === Infinity) return { min: null, passing: true }
    return { min: Math.round(min * 10) / 10, passing: min >= t.bodyTextMinPx }
  },
  tapTargetFailures: (viewportWidth, t) => {
    if (viewportWidth > t.tapTargetMaxViewportPx) return []
    const selectors = 'a[href], button, [role="button"], input[type="button"], input[type="submit"]'
    const out = []
    for (const el of document.querySelectorAll(selectors)) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.width < t.tapTargetMinPx || r.height < t.tapTargetMinPx) {
        out.push({
          tag: el.tagName,
          text: (el.textContent || '').trim().slice(0, 30),
          w: Math.round(r.width),
          h: Math.round(r.height),
        })
      }
    }
    return out
  },
  lineLengthFailures: (_vw, t) => {
    // Approximate: chars per paragraph / rendered line count.
    // Rendered lines ≈ clientHeight / computed line-height.
    const out = []
    for (const p of document.querySelectorAll('p')) {
      const text = (p.textContent || '').trim()
      if (text.length < 100) continue
      const cs = getComputedStyle(p)
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5
      const lines = Math.max(1, Math.round(p.clientHeight / lh))
      const avgChars = text.length / lines
      if (avgChars > t.lineLengthMaxChars) {
        out.push({
          chars: text.length,
          lines,
          avgPerLine: Math.round(avgChars),
          excerpt: text.slice(0, 40),
        })
      }
    }
    return out
  },
}

/**
 * Count failures for a viewport's checks.
 */
function countFailures(checks) {
  let n = 0
  if (checks.horizontalScroll) n++
  if (Array.isArray(checks.clippedElements) && checks.clippedElements.length) n++
  if (Array.isArray(checks.headerOverlap) && checks.headerOverlap.length) n++
  if (checks.bodyTextSize && checks.bodyTextSize.passing === false) n++
  if (Array.isArray(checks.tapTargetFailures) && checks.tapTargetFailures.length) n++
  if (Array.isArray(checks.lineLengthFailures) && checks.lineLengthFailures.length) n++
  return n
}

/** failure count → 1..5 (inverted, capped at 4+ failures = 1) */
function scoreFromFailureCount(n) {
  if (n === 0) return 5
  if (n === 1) return 4
  if (n === 2) return 3
  if (n === 3) return 2
  return 1
}

/** Pick the first failing check type (for worstFailure reporting) */
function firstFailingCheck(checks) {
  if (checks.horizontalScroll) return 'horizontalScroll'
  if (checks.clippedElements?.length) return 'clippedElements'
  if (checks.headerOverlap?.length) return 'headerOverlap'
  if (checks.bodyTextSize?.passing === false) return 'bodyTextSize'
  if (checks.tapTargetFailures?.length) return 'tapTargetFailures'
  if (checks.lineLengthFailures?.length) return 'lineLengthFailures'
  return null
}

function formatFailureDetail(check, viewportResult) {
  const c = viewportResult.checks
  switch (check) {
    case 'horizontalScroll':
      // scrollWidth vs clientWidth now, not innerWidth (#319) — the message
      // named "viewport" for the reader's context, not the comparison basis,
      // so it still reads correctly with the tolerance spelled out.
      return `document.scrollWidth exceeded clientWidth by more than ${RESPONSIVE_THRESHOLDS.overflowTolerancePx}px at the ${viewportResult.width}px viewport`
    case 'clippedElements':
      return `${c.clippedElements.length} element(s) clipped (first: <${c.clippedElements[0].tag}>)`
    case 'headerOverlap':
      return `${c.headerOverlap.length} overlapping pair(s) in the header`
    case 'bodyTextSize':
      return `body text min ${c.bodyTextSize.min}px (floor ${RESPONSIVE_THRESHOLDS.bodyTextMinPx}px)`
    case 'tapTargetFailures':
      return `${c.tapTargetFailures.length} interactive element(s) below ${RESPONSIVE_THRESHOLDS.tapTargetMinPx}×${RESPONSIVE_THRESHOLDS.tapTargetMinPx}px`
    case 'lineLengthFailures':
      return `${c.lineLengthFailures.length} paragraph(s) over ${RESPONSIVE_THRESHOLDS.lineLengthMaxChars} chars per line`
    default:
      return 'unknown'
  }
}

/**
 * Score a URL across viewports.
 * Each check runs in the page context after setting viewport.
 *
 * @param {string} url
 * @param {Array<{name, width, height}>} viewports
 * @param {object} [opts]
 * @param {import('@playwright/test').Browser} [opts.browser] - optional
 *   externally-managed browser (tests reuse one; production launches its own)
 * @returns {Promise<object>} metrics, plus `measured` (design-fidelity
 *   numbers, see design-fidelity.js) when a `desktop` viewport ran, else null
 */
export async function scoreResponsive(url, viewports, opts = {}) {
  const ownBrowser = !opts.browser
  const browser = opts.browser || (await chromium.launch({ headless: true }))

  try {
    const page = await browser.newPage()
    const viewportResults = {}
    let measured = null

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(url, { waitUntil: 'load', timeout: 30000 })
      await page.waitForTimeout(300)

      const checks = {}
      for (const [name, fn] of Object.entries(CHECKS)) {
        // The check runs in the page, so it gets the viewport width and the
        // thresholds as arguments — module scope is not there to close over.
        checks[name] = await page.evaluate(
          ([fnStr, vw, thresholds]) => {
            // eslint-disable-next-line no-new-func
            const f = new Function(`return ${fnStr}`)()
            return f(vw, thresholds)
          },
          [fn.toString(), vp.width, RESPONSIVE_THRESHOLDS]
        )
      }

      viewportResults[vp.name] = {
        width: vp.width,
        height: vp.height,
        checks,
        score: scoreFromFailureCount(countFailures(checks)),
      }

      // The achieved MEASURABLES numbers (#456) — declared floors are desktop
      // numbers, so this rides the desktop rung of the pass this loop already
      // runs, rather than opening a second page or a second browser.
      if (vp.name === 'desktop') {
        measured = await page.evaluate(measureDesignFidelity)
      }
    }

    const overallScore = Math.min(...Object.values(viewportResults).map((v) => v.score))

    let worstFailure = null
    const worstVp = Object.entries(viewportResults).sort(([, a], [, b]) => a.score - b.score)[0]
    if (worstVp && worstVp[1].score < 5) {
      const [vpName, vpResult] = worstVp
      const check = firstFailingCheck(vpResult.checks)
      if (check) {
        worstFailure = {
          viewport: vpName,
          check,
          detail: formatFailureDetail(check, vpResult),
        }
      }
    }

    await page.close()
    return { viewports: viewportResults, overallScore, worstFailure, measured }
  } finally {
    if (ownBrowser) await browser.close()
  }
}
