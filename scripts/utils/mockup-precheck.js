/**
 * The mockup checks that are facts, decided in code before the critic looks.
 *
 * In September the Haiku mockup critic cited Check 2 (canvas, colour, hero
 * scale) 18 times and Check 4 (the mark: present, size, lockup) 19 times in
 * its REVISEs. Both are measurements. The mockup capture already opens the
 * page in Chromium and measures canvas, colour and hero (#487), and the
 * critic was then asked to read those numbers back, or to estimate a mark's
 * height off a 2x crop, which it got wrong in both directions ("~73-77% of
 * declared, below the 60% floor"; "no mark" on a page that had one).
 *
 * This module turns those facts into findings shaped like the surface
 * gate's: a check number, a stable `key`, a `gap` (how far off, in the unit
 * the check uses) and a `detail` that is the instruction the designer gets.
 * The critic keeps the checks a measurement cannot see (3, 5, 7, the header's
 * shape and the phone's idea).
 *
 * Three parts:
 *
 * - `readMockupFacts`, serialised into the page by `captureHtmlFileScreenshot`
 *   at 1440 and at the phone width. Self-contained for the same reason
 *   `measureDesignFidelity` is: Playwright ships it as a string.
 * - `evaluateMockupPrecheck`, pure: facts plus the Art Director's
 *   declarations in, findings out.
 * - `formatPrecheckForDesigner` and `precheckMadeProgress`, which the loop in
 *   phase-mockup.js uses to brief the designer and to stop a round that
 *   cannot converge.
 *
 * @module
 */

import { heroPxAt } from './mockup-rounds.js'

/** A measured floor missed by more than this many points is a fault; the critic's own margin. */
export const FLOOR_MARGIN_POINTS = 5

/** The hero is a fault outside this band of its declared size at 1440. */
export const HERO_BAND = Object.freeze({ min: 0.75, max: 1.25 })

/** A mark rendered under this fraction of `mark_px` is a fault; the critic's own threshold. */
export const MARK_MIN_FRACTION = 0.6

/**
 * A round made progress on a fault it kept when the fault's gap shrank by at
 * least this fraction. Smaller moves are measurement noise: 2026-09-09's
 * canvas went 25.5, 24.5, 25.8 across three paid rounds.
 */
export const PROGRESS_MIN_FRACTION = 0.25

/** At most this many cut texts are listed per round. */
const MAX_CUT_TEXTS = 3

/**
 * Runs inside the page. Reads the facts Check 4 and the measurable half of
 * Check 6 turn on, at whatever viewport the page was opened at, at scroll
 * position zero.
 *
 * The mark is any `<svg>` carrying `data-brand-mark` or the mark's own
 * `viewBox="0 0 71 59"` (the designer pastes the provided source, and most
 * nights drop the data attribute on the way). Its height is the circle's:
 * the smaller of the box's height and its width scaled by the viewBox, so a
 * mark sized by width alone still measures right. `original` is true when a
 * shape inside it paints the mark's own green (#7AC042).
 *
 * The wordmark is the smallest visible element whose text reads "Doug
 * March", nearest the mark, measured with a Range over its text so a
 * full-width block does not read as wide as the page.
 *
 * `cutText` lists visible text (effective opacity 0.5 and up, not under
 * `aria-hidden`) whose own run crosses the viewport's left or right edge.
 *
 * @returns {{ width: number, height: number, scrollWidth: number, markCount: number,
 *   mark: null | { heightPx: number, top: number, inFold: boolean, original: boolean },
 *   wordmark: null | { orientation: 'row'|'column'|'apart'|'unclear', gapPx: number },
 *   cutText: Array<{ text: string, left: number, right: number }> }}
 */
// The helpers below (shown, isMark, textRect, the two walks) live inside
// this one function body for the reason extractTextSegments's do in
// mockup-fidelity.js: Playwright ships the function to the page with
// `toString()`, and a helper at module scope would not exist there.
// fallow-ignore-next-line complexity
export function readMockupFacts() {
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const GREEN = 'rgb(122, 192, 66)'

  const shown = (el) => {
    if (typeof el.checkVisibility === 'function') {
      return el.checkVisibility({ opacityProperty: true, visibilityProperty: true })
    }
    const s = getComputedStyle(el)
    return s.display !== 'none' && s.visibility !== 'hidden' && Number.parseFloat(s.opacity) !== 0
  }
  const inFold = (r) => r.right > 0 && r.bottom > 0 && r.left < vw && r.top < vh
  const round1 = (n) => Math.round(n * 10) / 10

  const isMark = (svg) =>
    svg.hasAttribute('data-brand-mark') ||
    /^\s*0[\s,]+0[\s,]+71[\s,]+59\s*$/.test(svg.getAttribute('viewBox') || '')
  const marks = [...document.querySelectorAll('svg')]
    .filter(isMark)
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ el, r }) => r.width > 0 && r.height > 0 && shown(el))
  const hit = marks.find(({ r }) => inFold(r)) ?? marks[0] ?? null

  let mark = null
  if (hit) {
    const fills = new Set()
    for (const n of hit.el.querySelectorAll('path, circle, rect, ellipse, polygon')) {
      const fill = getComputedStyle(n).fill
      if (fill && fill !== 'none') fills.add(fill)
    }
    mark = {
      heightPx: round1(Math.min(hit.r.height, (hit.r.width * 59) / 71)),
      top: Math.round(hit.r.top),
      inFold: inFold(hit.r),
      original: fills.has(GREEN),
    }
  }

  const textRect = (el) => {
    const range = document.createRange()
    range.selectNodeContents(el)
    return range.getBoundingClientRect()
  }

  let wordmark = null
  if (hit) {
    const m = hit.r
    const candidates = [...document.querySelectorAll('body *')].filter((el) => {
      if (el.closest('svg')) return false
      // `\s*`, not `\s+`: "Doug<br>March" has no space in its textContent.
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim()
      if (!/^doug\s*march$/i.test(text)) return false
      // The smallest element that still holds the whole name.
      return ![...el.children].some((c) => /doug\s*march/i.test(c.textContent || ''))
    })
    let best = null
    for (const el of candidates) {
      if (!shown(el)) continue
      const w = textRect(el)
      if (w.width <= 0 || w.height <= 0) continue
      const dx = Math.max(0, w.left - m.right, m.left - w.right)
      const dy = Math.max(0, w.top - m.bottom, m.top - w.bottom)
      const gap = Math.max(dx, dy)
      if (!best || gap < best.gap) best = { w, gap }
    }
    if (best) {
      const { w, gap } = best
      const vOverlap = Math.min(m.bottom, w.bottom) - Math.max(m.top, w.top)
      const hOverlap = Math.min(m.right, w.right) - Math.max(m.left, w.left)
      let orientation = 'unclear'
      if (gap > Math.max(2 * m.height, 80)) orientation = 'apart'
      else if (vOverlap > 0.3 * Math.min(m.height, w.height) && hOverlap <= 4) orientation = 'row'
      else if (hOverlap > 0 && vOverlap <= 4) orientation = 'column'
      wordmark = { orientation, gapPx: Math.round(gap) }
    }
  }

  const effectiveOpacity = (el) => {
    let o = 1
    for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
      o *= Number.parseFloat(getComputedStyle(a).opacity) || 0
    }
    return o
  }
  const cutText = []
  for (const el of document.querySelectorAll('body *')) {
    if (cutText.length >= 3) break
    if (el.closest('svg') || el.closest('[aria-hidden="true"]')) continue
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && /\S/.test(n.nodeValue))
    if (!own.length || !shown(el) || effectiveOpacity(el) < 0.5) continue
    const r = textRect(el)
    if (r.width <= 0 || r.height <= 0) continue
    if (r.right > vw + 1 || r.left < -1) {
      cutText.push({
        text: own
          .map((n) => n.nodeValue)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 40),
        left: Math.round(r.left),
        right: Math.round(r.right),
      })
    }
  }

  return {
    width: vw,
    height: vh,
    scrollWidth: document.documentElement.scrollWidth,
    markCount: marks.length,
    mark,
    wordmark,
    cutText,
  }
}

/**
 * The orientation a Brand Contract lockup id asks for: `horizontal-*` is the
 * mark beside the name, `stacked-*` the mark above it, `mark-only-*` no name.
 * Read from the prefix, so the retired `horizontal-sm` still resolves.
 * @param {string|null|undefined} lockup
 * @returns {'row'|'column'|'mark'|null}
 */
export function lockupOrientation(lockup) {
  if (typeof lockup !== 'string') return null
  if (lockup.startsWith('horizontal')) return 'row'
  if (lockup.startsWith('stacked')) return 'column'
  if (lockup.startsWith('mark-only')) return 'mark'
  return null
}

const round1 = (n) => Math.round(n * 10) / 10

const finding = (check, key, gap, detail) => ({ check, key, gap, detail })

/**
 * The declarations the pre-check reads, from the Art Director phase's parsed
 * blocks (`state.ad`). Any of them may be missing.
 * @param {{ measurablesDecl?: object|null, headerDecl?: object|null, shellDecl?: object|null }} ad
 * @returns {{ measurables: object|null, markPx: number|null, lockup: string|null, colorMode: string|null }}
 */
export function declaredFromAd({ measurablesDecl, headerDecl, shellDecl } = {}) {
  return {
    measurables: measurablesDecl ?? null,
    markPx: headerDecl?.mark_px ?? null,
    lockup: shellDecl?.brand_lockup ?? null,
    colorMode: shellDecl?.brand_color_mode ?? null,
  }
}

/**
 * Check 2: one measured percentage against its declared floor, missed by
 * more than the margin.
 */
function floorRule(key, label, field, floorField, fix) {
  return ({ measured, declared }) => {
    const actual = measured?.[field]
    const floor = declared.measurables?.[floorField]
    if (typeof floor !== 'number' || typeof actual !== 'number') return null
    const gap = round1(floor - actual)
    if (gap <= FLOOR_MARGIN_POINTS) return null
    return finding(
      2,
      key,
      gap,
      `${label} measured ${actual}% at 1440x900 against a declared floor of ${floor}%, ${gap} points under (the margin is ${FLOOR_MARGIN_POINTS}). ${fix}`
    )
  }
}

/** Check 2: the largest first-fold text against the size `hero_scale` resolves to at 1440. */
function heroRule({ measured, declared }) {
  const scale = declared.measurables?.hero_scale
  const target = heroPxAt(scale)
  const hero = measured?.hero_px
  if (!target || !(hero > 0)) return null
  const ratio = hero / target
  if (ratio >= HERO_BAND.min && ratio <= HERO_BAND.max) return null
  const band = `${HERO_BAND.min * 100}-${HERO_BAND.max * 100}% band`
  return finding(
    2,
    'hero',
    round1(Math.abs(hero - target)),
    `The largest first-fold text measures ${hero}px at 1440; the declared hero_scale ${scale} resolves to ${round1(target)}px there (${Math.round(ratio * 100)}%, ${ratio < 1 ? 'under' : 'over'} the ${band}). Set the hero element's font-size to exactly ${scale}.`
  )
}

/** Check 4: no mark on the page at all. The other mark rules need one, so they stay quiet. */
function markMissingRule({ wide, declared }) {
  if (!wide || wide.mark) return null
  const size = declared.markPx ? ` at ${declared.markPx}px tall` : ''
  return finding(
    4,
    'mark-missing',
    1,
    `No brand mark renders on the page at 1440. Paste the provided mark SVG (viewBox "0 0 71 59"; do not redraw it) into the header inside the first fold${size}.`
  )
}

function markFoldRule({ wide }) {
  const mark = wide?.mark
  if (!mark || mark.inFold) return null
  return finding(
    4,
    'mark-fold-1440',
    1,
    `The brand mark sits at y=${mark.top}px, outside the first ${wide.height}px at 1440. Move it into the first fold; footer-only and none placements move the nav, never the mark.`
  )
}

function markSizeRule({ wide, declared }) {
  const mark = wide?.mark
  const px = declared.markPx
  if (!mark || !(px > 0) || mark.heightPx >= px * MARK_MIN_FRACTION) return null
  return finding(
    4,
    'mark-size',
    round1(px - mark.heightPx),
    `The brand mark renders ${mark.heightPx}px tall at 1440 against the declared mark_px ${px} (${Math.round((mark.heightPx / px) * 100)}%, under ${MARK_MIN_FRACTION * 100}%). Size the mark's <svg> to height: ${px}px.`
  )
}

/** Per declared colour mode: whether the measured mark contradicts it, and the fix. */
const MODE_RULES = {
  original: {
    wrong: (mark) => !mark.original,
    detail:
      'brand_color_mode is original, but the mark has none of its own green (#7AC042). Use the original-colour mark SVG source, unmodified.',
  },
  'single-color': {
    wrong: (mark) => mark.original,
    detail:
      'brand_color_mode is single-color, but the mark still paints its own green. Use the currentColor mark SVG source and set its colour on the element.',
  },
}

function markModeRule({ wide, declared }) {
  const rule = MODE_RULES[declared.colorMode]
  const mark = wide?.mark
  if (!rule || !mark || !rule.wrong(mark)) return null
  return finding(4, 'mark-mode', 1, rule.detail)
}

const SIDE = { row: 'beside', column: 'under' }
const EXPECTED_SHAPE = { row: 'mark beside the name', column: 'mark above the name' }
const PLACE_NAME = { row: 'beside the mark, on its cap-height', column: 'directly under the mark' }

/** Where the page set the name relative to the mark: 'none' when it is not in the lockup. */
function observedOrientation(wordmark) {
  if (!wordmark || wordmark.orientation === 'apart') return 'none'
  return wordmark.orientation
}

/** What is wrong with the lockup, as the instruction, or null when nothing is. */
function lockupMismatch(lockup, wordmark) {
  const expected = lockupOrientation(lockup)
  const observed = observedOrientation(wordmark)
  if (!expected || observed === 'unclear' || observed === expected) return null
  if (expected === 'mark') {
    if (observed === 'none') return null
    return `The lockup is declared ${lockup} (mark only), but "Doug March" is set ${SIDE[observed]} the mark. Remove the name from the lockup.`
  }
  if (observed === 'none') {
    const nearest = wordmark ? ` (nearest is ${wordmark.gapPx}px away)` : ''
    return `The lockup is declared ${lockup}, but no "Doug March" wordmark sits within reach of the mark${nearest}. Set the name ${PLACE_NAME[expected]}.`
  }
  return `The lockup is declared ${lockup} (${EXPECTED_SHAPE[expected]}), but the page sets the name ${SIDE[observed]} the mark.`
}

function lockupRule({ wide, declared }) {
  if (!wide?.mark) return null
  const detail = lockupMismatch(declared.lockup, wide.wordmark)
  return detail ? finding(4, 'lockup', 1, detail) : null
}

/** Check 6: the mark is on the page at 1440 but not in the phone's first fold. */
function phoneMarkRule({ wide, narrow }) {
  if (!narrow || !wide?.mark || narrow.mark?.inFold) return null
  const w = narrow.width
  const where = narrow.mark
    ? `sits at y=${narrow.mark.top}px, below the first ${narrow.height}px`
    : 'does not render'
  return finding(
    6,
    'mark-fold-360',
    1,
    `At ${w}px the brand mark ${where}. Keep it visible inside the phone's first fold.`
  )
}

function overflowRule({ narrow }) {
  const over = narrow ? narrow.scrollWidth - narrow.width : 0
  if (over <= 1) return null
  return finding(
    6,
    'overflow-360',
    over,
    `At ${narrow.width}px the page is ${narrow.scrollWidth}px wide, ${over}px of horizontal scroll. Find the element wider than the column (a fixed width, a nowrap line, desktop-size type) and fit it to ${narrow.width}px.`
  )
}

function cutTextRule({ narrow }) {
  const cut = (narrow?.cutText ?? []).slice(0, MAX_CUT_TEXTS)
  if (!cut.length) return null
  const list = cut.map((c) => `"${c.text}" (x ${c.left} to ${c.right})`).join(', ')
  return finding(
    6,
    'text-cut-360',
    cut.length,
    `At ${narrow.width}px, text runs past the edge of the screen and is cut: ${list}. Set display type in clamp() with a vw term so it fits the column, and let lines wrap.`
  )
}

/** Every rule, in the order the findings are listed: check 2, check 4, check 6. */
const RULES = [
  floorRule(
    'canvas',
    'Canvas utilization',
    'canvas_utilization',
    'canvas_utilization_min',
    'Put designed content (type, a painted panel, a colour field) into the empty regions of the first 900px; untreated background does not count.'
  ),
  floorRule(
    'colour',
    'Colour coverage',
    'color_coverage',
    'color_coverage_min',
    "Paint more of the first 900px in the day's chromatic tokens (a field, a band, a panel background); near-black, near-white and grey do not count."
  ),
  heroRule,
  markMissingRule,
  markFoldRule,
  markSizeRule,
  markModeRule,
  lockupRule,
  phoneMarkRule,
  overflowRule,
  cutTextRule,
]

/**
 * The findings for one mockup round. Any input can be missing (a capture
 * that failed, a declaration the Art Director left out); the checks that
 * need it are skipped, never guessed.
 *
 * @param {object} args
 * @param {{canvas_utilization: number, color_coverage: number, hero_px: number}|null|undefined} args.measured
 *   the capture's design-fidelity numbers at 1440
 * @param {ReturnType<typeof readMockupFacts>|null|undefined} [args.wide] facts at 1440
 * @param {ReturnType<typeof readMockupFacts>|null|undefined} [args.narrow] facts at the phone width
 * @param {ReturnType<typeof declaredFromAd>|object} [args.declared]
 * @returns {Array<{ check: number, key: string, gap: number, detail: string }>}
 */
export function evaluateMockupPrecheck({ measured, wide, narrow, declared }) {
  const round = { measured, wide, narrow, declared: declared ?? {} }
  return RULES.map((rule) => rule(round)).filter(Boolean)
}

export const PRECHECK_HEADING =
  '## MEASURED FAULTS — measured in code on the page you returned; fix every one'

/**
 * The findings as the block the designer reads, first in its feedback. A
 * finding whose key the previous round also had is marked STILL PRESENT, the
 * way the surface gate marks a repeated fault for the engineer (#630).
 *
 * @param {Array<{ check: number, key: string, detail: string }>} findings
 * @param {{ previous?: Array<{ key: string }>|null }} [opts]
 * @returns {string} empty when there is nothing to report
 */
export function formatPrecheckForDesigner(findings, { previous = null } = {}) {
  if (!findings?.length) return ''
  const seen = new Set((previous ?? []).map((f) => f.key))
  const lines = findings.map((f) => {
    const again = seen.has(f.key)
      ? ' STILL PRESENT after your last revision: the change did not reach this measurement; change the element that produces it.'
      : ''
    return `- [check ${f.check}] ${f.detail}${again}`
  })
  return [
    PRECHECK_HEADING,
    '',
    'The browser measured these on your mockup; they are not estimates from a screenshot. Each one is exact.',
    '',
    ...lines,
  ].join('\n')
}

/**
 * Whether a round moved its measured faults at all. False only when both
 * rounds had faults, none of the earlier ones cleared, and none that stayed
 * closed by at least PROGRESS_MIN_FRACTION of its gap. The loop spends no
 * more rounds after a false: another revision of a page that did not move is
 * the $0.62 that bought nothing on eleven September nights.
 *
 * @param {Array<{ key: string, gap: number }>|null|undefined} previous
 * @param {Array<{ key: string, gap: number }>|null|undefined} current
 * @returns {boolean}
 */
export function precheckMadeProgress(previous, current) {
  if (!previous?.length || !current?.length) return true
  const now = new Map(current.map((f) => [f.key, f]))
  for (const p of previous) {
    const c = now.get(p.key)
    if (!c) return true
    if (c.gap <= p.gap * (1 - PROGRESS_MIN_FRACTION)) return true
  }
  return false
}
