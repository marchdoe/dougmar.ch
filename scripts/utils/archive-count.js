/**
 * How many designs the archive holds, and which one came last.
 *
 * `countArchivedDesigns` feeds the {{ARCHIVE_COUNT}} placeholder in
 * __root.tsx.template, so every nightly build carries a link reading
 * "Archive · <n> designs". It counts date directories under `archive/` rather
 * than reading public/archive/_data.json, which is regenerated at build time
 * and is stale whenever the pipeline has run more recently than the last
 * deploy.
 *
 * `latestArchivedDateBefore` feeds {{PREV_DATE}}, the live rail's `‹` (#702).
 */
import { readdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

export const ARCHIVE_DIR = resolve(process.cwd(), 'archive')
export const SNAPSHOT_DIR = resolve(process.cwd(), 'public', 'archive')

const DATE_DIR = /^\d{4}-\d{2}-\d{2}$/

/**
 * @param {string} [archivePath]
 * @returns {number} count of archived dates, 0 if the directory is absent
 */
export function countArchivedDesigns(archivePath = ARCHIVE_DIR) {
  if (!existsSync(archivePath)) return 0
  try {
    return readdirSync(archivePath, { withFileTypes: true }).filter(
      (d) => d.isDirectory() && DATE_DIR.test(d.name)
    ).length
  } catch {
    return 0
  }
}

/**
 * The newest captured design dated before `date`, or null when there is none.
 *
 * Reads the snapshots under `public/archive/`, not the records under
 * `archive/`. The live rail links `‹` to `/archive/<date>/`, which is served
 * from a snapshot, and three prose-era days have a record and no captured
 * pages: a link to one of those is a 404. A directory counts when it holds an
 * `index.html`, which is the page that URL serves.
 *
 * "Before" is strict, so the night's own snapshot, written by `archive()`
 * after __root.tsx is first rendered and present when the archive phase
 * renders it again, is never its own previous design.
 *
 * @param {string} date YYYY-MM-DD, the design the rail sits on
 * @param {string} [snapshotPath]
 * @returns {string|null}
 */
export function latestArchivedDateBefore(date, snapshotPath = SNAPSHOT_DIR) {
  if (!DATE_DIR.test(date ?? '')) throw new Error(`expected a YYYY-MM-DD date, got: ${date}`)
  if (!existsSync(snapshotPath)) return null
  let entries
  try {
    entries = readdirSync(snapshotPath, { withFileTypes: true })
  } catch {
    return null
  }
  const earlier = entries
    .filter(
      (d) =>
        d.isDirectory() &&
        DATE_DIR.test(d.name) &&
        d.name < date &&
        existsSync(join(snapshotPath, d.name, 'index.html'))
    )
    .map((d) => d.name)
    .sort()
  return earlier.at(-1) ?? null
}
