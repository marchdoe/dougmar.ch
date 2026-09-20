#!/usr/bin/env node
/**
 * Harvest daily-rating GitHub issues into archive/{date}/rating-{ts}.json
 * (new schema: { date, grade, worked, didnt, try, timestamp }), then close
 * each harvested issue. Runs as the first pipeline step in CI; requires
 * GH_TOKEN (the workflow's GITHUB_TOKEN). Degrades to a no-op locally or
 * when gh is unavailable. Never fails the run.
 */
import { execFileSync } from 'node:child_process'
import {
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  readFileSync,
  copyFileSync,
} from 'node:fs'
import { resolve, join } from 'node:path'
import { isMain } from './utils/cli.js'

const ROOT = resolve(import.meta.dirname, '..')

// The daily-rating issue is public: anyone can comment, and comment text
// flows into the Art Director prompt as owner instructions. Only accept
// rating comments from accounts GitHub vouches for on this repo.
const TRUSTED_ASSOCIATIONS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR'])

// The issue itself needs a gate too. The `daily-rating` label is all that
// picks an issue up, and anyone can open an issue that carries it (a template
// with `labels: daily-rating` would do it), so its body is only read when a
// known account opened it. The nightly workflow opens it as the Actions bot
// (`gh` names that login `app/github-actions`, the REST API
// `github-actions[bot]`), and the owner panel opens it with the owner's token.
// `gh issue list --json` has no association field for issues, so this is by
// login.
const TRUSTED_ISSUE_AUTHORS = new Set(['app/github-actions', 'github-actions[bot]', 'marchdoe'])

/**
 * Whether a known account opened this issue. An issue with no author is
 * treated as a stranger's.
 * @param {{ author?: { login?: string } | null }} issue
 * @returns {boolean}
 */
export function isTrustedIssueAuthor(issue) {
  return TRUSTED_ISSUE_AUTHORS.has(issue.author?.login ?? '')
}

/**
 * @typedef {{ date: string, grade: string, worked: string, didnt: string, try: string }} ParsedRating
 * @typedef {{
 *   number?: number,
 *   title?: string,
 *   body?: string,
 *   comments?: Array<{ body: string, authorAssociation?: string }>,
 *   author?: { login?: string } | null,
 * }} RatingIssue
 */

/**
 * The newest trusted rating on a daily-rating issue, or null when the issue
 * is not one this pipeline should read.
 * @param {RatingIssue} issue
 * @returns {ParsedRating | null}
 */
export function parseRatingFromIssue(issue) {
  if (!isTrustedIssueAuthor(issue)) return null
  const dateMatch = /Rate:\s*(\d{4}-\d{2}-\d{2})/.exec(issue.title || '')
  if (!dateMatch) return null
  const date = dateMatch[1]
  const trusted = (issue.comments || []).filter((c) =>
    TRUSTED_ASSOCIATIONS.has(c.authorAssociation)
  )
  const sources = [...trusted.map((c) => c.body).reverse(), issue.body || '']
  for (const text of sources) {
    const fence = /```ya?ml\s*\n([\s\S]*?)```/.exec(text || '')
    if (!fence) continue
    const kv = {}
    for (const line of fence[1].split('\n')) {
      const m = /^\s*(grade|worked|didnt|try)\s*:\s*(.*?)\s*$/.exec(line)
      if (m) kv[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
    if (kv.grade && /^[A-Da-d]$/.test(kv.grade)) {
      return {
        date,
        grade: kv.grade.toUpperCase(),
        worked: kv.worked || '',
        didnt: kv.didnt || '',
        try: kv.try || '',
      }
    }
  }
  return null
}

/**
 * Locate the best (newest) build's screenshot for a rated date, or null
 * when no build directory for that date has one — expected for older
 * builds that predate screenshot archiving, or dates with no builds at all.
 */
export function findBestScreenshot(archiveDir, date) {
  const dateDir = join(archiveDir, date)
  let buildDirs
  try {
    buildDirs = readdirSync(dateDir)
      .filter((d) => /^build-\d+$/.test(d))
      .sort()
      .reverse()
  } catch {
    return null
  }
  for (const b of buildDirs) {
    const candidate = join(dateDir, b, 'screenshot.png')
    if (existsSync(candidate)) return candidate
  }
  return null
}

/** Collapse to one line and escape for a YAML double-quoted scalar. */
function escapeYamlDoubleQuoted(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' ').trim()
}

/**
 * Append one reference entry to references/index.yml, preserving the
 * existing file (comments included) instead of round-tripping through a
 * YAML serializer. No-op (returns false) if this file was already promoted
 * — harvest() can run against the same rating more than once.
 */
export function appendReferenceEntry(indexPath, { file, description }) {
  const raw = existsSync(indexPath) ? readFileSync(indexPath, 'utf8') : 'references:\n'
  if (raw.includes(`file: ${file}`)) return false
  const block = `  - file: ${file}\n    description: "${escapeYamlDoubleQuoted(description)}"\n`
  writeFileSync(indexPath, raw.endsWith('\n') ? raw + block : `${raw}\n${block}`, 'utf8')
  return true
}

/**
 * Auto-promote an A/B-graded rating into the reference library: copy the
 * date's best screenshot into references/ and append an index.yml entry
 * describing what worked, so tomorrow's Art Director sees today's own
 * success as a citable reference. Non-blocking by contract — callers wrap
 * this in try/catch; returns null on any skip condition (grade below B,
 * no screenshot on disk, already promoted).
 *
 * @returns {{ id: string, file: string } | null}
 */
export function promoteRatingToReferences(rating, { archiveDir, referencesDir, indexPath } = {}) {
  if (!rating || !['A', 'B'].includes(rating.grade)) return null
  const screenshotSrc = findBestScreenshot(archiveDir, rating.date)
  if (!screenshotSrc) return null

  const id = `own-${rating.date}`
  const fileName = `${id}.png`
  mkdirSync(referencesDir, { recursive: true })
  copyFileSync(screenshotSrc, join(referencesDir, fileName))

  const description = rating.worked
    ? `OWN (${rating.date}, grade ${rating.grade}): ${rating.worked}`
    : `OWN (${rating.date}, grade ${rating.grade}).`
  const appended = appendReferenceEntry(indexPath, { file: fileName, description })
  return appended ? { id, file: fileName } : { id, file: fileName, alreadyPromoted: true }
}

function harvest() {
  let issues
  try {
    const raw = execFileSync(
      'gh',
      [
        'issue',
        'list',
        '--label',
        'daily-rating',
        '--state',
        'open',
        '--json',
        'number,title,body,comments,author',
        '--limit',
        '30',
      ],
      { encoding: 'utf8' }
    )
    issues = JSON.parse(raw)
  } catch (err) {
    console.log(
      `[collect-ratings] gh unavailable or no issues (non-blocking): ${err.message.split('\n')[0]}`
    )
    return
  }
  let harvested = 0
  for (const issue of issues) {
    // Whole body in the try so even a parse throw can't escape harvest()
    // and fail the run — this script's one promise is "never blocks".
    try {
      const rating = parseRatingFromIssue(issue)
      if (!rating) {
        const why = isTrustedIssueAuthor(issue)
          ? 'not yet filled'
          : `opened by ${issue.author?.login ?? 'an unknown author'}, not a trusted account`
        console.log(`[collect-ratings] #${issue.number} ${why} — leaving open`)
        continue
      }
      const dateDir = join(ROOT, 'archive', rating.date)
      mkdirSync(dateDir, { recursive: true })
      const ts = Date.now()
      writeFileSync(
        join(dateDir, `rating-${ts}.json`),
        JSON.stringify({ ...rating, timestamp: ts }, null, 2)
      )
      // Non-blocking: an A/B rating gets folded into the reference library
      // so tomorrow's Art Director can cite today's own success. Isolated
      // in its own try/catch so a promotion failure never costs the rating
      // that already landed on disk above.
      try {
        const promoted = promoteRatingToReferences(rating, {
          archiveDir: join(ROOT, 'archive'),
          referencesDir: join(ROOT, 'references'),
          indexPath: join(ROOT, 'references', 'index.yml'),
        })
        if (promoted && !promoted.alreadyPromoted) {
          console.log(
            `[collect-ratings] promoted ${rating.date} (grade ${rating.grade}) → references/${promoted.file}`
          )
        }
      } catch (err) {
        console.warn(`[collect-ratings] reference promotion failed (non-blocking): ${err.message}`)
      }
      execFileSync('gh', [
        'issue',
        'close',
        String(issue.number),
        '--comment',
        `Harvested: grade ${rating.grade}. This feeds tomorrow's run.`,
      ])
      harvested++
      console.log(
        `[collect-ratings] #${issue.number} → archive/${rating.date}/rating-${ts}.json (grade ${rating.grade})`
      )
    } catch (err) {
      console.warn(
        `[collect-ratings] #${issue.number} harvest failed (non-blocking): ${err.message}`
      )
    }
  }
  console.log(`[collect-ratings] harvested ${harvested} rating(s)`)
}

if (isMain(import.meta.url)) {
  harvest()
}
