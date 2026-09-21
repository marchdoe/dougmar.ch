import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  callClaudeSDK,
  hasApiKey,
  imageBlock,
  isRetryableSdkError,
  textBlock,
} from '../../scripts/utils/claude-sdk.js'
import { APIConnectionError } from '@anthropic-ai/sdk'
import { getUsageRecords, resetLedger, summarizeLedger } from '../../scripts/utils/cost-ledger.js'
import {
  DeadlineExceeded,
  MIN_CALL_MS,
  clearRunDeadline,
  setRunDeadline,
} from '../../scripts/utils/run-budget.js'

/** Minimal stand-in for the Anthropic client — never touches the network. */
function stubClient(response) {
  const create = vi.fn().mockResolvedValue(response)
  return { client: { messages: { create } }, create }
}

const OK = {
  content: [{ type: 'text', text: 'Some analysis.\n===VERDICT===\nAPPROVE\n===END===' }],
  stop_reason: 'end_turn',
  usage: { input_tokens: 5000, output_tokens: 400 },
}

describe('content block helpers', () => {
  it('base64-encodes a buffer as an image block, JPEG by default', () => {
    const block = imageBlock(Buffer.from([0xff, 0xd8, 0xff]))
    expect(block).toEqual({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: '/9j/' },
    })
  })

  it('honours an explicit media type', () => {
    expect(imageBlock(Buffer.from('x'), 'image/png').source.media_type).toBe('image/png')
  })

  it('wraps text', () => {
    expect(textBlock('hi')).toEqual({ type: 'text', text: 'hi' })
  })
})

describe('hasApiKey', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('is true only when ANTHROPIC_API_KEY is set', () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    expect(hasApiKey()).toBe(true)
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    expect(hasApiKey()).toBe(false)
  })
})

describe('callClaudeSDK', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    vi.stubEnv('PIPELINE_TIER', 'prod')
  })

  it('sends one user turn carrying the given content blocks', async () => {
    const { client, create } = stubClient(OK)
    const blocks = [textBlock('brief'), imageBlock(Buffer.from([0x01]))]

    const text = await callClaudeSDK('mockup-critic', 'you are a critic', blocks, { client })

    expect(text).toBe(OK.content[0].text)
    expect(create).toHaveBeenCalledTimes(1)
    const args = create.mock.calls[0][0]
    expect(args.system).toBe('you are a critic')
    expect(args.messages).toHaveLength(1)
    expect(args.messages[0].role).toBe('user')
    expect(args.messages[0].content).toEqual(blocks)
    expect(args.messages[0].content[1].source.type).toBe('base64')
  })

  it('resolves the model from modelFor(agentName)', async () => {
    const { client, create } = stubClient(OK)
    await callClaudeSDK('screenshot-critic', 'sys', [textBlock('x')], { client })
    expect(create.mock.calls[0][0].model).toBe('claude-sonnet-5')
  })

  it('accepts an explicit model and max_tokens override', async () => {
    const { client, create } = stubClient(OK)
    await callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], {
      client,
      model: 'claude-opus-4-8',
      maxTokens: 4096,
    })
    expect(create.mock.calls[0][0].model).toBe('claude-opus-4-8')
    expect(create.mock.calls[0][0].max_tokens).toBe(4096)
  })

  it('requests adaptive thinking on models that support it', async () => {
    const { client, create } = stubClient(OK)
    // screenshot-critic resolves to sonnet, which supports adaptive thinking.
    // (mockup-critic resolves to haiku, which does not — see the guard test below.)
    await callClaudeSDK('screenshot-critic', 'sys', [textBlock('x')], { client })
    expect(create.mock.calls[0][0].thinking).toEqual({ type: 'adaptive' })
  })

  it('omits thinking on mockup-critic (haiku tier) without an explicit model override', async () => {
    const { client, create } = stubClient(OK)
    await callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], { client })
    expect(create.mock.calls[0][0].thinking).toBeUndefined()
  })

  it('omits thinking on haiku, which rejects adaptive', async () => {
    const { client, create } = stubClient(OK)
    await callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], {
      client,
      model: 'claude-haiku-4-5',
    })
    expect(create.mock.calls[0][0].thinking).toBeUndefined()
  })

  it('concatenates text blocks and ignores thinking blocks', async () => {
    const { client } = stubClient({
      content: [
        { type: 'thinking', thinking: 'hmm' },
        { type: 'text', text: 'part one ' },
        { type: 'text', text: 'part two' },
      ],
      stop_reason: 'end_turn',
      usage: {},
    })
    const text = await callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], { client })
    expect(text).toBe('part one part two')
  })

  it('throws on a max_tokens stop, after booking the tokens that were spent', async () => {
    // #300: stop_reason was logged and never checked. A critic cut off before
    // its ===VERDICT=== block failed closed to REVISE and bought a full
    // engineer round.
    resetLedger()
    const { client } = stubClient({
      ...OK,
      stop_reason: 'max_tokens',
      usage: { input_tokens: 10, output_tokens: 16000 },
    })
    await expect(
      callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], { client })
    ).rejects.toThrow(/truncated at max_tokens \(16000 output tokens, cap 16000\)/)
    expect(getUsageRecords()).toHaveLength(1)
  })

  it('throws without an API key', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    const { client } = stubClient(OK)
    await expect(
      callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], { client })
    ).rejects.toThrow(/ANTHROPIC_API_KEY/)
  })

  it('throws on an empty block list', async () => {
    const { client } = stubClient(OK)
    await expect(callClaudeSDK('mockup-critic', 'sys', [], { client })).rejects.toThrow(
      /at least one content block/
    )
  })

  it('propagates SDK errors', async () => {
    const client = { messages: { create: vi.fn().mockRejectedValue(new Error('rate_limit')) } }
    await expect(
      callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], { client })
    ).rejects.toThrow(/rate_limit/)
  })

  // #294: the SDK's own retries were invisible to the ledger and each one
  // restarted the per-request timeout. callClaudeSDK owns them now.
  describe('retries', () => {
    const overloaded = () => Object.assign(new Error('overloaded'), { status: 529 })

    beforeEach(() => {
      resetLedger()
      vi.useFakeTimers()
    })

    it('classifies transient statuses and connection errors as retryable', () => {
      expect(isRetryableSdkError(overloaded())).toBe(true)
      expect(isRetryableSdkError(Object.assign(new Error('x'), { status: 429 }))).toBe(true)
      expect(isRetryableSdkError(new APIConnectionError({ message: 'ECONNRESET' }))).toBe(true)
      expect(isRetryableSdkError(Object.assign(new Error('x'), { status: 400 }))).toBe(false)
      // Not from the API at all: a thrown assertion, a bug in a stub.
      expect(isRetryableSdkError(new Error('boom'))).toBe(false)
      expect(isRetryableSdkError(Object.assign(new Error('x'), { status: 401 }))).toBe(false)
    })

    it('retries a transient failure, books each retry, and passes maxRetries: 0 to the SDK', async () => {
      const create = vi
        .fn()
        .mockRejectedValueOnce(overloaded())
        .mockRejectedValueOnce(overloaded())
        .mockResolvedValue(OK)
      const client = { messages: { create } }

      const promise = callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], { client })
      await vi.runAllTimersAsync()
      const text = await promise

      expect(text).toBe(OK.content[0].text)
      expect(create).toHaveBeenCalledTimes(3)
      for (const call of create.mock.calls) expect(call[1]).toMatchObject({ maxRetries: 0 })
      expect(summarizeLedger().retries).toBe(2)
      expect(getUsageRecords()).toHaveLength(1)
    })

    it('gives up after the configured retries', async () => {
      const create = vi.fn().mockRejectedValue(overloaded())
      const client = { messages: { create } }

      const promise = callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], { client })
      const settled = promise.catch((err) => err)
      await vi.runAllTimersAsync()
      const err = await settled

      expect(err.message).toMatch(/overloaded/)
      expect(create).toHaveBeenCalledTimes(3)
      expect(summarizeLedger().retries).toBe(2)
    })

    it('does not retry a 400', async () => {
      const create = vi
        .fn()
        .mockRejectedValue(Object.assign(new Error('bad request'), { status: 400 }))
      const client = { messages: { create } }

      await expect(
        callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], { client })
      ).rejects.toThrow(/bad request/)
      expect(create).toHaveBeenCalledTimes(1)
      expect(summarizeLedger().retries).toBe(0)
    })

    it('keeps every attempt inside the one timeout instead of restarting it', async () => {
      const create = vi
        .fn()
        .mockImplementationOnce(async () => {
          // The first attempt burns most of the budget before failing.
          await vi.advanceTimersByTimeAsync(9000)
          throw overloaded()
        })
        .mockResolvedValue(OK)
      const client = { messages: { create } }

      const promise = callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], {
        client,
        timeoutMs: 20000,
      })
      await vi.runAllTimersAsync()
      await promise

      expect(create).toHaveBeenCalledTimes(2)
      expect(create.mock.calls[0][1].timeout).toBe(20000)
      // 9s spent, 2s backoff: the second attempt gets the ~9s left, not a fresh 20s.
      expect(create.mock.calls[1][1].timeout).toBeLessThanOrEqual(9000)
      expect(create.mock.calls[1][1].timeout).toBeGreaterThan(8500)
    })

    it('does not start a retry that cannot finish before the deadline', async () => {
      const create = vi.fn().mockImplementation(async () => {
        await vi.advanceTimersByTimeAsync(1500)
        throw overloaded()
      })
      const client = { messages: { create } }

      const promise = callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], {
        client,
        timeoutMs: 3000,
      })
      const settled = promise.catch((err) => err)
      await vi.runAllTimersAsync()
      const err = await settled

      expect(err.message).toMatch(/overloaded/)
      // 1.5s spent, 2s backoff would land past the 3s deadline: one attempt only.
      expect(create).toHaveBeenCalledTimes(1)
      expect(summarizeLedger().retries).toBe(0)
    })
  })

  // #295: clampToBudget was applied in callClaudeCLI only.
  describe('run deadline', () => {
    // The deadline is module-level state in run-budget.js, shared by every
    // caller in the process. Clearing it only on the way out means each test
    // here inherits whatever ran before it, and "no run registered a
    // deadline" below is a claim about the whole process rather than about
    // this test. It failed on main that way once — 599999 against an expected
    // 600000, a deadline someone else had set, one millisecond old. Each test
    // now states the precondition it depends on instead of hoping for it.
    beforeEach(() => {
      clearRunDeadline()
    })

    afterEach(() => {
      clearRunDeadline()
      vi.useRealTimers()
    })

    it('clamps the timeout to what the run has left', async () => {
      vi.useFakeTimers()
      setRunDeadline(Date.now() + 45_000)
      const { client, create } = stubClient(OK)

      await callClaudeSDK('screenshot-critic', 'sys', [textBlock('x')], {
        client,
        timeoutMs: 600000,
      })

      expect(create.mock.calls[0][1].timeout).toBeLessThanOrEqual(45_000)
      expect(create.mock.calls[0][1].timeout).toBeGreaterThanOrEqual(MIN_CALL_MS)
    })

    it("refuses to start when less than a call's worth remains", async () => {
      // #299: the clamp used to hand back 0 here.
      vi.useFakeTimers()
      setRunDeadline(Date.now() + 5000)
      const { client, create } = stubClient(OK)

      await expect(
        callClaudeSDK('screenshot-critic', 'sys', [textBlock('x')], { client, timeoutMs: 600000 })
      ).rejects.toBeInstanceOf(DeadlineExceeded)
      expect(create).not.toHaveBeenCalled()
    })

    it('leaves the timeout alone when no run registered a deadline', async () => {
      const { client, create } = stubClient(OK)
      await callClaudeSDK('screenshot-critic', 'sys', [textBlock('x')], {
        client,
        timeoutMs: 600000,
      })
      expect(create.mock.calls[0][1].timeout).toBe(600000)
    })
  })

  describe('cost telemetry', () => {
    beforeEach(() => {
      resetLedger()
    })

    it('books the call against the cost ledger with an estimated price', async () => {
      const { client } = stubClient(OK)
      await callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], { client })

      const [record, ...rest] = getUsageRecords()
      expect(rest).toHaveLength(0)
      expect(record.agent).toBe('mockup-critic')
      expect(record.source).toBe('sdk')
      expect(record.model).toBe('claude-haiku-4-5')
      expect(record.input).toBe(5000)
      expect(record.output).toBe(400)
      // No price comes back from the API, so the ledger prices it itself.
      expect(record.estimated).toBe(true)
      expect(record.cost_usd).toBeCloseTo(5000 / 1e6 + (400 * 5) / 1e6, 9)
    })

    it('books the purpose the caller gave, and unknown when it gave none (#578)', async () => {
      const { client } = stubClient(OK)
      await callClaudeSDK('screenshot-critic', 'sys', [textBlock('x')], {
        client,
        purpose: 'rejudge',
      })
      await callClaudeSDK('screenshot-critic', 'sys', [textBlock('x')], { client })
      expect(getUsageRecords().map((r) => r.purpose)).toEqual(['rejudge', 'unknown'])
    })

    it('books nothing when the call throws', async () => {
      const client = { messages: { create: vi.fn().mockRejectedValue(new Error('boom')) } }
      await expect(
        callClaudeSDK('mockup-critic', 'sys', [textBlock('x')], { client })
      ).rejects.toThrow()
      expect(getUsageRecords()).toHaveLength(0)
    })
  })
})
