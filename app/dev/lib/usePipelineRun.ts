import type { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchDevData, startPipeline } from '../api'
import type { ArchiveEntry } from '../../server/archive'
import {
  COOLDOWN_SECONDS,
  type PanelWeights,
  type Phase,
  type PhaseEvent,
  type PipelineStatus,
  type RunResult,
  type TraceStep,
  advanceFromEvent,
  advancePhases,
  attemptNumber,
  briefFrom,
  completePhases,
  isAttemptLine,
  makeEventPhases,
  makePhases,
  restartAttempt,
} from './pipeline'

const START_KEY = 'pipeline-start-time'
const MAX_RECONNECT_ATTEMPTS = 5

type StreamEvent =
  | { type: 'log'; line: string }
  | { type: 'trace'; step: TraceStep }
  | ({ type: 'phase' } & PhaseEvent)
  | { type: 'done'; success: boolean; error?: string }

function readStart(): string | null {
  try {
    return sessionStorage.getItem(START_KEY)
  } catch {
    return null
  }
}

function writeStart(value: number | null) {
  try {
    if (value === null) sessionStorage.removeItem(START_KEY)
    else sessionStorage.setItem(START_KEY, String(value))
  } catch {}
}

type SetPhases = Dispatch<SetStateAction<Phase[]>>

/**
 * Apply one `[phase]` event to the tracker: on the first one a run's stream
 * carries, swap from the legacy prose phase list to the event-driven one,
 * then advance it. Pulled out of the SSE handler so that handler's own
 * branching stays flat (#227).
 */
function applyPhaseEvent(
  event: PhaseEvent,
  usingEventsRef: MutableRefObject<boolean>,
  setPhases: SetPhases
) {
  if (!usingEventsRef.current) {
    usingEventsRef.current = true
    setPhases(makeEventPhases())
  }
  setPhases((prev) => advanceFromEvent(prev, event, Date.now()))
}

/**
 * Apply one log line to the legacy prose tracker — only called while no
 * phase event has arrived yet for this run (see usingEventsRef).
 */
function applyProseLine(
  line: string,
  setPhases: SetPhases,
  setAttemptNum: Dispatch<SetStateAction<number>>
) {
  const now = Date.now()
  if (isAttemptLine(line)) {
    const n = attemptNumber(line)
    if (n !== null) setAttemptNum(n)
    setPhases((prev) => restartAttempt(prev, now))
    return
  }
  setPhases((prev) => advancePhases(prev, line, now))
}

/**
 * A pipeline run as the panel sees it: the POST that starts it, the SSE stream
 * that reports it, the phase tracker, the elapsed and cooldown timers, and the
 * reconnect that picks a run back up after an HMR reload. Every timer and the
 * EventSource are released on unmount.
 *
 * `onArchive` receives the refreshed archive listing after a successful run.
 */
export function usePipelineRun(onArchive: (archive: ArchiveEntry[]) => void) {
  const [status, setStatus] = useState<PipelineStatus>('idle')
  const [dryRun, setDryRun] = useState(false)
  // risk starts null — unset, so design-agents.js derives it 3-10 from the
  // build date rather than sending the same prompt sentence every run.
  const [weights, setWeights] = useState<PanelWeights>({
    signals: 5,
    inspiration: 5,
    ratings: 5,
    risk: null,
  })
  const [phases, setPhases] = useState<Phase[]>(makePhases())
  const [logLines, setLogLines] = useState<string[]>([])
  const logAccumRef = useRef<string[]>([])
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([])
  const traceAccumRef = useRef<TraceStep[]>([])
  const esRef = useRef<EventSource | null>(null)
  const logEndRef = useRef<HTMLDivElement>(null)
  const [attemptNum, setAttemptNum] = useState(1)
  const [result, setResult] = useState<RunResult | null>(null)

  const [elapsedMs, setElapsedMs] = useState(0)
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [cooldownLeft, setCooldownLeft] = useState(0)
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const runRef = useRef<() => Promise<void>>(async () => {})

  const reconnectAttemptsRef = useRef(0)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Whether this run's stream has carried a `[phase]` event yet. Once it
  // has, the tracker is driven by those events, not by matching log prose —
  // the events say so directly, so there's nothing left to infer. Stays
  // false for a stream that carries none at all (an old run's buffered log,
  // from before the pipeline emitted them), which keeps the prose tracker
  // running for the whole run instead of freezing partway through.
  const usingEventsRef = useRef(false)

  const onArchiveRef = useRef(onArchive)
  onArchiveRef.current = onArchive

  // ── Cleanup ────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      esRef.current?.close()
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current)
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
    }
  }, [])

  // ── Auto-scroll log pane ──────────────────────────────────────────────────
  // biome-ignore lint/correctness/useExhaustiveDependencies: logLines is the intended re-run trigger even though its value isn't read here.
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logLines])

  const startElapsedTimer = useCallback((startTime: number) => {
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
    elapsedTimerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTime)
    }, 250)
  }, [])

  // ── Start cooldown ────────────────────────────────────────────────────────
  // "RUN AGAIN IN 10s" counts down and then runs. The countdown used to end
  // in 'idle' and nothing started (#329). The run is redefined every render,
  // so the interval reads it through a ref rather than closing over a stale one.
  const startCooldown = useCallback(() => {
    setCooldownLeft(COOLDOWN_SECONDS)
    setStatus('cooldown')
    cooldownTimerRef.current = setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current)
          void runRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // ── SSE stream handler — shared by initial run and reconnect ─────────────
  const connectToStream = useCallback((startTime: number) => {
    const es = new EventSource('/api/pipeline')
    esRef.current = es

    es.onmessage = (e) => {
      // Reset reconnect counter on successful message
      reconnectAttemptsRef.current = 0
      let event: StreamEvent
      try {
        event = JSON.parse(e.data)
      } catch {
        // A truncated frame is a log line nobody can read, not a crash.
        return
      }

      if (event.type === 'trace') {
        traceAccumRef.current.push(event.step)
        setTraceSteps([...traceAccumRef.current])
        return
      }

      if (event.type === 'phase') {
        applyPhaseEvent(event, usingEventsRef, setPhases)
        return
      }

      if (event.type === 'log') {
        logAccumRef.current.push(event.line)
        setLogLines([...logAccumRef.current])
        // Once phase events have arrived, they alone drive the tracker —
        // log prose is still shown in the log pane, just no longer read for
        // phase progress.
        if (!usingEventsRef.current) applyProseLine(event.line, setPhases, setAttemptNum)
      }

      if (event.type === 'done') {
        es.close()
        const totalMs = Date.now() - startTime
        if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
        setElapsedMs(totalMs)
        // Persist completion so HMR reload shows result
        writeStart(null)

        if (event.success) {
          setPhases((prev) => completePhases(prev, Date.now()))
          const timestamp = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
          setStatus('success')
          setResult({ brief: briefFrom(logAccumRef.current), timestamp, totalMs })
          fetchDevData()
            .then((data) => onArchiveRef.current(data.archive))
            .catch(() => {})
          // Rating state is fresh per build — SuccessSection starts with empty state by default
        } else {
          setStatus('error')
          setResult({ error: event.error ?? 'Unknown error', totalMs })
        }
      }
    }

    es.onerror = () => {
      es.close()
      reconnectAttemptsRef.current += 1

      // On HMR-triggered reconnect, try reconnecting to a still-running pipeline
      // instead of immediately reporting an error (max 5 attempts)
      if (reconnectAttemptsRef.current <= MAX_RECONNECT_ATTEMPTS) {
        reconnectTimerRef.current = setTimeout(() => {
          const savedStart = readStart()
          if (savedStart) connectToStream(Number(savedStart))
        }, 1000)
      } else {
        // Exhausted retries — clean up and show error
        reconnectAttemptsRef.current = 0
        if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
        writeStart(null)
        setStatus('error')
        setResult({ error: 'Lost connection to pipeline (server may be down)', totalMs: 0 })
      }
    }
  }, [])

  // ── Reconnect on mount if pipeline was running before HMR ────────────────
  useEffect(() => {
    const savedStart = readStart()
    if (savedStart) {
      const startTime = Number(savedStart)
      setStatus('running')
      setPhases(makePhases())
      usingEventsRef.current = false
      logAccumRef.current = []
      // The SSE stream replays the full buffered event log (trace included)
      // on reconnect, so start from empty to avoid duplicate steps.
      traceAccumRef.current = []
      setTraceSteps([])
      startElapsedTimer(startTime)
      connectToStream(startTime)
    }
  }, [connectToStream, startElapsedTimer])

  // ── Run pipeline ──────────────────────────────────────────────────────────
  const run = async () => {
    const startTime = Date.now()
    setStatus('running')
    setPhases(makePhases())
    usingEventsRef.current = false
    setLogLines([])
    logAccumRef.current = []
    setTraceSteps([])
    traceAccumRef.current = []
    setAttemptNum(1)
    setResult(null)
    setElapsedMs(0)

    // Persist start time so we can reconnect after HMR reloads
    writeStart(startTime)
    // Start elapsed timer (ticks every 250ms for smooth display)
    startElapsedTimer(startTime)

    // Launch the pipeline via POST, then connect to SSE stream. A refusal
    // and a thrown fetch end the same way: the run never started, so
    // nothing may be left claiming that it did.
    const abandon = (error: string) => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
      writeStart(null)
      setStatus('error')
      setResult({ error, totalMs: 0 })
    }
    let refusal: string | null
    try {
      refusal = await startPipeline({ dryRun, mock: true, weights })
    } catch (err: unknown) {
      abandon(err instanceof Error ? err.message : 'Failed to start pipeline')
      return
    }
    if (refusal) {
      abandon(refusal)
      return
    }

    connectToStream(startTime)
  }

  runRef.current = run

  return {
    status,
    isRunDisabled: status === 'running' || status === 'cooldown',
    dryRun,
    setDryRun,
    weights,
    setWeights,
    phases,
    logLines,
    logEndRef,
    traceSteps,
    attemptNum,
    result,
    elapsedMs,
    cooldownLeft,
    run,
    startCooldown,
  }
}

export type PipelineRun = ReturnType<typeof usePipelineRun>
