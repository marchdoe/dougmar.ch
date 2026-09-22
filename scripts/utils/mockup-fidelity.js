/**
 * Mockup fidelity: does the built page still say what the mockup said.
 *
 * The mockup designer writes an HTML mockup; the react-engineer translates it
 * into React; the build often loses the composition on the way — a hero word
 * rendered at a fraction of its intended size, a leaderboard score that
 * balloons past the name above it, a wordmark set `white-space: nowrap`
 * inside a rail too narrow to hold it. Nothing compares the two. The vision
 * critics read a downscaled JPEG of one and, on a different pass, the other;
 * neither is shown both, and a JPEG cannot report font-size in px anyway.
 *
 * This module is the comparison, pure and offline: no pipeline wiring (that
 * is a later phase), no live server, just two rendered documents' text
 * geometry against each other.
 *
 * Two halves:
 *
 * - `extractTextSegments`, a self-contained function serialised into the page
 *   with `page.evaluate` (see `findClippedElements` in surface-gate.js for the
 *   same pattern) — it cannot close over anything in this module, because
 *   Playwright ships it to the browser as a string.
 * - `compareLayouts`, pure and unit-testable without a browser, which turns
 *   two segment lists into findings shaped like the surface gate's: `kind`,
 *   `severity`, `route`, `viewport`, `width`, `detail`.
 *
 * @module
 */

/**
 * Below this, a run of text does not compete for hierarchy — a caption, a
 * copyright line, a tap-target label. Matches the surface gate's small-text
 * floor's neighbourhood without being the same number (that floor governs
 * whether the *build* is legible; this one governs whether a run is worth
 * comparing at all).
 */
export const MIN_SEGMENT_PX = 14

/**
 * A mockup segment this large is a hierarchy candidate wherever it sits on
 * the page, fold or no fold — a hero word set low on a long mockup is still
 * the point of the page.
 */
export const LARGE_SEGMENT_ANYWHERE_PX = 32

/** Mockup candidates are capped here, largest first, so a page with hundreds
 * of small labels does not turn the comparison into an O(n*m) walk. */
export const MAX_CANDIDATES = 25

/**
 * Effective opacity below this is not "rendered content" for matching or
 * hierarchy purposes — a decorative background texture (the Biltmore mockup's
 * "ghost chase" leaderboard behind the hero runs at `opacity:0.08`) or a
 * scroll-linked reveal animation caught mid-fade in a capture that never
 * scrolls (2026-09-22's standfirst paragraph, sampled at `opacity:0.364`
 * because Chromium resolves a `view()`-timeline animation's opacity at
 * initial layout, before any scroll has happened). Below this floor a
 * segment still exists in the raw list — used to explain a `mockup-missing`
 * finding — it just cannot anchor a match or a hierarchy comparison.
 */
export const OPACITY_VISIBLE_MIN = 0.5

/** Below this fraction of its own area on screen, a segment is effectively
 * not there — clipped away or carried off the document bounds. */
export const VISIBLE_FRACTION_MIN = 0.15

/** `text-cut`'s own floor: a build segment showing less than this fraction
 * of itself is cut off badly enough to report on its own, mockup or not. */
export const TEXT_CUT_VISIBLE_FRACTION = 0.85

/** Two segments cannot match at all once their font sizes are this far
 * apart — a word that kept its place but shrank to a caption is not a scaled
 * copy of the hero, it is the hero gone missing (2026-09-19's hero "GAP",
 * clamped to a 34rem max that a Panda static-extraction miss turned into the
 * browser's UA default `2em`: 388.8px in the mockup, 32px in the build, a
 * ratio of 0.08 — nothing a human would call "the same element, resized"). */
export const MATCH_SIZE_RATIO_MAX = 3

/** A matched pair inside this ratio is "the same size, near enough"; outside
 * it and still matched, it is a `mockup-scale` finding. */
export const SCALE_RATIO_MIN = 0.6
export const SCALE_RATIO_MAX = 1.6

/** How many of the mockup's largest matched segments `mockup-scale` checks. */
export const SCALE_TOP_N = 5

/** How many of each side's largest segments `mockup-hierarchy` compares. */
export const HIERARCHY_TOP_N = 3

/**
 * A mockup's #1 segment leading its #2 by at least this ratio reads as "one
 * clear leader" — a headline figure over a leaderboard, a hero over a
 * standfirst. If the same two segments survive the match but the build's
 * ratio falls under `HIERARCHY_TIE_RATIO`, the build has flattened a
 * dominance the mockup drew on purpose (2026-09-21: the mockup's headline
 * score leads its own leaderboard row by 2.9x; the build renders both at
 * the same "figure" treatment, 1.07x apart).
 */
export const HIERARCHY_DOMINANCE_RATIO = 1.3
export const HIERARCHY_TIE_RATIO = 1.15

/** A first-fold match whose centre moves more than this fraction of the
 * viewport, on either axis, is a `mockup-shift`. */
export const SHIFT_FRACTION = 0.25

/** Containment match: the shorter normalized text must be at least this
 * fraction of the longer's length (and a literal substring of it). */
export const CONTAINMENT_MIN_RATIO = 0.8

/** Word-bigram Dice match only applies once both sides run this many words
 * or more — below it two unrelated four-word captions would look alike. */
export const BIGRAM_MIN_WORDS = 4
export const BIGRAM_DICE_MIN = 0.6

/** At or under this many characters, normalization must match exactly and
 * unmasked — "gap" and "-26" are short enough that a changed digit or a
 * different three-letter word is a different segment, not the same one with
 * new content. Above it, `matchKey` masks digit runs and dates so a changed
 * score or a new date does not read as a missing segment. */
export const SHORT_TEXT_MAX_CHARS = 3

/**
 * Walk the rendered page and group visible text into segments.
 *
 * Self-contained on purpose — Playwright serialises this with `toString()`
 * and runs it inside the page, so it cannot reference anything from this
 * module's scope (constants above are inlined as literals below).
 *
 * Grouping: consecutive visible text nodes, in DOM order, are one segment
 * when they share the nearest *authored* block-level ancestor and the same
 * computed font-size (within 0.5px) and font-family. "Authored" matters: a
 * flex or grid item that is blockified from an inline/inline-block author
 * value (any element with no element children, sitting directly in a flex or
 * grid container — the per-letter-span trick a mockup uses to draw a hero
 * word with `-webkit-text-stroke`) does not count as a block boundary on its
 * own; the walk climbs past it to the container that actually groups the
 * letters. A genuine block box — a paragraph, a heading, a flex container
 * with more than one child — still stops the walk immediately. Concatenating
 * a same-size run this way recovers "gap" from
 * `<span class="gap-letters"><span>G</span><span>A</span><span>P</span></span>`.
 *
 * `visibility:hidden` and `display:none` remove a subtree entirely (as
 * though absent), rather than lowering its opacity. `<br>` between two
 * members of the same run is folded into a literal space.
 *
 * @returns {Array<{ text: string, fontSize: number, fontWeight: string,
 *   fontFamily: string, rect: { x: number, y: number, w: number, h: number },
 *   opacity: number, visibleFraction: number }>}
 */
// The DOM helpers above (isBoundary, clipChainOf, the tree walk itself) have
// to live inside this one function body, not module scope, because
// Playwright ships this function to the page with `toString()`; splitting
// them into separate top-level functions the way compareLayouts's helpers
// are split would break that.
// fallow-ignore-next-line complexity
export function extractTextSegments() {
  const BLOCK = new Set([
    'block',
    'flex',
    'grid',
    'list-item',
    'table',
    'table-cell',
    'table-row',
    'table-caption',
    'flow-root',
  ])

  // Tags whose UA-default display is inline. Blockification only ever
  // changes an inline-level display into its block equivalent, so only
  // these can be "block" purely as an artifact of being a flex/grid item —
  // a <p> or <div> is already block by default and blockification is a
  // no-op on it. Restricting the skip to these tags is what keeps two
  // adjacent <p> flex items (a real stat row, a real two-column layout)
  // from being treated as one leaf run the way a per-letter <span> is.
  const INLINE_TAGS = new Set([
    'SPAN',
    'A',
    'B',
    'I',
    'EM',
    'STRONG',
    'SMALL',
    'SUB',
    'SUP',
    'CODE',
    'MARK',
    'U',
    'S',
    'ABBR',
    'CITE',
    'Q',
    'TIME',
    'LABEL',
  ])

  function isBoundary(el) {
    const parent = el.parentElement
    if (parent) {
      const parentDisplay = getComputedStyle(parent).display
      const isFlexOrGridItem = parentDisplay === 'flex' || parentDisplay === 'grid'
      if (isFlexOrGridItem && INLINE_TAGS.has(el.tagName) && el.childElementCount === 0) {
        // A leaf that is only block because it is a flex/grid item —
        // blockification, not an authored boundary.
        return false
      }
    }
    return BLOCK.has(getComputedStyle(el).display)
  }

  function nearestBlockAncestor(startEl) {
    let el = startEl
    while (el && el !== document.body) {
      if (isBoundary(el)) return el
      el = el.parentElement
    }
    return document.body
  }

  function rectOf(el) {
    const r = el.getBoundingClientRect()
    return {
      left: r.left + window.scrollX,
      top: r.top + window.scrollY,
      right: r.right + window.scrollX,
      bottom: r.bottom + window.scrollY,
    }
  }

  function intersect(a, b) {
    return {
      left: Math.max(a.left, b.left),
      top: Math.max(a.top, b.top),
      right: Math.min(a.right, b.right),
      bottom: Math.min(a.bottom, b.bottom),
    }
  }

  function area(r) {
    return Math.max(0, r.right - r.left) * Math.max(0, r.bottom - r.top)
  }

  const docBounds = {
    left: 0,
    top: 0,
    right: document.documentElement.scrollWidth,
    bottom: document.documentElement.scrollHeight,
  }

  // Ancestors (from `el` up through body) whose overflow clips content,
  // intersected with the document bounds. Approximated by bounding rects,
  // the same trade-off findClippedElements makes — an exact clip-region walk
  // is not worth it for a measurement this coarse.
  function clipChainOf(el) {
    let clip = docBounds
    for (let p = el; p; p = p.parentElement) {
      const cs = getComputedStyle(p)
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
        clip = intersect(clip, rectOf(p))
      }
      if (p === document.body) break
    }
    return clip
  }

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(n) {
        if (n.nodeType === 1) {
          if (n.nodeName === 'BR') return NodeFilter.FILTER_ACCEPT
          const cs = getComputedStyle(n)
          if (cs.display === 'none' || cs.visibility === 'hidden') {
            return NodeFilter.FILTER_REJECT
          }
          return NodeFilter.FILTER_SKIP
        }
        if (!n.nodeValue) return NodeFilter.FILTER_SKIP
        return NodeFilter.FILTER_ACCEPT
      },
    }
  )

  const runs = []
  let current = null
  let pendingBreak = false
  let node

  // biome-ignore lint/suspicious/noAssignInExpressions: TreeWalker idiom
  while ((node = walker.nextNode())) {
    if (node.nodeType === 1) {
      if (current) pendingBreak = true
      continue
    }
    if (!/\S/.test(node.nodeValue)) {
      // Whitespace-only text node — e.g. the lone space React leaves either
      // side of a hydration `<!-- -->` marker. Not a segment on its own, but
      // its presence between two real runs still means "insert a space",
      // the same as a `<br>`.
      if (current) pendingBreak = true
      continue
    }
    const el = node.parentElement
    if (!el) continue
    const cs = getComputedStyle(el)
    const fontSize = Number.parseFloat(cs.fontSize)
    const fontFamily = cs.fontFamily
    const fontWeight = cs.fontWeight

    let opacity = 1
    for (let p = el; p; p = p.parentElement) {
      opacity *= Number.parseFloat(getComputedStyle(p).opacity)
      if (p === document.body) break
    }

    const blockAncestor = nearestBlockAncestor(el)

    const sameRun =
      current &&
      current.blockAncestor === blockAncestor &&
      Math.abs(fontSize - current.fontSize) <= 0.5 &&
      fontFamily === current.fontFamily

    if (sameRun) {
      current.raw += pendingBreak ? ` ${node.nodeValue}` : node.nodeValue
      current.members.push({ node, el, opacity })
      current.opacityMin = Math.min(current.opacityMin, opacity)
    } else {
      if (current) runs.push(current)
      current = {
        blockAncestor,
        fontSize,
        fontFamily,
        fontWeight,
        raw: node.nodeValue,
        members: [{ node, el, opacity }],
        opacityMin: opacity,
      }
    }
    pendingBreak = false
  }
  if (current) runs.push(current)

  const out = []
  for (const run of runs) {
    let rect = null
    for (const { node } of run.members) {
      const range = document.createRange()
      range.selectNodeContents(node)
      const r = range.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue
      const dr = {
        left: r.left + window.scrollX,
        top: r.top + window.scrollY,
        right: r.right + window.scrollX,
        bottom: r.bottom + window.scrollY,
      }
      rect = rect
        ? {
            left: Math.min(rect.left, dr.left),
            top: Math.min(rect.top, dr.top),
            right: Math.max(rect.right, dr.right),
            bottom: Math.max(rect.bottom, dr.bottom),
          }
        : dr
    }
    if (!rect) continue

    const clip = clipChainOf(run.members[0].el)
    const visible = intersect(clip, rect)
    const totalArea = area(rect)
    const visibleFraction = totalArea > 0 ? area(visible) / totalArea : 0

    out.push({
      text: run.raw,
      fontSize: run.fontSize,
      fontWeight: run.fontWeight,
      fontFamily: run.fontFamily,
      rect: {
        x: rect.left,
        y: rect.top,
        w: rect.right - rect.left,
        h: rect.bottom - rect.top,
      },
      opacity: run.opacityMin,
      visibleFraction,
    })
  }
  return out
}

/**
 * NFKC-normalize, lowercase, fold minus/en/em dashes to `-`, collapse
 * whitespace, and strip punctuation except `-` and a `.` next to a digit
 * (so "3.5" and "gap." both keep what matters and lose what does not).
 *
 * @param {string} raw
 * @returns {string}
 */
export function normalizeText(raw) {
  if (!raw) return ''
  let s = raw.normalize('NFKC').toLowerCase()
  s = s.replace(/[−–—]/g, '-')
  s = s.replace(/\s+/g, ' ').trim()

  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '-') {
      out += c
      continue
    }
    if (c === '.') {
      const prev = s[i - 1]
      const next = s[i + 1]
      if ((prev && /\d/.test(prev)) || (next && /\d/.test(next))) out += c
      continue
    }
    if (/\p{P}/u.test(c)) continue
    out += c
  }
  return out.replace(/\s+/g, ' ').trim()
}

const DATE_LIKE = /\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/g

/**
 * `normalizeText`, then digit runs and date-like patterns masked to `#`, so
 * a changed score, price or date does not read as a missing segment.
 *
 * @param {string} raw
 * @returns {string}
 */
export function matchKey(raw) {
  return normalizeText(raw).replace(DATE_LIKE, '#date#').replace(/\d+/g, '#')
}

function withKeys(raw) {
  return { ...raw, normText: normalizeText(raw.text), key: matchKey(raw.text) }
}

/**
 * Text equality for matching. At or under `SHORT_TEXT_MAX_CHARS`, the
 * shorter side's normalized (unmasked) text must match exactly — "gap" does
 * not match a different three-letter word, and "-26" does not match "-19"
 * just because both are scores. Above that length, the masked key is enough,
 * so a changed number or date still counts as the same segment.
 */
function textsMatch(a, b) {
  if (a.normText.length <= SHORT_TEXT_MAX_CHARS || b.normText.length <= SHORT_TEXT_MAX_CHARS) {
    return a.normText === b.normText && a.normText.length > 0
  }
  return a.normText === b.normText || a.key === b.key
}

function containmentMatch(a, b) {
  const sa = a.normText
  const sb = b.normText
  if (!sa || !sb) return false
  const [shorter, longer] = sa.length <= sb.length ? [sa, sb] : [sb, sa]
  if (shorter.length === 0) return false
  return longer.includes(shorter) && shorter.length / longer.length >= CONTAINMENT_MIN_RATIO
}

function wordBigrams(text) {
  const words = text.split(' ').filter(Boolean)
  const grams = []
  for (let i = 0; i < words.length - 1; i++) grams.push(`${words[i]} ${words[i + 1]}`)
  return { words, grams }
}

function bigramMatch(a, b) {
  const wa = wordBigrams(a.normText)
  const wb = wordBigrams(b.normText)
  if (wa.words.length < BIGRAM_MIN_WORDS || wb.words.length < BIGRAM_MIN_WORDS) return false
  const setA = new Set(wa.grams)
  const setB = new Set(wb.grams)
  if (setA.size === 0 || setB.size === 0) return false
  let shared = 0
  for (const g of setA) if (setB.has(g)) shared++
  const dice = (2 * shared) / (setA.size + setB.size)
  return dice >= BIGRAM_DICE_MIN
}

function sizeRatio(a, b) {
  return a.fontSize >= b.fontSize ? a.fontSize / b.fontSize : b.fontSize / a.fontSize
}

function isEligible(seg) {
  return (
    seg.fontSize >= MIN_SEGMENT_PX &&
    seg.opacity >= OPACITY_VISIBLE_MIN &&
    seg.visibleFraction >= VISIBLE_FRACTION_MIN
  )
}

/**
 * Candidate matches for one mockup segment against the remaining build pool,
 * gated first by size (nothing more than `MATCH_SIZE_RATIO_MAX` apart can be
 * "the same element"), then tried in order: exact text, containment,
 * word-bigram Dice. Returns the first tier that has any hits.
 */
function findMatches(mockupSeg, pool) {
  const sizeOk = pool.filter((b) => sizeRatio(mockupSeg, b) <= MATCH_SIZE_RATIO_MAX)
  if (sizeOk.length === 0) return []
  const exact = sizeOk.filter((b) => textsMatch(mockupSeg, b))
  if (exact.length > 0) return exact
  const contain = sizeOk.filter((b) => containmentMatch(mockupSeg, b))
  if (contain.length > 0) return contain
  return sizeOk.filter((b) => bigramMatch(mockupSeg, b))
}

function detailForMissing(mockupSeg, allBuildSegs) {
  const candidate = allBuildSegs.find(
    (b) => textsMatch(mockupSeg, b) || containmentMatch(mockupSeg, b)
  )
  const px = Math.round(mockupSeg.fontSize)
  if (candidate) {
    const nearZero = candidate.opacity < OPACITY_VISIBLE_MIN
    const clipped = candidate.visibleFraction < VISIBLE_FRACTION_MIN
    const offDocument =
      candidate.rect.x + candidate.rect.w <= 0 || candidate.rect.y + candidate.rect.h <= 0
    if (nearZero || clipped || offDocument) {
      return (
        `'${mockupSeg.normText}' (${px}px in the mockup) is present but not rendered ` +
        '(opacity/clipped/offscreen) in the build'
      )
    }
  }
  return `'${mockupSeg.normText}' (${px}px in the mockup) has no match in the build`
}

/**
 * The mockup's candidate pool for matching: eligible segments in the first
 * fold, plus any eligible segment large enough to matter wherever it sits,
 * largest first and capped.
 */
function selectCandidates(mockupEligible, viewportHeight) {
  return mockupEligible
    .filter((s) => s.rect.y < viewportHeight || s.fontSize >= LARGE_SEGMENT_ANYWHERE_PX)
    .sort((a, b) => b.fontSize - a.fontSize)
    .slice(0, MAX_CANDIDATES)
}

/**
 * Greedy one-to-one match, largest mockup candidate first. Each build
 * segment is used at most once.
 *
 * @returns {{ pairs: Array<{mockup: object, build: object}>, unmatched: Array<object> }}
 */
function matchCandidates(candidates, buildEligible) {
  const unmatchedBuild = [...buildEligible]
  const pairs = []
  const unmatched = []

  for (const m of candidates) {
    const found = findMatches(m, unmatchedBuild)
    if (found.length === 0) {
      unmatched.push(m)
      continue
    }
    found.sort((a, b) => Math.abs(sizeRatio(m, a) - 1) - Math.abs(sizeRatio(m, b) - 1))
    const chosen = found[0]
    pairs.push({ mockup: m, build: chosen })
    unmatchedBuild.splice(unmatchedBuild.indexOf(chosen), 1)
  }
  return { pairs, unmatched }
}

function pushMissingFindings(unmatched, build, push) {
  for (const m of unmatched) push('mockup-missing', detailForMissing(m, build))
}

/**
 * A mockup #1 that leads its #2 by `HIERARCHY_DOMINANCE_RATIO` or more, but
 * whose matched build pair leads by under `HIERARCHY_TIE_RATIO`, has had its
 * dominance flattened even when the same texts still occupy the top ranks
 * (2026-09-21: the same "-26" leads by 2.9x in the mockup, 1.1x in the
 * build). Returns the finding detail, or null when the lead survived.
 */
function dominanceCollapseDetail(mockupTop, pairs) {
  if (mockupTop.length < 2) return null
  const p1 = pairs.find((p) => p.mockup === mockupTop[0])
  const p2 = pairs.find((p) => p.mockup === mockupTop[1])
  if (!p1 || !p2 || p2.build.fontSize <= 0) return null

  const mockupGap = mockupTop[0].fontSize / mockupTop[1].fontSize
  const buildGap = p1.build.fontSize / p2.build.fontSize
  if (mockupGap < HIERARCHY_DOMINANCE_RATIO || buildGap >= HIERARCHY_TIE_RATIO) return null

  return (
    `mockup's largest ('${mockupTop[0].normText}', ${Math.round(mockupTop[0].fontSize)}px) leads its ` +
    `runner-up ('${mockupTop[1].normText}', ${Math.round(mockupTop[1].fontSize)}px) by ${mockupGap.toFixed(1)}x; ` +
    `in the build the same two lead by only ${buildGap.toFixed(1)}x`
  )
}

/** The largest thing on the page, and the top-3 set, should be recognisably
 * the same content on both sides. */
function pushHierarchyFinding(candidates, buildEligible, pairs, push) {
  const mockupTop = candidates.slice(0, HIERARCHY_TOP_N)
  const buildTop = [...buildEligible]
    .sort((a, b) => b.fontSize - a.fontSize)
    .slice(0, HIERARCHY_TOP_N)
  if (mockupTop.length === 0 || buildTop.length === 0) return

  const top1Differs = !textsMatch(mockupTop[0], buildTop[0])
  const missingFromBuildTop3 = mockupTop.some(
    (m) => !buildTop.some((b) => textsMatch(m, b) || containmentMatch(m, b))
  )
  const dominanceDetail = dominanceCollapseDetail(mockupTop, pairs)

  if (!(top1Differs || missingFromBuildTop3 || dominanceDetail)) return
  push(
    'mockup-hierarchy',
    dominanceDetail ??
      `largest text in mockup is '${mockupTop[0].normText}' (${Math.round(mockupTop[0].fontSize)}px); ` +
        `in build it is '${buildTop[0].normText}' (${Math.round(buildTop[0].fontSize)}px)`
  )
}

function pushScaleFindings(candidates, pairs, push) {
  const scaleEligible = new Set(candidates.slice(0, SCALE_TOP_N))
  for (const { mockup: m, build: b } of pairs) {
    if (!scaleEligible.has(m)) continue
    const ratio = b.fontSize / m.fontSize
    if (ratio >= SCALE_RATIO_MIN && ratio <= SCALE_RATIO_MAX) continue
    push(
      'mockup-scale',
      `'${m.normText}' is ${Math.round(m.fontSize)}px in the mockup and ${Math.round(b.fontSize)}px ` +
        `in the build (${ratio.toFixed(2)}x)`
    )
  }
}

function pushShiftFindings(pairs, width, viewportHeight, push) {
  for (const { mockup: m, build: b } of pairs) {
    if (m.rect.y >= viewportHeight) continue
    const mCenter = { x: m.rect.x + m.rect.w / 2, y: m.rect.y + m.rect.h / 2 }
    const bCenter = { x: b.rect.x + b.rect.w / 2, y: b.rect.y + b.rect.h / 2 }
    const dxFraction = Math.abs(bCenter.x - mCenter.x) / width
    const dyFraction = Math.abs(bCenter.y - mCenter.y) / viewportHeight
    const crossedFold = bCenter.y >= viewportHeight
    if (!(dxFraction > SHIFT_FRACTION || dyFraction > SHIFT_FRACTION || crossedFold)) continue
    const foldNote = crossedFold ? '; crossed the fold' : ''
    push(
      'mockup-shift',
      `'${m.normText}' moved from (${Math.round(mCenter.x)}, ${Math.round(mCenter.y)}) in the mockup ` +
        `to (${Math.round(bCenter.x)}, ${Math.round(bCenter.y)}) in the build${foldNote}`
    )
  }
}

function pushTextCutFindings(build, push) {
  for (const b of build) {
    if (b.fontSize < MIN_SEGMENT_PX) continue
    if (b.opacity < OPACITY_VISIBLE_MIN) continue
    if (b.visibleFraction >= TEXT_CUT_VISIBLE_FRACTION) continue
    push(
      'text-cut',
      `'${b.normText}' shows ${Math.round(b.visibleFraction * 100)}% of itself in the build`
    )
  }
}

/**
 * Compare a mockup's text segments against a build's and report where the
 * build lost the mockup's composition. Pure — no browser, no I/O.
 *
 * @param {Array<object>} mockupRaw segments from `extractTextSegments()`
 * @param {Array<object>} buildRaw segments from `extractTextSegments()`
 * @param {{ width: number, viewportHeight: number }} viewport
 * @returns {Array<{ kind: string, severity: 'warning', route: string,
 *   viewport: string, width: number, detail: string }>}
 */
export function compareLayouts(mockupRaw, buildRaw, { width, viewportHeight }) {
  const mockup = mockupRaw.map(withKeys)
  const build = buildRaw.map(withKeys)

  const mockupEligible = mockup.filter(isEligible)
  const buildEligible = build.filter(isEligible)

  const candidates = selectCandidates(mockupEligible, viewportHeight)
  const { pairs, unmatched } = matchCandidates(candidates, buildEligible)

  const findings = []
  const viewportName = width <= 480 ? 'phone' : 'desktop'
  const push = (kind, detail) =>
    findings.push({ kind, severity: 'warning', route: '/', viewport: viewportName, width, detail })

  pushMissingFindings(unmatched, build, push)
  pushHierarchyFinding(candidates, buildEligible, pairs, push)
  pushScaleFindings(candidates, pairs, push)
  pushShiftFindings(pairs, width, viewportHeight, push)
  pushTextCutFindings(build, push)

  return findings
}
