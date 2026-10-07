/**
 * Rendered-geometry fingerprint — where the design actually landed.
 *
 * Every other novelty metric compares a declaration. The composition tuple, the
 * hue, the lane, the shell: all of them are things an agent wrote down, and two
 * different tuples can still render one picture. 2026-08-23 and 2026-08-30 share
 * no axis value worth mentioning, and both put the mark top-left, the hero on
 * the left and a column of data down the right. Nothing in the pipeline scored
 * those as similar, because nothing was looking at the page.
 *
 * This looks at the page. After the production build is served, the normalized
 * bounding boxes of a few load-bearing elements — the h1, every nav, the brand
 * mark, the first three top-level sections — are read out of the live DOM at
 * 1440 and stored as `fingerprint.json` beside the build's other artifacts. The
 * uniqueness index then compares today's silhouette against the last seven,
 * so a repeated silhouette costs uniqueness even when the tuple is new.
 *
 * Boxes are fractions of the viewport, never pixels: a fingerprint has to stay
 * comparable across a viewport change, and the question is proportional
 * placement, not absolute size.
 *
 * @see https://github.com/marchdoe/dougmar.ch/issues/255
 */

/** Bumped when the collected shape changes; a fingerprint of another version is not compared. */
export const FINGERPRINT_VERSION = 1

/** The viewport the fingerprint is taken at. Wide enough that the design has room to differ. */
export const FINGERPRINT_VIEWPORT = { width: 1440, height: 900 }

/**
 * Centre-to-centre distance, in normalized units, at which two elements are as
 * far apart as this measure counts.
 *
 * Half the viewport is already a different design. Letting the distance keep
 * growing past that would mean a mark that moved corner to corner scored higher
 * than a hero that moved from the left half to the right, which is not a
 * distinction worth making — both are new silhouettes.
 */
export const CENTER_SATURATION = 0.5

/**
 * How much each element class contributes to the silhouette distance.
 *
 * The hero carries the most because it is the thing a visitor sees first and
 * the axis the composition grammar spends four of its eight axes on. The mark
 * carries the least: it is small, and its placement is already declared and
 * measured by the HEADER block (#254).
 */
export const CLASS_WEIGHTS = {
  hero: 0.35,
  section: 0.3,
  nav: 0.2,
  mark: 0.15,
}

/** Element classes, in the order a fingerprint lists them. */
export const ELEMENT_CLASSES = Object.keys(CLASS_WEIGHTS)

/**
 * Read the day's silhouette out of the live DOM.
 *
 * Serialized into the page by Playwright, so it closes over nothing and uses no
 * module scope — same constraint the responsive scorer's checks work under.
 *
 * The mark is found by its viewBox. `BrandLockup` is the only file in the app
 * allowed to draw the mark (build-validator check 7) and the Brand Contract
 * forbids redrawing it, so `0 0 71 59` identifies it wherever it is placed.
 *
 * The site's rail (#702), `[data-live-frame]` above <Layout> on /, /about and
 * /work/*, is the same 44px band every day: it is the site's frame, not the
 * night's silhouette. It is taken out of layout while the boxes are read, so
 * every box sits where the design put it and a fingerprint taken with the
 * rail compares with one taken before it, and put back before returning.
 * Nothing changes for a page without one, so FINGERPRINT_VERSION stands.
 *
 * @returns {{version: number, viewport: {width: number, height: number}, elements: Array<{class: string, x: number, y: number, w: number, h: number}>}}
 */
export function collectGeometry() {
  const hideRail = document.head.appendChild(document.createElement('style'))
  hideRail.textContent = '[data-live-frame]{display:none!important}'

  const vw = window.innerWidth
  const vh = window.innerHeight
  const round = (n) => Math.round(n * 10000) / 10000
  const scrollY = window.scrollY || 0

  const box = (el, cls) => {
    const r = el.getBoundingClientRect()
    if (r.width <= 0 || r.height <= 0) return null
    return {
      class: cls,
      x: round(r.left / vw),
      y: round((r.top + scrollY) / vh),
      w: round(r.width / vw),
      h: round(r.height / vh),
    }
  }

  const visible = (el) => {
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return false
    const cs = getComputedStyle(el)
    return cs.display !== 'none' && cs.visibility !== 'hidden'
  }

  const elements = []

  // The hero: the h1 if there is one, otherwise the widest-and-tallest block
  // that carries real text. A design with no h1 still has a loudest phrase.
  let hero = document.querySelector('h1')
  if (!hero) {
    let bestArea = 0
    for (const el of document.querySelectorAll('h1, h2, h3, p, span, div, a, li')) {
      const text = (el.textContent || '').trim()
      if (text.length < 3 || text.length > 200) continue
      if (!visible(el)) continue
      const r = el.getBoundingClientRect()
      const size = parseFloat(getComputedStyle(el).fontSize) || 0
      const area = r.width * r.height * size
      if (area > bestArea) {
        bestArea = area
        hero = el
      }
    }
  }
  if (hero && visible(hero)) {
    const b = box(hero, 'hero')
    if (b) elements.push(b)
  }

  for (const nav of document.querySelectorAll('nav')) {
    if (!visible(nav)) continue
    const b = box(nav, 'nav')
    if (b) elements.push(b)
  }

  const mark =
    document.querySelector('svg[viewBox="0 0 71 59"]') ||
    document.querySelector('[aria-label*="logo" i] svg') ||
    document.querySelector('svg[aria-label*="logo" i]')
  if (mark && visible(mark)) {
    const b = box(mark, 'mark')
    if (b) elements.push(b)
  }

  // Top-level sections. Descend through wrappers first: a layout that puts the
  // page inside one <div> would otherwise report one section the size of the
  // document, which is the same shape every night and says nothing. A wrapper
  // is a lone child, or a child that fills all but a tenth of its parent.
  let container = document.querySelector('main') || document.body
  for (let depth = 0; depth < 5; depth++) {
    const kids = [...container.children].filter(visible)
    if (kids.length === 0) break
    const area = (el) => {
      const r = el.getBoundingClientRect()
      return r.width * r.height
    }
    const biggest = kids.reduce((a, b) => (area(a) >= area(b) ? a : b))
    const wrapper = kids.length === 1 || area(biggest) >= area(container) * 0.9
    if (!wrapper || biggest.children.length === 0) break
    container = biggest
  }
  const sections = [...container.children].filter((el) => {
    if (!visible(el)) return false
    const r = el.getBoundingClientRect()
    return r.width * r.height >= vw * vh * 0.01
  })
  for (const section of sections.slice(0, 3)) {
    const b = box(section, 'section')
    if (b) elements.push(b)
  }

  hideRail.remove()

  // The literal rather than FINGERPRINT_VERSION: this function is serialized
  // into the page, where module scope does not exist. A test pins the two together.
  return {
    version: 1,
    viewport: { width: vw, height: vh },
    elements,
  }
}

/**
 * Intersection over union of two normalized boxes.
 * @param {{x: number, y: number, w: number, h: number}} a
 * @param {{x: number, y: number, w: number, h: number}} b
 * @returns {number} 0..1
 */
export function iou(a, b) {
  const left = Math.max(a.x, b.x)
  const right = Math.min(a.x + a.w, b.x + b.w)
  const top = Math.max(a.y, b.y)
  const bottom = Math.min(a.y + a.h, b.y + b.h)
  const overlap = Math.max(0, right - left) * Math.max(0, bottom - top)
  const union = a.w * a.h + b.w * b.h - overlap
  return union <= 0 ? 0 : overlap / union
}

/**
 * Centre-to-centre distance of two normalized boxes, saturating at
 * {@link CENTER_SATURATION}.
 * @param {{x: number, y: number, w: number, h: number}} a
 * @param {{x: number, y: number, w: number, h: number}} b
 * @returns {number} 0..1, where 1 is "moved at least half a viewport"
 */
export function centerDistance(a, b) {
  const dx = a.x + a.w / 2 - (b.x + b.w / 2)
  const dy = a.y + a.h / 2 - (b.y + b.h / 2)
  return Math.min(1, Math.hypot(dx, dy) / CENTER_SATURATION)
}

/**
 * How far apart two boxes are, 0 for identical and 1 for unrelated.
 *
 * IoU and centre distance answer different questions and both matter. IoU alone
 * saturates: two boxes that do not touch score 0 whether they are neighbours or
 * on opposite corners. Centre distance alone ignores size, so a hero that grew
 * from a line to half the page reads as unchanged. Half each.
 *
 * @param {{x: number, y: number, w: number, h: number}} a
 * @param {{x: number, y: number, w: number, h: number}} b
 * @returns {number} 0..1
 */
export function boxDistance(a, b) {
  return 0.5 * (1 - iou(a, b)) + 0.5 * centerDistance(a, b)
}

/** Boxes of one class, in fingerprint order. */
function ofClass(fingerprint, cls) {
  return (fingerprint?.elements ?? []).filter((e) => e?.class === cls)
}

/**
 * Distance between two sets of same-class boxes.
 *
 * Greedy nearest-partner matching: each box takes the closest one not already
 * spoken for. Navs have no meaningful order and sections usually do, and greedy
 * matching gives the sensible answer for both. A box with no partner — three
 * sections yesterday against two today — counts as maximally distant, because
 * losing a section is a change of silhouette.
 *
 * @param {Array<object>} mine
 * @param {Array<object>} theirs
 * @returns {number|null} 0..1, or null when neither side has the class
 */
export function classDistance(mine, theirs) {
  if (mine.length === 0 && theirs.length === 0) return null
  const taken = new Set()
  let total = 0
  for (const box of mine) {
    let best = 1
    let bestIndex = -1
    for (let i = 0; i < theirs.length; i++) {
      if (taken.has(i)) continue
      const d = boxDistance(box, theirs[i])
      if (d < best || bestIndex === -1) {
        best = d
        bestIndex = i
      }
    }
    if (bestIndex !== -1) taken.add(bestIndex)
    total += bestIndex === -1 ? 1 : best
  }
  // Anything left on the other side is a box that vanished.
  total += theirs.length - taken.size
  return total / Math.max(mine.length, theirs.length)
}

/**
 * How different two silhouettes are, over the classes either page had.
 *
 * @param {object|null} a
 * @param {object|null} b
 * @returns {number|null} 0..1, or null when there is nothing comparable
 */
export function fingerprintDistance(a, b) {
  if (!a?.elements?.length || !b?.elements?.length) return null
  let sum = 0
  let weight = 0
  for (const cls of ELEMENT_CLASSES) {
    const d = classDistance(ofClass(a, cls), ofClass(b, cls))
    if (d === null) continue
    sum += d * CLASS_WEIGHTS[cls]
    weight += CLASS_WEIGHTS[cls]
  }
  return weight === 0 ? null : sum / weight
}

/**
 * Distance from the nearest silhouette in the window.
 *
 * Nearest neighbour, like every other metric here: a build that clones
 * yesterday still averages well against six unlike days.
 *
 * History entries without a fingerprint are skipped rather than treated as
 * maximally distant — every build archived before this shipped has none, and
 * scoring them as distant would hand a repeat a perfect number. That means the
 * metric returns null until a second fingerprinted build exists, and the
 * composite renormalizes around it, exactly as `composition` does for builds
 * that predate the grammar.
 *
 * @param {object|null} current a fingerprint payload
 * @param {Array<{date?: string, fingerprint?: object|null}>} history
 * @returns {{ raw: number|null, score: number|null, nearest: string|null, compared: number }}
 */
export function geometryNovelty(current, history = []) {
  if (!current?.elements?.length) return { raw: null, score: null, nearest: null, compared: 0 }
  // A fingerprint from another FINGERPRINT_VERSION has a different collected
  // shape; comparing it against the current one produces a meaningless
  // distance rather than a missing one (#320).
  const usable = history.filter(
    (h) => h?.fingerprint?.elements?.length && h?.fingerprint?.version === FINGERPRINT_VERSION
  )
  if (usable.length === 0) return { raw: null, score: null, nearest: null, compared: 0 }

  let best = null
  let nearest = null
  for (const h of usable) {
    const d = fingerprintDistance(current, h.fingerprint)
    if (d === null) continue
    if (best === null || d < best) {
      best = d
      nearest = h.date ?? null
    }
  }
  if (best === null) return { raw: null, score: null, nearest: null, compared: 0 }
  return { raw: best, score: best, nearest, compared: usable.length }
}
