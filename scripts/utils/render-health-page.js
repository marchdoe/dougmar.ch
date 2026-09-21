/**
 * The in-page half of three checks that used to run only after the night was
 * paid for (#574). `tests/e2e/site-health.spec.ts` ran them against the
 * finished site, and a failure there meant the night shipped nothing and the
 * engineer never heard why:
 *
 * - a word whose glyphs sit on more than one line (#530, #534),
 * - text painted in nothing at all: transparent, with no stroke and no
 *   clipped background to draw it (#525),
 * - text left at `opacity: 0` once the reveal is taken away.
 *
 * The surface gate and the e2e spec both call the wrappers at the bottom, so
 * the two cannot disagree about what a defect is. The predicates here are the
 * ones the spec used to carry inline, moved and not changed.
 *
 * Like `text-contrast-page.js`, every function named `page*` runs inside the
 * browser and is self-contained: Playwright ships source, not closures. They
 * are added to the contrast walk's kit and reach `selector` and `partOf` from
 * it. They report records and decide nothing; the findings, the owner and the
 * wording are `render-health.js`.
 *
 * @module
 */

import { runPageKit, TEXT_CONTRAST_PAGE_FUNCTIONS } from './text-contrast-page.js'
import { TEXT_CONTRAST_OPTIONS } from './text-contrast.js'

/** Distinct records one probe hands back; a page with thousands of broken words is one fault. */
export const MAX_RENDER_HEALTH_RECORDS = 200

/** What the probes need, beside the parts list the contrast walk already carries. */
export const RENDER_HEALTH_OPTIONS = Object.freeze({ maxRecords: MAX_RENDER_HEALTH_RECORDS })

/** Add a record once per key and count the repeats, up to the cap. */
function pageAddRecord(found, key, record, kit) {
  const held = found.get(key)
  if (held) held.count++
  else if (found.size < kit.options.renderHealth.maxRecords) found.set(key, { ...record, count: 1 })
}

/** The box that did the breaking: the nearest ancestor that is not inline, less its padding. */
function pageBlockWidth(el) {
  let block = el
  while (block.parentElement && getComputedStyle(block).display.startsWith('inline')) {
    block = block.parentElement
  }
  const cs = getComputedStyle(block)
  return block.clientWidth - Number.parseFloat(cs.paddingLeft) - Number.parseFloat(cs.paddingRight)
}

/**
 * The words in one text node that sit on more than one line. A word is a run
 * of letters and digits, so a URL or an email wrapping at its punctuation is
 * not a break, and neither is a hyphenated compound. One rect per line the
 * word touches; `display: none` gives none.
 */
function pageBrokenWordsIn(node, el, size, range, kit) {
  const found = []
  for (const word of (node.textContent ?? '').matchAll(/[\p{L}\p{N}'’]+/gu)) {
    range.setStart(node, word.index)
    range.setEnd(node, word.index + word[0].length)
    const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0)
    const lines = new Set(rects.map((r) => Math.round(r.top / (size / 2))))
    if (lines.size < 2) continue
    found.push({
      word: word[0],
      sizePx: Math.round(size),
      needsPx: Math.round(rects.reduce((sum, r) => sum + r.width, 0)),
      boxPx: Math.round(kit.blockWidth(el)),
      lines: lines.size,
    })
  }
  return found
}

/**
 * Every word broken across lines, one record per element chain and word.
 * Vertical type is a deliberate stack and a hyphenated break is ordinary
 * typesetting, so neither is looked at; a `<br>` between words breaks
 * between them, and never inside one.
 */
function pageCollectBrokenWords(kit) {
  const found = new Map()
  const range = document.createRange()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node.parentElement
    if (!el) continue
    const cs = getComputedStyle(el)
    const measurable =
      cs.visibility !== 'hidden' && cs.hyphens !== 'auto' && cs.writingMode.startsWith('horizontal')
    if (!measurable) continue
    for (const w of kit.brokenWordsIn(node, el, Number.parseFloat(cs.fontSize), range)) {
      const selector = kit.selector(el) || 'body'
      const record = { ...w, selector, tag: el.tagName.toLowerCase(), part: kit.partOf(el) }
      kit.addRecord(found, `${selector}|${w.word}`, record)
    }
  }
  const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content')
  return { ogImage: ogImage ?? '', words: [...found.values()] }
}

/** Text the element holds itself, not what its children hold. */
function pageRawOwnText(el) {
  let text = ''
  for (const n of el.childNodes) if (n.nodeType === Node.TEXT_NODE) text += n.textContent ?? ''
  return text.trim()
}

/** sr-only, collapsed, and a reveal caught mid-flight are all fine. */
function pageOnScreen(el, cs) {
  const r = el.getBoundingClientRect()
  if (r.width < 2 || r.height < 2) return false
  if (cs.visibility === 'hidden' || cs.display === 'none') return false
  return Number.parseFloat(cs.opacity) !== 0
}

/** Transparent glyphs still count as painted if a stroke or a clipped background draws them. */
function pagePaintedGlyphs(cs) {
  if (!/^rgba\(.*,\s*0\)$/.test(cs.color)) return true
  if (Number.parseFloat(cs.webkitTextStrokeWidth || '0') > 0) return true
  return (cs.webkitBackgroundClip || cs.backgroundClip) === 'text'
}

/** Elements with text of their own that is on screen and painted in nothing. */
function pageCollectInvisibleText(kit) {
  const found = new Map()
  for (const el of document.querySelectorAll('body *')) {
    const own = kit.rawOwnText(el)
    if (!own) continue
    const cs = getComputedStyle(el)
    if (!kit.onScreen(el, cs) || kit.paintedGlyphs(cs)) continue
    const selector = kit.selector(el) || 'body'
    const record = {
      selector,
      tag: el.tagName.toLowerCase(),
      text: own.replace(/\s+/g, ' ').slice(0, 30),
      color: cs.color,
      sizePx: Math.round(Number.parseFloat(cs.fontSize) * 10) / 10,
      part: kit.partOf(el),
    }
    kit.addRecord(found, `${selector}|${cs.color}`, record)
  }
  return [...found.values()]
}

/**
 * Elements with any text inside them that sit at `opacity: 0`, itself and not
 * through an ancestor. Meant for a page loaded with reduced motion on, where
 * no animation is left to bring them back.
 */
function pageCollectStrandedText(kit) {
  const found = new Map()
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue
    if (Number.parseFloat(cs.opacity) !== 0) continue
    const text = (el.textContent ?? '').trim()
    if (!text) continue
    const box = el.getBoundingClientRect()
    const selector = kit.selector(el) || 'body'
    const record = {
      selector,
      tag: el.tagName.toLowerCase(),
      text: text.replace(/\s+/g, ' ').slice(0, 30),
      widthPx: Math.round(box.width),
      heightPx: Math.round(box.height),
      animationName: cs.animationName,
      part: kit.partOf(el),
    }
    kit.addRecord(found, selector, record)
  }
  return [...found.values()]
}

/** Added to the text-contrast walk's kit. */
export const RENDER_HEALTH_PAGE_FUNCTIONS = {
  addRecord: pageAddRecord,
  blockWidth: pageBlockWidth,
  brokenWordsIn: pageBrokenWordsIn,
  collectBrokenWords: pageCollectBrokenWords,
  rawOwnText: pageRawOwnText,
  onScreen: pageOnScreen,
  paintedGlyphs: pagePaintedGlyphs,
  collectInvisible: pageCollectInvisibleText,
  collectStranded: pageCollectStrandedText,
}

const KIT = { ...TEXT_CONTRAST_PAGE_FUNCTIONS, ...RENDER_HEALTH_PAGE_FUNCTIONS }
const KIT_OPTIONS = { ...TEXT_CONTRAST_OPTIONS, renderHealth: RENDER_HEALTH_OPTIONS }

/**
 * Every word on the page whose glyphs sit on more than one line, and the
 * design date read from `og:image` (empty when the page has none), which is
 * what `KNOWN_SHREDS` is keyed on.
 *
 * Waits for the fonts first: a fallback face has different widths, and the
 * one that ships is the one to measure. Run it at the viewport the rung
 * names, before anything resizes it.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<{ designDate: string, words: Array<{ word: string, sizePx: number,
 *   needsPx: number, boxPx: number, lines: number, selector: string, tag: string,
 *   part: string|null, count: number }> }>}
 */
export async function collectBrokenWords(page) {
  await page.evaluate(() => document.fonts.ready.then(() => true))
  const seen = await runPageKit(page, KIT, 'collectBrokenWords', KIT_OPTIONS)
  const designDate = seen.ogImage.match(/\/og\/(\d{4}-\d{2}-\d{2})\.png$/)?.[1] ?? ''
  return { designDate, words: seen.words }
}

/**
 * Elements whose own text is on screen and painted in nothing.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<Array<{ selector: string, tag: string, text: string, color: string,
 *   sizePx: number, part: string|null, count: number }>>}
 */
export function collectInvisibleText(page) {
  return runPageKit(page, KIT, 'collectInvisible', KIT_OPTIONS)
}

/**
 * Elements holding text that sit at `opacity: 0`. Load the page with reduced
 * motion emulated first, or this reports a reveal that has not fired yet.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<Array<{ selector: string, tag: string, text: string, widthPx: number,
 *   heightPx: number, animationName: string, part: string|null, count: number }>>}
 */
export function collectStrandedText(page) {
  return runPageKit(page, KIT, 'collectStranded', KIT_OPTIONS)
}
