import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { readRecentBuilds } from './recent-builds.js'
import { readRecentRatings } from './ratings.js'

// Cheap token-overlap similarity for RECURRING detection — no need for
// anything fancier than normalized word-set overlap to catch the same
// complaint resurfacing across builds ("header is messed up" / "header
// problems again").
const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'to',
  'of',
  'in',
  'on',
  'for',
  'with',
  'is',
  'it',
  'this',
  'that',
  'be',
  'we',
  'still',
])
const SIMILARITY_THRESHOLD = 0.5

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
}

/** Overlap coefficient — |A ∩ B| / min(|A|, |B|) — over normalized tokens. */
function textSimilarity(a, b) {
  const setA = new Set(tokenize(a))
  const setB = new Set(tokenize(b))
  // Require at least 2 meaningful tokens on each side — a single shared
  // word (e.g. two texts that both merely contain "flaw") is not enough
  // signal to call two complaints "the same," and short synthetic strings
  // would otherwise false-cluster on their one common token.
  if (setA.size < 2 || setB.size < 2) return 0
  let overlap = 0
  for (const t of setA) if (setB.has(t)) overlap++
  return overlap / Math.min(setA.size, setB.size)
}

/**
 * Greedily cluster entries (newest-first order preserved) by text
 * similarity. Each cluster is represented by its newest member's text.
 * @returns {Array<{date: string, source: string, text: string, count: number}>}
 */
function clusterRecurring(entries) {
  const clusters = []
  for (const e of entries) {
    const cluster = clusters.find((c) => textSimilarity(c.text, e.text) >= SIMILARITY_THRESHOLD)
    if (cluster) cluster.count++
    else clusters.push({ date: e.date, source: e.source, text: e.text, count: 1 })
  }
  return clusters
}

/**
 * Derive a rolling "Recent Lessons" prompt block from persisted critic
 * verdicts (REVISE feedback) and owner rating critiques (didnt/try fields).
 * Pure derivation at prompt-build time — no mutable state file.
 *
 * @returns {string} markdown block, or '' when there is nothing to learn from
 */
export function buildLessonsBlock(archiveDir, { limit = 7, lookbackDays = 14 } = {}) {
  const entries = [] // { date, source, text }

  for (const r of readRecentRatings(archiveDir, { lookbackDays })) {
    const text = [r.didnt, r.try].filter(Boolean).join(' — try: ')
    if (text) entries.push({ date: r.date, source: `owner (grade ${r.grade})`, text })
  }
  // The build that shipped, not the newest — see scripts/utils/recent-builds.js
  for (const { date: dateDir, buildDir } of readRecentBuilds(archiveDir, { lookbackDays })) {
    const verdictsPath = path.join(buildDir, 'verdicts.json')
    if (!existsSync(verdictsPath)) continue
    try {
      for (const v of JSON.parse(readFileSync(verdictsPath, 'utf8'))) {
        if (v.verdict === 'REVISE' && v.feedback) {
          entries.push({
            date: dateDir,
            source: v.critic,
            text: String(v.feedback).slice(0, 400),
          })
        }
        // The screenshot-critic's BAR self-eval (calibration against the
        // owner's highest-rated past build) rides on the verdict, not
        // gated by it — a SHIP can still land "below," which is exactly
        // the signal worth carrying forward. Independent of the REVISE
        // branch above so both can fire on the same verdict entry.
        if (v.bar?.position) {
          const reason = v.bar.reason ? ` — ${v.bar.reason}` : ''
          entries.push({
            date: dateDir,
            source: `${v.critic} (BAR)`,
            text: `BAR vs best build: ${v.bar.position}${reason}`.slice(0, 400),
          })
        }
      }
    } catch {
      /* ignore malformed */
    }
  }

  if (entries.length === 0) return ''
  entries.sort((a, b) => b.date.localeCompare(a.date))

  // Fold substantially-similar complaints (≥2 builds) into one RECURRING
  // entry, escalated to the front — a flaw that keeps coming back matters
  // more than the newest one-off note.
  const clustered = clusterRecurring(entries).map((c) =>
    c.count >= 2 ? { ...c, text: `RECURRING (${c.count}x): ${c.text}` } : c
  )
  clustered.sort((a, b) => {
    const aRecurring = a.count >= 2
    const bRecurring = b.count >= 2
    if (aRecurring !== bRecurring) return aRecurring ? -1 : 1
    if (aRecurring && a.count !== b.count) return b.count - a.count
    return b.date.localeCompare(a.date)
  })

  const lines = ['## Recent Lessons — recurring flaws; do NOT repeat these', '']
  for (const e of clustered.slice(0, limit)) {
    lines.push(`- [${e.date}, ${e.source}] ${e.text}`)
  }
  return lines.join('\n')
}

const MOBILE_KEYWORDS = ['360', 'phone', 'mobile']
const MOBILE_TEXT_MAX = 220

/** `columns/hero_zone/density` — the three composition axes a phone visitor
 * actually experiences, out of the full eight-axis tuple. */
function compositionSummary(composition) {
  const { columns = '?', hero_zone = '?', density = '?' } = composition || {}
  return `${columns}/${hero_zone}/${density}`
}

/** Split prose into rough sentences and strip leading bullet markers. Good
 * enough for keyword-matching critic feedback, not meant to be exact. */
function splitSentences(text) {
  return String(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/^[\s*-]+/, '').trim())
    .filter(Boolean)
}

/**
 * The surface-gate's @360 lines from one verdict's feedback. Surface-gate
 * feedback is newline-joined "<surface> @<width>: <detail>" lines (see
 * design-agents.js) — @360 is the phone width; @1440 is not.
 * @param {string} feedback
 * @returns {string[]}
 */
function surfaceGatePhoneLines(feedback) {
  return String(feedback)
    .split('\n')
    .filter((line) => line.includes('@360'))
    .map((line) => line.trim())
}

/**
 * The mockup-critic/screenshot-critic sentences that mention the phone.
 * @param {string} feedback
 * @returns {string[]}
 */
function criticPhoneSentences(feedback) {
  return splitSentences(feedback).filter((sentence) => {
    const lower = sentence.toLowerCase()
    return MOBILE_KEYWORDS.some((k) => lower.includes(k))
  })
}

/** Which extractor, if any, applies to a verdict's critic. */
function phoneTextExtractorFor(critic) {
  if (critic === 'surface-gate') return surfaceGatePhoneLines
  if (critic === 'mockup-critic' || critic === 'screenshot-critic') return criticPhoneSentences
  return null
}

/**
 * Pull the phone-relevant lines out of one shipped night's already-parsed
 * verdicts and composition tuple. No filesystem access — the thin reader
 * below (`buildMobileLessonBlock`) is the only caller that touches disk, so
 * this is directly testable with inline fixtures.
 *
 * @param {string} date YYYY-MM-DD
 * @param {Array<object>} verdicts parsed verdicts.json, or [] when missing
 * @param {{columns?: string, hero_zone?: string, density?: string}|null} composition
 *   parsed composition.json, or null when missing
 * @returns {Array<{date: string, tuple: string, text: string}>}
 */
export function extractMobileSignals(date, verdicts, composition) {
  const tuple = compositionSummary(composition)
  const out = []
  for (const v of verdicts || []) {
    if (!v?.feedback) continue
    const extractor = phoneTextExtractorFor(v.critic)
    if (!extractor) continue
    for (const text of extractor(v.feedback)) out.push({ date, tuple, text })
  }
  return out
}

/**
 * Render deduplicated, capped mobile-lesson entries as the block the Art
 * Director reads. Pure — assumes `entries` already newest-first, which
 * `buildMobileLessonBlock` guarantees by walking dates newest-first.
 *
 * @param {Array<{date: string, tuple: string, text: string}>} entries
 * @param {{limit?: number}} [options]
 * @returns {string} markdown block, or '' when there is nothing to report
 */
export function formatMobileLessonBlock(entries, { limit = 6 } = {}) {
  const seen = new Set()
  const lines = []
  for (const e of entries) {
    const text = e.text.length > MOBILE_TEXT_MAX ? `${e.text.slice(0, MOBILE_TEXT_MAX)}…` : e.text
    const key = text.toLowerCase().replace(/\s+/g, ' ').trim()
    if (!key || seen.has(key)) continue
    seen.add(key)
    lines.push(`${e.date} · ${e.tuple} · ${text}`)
    if (lines.length >= limit) break
  }
  if (!lines.length) return ''
  return ['## Mobile reality at 360px', '', ...lines].join('\n')
}

/**
 * The feedback half of #470 (the declaration half — a structured mobile
 * collapse the Art Director must name — is #452): a short, dated record of
 * what the last several shipped nights' compositions actually became on a
 * phone, built from the same archive the desktop-facing lessons block above
 * reads. Built before the Art Director call so the Art Director sees its
 * own recent mobile track record before picking today's tuple, rather than
 * only the mockup designer and engineer seeing it afterward.
 *
 * Thin filesystem reader around the two pure functions above.
 *
 * @param {string} archiveDir path to `archive/`
 * @param {{lookbackDays?: number, limit?: number}} [options]
 * @returns {string} markdown block, or '' when there is nothing to report
 */
export function buildMobileLessonBlock(archiveDir, { lookbackDays = 7, limit = 6 } = {}) {
  const entries = []
  for (const { date, buildDir } of readRecentBuilds(archiveDir, { lookbackDays })) {
    const verdictsPath = path.join(buildDir, 'verdicts.json')
    const compositionPath = path.join(buildDir, 'composition.json')
    let verdicts = []
    if (existsSync(verdictsPath)) {
      try {
        verdicts = JSON.parse(readFileSync(verdictsPath, 'utf8'))
      } catch {
        /* ignore malformed */
      }
    }
    let composition = null
    if (existsSync(compositionPath)) {
      try {
        composition = JSON.parse(readFileSync(compositionPath, 'utf8'))
      } catch {
        /* ignore malformed */
      }
    }
    entries.push(...extractMobileSignals(date, verdicts, composition))
  }
  return formatMobileLessonBlock(entries, { limit })
}
