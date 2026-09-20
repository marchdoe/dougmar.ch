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
 * or paint. Paint is a background colour that is neither transparent nor the
 * page's own background, or any `background-image` (a gradient is one). The
 * page's own background counts too when it is set on `html` or `body`: a
 * canvas painted at the root is painted everywhere, and a mockup that drenches
 * the page that way is the common case, not an edge one. An explicit opaque
 * white root is the browser default and does not count. `::before` and
 * `::after` boxes count on the same terms. A union of bounding boxes on a
 * coarse grid, not a pixel-exact area — cheap enough to run on every build.
 *
 * `hero_px` — the largest computed font-size, in px, among elements that set
 * visible text and sit inside the first fold (their top edge is above the
 * viewport's bottom edge, at the page's initial scroll position — this runs
 * immediately after navigation, before anything scrolls).
 *
 * `color_coverage` — % of the same grid whose sampled element's background or
 * text colour is chromatic: HSL saturation over 12% and lightness between 8%
 * and 92%. A gradient is chromatic when any of its visible stops is. Near-black,
 * near-white and true grey do not count as colour, so a page that is mostly
 * ink-on-paper with one accent does not read as "drenched".
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

  const rootStyle = getComputedStyle(document.documentElement)
  const bodyStyle = getComputedStyle(document.body)

  const parseRgb = (str) => {
    const m = /rgba?\(([^)]+)\)/.exec(str || '')
    if (!m) return null
    const parts = m[1].split(',').map((s) => parseFloat(s))
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 }
  }

  const isTransparent = (str) => {
    const rgb = parseRgb(str)
    return !rgb || rgb.a === 0
  }

  // The page's own ground: what elements are compared against below. `body`
  // first, then `html` when body sets nothing, since that is the colour a
  // visitor sees behind everything.
  const groundBg = !isTransparent(bodyStyle.backgroundColor)
    ? bodyStyle.backgroundColor
    : rootStyle.backgroundColor

  // A background that paints something: not transparent, and not a restatement
  // of the page's own ground (every element inherits or repeats that by
  // default, and that is not "designed content").
  const paintsBackground = (str) => !isTransparent(str) && str !== groundBg

  // Any background-image at all is paint: a gradient, or a url() image. The
  // computed value is the literal string 'none' when there is nothing.
  const hasImage = (str) => Boolean(str) && str !== 'none'

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

  // A gradient's colours sit in its computed string as rgb()/rgba() stops. It
  // is chromatic when any stop that shows is.
  const isChromaticImage = (str) =>
    hasImage(str) && (str.match(/rgba?\([^)]*\)/g) || []).some((stop) => isChromatic(stop))

  const hasVisibleText = (el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && /\S/.test(n.nodeValue))

  // HTML elements report tagName upper-case, but inline SVG inside an HTML
  // document reports it lower-case, so compare upper-cased.
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
    if (r.right - r.left <= 0 || r.bottom - r.top <= 0) return null
    const rect = {
      left: Math.max(r.left, 0),
      top: Math.max(r.top, 0),
      right: Math.min(r.right, vw),
      bottom: Math.min(r.bottom, vh),
    }
    return rect.right > rect.left && rect.bottom > rect.top ? rect : null
  }

  // What one background contributes: `painted` for canvas, `chromatic` for
  // colour. A restated ground colour is not painted but can still be chromatic,
  // the same split the walk below always made.
  const paintOf = (bg, img) => ({
    painted: paintsBackground(bg) || hasImage(img),
    chromatic: isChromatic(bg) || isChromaticImage(img),
  })
  const isDesignedContent = (text, isMedia, paint) => text || isMedia || paint.painted
  const isColorCell = (paint, text, color) => paint.chromatic || (text && isChromatic(color))
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

  // `html` and `body` sit outside the `body *` walk below, yet a mockup that
  // drenches the page paints one of them. An opaque white root is the browser
  // default, not a choice, so it does not count.
  const rootPaint = (style) => ({
    painted:
      (!isTransparent(style.backgroundColor) && style.backgroundColor !== 'rgb(255, 255, 255)') ||
      hasImage(style.backgroundImage),
    chromatic: isChromatic(style.backgroundColor) || isChromaticImage(style.backgroundImage),
  })

  const stamp = (paint, rect) => {
    if (!rect) return
    if (paint.painted) mark(covered, rect)
    if (paint.chromatic) mark(colored, rect)
  }

  const stampRoots = () => {
    const viewportRect = { left: 0, top: 0, right: vw, bottom: vh }
    stamp(rootPaint(rootStyle), viewportRect)
    // With nothing of its own on `html`, the body's background propagates to
    // the whole canvas; otherwise it paints only the body's box.
    const propagates =
      isTransparent(rootStyle.backgroundColor) && !hasImage(rootStyle.backgroundImage)
    const bodyRect = propagates ? viewportRect : visibleRect(document.body.getBoundingClientRect())
    stamp(rootPaint(bodyStyle), bodyRect)
  }

  // ::before and ::after have no getBoundingClientRect, so the box is worked
  // out from resolved geometry. A positioned one (the usual full-bleed overlay)
  // resolves left/top/width/height to px against its containing block. An
  // in-flow one sits at the host's top-left (::before) or bottom-left
  // (::after). With the size still `auto`, the host's own rect stands in, which
  // over-counts by at most the host's box.
  const px = (value) => Number.parseFloat(value)
  const boxAt = (x, y, w, h) => ({ left: x, top: y, right: x + w, bottom: y + h })

  const establishesContainingBlock = (el) => {
    const s = getComputedStyle(el)
    return s.position !== 'static' || s.transform !== 'none'
  }

  // Where an absolutely positioned pseudo-element's left/top are measured
  // from: the nearest positioned ancestor of its host (the host included), else
  // the initial containing block, whose origin is the viewport's at scroll zero.
  const containingOrigin = (host) => {
    let a = host
    while (a && a !== document.documentElement && !establishesContainingBlock(a)) {
      a = a.parentElement
    }
    if (!a || a === document.documentElement) return { x: 0, y: 0 }
    const r = a.getBoundingClientRect()
    return { x: r.left + a.clientLeft, y: r.top + a.clientTop }
  }

  const pseudoRect = (host, pseudo, ps, hostRect) => {
    const w = px(ps.width)
    const h = px(ps.height)
    if (!Number.isFinite(w) || !Number.isFinite(h)) return hostRect
    if (ps.position === 'fixed') return boxAt(px(ps.left), px(ps.top), w, h)
    if (ps.position === 'absolute') {
      const o = containingOrigin(host)
      return boxAt(o.x + px(ps.left), o.y + px(ps.top), w, h)
    }
    return boxAt(hostRect.left, pseudo === '::before' ? hostRect.top : hostRect.bottom - h, w, h)
  }

  // `content: none` (or never set) generates no box at all.
  const hasPseudoBox = (ps) => ps.content !== 'none' && ps.content !== 'normal' && isRendered(ps)

  const markPseudos = (host, hostRect) => {
    for (const pseudo of ['::before', '::after']) {
      const ps = getComputedStyle(host, pseudo)
      const paint = paintOf(ps.backgroundColor, ps.backgroundImage)
      if (!hasPseudoBox(ps) || !(paint.painted || paint.chromatic)) continue
      stamp(paint, visibleRect(pseudoRect(host, pseudo, ps, hostRect)))
    }
  }

  let heroPx = 0

  stampRoots()
  markPseudos(document.body, document.body.getBoundingClientRect())

  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el)
    if (!isRendered(style)) continue
    const hostRect = el.getBoundingClientRect()
    // Before the size gate: a zero-height host still carries an absolutely
    // positioned pseudo-element that paints the viewport.
    markPseudos(el, hostRect)
    const rect = visibleRect(hostRect)
    if (!rect) continue

    const paint = paintOf(style.backgroundColor, style.backgroundImage)
    const text = hasVisibleText(el)
    const isMedia = MEDIA_TAGS.has(el.tagName.toUpperCase())

    if (isDesignedContent(text, isMedia, paint)) mark(covered, rect)
    if (isColorCell(paint, text, style.color)) mark(colored, rect)
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
  '(visible text, an image/SVG/video/canvas, a background colour distinct from the page ' +
  'background and not transparent, or a background image such as a gradient). A background set ' +
  'on html or body counts as painting the page, unless it is opaque white; ::before and ::after ' +
  'boxes count on the same terms. color_coverage: % of grid cells whose sampled background, ' +
  'background-image stops or text colour is chromatic (HSL saturation > 12%, lightness 8-92%). ' +
  'hero_px: the largest computed font-size among first-fold elements that set visible text.'
