/**
 * Deterministic surface gate.
 *
 * The screenshot critic looked at one viewport of one page — `/` at 1280x900,
 * above the fold. The #215 audit walked all eleven visitor-reachable surfaces
 * and found seven defects. Five of them were geometry: a page whose document
 * is wider than the screen it is being read on. `/experiments` ran 657px past
 * a 1440px viewport, which put the headline, the whole nav and every row's
 * metadata off the right edge.
 *
 * Geometry does not need a vision model. `scrollWidth > clientWidth` is a
 * measurement, not a judgement — it cannot hallucinate, it costs no tokens,
 * and it can therefore run over every route at every rung on every build
 * without touching the run's deadline budget. That is what this module does.
 * What it cannot see (a duplicated nav block, type set at the wrong scale)
 * stays the vision critic's job; see `screenshot-critic.js`.
 *
 * Findings are also rendered into a text block for the critic prompt, so the
 * model is told what the measurements say instead of being asked to eyeball
 * it from a downscaled JPEG.
 *
 * @module
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { contrastRatio, rgbToHex } from './contrast.js'
import { ROOT } from './file-manager.js'
import { BODY_TEXT_MIN_PX, TAP_TARGET_MIN_PX } from './responsive-thresholds.js'
import { withPreviewServer } from './snapshot.js'

/**
 * Viewport rungs. Both are already on the ladder `archiver.js:311` defines for
 * responsive measurement, so this introduces no new numbers to reason about.
 *
 * The critic used to capture at 1280x900, which is not a rung on that ladder
 * and not a device anyone has; it now captures at 1440, the same width as the
 * mockup and the header crop. Every defect the audit found was
 * width-dependent, so the width that defines "reviewed" is doing real work.
 */
/**
 * When a block of prose stops being a phrase and starts being a wall.
 *
 * 2026-09-01's /about set a 340-character paragraph at 110px. It filled several
 * screens, and the owner's reaction was "notice how this takes up a ton of the
 * screen?" Every other running-copy block on that same build measured 14-16px,
 * so the boundary is not delicate: the next largest was 205 characters at 14px.
 *
 * Deliberately wide of both. A hero phrase is short and may be enormous; a
 * pull quote may be 180 characters at 48px and still be a design decision.
 * Only the combination — long AND huge — is the defect, because that is prose
 * nobody can read at a glance and nobody chose to set that way.
 */
export const RUNNING_COPY_MIN_CHARS = 180
export const RUNNING_COPY_MAX_PX = 48

export const VIEWPORT_RUNGS = [
  { name: 'mobile', width: 360, height: 640 },
  { name: 'desktop', width: 1440, height: 900 },
]

/** Both schemes. The theme init script reads `prefers-color-scheme`, so a
 *  scheme has to be set at page creation to be honoured — see captureScreenshot. */
export const COLOR_SCHEMES = ['light', 'dark']

/**
 * Sub-pixel slack. Layout arithmetic lands on fractional pixels (a 471.812px
 * column inside a 472px parent), and a rounding artefact is not a defect.
 * Anything at or under this is noise.
 */
export const OVERFLOW_TOLERANCE_PX = 1

/**
 * How many clipped elements one measurement reports.
 *
 * 2026-09-04 measured fourteen at 360 before deduplication. One is enough to
 * force the revision and three is enough to describe the shape of the fault;
 * past that the critic prompt fills with restatements of the same broken
 * column and the model starts counting one defect as many.
 */
export const MAX_CLIPPED_REPORTED = 3

/**
 * How many distinct tap-target texts one measurement reports (#488). A
 * repeated nav renders the same handful of links at every breakpoint, so
 * this is a cap on distinct labels, not on elements — six names the shape of
 * the fault without turning the brief into a link-by-link inventory.
 */
export const MAX_TAP_TARGET_REPORTED = 6

/**
 * How many pages to measure at once. Four keeps one headless Chromium
 * comfortable on a CI runner while cutting the walk from over a minute to
 * roughly twenty seconds.
 */
export const GATE_CONCURRENCY = 4

/**
 * The brand mark in the first fold (#503).
 *
 * Two of the eight builds before this shipped with no mark in the first fold
 * at 360 or 1440 (`shell_posture: footer-only`), and two more set the
 * single-colour mark on a ground it sank into. Nothing measured either; the
 * only checks were two vision critics reading a crop taken from the declared
 * placement, which on a footer-only day is the bottom of the viewport.
 *
 * The height floor is the smallest band the Brand Contract still publishes
 * (`horizontal-md`, 32–48px) now that the two small variants are gone, and
 * it is checked at 1440 only: at 360 the lockup is meant to shrink. The
 * contrast floor is WCAG 1.4.11's 3:1 for non-text graphics, applied to the
 * `single-color` mode only, because `original` carries its own white disc.
 */
export const BRAND_MARK_MIN_PX = 32
export const BRAND_CONTRAST_MIN = 3

/**
 * Routes this gate walks.
 *
 * `/work/<slug>` is expanded from the project list at call time rather than
 * hardcoded, so a project added to `projects.ts` is covered without anyone
 * remembering to add it here.
 *
 * @param {string} [root] - repo root, injectable for tests
 * @returns {Promise<Array<{ id: string, route: string }>>}
 */
export async function listGeneratedRoutes(root = ROOT) {
  const src = await readFile(path.join(root, 'app/content/projects.ts'), 'utf8')
  const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  return [
    { id: 'home', route: '/' },
    { id: 'about', route: '/about' },
    { id: 'work-index', route: '/work' },
    { id: 'experiments', route: '/experiments' },
    ...slugs.map((s) => ({ id: `work-${s}`, route: `/work/${s}` })),
  ]
}

/**
 * Turn one raw measurement into zero or more findings.
 *
 * Split out from the browser work so the rules are unit-testable without
 * Playwright. Pure.
 *
 * @param {object} m - raw measurement from {@link measureRoute}
 * @param {{ tolerancePx?: number }} [opts]
 * @returns {Array<{ kind: string, severity: 'error'|'warning', detail: string }>}
 */
export function evaluateMeasurement(m, { tolerancePx = OVERFLOW_TOLERANCE_PX } = {}) {
  const findings = []

  if (m.error) {
    findings.push({ kind: 'unreachable', severity: 'error', detail: m.error })
    return findings
  }

  if (m.status !== 200) {
    findings.push({
      kind: 'status',
      severity: 'error',
      detail: `HTTP ${m.status}`,
    })
  }

  const over = m.scrollWidth - m.clientWidth
  if (over > tolerancePx) {
    findings.push({
      // A page marked `data-allow-x-overflow` has declared its horizontal
      // scroll deliberate, so it is reported without failing the gate. Nothing
      // sets it today; it exists so a design that genuinely wants a full-bleed
      // horizontal scroller has a way to say so rather than being told to
      // stop, or teaching everyone to ignore the gate.
      kind: 'overflow',
      severity: m.allowsXOverflow ? 'warning' : 'error',
      detail: `document is ${Math.round(over)}px wider than the ${m.clientWidth}px viewport (scrollWidth ${Math.round(m.scrollWidth)})`,
    })
  }

  // Running copy set at display size. The owner's words on the build that
  // prompted this: "notice how this takes up a ton of the screen?"
  if (
    m.worstCopy &&
    m.worstCopy.chars >= RUNNING_COPY_MIN_CHARS &&
    m.worstCopy.fontSizePx > RUNNING_COPY_MAX_PX
  ) {
    findings.push({
      kind: 'running-copy',
      severity: 'error',
      detail:
        `${m.worstCopy.chars} characters of running copy set at ${m.worstCopy.fontSizePx}px ` +
        `(over ${RUNNING_COPY_MAX_PX}px) — "${m.worstCopy.sample}..." . A paragraph at display ` +
        'size is a wall, not a hero. Set prose on the body step and give the display step a phrase.',
    })
  }

  // Content cut off inside a parent that clips it. Distinct from `overflow`
  // above: on 2026-09-04 the document did not scroll horizontally, because an
  // ancestor carried `overflow: hidden`, and the answer panel's type was
  // severed mid-word anyway — "Here," and "Spacem". The measurement existed
  // (responsive-scorer wrote fourteen of them into responsive-metrics.json)
  // and nothing read it, so a clipped hero could neither fail a build nor earn
  // a revision.
  //
  // Two causes, one kind. `viewport` is a box that lands past the right edge
  // of the screen. `text` is a word wider than the box that holds it (#465):
  // no box moves, so only the type is out of place, and the fix is its size,
  // not the layout.
  for (const c of (m.clipped ?? []).slice(0, MAX_CLIPPED_REPORTED)) {
    findings.push({
      kind: 'clipped',
      // Type that is cut off is content the visitor cannot read. A cut
      // decorative box is a crop, which is often what the design wanted, so it
      // is reported without failing the build.
      severity: c.text ? 'error' : 'warning',
      detail: c.cause === 'text' ? describeTextWiderThanBox(c) : describeBoxPastViewport(c, m),
    })
  }

  // Tap targets and running copy nobody can read at a thumb's width (#488).
  // Split into its own function — see advisory360Findings.
  findings.push(...advisory360Findings(m))

  // The brand mark: inside the first fold, tall enough, and readable against
  // its ground (#503). Split into its own function for the same reason as
  // the advisories.
  findings.push(...brandMarkFindings(m))

  if (m.consoleErrors?.length) {
    findings.push({
      kind: 'console',
      severity: 'warning',
      detail: m.consoleErrors.slice(0, 3).join(' | ').slice(0, 300),
    })
  }

  return findings
}

/**
 * The two advisory findings measured at the 360 rung only (#488): a tap
 * target too small for a thumb, and running copy under the reading floor.
 * Split out of `evaluateMeasurement` so that function stays one thing read
 * top to bottom rather than growing a branch per advisory kind.
 *
 * From the 2026-09-07 nightly: 12 tap-target failures on the small-caps nav
 * and running copy at 12.6px, both measured nightly by responsive-scorer.js
 * and read by nothing. Advisory, not disqualifying — a target smaller than a
 * thumb or a paragraph under the reading floor is not the geometry fault this
 * gate exists to block a build on, and `m.viewport === 'mobile'` is the
 * 360px rung: the only width a thumb operates at, and the only one
 * `measureRoute` bothers measuring these on.
 *
 * @param {object} m - raw measurement from {@link measureRoute}
 * @returns {Array<{ kind: string, severity: 'warning', detail: string }>}
 */
function advisory360Findings(m) {
  if (m.viewport !== 'mobile') return []
  const findings = []
  for (const t of (m.tapTargets ?? []).slice(0, MAX_TAP_TARGET_REPORTED)) {
    findings.push({ kind: 'tap-target', severity: 'warning', detail: describeTapTarget(t) })
  }
  if (m.smallCopy) {
    findings.push({
      kind: 'small-copy',
      severity: 'warning',
      detail: describeSmallCopy(m.smallCopy),
    })
  }
  return findings
}

/**
 * The words for one tap target too small for a thumb (#488). One finding per
 * distinct visible text, so the same nav link repeated in a footer reads as
 * one fault with a count, not four identical bullets.
 *
 * @param {{ text: string, count: number, w: number, h: number }} t
 * @returns {string}
 */
function describeTapTarget(t) {
  const times = t.count > 1 ? ` (×${t.count})` : ''
  return (
    `'${t.text}'${times} is a ${t.w}x${t.h}px target; a thumb needs ${TAP_TARGET_MIN_PX}x${TAP_TARGET_MIN_PX}. ` +
    'Give it padding or a taller line box.'
  )
}

/**
 * The words for the worst running-copy block under the reading floor (#488).
 *
 * @param {{ tag: string, fontSizePx: number, sample: string }} c
 * @returns {string}
 */
function describeSmallCopy(c) {
  return (
    `<${c.tag}> runs at ${c.fontSizePx}px, under the ${BODY_TEXT_MIN_PX}px reading floor — ` +
    `"${c.sample}...". Set it on the body step.`
  )
}

/**
 * The words for a box the viewport cuts off. Pure; split out so the two
 * clipped causes read as two sentences rather than one branch.
 *
 * @param {{ tag: string, text: string, right: number, over: number }} c
 * @param {{ clientWidth: number }} m
 * @returns {string}
 */
function describeBoxPastViewport(c, m) {
  return (
    `<${c.tag}> is cut off: its right edge lands at ${c.right}px, ${c.over}px past the ` +
    `${m.clientWidth}px viewport` +
    (c.text
      ? `, severing "${c.text}...". The document does not scroll here, so that content is ` +
        'gone, not merely offscreen. Scale the element to its column at this width instead ' +
        'of carrying a wider layout down.'
      : '. Nothing readable is lost, but the element is being severed rather than fitted. ' +
        'Fit it to the column, or mark it `data-allow-x-overflow` if the crop is deliberate.')
  )
}

/**
 * The words for type wider than its own box (#465). The 2026-09-05 build set
 * "Shutout." at a size no 360px column could hold, and the visitor read "Sh".
 * The box was the right width; the word was not, so the engineer is pointed
 * at the type, not the layout.
 *
 * @param {{ tag: string, text: string, over: number, boxWidth: number }} c
 * @returns {string}
 */
function describeTextWiderThanBox(c) {
  return (
    `<${c.tag}> holds text wider than its own box: "${c.text}..." needs ${c.boxWidth + c.over}px ` +
    `and the box is ${c.boxWidth}px, so ${c.over}px of it is cut off. The box does not scroll, ` +
    'and nothing moved to make room, so the end of the word is gone. The column is the right ' +
    'width; the type is not. Set it at a size that fits this column at this width, or let it ' +
    'wrap.'
  )
}

/**
 * Every element the viewport cuts off, outermost first, worst first.
 *
 * Runs inside the page, and is serialised there two different ways — this
 * module hands it to `page.evaluate` through `new Function`, and
 * `responsive-scorer.js` drops it straight into its CHECKS map, which does the
 * same. So it closes over nothing, and its signature is the
 * `(viewportWidth, thresholds)` shape every check in that map is called with.
 *
 * It lives here, in the gate, because the two consumers used to answer the
 * same question with two different pieces of code: the scorer measured
 * `right > innerWidth` into `responsive-metrics.json` nightly, which nothing
 * read, while the gate had no clipping check at all. One definition, two
 * callers, no drift — the same move #319 made for the overflow tolerance.
 *
 * Two things a bare `right > viewport` walk gets wrong:
 *
 * - It double-counts. 2026-09-04 reported the same fault as
 *   `{DIV "Daylight06:46…" right:392}` and `{DIV "Daylight" right:368}`; a
 *   clipped parent and the child it carries are one fault, so only the
 *   outermost element of a clipped subtree is reported. `querySelectorAll`
 *   walks in document order, which puts every ancestor ahead of its
 *   descendants, so a set of what has already been reported is enough.
 * - It has no opt-out. `data-allow-x-overflow` already tells the overflow
 *   check that a page's horizontal scroll is deliberate; the same attribute on
 *   any element declares a full-bleed crop deliberate here, and on `body` it
 *   covers the page, since `closest` walks to the root.
 *
 * The viewport is `documentElement.clientWidth`, not `window.innerWidth`:
 * innerWidth includes the vertical scrollbar, so the two disagreed with the
 * overflow check on anything narrower than one (#319).
 *
 * A third thing it could not see at all (#465): a word wider than the block
 * that holds it. `getBoundingClientRect` reports the box, and the box is the
 * right width; the type inside it is not, and the surplus is cut wherever an
 * ancestor clips. `scrollWidth > clientWidth` on the block sees it, the same
 * measurement the document-level overflow check makes. A deliberate scroller
 * (`overflow-x: auto | scroll` on the block or any ancestor) is left alone,
 * because there the overrun can be reached.
 *
 * @param {number} [_viewportWidth] unused; present for the CHECKS signature
 * @param {{ overflowTolerancePx?: number }} [thresholds]
 * @returns {Array<{ tag: string, text: string, cause: 'viewport'|'text',
 *   right: number, over: number, boxWidth: number }>} `over` is px past the
 *   viewport for `viewport`, px wider than the box for `text`
 */
export function findClippedElements(_viewportWidth, thresholds) {
  const tolerance = thresholds?.overflowTolerancePx ?? 1
  const limit = document.documentElement.clientWidth

  // Text this element sets: a text node with visible characters, reached
  // through nothing but inline boxes. Inline boxes have no clientWidth, so a
  // word wrapped in a <span> is measured at the block that lays it out.
  const setsText = (el) => {
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && /\S/.test(n.nodeValue)) return true
      if (n.nodeType !== 1) continue
      const display = getComputedStyle(n).display
      if ((display === 'inline' || display === 'contents') && setsText(n)) return true
    }
    return false
  }
  // A deliberate scroller, on the element or any ancestor up to body: the
  // overrun is reachable there, so it is not cut.
  const insideScroller = (el) => {
    for (let p = el; p && p !== document.documentElement; p = p.parentElement) {
      const x = getComputedStyle(p).overflowX
      if (x === 'auto' || x === 'scroll') return true
    }
    return false
  }

  // Everything cut, in document order, which puts every ancestor ahead of its
  // descendants. Two causes: a box the viewport cuts, and text wider than the
  // box that holds it. The second moves no box, so `right` never sees it;
  // `scrollWidth` does, because a word that will not wrap counts as scrollable
  // overflow even where nothing scrolls.
  const past = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (!(r.width > 0 && r.height > 0)) continue
    if (r.right > limit + tolerance) {
      past.push({ el, r, cause: 'viewport', over: r.right - limit })
      continue
    }
    const over = el.scrollWidth - el.clientWidth
    if (over > tolerance && setsText(el) && !insideScroller(el)) {
      past.push({ el, r, cause: 'text', over })
    }
  }

  const outermost = []
  const found = []
  for (const { el, r, cause, over } of past) {
    const inside = outermost.some((p) => p.contains(el))
    if (inside || el.closest('[data-allow-x-overflow]')) continue
    outermost.push(el)
    found.push({
      tag: el.tagName,
      // Whitespace collapsed: formatFindingsForCritic renders one finding as
      // one bullet, and a newline out of the DOM would split it into two.
      text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
      cause,
      right: Math.round(r.right),
      over: Math.round(over),
      boxWidth: el.clientWidth,
    })
  }
  return found.sort((a, b) => b.over - a.over)
}

/**
 * Tap targets too small for a thumb (#488), measured at the 360 rung only —
 * see `measureRoute`, which only calls this there.
 *
 * Runs inside the page; self-contained like {@link findClippedElements}, for
 * the same reason: Playwright serialises it with `toString()`.
 *
 * Grouped by distinct visible text rather than reported per element: a nav
 * repeated in a footer, or a filter bar's five identical "view" links, is one
 * design decision, not five findings. The count and the smallest box travel
 * with the group so the report says how often and how small.
 *
 * @param {number} [_viewportWidth] unused; present for the shared signature
 *   `findClippedElements` and responsive-scorer's CHECKS map both use
 * @param {{ tapTargetMinPx?: number }} [thresholds]
 * @returns {Array<{ text: string, count: number, w: number, h: number }>}
 *   worst (smallest area) first
 */
export function findTapTargetFailures(_viewportWidth, thresholds) {
  const minPx = thresholds?.tapTargetMinPx ?? 44
  const selectors = 'a[href], button, [role="button"], input[type="button"], input[type="submit"]'
  const byText = new Map()
  for (const el of document.querySelectorAll(selectors)) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (r.width >= minPx && r.height >= minPx) continue
    const text =
      (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) || `<${el.tagName}>`
    const w = Math.round(r.width)
    const h = Math.round(r.height)
    const existing = byText.get(text)
    if (!existing) {
      byText.set(text, { text, count: 1, w, h })
    } else {
      existing.count++
      if (w * h < existing.w * existing.h) {
        existing.w = w
        existing.h = h
      }
    }
  }
  return [...byText.values()].sort((a, b) => a.w * a.h - b.w * b.h)
}

/**
 * The worst running-copy block under the reading floor (#488), measured at
 * the 360 rung only — see `measureRoute`, which only calls this there.
 *
 * Runs inside the page; self-contained like {@link findClippedElements}.
 * Same tag set (`p, li, blockquote`) and the same 8-character floor as
 * responsive-scorer's `bodyTextSize`, so a caption set in a `<small>` is
 * excluded by tag exactly the way it already is there — not by size, which
 * is what let a caption at the chassis's 11.2px step fail the check as noise
 * (#469).
 *
 * @param {number} [_viewportWidth] unused; present for the shared signature
 * @param {{ bodyTextMinPx?: number }} [thresholds]
 * @returns {null | { tag: string, fontSizePx: number, sample: string }}
 */
export function findSmallCopy(_viewportWidth, thresholds) {
  const minPx = thresholds?.bodyTextMinPx ?? 16
  const root = document.querySelector('main') || document.body
  let worst = null
  for (const el of root.querySelectorAll('p, li, blockquote')) {
    const text = (el.textContent || '').trim()
    if (text.length < 8) continue
    const fs = Number.parseFloat(getComputedStyle(el).fontSize)
    if (!Number.isFinite(fs) || fs >= minPx) continue
    if (!worst || fs < worst.fontSizePx) {
      worst = { tag: el.tagName, fontSizePx: Math.round(fs * 10) / 10, sample: text.slice(0, 60) }
    }
  }
  return worst
}

/**
 * The `brand-fold` and `brand-contrast` findings (#503), from what
 * {@link findBrandMark} measured. Engineer-owned routes only: `/experiments`
 * and `/work` are authored files, and a fault there is a ticket for a human
 * the way every other finding on those routes already is.
 *
 * `brand-fold` fires when no mark box intersects the viewport at scroll
 * position zero, when no mark is on the page at all, and when the mark that
 * is in the fold renders under {@link BRAND_MARK_MIN_PX} tall at 1440. The
 * detail names the rung and the scheme, and where the nearest mark is against
 * where the fold ends, so the engineer is told the two numbers that have to
 * meet. It does not compare against the declared `mark_px`; the critics do.
 *
 * `brand-contrast` fires for a `single-color` mark whose `currentColor`
 * reads under {@link BRAND_CONTRAST_MIN}:1 against the first painted
 * background behind it.
 *
 * @param {object} m - raw measurement from {@link measureRoute}
 * @returns {Array<{ kind: string, severity: 'error', detail: string }>}
 */
function brandMarkFindings(m) {
  const brand = m.brand
  if (!brand || ownerForSurface(m.route) !== 'react-engineer') return []
  const rung = VIEWPORT_RUNGS.find((v) => v.name === m.viewport)?.width ?? m.clientWidth
  const where = `at ${rung} (${m.scheme})`

  if (!brand.inFold) return [brandMissingFinding(brand, where)]
  return [
    brandHeightFinding(brand.inFold, rung, where),
    brandContrastFinding(brand.inFold, where),
  ].filter(Boolean)
}

/** The `brand-fold` finding for a page with no mark in the viewport. */
function brandMissingFinding(brand, where) {
  const detail =
    brand.count === 0
      ? `no brand mark rendered ${where}`
      : `no brand mark inside the first fold ${where}: nearest mark at y=${brand.nearestY}, ` +
        `viewport ${brand.viewportHeight} tall`
  return { kind: 'brand-fold', severity: 'error', detail }
}

/** The `brand-fold` finding for a mark under the height floor at 1440, else null. */
function brandHeightFinding(inFold, rung, where) {
  if (rung !== 1440 || inFold.height >= BRAND_MARK_MIN_PX) return null
  return {
    kind: 'brand-fold',
    severity: 'error',
    detail: `mark rendered ${inFold.height}px tall ${where}, floor ${BRAND_MARK_MIN_PX}`,
  }
}

/** The `brand-contrast` finding for a single-colour mark under the ratio floor, else null. */
function brandContrastFinding(inFold, where) {
  const { mode, ink, ground } = inFold
  if (mode !== 'single-color' || !ink || !ground) return null
  const ratio = contrastRatio(ink, ground)
  if (ratio >= BRAND_CONTRAST_MIN) return null
  return {
    kind: 'brand-contrast',
    severity: 'error',
    detail:
      `single-colour mark ${rgbToHex(ink)} on ${rgbToHex(ground)} ${where}, ` +
      `${ratio.toFixed(1)}:1 (floor ${BRAND_CONTRAST_MIN}:1)`,
  }
}

/**
 * Where the brand mark is, and what it sits on (#503).
 *
 * Runs inside the page; self-contained like {@link findClippedElements}, with
 * the same `(viewportWidth, thresholds)` signature, for the same reason:
 * Playwright serialises it with `toString()`.
 *
 * Every `[data-brand-mark]` element is measured with `getBoundingClientRect`
 * at scroll position zero. The first whose box intersects the viewport
 * (`documentElement.clientWidth` × `clientHeight`, not `innerWidth`, for the
 * scrollbar reason #319 found) is reported with its box, its declared mode,
 * its ink and its ground. When none does, `nearestY` is the top of the mark
 * closest to the viewport, so the finding can say how far away it is.
 *
 * Ink is `getComputedStyle(svg).color`: the single-colour mark inherits
 * `currentColor`. Ground is the first ancestor `backgroundColor` with alpha
 * above zero, then `body`'s, then white. Alpha compositing beyond "alpha > 0
 * counts as painted" is ignored on purpose: a translucent tint over a field
 * is read as the tint, which errs toward reporting a low ratio, and the
 * engineer can answer that with a solid ground.
 *
 * @param {number} [_viewportWidth] unused; present for the shared signature
 * @param {object} [_thresholds] unused; present for the shared signature
 * @returns {{ count: number, viewportHeight: number, nearestY: number|null,
 *   inFold: null | { x: number, y: number, width: number, height: number,
 *     mode: string|null, ink: { r: number, g: number, b: number }|null,
 *     ground: { r: number, g: number, b: number } } }}
 */
export function findBrandMark(_viewportWidth, _thresholds) {
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight

  // Same parsing shape as measureDesignFidelity in design-fidelity.js.
  const parseRgb = (str) => {
    const m = /rgba?\(([^)]+)\)/.exec(str || '')
    if (!m) return null
    const parts = m[1].split(/[\s,/]+/).map((s) => Number.parseFloat(s))
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 }
  }
  const channels = (rgb) => ({ r: rgb.r, g: rgb.g, b: rgb.b })
  const groundFor = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const rgb = parseRgb(getComputedStyle(p).backgroundColor)
      if (rgb && rgb.a > 0) return channels(rgb)
    }
    const body = parseRgb(getComputedStyle(document.body).backgroundColor)
    return body && body.a > 0 ? channels(body) : { r: 255, g: 255, b: 255 }
  }

  const describe = ({ el, r }) => {
    const ink = parseRgb(getComputedStyle(el).color)
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      width: Math.round(r.width),
      height: Math.round(r.height),
      mode: el.getAttribute('data-brand-mode'),
      ink: ink ? channels(ink) : null,
      ground: groundFor(el),
    }
  }
  // Pixels between the box and the viewport, vertically; 0 when they overlap.
  const distanceOf = (r) => Math.max(0, -r.bottom, r.top - vh)

  const marks = document.querySelectorAll('[data-brand-mark]')
  const boxes = Array.from(marks, (el) => ({ el, r: el.getBoundingClientRect() })).filter(
    ({ r }) => r.width > 0 && r.height > 0
  )
  const hit = boxes.find(({ r }) => r.right > 0 && r.bottom > 0 && r.left < vw && r.top < vh)

  let nearest = null
  for (const { r } of boxes) {
    const distance = distanceOf(r)
    if (nearest === null || distance < nearest.distance)
      nearest = { distance, y: Math.round(r.top) }
  }
  return {
    count: marks.length,
    viewportHeight: vh,
    nearestY: nearest ? nearest.y : null,
    inFold: hit ? describe(hit) : null,
  }
}

/**
 * Runs inside the page. Self-contained on purpose: Playwright serialises it
 * with toString(), so it can reference nothing from this module.
 *
 * A running-copy block is an element whose children are all inline boxes.
 * The first version measured leaf elements only, so a paragraph holding one
 * <a>, <em> or <br> was never measured and the 340-character paragraph at
 * 110px that this exists for (2026-09-01's /about) slipped through as soon
 * as it carried a link (#307). Leaves still qualify: they have no children.
 *
 * @param {{ minChars: number }} args
 * @returns {{ scrollWidth: number, clientWidth: number, allowsXOverflow: boolean,
 *   worstCopy: null | { chars: number, fontSizePx: number, sample: string } }}
 */
export function collectSurfaceMetrics({ minChars }) {
  const isInlineBox = (child) => {
    const display = getComputedStyle(child).display
    return display === 'none' || display === 'contents' || display.startsWith('inline')
  }
  let worstCopy = null
  for (const el of document.querySelectorAll('body *')) {
    if (!Array.from(el.children).every(isInlineBox)) continue
    const text = (el.textContent || '').trim()
    if (text.length < minChars) continue
    const size = Number.parseFloat(getComputedStyle(el).fontSize)
    if (!Number.isFinite(size)) continue
    if (!worstCopy || size > worstCopy.fontSizePx) {
      worstCopy = {
        chars: text.length,
        fontSizePx: Math.round(size),
        sample: text.slice(0, 60),
      }
    }
  }
  return {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    allowsXOverflow: document.body?.hasAttribute('data-allow-x-overflow') ?? false,
    worstCopy,
  }
}

/**
 * Measure one route at one viewport in one colour scheme.
 *
 * @param {import('playwright').Browser} browser
 * @param {string} baseUrl
 * @param {{ id: string, route: string }} surface
 * @param {{ name: string, width: number, height: number }} viewport
 * @param {'light'|'dark'} scheme
 * @returns {Promise<object>} raw measurement
 */
export async function measureRoute(browser, baseUrl, surface, viewport, scheme) {
  const base = { id: surface.id, route: surface.route, viewport: viewport.name, scheme }
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    colorScheme: scheme,
  })
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(String(err)))

  try {
    const resp = await page.goto(`${baseUrl}${surface.route}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    // Fonts change metrics, and metrics are the entire point of this gate.
    await page.waitForTimeout(900)
    const box = await page.evaluate(collectSurfaceMetrics, { minChars: RUNNING_COPY_MIN_CHARS })
    // A second evaluate rather than a branch inside collectSurfaceMetrics:
    // findClippedElements is shared with responsive-scorer.js, and a function
    // Playwright serialises cannot call another one. Rebuilding it from its
    // own source in the page is how the scorer already runs its checks.
    const clipped = await page.evaluate(
      ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
      [findClippedElements.toString(), { overflowTolerancePx: OVERFLOW_TOLERANCE_PX }]
    )
    // Tap targets and running copy at reading size only matter where a thumb
    // does the tapping (#488): measured at the 360 rung only, so a desktop
    // pass spends nothing on a question it cannot ask.
    // The brand mark, at both rungs and in both schemes (#503).
    const brand = await page.evaluate(
      ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
      [findBrandMark.toString(), {}]
    )
    let tapTargets = []
    let smallCopy = null
    if (viewport.width === 360) {
      tapTargets = await page.evaluate(
        ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
        [findTapTargetFailures.toString(), { tapTargetMinPx: TAP_TARGET_MIN_PX }]
      )
      smallCopy = await page.evaluate(
        ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
        [findSmallCopy.toString(), { bodyTextMinPx: BODY_TEXT_MIN_PX }]
      )
    }
    return {
      ...base,
      status: resp?.status() ?? null,
      ...box,
      clipped,
      brand,
      tapTargets,
      smallCopy,
      consoleErrors,
    }
  } catch (err) {
    return { ...base, error: err.message, consoleErrors }
  } finally {
    await page.close()
  }
}

/**
 * Walk every route at every rung in both schemes and return what is wrong.
 *
 * Reuses a preview server when the caller already has one (`port`), which is
 * the normal case inside the pipeline — the screenshot capture has one open.
 *
 * @param {{ port?: number, routes?: Array<{id:string,route:string}>,
 *          viewports?: typeof VIEWPORT_RUNGS, schemes?: string[],
 *          root?: string }} [opts] `root` is where the generated routes are
 *   listed from when `routes` is not given; defaults to the repo
 * @returns {Promise<{ findings: Array<object>, measured: number, errorCount: number }>}
 */
export async function runSurfaceGate({
  port,
  routes,
  viewports = VIEWPORT_RUNGS,
  schemes = COLOR_SCHEMES,
  concurrency = GATE_CONCURRENCY,
  root = ROOT,
} = {}) {
  const { chromium } = await import('playwright')
  const surfaces = routes ?? (await listGeneratedRoutes(root))

  const jobs = []
  for (const surface of surfaces) {
    for (const viewport of viewports) {
      for (const scheme of schemes) jobs.push({ surface, viewport, scheme })
    }
  }

  return await withPreviewServer(
    async (baseUrl) => {
      let browser = null
      const findings = []
      let measured = 0
      try {
        browser = await chromium.launch({ headless: true })

        // Nearly all of a measurement is spent waiting — networkidle, then the
        // font settle. Serially that is over a minute for one build, against a
        // run that already enforces a deadline. Pages in one browser are
        // independent, so a small pool cuts the wall clock by roughly the
        // concurrency without changing a single number that comes back.
        let cursor = 0
        const worker = async () => {
          for (;;) {
            const job = jobs[cursor++]
            if (!job) return
            const m = await measureRoute(browser, baseUrl, job.surface, job.viewport, job.scheme)
            measured++
            for (const f of evaluateMeasurement(m)) {
              findings.push({
                surface: job.surface.route,
                viewport: job.viewport.name,
                width: job.viewport.width,
                scheme: job.scheme,
                ...f,
              })
            }
          }
        }
        await Promise.all(
          Array.from({ length: Math.min(concurrency, jobs.length) }, () => worker())
        )
      } finally {
        // Same reasoning as captureScreenshot: a throw mid-walk must not
        // orphan a headless Chromium, because the gate can run more than once
        // per build and the leaks accumulate.
        if (browser) await browser.close()
      }
      return {
        findings,
        measured,
        errorCount: findings.filter((f) => f.severity === 'error').length,
      }
    },
    { port }
  )
}

/**
 * Render findings as a text block for the screenshot critic's prompt.
 *
 * Deliberately text, not more image blocks: the measurements are already
 * exact, and describing them costs a few hundred tokens where a capture per
 * route would cost image blocks and wall-clock against a run that already
 * enforces a deadline.
 *
 * Identical findings across schemes are collapsed — a page that overflows in
 * light overflows in dark for the same reason, and saying it twice invites the
 * model to treat one defect as two.
 *
 * @param {Array<object>} findings
 * @returns {string} empty string when there is nothing to report
 */
export function formatFindingsForCritic(findings) {
  if (!findings?.length) return ''

  const byKey = new Map()
  for (const f of findings) {
    const key = `${f.surface}|${f.viewport}|${f.kind}|${f.detail}`
    if (!byKey.has(key)) byKey.set(key, { ...f, schemes: [] })
    byKey.get(key).schemes.push(f.scheme)
  }

  const lines = [...byKey.values()]
    // Errors first: the model should read the disqualifying facts before the
    // advisory ones.
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1))
    .map((f) => {
      const schemes =
        f.schemes.length === COLOR_SCHEMES.length ? 'both schemes' : f.schemes.join(' + ')
      return `- [${f.severity}] ${f.surface} at ${f.width}px (${schemes}): ${f.detail}`
    })

  return [
    '## Measured layout faults',
    '',
    'These are measurements taken from the live render, not observations from the images below.',
    'They are exact. Do not re-litigate them against the screenshots, and do not count one fault',
    'twice because it appears at more than one viewport.',
    '',
    ...lines,
  ].join('\n')
}

/**
 * The error-severity findings a given owner can act on.
 *
 * This is what makes the gate a gate (#306): the orchestrator used to log
 * `errorCount`, push a verdict nobody read, and leave the revision decision
 * to the screenshot critic alone. A 657px overflow the critic could not see
 * shipped with a SHIP.
 *
 * @param {Array<object>} findings
 * @param {'react-engineer'|'human'} owner
 * @returns {Array<object>}
 */
export function faultsForOwner(findings, owner) {
  return (findings ?? []).filter(
    (f) => f.severity === 'error' && ownerForSurface(f.surface) === owner
  )
}

/**
 * The `tap-target` and `small-copy` warnings on a given owner's surfaces
 * (#488). These never force a revision — see `faultsForOwner`, which only
 * ever sees `error` severity — but when a revision runs for another reason,
 * the engineer is already about to touch the file, so it gets these for free
 * in the repair brief. See `formatAdvisoryForRepairBrief`.
 *
 * @param {Array<object>} findings
 * @param {'react-engineer'|'human'} owner
 * @returns {Array<object>}
 */
export function advisoryFaultsForOwner(findings, owner) {
  return (findings ?? []).filter(
    (f) =>
      (f.kind === 'tap-target' || f.kind === 'small-copy') && ownerForSurface(f.surface) === owner
  )
}

/**
 * Render advisory findings as a section for the react-engineer repair brief
 * (#488), appended after the errors. Distinct from `formatFindingsForCritic`:
 * that block is exact measurements handed to the critic as facts not up for
 * debate; this one is handed to the engineer as things worth fixing while the
 * file is already open, not things that put it there.
 *
 * @param {Array<object>} findings - from {@link advisoryFaultsForOwner}
 * @returns {string} empty string when there is nothing to report
 */
export function formatAdvisoryForRepairBrief(findings) {
  if (!findings?.length) return ''

  const byKey = new Map()
  for (const f of findings) {
    const key = `${f.surface}|${f.kind}|${f.detail}`
    if (!byKey.has(key)) byKey.set(key, f)
  }
  const lines = [...byKey.values()].map((f) => `- ${f.surface} at ${f.width}px: ${f.detail}`)

  return [
    '## Advisory at 360',
    '',
    'These do not block the build. Fix them while this file is open; do not open a file only for these.',
    '',
    ...lines,
  ].join('\n')
}

/**
 * Which agent can act on a finding.
 *
 * The revision loop routes every REVISE to `react-engineer`
 * (`design-agents.js`), which is right for the nightly components and wrong
 * for everything else. `/experiments` and `/work` are authored route files no
 * agent owns: feedback about them is a ticket for a human, not a prompt for a
 * model, and sending it to the engineer produces a confident edit to a file it
 * was never given.
 *
 * @param {string} surface - route path
 * @returns {'react-engineer'|'human'}
 */
export function ownerForSurface(surface) {
  // Kept as an explicit list rather than derived from MUTABLE_FILES, because
  // the mapping is route -> file and several routes share Layout/Sidebar.
  const generated = ['/', '/about']
  if (generated.includes(surface)) return 'react-engineer'
  if (surface.startsWith('/work/')) return 'react-engineer'
  return 'human'
}
