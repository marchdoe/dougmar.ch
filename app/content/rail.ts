/**
 * The live rail's words (#702).
 *
 * The rail is the dark band at the top of `/`, `/about` and `/work/*`. It
 * says what the callout says at the bottom of home, in the archive rail's
 * shape, so a first-time visitor learns the site is redesigned every morning
 * before they scroll. The archive rail (scripts/utils/archive-seal.js
 * buildFrame) is the model: same height, same colours, same buttons.
 *
 * The copy lives here because `app/content/` is refused at the write layer
 * (FORBIDDEN_PREFIXES in scripts/utils/file-manager.js), so no nightly run can
 * edit it. app/components/LiveRail.tsx renders it and is hand-written.
 *
 * Every label has a long and a short form. The buttons take their short ones
 * at 640px and under, where the note goes; the archive link and the date take
 * theirs under 480px, where the rail has room for four things and no arrow.
 */

export type RailLabel = { long: string; short: string }

export type LiveRailCopy = {
  archive: { href: string; long: (count: number) => string; short: string }
  /** The `‹` link's title and accessible name, followed by the date it goes to. */
  prevTitle: string
  today: { long: (date: string) => string; short: string }
  note: string
  whitePaper: { href: string } & RailLabel
  how: { href: (date: string) => string } & RailLabel
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/**
 * "October 6" from "2026-10-06".
 *
 * Read from the string, never through `Date`: `new Date('2026-10-06')` is
 * midnight UTC, which is the evening of October 5 in New York, and the rail
 * would name the wrong day for every visitor west of Greenwich. The date is
 * the run's, written into __root.tsx by the orchestrator, never the visitor's
 * clock.
 *
 * @param date YYYY-MM-DD
 */
export function railMonthDay(date: string): string {
  const [, m, d] = date.split('-').map(Number)
  const month = MONTHS[(m ?? 0) - 1]
  if (!month || !d) throw new Error(`expected a YYYY-MM-DD date, got: ${date}`)
  return `${month} ${d}`
}

export const liveRail: LiveRailCopy = {
  archive: {
    href: '/archive',
    long: (count) => `Archive · ${count} designs`,
    short: 'Archive',
  },
  prevTitle: 'Previous design',
  today: {
    long: (date) => `Today, ${railMonthDay(date)}`,
    short: 'Today',
  },
  note: 'A new design ships every morning.',
  whitePaper: { href: '/work/dougmar-ch', long: 'Read the white paper', short: 'White paper' },
  how: { href: (date) => `/how/${date}`, long: 'How it was made', short: 'How' },
}
