import { describe, it, expect, vi } from 'vitest'
import { EventEmitter } from 'node:events'
import { spawn } from 'node:child_process'
import {
  createPipelineRunner,
  eventsFromChunk,
  pipelineEnv,
} from '../../app/dev-server/pipeline-runner'

// createPipelineRunner spawns a real child process; two POSTs racing the
// spawn is exactly what #324 is about, so spawn is mocked to return a bare
// EventEmitter standing in for the child (plus stdout/stderr streams).
const mockChildren: Array<EventEmitter & { stdout: EventEmitter; stderr: EventEmitter }> = []

vi.mock('node:child_process', () => ({
  spawn: vi.fn(() => {
    const child = new EventEmitter() as EventEmitter & {
      stdout: EventEmitter
      stderr: EventEmitter
    }
    child.stdout = new EventEmitter()
    child.stderr = new EventEmitter()
    mockChildren.push(child)
    return child
  }),
}))

/** A POST /api/pipeline/start request: an EventEmitter so readBodyLimited can drive it. */
function fakeStartReq() {
  return Object.assign(new EventEmitter(), {
    method: 'POST',
    socket: { remoteAddress: '127.0.0.1' },
    headers: { host: 'localhost:5173' },
  })
}

function fakeRes() {
  const res = { status: 0, body: '', writeHead: vi.fn(), end: vi.fn() }
  res.writeHead.mockImplementation((s: number) => {
    res.status = s
  })
  res.end.mockImplementation((b: string) => {
    res.body = b
  })
  return res
}

describe('eventsFromChunk', () => {
  it('turns [TRACE] lines into structured steps and everything else into log lines', () => {
    const chunk = [
      '[phase-1] starting',
      '[TRACE] {"name":"art-director","phase":1}',
      '',
      'done',
    ].join('\n')
    expect(eventsFromChunk(chunk)).toEqual([
      { type: 'log', line: '[phase-1] starting' },
      { type: 'trace', step: { name: 'art-director', phase: 1 } },
      { type: 'log', line: 'done' },
    ])
  })

  it('treats a [TRACE] line that is not JSON as a log line rather than dropping it', () => {
    expect(eventsFromChunk('[TRACE] not json')).toEqual([{ type: 'log', line: '[TRACE] not json' }])
  })

  it('turns [phase] lines into structured phase events', () => {
    const chunk = [
      '[phase] {"phase":"art-director","status":"start"}',
      '[phase] {"phase":"art-director","status":"done"}',
      '[phase] {"phase":"build","status":"error","error":"pnpm build failed"}',
    ].join('\n')
    expect(eventsFromChunk(chunk)).toEqual([
      { type: 'phase', phase: 'art-director', status: 'start' },
      { type: 'phase', phase: 'art-director', status: 'done' },
      { type: 'phase', phase: 'build', status: 'error', error: 'pnpm build failed' },
    ])
  })

  it('treats a [phase] line that is not JSON as a log line rather than dropping it', () => {
    expect(eventsFromChunk('[phase] not json')).toEqual([{ type: 'log', line: '[phase] not json' }])
  })

  it('treats a [phase] line missing phase/status as a log line', () => {
    expect(eventsFromChunk('[phase] {"status":"start"}')).toEqual([
      { type: 'log', line: '[phase] {"status":"start"}' },
    ])
    expect(eventsFromChunk('[phase] {"phase":"build","status":"unknown"}')).toEqual([
      { type: 'log', line: '[phase] {"phase":"build","status":"unknown"}' },
    ])
  })
})

describe('pipelineEnv', () => {
  const base = { PATH: '/bin', ANTHROPIC_API_KEY: 'sk-live' }

  it('strips the API key from a mock run', () => {
    const env = pipelineEnv(base, { mock: true })
    expect(env.ANTHROPIC_API_KEY).toBeUndefined()
    expect(env.MOCK_MODE).toBe('true')
    expect(env.PATH).toBe('/bin')
  })

  it('keeps the API key for a real run', () => {
    expect(pipelineEnv(base, { mock: false }).ANTHROPIC_API_KEY).toBe('sk-live')
  })

  it('sends an empty WEIGHT_RISK when unset, so design-agents derives it from the date', () => {
    expect(pipelineEnv(base, {}).WEIGHT_RISK).toBe('')
    expect(pipelineEnv(base, { weights: { risk: null } }).WEIGHT_RISK).toBe('')
    expect(pipelineEnv(base, { weights: { risk: 7 } }).WEIGHT_RISK).toBe('7')
  })

  it('defaults the other weights to 5', () => {
    const env = pipelineEnv(base, { weights: { signals: 9 } })
    expect(env.WEIGHT_SIGNALS).toBe('9')
    expect(env.WEIGHT_INSPIRATION).toBe('5')
    expect(env.WEIGHT_RATINGS).toBe('5')
  })

  it('never forwards a weight that fails the integer 0-10 check the production write path enforces', () => {
    // The request body is JSON.parse'd and cast to Partial<Weights> without
    // a runtime check (#325), so any of these can arrive from the panel.
    for (const bad of ['7abc', 99, -1, [5]]) {
      const env = pipelineEnv(base, { weights: { signals: bad } as never })
      expect(env.WEIGHT_SIGNALS, JSON.stringify(bad)).toBe('5')
    }
    for (const bad of ['7abc', 99, -1, [5]]) {
      const env = pipelineEnv(base, { weights: { risk: bad } as never })
      expect(env.WEIGHT_RISK, JSON.stringify(bad)).toBe('')
    }
  })

  it('still forwards a valid weight', () => {
    const env = pipelineEnv(base, { weights: { signals: 5, risk: 5 } })
    expect(env.WEIGHT_SIGNALS).toBe('5')
    expect(env.WEIGHT_RISK).toBe('5')
  })
})

describe('createPipelineRunner start()', () => {
  it('refuses a second POST that arrives before the first has finished reading its body', async () => {
    mockChildren.length = 0
    vi.mocked(spawn).mockClear()

    const runner = createPipelineRunner('fake-script.js')
    const req1 = fakeStartReq()
    const req2 = fakeStartReq()
    const res1 = fakeRes()
    const res2 = fakeRes()

    // Both POSTs fire back-to-back, before either has read its body — the
    // race from #324. The second must see a run "starting" synchronously,
    // not just once `child` is assigned.
    const p1 = runner.start(req1 as never, res1 as never)
    const p2 = runner.start(req2 as never, res2 as never)

    req1.emit('end')
    req2.emit('end')
    await Promise.all([p1, p2])

    expect(spawn).toHaveBeenCalledTimes(1)
    expect([res1.status, res2.status].sort()).toEqual([200, 409])
    expect(JSON.parse(res2.status === 409 ? res2.body : res1.body)).toEqual({
      error: 'Pipeline already running',
    })
  })
})
