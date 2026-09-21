/**
 * The in-page half of the text-contrast gate (#566).
 *
 * Every function named `page*` runs inside the browser, so each is
 * self-contained: Playwright cannot ship a closure, only source. They are
 * serialised one by one with `toString()` and rebuilt in the page, where each
 * reaches the others through a `kit`, an object whose methods are the
 * functions with the kit appended to their arguments. That keeps each of them
 * small enough to read and to hold to the repo's complexity ceilings, which
 * one 250-line function with a dozen closures inside it could not.
 *
 * They report and resolve nothing: for each distinct piece of small, visible
 * text, the colour it is set in and the layers behind it. The arithmetic and
 * the findings are `text-contrast.js`.
 *
 * Text is skipped when a reader cannot see it: `display: none`,
 * `visibility: hidden`, `opacity: 0` on the element or any ancestor, parked
 * off the top or left edge, clipped to a pixel (the visually-hidden pattern),
 * fully transparent, inside inline svg. Large text is counted, not measured.
 *
 * The same walk also hands back the elements under the type-size floors
 * (`small-text-page.js`, #567), because it is the one place the page is read
 * after the scroll-reveal resize.
 *
 * `unresolved` is the first thing that makes the ratio a guess, looked for
 * only on layers the text can actually see: once a layer at full opacity has
 * an opaque background, nothing above it shows, unless a group above has
 * opacity under 1. A positioned element that paints (a background-image, a
 * background colour, an img, video, canvas or svg) and overlaps a quarter or
 * more of the text's own box is reported without any attempt at stacking
 * order: which of the two is on top is the question a ratio cannot answer.
 *
 * @module
 */

import { SMALL_TEXT_PAGE_FUNCTIONS } from './small-text-page.js'
import { TEXT_CONTRAST_OPTIONS } from './text-contrast.js'

/**
 * How tall the page may make the viewport for the walk, and how long the
 * reveal animations get to settle after it does. See {@link measureTextContrast}.
 */
export const MAX_PAGE_PX = 20000
export const REVEAL_SETTLE_MS = 300

/**
 * Any CSS colour Chromium returns that is not rgb() or color(srgb): oklch,
 * lab, display-p3. Painted over black and over white, which gives the alpha
 * (the two pixels differ by 1 - a) and the colour (the black pixel is c * a).
 */
function pageCanvasColor(str, kit) {
  const cache = kit.cache
  if (cache.ctx === undefined) {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    cache.ctx = canvas.getContext('2d', { willReadFrequently: true })
  }
  const ctx = cache.ctx
  if (!ctx) return null
  ctx.fillStyle = '#123456'
  ctx.fillStyle = str
  if (ctx.fillStyle === '#123456' && str.toLowerCase() !== '#123456') return null
  const over = (backdrop) => {
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = backdrop
    ctx.fillRect(0, 0, 1, 1)
    ctx.fillStyle = str
    ctx.fillRect(0, 0, 1, 1)
    return ctx.getImageData(0, 0, 1, 1).data
  }
  const onBlack = over('#000000')
  const onWhite = over('#ffffff')
  const a = 1 - (onWhite[1] - onBlack[1]) / 255
  if (a <= 0.004) return { r: 0, g: 0, b: 0, a: 0 }
  const channel = (v) => Math.min(255, Math.max(0, v / a))
  return {
    r: channel(onBlack[0]),
    g: channel(onBlack[1]),
    b: channel(onBlack[2]),
    a: Math.min(1, a),
  }
}

function pageParseColor(str, kit) {
  const text = (str || '').trim()
  if (!text) return null
  const m = /^(rgba?|color)\(([^)]*)\)$/.exec(text)
  if (!m || (m[1] === 'color' && !/^\s*srgb\s/.test(m[2]))) return kit.canvasColor(text)
  const scale = m[1] === 'color' ? 255 : 1
  const [channels, slashAlpha] = m[2].replace(/^\s*srgb\s+/, '').split('/')
  const nums = channels
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
  const num = (s) => (s.endsWith('%') ? Number.parseFloat(s) / 100 : Number.parseFloat(s))
  const alpha = slashAlpha === undefined ? nums[3] : slashAlpha.trim()
  return {
    r: num(nums[0]) * scale,
    g: num(nums[1]) * scale,
    b: num(nums[2]) * scale,
    a: alpha === undefined ? 1 : num(alpha),
  }
}

function pageDescribe(el) {
  const id = el.id ? `#${el.id}` : ''
  // Panda writes conditions into class names (`[@supports_(...)]:anim-n_rise`);
  // they name nothing a reader of the brief can search for.
  const classes = [...el.classList]
    .filter((c) => !/[[(]/.test(c))
    .slice(0, 4)
    .map((c) => `.${c}`)
    .join('')
  return `${el.tagName.toLowerCase()}${id}${classes}`
}

function pageSelector(el, kit) {
  const chain = []
  for (let p = el; p && chain.length < 3 && p !== document.body; p = p.parentElement) {
    chain.unshift(kit.describe(p))
  }
  return chain.join(' > ').slice(0, 160)
}

function pageOwnText(el) {
  let text = ''
  for (const n of el.childNodes) if (n.nodeType === 3) text += n.nodeValue
  text = text.replace(/\s+/g, ' ').trim()
  return /[\p{L}\p{N}]/u.test(text) ? text : ''
}

/** Laid out, on screen, and more than a pixel each way. */
function pageBoxVisible(el, cs) {
  if (cs.visibility !== 'visible' || !(Number.parseFloat(cs.fontSize) >= 1)) return false
  const r = el.getBoundingClientRect()
  if (!(r.width > 1 && r.height > 1)) return false
  return r.right > 0 && r.bottom > 0
}

/** One layer that hides what is inside it: no opacity, no display, or a clip with no size. */
function pageLayerHides(p, ps, isSelf) {
  if (Number.parseFloat(ps.opacity) === 0 || ps.display === 'none') return true
  if (isSelf || ps.overflow === 'visible') return false
  const r = p.getBoundingClientRect()
  return r.width === 0 || r.height === 0
}

function pageIsVisible(el, cs, kit) {
  if (!kit.boxVisible(el, cs)) return false
  for (let p = el; p; p = p.parentElement) {
    const isSelf = p === el
    if (kit.layerHides(p, isSelf ? cs : getComputedStyle(p), isSelf)) return false
  }
  return true
}

/** The orchestrator part an element sits inside, by name, or null. */
function pagePartOf(el, kit) {
  const cache = kit.cache
  if (!cache.roots) {
    cache.roots = kit.options.parts.map((part) => ({
      name: part.name,
      roots: [...document.querySelectorAll(part.selector)].map((n) =>
        part.parent ? n.parentElement : n
      ),
    }))
  }
  return cache.roots.find((p) => p.roots.some((r) => r?.contains(el)))?.name ?? null
}

function pagePaints(ps, kit) {
  return ps.backgroundImage !== 'none' || (kit.parseColor(ps.backgroundColor)?.a ?? 0) > 0
}

/**
 * A positioned pseudo-element that paints a real area sits over or under the
 * text and cannot be resolved. A hairline rule a few px thick cannot hide
 * text, so it does not count.
 */
function pagePseudoCovers(ps, kit) {
  const positioned = ps.position === 'absolute' || ps.position === 'fixed'
  const drawn = ps.content !== 'none' && ps.content !== 'normal'
  if (!positioned || !drawn || !kit.paints(ps)) return false
  return !(Math.min(Number.parseFloat(ps.width), Number.parseFloat(ps.height)) <= 4)
}

function pageFindPseudo(p, kit) {
  for (const pseudo of ['::before', '::after']) {
    if (kit.pseudoCovers(getComputedStyle(p, pseudo))) return `${kit.describe(p)}${pseudo}`
  }
  return null
}

function pagePseudoPaint(p, kit) {
  const memo = kit.cache.pseudo
  if (!memo.has(p)) memo.set(p, kit.findPseudo(p))
  return memo.get(p)
}

function pageUnresolvedAt(p, ps, kit) {
  if (ps.backgroundImage !== 'none') return `${kit.describe(p)} (background-image)`
  if (ps.mixBlendMode !== 'normal') return `${kit.describe(p)} (mix-blend-mode: ${ps.mixBlendMode})`
  const pseudo = kit.pseudoPaint(p)
  return pseudo ? `${pseudo} (painted pseudo-element)` : null
}

function pageLayerOf(ps, kit) {
  const bg = kit.parseColor(ps.backgroundColor)
  const opacity = Number.parseFloat(ps.opacity)
  return { bg: bg && bg.a > 0 ? bg : null, opacity: Number.isFinite(opacity) ? opacity : 1 }
}

/**
 * Layers from the element up to html, and the first thing the text cannot be
 * measured over. `covered` is "everything above the layers so far is hidden".
 */
function pageWalkLayers(el, cs, kit) {
  const layers = []
  let unresolved = null
  let covered = false
  for (let p = el; p; p = p.parentElement) {
    const ps = p === el ? cs : getComputedStyle(p)
    const layer = kit.layerOf(ps)
    layers.push(layer)
    if (!unresolved && !covered) unresolved = kit.unresolvedAt(p, ps)
    covered = layer.opacity >= 0.999 && ((layer.bg?.a ?? 0) >= 0.999 || covered)
  }
  return { layers, unresolved }
}

function pagePaintKind(el, ps, kit) {
  if (ps.backgroundImage !== 'none') return 'background-image'
  const tag = el.tagName.toLowerCase()
  if (['img', 'video', 'canvas', 'picture', 'svg'].includes(tag)) return tag
  return (kit.parseColor(ps.backgroundColor)?.a ?? 0) > 0 ? 'background' : null
}

function pagePainterOf(el, kit) {
  const ps = getComputedStyle(el)
  if (ps.position !== 'absolute' && ps.position !== 'fixed') return null
  if (ps.visibility !== 'visible' || Number.parseFloat(ps.opacity) === 0) return null
  const what = kit.paintKind(el, ps)
  const r = el.getBoundingClientRect()
  if (!what || !(r.width > 0 && r.height > 0)) return null
  return { el, r, label: `${kit.describe(el)} (positioned ${what})` }
}

/** Positioned elements that paint: the only ones that can overlap text without being its ancestor. */
function pageCollectPainters(kit) {
  const painters = []
  for (const el of document.body.querySelectorAll('*')) {
    if (painters.length >= kit.options.maxPainters) break
    const painter = kit.painterOf(el)
    if (painter) painters.push(painter)
  }
  return painters
}

/** The box of the element's own text nodes, not of the block that holds them. */
function pageTextBox(el) {
  const rects = []
  for (const n of el.childNodes) {
    if (n.nodeType !== 3 || !/\S/.test(n.nodeValue)) continue
    const range = document.createRange()
    range.selectNodeContents(n)
    const r = range.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) rects.push(r)
  }
  if (!rects.length) return null
  return {
    left: Math.min(...rects.map((r) => r.left)),
    top: Math.min(...rects.map((r) => r.top)),
    right: Math.max(...rects.map((r) => r.right)),
    bottom: Math.max(...rects.map((r) => r.bottom)),
  }
}

function pageOverlapShare(a, box) {
  const w = Math.min(a.right, box.right) - Math.max(a.left, box.left)
  const h = Math.min(a.bottom, box.bottom) - Math.max(a.top, box.top)
  return w > 0 && h > 0 ? (w * h) / ((box.right - box.left) * (box.bottom - box.top)) : 0
}

/** The first positioned painter over a quarter of the element's text, by label, or null. */
function pageOverlayOver(el, kit) {
  const box = kit.textBox(el)
  if (!box) return null
  const cache = kit.cache
  cache.painters = cache.painters ?? kit.collectPainters()
  const hit = cache.painters.find(
    (p) =>
      !p.el.contains(el) &&
      !el.contains(p.el) &&
      kit.overlapShare(p.r, box) >= kit.options.minOverlap
  )
  return hit ? hit.label : null
}

/** The element's text, ink and computed style when there is small visible text to measure. */
function pageInspect(el, kit) {
  const skipped = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TITLE', 'HEAD', 'OPTION']
  if (skipped.includes(el.tagName) || el.closest('svg')) return null
  const text = kit.ownText(el)
  if (!text) return null
  const cs = getComputedStyle(el)
  if (!kit.isVisible(el, cs)) return null
  const fg = kit.parseColor(cs.webkitTextFillColor) ?? kit.parseColor(cs.color)
  return fg && fg.a > 0 ? { el, cs, text, fg } : null
}

function pageIsLarge(cs, kit) {
  const sizePx = Number.parseFloat(cs.fontSize)
  const weight = Number.parseInt(cs.fontWeight, 10) || 400
  const { largePx, largeBoldPx, boldWeight } = kit.options
  return sizePx >= largePx || (weight >= boldWeight && sizePx >= largeBoldPx)
}

function pageBuildCandidate(seen, kit) {
  const { el, cs, text, fg } = seen
  const walked = kit.walkLayers(el, cs)
  return {
    selector: kit.selector(el),
    text: text.slice(0, 40),
    sizePx: Math.round(Number.parseFloat(cs.fontSize) * 10) / 10,
    weight: Number.parseInt(cs.fontWeight, 10) || 400,
    fg,
    layers: walked.layers,
    unresolved: walked.unresolved ?? kit.overlayOver(el),
    part: kit.partOf(el),
    count: 1,
  }
}

/** The walk: one candidate per distinct element chain, ink and stack of layers. */
function pageCollect(kit) {
  const found = new Map()
  let texts = 0
  let large = 0
  for (const el of document.body.querySelectorAll('*')) {
    const seen = kit.inspect(el)
    if (!seen) continue
    texts++
    if (kit.isLarge(seen.cs)) {
      large++
      continue
    }
    const c = kit.buildCandidate(seen)
    const key = JSON.stringify([c.selector, c.fg, c.layers, c.unresolved])
    const held = found.get(key)
    if (held) held.count++
    else if (found.size < kit.options.maxCandidates) found.set(key, c)
  }
  return { candidates: [...found.values()], texts, large, smallText: kit.collectSmallText() }
}

/** The kit the contrast walk runs on. `render-health-page.js` adds its own functions to a copy. */
export const TEXT_CONTRAST_PAGE_FUNCTIONS = {
  canvasColor: pageCanvasColor,
  parseColor: pageParseColor,
  describe: pageDescribe,
  selector: pageSelector,
  ownText: pageOwnText,
  boxVisible: pageBoxVisible,
  layerHides: pageLayerHides,
  isVisible: pageIsVisible,
  partOf: pagePartOf,
  paints: pagePaints,
  pseudoCovers: pagePseudoCovers,
  findPseudo: pageFindPseudo,
  pseudoPaint: pagePseudoPaint,
  unresolvedAt: pageUnresolvedAt,
  layerOf: pageLayerOf,
  walkLayers: pageWalkLayers,
  paintKind: pagePaintKind,
  painterOf: pagePainterOf,
  collectPainters: pageCollectPainters,
  textBox: pageTextBox,
  overlapShare: pageOverlapShare,
  overlayOver: pageOverlayOver,
  inspect: pageInspect,
  isLarge: pageIsLarge,
  buildCandidate: pageBuildCandidate,
  collect: pageCollect,
  ...SMALL_TEXT_PAGE_FUNCTIONS,
}

/**
 * Rebuild a kit in the page and call one of its functions.
 *
 * Every function in `functions` is serialised with `toString()` and rebuilt
 * with the kit appended to its arguments, so they reach each other as
 * `kit.name(...)`. `entry` names the one to run. The contrast walk and the
 * probes in `render-health-page.js` both come through here, so a helper such
 * as `selector` or `partOf` is one function for both.
 *
 * @param {import('playwright').Page} page
 * @param {Record<string, Function>} functions
 * @param {string} entry the kit function to call, with no arguments
 * @param {object} options handed to the page as `kit.options`
 * @returns {Promise<any>}
 */
export function runPageKit(page, functions, entry, options) {
  const sources = Object.fromEntries(
    Object.entries(functions).map(([name, fn]) => [name, fn.toString()])
  )
  return page.evaluate(
    ([fnSources, opts, name]) => {
      const fns = {}
      const kit = {
        options: opts,
        cache: { ctx: undefined, pseudo: new Map(), roots: null, painters: null },
      }
      for (const [fnName, src] of Object.entries(fnSources)) {
        fns[fnName] = new Function(`return ${src}`)()
        kit[fnName] = (...args) => fns[fnName](...args, kit)
      }
      return kit[name]()
    },
    [sources, options, entry]
  )
}

/**
 * Run the walk on a page as it stands.
 *
 * @param {import('playwright').Page} page
 * @param {typeof TEXT_CONTRAST_OPTIONS} [options]
 * @returns {Promise<{ candidates: Array<object>, texts: number, large: number,
 *   smallText: { entries: Array<object> } }>}
 */
export function collectTextContrast(page, options = TEXT_CONTRAST_OPTIONS) {
  return runPageKit(page, TEXT_CONTRAST_PAGE_FUNCTIONS, 'collect', options)
}

/**
 * Run a measurement with scroll-revealed text revealed.
 *
 * A section set to fade in as it scrolls into view (`animation-timeline:
 * view()`, or an observer adding a class) is at `opacity: 0` until it is in
 * the viewport, and the gate never scrolls. 09-19's whole lower half was
 * still at rest that way. Sizing the viewport to the document puts every
 * element in view at scroll position zero, so each one is measured in the
 * state a reader sees it in. The viewport is put back afterwards.
 *
 * Run it last: it changes the height that `vh` units resolve against.
 *
 * @template T
 * @param {import('playwright').Page} page
 * @param {() => Promise<T>} measure runs with the viewport sized to the document
 * @returns {Promise<T>}
 */
export async function withRevealedPage(page, measure) {
  const original = page.viewportSize()
  const tall = await page.evaluate(
    (cap) => Math.min(document.documentElement.scrollHeight, cap),
    MAX_PAGE_PX
  )
  const resized = original !== null && tall > original.height
  if (resized) {
    await page.setViewportSize({ width: original.width, height: tall })
    await page.waitForTimeout(REVEAL_SETTLE_MS)
  }
  try {
    return await measure()
  } finally {
    if (resized) await page.setViewportSize(original)
  }
}

/**
 * Run the walk with scroll-revealed text revealed.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<{ candidates: Array<object>, texts: number, large: number,
 *   smallText: { entries: Array<object> } }>}
 */
export function measureTextContrast(page) {
  return withRevealedPage(page, () => collectTextContrast(page))
}
