/**
 * Text under the night's shell, on the hand-written routes (#640).
 *
 * `/work`, `/experiments` and `/elements` are written by hand and sit inside
 * the Layout and Sidebar the engineer writes each night. The e2e spec used to
 * check that no line of the shell's text landed on a line of the route's, and
 * it could only do that against whatever design the last night committed. On
 * 2026-09-21 the published night's lockup sat on "ELEMENTS" and on
 * "Experiments", and main went red on every PR after it, where nothing could
 * act on it. The check lives here now, in the gate, which runs during the
 * night.
 *
 * The route's own text is what sits inside `[data-page]`; the shell is every
 * other line on the page. That is the line the e2e spec drew, and it is what
 * keeps a design's own layering out: a ghosted numeral behind a hero is one
 * component's decision, and a route with no `[data-page]` (every route the
 * engineer writes) reports nothing.
 *
 * A finding is an error on the route it was measured on, so `faultsForOwner`
 * sends it where every other fault on that route goes: on the hand-written
 * routes, to the rating issue's "Needs a human" section, forcing nothing.
 *
 * The second probe here is the same question turned round (#702): the night's
 * shell pinned over the site's own rail on the routes that carry one. See
 * `measureRailOverlap`.
 *
 * @module
 */

import { runPageKit, TEXT_CONTRAST_PAGE_FUNCTIONS } from './text-contrast-page.js'

/**
 * The faintest shell text that counts. 2026-09-21 set its ghosted scoreboard
 * at opacity 0.08, and a texture like it in the shell is still type over the
 * page; under 0.05 a line is not read as type at all.
 * Measured as the product of the element's and its ancestors' opacity and the
 * alpha of its ink, so an `rgba` colour at 5% counts the same as `opacity`.
 */
export const SHELL_OVERLAP_MIN_OPACITY = 0.05

/**
 * How much of a line of the route's text a line of the shell's must cover.
 * Glyph boxes on neighbouring lines can touch by a pixel where the leading is
 * tight; a tenth of the line is a letter or more, which is what a reader sees.
 */
export const SHELL_OVERLAP_MIN_SHARE = 0.1

/** Shell elements one measurement reports, and route lines named per element. */
export const MAX_SHELL_OVERLAPS_REPORTED = 3

/** The fix line a finding ends with, quoted by the engineer prompt's checklist (#634). */
export const SHELL_OVERLAP_FIX =
  "move the shell's text off the page's content, or give the route the room the shell takes."
const MAX_OWN_LINES_NAMED = 3

/*
 * The page half. Like `render-health-page.js`, every function named `page*`
 * runs inside the browser and is self-contained, because Playwright ships
 * source and not closures; `runPageKit` rebuilds them there and hands each
 * the kit as its last argument, so they reach each other and the contrast
 * walk's `selector` as `kit.name(...)`. They report records and decide
 * nothing.
 */

/** The alpha of a computed `rgb()`/`rgba()` colour; 1 when it has none. */
function pageAlphaOf(color) {
  const m = /rgba?\(([^)]+)\)/.exec(color || '')
  const parts = m ? m[1].split(/[\s,/]+/).filter(Boolean) : []
  return parts.length > 3 ? Number.parseFloat(parts[3]) : 1
}

/** What the reader sees of a line: opacity all the way up, times its ink. */
function pageInkOf(el, kit) {
  let ink = kit.alphaOf(getComputedStyle(el).color)
  for (let p = el; p; p = p.parentElement) ink *= Number.parseFloat(getComputedStyle(p).opacity)
  return ink
}

/** A line's rect cut to every ancestor that clips; null when nothing is left. */
function pageClipRect(rect, el) {
  let r = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
  for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
    const cs = getComputedStyle(p)
    if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue
    const c = p.getBoundingClientRect()
    r = {
      left: Math.max(r.left, c.left),
      top: Math.max(r.top, c.top),
      right: Math.min(r.right, c.right),
      bottom: Math.min(r.bottom, c.bottom),
    }
  }
  return r.right > r.left && r.bottom > r.top ? r : null
}

/**
 * The lines one text node draws, with whose they are, or none. The route's
 * text counts while a reveal still holds it at opacity 0: the reveal ends and
 * the shell is still on it. The shell's has to be seen to count.
 */
function pageLinesOf(node, pages, range, kit) {
  const el = node.parentElement
  const text = (node.nodeValue || '').replace(/\s+/g, ' ').trim()
  const skipped = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE']
  if (!el || !text || skipped.includes(el.tagName)) return []
  if (getComputedStyle(el).visibility !== 'visible') return []
  const own = pages.some((p) => p.contains(el))
  const ink = own ? 1 : kit.inkOf(el)
  if (ink < kit.options.minOpacity) return []
  range.selectNodeContents(node)
  return Array.from(range.getClientRects(), (rect) => kit.clipRect(rect, el))
    .filter(Boolean)
    .map((r) => ({ el, own, text: text.slice(0, 30), r, ink }))
}

/** How much of `b` that `a` covers, as a share of `b`'s area. */
function pageCoverShare(a, b) {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left)
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
  return w > 0 && h > 0 ? (w * h) / ((b.right - b.left) * (b.bottom - b.top)) : 0
}

/** Add one covered line of the route's to the record of the shell element over it. */
function pageAddHit(byShell, s, o, kit) {
  const held = byShell.get(s.el) ?? {
    selector: kit.selector(s.el),
    text: s.text,
    opacity: Math.round(s.ink * 100) / 100,
    lines: [],
    count: 0,
  }
  held.count++
  if (!held.lines.includes(o.text)) held.lines.push(o.text)
  byShell.set(s.el, held)
}

/**
 * Every visible line of shell text that sits on a line of the route's own
 * text, grouped by the shell element that draws it, most lines covered
 * first. Lines are the text nodes' client rects, cut to any ancestor that
 * clips, so a texture cropped by its own box is measured where it is drawn.
 * A page with no `[data-page]` has no route text to tell apart, and reports
 * nothing.
 */
function pageFindTextUnderShell(kit) {
  const pages = [...document.querySelectorAll('[data-page]')]
  if (!pages.length) return []
  const range = document.createRange()
  const lines = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    lines.push(...kit.linesOf(n, pages, range))
  }
  const own = lines.filter((l) => l.own)
  const byShell = new Map()
  for (const s of lines.filter((l) => !l.own)) {
    for (const o of own) {
      if (kit.coverShare(s.r, o.r) >= kit.options.minShare) kit.addHit(byShell, s, o)
    }
  }
  return [...byShell.values()].sort((a, b) => b.count - a.count)
}

/** The kit the probe runs on: its own functions and the contrast walk's element chain. */
const KIT = {
  describe: TEXT_CONTRAST_PAGE_FUNCTIONS.describe,
  selector: TEXT_CONTRAST_PAGE_FUNCTIONS.selector,
  alphaOf: pageAlphaOf,
  inkOf: pageInkOf,
  clipRect: pageClipRect,
  linesOf: pageLinesOf,
  coverShare: pageCoverShare,
  addHit: pageAddHit,
  findTextUnderShell: pageFindTextUnderShell,
}

/**
 * Read the probe off a page at the viewport it stands at.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<Array<{ selector: string, text: string, opacity: number,
 *   lines: string[], count: number }>>}
 */
export function measureShellOverlap(page) {
  return runPageKit(page, KIT, 'findTextUnderShell', {
    minOpacity: SHELL_OVERLAP_MIN_OPACITY,
    minShare: SHELL_OVERLAP_MIN_SHARE,
  })
}

/**
 * The words for one shell element sitting on the route's text.
 *
 * @param {{ selector: string, text: string, opacity: number, lines: string[],
 *   count: number }} hit
 * @returns {string}
 */
export function describeShellOverlap(hit) {
  const named = hit.lines.slice(0, MAX_OWN_LINES_NAMED).map((t) => `"${t}"`)
  const more = hit.lines.length > named.length ? ` and ${hit.lines.length - named.length} more` : ''
  const faint = hit.opacity < 1 ? ` at opacity ${hit.opacity}` : ''
  return (
    `the night's shell draws "${hit.text}"${faint} (<${hit.selector}>) over the route's own ` +
    `text: ${named.join(', ')}${more}. The route is hand-written and the shell is the ` +
    `night's Layout or Sidebar; ${SHELL_OVERLAP_FIX}`
  )
}

/**
 * The `shell-overlap` findings for one measurement: one per shell element,
 * worst first, capped. An error, owned by the route; see the module note.
 *
 * @param {{ shellOverlap?: Array<object>|null }} m raw measurement
 * @returns {Array<{ kind: 'shell-overlap', severity: 'error', detail: string }>}
 */
export function shellOverlapFindings(m) {
  if (!Array.isArray(m.shellOverlap)) return []
  return m.shellOverlap.slice(0, MAX_SHELL_OVERLAPS_REPORTED).map((hit) => ({
    kind: 'shell-overlap',
    severity: 'error',
    detail: describeShellOverlap(hit),
  }))
}

/*
 * The night's shell over the site's rail (#702).
 *
 * `/`, `/about` and `/work/*` open on the live rail: `<div data-live-frame>`,
 * 44px tall, in normal flow at the top of `<body>`, rendered from `__root`
 * above the night's `<Layout>`. A top bar the night pins with
 * `position: fixed; top: 0` is laid out against the viewport, not the flow,
 * so at scroll 0 it sits on the rail and hides the line that tells a first
 * visitor the site is redesigned every morning. A sticky bar does not: it is
 * in flow below the rail until the rail has scrolled away, so it needs no
 * check. This is the reverse of the probe above (the shell over the route's
 * text), and like it, it is an error on the route it was measured on.
 */

/** Fixed elements one measurement reports. A header and a menu button is two. */
export const MAX_RAIL_OVERLAPS_REPORTED = 3

/** The fix line a rail-overlap finding ends with, quoted by the engineer prompt's checklist. */
export const RAIL_OVERLAP_FIX =
  'pin a top bar with `position: sticky; top: 0`, never `position: fixed`; sticky stays in ' +
  'flow below the rail until the rail scrolls away. Do not style, move or hide the rail.'

/**
 * What one element does to the rail: a record when it is `position: fixed`,
 * drawn, and its box overlaps the rail's; null otherwise. Drawn is laid out
 * with a size, not `visibility: hidden` and not at opacity 0. A negative
 * `z-index` paints under the page's in-flow content, rail included, so a
 * full-bleed texture parked behind everything is left alone.
 */
function pageFixedOverRail(el, frame, kit) {
  const cs = getComputedStyle(el)
  const skip = [
    cs.position !== 'fixed',
    cs.display === 'none',
    cs.visibility === 'hidden',
    Number.parseFloat(cs.opacity) === 0,
    Number.parseInt(cs.zIndex, 10) < 0,
  ]
  if (skip.some(Boolean)) return null
  const r = el.getBoundingClientRect()
  const w = Math.min(r.right, frame.right) - Math.max(r.left, frame.left)
  const h = Math.min(r.bottom, frame.bottom) - Math.max(r.top, frame.top)
  // Its own box has a size, and so does the part of it on the rail.
  if (![r.width, r.height, w, h].every((n) => n > 0)) return null
  return {
    selector: kit.selector(el),
    text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
    top: Math.round(r.top),
    height: Math.round(r.height),
    overlapPx: Math.round(h),
  }
}

/**
 * Every fixed element on `[data-live-frame]` at scroll 0, in document order;
 * none when the page has no rail. The rail's own descendants are not the
 * shell's. A fixed element inside a fixed element is one fault, reported at
 * the outer one, which is the bar the engineer wrote.
 */
function pageFindFixedOverRail(kit) {
  const rail = document.querySelector('[data-live-frame]')
  const frame = rail?.getBoundingClientRect()
  if (!frame || !(frame.width > 0 && frame.height > 0)) return []
  const reported = []
  const found = []
  for (const el of document.querySelectorAll('body *')) {
    if (rail.contains(el) || reported.some((p) => p.contains(el))) continue
    const hit = kit.fixedOverRail(el, frame)
    if (!hit) continue
    reported.push(el)
    found.push(hit)
  }
  return found
}

/** The rail probe's kit: its two functions and the contrast walk's element chain. */
const RAIL_KIT = {
  describe: TEXT_CONTRAST_PAGE_FUNCTIONS.describe,
  selector: TEXT_CONTRAST_PAGE_FUNCTIONS.selector,
  fixedOverRail: pageFixedOverRail,
  findFixedOverRail: pageFindFixedOverRail,
}

/**
 * Read the rail probe off a page at scroll 0.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<Array<{ selector: string, text: string, top: number, height: number,
 *   overlapPx: number }>>}
 */
export function measureRailOverlap(page) {
  return runPageKit(page, RAIL_KIT, 'findFixedOverRail', {})
}

/**
 * The words for one fixed element sitting on the rail.
 *
 * @param {{ selector: string, text: string, top: number, height: number,
 *   overlapPx: number }} hit
 * @returns {string}
 */
export function describeRailOverlap(hit) {
  const says = hit.text ? ` ("${hit.text}")` : ''
  return (
    `<${hit.selector}>${says} is position: fixed and covers ${hit.overlapPx}px of the site's ` +
    `rail at scroll 0 (its top at y=${hit.top}, ${hit.height}px tall). The top 44px of /, /about ` +
    'and /work/* is the rail [data-live-frame], rendered above <Layout> in normal flow, and a ' +
    `fixed bar is laid out against the viewport, so it lands on top of it. Fix: ${RAIL_OVERLAP_FIX}`
  )
}

/**
 * The `rail-overlap` findings for one measurement: one per fixed element,
 * capped. An error, owned by whoever owns the route (#702).
 *
 * @param {{ railOverlap?: Array<object>|null }} m raw measurement
 * @param {'react-engineer'|'human'} owner from `ownerForSurface`
 * @returns {Array<{ kind: 'rail-overlap', severity: 'error', owner: string, detail: string }>}
 */
export function railOverlapFindings(m, owner) {
  if (!Array.isArray(m.railOverlap)) return []
  return m.railOverlap.slice(0, MAX_RAIL_OVERLAPS_REPORTED).map((hit) => ({
    kind: 'rail-overlap',
    severity: 'error',
    owner,
    detail: describeRailOverlap(hit),
  }))
}
