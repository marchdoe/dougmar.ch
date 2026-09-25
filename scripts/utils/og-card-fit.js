/**
 * The share card fits its card (`/og`).
 *
 * The engineer rewrites `app/routes/og.tsx` every night with fixed px sizes
 * and `overflow: hidden`, and `phase-archive.js` screenshots it at 1200x630
 * after every gate has run. Nothing measured it, so a card that cut its own
 * headline shipped as the night's share image: 2026-09-23 anchored a two-line
 * headline to the bottom edge and "NOT A GENERALIST." ran past 630px, and
 * 2026-09-25 put the brand mark past the card's left edge, so only a sliver
 * of it showed.
 *
 * This module is the gate's measurement of that card. The surface gate renders
 * `/og` once, at exactly the capture's size and scheme, and asks one question:
 * does every visible line of text, and the brand lockup, sit inside the card
 * with {@link OG_SAFE_MARGIN_PX} to spare, uncut by any ancestor's overflow?
 * The card is the viewport, because the viewport is what the capture keeps.
 *
 * A finding is an error on an engineer-owned route, so `faultsForOwner` sends
 * it through the same revision a clipped hero on `/` takes, and the repair
 * brief carries og.tsx with it.
 *
 * @module
 */

import { runPageKit, TEXT_CONTRAST_PAGE_FUNCTIONS } from './text-contrast-page.js'

/** The route the archive phase captures as the night's share image. */
export const OG_CARD_ROUTE = '/og'

/**
 * The capture's size (`captureRouteScreenshot` in snapshot.js), as a rung the
 * surface gate can walk. Measured in the light scheme only, because the
 * capture opens its page without a colour scheme and Chromium's default is
 * light.
 */
export const OG_CARD_VIEWPORT = { name: 'og', width: 1200, height: 630 }
export const OG_CARD_SCHEME = 'light'

/**
 * How far inside every edge of the card text and the lockup must stay.
 *
 * The card is not shown whole everywhere it is shared. X crops a
 * summary_large_image to 2:1, which takes 15px off the top and the bottom of
 * a 1200x630 card. Slack, iMessage, LinkedIn and Discord round the preview's
 * corners, and a corner of radius r hides whatever sits closer than about
 * 0.3r to both edges; an iMessage bubble's radius, scaled back up to card
 * pixels, is around 70px, so about 21px. 15 plus 21 is 36, and 40 is the next
 * step on the 8px grid the site's spacing uses. Replayed against the
 * published builds, the two failing cards this exists for were out by 58px
 * and 40px past the edge, and three nights whose cards look right kept their
 * nearest line or mark 44px, 48px and 63px from it.
 */
export const OG_SAFE_MARGIN_PX = 40

/**
 * The faintest decorative type that still counts as text.
 *
 * 2026-09-25 set "fun" at 520px behind the headline at opacity 0.055, bigger
 * than the card on purpose. A word like that is texture, and cropping it is
 * the design. It is exempt when it says so twice: it is inside an
 * `aria-hidden="true"` subtree, so the author has declared it no part of the
 * content, and its opacity (every ancestor's opacity times its ink's alpha)
 * is at most this. At 0.2, black type on white composites to #CCCCCC, a
 * contrast of 1.6:1, and no ink and ground pair does better; that is under
 * half of the 3:1 WCAG asks of large text, so the word is not read as a word
 * at a glance. A solid word that is only aria-hidden still reads, and a faint
 * word that is not aria-hidden is still content; both are measured.
 */
export const OG_TEXTURE_MAX_OPACITY = 0.2

/** Sub-pixel slack, the same as the surface gate's overflow tolerance. */
const OG_TOLERANCE_PX = 1

/** How many lines and marks one measurement reports, worst first. */
export const MAX_OG_FIT_REPORTED = 6

/** The fix line every finding ends with; quoted by the engineer prompt's checklist (#634). */
export const OG_FIT_FIX =
  'Fit the headline to the 1200x630 card and step the type down for a long phrase rather ' +
  'than letting it run out; keep the whole lockup inside the safe margin; never rely on ' +
  'overflow: hidden to hide text.'

/*
 * The page half. Like `shell-overlap.js`, every function named `page*` runs
 * inside the browser and is self-contained, because Playwright ships source
 * and not closures; `runPageKit` rebuilds them there and hands each the kit as
 * its last argument. They report records and decide nothing.
 */

/**
 * The card: the outermost `position: fixed` ancestor of what is drawn at the
 * centre of the viewport. The prompt has the card cover the site's shell with
 * a fixed layer, and the shell's own text is still in the document under it;
 * only what is inside that layer is the card's. Body when there is none.
 */
function pageCardRoot() {
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight
  let root = null
  for (let p = document.elementFromPoint(vw / 2, vh / 2); p; p = p.parentElement) {
    if (getComputedStyle(p).position === 'fixed') root = p
  }
  return root ?? document.body
}

/** What the reader sees of an element: opacity all the way up, times its ink's alpha. */
function pageInkOf(el) {
  const m = /rgba?\(([^)]+)\)/.exec(getComputedStyle(el).color || '')
  const parts = m ? m[1].split(/[\s,/]+/).filter(Boolean) : []
  let ink = parts.length > 3 ? Number.parseFloat(parts[3]) : 1
  for (let p = el; p; p = p.parentElement) ink *= Number.parseFloat(getComputedStyle(p).opacity)
  return ink
}

/**
 * The boxes that clip what `from` holds: `from` itself and its ancestors,
 * nearest first. A text node's own element clips it; a mark's clipping starts
 * at its parent. A clipping box of a pixel or two is the visually-hidden
 * pattern, which hides text on purpose; `hidden` says so and the caller skips
 * it.
 */
function pageClippersOf(from) {
  const clippers = []
  let hidden = false
  for (let p = from; p && p !== document.documentElement; p = p.parentElement) {
    const cs = getComputedStyle(p)
    if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue
    const r = p.getBoundingClientRect()
    if (r.width <= 2 || r.height <= 2) hidden = true
    clippers.push({ el: p, r })
  }
  return { clippers, hidden }
}

/** How far `r` runs past `box` at its worst edge, and which edge. */
function pageOverrun(r, box) {
  const edges = [
    ['left', box.left - r.left],
    ['right', r.right - box.right],
    ['top', box.top - r.top],
    ['bottom', r.bottom - box.bottom],
  ]
  edges.sort((a, b) => b[1] - a[1])
  return { edge: edges[0][0], px: edges[0][1] }
}

/**
 * What is wrong with one box, or null: past the card's edge, else cut by an
 * ancestor that clips, else inside the safe margin. One fault per box, the
 * first of those three that applies, so a line cut by the card's own
 * `overflow: hidden` reads as past the card's edge, which is what the capture
 * shows.
 */
function pageFaultOf(r, clippers, kit) {
  const { tolerance, margin } = kit.options
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight
  const past = kit.overrun(r, { left: 0, top: 0, right: vw, bottom: vh })
  if (past.px > tolerance) return { fault: 'card', edge: past.edge, px: Math.round(past.px) }
  let cut = null
  for (const c of clippers) {
    const o = kit.overrun(r, c.r)
    if (o.px > tolerance && (!cut || o.px > cut.px)) cut = { ...o, by: c.el }
  }
  if (cut) {
    return {
      fault: 'clip',
      edge: cut.edge,
      px: Math.round(cut.px),
      by: kit.selector(cut.by),
      overflow: getComputedStyle(cut.by).overflowY,
    }
  }
  const inset = kit.overrun(r, {
    left: margin,
    top: margin,
    right: vw - margin,
    bottom: vh - margin,
  })
  if (inset.px > tolerance) return { fault: 'margin', edge: inset.edge, px: Math.round(inset.px) }
  return null
}

/** The block that lays a text node's lines out: its nearest non-inline ancestor. */
function pageBlockOf(el) {
  for (let p = el; p; p = p.parentElement) {
    const display = getComputedStyle(p).display
    if (!display.startsWith('inline') && display !== 'contents') return p
  }
  return el
}

/**
 * What a line belongs to, for the brief: the headline (the whole h1, however
 * many blocks it is split into, so its lines are numbered as the reader
 * counts them), the lockup's wordmark, or the block that lays the line out.
 */
function pageOwnerOf(block, lockups) {
  const h1 = block.closest('h1')
  if (h1) return { key: h1, name: 'headline' }
  const lockup = lockups.find((l) => l.contains(block))
  if (lockup) return { key: lockup, name: 'wordmark' }
  return { key: block, name: `<${block.tagName.toLowerCase()}>` }
}

/**
 * Where a word's glyphs actually paint, from the box its range reports.
 *
 * A range's box is the font's content area, ascent to descent, which reaches
 * well above the capitals and below the baseline; display type set at a line
 * height under 1 overhangs its own line box by that much, and a container that
 * fits the lines snugly would read as cutting them. The canvas measures the
 * same word in the same font: the baseline sits the font's ascent below the
 * box's top, and the ink runs from its actual ascent above that to its actual
 * descent below. Horizontally the box is already the advance, which is what
 * the reader sees.
 */
function pageInkBox(text, r, el, kit) {
  const cs = getComputedStyle(el)
  kit.cache.ogCtx ??= document.createElement('canvas').getContext('2d')
  const ctx = kit.cache.ogCtx
  if (!ctx) return r
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  const shown =
    cs.textTransform === 'uppercase'
      ? text.toUpperCase()
      : cs.textTransform === 'lowercase'
        ? text.toLowerCase()
        : text
  const m = ctx.measureText(shown)
  if (!(m.fontBoundingBoxAscent > 0)) return r
  const baseline = r.top + m.fontBoundingBoxAscent
  return {
    left: r.left,
    right: r.right,
    top: baseline - m.actualBoundingBoxAscent,
    bottom: baseline + m.actualBoundingBoxDescent,
  }
}

/**
 * The words one text node draws, each with its layout box `r` and its ink box.
 * Word by word rather than one rect per line box, so a line's own text can be
 * named in the finding.
 */
function pageWordsOf(node, range, kit) {
  const words = []
  for (const m of (node.nodeValue || '').matchAll(/\S+/g)) {
    range.setStart(node, m.index)
    range.setEnd(node, m.index + m[0].length)
    const r = range.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) {
      words.push({ text: m[0], r, ink: kit.inkBox(m[0], r, node.parentElement) })
    }
  }
  return words
}

/** The smallest box holding both. */
function pageUnion(a, b) {
  return {
    left: Math.min(a.left, b.left),
    top: Math.min(a.top, b.top),
    right: Math.max(a.right, b.right),
    bottom: Math.max(a.bottom, b.bottom),
  }
}

/** Whether a text node's element is drawn at all, and is not texture. */
function pageCountsAsText(el, kit) {
  const skipped = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE']
  if (skipped.includes(el.tagName)) return false
  if (getComputedStyle(el).visibility !== 'visible') return false
  const ink = kit.inkOf(el)
  if (ink <= kit.options.invisible) return false
  const texture = el.closest('[aria-hidden="true"]') && ink <= kit.options.textureMaxOpacity
  return !texture
}

/**
 * Add one word to the lines it is held in. Lines are told apart by layout box,
 * which every word on a line shares (ink boxes differ between "on" and
 * "Deep"): a word starts a new line when its top is below the middle of the
 * line it would join.
 */
function pageAddWord(lines, w, clippers, kit) {
  const line = lines[lines.length - 1]
  if (line && w.r.top < (line.r.top + line.r.bottom) / 2) {
    line.words.push(w.text)
    line.r = kit.union(line.r, w.r)
    line.ink = kit.union(line.ink, w.ink)
  } else {
    lines.push({ words: [w.text], r: w.r, ink: w.ink, clippers })
  }
}

/**
 * Every visible line of text inside the card, grouped by what it belongs to
 * (see `pageOwnerOf`) and numbered from the top.
 */
function pageCollectLines(root, lockups, kit) {
  const range = document.createRange()
  const blocks = new Map()
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement
    if (!el || !/\S/.test(n.nodeValue || '') || !kit.countsAsText(el)) continue
    const { clippers, hidden } = kit.clippersOf(el)
    if (hidden) continue
    const { key, name } = kit.ownerOf(kit.blockOf(el), lockups)
    if (!blocks.has(key)) blocks.set(key, { name, lines: [] })
    const { lines } = blocks.get(key)
    for (const w of kit.wordsOf(n, range)) kit.addWord(lines, w, clippers)
  }
  return blocks
}

/**
 * Everything on the card that does not fit it: every visible line of text,
 * and every brand mark, that runs past the card's edge, is cut by an ancestor
 * that clips, or sits inside the safe margin. Worst first.
 */
function pageFindOgFaults(kit) {
  const root = kit.cardRoot()
  const marks = [...root.querySelectorAll('[data-brand-mark]')]
  const lockups = marks.map((m) => m.parentElement).filter(Boolean)
  const faults = []
  for (const mark of marks) {
    const r = mark.getBoundingClientRect()
    if (!(r.width > 0 && r.height > 0) || kit.inkOf(mark) <= kit.options.invisible) continue
    const { clippers, hidden } = kit.clippersOf(mark.parentElement)
    if (hidden) continue
    const fault = kit.faultOf(r, clippers)
    if (fault) faults.push({ name: 'brand mark', ...fault })
  }
  for (const { name, lines } of kit.collectLines(root, lockups).values()) {
    lines.forEach((line, i) => {
      const fault = kit.faultOf(line.ink, line.clippers)
      if (!fault) return
      const text = line.words.join(' ').slice(0, 40)
      faults.push({ name, line: i + 1, text, ...fault })
    })
  }
  const rank = { card: 0, clip: 1, margin: 2 }
  return faults.sort((a, b) => rank[a.fault] - rank[b.fault] || b.px - a.px)
}

/** The kit the probe runs on: its own functions and the contrast walk's element chain. */
const KIT = {
  describe: TEXT_CONTRAST_PAGE_FUNCTIONS.describe,
  selector: TEXT_CONTRAST_PAGE_FUNCTIONS.selector,
  cardRoot: pageCardRoot,
  inkOf: pageInkOf,
  clippersOf: pageClippersOf,
  overrun: pageOverrun,
  faultOf: pageFaultOf,
  blockOf: pageBlockOf,
  ownerOf: pageOwnerOf,
  inkBox: pageInkBox,
  wordsOf: pageWordsOf,
  union: pageUnion,
  addWord: pageAddWord,
  countsAsText: pageCountsAsText,
  collectLines: pageCollectLines,
  findOgFaults: pageFindOgFaults,
}

/** Opacity at or under which an element is not drawn at all; render-health owns that fault. */
const INVISIBLE_OPACITY = 0.01

/**
 * Read the probe off a page standing at the card's size.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<Array<OgFault>>}
 *
 * @typedef {object} OgFault
 * @property {string} name 'headline', 'wordmark', 'brand mark' or `<tag>`
 * @property {number} [line] 1-based line of the block, for text
 * @property {string} [text] the line's words, for text
 * @property {'card'|'clip'|'margin'} fault
 * @property {'left'|'right'|'top'|'bottom'} edge
 * @property {number} px how far past the edge, or how far inside the margin
 * @property {string} [by] the clipping ancestor, for `clip`
 * @property {string} [overflow] its computed overflow, for `clip`
 */
export function measureOgCard(page) {
  return runPageKit(page, KIT, 'findOgFaults', {
    margin: OG_SAFE_MARGIN_PX,
    tolerance: OG_TOLERANCE_PX,
    textureMaxOpacity: OG_TEXTURE_MAX_OPACITY,
    invisible: INVISIBLE_OPACITY,
  })
}

const PAST_EDGE = {
  left: (px) => `starts ${px}px left of the card's left edge`,
  right: (px) => `ends ${px}px past the card's right edge`,
  top: (px) => `starts ${px}px above the card's top edge`,
  bottom: (px) => `ends ${px}px below the card's bottom edge`,
}

const NEAR_EDGE = {
  left: (px) => `starts ${px}px from the card's left edge`,
  right: (px) => `ends ${px}px from the card's right edge`,
  top: (px) => `starts ${px}px from the card's top edge`,
  bottom: (px) => `ends ${px}px from the card's bottom edge`,
}

/**
 * The words for one fault. Everything in it comes off the render, so the same
 * card measures to the same sentence and STILL PRESENT can match it.
 *
 * @param {OgFault} f
 * @returns {string}
 */
export function describeOgFault(f) {
  const what = f.line ? `${f.name} line ${f.line} '${f.text}'` : f.name
  let where
  if (f.fault === 'card') where = PAST_EDGE[f.edge](f.px)
  else if (f.fault === 'clip')
    where = `is cut ${f.px}px at its ${f.edge} edge by <${f.by}> (overflow: ${f.overflow})`
  else
    where =
      `${NEAR_EDGE[f.edge](Math.max(0, OG_SAFE_MARGIN_PX - f.px))}, inside the ` +
      `${OG_SAFE_MARGIN_PX}px safe margin`
  return `og: ${what} ${where}. ${OG_FIT_FIX}`
}

/**
 * The `og-fit` findings for one measurement: one per line or mark, worst
 * first, capped. An error: `/og` is the engineer's, and the capture that
 * follows the gate ships whatever the card draws.
 *
 * @param {{ ogFit?: Array<OgFault>|null }} m raw measurement
 * @returns {Array<{ kind: 'og-fit', severity: 'error', detail: string }>}
 */
export function ogFitFindings(m) {
  if (!Array.isArray(m.ogFit)) return []
  return m.ogFit.slice(0, MAX_OG_FIT_REPORTED).map((f) => ({
    kind: 'og-fit',
    severity: 'error',
    detail: describeOgFault(f),
  }))
}
