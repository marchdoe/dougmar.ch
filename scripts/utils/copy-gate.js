/**
 * The copy gate (#504): a deterministic read of the words.
 *
 * Two scans, one finding kind, `copy-tell`. The static scan reads the string
 * literals and JSX text in the files the React Engineer writes and reports
 * file, line and the line itself, which is what a repair brief needs. The
 * rendered scan reads `document.body.innerText` of every route at the 1440
 * rung in the light scheme; it runs inside `surface-gate.js`'s walk through
 * the same in-page-function convention as the clipping check, and this
 * module only supplies the function and the matcher it feeds.
 *
 * A second rendered rule reads the page a block at a time rather than as one
 * string: a heading or line of text that opens or closes on a separator (#568).
 * `{role}, {company}` with an empty role rendered ", iCapital" at 54px on
 * 2026-09-20. It is reported under the same `copy-tell` kind, as
 * `orphan-separator`, so it fails a night and reaches the repair brief the
 * same way.
 *
 * What counts as a tell is `copy-tells.js`. What is exempt:
 *
 * - `data-allow-copy-tell` on an element, the way `data-allow-x-overflow`
 *   declares a scroller deliberate. The rendered scans drop that element's
 *   text; the static scan drops the element's JSX subtree.
 * - A quoted hero line from `signals/today.yml`, when it has a named author,
 *   may keep the em dash its source had. Only the em dash, only inside the
 *   quote.
 * - Content the pipeline does not write. `app/content/*.ts` and the
 *   hand-owned routes are scanned and reported for a human, as warnings that
 *   block nothing; and their sentences are masked out of the rendered text,
 *   so an em dash in a timeline entry is never the engineer's fault.
 *
 * @module
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import * as yaml from 'js-yaml'
import { EM_DASH, ORPHAN_SEPARATOR_FIX, findOrphanSeparator, findTells } from './copy-tells.js'
import { ROOT } from './file-manager.js'
import { SITE_CALLOUT_CONTENT } from './site-callout.js'
import { ENGINEER_FILES } from './site-context.js'
import { CAN_OPEN_STRING, EXPRESSION_KEYWORDS, stripComments } from './token-gate.js'

/** Characters of rendered text reported around a match. */
export const CONTEXT_CHARS = 80

/** Findings per engineer file or route. Ten names the shape of the fault. */
export const MAX_COPY_TELLS_PER_SURFACE = 10

/**
 * Findings per file nobody in the pipeline can edit. Three, because a
 * warning on `timeline.ts` is a note for the owner, and twelve of them in
 * every critic prompt is noise.
 */
export const MAX_HUMAN_COPY_TELLS_PER_FILE = 3

/** Content strings shorter than this are never masked out of rendered text. */
export const MIN_EXEMPT_CHARS = 8

export const ALLOW_ATTRIBUTE = 'data-allow-copy-tell'

/** The engineer's own components live here; `ENGINEER_FILES` does not list them. */
export const GENERATED_DIR = 'app/components/generated'

export const CONTENT_DIR = 'app/content'

/** Hand-owned route files behind the routes the surface gate walks for a human. */
export const HUMAN_ROUTE_FILES = [
  'app/routes/work.tsx',
  'app/routes/work.index.tsx',
  'app/routes/experiments.tsx',
]

const flat = (s) => s.replace(/\s+/g, ' ').trim()

// ---------------------------------------------------------------------------
// Exemptions
// ---------------------------------------------------------------------------

/**
 * @typedef {object} CopyExemptions
 * @property {string} quoteText the day's attributed quote, whitespace-flattened, or ''
 * @property {string[]} contentTexts hand-written content sentences that carry a tell
 */

/**
 * What the scans may skip, read once per gate run.
 *
 * @param {string} [root]
 * @returns {CopyExemptions}
 */
export function readCopyExemptions(root = ROOT) {
  return { quoteText: readQuoteText(root), contentTexts: readContentTexts(root) }
}

function readQuoteText(root) {
  const file = path.join(root, 'signals', 'today.yml')
  if (!existsSync(file)) return ''
  try {
    const quote = yaml.load(readFileSync(file, 'utf8'))?.quote
    return quote?.author && typeof quote.text === 'string' ? flat(quote.text) : ''
  } catch {
    return ''
  }
}

function readContentTexts(root) {
  const dir = path.join(root, CONTENT_DIR)
  if (!existsSync(dir)) return []
  const texts = []
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
    for (const { text } of extractCopy(readFileSync(path.join(dir, f), 'utf8'))) {
      const t = flat(text)
      if (t.length >= MIN_EXEMPT_CHARS && findTells(t).length) texts.push(t)
    }
  }
  return texts
}

/** Blank every occurrence of `needle` in `text`, keeping the length. */
function blankAll(text, needle) {
  if (!needle) return text
  let out = text
  let at = out.indexOf(needle)
  while (at !== -1) {
    out = out.slice(0, at) + ' '.repeat(needle.length) + out.slice(at + needle.length)
    at = out.indexOf(needle, at + needle.length)
  }
  return out
}

/**
 * Mask what the scan may not report, without moving anything: allowed
 * elements and content sentences are blanked, and em dashes inside the
 * quote become spaces. Indices into the result still index the original.
 *
 * @param {string} text whitespace-flattened
 * @param {{ exemptions?: CopyExemptions, allowed?: string[] }} [opts]
 * @returns {string}
 */
export function applyExemptions(text, { exemptions, allowed = [] } = {}) {
  let out = text
  for (const a of allowed) out = blankAll(out, flat(a))
  for (const c of exemptions?.contentTexts ?? []) out = blankAll(out, c)
  const quote = exemptions?.quoteText
  if (quote?.includes(EM_DASH)) {
    let at = out.indexOf(quote)
    while (at !== -1) {
      out = out.slice(0, at) + quote.replaceAll(EM_DASH, ' ') + out.slice(at + quote.length)
      at = out.indexOf(quote, at + quote.length)
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

function contextAround(text, index, length) {
  const half = Math.max(0, Math.floor((CONTEXT_CHARS - length) / 2))
  const start = Math.max(0, index - half)
  const end = Math.min(text.length, index + length + half)
  return `${start > 0 ? '...' : ''}${text.slice(start, end)}${end < text.length ? '...' : ''}`
}

/**
 * Every tell in a run of text, with the words around it.
 *
 * @param {string} text
 * @param {{ exemptions?: CopyExemptions, allowed?: string[] }} [opts]
 * @returns {Array<{ tell: string, label: string, fix: string, match: string, context: string }>}
 */
export function scanText(text, opts = {}) {
  const flatText = flat(text ?? '')
  const masked = applyExemptions(flatText, opts)
  return findTells(masked).map(({ tell, label, fix, match, index }) => ({
    tell,
    label,
    fix,
    match,
    context: contextAround(flatText, index, match.length),
  }))
}

/**
 * Runs inside the page. Self-contained on purpose: Playwright serialises it
 * with toString(), so it can reference nothing from this module.
 *
 * @returns {{ text: string, allowed: string[] }} the body's visible text and
 *   the text of every element marked `data-allow-copy-tell`
 */
export function collectVisibleCopy() {
  const allowed = []
  for (const el of document.querySelectorAll('[data-allow-copy-tell]')) {
    allowed.push(el.innerText || '')
  }
  return { text: document.body ? document.body.innerText : '', allowed }
}

/**
 * @typedef {object} TextRun
 * @property {string} tag the block's tag name, lower case
 * @property {string} text the block's own text, whitespace flattened
 * @property {boolean} before the sentence carries on from something before it
 * @property {boolean} after the sentence carries on into something after it
 */

/**
 * Runs inside the page, like {@link collectVisibleCopy}, and self-contained
 * for the same reason. The text a page sets, one run per block: the text nodes
 * of a block-level element and of the inline elements inside it, whitespace
 * flattened. A block child starts a run of its own, so a heading and the
 * paragraph under it are two runs, and `<div>, <!-- -->iCapital</div>` is one.
 * Only text nodes count, so a bullet a stylesheet draws with `::before` is
 * never a run. Hidden blocks, script and style, and anything under
 * `data-allow-copy-tell` are left out.
 *
 * `before` and `after` say whether the run's edge is a join, not an orphan.
 * A flex row splits `DET · off season · <b>no game</b>` into two boxes, and
 * a chip list puts its "·" at the end of every chip but the last; in both the
 * separator has something on its far side. They are true when a block child
 * sits on that side of the run's text inside the same element, or the
 * neighbouring element is the same tag with the same class and has text.
 *
 * @returns {TextRun[]}
 */
export function collectTextRuns() {
  const SKIPPED = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TEXTAREA']
  const allowedAttr = 'data-allow-copy-tell'
  const inlineElement = (el) => ['inline', 'contents'].includes(getComputedStyle(el).display)
  const wanted = (el) => !SKIPPED.includes(el.tagName) && !el.hasAttribute(allowedAttr)
  const shown = (el) => el.getClientRects().length > 0
  // A text node, or an inline element: what belongs to the block's own run.
  const inRun = (node) =>
    node.nodeType === 3 || (node.nodeType === 1 && wanted(node) && inlineElement(node))
  const hasWords = (node) => inRun(node) && /\S/.test(node.textContent)
  const isBlockWithText = (node) =>
    node.nodeType === 1 &&
    wanted(node) &&
    !inlineElement(node) &&
    shown(node) &&
    /\S/.test(node.textContent)
  const runOf = (el) => {
    let text = ''
    for (const node of el.childNodes) {
      if (node.nodeType === 3) text += node.data
      else if (inRun(node)) text += runOf(node)
    }
    return text
  }
  // Is there a block child before the last of the text, or after the first?
  const blockChildSide = (el, side) => {
    const kids = [...el.childNodes]
    const first = kids.findIndex(hasWords)
    const last = kids.findLastIndex(hasWords)
    return kids.some(
      (node, i) => isBlockWithText(node) && (side === 'before' ? i < last : i > first)
    )
  }
  const sameKind = (el, sibling) =>
    Boolean(sibling) &&
    sibling.tagName === el.tagName &&
    sibling.className === el.className &&
    shown(sibling) &&
    /\S/.test(sibling.textContent)
  const isRunOwner = (el) =>
    wanted(el) && !el.closest(`[${allowedAttr}]`) && !inlineElement(el) && shown(el)
  const runs = []
  for (const el of document.querySelectorAll('body *')) {
    const text = isRunOwner(el) ? runOf(el).replace(/\s+/g, ' ').trim() : ''
    if (!text) continue
    runs.push({
      tag: el.tagName.toLowerCase(),
      text,
      before: blockChildSide(el, 'before') || sameKind(el, el.previousElementSibling),
      after: blockChildSide(el, 'after') || sameKind(el, el.nextElementSibling),
    })
  }
  return runs
}

/**
 * Both in-page reads for one loaded page: the body's text and the per-block
 * runs. The one place that knows how the two functions are serialised, so the
 * surface gate and the CLI cannot drift apart.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<{ text: string, allowed: string[], runs: TextRun[] }>}
 */
export async function readRenderedCopy(page) {
  const inPage = (fn) =>
    page.evaluate(([src]) => new Function(`return ${src}`)()(), [fn.toString()])
  const visible = await inPage(collectVisibleCopy)
  return { ...visible, runs: await inPage(collectTextRuns) }
}

/**
 * The orphan separators in a page's runs (#568), one finding per distinct
 * block and text, with a count when a template repeats it row after row.
 * Hand-written content sentences and the attributed quote are masked exactly
 * as they are for the other tells, so a run that is nothing but content the
 * pipeline does not write is never reported against the engineer. A separator
 * on an edge the sentence carries across (`before` or `after` on the run) is a
 * join and is left alone.
 *
 * @param {TextRun[]} runs
 * @param {{ exemptions?: CopyExemptions }} [opts]
 * @returns {Array<{ tag: string, text: string, position: string, separator: string, count: number }>}
 */
export function scanRuns(runs, { exemptions } = {}) {
  const found = new Map()
  for (const run of runs ?? []) {
    const text = applyExemptions(flat(run.text ?? ''), { exemptions }).trim()
    const hit = findOrphanSeparator(text)
    if (!hit || (hit.position === 'start' ? run.before : run.after)) continue
    const key = `${run.tag}|${text}`
    const seen = found.get(key)
    if (seen) seen.count++
    else found.set(key, { tag: run.tag, text, ...hit, count: 1 })
  }
  return [...found.values()]
}

/**
 * The words for one orphan separator: which block, what it says, what to do.
 *
 * @param {{ tag: string, text: string, position: string, separator: string, count: number }} h
 * @returns {string}
 */
function describeOrphan(h) {
  const opens = h.position === 'start'
  const shown = h.text.length > CONTEXT_CHARS ? clipRun(h.text, opens) : h.text
  const times = h.count > 1 ? ` (x${h.count})` : ''
  return (
    `orphan separator in rendered copy: <${h.tag}> "${shown}"${times} ${opens ? 'opens' : 'closes'} ` +
    `on "${h.separator}". ${ORPHAN_SEPARATOR_FIX}`
  )
}

/** The end of a long run that holds the separator, with an ellipsis where it was cut. */
function clipRun(text, opens) {
  return opens ? `${text.slice(0, CONTEXT_CHARS)}...` : `...${text.slice(-CONTEXT_CHARS)}`
}

/**
 * The findings for one rendered route, in the shape `evaluateMeasurement`
 * appends to its list.
 *
 * @param {{ text: string, allowed?: string[], runs?: TextRun[] }} visible
 *   from {@link readRenderedCopy}; a page read without `runs` gets the
 *   vocabulary tells only
 * @param {{ exemptions?: CopyExemptions, severity: 'error'|'warning' }} opts
 * @returns {Array<{ kind: 'copy-tell', tell: string, severity: string, detail: string }>}
 */
export function renderedCopyFindings(visible, { exemptions, severity }) {
  const tells = scanText(visible.text, { exemptions, allowed: visible.allowed ?? [] })
    .slice(0, MAX_COPY_TELLS_PER_SURFACE)
    .map((h) => ({
      kind: 'copy-tell',
      tell: h.tell,
      severity,
      detail: `${h.label} in rendered copy: "${h.context}". ${h.fix}`,
    }))
  const orphans = scanRuns(visible.runs, { exemptions })
    .slice(0, MAX_COPY_TELLS_PER_SURFACE)
    .map((h) => ({
      kind: 'copy-tell',
      tell: 'orphan-separator',
      severity,
      detail: describeOrphan(h),
    }))
  return [...tells, ...orphans]
}

// ---------------------------------------------------------------------------
// Source
// ---------------------------------------------------------------------------

/** Blank the module's import statements, keeping every newline. */
function blankImports(code) {
  return code.replace(/^import\b[^;'"]*?(?:from\s+)?['"][^'"]*['"]/gm, (m) =>
    m.replace(/[^\n]/g, ' ')
  )
}

/** Blank the JSX subtree of every element carrying `data-allow-copy-tell`. */
function blankAllowedElements(code) {
  const open = new RegExp(`<([A-Za-z][\\w.]*)\\b[^>]*\\b${ALLOW_ATTRIBUTE}\\b[^>]*>`, 'g')
  let out = code
  for (const m of code.matchAll(open)) {
    const closeAt = code.indexOf(`</${m[1]}>`, m.index + m[0].length)
    const end = closeAt === -1 ? m.index + m[0].length : closeAt
    out = out.slice(0, m.index) + code.slice(m.index, end).replace(/[^\n]/g, ' ') + out.slice(end)
  }
  return out
}

/**
 * Is the quote at `i` the start of a string literal, or an apostrophe in
 * prose? The same heuristic `token-gate.js`'s `stripComments` uses, so the
 * two readers of an engineer file agree on where its strings are.
 */
function opensString(lastSignificant, lastWord) {
  return (
    lastSignificant === null ||
    CAN_OPEN_STRING.has(lastSignificant) ||
    EXPRESSION_KEYWORDS.has(lastWord)
  )
}

/**
 * String literals in comment-free source, as `{ start, end, text }` where
 * `text` excludes the quotes.
 */
function findStringLiterals(code) {
  const found = []
  const state = { lastSignificant: null, lastWord: '', currentWord: '' }
  for (let i = 0; i < code.length; i++) {
    const c = code[i]
    if (/[A-Za-z0-9_$]/.test(c)) {
      state.currentWord += c
      state.lastSignificant = c
      continue
    }
    if (state.currentWord) {
      state.lastWord = state.currentWord
      state.currentWord = ''
    }
    if (opensStringAt(c, state)) {
      const end = findStringEnd(code, i + 1, c)
      // An unterminated string runs to the end of the file; nothing after
      // it can be a literal, and the partial text is not one either.
      if (end === -1) break
      found.push({ start: i + 1, end, text: code.slice(i + 1, end) })
      state.lastSignificant = c
      state.lastWord = ''
      i = end
      continue
    }
    if (!/\s/.test(c)) {
      state.lastSignificant = c
      state.lastWord = ''
    }
  }
  return found
}

/** Does the character at the scanner's position open a string literal? */
function opensStringAt(c, state) {
  if (c === '`') return true
  return (c === "'" || c === '"') && opensString(state.lastSignificant, state.lastWord)
}

/**
 * Index of the quote that closes a string opened just before `from`, honouring
 * backslash escapes, or -1 when the string never closes.
 */
function findStringEnd(code, from, quote) {
  for (let j = from; j < code.length; j++) {
    if (code[j] === '\\') j++
    else if (code[j] === quote) return j
  }
  return -1
}

/** A segment between tags or braces that reads as JSX text, not code. */
function looksLikeJsxText(before, after, segment) {
  return (
    (before === '>' || before === '}') &&
    (after === '<' || after === '{') &&
    /[A-Za-z]/.test(segment) &&
    !/[;=(]/.test(segment)
  )
}

/**
 * JSX text runs in source whose strings have already been blanked, as
 * `{ start, text }`.
 */
function findJsxText(code) {
  const found = []
  const re = /[<>{}]/g
  let prev = null
  let last = 0
  for (const m of code.matchAll(re)) {
    const segment = code.slice(last, m.index)
    if (prev !== null && looksLikeJsxText(prev, m[0], segment)) {
      found.push({ start: last, text: segment })
    }
    prev = m[0]
    last = m.index + 1
  }
  return found
}

function lineAt(code, index) {
  let line = 1
  for (let i = 0; i < index; i++) if (code[i] === '\n') line++
  return line
}

/**
 * The copy a TSX or TS file carries: its string literals and its JSX text,
 * with the line each starts on. Comments and import lines are skipped, and
 * so is anything under an element marked `data-allow-copy-tell`.
 *
 * @param {string} source
 * @returns {Array<{ line: number, text: string }>}
 */
export function extractCopy(source) {
  const code = blankAllowedElements(blankImports(stripComments(source)))
  const strings = findStringLiterals(code)
  let blanked = code
  for (const s of strings) {
    blanked = blanked.slice(0, s.start) + ' '.repeat(s.end - s.start) + blanked.slice(s.end)
  }
  const runs = [...strings, ...findJsxText(blanked)]
    .filter((r) => /\S/.test(r.text))
    .sort((a, b) => a.start - b.start)
  return runs.map((r) => ({
    line: lineAt(code, r.start + (r.text.length - r.text.trimStart().length)),
    text: r.text,
  }))
}

/**
 * Every tell in one source file, with the line it sits on and that line's text.
 *
 * @param {string} source
 * @param {{ exemptions?: CopyExemptions }} [opts]
 * @returns {Array<{ line: number, tell: string, label: string, fix: string, match: string, lineText: string }>}
 */
export function scanSource(source, opts = {}) {
  const lines = source.split('\n')
  const out = []
  for (const run of extractCopy(source)) {
    for (const h of scanText(run.text, opts)) {
      out.push({
        line: run.line,
        tell: h.tell,
        label: h.label,
        fix: h.fix,
        match: h.match,
        lineText: flat(lines[run.line - 1] ?? '').slice(0, 160),
      })
    }
  }
  return out
}

/**
 * Which agent can act on a finding in a file. The engineer owns what it
 * writes: the mutable files that are neither the preset nor the
 * orchestrator's, and its own `app/components/generated/`.
 *
 * @param {string} relPath repo-relative, forward slashes
 * @returns {'react-engineer'|'human'}
 */
export function ownerForFile(relPath) {
  if (ENGINEER_FILES.includes(relPath) || relPath.startsWith(`${GENERATED_DIR}/`)) {
    return 'react-engineer'
  }
  return 'human'
}

/**
 * The findings for one file, in the shape the surface gate's list carries.
 *
 * @param {string} relPath
 * @param {string} source
 * @param {{ exemptions?: CopyExemptions }} [opts]
 * @returns {Array<object>}
 */
export function copyFindingsForFile(relPath, source, opts = {}) {
  const owner = ownerForFile(relPath)
  const human = owner === 'human'
  const cap = human ? MAX_HUMAN_COPY_TELLS_PER_FILE : MAX_COPY_TELLS_PER_SURFACE
  return scanSource(source, opts)
    .slice(0, cap)
    .map((h) => ({
      surface: relPath,
      line: h.line,
      owner,
      kind: 'copy-tell',
      tell: h.tell,
      severity: human ? 'warning' : 'error',
      detail: `${h.label}: "${h.lineText}". ${h.fix}`,
    }))
}

function listTs(root, dir) {
  const abs = path.join(root, dir)
  if (!existsSync(abs)) return []
  return readdirSync(abs)
    .filter((f) => /\.tsx?$/.test(f))
    .map((f) => `${dir}/${f}`)
}

/**
 * The files the static scan reads: the engineer's, then the ones a human owns.
 *
 * One content file is left out by path: app/content/callout.ts holds the home
 * callout's lines, which are about the site on purpose (#532), and reporting
 * them would put the same three warnings in every critic prompt. Nothing else
 * is exempt. `readContentTexts` still reads the file, which is what masks
 * those lines out of the rendered text of `/`, and app/components/SiteCallout.tsx
 * holds no copy of its own and was never on this list.
 *
 * @param {string} root
 * @returns {string[]} repo-relative paths that exist
 */
export function listScannedFiles(root = ROOT) {
  return [
    ...ENGINEER_FILES,
    ...listTs(root, GENERATED_DIR),
    ...listTs(root, CONTENT_DIR).filter((rel) => rel !== SITE_CALLOUT_CONTENT),
    ...HUMAN_ROUTE_FILES,
  ].filter((rel) => existsSync(path.join(root, rel)))
}

/**
 * The static half of the gate: read every scanned file and report its tells.
 *
 * @param {{ root?: string }} [opts]
 * @returns {Promise<{ findings: Array<object>, scanned: number, errorCount: number }>}
 */
export async function runCopyGate({ root = ROOT } = {}) {
  const exemptions = readCopyExemptions(root)
  const findings = []
  const files = listScannedFiles(root)
  for (const rel of files) {
    const source = readFileSync(path.join(root, rel), 'utf8')
    // The content sentences are masked out of the engineer's files and the
    // rendered text; a content file is read as itself, or its own em dashes
    // would exempt themselves.
    const opts = ownerForFile(rel) === 'human' ? {} : { exemptions }
    findings.push(...copyFindingsForFile(rel, source, opts))
  }
  return {
    findings,
    scanned: files.length,
    errorCount: findings.filter((f) => f.severity === 'error').length,
  }
}

// ---------------------------------------------------------------------------
// HTML, for the CLI against an archived page
// ---------------------------------------------------------------------------

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: EM_DASH,
  ndash: '–',
  hellip: '...',
  ldquo: '"',
  rdquo: '"',
  lsquo: "'",
  rsquo: "'",
}

/**
 * The visible text of an HTML document, roughly what `innerText` would give:
 * scripts, styles and comments dropped, tags replaced by spaces, entities
 * decoded.
 *
 * @param {string} html
 * @returns {string}
 */
export function htmlToText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
}
