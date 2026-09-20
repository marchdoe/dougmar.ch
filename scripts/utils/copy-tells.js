/**
 * The tells the copy gate looks for (#504).
 *
 * Nobody in the pipeline read the words. The shipped page on 2026-09-08
 * carried seven em dashes and fifteen sentences about rebuilding itself
 * overnight, and every critic passed it, because every critic was looking
 * at geometry or pixels. These lists are the deterministic half of the fix:
 * a matcher that costs no tokens and cannot be talked out of a finding.
 *
 * The vocabulary comes from the owner's standing rule, the unslop pattern
 * list vendored at `scripts/prompts/unslop.md` (patterns 7, 26 and 31).
 * `tests/utils/copy-tells.test.js` asserts every word in
 * {@link AI_VOCABULARY_FROM_SKILL} still appears in that file, so the list
 * cannot drift from its source. Our own additions live apart, in
 * {@link AI_VOCABULARY_ADDITIONS}.
 *
 * Matching is plain and whole-word, and the gate is error severity, so the
 * list holds only words with no honest use on a designer's portfolio. The
 * pattern-26 nouns that also name real things a designer or a golfer talks
 * about (a surface, a vector, a wedge, a primitive, a harness, a landscape,
 * a ratchet, scaffolding, bedrock, a substrate, to evacuate) stay in the
 * vendored list for the critic's judgement and out of the matcher.
 *
 * @module
 */

/** U+2014. Never in authored copy; a period or a comma instead. */
export const EM_DASH = '—'

/** U+2013. Fine in a range (13–6), a tell when spaced out as a dash. */
export const EN_DASH = '–'

/**
 * Words from the vendored pattern list. Pattern 7 (AI vocabulary), pattern
 * 26 (abstract metaphor nouns) and pattern 31 (the fancier synonym).
 */
export const AI_VOCABULARY_FROM_SKILL = [
  // Pattern 7
  'additionally',
  'crucial',
  'delve',
  'enduring',
  'enhance',
  'fostering',
  'garner',
  'interplay',
  'intricate',
  'pivotal',
  'showcase',
  'tapestry',
  'testament',
  'underscore',
  'vibrant',
  // Pattern 26, minus the nouns with a concrete meaning (see the module note)
  'locus',
  'vantage',
  'nexus',
  'modality',
  'paradigm',
  'gold-plating',
  'endgame',
  'north star',
  'flywheel',
  // Pattern 31
  'utilize',
  'leverage',
  'facilitate',
  'numerous',
  'in the event that',
]

/**
 * Our additions. Not in the skill file, so the drift test above skips them.
 * "leverage" and "utilize" were asked for too; they already sit in pattern 31.
 */
export const AI_VOCABULARY_ADDITIONS = [
  'seamless',
  'robust',
  'elevate',
  'empower',
  'unlock',
  'journey',
  'realm',
]

export const AI_VOCABULARY = [...AI_VOCABULARY_FROM_SKILL, ...AI_VOCABULARY_ADDITIONS]

/** Fancy ways to say "is", filler, and the "not just X, but Y" frame. */
export const CONNECTIVE_TELLS = [
  /\bnot just \w+.{0,40}, but\b/i,
  /\bserves as\b/i,
  /\bstands as\b/i,
  /\bboasts\b/i,
  /\bin order to\b/i,
  /\bit is important to note\b/i,
  /\bit['’]s worth noting\b/i,
]

/**
 * The site talking about its own rebuild. The portfolio is Doug March's;
 * the nightly redesign is a mechanism the archive records, never the copy's
 * subject.
 */
export const SELF_REFERENCE = [
  /\brebuil\w* (?:itself|myself)\b/i,
  /\btears? itself down\b/i,
  /\btore itself down\b/i,
  /\bevery night\b/i,
  /\b(?:rebuil|remade|redesign)\w*.{0,30}\bovernight\b/i,
  /\bnightly\b/i,
  /\bthis portfolio\b/i,
  /\bthis site\b/i,
  /\brebuild log\b/i,
  /--nightly/,
  /\bredesigns itself\b/i,
]

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** One whole-word, case-insensitive alternation for a word list. */
export function compileWordList(words) {
  return new RegExp(`\\b(?:${words.map(escapeRegex).join('|')})\\b`, 'i')
}

/**
 * Every tell the gate matches, with the label a finding carries and the one
 * sentence that says what to do instead. Order matters only for reporting.
 *
 * @type {Array<{ tell: string, pattern: RegExp, label: (match: string) => string, fix: string }>}
 */
export const TELLS = [
  {
    tell: 'em-dash',
    pattern: new RegExp(EM_DASH),
    label: () => 'em dash',
    fix: 'Use a period or a comma.',
  },
  {
    tell: 'em-dash',
    // Spaced, and not between two numbers: a score set as three spans reads
    // "11 – 7" in innerText, and that is a score, not a dash.
    pattern: new RegExp(`(?<!\\d) ${EN_DASH} (?!\\d)`),
    label: () => 'en dash used as a dash',
    fix: 'Use a period or a comma.',
  },
  {
    tell: 'self-reference',
    pattern: new RegExp(SELF_REFERENCE.map((r) => `(?:${r.source})`).join('|'), 'i'),
    label: (m) => `self-reference "${m}"`,
    fix: "The site is Doug March's portfolio; the rebuild is never the subject of the copy.",
  },
  {
    tell: 'ai-vocabulary',
    pattern: compileWordList(AI_VOCABULARY),
    label: (m) => `AI vocabulary "${m}"`,
    fix: 'Use the plain word.',
  },
  {
    tell: 'connective',
    pattern: new RegExp(CONNECTIVE_TELLS.map((r) => `(?:${r.source})`).join('|'), 'i'),
    label: (m) => `connective tell "${m}"`,
    fix: 'State the point directly.',
  },
]

/** What to do about an orphan separator; the sentence a finding ends with. */
export const ORPHAN_SEPARATOR_FIX =
  'A field can be empty; render the separator only when both sides exist.'

/**
 * A run made only of dividers: a lone "—" standing in for an empty value, or
 * a "/" or "·" set between two spans. Nothing is missing next to it. A comma
 * is not on the list; nobody sets one as a divider on its own.
 */
const DIVIDER_ONLY = /^[·\-–—|/\s]+$/

/**
 * A comma, a middle dot, a bar or an em dash opens the run. A hyphen, an en
 * dash or a slash counts only when a space follows it: "-12%", "–3°", "--flag"
 * and "/about" are values and paths, while "- item" and "/ 08" are separators
 * with nothing on their left.
 */
const LEADING_SEPARATOR = /^(?:[,·|—]|[-–/]\s)/

/** A comma, a middle dot or a dash closes the run. "2008 –" is caught on purpose. */
const TRAILING_SEPARATOR = /[,·–—]$/

/**
 * The orphan-separator rule (#568). `text` is one run: the words one block
 * sets on its own lines, from `collectTextRuns`. A template that prints
 * `{role}, {company}` with an empty role leaves ", iCapital", and one that
 * prints `{start} — {end}` for a current job leaves "2025 —". Neither is
 * a tell in the vocabulary sense, so it is matched per run rather than in the
 * page's flattened text, where the comma would sit between two unrelated words.
 *
 * @param {string} text
 * @returns {{ position: 'start'|'end', separator: string }|null}
 */
export function findOrphanSeparator(text) {
  const t = (text ?? '').trim()
  if (!t || DIVIDER_ONLY.test(t)) return null
  const lead = LEADING_SEPARATOR.exec(t)
  if (lead) return { position: 'start', separator: lead[0].trim() }
  const trail = TRAILING_SEPARATOR.exec(t)
  if (trail) return { position: 'end', separator: trail[0] }
  return null
}

/**
 * Every tell in a piece of text, first to last, no two overlapping.
 *
 * "rebuilds itself every night" matches two self-reference rules; the one
 * that starts first wins and the other is dropped, so one sentence is one
 * finding.
 *
 * @param {string} text
 * @returns {Array<{ tell: string, label: string, fix: string, index: number, match: string }>}
 */
export function findTells(text) {
  const hits = []
  for (const t of TELLS) {
    const re = new RegExp(t.pattern.source, `${t.pattern.flags.replace('g', '')}g`)
    for (const m of text.matchAll(re)) {
      hits.push({ tell: t.tell, label: t.label(m[0]), fix: t.fix, index: m.index, match: m[0] })
    }
  }
  hits.sort((a, b) => a.index - b.index || b.match.length - a.match.length)
  const kept = []
  let end = -1
  for (const h of hits) {
    if (h.index < end) continue
    kept.push(h)
    end = h.index + h.match.length
  }
  return kept
}

/**
 * The pattern section of the vendored skill file, for a prompt placeholder.
 * Drops the front matter, the process and the "adding soul" preamble; keeps
 * everything from the pattern list down.
 *
 * @param {string} vendored the content of scripts/prompts/unslop.md
 * @returns {string}
 */
export function unslopPatternsSection(vendored) {
  const marker = '## Patterns to detect and fix'
  const at = vendored.indexOf(marker)
  if (at === -1) throw new Error(`unslop.md has no "${marker}" section`)
  return vendored.slice(at).trim()
}
