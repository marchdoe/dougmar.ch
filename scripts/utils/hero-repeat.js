/**
 * A hero phrase the site has shipped in the last 30 days is not tonight's
 * (spec 11, 1b).
 *
 * "Buildable before the first line of code. Faithful after the last." was the
 * hero on 2026-09-14, 2026-09-22 and 2026-09-28. The line is in the owner's
 * voice file, so the Art Director keeps finding it, and it read five briefs
 * back, so it never saw that it had already used it. The digest now shows
 * fourteen nights; this is the check behind it, in code, over thirty.
 *
 * What counts as the same phrase: both are lowercased, accents and
 * punctuation dropped, whitespace collapsed. Then either they are equal, or
 * the shorter one's words appear as a run inside the longer one and the
 * shorter one is at least four words long. The containment rule is what
 * catches the line trimmed or extended: "Buildable before the first line of
 * code" against the full two-sentence line. The four-word floor keeps short
 * heroes from matching every longer line that happens to contain them: "BOTH"
 * (2026-09-15) is inside "Deep in both. Not a generalist." (2026-09-23), and
 * those are different pages.
 *
 * @module
 */
import { readRecentDates } from './recent-builds.js'
import { readNight } from './night-digest.js'

/** Days back a hero phrase stays taken. */
export const HERO_REPEAT_DAYS = 30

/** The fewest words a phrase needs before containment counts as a repeat. */
export const MIN_CONTAINED_WORDS = 4

/**
 * Case, accents, punctuation and whitespace removed: the words, space-separated.
 * @param {string|null|undefined} phrase
 * @returns {string}
 */
export function normaliseHeroPhrase(phrase) {
  return String(phrase ?? '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/**
 * How two phrases match, or null when they do not.
 * @param {string} a normalised
 * @param {string} b normalised
 * @returns {'exact'|'contains'|null}
 */
function matchKind(a, b) {
  if (!a || !b) return null
  if (a === b) return 'exact'
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a]
  if (shorter.split(' ').length < MIN_CONTAINED_WORDS) return null
  return ` ${longer} `.includes(` ${shorter} `) ? 'contains' : null
}

/**
 * @typedef {{ date: string, hero: string }} PastHero
 * @typedef {PastHero & { kind: 'exact'|'contains' }} HeroRepeat
 */

/**
 * Every past night whose hero phrase `hero` repeats, in the order given.
 * @param {string|null|undefined} hero tonight's phrase
 * @param {PastHero[]} past
 * @returns {HeroRepeat[]}
 */
export function findHeroRepeats(hero, past) {
  const tonight = normaliseHeroPhrase(hero)
  const out = []
  for (const night of past) {
    const kind = matchKind(tonight, normaliseHeroPhrase(night.hero))
    if (kind) out.push({ ...night, kind })
  }
  return out
}

/**
 * The date `days` calendar days before `date`, as YYYY-MM-DD.
 * @param {string} date
 * @param {number} days
 */
function daysBefore(date, days) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d - days)).toISOString().slice(0, 10)
}

/**
 * The hero phrase of every archived night in the `days` calendar days before
 * `before`, newest first. A night with no recorded hero is left out.
 * @param {string} archiveDir path to `archive/`
 * @param {{ before: string, days?: number }} options
 * @returns {PastHero[]}
 */
export function readRecentHeroes(archiveDir, { before, days = HERO_REPEAT_DAYS }) {
  const from = daysBefore(before, days)
  return readRecentDates(archiveDir, { lookbackDays: Number.POSITIVE_INFINITY, before })
    .filter((date) => date >= from)
    .map((date) => ({ date, hero: readNight(archiveDir, date).hero }))
    .filter((night) => night.hero !== null)
}

/**
 * What the Art Director is told when its hero phrase is rejected: the phrase,
 * the nights that used it, and what to do instead.
 * @param {string} hero
 * @param {HeroRepeat[]} repeats
 * @returns {string}
 */
export function heroRepeatReason(hero, repeats) {
  const nights = repeats
    .map(
      (r) =>
        `${r.date} ("${r.hero.replace(/\s+/g, ' ')}"${r.kind === 'contains' ? ', overlapping' : ''})`
    )
    .join(', ')
  return [
    `The hero phrase "${hero.replace(/\s+/g, ' ')}" was already the hero on ${nights}.`,
    `A hero phrase used on any night in the last ${HERO_REPEAT_DAYS} days is rejected, and so is one that contains such a phrase or is contained in it, when the shorter one is four words or more.`,
    'Choose a different line, one the composition, chassis and visual spec you already declared can carry. Do not trim or extend the rejected one.',
  ].join('\n')
}

/**
 * The taken hero phrases older than the digest shows, one line, so the Art
 * Director can see every phrase the check will reject and not only the
 * fourteen nights the digest lists. Empty when there are none.
 * @param {PastHero[]} past from readRecentHeroes
 * @param {string} shownThrough the oldest date the digest lists
 * @returns {string}
 */
export function formatOlderHeroes(past, shownThrough) {
  const older = past.filter((night) => night.date < shownThrough)
  if (older.length === 0) return ''
  const list = older.map((n) => `${n.date} "${n.hero.replace(/\s+/g, ' ')}"`).join('; ')
  return `Also taken, from earlier nights in the last ${HERO_REPEAT_DAYS} days: ${list}`
}
