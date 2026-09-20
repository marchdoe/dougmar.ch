import { withPanelGuards } from '../_lib/guards.js'
import { json } from '../_lib/http.js'
import { formatRatingComment } from '../_lib/rating-format.js'
import { findOpenRatingIssue, commentOnIssue, createRatingIssue } from '../_lib/github.js'
import { DATE_RE } from '../../app/server/archive-paths.js'
import type { Grade } from '../../app/types/panel.js'
const GRADE_RE = /^[A-D]$/

/**
 * Per-note cap. GitHub rejects an issue body over 65,536 characters with a
 * 422, which reached the owner as "GitHub error (422) — try again" with no
 * hint that the note was the problem. 2,000 is far more than a rating note
 * wants and far less than anything GitHub objects to.
 */
const MAX_NOTE = 2000
const NOTES = ['worked', 'didnt', 'try'] as const

export const POST = withPanelGuards(async ({ body }) => {
  const grade = typeof body.grade === 'string' ? body.grade.trim().toUpperCase() : ''
  if (!GRADE_RE.test(grade)) return json({ error: 'grade must be A, B, C, or D' }, 400)

  // Required, not defaulted. `new Date()` on a Vercel function is UTC, so an
  // owner rating the day's design at 9pm Eastern was filing it against
  // tomorrow — the panel always sends a date, so a missing one is a bug
  // rather than a case to guess at.
  if (typeof body.date !== 'string' || !DATE_RE.test(body.date)) {
    return json({ error: 'date is required and must be YYYY-MM-DD' }, 400)
  }
  const date = body.date
  // A regex match is not a real date: 2026-13-45 passes it.
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    return json({ error: 'date is not a real calendar date' }, 400)
  }

  const notes: Record<string, string> = {}
  for (const field of NOTES) {
    const value = body[field]
    if (value !== undefined && typeof value !== 'string') {
      return json({ error: `${field} must be a string` }, 400)
    }
    const text = typeof value === 'string' ? value : ''
    if (text.length > MAX_NOTE) {
      return json({ error: `${field} must be ${MAX_NOTE} characters or fewer` }, 400)
    }
    notes[field] = text
  }

  const comment = formatRatingComment({
    grade: grade as Grade,
    worked: notes.worked,
    didnt: notes.didnt,
    try: notes.try,
  })

  const existing = await findOpenRatingIssue(date)
  if (existing) {
    await commentOnIssue(existing.number, comment)
    return json({ ok: true, issueUrl: existing.url })
  }
  const created = await createRatingIssue(date, comment)
  return json({ ok: true, issueUrl: created.url })
})
