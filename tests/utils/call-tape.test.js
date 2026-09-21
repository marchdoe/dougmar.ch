import { beforeEach, describe, expect, it, vi } from 'vitest'

const cliMock = vi.fn()
const visionMock = vi.fn()
vi.mock('../../scripts/utils/claude-cli.js', () => ({ callClaudeCLI: cliMock }))
vi.mock('../../scripts/utils/vision-router.js', () => ({ callVisionAgent: visionMock }))

const { TAPED_AGENTS, callTapedCLI, callTapedVision, recordedCalls, startTape, traceReplay } =
  await import('../../scripts/utils/call-tape.js')
const { getUsageRecords, resetLedger } = await import('../../scripts/utils/cost-ledger.js')

const entry = (agent, text, channel = 'cli') => ({ agent, text, channel })

beforeEach(() => {
  cliMock.mockReset()
  visionMock.mockReset()
  resetLedger()
  startTape()
  vi.stubEnv('PIPELINE_TIER', 'prod')
})

describe('the tape, recording', () => {
  it('passes a live call through unchanged and keeps what came back', async () => {
    cliMock.mockResolvedValue('the reply')
    const text = await callTapedCLI('art-director', 'sys', 'prompt', {
      model: 'claude-opus-4-8',
      purpose: 'first',
    })

    expect(text).toBe('the reply')
    expect(cliMock).toHaveBeenCalledWith('art-director', 'sys', 'prompt', {
      model: 'claude-opus-4-8',
      purpose: 'first',
    })
    expect(recordedCalls()).toEqual([entry('art-director', 'the reply')])
  })

  it('keeps the channel a vision critic answered on, and still tells its caller', async () => {
    visionMock.mockImplementation(async (args) => {
      args.onChannel('sdk-vision')
      return 'verdict'
    })
    const seen = []
    const text = await callTapedVision({
      agentName: 'mockup-critic',
      contentBlocks: [],
      purpose: 'first',
      onChannel: (c) => seen.push(c),
    })

    expect(text).toBe('verdict')
    expect(seen).toEqual(['sdk-vision'])
    expect(recordedCalls()).toEqual([entry('mockup-critic', 'verdict', 'sdk-vision')])
    expect(visionMock.mock.calls[0][0].purpose).toBe('first')
  })

  it('keeps nothing from a call that threw', async () => {
    cliMock.mockRejectedValue(new Error('stalled'))
    await expect(callTapedCLI('mockup-designer', 's', 'p', {})).rejects.toThrow('stalled')
    expect(recordedCalls()).toEqual([])
  })

  it('returns copies, so a caller cannot rewrite what lands in handoff.json', async () => {
    cliMock.mockResolvedValue('x')
    await callTapedCLI('art-director', 's', 'p', {})
    recordedCalls()[0].text = 'changed'
    expect(recordedCalls()[0].text).toBe('x')
  })
})

describe('the tape, replaying', () => {
  it('answers from the tape in order, per agent, without a model call', async () => {
    startTape([
      entry('art-director', 'ad-1'),
      entry('mockup-designer', 'md-1'),
      entry('art-director', 'ad-2'),
    ])

    expect(await callTapedCLI('art-director', 's', 'p', {})).toBe('ad-1')
    expect(await callTapedCLI('art-director', 's', 'p', {})).toBe('ad-2')
    expect(await callTapedCLI('mockup-designer', 's', 'p', {})).toBe('md-1')
    expect(cliMock).not.toHaveBeenCalled()
  })

  it('falls through to the live call once an agent is out of tape', async () => {
    startTape([entry('mockup-designer', 'md-1')])
    cliMock.mockResolvedValue('live')

    expect(await callTapedCLI('mockup-designer', 's', 'p', {})).toBe('md-1')
    expect(await callTapedCLI('mockup-designer', 's', 'p', {})).toBe('live')
    expect(cliMock).toHaveBeenCalledTimes(1)
  })

  it('never serves an agent the tape holds nothing for', async () => {
    startTape([entry('art-director', 'ad-1')])
    cliMock.mockResolvedValue('live')
    expect(await callTapedCLI('mockup-designer', 's', 'p', {})).toBe('live')
  })

  it('reports the channel a critic originally answered on', async () => {
    startTape([entry('mockup-critic', 'verdict', 'sdk-vision')])
    const seen = []
    const text = await callTapedVision({
      agentName: 'mockup-critic',
      contentBlocks: [],
      onChannel: (c) => seen.push(c),
    })

    expect(text).toBe('verdict')
    expect(seen).toEqual(['sdk-vision'])
    expect(visionMock).not.toHaveBeenCalled()
  })

  it('books each served response as a free call with the purpose replay', async () => {
    startTape([entry('art-director', 'ad-1')])
    await callTapedCLI('art-director', 's', 'p', {})

    const [record, ...rest] = getUsageRecords()
    expect(rest).toEqual([])
    expect(record).toMatchObject({
      agent: 'art-director',
      purpose: 'replay',
      cost_usd: 0,
      model: 'claude-opus-4-8',
    })
  })

  it('carries what it served into the next tape, so a resume that fails can be resumed', async () => {
    startTape([entry('art-director', 'ad-1')])
    cliMock.mockResolvedValue('md-live')
    await callTapedCLI('art-director', 's', 'p', {})
    await callTapedCLI('mockup-designer', 's', 'p', {})

    expect(recordedCalls()).toEqual([
      entry('art-director', 'ad-1'),
      entry('mockup-designer', 'md-live'),
    ])
  })

  it('starts each run empty', async () => {
    cliMock.mockResolvedValue('x')
    await callTapedCLI('art-director', 's', 'p', {})
    startTape()
    expect(recordedCalls()).toEqual([])
  })
})

describe('traceReplay', () => {
  it('adds a resume step that counts what the tape held', () => {
    startTape([
      entry('art-director', 'a'),
      entry('mockup-designer', 'b'),
      entry('mockup-designer', 'c'),
    ])
    const steps = []
    traceReplay({ addStep: (s) => steps.push(s) })

    expect(steps).toHaveLength(1)
    expect(steps[0].name).toBe('resume')
    expect(steps[0].output).toEqual({
      replayed: { 'art-director': 1, 'mockup-designer': 2 },
      total: 3,
    })
  })

  it('adds nothing to a run with no tape', () => {
    const steps = []
    traceReplay({ addStep: (s) => steps.push(s) })
    expect(steps).toEqual([])
  })
})

describe('what is taped', () => {
  it('is every paid call before the engineer, and not the engineer or the screenshot critic', () => {
    expect(TAPED_AGENTS).toEqual(['art-director', 'mockup-designer', 'mockup-critic'])
  })
})
