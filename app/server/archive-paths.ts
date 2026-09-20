// app/server/archive-paths.ts
// The shapes an archive path segment is allowed to have. A date, build id or
// build directory name reaches the filesystem only after it matches one of
// these, checked in the impls as well as at the server-function boundary so a
// direct caller cannot traverse out of the archive (#218). Import the patterns
// from here instead of writing them out again (#331); api/panel/rate.ts does.

/** A date directory: exactly `YYYY-MM-DD`, nothing that can traverse. */
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** A build id: the epoch-ms timestamp in `build-<id>`. */
export const BUILD_ID_RE = /^\d+$/

/**
 * A shipped build directory. `startsWith('build-')` also matches
 * `build-failed-*` and `build-pre-*`, which are diagnostic and snapshot temp
 * dirs — never the bytes that shipped.
 */
export const BUILD_DIR_RE = /^build-\d+$/

/**
 * DATE_RE and BUILD_DIR_RE, unanchored, for embedding inside a larger regex —
 * a URL path with segments either side, a redirect route — rather than
 * testing a standalone string. `dev-server/archive-preview.ts` and
 * `dev-server/archive-static.ts` build their route regexes from these instead
 * of spelling `\d{4}-\d{2}-\d{2}` out again (#331).
 */
export const DATE_FRAGMENT = DATE_RE.source.slice(1, -1)
export const BUILD_DIR_FRAGMENT = BUILD_DIR_RE.source.slice(1, -1)

export function isArchiveDate(value: unknown): value is string {
  return typeof value === 'string' && DATE_RE.test(value)
}

export function isBuildId(value: unknown): value is string {
  return typeof value === 'string' && BUILD_ID_RE.test(value)
}
