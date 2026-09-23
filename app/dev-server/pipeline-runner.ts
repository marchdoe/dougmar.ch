import { type ChildProcess, spawn } from 'node:child_process'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import type { Weights } from '../types/panel'
import { guardRequest, readBodyLimited, sendJson } from './guards'

// The pipeline runner behind the panel's Run button.
//
// Process state lives in the Vite server, not in any one SSE connection, so
// Vite HMR (triggered when agents write files) reloads the page without
// killing the pipeline: the client reconnects and the stream replays what it
// missed.

type PhaseEventStatus = 'start' | 'done' | 'error'

export type PipelineEvent =
  | { type: 'log'; line: string }
  | { type: 'trace'; step: unknown }
  | { type: 'phase'; phase: string; status: PhaseEventStatus; error?: string }
  | { type: 'done'; success: boolean; error?: string }

interface StartRequest {
  dryRun?: boolean
  mock?: boolean
  weights?: Partial<Weights>
}

const PHASE_EVENT_STATUSES: ReadonlySet<string> = new Set(['start', 'done', 'error'])

/** Reads a `[phase] {json}` line into a typed event, or null if it isn't one. */
function parsePhaseLine(line: string): PipelineEvent | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(line.slice('[phase] '.length))
  } catch {
    return null
  }
  if (
    !parsed ||
    typeof parsed !== 'object' ||
    typeof (parsed as { phase?: unknown }).phase !== 'string' ||
    !PHASE_EVENT_STATUSES.has((parsed as { status?: unknown }).status as string)
  ) {
    return null
  }
  const { phase, status, error } = parsed as {
    phase: string
    status: PhaseEventStatus
    error?: unknown
  }
  return { type: 'phase', phase, status, ...(typeof error === 'string' ? { error } : {}) }
}

/**
 * Split a chunk of child output into events. `[TRACE] {json}` lines are
 * structured trace steps; `[phase] {json}` lines are structured phase
 * transitions (#227, scripts/pipeline/phase-events.js) — everything else,
 * including a line that starts with either prefix but isn't valid JSON in
 * the expected shape, is an ordinary log line.
 */
export function eventsFromChunk(chunk: string): PipelineEvent[] {
  const out: PipelineEvent[] = []
  for (const line of chunk.split('\n')) {
    if (!line.trim()) continue
    if (line.startsWith('[TRACE] ')) {
      try {
        out.push({ type: 'trace', step: JSON.parse(line.slice('[TRACE] '.length)) })
        continue
      } catch {
        /* not JSON after all — it is a log line */
      }
    }
    if (line.startsWith('[phase] ')) {
      const event = parsePhaseLine(line)
      if (event) {
        out.push(event)
        continue
      }
    }
    out.push({ type: 'log', line })
  }
  return out
}

/**
 * `weights` comes from `JSON.parse`d request body, cast to `Partial<Weights>`
 * without any runtime check — a value can be any JSON type. This is the same
 * integer/0-10 check `api/panel/weights.ts` applies to the production write
 * path; anything that fails it is treated as unset rather than forwarded.
 */
function validWeight(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 10 ? v : undefined
}

/**
 * The environment a run gets. `WEIGHT_RISK` is the empty string when unset,
 * not a number: design-agents.js treats '' as unset and derives risk from the
 * build date. A literal here would pin it. Mock runs never see the API key.
 */
export function pipelineEnv(
  base: NodeJS.ProcessEnv,
  { dryRun = false, mock = true, weights = {} }: StartRequest
): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...base,
    DRY_RUN: dryRun ? 'true' : 'false',
    MOCK_MODE: mock ? 'true' : 'false',
    WEIGHT_SIGNALS: String(validWeight(weights.signals) ?? 5),
    WEIGHT_INSPIRATION: String(validWeight(weights.inspiration) ?? 5),
    WEIGHT_RATINGS: String(validWeight(weights.ratings) ?? 5),
    WEIGHT_RISK: weights.risk == null ? '' : String(validWeight(weights.risk) ?? ''),
  }
  if (mock) delete env.ANTHROPIC_API_KEY
  return env
}

export function createPipelineRunner(scriptPath = resolve('scripts/run-pipeline.js')) {
  let child: ChildProcess | null = null
  let log: PipelineEvent[] = []
  let done = false
  // Set synchronously before the first await in start(), so a second POST
  // that arrives while the first is still reading its body sees a run in
  // progress instead of racing it into a second spawn() (#324).
  let starting = false
  const listeners = new Set<(data: PipelineEvent) => void>()

  function broadcast(data: PipelineEvent) {
    log.push(data)
    for (const listener of listeners) {
      try {
        listener(data)
      } catch {
        /* a dead listener must not stop the others */
      }
    }
  }

  // POST /api/pipeline/start — launch the pipeline (if not already running)
  async function start(req: IncomingMessage, res: ServerResponse) {
    if (!guardRequest(req, res)) return
    if (req.method !== 'POST') {
      res.writeHead(405)
      res.end()
      return
    }
    if ((child && !done) || starting) {
      sendJson(res, 409, { error: 'Pipeline already running' })
      return
    }
    starting = true

    let body: string
    try {
      body = await readBodyLimited(req)
    } catch (err) {
      starting = false
      sendJson(res, 413, { error: String(err) })
      return
    }
    let parsed: StartRequest = {}
    if (body) {
      try {
        parsed = JSON.parse(body)
      } catch {
        starting = false
        sendJson(res, 400, { error: 'Invalid JSON' })
        return
      }
    }

    log = []
    done = false

    child = spawn('node', [scriptPath], {
      env: pipelineEnv(process.env, parsed),
      cwd: process.cwd(),
    })
    // spawn() defaults to stdio: 'pipe', so both streams are present.
    const { stdout, stderr } = child
    if (!stdout || !stderr) throw new Error('pipeline child process missing stdout/stderr')

    const onData = (chunk: Buffer) => {
      for (const event of eventsFromChunk(chunk.toString())) broadcast(event)
    }
    stdout.on('data', onData)
    stderr.on('data', onData)

    child.on('close', (code) => {
      if (done) return
      done = true
      starting = false
      broadcast({
        type: 'done',
        success: code === 0,
        ...(code !== 0 ? { error: `Process exited with code ${code}` } : {}),
      })
      child = null
    })
    child.on('error', (err) => {
      if (done) return
      done = true
      starting = false
      broadcast({ type: 'done', success: false, error: err.message })
      child = null
    })

    sendJson(res, 200, { ok: true })
  }

  // GET /api/pipeline — SSE. Replays the buffered log, then streams live.
  function stream(req: IncomingMessage, res: ServerResponse, next: () => void) {
    if (req.method !== 'GET') return next()
    if (!guardRequest(req, res)) return

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })
    const send = (data: PipelineEvent) => {
      try {
        res.write(`data: ${JSON.stringify(data)}\n\n`)
      } catch {
        /* the client went away mid-write */
      }
    }

    for (const entry of log) send(entry)

    if (done || !child) {
      res.end()
      return
    }

    listeners.add(send)
    req.on('close', () => {
      listeners.delete(send)
      // Do NOT kill the child — let it finish independently.
    })
  }

  return { start, stream }
}
