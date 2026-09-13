/**
 * How many designs the archive holds.
 *
 * Feeds the {{ARCHIVE_COUNT}} placeholder in __root.tsx.template, so every
 * nightly build carries a link reading "Archive · <n> designs".
 *
 * Counts date directories under `archive/` rather than reading
 * public/archive/_data.json, which is regenerated at build time and is stale
 * whenever the pipeline has run more recently than the last deploy.
 */
import { readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

export const ARCHIVE_DIR = resolve(process.cwd(), 'archive')

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
