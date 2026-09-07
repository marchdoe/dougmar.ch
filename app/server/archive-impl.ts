// app/server/archive-impl.ts
// Pure implementation — no server function wrappers, safe to import in tests
import { readdirSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import type { ArchiveRecord } from '../types/archive-record'
import type { Weights } from '../types/panel'
import { BUILD_DIR_RE, DATE_RE, isArchiveDate, isBuildId } from './archive-paths'
import { isRecord, readJson } from './read-json'

export const ARCHIVE_PATH = resolve(process.cwd(), 'archive')

/**
 * One archived build as the dev panel's archive listing shows it: a record
 * with `brief` coerced to `''` rather than `null` (the panel renders it
 * straight into JSX) and two build-time fields the canonical `record.json`
 * doesn't carry — `timestamp` and `weights` live in that build's own
 * `build.json`. `dev-server/dev-data.ts`'s `readArchiveListing` is the one
 * place that builds these; `_readArchiveHandler` below returns the plain
 * `ArchiveRecord`s everything else (the production archive route, the
 * calendar) reads (#331 — this used to be a second, differently-shaped
 * `ArchiveEntry` declared in dev-data.ts).
 */
export type ArchiveEntry = Omit<ArchiveRecord, 'brief'> & {
  brief: string
  timestamp?: number
  weights?: Weights
}

/**
 * Read one day's record. The pipeline writes it at build time and
 * `scripts/backfill-archive-records.js` rebuilds history, so a date without one
 * is a date whose artifacts never produced a record — it is skipped rather than
 * re-derived here. Nothing in the app parses `brief.md` prose any more.
 */
function isArchiveRecord(value: unknown): value is ArchiveRecord {
  return isRecord(value) && isArchiveDate(value.date)
}

export function _readArchiveRecord(date: string, archivePath = ARCHIVE_PATH): ArchiveRecord | null {
  // Validate here, not only in archive.ts's inputValidator. This function is
  // exported and called directly (by _readArchiveDetail, by tests, and by the
  // Vite dev middleware), so a guard that lives only at the server-fn boundary
  // is a guard most callers never pass through.
  if (!isArchiveDate(date)) return null
  return readJson(join(archivePath, date, 'record.json'), isArchiveRecord)
}

export function _readArchiveHandler(archivePath = ARCHIVE_PATH): ArchiveRecord[] {
  if (!existsSync(archivePath)) return []

  return readdirSync(archivePath, { withFileTypes: true })
    .filter((d) => d.isDirectory() && DATE_RE.test(d.name))
    .map((d) => _readArchiveRecord(d.name, archivePath))
    .filter((r): r is ArchiveRecord => r !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export interface ResponsiveChecks {
  horizontalScroll?: boolean
  clippedElements?: Array<{ tag: string; text: string; right: number }>
  headerOverlap?: Array<{ a: string; b: string }>
  bodyTextSize?: { min: number | null; passing: boolean }
  tapTargetFailures?: Array<{ tag: string; text: string; w: number; h: number }>
  lineLengthFailures?: Array<{ chars: number; lines: number; avgPerLine: number; excerpt: string }>
}

export interface ResponsiveMetrics {
  buildId: string
  date: string
  archetype: string | null
  overallScore: number
  worstFailure: { viewport: string; check: string; detail: string } | null
  viewports: Record<
    string,
    {
      width: number
      height: number
      score: number
      checks: ResponsiveChecks
    }
  >
}

/**
 * Read responsive-metrics.json for a given build. Returns null if missing or unparseable.
 */
function isResponsiveMetrics(value: unknown): value is ResponsiveMetrics {
  return isRecord(value) && typeof value.buildId === 'string' && isRecord(value.viewports)
}

export function _readResponsiveMetrics(
  date: string,
  buildId: string,
  archivePath = ARCHIVE_PATH
): ResponsiveMetrics | null {
  if (!isArchiveDate(date) || !isBuildId(buildId)) return null
  return readJson(
    join(archivePath, date, `build-${buildId}`, 'responsive-metrics.json'),
    isResponsiveMetrics
  )
}

/**
 * Read recent responsive-metrics.json files across archive dirs.
 * Returned newest-first (by date desc, then buildId desc), limited to `limit`.
 */
export function _readResponsiveHistory(
  limit = 30,
  archivePath = ARCHIVE_PATH
): ResponsiveMetrics[] {
  if (!existsSync(archivePath)) return []

  const dates = readdirSync(archivePath)
    .filter((d) => DATE_RE.test(d))
    .sort()
    .reverse()

  const out: ResponsiveMetrics[] = []
  for (const date of dates) {
    const dateDir = join(archivePath, date)
    let builds: string[]
    try {
      // `startsWith('build-')` also matched build-failed-* and build-pre-*,
      // so the history could report metrics from a build that never shipped.
      builds = readdirSync(dateDir).filter((b) => BUILD_DIR_RE.test(b))
    } catch {
      continue
    }
    builds.sort().reverse()
    for (const b of builds) {
      const metrics = readJson(join(dateDir, b, 'responsive-metrics.json'), isResponsiveMetrics)
      if (!metrics) continue
      out.push(metrics)
      if (out.length >= limit) return out
    }
  }
  return out
}
