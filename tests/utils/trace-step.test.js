import { afterEach, describe, expect, it, vi } from 'vitest'
import { NO_TRACE, openStep } from '../../scripts/utils/trace-step.js'

afterEach(() => {
  vi.useRealTimers()
})

describe('openStep', () => {
  it('records the step when it is closed, with the time since it was opened', () => {
    vi.useFakeTimers()
    const steps = []
    const close = openStep(
      { addStep: (s) => steps.push(s) },
      { name: 'revision', phase: 4, input: { verdict: 'REVISE' } }
    )
    expect(steps).toEqual([])

    vi.advanceTimersByTime(1500)
    close({ outcome: 'rebuilt' })

    expect(steps).toEqual([
      {
        name: 'revision',
        phase: 4,
        input: { verdict: 'REVISE' },
        output: { outcome: 'rebuilt' },
        durationMs: 1500,
      },
    ])
  })

  it('records once: a throw after the normal exit adds no second step', () => {
    const steps = []
    const close = openStep({ addStep: (s) => steps.push(s) }, { name: 'revision', phase: 4 })
    close({ outcome: 'rebuilt' })
    close({ outcome: 'failed' })
    expect(steps.map((s) => s.output.outcome)).toEqual(['rebuilt'])
  })

  it('defaults the input to an empty object', () => {
    const steps = []
    openStep({ addStep: (s) => steps.push(s) }, { name: 'x', phase: 1 })({})
    expect(steps[0].input).toEqual({})
  })

  it('has a trace that keeps nothing, for a caller that was given none', () => {
    expect(() => openStep(NO_TRACE, { name: 'x', phase: 1 })({})).not.toThrow()
  })
})
