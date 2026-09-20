/**
 * The home page callout: the one place the site says what it is doing.
 *
 * Every agent is banned from this subject (SELF_REFERENCE in
 * scripts/utils/copy-tells.js), so these lines are written by hand, the way
 * the sentence at the top of /archive is. `app/content/` is refused at the
 * write layer, so no nightly run can edit them. app/components/SiteCallout.tsx
 * renders them and the orchestrator owns that file. See #532.
 */

export type SiteCalloutCopy = {
  /** The accessible name of the callout. Never rendered as text. */
  label: string
  /** One is shown per day. Add or cut freely; the rotation follows the length. */
  lines: string[]
  whitePaper: { href: string; label: string }
  archive: { href: string; label: string }
}

export const siteCallout: SiteCalloutCopy = {
  label: 'How this site is made',
  lines: [
    "A pipeline of agents rebuilt this site this morning from the day's weather, markets and headlines. It does that every morning. I wrote up how.",
    "This page did not look like this yesterday. A pipeline redesigns the site each morning from the day's signals, and the white paper explains the parts.",
    'Nobody laid this page out by hand. Each morning a pipeline reads nineteen signals and rebuilds the site around them. The white paper covers how it works and where it fails.',
    "This design is a day old at most. A pipeline rebuilds the site every morning from that day's signals. I wrote down how, including the constraints it runs under.",
    "An art director and an engineer, both agents, rebuilt this site before I woke up. They do it every morning from the day's signals. The white paper has the details.",
  ],
  whitePaper: { href: '/work/dougmar-ch', label: 'Read the white paper' },
  archive: { href: '/archive', label: 'Archive' },
}

/**
 * The line for a design date.
 *
 * Counts whole days since the epoch and takes the remainder, so the same date
 * always yields the same line, the next day always yields the next one, and an
 * archived page reads the way it did the morning it shipped. The date is the
 * run's, stamped into SiteCallout.tsx by the orchestrator. It is never the
 * visitor's clock: a visitor in Auckland and a rebuild at 23:00 would both
 * disagree with the archive.
 *
 * @param date YYYY-MM-DD
 */
export function calloutLineFor(date: string, lines: string[] = siteCallout.lines): string {
  const [y, m, d] = date.split('-').map(Number)
  const day = Math.floor(Date.UTC(y, (m || 1) - 1, d || 1) / 86_400_000)
  const index = Number.isFinite(day) ? ((day % lines.length) + lines.length) % lines.length : 0
  return lines[index] ?? ''
}
