/**
 * The in-page half of the phone density measurement (#569).
 *
 * The home register on 2026-09-20 was seven rows of about 209px at the phone,
 * each holding a 24px title and one 12.64px meta line: 1,700 of the page's
 * 3,837px, most of it air. Nothing measured that, and the critic's phone
 * filmstrip is scaled to about 0.7 image pixels per CSS pixel, which is
 * where a row's slack is hardest to see. This collects the rects of every
 * piece of visible text and hands them back; how much of each fold they cover
 * is `text-density.js`.
 *
 * A text box is one rect per rendered line of a text node, the same rects the
 * word-break probe reads. Text a reader cannot see is left out the way the
 * contrast walk leaves it out (`display: none`, `visibility: hidden`,
 * `opacity: 0`, a pixel clip, inline svg), and so is text painted in nothing.
 * Boxes are in document coordinates and clipped to the viewport's width.
 *
 * @module
 */

import { runPageKit, TEXT_CONTRAST_PAGE_FUNCTIONS } from './text-contrast-page.js'
import { TEXT_CONTRAST_OPTIONS } from './text-contrast.js'
import { TEXT_DENSITY_OPTIONS } from './text-density.js'

/** Whether a text node's parent is somewhere a reader sees ink, memoised per parent. */
function pageInkShows(el, kit) {
  const memo = kit.cache.ink
  if (memo.has(el)) return memo.get(el)
  let shows = false
  if (!el.closest('svg, script, style, noscript, template, head, title')) {
    const cs = getComputedStyle(el)
    const fg = kit.parseColor(cs.webkitTextFillColor) ?? kit.parseColor(cs.color)
    shows = (!fg || fg.a > 0) && kit.isVisible(el, cs)
  }
  memo.set(el, shows)
  return shows
}

/** One rect as `[left, top, right, bottom]` in document coordinates, cut to the viewport's width. */
function pageClipRect(r, width) {
  const left = Math.max(0, r.left + window.scrollX)
  const right = Math.min(width, r.right + window.scrollX)
  if (!(right > left && r.height > 0)) return null
  const top = r.top + window.scrollY
  return [
    Math.round(left * 10) / 10,
    Math.round(top * 10) / 10,
    Math.round(right * 10) / 10,
    Math.round((top + r.height) * 10) / 10,
  ]
}

/** The boxes of the lines one text node lays out, or none when a reader sees no ink there. */
function pageNodeBoxes(node, range, width, kit) {
  const el = node.parentElement
  if (!el || !/\S/.test(node.textContent ?? '') || !kit.inkShows(el)) return []
  range.selectNodeContents(node)
  return Array.from(range.getClientRects(), (r) => kit.clipRect(r, width)).filter(Boolean)
}

/** The boxes of every visible line of text, and the page's size. */
function pageCollectTextRects(kit) {
  const width = document.documentElement.clientWidth
  const height = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0)
  const { maxRects } = kit.options.textDensity
  kit.cache.ink = new Map()
  const range = document.createRange()
  const rects = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node && rects.length < maxRects; node = walker.nextNode()) {
    rects.push(...kit.nodeBoxes(node, range, width))
  }
  return { width, height, rects }
}

/** Added to the text-contrast walk's kit. */
export const TEXT_DENSITY_PAGE_FUNCTIONS = {
  inkShows: pageInkShows,
  clipRect: pageClipRect,
  nodeBoxes: pageNodeBoxes,
  collectTextRects: pageCollectTextRects,
}

const KIT = { ...TEXT_CONTRAST_PAGE_FUNCTIONS, ...TEXT_DENSITY_PAGE_FUNCTIONS }
const KIT_OPTIONS = { ...TEXT_CONTRAST_OPTIONS, textDensity: TEXT_DENSITY_OPTIONS }

/**
 * The boxes of the page's visible text. Waits for the fonts, and expects the
 * scroll reveal to have run (`withRevealedPage`), so text that fades in
 * below the fold is counted.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<{ width: number, height: number, rects: Array<[number, number, number, number]> }>}
 */
export async function collectTextRects(page) {
  await page.evaluate(() => document.fonts.ready.then(() => true))
  return await runPageKit(page, KIT, 'collectTextRects', KIT_OPTIONS)
}
