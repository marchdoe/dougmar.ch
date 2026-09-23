import { describe, it, expect, vi, afterEach } from 'vitest'
import { emitPhase, runPhase } from '../../scripts/pipeline/phase-events.js'

// The dev panel's run pane reads these lines over SSE instead of matching
// log prose (#227). What matters here is the exact line shape
// (app/dev-server/pipeline-runner.ts's parser depends on it) and that
// runPhase always brackets a phase with start/done or start/error, even on
// a throw.

describe('emitPhase', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('prints one [phase] line with the phase and status, nothing else', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    emitPhase('art-director', 'start')
    expect(log).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith('[phase] {"phase":"art-director","status":"start"}')
  })

  it('includes extra fields, e.g. an error message', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    emitPhase('build', 'error', { error: 'pnpm build failed' })
    expect(JSON.parse(log.mock.calls[0][0].slice('[phase] '.length))).toEqual({
      phase: 'build',
      status: 'error',
      error: 'pnpm build failed',
    })
  })

  it('the prefix is not a GitHub Actions workflow command', () => {
    // Actions workflow commands are `::name arg::value` — a `::`-prefixed
    // line. `[phase] ` never collides.
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    emitPhase('mockup', 'done')
    expect(log.mock.calls[0][0]).not.toMatch(/^::/)
    expect(log.mock.calls[0][0]).toMatch(/^\[phase\] /)
  })
})

describe('runPhase', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('emits start then done around a successful phase, and returns its result', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const result = await runPhase('engineer', async () => 'ok')
    expect(result).toBe('ok')
    expect(log.mock.calls.map((c) => c[0])).toEqual([
      '[phase] {"phase":"engineer","status":"start"}',
      '[phase] {"phase":"engineer","status":"done"}',
    ])
  })

  it('emits start then error, with the thrown message, and rethrows unchanged', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const thrown = new Error('boom')
    await expect(runPhase('gate', () => Promise.reject(thrown))).rejects.toBe(thrown)
    expect(log.mock.calls.map((c) => c[0])).toEqual([
      '[phase] {"phase":"gate","status":"start"}',
      '[phase] {"phase":"gate","status":"error","error":"boom"}',
    ])
  })

  it('stringifies a non-Error throw', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    await expect(runPhase('build', () => Promise.reject('plain string failure'))).rejects.toBe(
      'plain string failure'
    )
    expect(JSON.parse(log.mock.calls[1][0].slice('[phase] '.length)).error).toBe(
      'plain string failure'
    )
  })
})
