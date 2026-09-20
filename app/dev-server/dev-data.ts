import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join, resolve } from 'node:path'
import * as yaml from 'js-yaml'
import { _readArchiveHandler } from '../server/archive-impl'
import type { ArchiveEntry } from '../server/archive-impl'
import { isRecord } from '../lib/guards'
import { readJson } from '../server/read-json'
import { _readSignalsHandler } from '../server/signals-impl'
import type { ArchiveRecord } from '../types/archive-record'
import type { Weights } from '../types/panel'
import { guardRequest, sendJson } from './guards'

// GET /api/dev-data — today's signals, the archive listing, and collection meta.

function isBuildMeta(value: unknown): value is { timestamp?: number; weights?: Weights } {
  return isRecord(value)
}

/**
 * The one field record.json doesn't carry that the panel wants: the
 * timestamp and weight overrides a build ran with, written to that build's
 * own `build.json`. Best-effort — an entry with no build.json (a legacy
 * date-only entry, or one written before build.json's day) comes back
 * unchanged.
 */
function withBuildMeta(entry: ArchiveEntry, archiveDir: string): ArchiveEntry {
  if (!entry.buildId) return entry
  const meta = readJson(
    join(archiveDir, entry.date, `build-${entry.buildId}`, 'build.json'),
    isBuildMeta
  )
  if (!meta) return entry
  return { ...entry, timestamp: meta.timestamp, weights: meta.weights }
}

/**
 * Archive listing for the dev panel: `_readArchiveHandler`'s own per-date
 * records (#331 — this used to re-walk archive/ and re-parse brief.md itself,
 * disagreeing with archive-record.js on a build with a rationale and no
 * `## Files Changed`), enriched with the build-time metadata only build.json
 * carries.
 */
export function readArchiveListing(archiveDir: string): ArchiveEntry[] {
  return _readArchiveHandler(archiveDir).map((record: ArchiveRecord) =>
    withBuildMeta({ ...record, brief: record.brief ?? '' }, archiveDir)
  )
}

export function devDataHandler(req: IncomingMessage, res: ServerResponse): void {
  if (!guardRequest(req, res)) return
  try {
    const signalsPath = resolve('signals/today.yml')

    // Auto-collect signals if today.yml doesn't exist. spawnSync (no shell)
    // with a 15s timeout blocks the first request (~1s typically) but only
    // fires once — after that the file exists and this path is skipped.
    if (!existsSync(signalsPath)) {
      console.log('[dev-data] today.yml missing — auto-collecting signals...')
      const result = spawnSync('node', [resolve('scripts/collect-signals.js')], {
        cwd: resolve('.'),
        timeout: 15000,
        stdio: 'inherit',
      })
      if (result.status !== 0) {
        console.error('[dev-data] auto-collect failed (exit code %d)', result.status)
      }
    }

    const signals = existsSync(signalsPath) ? _readSignalsHandler(signalsPath) : null
    const archive = readArchiveListing(resolve('archive'))

    const metaPath = resolve('signals/today.meta.yml')
    const meta = existsSync(metaPath)
      ? (yaml.load(readFileSync(metaPath, 'utf8')) as Record<string, unknown>)
      : null

    sendJson(res, 200, { signals, archive, meta })
  } catch (err) {
    sendJson(res, 500, { error: String(err) })
  }
}
