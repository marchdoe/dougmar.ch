import { isRecord } from '../lib/guards'
import type { ArchiveEntry } from '../server/archive-impl'

// The panel's side of the dev API, typed and checked at the boundary.
//
// dev-panel.tsx assigned `data.signals`, `data.archive` and `data.meta`
// straight out of `any` (#227). A server change that renamed a field compiled
// on both sides and failed in the browser. These read the response through a
// guard so a bad shape is an error with a message, not `undefined.length`.

export type Signals = Record<string, unknown> & {
  date?: string
  mood_override?: string | null
  notes?: string | null
}

export interface MetaSource {
  status: string
  source?: string
  latency_ms: number
  items?: number
  reason?: string
}

export interface Meta {
  collected_at: string
  duration_ms: number
  providers_total: number
  providers_ok: number
  providers_failed: number
  sources: Record<string, MetaSource>
}

export interface DevData {
  signals: Signals | null
  archive: ArchiveEntry[]
  meta: Meta | null
}

function asDevData(raw: unknown): DevData {
  if (!isRecord(raw)) throw new Error('dev-data: response is not an object')
  const { signals, archive, meta } = raw
  if (signals !== null && !isRecord(signals)) throw new Error('dev-data: signals is not an object')
  if (!Array.isArray(archive)) throw new Error('dev-data: archive is not an array')
  if (meta !== null && meta !== undefined && !isRecord(meta)) {
    throw new Error('dev-data: meta is not an object')
  }
  return {
    signals: (signals as Signals | null) ?? null,
    archive: archive as ArchiveEntry[],
    meta: (meta as Meta | undefined) ?? null,
  }
}

async function readJson(resp: Response): Promise<unknown> {
  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`${resp.status} ${resp.statusText}${text ? `: ${text.slice(0, 200)}` : ''}`)
  }
  return resp.json()
}

export async function fetchDevData(): Promise<DevData> {
  return asDevData(await readJson(await fetch('/api/dev-data')))
}

export async function collectSignals(): Promise<void> {
  await readJson(await fetch('/api/collect-signals'))
}

export async function saveOverrides(body: {
  moodOverride: string | null
  notes: string | null
}): Promise<void> {
  await readJson(
    await fetch('/api/dev-overrides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

/** Start a run. Resolves to an error message on refusal, null on success. */
export async function startPipeline(body: {
  dryRun: boolean
  mock: boolean
  weights: unknown
}): Promise<string | null> {
  const resp = await fetch('/api/pipeline/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (resp.ok) return null
  const data = (await resp.json().catch(() => null)) as { error?: string } | null
  return data?.error ?? 'Failed to start pipeline'
}
