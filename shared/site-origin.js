/**
 * The one place the site's web host is written down.
 *
 * Two names, because two different questions get asked about a host, and
 * conflating them is how a domain move falsifies an archive.
 *
 * `RECOGNIZED_ORIGINS` answers "could this URL have been ours?" — used when
 * READING existing bytes. It only ever grows. 109 archived dates were captured
 * under `doug-march.com` and record it as the host that actually served them;
 * every capture after a cutover carries the new host and needs the same
 * treatment. Both must be matched forever.
 *
 * `CANONICAL_ORIGIN` answers "where does this page live now?" — used when
 * WRITING a URL. It moves on cutover day.
 *
 * So a preserved snapshot keeps `doug-march.com` as the visible text of a link,
 * because that is what that design said, while the `og:url` the seal injects
 * into the same page moves, because after the cutover that genuinely is where
 * the page lives. Correcting a pointer is not rewriting the record.
 *
 * The move from `doug-march.com` to `dougmar.ch` changed CANONICAL_ORIGIN
 * here. Nothing else about the host should need editing.
 */

/** Origins a URL in our own bytes may carry. Longest first: no origin may shadow another as a prefix. */
export const RECOGNIZED_ORIGINS = ['https://doug-march.com', 'https://dougmar.ch'].sort(
  (a, b) => b.length - a.length
)

/** The origin serving the site today. Change this, and only this, on cutover day. */
export const CANONICAL_ORIGIN = 'https://dougmar.ch'

/** Host portion of every recognized origin, for allowlists keyed on hostname. */
export const RECOGNIZED_HOSTS = RECOGNIZED_ORIGINS.map((o) => new URL(o).host)

/**
 * The recognized origin `value` begins with, or null.
 *
 * The boundary check is load-bearing. A bare `startsWith` matches any host that
 * merely BEGINS with ours, and the short new domain makes that likely rather
 * than theoretical: `'https://dougmar.church'.startsWith('https://dougmar.ch')`
 * is true, as is `'https://doug-march.com.evil.example'` against the old
 * origin. Either would be collapsed into the snapshot as though it were our
 * own page. An origin ends where a path, query, or fragment begins, so require
 * one of those or an exact match.
 *
 * @param {string} value
 * @returns {string | null}
 */
export function matchOrigin(value) {
  return (
    RECOGNIZED_ORIGINS.find(
      (o) =>
        value === o ||
        value.startsWith(`${o}/`) ||
        value.startsWith(`${o}?`) ||
        value.startsWith(`${o}#`)
    ) ?? null
  )
}
