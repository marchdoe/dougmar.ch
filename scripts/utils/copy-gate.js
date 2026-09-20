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
 * What counts as a tell is `copy-tells.js`. What is exempt:
 *
 * - `data-allow-copy-tell` on an element, the way `data-allow-x-overflow`
 *   declares a scroller deliberate. The rendered scan drops that element's
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
import { EM_DASH, findTells } from './copy-tells.js'
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
 * The findings for one rendered route, in the shape `evaluateMeasurement`
 * appends to its list.
 *
 * @param {{ text: string, allowed?: string[] }} visible from {@link collectVisibleCopy}
 * @param {{ exemptions?: CopyExemptions, severity: 'error'|'warning' }} opts
 * @returns {Array<{ kind: 'copy-tell', tell: string, severity: string, detail: string }>}
 */
export function renderedCopyFindings(visible, { exemptions, severity }) {
  return scanText(visible.text, { exemptions, allowed: visible.allowed ?? [] })
    .slice(0, MAX_COPY_TELLS_PER_SURFACE)
    .map((h) => ({
      kind: 'copy-tell',
      tell: h.tell,
      severity,
      detail: `${h.label} in rendered copy: "${h.context}". ${h.fix}`,
    }))
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
