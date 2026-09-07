/**
 * Achieved design-fidelity numbers — the counterpart to the Art Director's
 * declared MEASURABLES floors (#456).
 *
 * The declared block was parsed and logged since June but never persisted,
 * and nothing measured what actually rendered as a number: the mockup critic
 * looked at a screenshot and wrote prose. `fidelity()` in
 * `uniqueness-index.js` existed to compare the two and returned null on every
 * build there ever was.
 *
 * This measures the achieved side at 1440x900, the same desktop rung the
 * responsive scorer already opens a page at, so wiring it in adds no browser
 * launch. It is deliberately a floor-checking instrument, not a design
 * grader: a coarse grid stands in for a true geometric union because the
 * declared floors are round numbers ("at least 80%"), not numbers precise to
 * the pixel.
 */

/** Grid cell size, in px, both dimensions. Coarse on purpose — see module doc. */
export const DESIGN_FIDELITY_GRID_PX = 20

/**
 * Runs inside the page. Self-contained on purpose, the same discipline
 * `collectSurfaceMetrics` and `findClippedElements` follow in
 * `surface-gate.js`: Playwright serialises this with `toString()`, so it
 * closes over nothing and calls nothing from this module.
 *
 * `canvas_utilization` — % of the viewport's grid cells touched by an
 * element carrying designed content: visible text, an image/SVG/video/canvas,
 * or a background colour that is neither transparent nor the page's own
 * background. A union of bounding boxes on a coarse grid, not a pixel-exact
 * area — cheap enough to run on every build.
 *
 * `hero_px` — the largest computed font-size, in px, among elements that set
 * visible text and sit inside the first fold (their top edge is above the
 * viewport's bottom edge, at the page's initial scroll position — this runs
 * immediately after navigation, before anything scrolls).
 *
 * `color_coverage` — % of the same grid whose sampled element's background or
 * text colour is chromatic: HSL saturation over 12% and lightness between 8%
 * and 92%. Near-black, near-white and true grey do not count as colour, so a
 * page that is mostly ink-on-paper with one accent does not read as
 * "drenched".
 *
 * @param {{ gridPx?: number }} [opts]
 * @returns {{ canvas_utilization: number, hero_px: number, color_coverage: number }}
 */
export function measureDesignFidelity({ gridPx = 20 } = {}) {
  // Literal, not DESIGN_FIDELITY_GRID_PX: Playwright serialises this function
  // with toString() and runs it inside the page, where the module's other
  // exports do not exist. Keep the two in sync by hand; DESIGN_FIDELITY_METHOD
  // below reads the same literal for the same reason.
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const cols = Math.max(1, Math.ceil(vw / gridPx))
  const rows = Math.max(1, Math.ceil(vh / gridPx))
  const covered = new Uint8Array(cols * rows)
  const colored = new Uint8Array(cols * rows)

  const bodyBg = getComputedStyle(document.body).backgroundColor

  const parseRgb = (str) => {
    const m = /rgba?\(([^)]+)\)/.exec(str || '')
    if (!m) return null
    const parts = m[1].split(',').map((s) => parseFloat(s))
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 }
  }

  // A background that paints something: not transparent, and not a restatement
  // of the page's own ground (every element inherits or repeats that by
  // default, and that is not "designed content").
  const paintsBackground = (str) => {
    const rgb = parseRgb(str)
    if (!rgb || rgb.a === 0) return false
    return str !== bodyBg
  }

  const isChromatic = (str) => {
    const rgb = parseRgb(str)
    if (!rgb || rgb.a === 0) return false
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    if (max === min) return false // achromatic: pure grey, black or white
    const l = (max + min) / 2
    const d = max - min
    const s = (l > 0.5 ? d / (2 - max - min) : d / (max + min)) * 100
    const lPct = l * 100
    return s > 12 && lPct > 8 && lPct < 92
  }

  const hasVisibleText = (el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && /\S/.test(n.nodeValue))

  const MEDIA_TAGS = new Set(['IMG', 'SVG', 'VIDEO', 'CANVAS'])

  // Not rendered at all — display:none, visibility:hidden, or fully
  // transparent — folded into one check so the walk below reads as one
  // decision instead of three.
  const isRendered = (style) =>
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    Number.parseFloat(style.opacity) !== 0

  // The rect clipped to the viewport at scroll position zero, or null when
  // there is nothing left to clip: zero-size, or wholly outside what a
  // visitor sees without scrolling. One gate the walk below can `continue` on,
  // rather than the two separate size and position checks it used to be.
  const visibleRect = (r) => {
    if (r.width <= 0 || r.height <= 0) return null
    const rect = {
      left: Math.max(r.left, 0),
      top: Math.max(r.top, 0),
      right: Math.min(r.right, vw),
      bottom: Math.min(r.bottom, vh),
    }
    return rect.right > rect.left && rect.bottom > rect.top ? rect : null
  }

  const isDesignedContent = (text, isMedia, bg) => text || isMedia || paintsBackground(bg)
  const isColorCell = (bg, text, color) => isChromatic(bg) || (text && isChromatic(color))
  const fontSizeOf = (style) => {
    const fs = Number.parseFloat(style.fontSize)
    return Number.isFinite(fs) ? fs : 0
  }

  const mark = (grid, rect) => {
    const left = Math.floor(rect.left / gridPx)
    const right = Math.min(cols - 1, Math.floor((rect.right - 0.01) / gridPx))
    const top = Math.floor(rect.top / gridPx)
    const bottom = Math.min(rows - 1, Math.floor((rect.bottom - 0.01) / gridPx))
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) grid[y * cols + x] = 1
    }
  }

  let heroPx = 0

  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el)
    if (!isRendered(style)) continue
    const rect = visibleRect(el.getBoundingClientRect())
    if (!rect) continue

    const bg = style.backgroundColor
    const text = hasVisibleText(el)
    const isMedia = MEDIA_TAGS.has(el.tagName)

    if (isDesignedContent(text, isMedia, bg)) mark(covered, rect)
    if (isColorCell(bg, text, style.color)) mark(colored, rect)
    if (text) heroPx = Math.max(heroPx, fontSizeOf(style))
  }

  // cols and rows are each at least 1 (Math.max above), so total is never
  // zero and pct never divides by it.
  const total = cols * rows
  let coveredN = 0
  let coloredN = 0
  for (let i = 0; i < total; i++) {
    coveredN += covered[i]
    coloredN += colored[i]
  }

  const pct = (n) => Math.round((n / total) * 1000) / 10

  return {
    canvas_utilization: pct(coveredN),
    color_coverage: pct(coloredN),
    hero_px: Math.round(heroPx),
  }
}

/**
 * How the achieved numbers were produced, for a reader of `measurables.json`
 * who was not there. Written into the `method` field alongside `measured`
 * rather than assumed knowledge.
 */
export const DESIGN_FIDELITY_METHOD =
  `Measured at 1440x900 on a ${DESIGN_FIDELITY_GRID_PX}px grid over the viewport at scroll position ` +
  'zero. canvas_utilization: % of grid cells touched by an element carrying designed content ' +
  '(visible text, an image/SVG/video/canvas, or a background colour distinct from the page ' +
  'background and not transparent). color_coverage: % of grid cells whose sampled background or ' +
  'text colour is chromatic (HSL saturation > 12%, lightness 8-92%). hero_px: the largest computed ' +
  'font-size among first-fold elements that set visible text.'
