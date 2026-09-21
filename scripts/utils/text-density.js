/**
 * How much of a phone page is text, fold by fold (#569).
 *
 * The home register on 2026-09-20 was seven rows of about 209px at the phone,
 * each holding a 24px title and one 12.64px meta line, 1,700 of the page's
 * 3,837px. No gate measured it and the critic's phone filmstrip, scaled to
 * about 0.7 image pixels per CSS pixel, is where slack like that is hardest
 * to see. This turns it into a number the critic is handed.
 *
 * Density is the area covered by text boxes over the area of the fold. A text
 * box is one rect per rendered line of a visible text node (see
 * `text-density-page.js`), and overlapping rects count once. A fold is a
 * band of the page as tall as the phone viewport, counted from the top; the
 * last band is shorter unless the page is a whole number of folds, and is
 * marked `partial`. The page-wide number is the covered area over the whole
 * page.
 *
 * It is a measurement for the critic and never a gate finding: a fold given
 * to a picture, a field of colour or a single word set at display size is a
 * design decision that reads as sparse here. The critic looks; nothing fails.
 *
 * @module
 */

import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'

/** What the page walk needs. */
export const TEXT_DENSITY_OPTIONS = Object.freeze({
  /** Text boxes the walk hands back; a page of a few hundred lines is far under it. */
  maxRects: 20000,
})

/** How tall a fold is: what the phone shows in one screen. */
export const DENSITY_FOLD_PX = NARROW_VIEWPORT.height

/**
 * A fold under this share of text is called sparse to the critic.
 * Calibrated in docs/evidence/legibility-measurements/.
 */
export const SPARSE_FOLD_RATIO = 0.15

/**
 * The area of the union of rects, each `[left, top, right, bottom]`. Sweeps
 * the horizontal slabs between distinct edges and merges the x-spans that
 * cross each one.
 *
 * @param {Array<[number, number, number, number]>} rects
 * @returns {number}
 */
export function unionArea(rects) {
  const ys = [...new Set(rects.flatMap((r) => [r[1], r[3]]))].sort((a, b) => a - b)
  let area = 0
  for (let i = 0; i < ys.length - 1; i++) {
    const [top, bottom] = [ys[i], ys[i + 1]]
    const spans = rects
      .filter((r) => r[1] <= top && r[3] >= bottom)
      .map((r) => [r[0], r[2]])
      .sort((a, b) => a[0] - b[0])
    let covered = 0
    let reach = Number.NEGATIVE_INFINITY
    for (const [left, right] of spans) {
      if (right <= reach) continue
      covered += right - Math.max(left, reach)
      reach = right
    }
    area += covered * (bottom - top)
  }
  return area
}

/** The rects that fall in the band, cut to it. */
function clipToBand(rects, from, to) {
  const clipped = []
  for (const r of rects) {
    const top = Math.max(r[1], from)
    const bottom = Math.min(r[3], to)
    if (bottom > top) clipped.push([r[0], top, r[2], bottom])
  }
  return clipped
}

const round3 = (n) => Math.round(n * 1000) / 1000

/**
 * The density of each fold of a page, the lowest, and the whole page's.
 *
 * `lowest` is over whole folds. A page shorter than one fold, or a short last
 * band, is not a fold that could be sparse, so it only counts when there is
 * no whole fold to count.
 *
 * @param {{ width: number, height: number, rects: Array<[number, number, number, number]> }} seen
 *   from `collectTextRects`
 * @param {number} [foldPx]
 * @returns {{ foldPx: number, widthPx: number, heightPx: number, wholePage: number,
 *   folds: Array<{ index: number, ratio: number, px: number, partial: boolean }>,
 *   lowest: { index: number, ratio: number } }}
 */
export function foldDensity({ width, height, rects }, foldPx = DENSITY_FOLD_PX) {
  const count = Math.max(1, Math.ceil(height / foldPx))
  const folds = []
  let covered = 0
  for (let i = 0; i < count; i++) {
    const from = i * foldPx
    const to = Math.min(height, from + foldPx)
    const area = unionArea(clipToBand(rects, from, to))
    covered += area
    const bandArea = width * Math.max(to - from, 1)
    folds.push({
      index: i + 1,
      ratio: round3(area / bandArea),
      px: Math.round(to - from),
      partial: to - from < foldPx,
    })
  }
  const whole = folds.filter((f) => !f.partial)
  const pool = whole.length ? whole : folds
  const lowest = pool.reduce((a, b) => (b.ratio < a.ratio ? b : a))
  return {
    foldPx,
    widthPx: width,
    heightPx: height,
    wholePage: round3(covered / (width * Math.max(height, 1))),
    folds,
    lowest: { index: lowest.index, ratio: lowest.ratio },
  }
}

const pct = (ratio) => `${Math.round(ratio * 100)}%`

/** One fold as it reads in a list; a short last band says how short. */
const describeFold = (f) => (f.partial ? `${pct(f.ratio)} (last, ${f.px}px)` : pct(f.ratio))

/** One route as a line: every fold, the lowest, the page. */
function describeRoute(r) {
  return (
    `- ${r.route}, ${r.folds.length} fold${r.folds.length === 1 ? '' : 's'} of ${r.foldPx}px: ` +
    `${r.folds.map(describeFold).join(' ')}. Lowest ${pct(r.lowest.ratio)} (fold ${r.lowest.index}), ` +
    `whole page ${pct(r.wholePage)}.`
  )
}

/** The routes the critic is sent no image of, in one line: where the lowest fold is. */
function describeRest(rest) {
  const low = rest.reduce((a, b) => (b.lowest.ratio < a.lowest.ratio ? b : a))
  return (
    `- ${rest.length} more case stud${rest.length === 1 ? 'y' : 'ies'}: the lowest fold is ` +
    `${pct(low.lowest.ratio)} (${low.route}, fold ${low.lowest.index} of ${low.folds.length}).`
  )
}

/**
 * The density facts as a section for the screenshot critic's prompt. `/`,
 * `/about` and the first case study are the routes the critic is sent phone
 * images of, so they are listed fold by fold. The other case studies are one
 * closing line.
 *
 * @param {Array<ReturnType<typeof foldDensity> & { route: string }>} records
 *   one per route, in route order
 * @param {number} [sparse]
 * @returns {string} empty when nothing was measured
 */
export function formatDensityForCritic(records, sparse = SPARSE_FOLD_RATIO) {
  if (!records?.length) return ''
  const firstCase = records.find((r) => r.route.startsWith('/work/'))
  const seen = (r) => r.route === '/' || r.route === '/about' || r === firstCase
  const rest = records.filter((r) => !seen(r))
  return [
    '## Measured phone density',
    '',
    `Text-box area over fold area at the phone (${records[0].widthPx}px wide), light scheme.`,
    'A fold is one phone screen counted from the top of the page, and a value is the share of it covered by text.',
    `Under ${pct(sparse)} is sparse. This is a measurement and not a fault: a fold given to an image or a field of colour reads as sparse.`,
    '',
    ...records.filter(seen).map(describeRoute),
    ...(rest.length ? [describeRest(rest)] : []),
  ].join('\n')
}
