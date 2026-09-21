import { describe, expect, it, vi } from 'vitest'
import {
  MAX_OUTPUT_PATCH_ROUNDS,
  outputProblemReport,
  patchOutputProblem,
  regenerationPrompt,
} from '../../scripts/utils/engineer-output-patch.js'

const problem = {
  kind: 'missing-files',
  message: 'React Engineer omitted required files: app/components/Sidebar.tsx',
  reminder: '## REQUIRED FILES MISSING\n\n- app/components/Sidebar.tsx: the navigation',
}
const rejectedProblem = {
  kind: 'shell-posture',
  message: 'shell_posture: none declares no nav element, but <nav> appears in: Sidebar.tsx',
  reminder: '## SHELL POSTURE VIOLATION',
}

const layout = { path: 'app/components/Layout.tsx', content: 'export function Layout() {}' }

/** Fakes for the callbacks, each recording what it was handed. */
function wiring(overrides = {}) {
  const calls = { reports: [], prompts: [], applied: [] }
  const params = {
    problem,
    taskPrompt: 'THE TASK',
    buildBrief: vi.fn(async (report) => {
      calls.reports.push(report)
      return { owned: [layout], brief: `BRIEF\n${report}` }
    }),
    askEngineer: vi.fn(async (prompt) => {
      calls.prompts.push(prompt)
      return { files: [{ path: 'app/components/Sidebar.tsx', content: 'export {}' }] }
    }),
    applyPatch: vi.fn(async (owned, reply) => {
      calls.applied.push({ owned, reply })
      return { problem: null }
    }),
    pastDeadline: vi.fn(() => false),
    noteRetry: vi.fn(),
    ...overrides,
  }
  return { params, calls }
}

describe('outputProblemReport', () => {
  it('is the problem itself on the first round', () => {
    expect(outputProblemReport(problem, null)).toBe(problem.reminder)
  })

  it('adds why the last reply was not applied on a later round', () => {
    const report = outputProblemReport(problem, rejectedProblem)
    expect(report.startsWith(problem.reminder)).toBe(true)
    expect(report).toContain('Your last reply to this was not applied')
    expect(report).toContain(rejectedProblem.message)
  })
})

describe('regenerationPrompt', () => {
  it('is the task, then a note that nothing arrived', () => {
    const prompt = regenerationPrompt('THE TASK', problem, null)
    expect(prompt.startsWith('THE TASK\n\n---\n\n## NOTHING USABLE ARRIVED')).toBe(true)
    expect(prompt).toContain(problem.message)
    expect(prompt).not.toContain('The reply before this one')
  })

  it('carries what the previous round would have left wrong', () => {
    expect(regenerationPrompt('THE TASK', problem, rejectedProblem)).toContain(
      `The reply before this one still failed: ${rejectedProblem.message}`
    )
  })
})

describe('patchOutputProblem', () => {
  it('does nothing when the reply arrived clean', async () => {
    const { params } = wiring({ problem: null })
    expect(await patchOutputProblem(params)).toEqual({ reply: null })
    expect(params.buildBrief).not.toHaveBeenCalled()
    expect(params.askEngineer).not.toHaveBeenCalled()
    expect(params.noteRetry).not.toHaveBeenCalled()
  })

  it('sends the repair brief, applies the reply and stops on the first clean merge', async () => {
    const { params, calls } = wiring()
    const { reply } = await patchOutputProblem(params)

    expect(calls.reports).toEqual([problem.reminder])
    expect(calls.prompts).toEqual([`BRIEF\n${problem.reminder}`])
    expect(calls.applied).toHaveLength(1)
    expect(calls.applied[0].owned).toEqual([layout])
    expect(reply).toBe(calls.applied[0].reply)
    expect(params.noteRetry).toHaveBeenCalledTimes(1)
  })

  it('allows two rounds by default, the budget the regeneration had', async () => {
    expect(MAX_OUTPUT_PATCH_ROUNDS).toBe(2)
    const { params, calls } = wiring({
      applyPatch: vi.fn(async () => ({ problem: rejectedProblem })),
    })

    expect(await patchOutputProblem(params)).toEqual({ reply: null })
    expect(params.askEngineer).toHaveBeenCalledTimes(2)
    expect(params.applyPatch).toHaveBeenCalledTimes(2)
    expect(params.noteRetry).toHaveBeenCalledTimes(2)
    // The second brief says the first reply was rejected, and why.
    expect(calls.reports[0]).toBe(problem.reminder)
    expect(calls.reports[1]).toContain('Your last reply to this was not applied')
    expect(calls.reports[1]).toContain(rejectedProblem.message)
  })

  it('resolves on the second round when the first is rejected', async () => {
    const applyPatch = vi
      .fn()
      .mockResolvedValueOnce({ problem: rejectedProblem })
      .mockResolvedValueOnce({ problem: null })
    const { params } = wiring({ applyPatch })

    const { reply } = await patchOutputProblem(params)
    expect(reply).not.toBeNull()
    expect(applyPatch).toHaveBeenCalledTimes(2)
  })

  it('spends a round on a failed model call and asks again', async () => {
    const askEngineer = vi
      .fn()
      .mockRejectedValueOnce(new Error('stalled'))
      .mockResolvedValueOnce({ files: [] })
    const { params } = wiring({ askEngineer })

    const { reply } = await patchOutputProblem(params)
    expect(askEngineer).toHaveBeenCalledTimes(2)
    expect(params.applyPatch).toHaveBeenCalledTimes(1)
    expect(params.noteRetry).toHaveBeenCalledTimes(2)
    expect(reply).not.toBeNull()
  })

  it('gives up without a patch once the run deadline has passed', async () => {
    const { params } = wiring({ pastDeadline: vi.fn(() => true) })
    expect(await patchOutputProblem(params)).toEqual({ reply: null })
    expect(params.askEngineer).not.toHaveBeenCalled()
    expect(params.noteRetry).not.toHaveBeenCalled()
  })

  it('stops between rounds when the deadline passes', async () => {
    const pastDeadline = vi.fn().mockReturnValueOnce(false).mockReturnValue(true)
    const { params } = wiring({
      pastDeadline,
      applyPatch: vi.fn(async () => ({ problem: rejectedProblem })),
    })
    expect(await patchOutputProblem(params)).toEqual({ reply: null })
    expect(params.askEngineer).toHaveBeenCalledTimes(1)
  })

  it('asks for the whole response when no engineer file is on disk', async () => {
    const { params, calls } = wiring({
      buildBrief: vi.fn(async () => ({ owned: [], brief: 'BRIEF (none written yet)' })),
    })

    await patchOutputProblem(params)
    expect(calls.prompts).toEqual([regenerationPrompt('THE TASK', problem, null)])
    expect(calls.prompts[0]).not.toContain('BRIEF')
  })

  it('lets a failure while applying the reply out, so the swarm rolls back', async () => {
    const { params } = wiring({
      applyPatch: vi.fn(async () => {
        throw new Error('EISDIR')
      }),
    })
    await expect(patchOutputProblem(params)).rejects.toThrow('EISDIR')
    expect(params.askEngineer).toHaveBeenCalledTimes(1)
  })

  // #578: the rounds were paid for and left no row in trace.json.
  describe('the trace', () => {
    const traced = () => {
      const steps = []
      return { steps, trace: { addStep: (step) => steps.push(step) } }
    }

    it('records a round that was applied', async () => {
      const { steps, trace } = traced()
      await patchOutputProblem({ ...wiring().params, trace })

      expect(steps).toHaveLength(1)
      expect(steps[0]).toMatchObject({
        name: 'output-patch',
        phase: 3,
        input: { round: 1, kind: 'missing-files', problem: problem.message },
        output: { outcome: 'applied', files: 1 },
      })
      expect(typeof steps[0].durationMs).toBe('number')
    })

    it('records a rejected round and then the one that resolved it', async () => {
      const { steps, trace } = traced()
      const applyPatch = vi
        .fn()
        .mockResolvedValueOnce({ problem: rejectedProblem })
        .mockResolvedValueOnce({ problem: null })
      await patchOutputProblem({ ...wiring({ applyPatch }).params, trace })

      expect(steps.map((s) => [s.input.round, s.output.outcome])).toEqual([
        [1, 'not-applied'],
        [2, 'applied'],
      ])
      expect(steps[0].output.problem).toBe(rejectedProblem.message)
    })

    it('records a request that failed and a run that was out of time', async () => {
      const failed = traced()
      const askEngineer = vi
        .fn()
        .mockRejectedValueOnce(new Error('stalled'))
        .mockResolvedValueOnce({ files: [] })
      await patchOutputProblem({ ...wiring({ askEngineer }).params, trace: failed.trace })
      expect(failed.steps[0].output).toEqual({ outcome: 'request-failed', error: 'stalled' })

      const late = traced()
      await patchOutputProblem({
        ...wiring({ pastDeadline: vi.fn(() => true) }).params,
        trace: late.trace,
      })
      expect(late.steps.map((s) => s.output.outcome)).toEqual(['skipped-deadline'])
    })

    it('writes nothing for a reply that arrived clean', async () => {
      const { steps, trace } = traced()
      await patchOutputProblem({ ...wiring({ problem: null }).params, trace })
      expect(steps).toEqual([])
    })
  })
})
