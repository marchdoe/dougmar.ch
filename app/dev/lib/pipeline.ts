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
  /** Whether this phase gets the Claude-progress estimate bar (ProgressSection). */
  estimated?: boolean
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
 * The legacy tracker's six phases, each advanced by a line of pipeline log
 * prose. Kept only as a fallback for a stream that carries no `[phase]`
 * events at all — an old, already-finished run's buffered log, or a log from
 * before the pipeline emitted them. A live run always emits phase events
 * (see PHASE_ORDER / advanceFromEvent below), which drive the tracker
 * instead once the first one arrives (#227).
 */
export function makePhases(): Phase[] {
  return [
    { label: 'Collect signals', pattern: 'Stage 1: Collect', status: 'pending' },
    { label: 'Interpret signals', pattern: 'Stage 2: Interpret', status: 'pending' },
    { label: 'Read context', pattern: '[1/4] Reading site context', status: 'pending' },
    {
      label: 'Claude designing',
      pattern: 'calling claude CLI',
      status: 'pending',
      estimated: true,
    },
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

// ── Structured phase events (#227) ──────────────────────────────────────────
//
// The pipeline prints one `[phase] {"phase":"...","status":"..."}` line per
// phase transition (scripts/pipeline/phase-events.js), which
// app/dev-server/pipeline-runner.ts forwards over SSE as `{ type: 'phase' }`
// events. This is the real phase list, in run order, sourced from where each
// name is actually emitted: `collect-signals` and `collect-references` from
// scripts/run-pipeline.js's stage runner, the rest from design-agents.js's
// runAgentSwarm as it runs each scripts/pipeline/*.js phase in turn.

/** One `[phase]` line, as parsed by pipeline-runner.ts. */
export interface PhaseEvent {
  phase: string
  status: 'start' | 'done' | 'error'
  error?: string
}

/** id must match the `phase` string scripts/pipeline/phase-events.js emits. */
const PHASE_ORDER: ReadonlyArray<{ id: string; label: string; estimated?: boolean }> = [
  { id: 'collect-signals', label: 'Collect signals' },
  { id: 'collect-references', label: 'Collect references' },
  { id: 'context', label: 'Read context' },
  { id: 'art-director', label: 'Art direction', estimated: true },
  { id: 'mockup', label: 'Mockup design', estimated: true },
  { id: 'engineer', label: 'Engineering', estimated: true },
  { id: 'build', label: 'Build & validate' },
  { id: 'gate', label: 'Gate & critique' },
  { id: 'archive', label: 'Archive & done' },
]

/** The event-driven tracker's phases, all pending — swapped in on the first `[phase]` event a run's stream carries. */
export function makeEventPhases(): Phase[] {
  return PHASE_ORDER.map(({ label, estimated }) => ({
    label,
    pattern: '',
    status: 'pending' as PhaseStatus,
    ...(estimated ? { estimated: true } : {}),
  }))
}

/**
 * Advance the event-driven tracker on one `[phase]` event. `start` activates
 * that phase and finishes every earlier one (a phase event array is never
 * out of order, but collect-references can be skipped by a throw it
 * recovers from, so this mirrors advancePhases's "finish anything earlier"
 * rule rather than assuming the previous phase already reported done).
 * `done` and `error` both finish the phase — `error` still finishes it so
 * the tracker doesn't sit forever on a phase whose run just failed. A phase
 * id this tracker doesn't recognise (pipeline code newer than this list) is
 * ignored rather than thrown on.
 */
export function advanceFromEvent(prev: Phase[], event: PhaseEvent, now: number): Phase[] {
  const idx = PHASE_ORDER.findIndex((p) => p.id === event.phase)
  if (idx === -1) return prev
  if (event.status === 'start') {
    return prev.map((p, i) => {
      if (i < idx) return p.status !== 'done' ? finish(p, now) : p
      if (i === idx) return { ...p, status: 'active', startedAt: p.startedAt ?? now }
      return p
    })
  }
  return prev.map((p, i) => (i === idx ? finish(p, now) : p))
}
