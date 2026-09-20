/**
 * The in-page half of the type-size gate (#567).
 *
 * Two questions, asked over the same walk that measures text contrast so both
 * see the page in one state, after the scroll-reveal resize has brought the
 * lower half out of `opacity: 0`:
 *
 * - Is there running copy (`p`, `li`, `blockquote`, eight characters or more)
 *   under the reading floor? Judged on the element's own computed size, so a
 *   11px `<span>` inside a 16px paragraph is not running copy, as before
 *   (#469).
 * - Is there any visible text, whatever its tag, under the text floor?
 *
 * These are `page*` functions in the same sense as `text-contrast-page.js`:
 * each is self-contained, serialised with `toString()`, and reaches the
 * others (and `inspect`, `isVisible`, `selector` and `partOf` from that
 * module) through the `kit`. They collect and decide nothing: the verdict, the
 * owner and the wording are `small-text.js`.
 *
 * Hidden text is left out the way the contrast walk leaves it out:
 * `display: none`, `visibility: hidden`, `opacity: 0` on the element or an
 * ancestor, a clip to a pixel (the `sr-only` pattern), off the top or left
 * edge, and anything inside inline svg.
 *
 * @module
 */

/** Running copy in the page: laid out, visible, and long enough to be a sentence. */
function pageIsRunningCopy(el, cs, root, kit) {
  const { runningTags, runningMinChars } = kit.options.smallText
  if (!runningTags.includes(el.tagName) || !root.contains(el) || el.closest('svg')) return false
  if ((el.textContent || '').trim().length < runningMinChars) return false
  return kit.isVisible(el, cs)
}

/** One element under a floor as a record, or null when neither question applies to it. */
function pageSmallEntry(el, cs, root, kit) {
  const sizePx = Number.parseFloat(cs.fontSize)
  const running = kit.isRunningCopy(el, cs, root)
  const seen = sizePx < kit.options.smallText.textMinPx ? kit.inspect(el) : null
  if (!running && !seen) return null
  const sample = seen ? seen.text : (el.textContent || '').replace(/\s+/g, ' ').trim()
  return {
    selector: kit.selector(el),
    tag: el.tagName.toLowerCase(),
    sizePx: Math.round(sizePx * 100) / 100,
    sample: sample.slice(0, 40),
    running,
    visibleText: Boolean(seen),
    part: kit.partOf(el),
    count: 1,
  }
}

/**
 * Every distinct element chain and size that is running copy or visible text
 * and could be under its floor. Anything at or over the larger of the two
 * floors is skipped before anything else about it is read.
 */
function pageCollectSmallText(kit) {
  const { scanBelowPx, maxCandidates } = kit.options.smallText
  const root = document.querySelector('main') || document.body
  const found = new Map()
  for (const el of document.body.querySelectorAll('*')) {
    const cs = getComputedStyle(el)
    if (!(Number.parseFloat(cs.fontSize) < scanBelowPx)) continue
    const entry = kit.smallEntry(el, cs, root)
    if (!entry) continue
    const key = JSON.stringify([entry.selector, entry.sizePx, entry.running, entry.visibleText])
    const held = found.get(key)
    if (held) held.count++
    else if (found.size < maxCandidates) found.set(key, entry)
  }
  return { entries: [...found.values()] }
}

/** Added to the text-contrast walk's kit. */
export const SMALL_TEXT_PAGE_FUNCTIONS = {
  isRunningCopy: pageIsRunningCopy,
  smallEntry: pageSmallEntry,
  collectSmallText: pageCollectSmallText,
}
