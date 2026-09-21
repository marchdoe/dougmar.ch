/**
 * The in-page half of the line-length check (#569).
 *
 * How long a line of running copy is depends on the face as much as on the
 * `max-width` set on it. `TimelineSection.tsx` on 2026-09-20 capped `/about`'s
 * role descriptions at `62ch` and they set at 82 to 99 characters a line,
 * because `ch` is the width of a `0` and Archivo's letters are narrower than
 * its zero. So the check counts what the browser laid out: for each block of
 * running copy, the characters on each rendered line, read from the rects of
 * the words the way the word-break probe reads them.
 *
 * Like `small-text-page.js`, the functions named `page*` are self-contained,
 * serialised with `toString()` and rebuilt in the page, where they reach each
 * other and `isVisible`, `selector` and `partOf` from the text-contrast kit
 * through `kit`. They collect and decide nothing; the median, the threshold,
 * the owner and the wording are `line-length.js`.
 *
 * A block is a `p`, `li` or `blockquote` of eight words or more that a reader
 * can see, that lays its text out in flow and that is not code. Text that
 * belongs to a block nested inside it (a `p` in an `li`) counts for the inner
 * block, not the outer one.
 *
 * @module
 */

import { runPageKit, TEXT_CONTRAST_PAGE_FUNCTIONS } from './text-contrast-page.js'
import { TEXT_CONTRAST_OPTIONS } from './text-contrast.js'
import { LINE_LENGTH_OPTIONS } from './line-length.js'

/**
 * Whether a block lays its own text out in flow: it is a block box and every
 * element inside it is inline. A flex or grid `li` that sets a number, a label
 * and a description in three columns is a layout, and its "lines" would run
 * across the columns; the block inside each column is what gets measured.
 */
function pageFlowsText(el, cs) {
  if (!/^(block|list-item|flow-root|inline-block)$/.test(cs.display)) return false
  for (const child of el.children) {
    const display = getComputedStyle(child).display
    if (!(display === 'none' || display === 'contents' || display.startsWith('inline')))
      return false
  }
  return true
}

/** A block the check measures: its tag, its flow, code and hiddenness. */
function pageIsMeasuredBlock(el, cs, root, kit) {
  if (!kit.options.lineLength.runningTags.includes(el.tagName)) return false
  if (!root.contains(el) || el.closest('svg, pre, code')) return false
  return kit.flowsText(el, cs) && kit.isVisible(el, cs)
}

/** Whether a text node's words belong to `block`, and are painted where a reader can see them. */
function pageOwnsWords(node, block, kit) {
  const el = node.parentElement
  if (!el) return false
  const nearest = el.closest(kit.options.lineLength.runningTags.join(',').toLowerCase())
  if (nearest !== block) return false
  return getComputedStyle(el).visibility === 'visible'
}

/**
 * Add one word to the lines so far. A word starts a new line when its middle
 * sits more than half a line pitch from the middle of the line it would join.
 * The space before it is counted when the source has one, so `<em>foo</em>,`
 * is one run and not two.
 */
function pageAddWord(lines, rect, chars, spaceBefore, pitch) {
  const mid = (rect.top + rect.bottom) / 2
  const last = lines[lines.length - 1]
  if (last && Math.abs(mid - last.mid) < pitch / 2) {
    last.chars += chars + (spaceBefore ? 1 : 0)
    return
  }
  lines.push({ mid, chars })
}

/**
 * The words of one text node, added to `lines`; returns whether the text laid
 * out so far ends in whitespace. A node that adds no word (whitespace, or
 * words in a `display: none` child) leaves what came before it standing.
 */
function pageAddNodeWords(node, lines, state, kit) {
  const range = state.range
  const text = node.textContent ?? ''
  let spaced = state.trailingSpace
  let end = 0
  let added = 0
  for (const word of text.matchAll(/\S+/g)) {
    range.setStart(node, word.index)
    range.setEnd(node, word.index + word[0].length)
    const rect = range.getClientRects()[0]
    if (!rect || !(rect.width > 0)) continue
    const gap = word.index > end
    kit.addWord(lines, rect, Array.from(word[0]).length, spaced || gap, state.pitch)
    state.words++
    added++
    spaced = false
    end = word.index + word[0].length
  }
  if (added === 0) return state.trailingSpace || (text.length > 0 && !/\S/.test(text))
  return /\s$/.test(text)
}

/** Characters on each rendered line of one block, and how many words it holds. */
function pageBlockLines(block, cs, kit) {
  const size = Number.parseFloat(cs.fontSize)
  const state = {
    range: document.createRange(),
    words: 0,
    trailingSpace: false,
    pitch: Number.parseFloat(cs.lineHeight) || size * 1.2,
  }
  const lines = []
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!kit.ownsWords(node, block)) continue
    state.trailingSpace = kit.addNodeWords(node, lines, state)
  }
  return { lines: lines.map((l) => l.chars), words: state.words }
}

/** One block as a record, or null when it is too short to be a sentence. */
function pageBlockRecord(el, cs, kit) {
  const { lines, words } = kit.blockLines(el, cs)
  if (words < kit.options.lineLength.minWords) return null
  const pad = Number.parseFloat(cs.paddingLeft) + Number.parseFloat(cs.paddingRight)
  return {
    selector: kit.selector(el),
    tag: el.tagName.toLowerCase(),
    sizePx: Math.round(Number.parseFloat(cs.fontSize) * 100) / 100,
    boxPx: Math.round(el.clientWidth - pad),
    words,
    lines,
    sample: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40).trim(),
    part: kit.partOf(el),
  }
}

/** Every block of running copy on the page, in document order. */
function pageCollectLineLength(kit) {
  const { maxBlocks, runningTags } = kit.options.lineLength
  const root = document.querySelector('main') || document.body
  const blocks = []
  const tags = runningTags.join(',').toLowerCase()
  for (const el of document.body.querySelectorAll(tags)) {
    if (blocks.length >= maxBlocks) break
    const cs = getComputedStyle(el)
    if (!kit.isMeasuredBlock(el, cs, root)) continue
    const record = kit.blockRecord(el, cs)
    if (record) blocks.push(record)
  }
  return { blocks }
}

/** Added to the text-contrast walk's kit. */
export const LINE_LENGTH_PAGE_FUNCTIONS = {
  flowsText: pageFlowsText,
  isMeasuredBlock: pageIsMeasuredBlock,
  ownsWords: pageOwnsWords,
  addWord: pageAddWord,
  addNodeWords: pageAddNodeWords,
  blockLines: pageBlockLines,
  blockRecord: pageBlockRecord,
  collectLineLength: pageCollectLineLength,
}

const KIT = { ...TEXT_CONTRAST_PAGE_FUNCTIONS, ...LINE_LENGTH_PAGE_FUNCTIONS }
const KIT_OPTIONS = { ...TEXT_CONTRAST_OPTIONS, lineLength: LINE_LENGTH_OPTIONS }

/**
 * Every block of running copy on the page with the characters on each of its
 * rendered lines. Waits for the fonts first: a fallback face has different
 * widths, and the one that ships is the one to measure. Run it after the
 * scroll reveal, so text that fades in below the fold is visible to the walk.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<{ blocks: Array<{ selector: string, tag: string, sizePx: number,
 *   boxPx: number, words: number, lines: number[], sample: string, part: string|null }> }>}
 */
export async function collectLineLength(page) {
  await page.evaluate(() => document.fonts.ready.then(() => true))
  return await runPageKit(page, KIT, 'collectLineLength', KIT_OPTIONS)
}
