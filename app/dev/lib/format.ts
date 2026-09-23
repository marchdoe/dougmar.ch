/** A phase or run duration: `850ms`, `12.4s`, `2m 5s`. */
export function fmtDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const mins = Math.floor(ms / 60000)
  const secs = Math.round((ms % 60000) / 1000)
  return `${mins}m ${secs}s`
}

/** The run clock: `m:ss`. */
export function fmtElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const mins = Math.floor(totalSec / 60)
  const secs = totalSec % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/** A trace step's duration: `250ms`, `1.5s`, `2.1m`. */
export function fmtStepDuration(ms: number): string {
  if (ms > 60000) return `${(ms / 60000).toFixed(1)}m`
  if (ms > 1000) return `${(ms / 1000).toFixed(1)}s`
  return `${ms}ms`
}
