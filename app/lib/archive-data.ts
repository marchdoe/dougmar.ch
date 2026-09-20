import { isArchiveDate } from '../server/archive-paths'
import { isArchiveDetail } from '../types/archive-record'
import type { ArchiveDetail, ArchiveIndexEntry } from '../types/archive-record'
import { isRecord } from './guards'

/**
 * Reads the build's projection of the archive, `public/archive-data/*.json`.
 *
 * A source maps a file name to its parsed JSON and throws when it cannot. The
 * browser's source is `fetch`. The prerender has no origin to fetch from, so
 * the route passes it a source that reads the file off disk
 * (app/lib/archive-source.ts). Whatever a source returns is `unknown` until
 * a guard here says otherwise.
 */
export type ArchiveSource = (file: string) => Promise<unknown>

export const fetchArchiveFile: ArchiveSource = async (file) => {
  const res = await fetch(`/archive-data/${file}`)
  if (!res.ok) throw new Error(`Failed to load archive (${res.status})`)
  return res.json()
}

export function isArchiveIndex(value: unknown): value is ArchiveIndexEntry[] {
  return Array.isArray(value) && value.every((e) => isRecord(e) && typeof e.date === 'string')
}

/** The archive index. Throws when the file is missing or is not an index. */
export async function loadArchiveIndex(
  source: ArchiveSource = fetchArchiveFile
): Promise<ArchiveIndexEntry[]> {
  const data = await source('index.json')
  if (!isArchiveIndex(data)) throw new Error('archive index was not the expected shape')
  return data
}

/**
 * One day's record, or null when there is none to show: the date is malformed,
 * the file is absent or unreadable, or it is not a record. A missing day is an
 * ordinary answer here, not an error, so nothing in this function throws.
 */
export async function loadArchiveDetail(
  date: string,
  source: ArchiveSource = fetchArchiveFile
): Promise<ArchiveDetail | null> {
  if (!isArchiveDate(date)) return null
  try {
    const data = await source(`${date}.json`)
    return isArchiveDetail(data) ? data : null
  } catch {
    return null
  }
}
