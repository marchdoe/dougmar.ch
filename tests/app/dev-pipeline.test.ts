import { describe, expect, it } from 'vitest'
import { fmtDuration, fmtElapsed, fmtStepDuration } from '../../app/dev/lib/format'
import {
  advancePhases,
  attemptNumber,
  briefFrom,
  completePhases,
  isAttemptLine,
  isPaneName,
  makePhases,
  restartAttempt,
} from '../../app/dev/lib/pipeline'

// The dev panel's phase tracker, lifted out of the component in #227 so its
// rules can be checked without a stream. It reads pipeline log prose; these
// pin the lines it reacts to.

const statuses = (phases: ReturnType<typeof makePhases>) => phases.map((p) => p.status)

describe('advancePhases', () => {
  it('ignores a line that names no phase, returning the same array', () => {
    const phases = makePhases()
    expect(advancePhases(phases, 'nothing to see', 1000)).toBe(phases)
  })

  it('activates the matched phase and finishes every earlier one', () => {
    let phases = advancePhases(makePhases(), 'Stage 1: Collect signals', 1000)
    expect(statuses(phases)).toEqual([
      'active',
      'pending',
      'pending',
      'pending',
      'pending',
      'pending',
    ])

    phases = advancePhases(phases, '[1/4] Reading site context', 4000)
    expect(statuses(phases)).toEqual(['done', 'done', 'active', 'pending', 'pending', 'pending'])
    expect(phases[0].durationMs).toBe(3000)
    // A phase that never started has no duration to report.
    expect(phases[1].durationMs).toBeUndefined()
    expect(phases[2].startedAt).toBe(4000)
  })

  it('keeps the first start time when a phase line repeats', () => {
    let phases = advancePhases(makePhases(), 'calling claude CLI', 1000)
    phases = advancePhases(phases, 'calling claude CLI again', 5000)
    expect(phases[3].startedAt).toBe(1000)
  })
})

describe('attempts', () => {
  it('recognises an attempt line and its number', () => {
    expect(isAttemptLine('--- Attempt 2 of 3 ---')).toBe(true)
    expect(attemptNumber('--- Attempt 2 of 3 ---')).toBe(2)
    expect(isAttemptLine('Stage 1: Collect')).toBe(false)
    expect(attemptNumber('--- Attempt ---')).toBeNull()
  })

  it('restarts the design half of the tracker', () => {
    let phases = advancePhases(makePhases(), 'Stage 1: Collect', 1000)
    phases = advancePhases(phases, 'writing files', 2000)
    phases = restartAttempt(phases, 3000)
    expect(statuses(phases)).toEqual(['done', 'done', 'active', 'pending', 'pending', 'pending'])
    expect(phases[2].startedAt).toBe(3000)
  })
})

describe('completePhases', () => {
  it('marks every phase done and keeps timings already recorded', () => {
    let phases = advancePhases(makePhases(), 'Stage 1: Collect', 1000)
    phases = advancePhases(phases, 'Stage 2: Interpret', 1500)
    phases = completePhases(phases, 9000)
    expect(statuses(phases).every((s) => s === 'done')).toBe(true)
    expect(phases[0].durationMs).toBe(500)
    expect(phases[1].durationMs).toBe(7500)
    expect(phases[5].durationMs).toBeUndefined()
  })
})

describe('briefFrom', () => {
  it('takes the last design_brief line', () => {
    expect(briefFrom(['design_brief: first', 'noise', 'design_brief: second'])).toBe('second')
  })

  it('falls back when the run logged none', () => {
    expect(briefFrom(['noise'])).toBe('Run complete')
  })
})

describe('isPaneName', () => {
  it('accepts the four panes and nothing else', () => {
    for (const pane of ['pipeline', 'archive', 'inspector', 'run'])
      expect(isPaneName(pane)).toBe(true)
    expect(isPaneName('signals')).toBe(false)
    expect(isPaneName(null)).toBe(false)
  })
})

describe('format', () => {
  it('formats durations, the run clock and trace steps', () => {
    expect(fmtDuration(850)).toBe('850ms')
    expect(fmtDuration(12400)).toBe('12.4s')
    expect(fmtDuration(125000)).toBe('2m 5s')
    expect(fmtElapsed(65000)).toBe('1:05')
    expect(fmtStepDuration(250)).toBe('250ms')
    expect(fmtStepDuration(1500)).toBe('1.5s')
    expect(fmtStepDuration(126000)).toBe('2.1m')
  })
})
