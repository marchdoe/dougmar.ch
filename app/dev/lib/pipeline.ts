// The panel's model of a pipeline run: the pane names, the run's status, and
// the phase tracker. Pure functions only, so the tracker's rules can be tested
// without a stream.

/**
 * One step of the pipeline trace, as emitted on the SSE stream ({ type:
 * 'trace', step }) and persisted in each build's trace.json.
 */
export interface TraceStep {
  name: string
  phase: number
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  durationMs?: number
}

export type PipelineStatus = 'idle' | 'running' | 'success' | 'error' | 'cooldown'

export type PhaseStatus = 'pending' | 'active' | 'done'

export interface Phase {
  label: string
  pattern: string
  status: PhaseStatus
  startedAt?: number
  finishedAt?: number
  durationMs?: number
}

export interface RunResult {
  brief?: string
  timestamp?: string
  error?: string
  totalMs?: number
}

/** `risk: null` means unset — the pipeline derives it from the build date. */
export type PanelWeights = {
  signals: number
  inspiration: number
  ratings: number
  risk: number | null
}

export type PaneName = 'pipeline' | 'archive' | 'inspector' | 'run'

const PANE_NAMES: readonly PaneName[] = ['pipeline', 'archive', 'inspector', 'run']

export function isPaneName(value: unknown): value is PaneName {
  return typeof value === 'string' && (PANE_NAMES as readonly string[]).includes(value)
}

export const COOLDOWN_SECONDS = 10

/**
 * The tracker's six phases, each advanced by a line of pipeline log prose.
 * This is a hidden contract with scripts/run-pipeline.js's output (#227).
 */
export function makePhases(): Phase[] {
  return [
    { label: 'Collect signals', pattern: 'Stage 1: Collect', status: 'pending' },
    { label: 'Interpret signals', pattern: 'Stage 2: Interpret', status: 'pending' },
    { label: 'Read context', pattern: '[1/4] Reading site context', status: 'pending' },
    { label: 'Claude designing', pattern: 'calling claude CLI', status: 'pending' },
    { label: 'Write & build', pattern: 'writing files', status: 'pending' },
    { label: 'Archive & done', pattern: '=== Build passed!', status: 'pending' },
  ]
}

function finish(p: Phase, now: number): Phase {
  return {
    ...p,
    status: 'done',
    finishedAt: now,
    durationMs: p.startedAt ? now - p.startedAt : undefined,
  }
}

/** Whether a log line starts a new attempt (`--- Attempt 2 of 3 ---`). */
export function isAttemptLine(line: string): boolean {
  return line.includes('--- Attempt')
}

/** The attempt number a line names, or null when it names none. */
export function attemptNumber(line: string): number | null {
  const match = line.match(/Attempt (\d+)/)
  return match ? Number(match[1]) : null
}

/**
 * A new attempt restarts the design half of the run: collect and interpret
 * stay done, "Read context" becomes active, and the rest go back to pending.
 */
export function restartAttempt(prev: Phase[], now: number): Phase[] {
  return prev.map((p, i) =>
    i < 2
      ? finish(p, now)
      : i === 2
        ? { ...p, status: 'active', startedAt: now }
        : { ...p, status: 'pending' }
  )
}

/**
 * Advance the tracker on one log line: the first phase whose pattern the line
 * contains becomes active, and every earlier phase is done. A line matching no
 * phase returns `prev` itself, so React skips the update.
 */
export function advancePhases(prev: Phase[], line: string, now: number): Phase[] {
  const matchIdx = prev.findIndex((p) => line.includes(p.pattern))
  if (matchIdx === -1) return prev
  return prev.map((p, i) => {
    if (i < matchIdx) return p.status !== 'done' ? finish(p, now) : p
    if (i === matchIdx) return { ...p, status: 'active', startedAt: p.startedAt ?? now }
    return p
  })
}

/** A successful run marks every phase done, keeping any timing already recorded. */
export function completePhases(prev: Phase[], now: number): Phase[] {
  return prev.map((p) => ({
    ...p,
    status: 'done' as const,
    finishedAt: p.finishedAt ?? now,
    durationMs: p.durationMs ?? (p.startedAt ? now - p.startedAt : undefined),
  }))
}

/** The design brief a run logged last, or the generic line when it logged none. */
export function briefFrom(lines: readonly string[]): string {
  const briefLine = [...lines].reverse().find((l) => l.includes('design_brief:'))
  return briefLine?.split('design_brief: ')[1] ?? 'Run complete'
}
