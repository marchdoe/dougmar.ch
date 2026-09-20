import type { Grade, PanelStatus, RatingIssue, RunInfo, Weights } from '../../types/panel'

export type { Grade, PanelStatus, RatingIssue, RunInfo, Weights }

export interface RatingSubmission {
  date: string
  grade: Grade
  worked: string
  didnt: string
  try: string
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...(init?.body ? { 'content-type': 'application/json' } : {}), ...init?.headers },
  })
  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error ?? `Request failed (${res.status})`
    throw new Error(message)
  }
  return data as T
}

function isPanelStatus(value: unknown): value is PanelStatus {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    Array.isArray(v.unrated) &&
    'weights' in v &&
    typeof v.weights === 'object' &&
    typeof v.errors === 'object' &&
    v.errors !== null
  )
}

/**
 * The one response the panel destructures on first paint, so a shape it does
 * not expect crashes the page rather than showing an error. Checked here
 * instead of trusting `data as T`.
 */
export const fetchStatus = async (): Promise<PanelStatus> => {
  const data = await request<unknown>('/api/panel/status')
  if (!isPanelStatus(data)) throw new Error('Panel status response was not the expected shape')
  return data
}
export const submitRating = (r: RatingSubmission) =>
  request<{ ok: true; issueUrl: string }>('/api/panel/rate', {
    method: 'POST',
    body: JSON.stringify(r),
  })
export const saveWeights = (w: Weights) =>
  request<{ ok: true }>('/api/panel/weights', { method: 'PUT', body: JSON.stringify(w) })
export const triggerRun = (dryRun: boolean) =>
  request<{ ok: true }>('/api/panel/run', {
    method: 'POST',
    body: JSON.stringify({ dry_run: dryRun }),
  })
