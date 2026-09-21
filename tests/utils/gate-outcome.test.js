import { describe, expect, it } from 'vitest'
import {
  GATE_FAILED,
  describeGateErrors,
  gateFailedVerdict,
  recordGateFailure,
  surfaceGateRecord,
} from '../../scripts/utils/gate-outcome.js'

describe('gateFailedVerdict', () => {
  it('says which round threw, why, and that nothing was measured', () => {
    const v = gateFailedVerdict(2, new Error('vite preview did not answer'))
    expect(v).toMatchObject({
      critic: 'surface-gate',
      round: 2,
      verdict: GATE_FAILED,
      error: 'vite preview did not answer',
    })
    expect(v.feedback).toContain('round 2')
    expect(v.feedback).toContain('vite preview did not answer')
    expect(v.feedback).toContain('measured nothing')
  })

  it('is not a verdict the revision loop or the lessons block read as a finding', () => {
    // Both key on REVISE; GATE-FAILED must never be one.
    expect(gateFailedVerdict(1, new Error('x')).verdict).not.toBe('REVISE')
  })
})

describe('recordGateFailure', () => {
  it('pushes the verdict and adds a trace step named for the gate', () => {
    const verdicts = [{ critic: 'spec-critic', verdict: 'APPROVED' }]
    const steps = []
    recordGateFailure({
      verdicts,
      trace: { addStep: (s) => steps.push(s) },
      round: 1,
      err: new Error('boom'),
      durationMs: 42,
    })
    expect(verdicts.map((v) => v.verdict)).toEqual(['APPROVED', GATE_FAILED])
    expect(steps).toEqual([
      {
        name: 'surface-gate',
        phase: 4,
        input: { round: 1 },
        output: { ran: false, error: 'boom' },
        durationMs: 42,
      },
    ])
  })
})

describe('surfaceGateRecord', () => {
  it('is a gate that ran when no round failed', () => {
    const verdicts = [
      { critic: 'surface-gate', round: 1, verdict: 'REVISE' },
      { critic: 'surface-gate', round: 2, verdict: 'SHIP' },
    ]
    expect(surfaceGateRecord(verdicts)).toEqual({ ran: true, error: null, round: null })
    expect(surfaceGateRecord([])).toEqual({ ran: true, error: null, round: null })
    expect(surfaceGateRecord(undefined)).toEqual({ ran: true, error: null, round: null })
  })

  it('is a gate that did not run when a round threw, and names the first', () => {
    const verdicts = [
      gateFailedVerdict(1, new Error('first')),
      gateFailedVerdict(2, new Error('second')),
    ]
    expect(surfaceGateRecord(verdicts)).toEqual({ ran: false, error: 'first', round: 1 })
  })

  it('reads a round-2 failure as not run, with round 2 named', () => {
    const verdicts = [
      { critic: 'surface-gate', round: 1, verdict: 'REVISE' },
      gateFailedVerdict(2, new Error('regate crashed')),
    ]
    expect(surfaceGateRecord(verdicts)).toEqual({ ran: false, error: 'regate crashed', round: 2 })
  })

  it('ignores a GATE-FAILED that some other critic wrote', () => {
    expect(surfaceGateRecord([{ critic: 'screenshot-critic', verdict: GATE_FAILED }]).ran).toBe(
      true
    )
  })
})

describe('describeGateErrors', () => {
  it('is the bare count when every error is one an agent can fix', () => {
    expect(describeGateErrors(3, 0)).toBe('3 error(s)')
    expect(describeGateErrors(0, 0)).toBe('0 error(s)')
  })

  it('says how many of the errors are on routes only a person can edit', () => {
    expect(describeGateErrors(3, 2)).toBe('3 error(s) (2 on authored routes, for a human)')
  })
})
