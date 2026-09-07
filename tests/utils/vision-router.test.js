import { beforeEach, describe, expect, it, vi } from 'vitest'

const sdkMock = vi.fn()
const cliMock = vi.fn()

vi.mock('../../scripts/utils/claude-sdk.js', async (importOriginal) => {
  /** @type {typeof import('../../scripts/utils/claude-sdk.js')} */
  const actual = await importOriginal()
  return {
    ...actual,
    callClaudeSDK: sdkMock,
    hasApiKey: () => Boolean(process.env.ANTHROPIC_API_KEY),
  }
})
vi.mock('../../scripts/utils/claude-cli.js', () => ({ callClaudeCLI: cliMock }))

const nextFixtureMock = vi.fn()
const recordFixtureMock = vi.fn()
vi.mock('../../scripts/utils/agent-fixtures.js', async (importOriginal) => {
  /** @type {typeof import('../../scripts/utils/agent-fixtures.js')} */
  const actual = await importOriginal()
  return { ...actual, nextFixture: nextFixtureMock, recordFixture: recordFixtureMock }
})

const { imageBlock, textBlock } = await import('../../scripts/utils/claude-sdk.js')
const { BOUNDED_FORMAT_RETRY_NOTICE, NO_IMAGE_NOTICE, blocksToText, callVisionAgent } =
  await import('../../scripts/utils/vision-router.js')

/** Mirrors the `truncated: true` error claude-sdk.js's assertNotTruncated throws. */
function truncatedError(agentName = 'screenshot-critic') {
  const err = new Error(
    `[${agentName}] response truncated at max_tokens (16000 output tokens, cap 16000)`
  )
  err.truncated = true
  return err
}

const BLOCKS = [
  textBlock('## Brief'),
  textBlock('LIGHT scheme:'),
  imageBlock(Buffer.from([0x01, 0x02, 0x03])),
]

describe('blocksToText', () => {
  it('keeps text blocks and drops images', () => {
    expect(blocksToText(BLOCKS)).toBe('## Brief\n\n---\n\nLIGHT scheme:')
  })
})

describe('callVisionAgent', () => {
  beforeEach(() => {
    sdkMock.mockReset()
    cliMock.mockReset()
    nextFixtureMock.mockReset()
    recordFixtureMock.mockReset()
    vi.unstubAllEnvs()
    vi.stubEnv('PIPELINE_TIER', 'prod')
  })

  it('routes to the SDK with image blocks when an API key is present', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    sdkMock.mockResolvedValue('===VERDICT===\nSHIP\n===END===')

    const result = await callVisionAgent({
      agentName: 'screenshot-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
    })

    expect(result).toBe('===VERDICT===\nSHIP\n===END===')
    expect(cliMock).not.toHaveBeenCalled()
    const [agentName, systemPrompt, blocks] = sdkMock.mock.calls[0]
    expect(agentName).toBe('screenshot-critic')
    expect(systemPrompt).toBe('sys')
    expect(blocks).toEqual(BLOCKS)
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(1)
  })

  it('falls back to the text-only CLI when no API key is set', async () => {
    cliMock.mockResolvedValue('cli text')

    const result = await callVisionAgent({
      agentName: 'mockup-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
    })

    expect(result).toBe('cli text')
    expect(sdkMock).not.toHaveBeenCalled()
    const [agentName, systemPrompt, prompt, opts] = cliMock.mock.calls[0]
    expect(agentName).toBe('mockup-critic')
    expect(systemPrompt).toBe('sys')
    expect(prompt).toContain(NO_IMAGE_NOTICE)
    expect(prompt).toContain('## Brief')
    // No base64 payload smuggled into the text prompt.
    expect(prompt).not.toContain('base64')
    expect(opts.model).toBe('claude-haiku-4-5') // mockup-critic's prod tier (floors-check, not taste)
  })

  it('uses the CLI when there are no images even with an API key', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    cliMock.mockResolvedValue('cli text')

    await callVisionAgent({
      agentName: 'mockup-critic',
      systemPrompt: 'sys',
      contentBlocks: [textBlock('just text')],
    })

    expect(sdkMock).not.toHaveBeenCalled()
    expect(cliMock).toHaveBeenCalledTimes(1)
  })

  // #486: a max_tokens stop is not a transport failure — the critic saw the
  // images and had something to say. Retrying once (bounded-format nudge)
  // and getting a real answer must count as 'sdk-vision', not a fallback.
  it('retries once with a bounded-format instruction when the SDK call truncates, and succeeds', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    sdkMock.mockRejectedValueOnce(truncatedError())
    sdkMock.mockResolvedValueOnce('===VERDICT===\nSHIP\n===END===')

    const channels = []
    const result = await callVisionAgent({
      agentName: 'screenshot-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
      onChannel: (c) => channels.push(c),
    })

    expect(result).toBe('===VERDICT===\nSHIP\n===END===')
    expect(cliMock).not.toHaveBeenCalled()
    expect(sdkMock).toHaveBeenCalledTimes(2)
    expect(channels).toEqual(['sdk-vision'])
    // The retry keeps the same images and appends the one-line instruction.
    const retryBlocks = sdkMock.mock.calls[1][2]
    expect(retryBlocks.slice(0, BLOCKS.length)).toEqual(BLOCKS)
    expect(retryBlocks.at(-1)).toEqual(textBlock(BOUNDED_FORMAT_RETRY_NOTICE))
  })

  it('resolves UNVERIFIED without touching the CLI when the retry also truncates', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    sdkMock.mockRejectedValueOnce(truncatedError())
    sdkMock.mockRejectedValueOnce(truncatedError())

    const channels = []
    const result = await callVisionAgent({
      agentName: 'screenshot-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
      onChannel: (c) => channels.push(c),
    })

    expect(cliMock).not.toHaveBeenCalled()
    expect(sdkMock).toHaveBeenCalledTimes(2)
    expect(channels).toEqual(['sdk-vision-truncated'])
    expect(result).toMatch(/truncated at max_tokens/)
  })

  it('falls back to the CLI when the retry after a truncation fails for a real transport reason', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    sdkMock.mockRejectedValueOnce(truncatedError())
    sdkMock.mockRejectedValueOnce(new Error('overloaded'))
    cliMock.mockResolvedValue('cli fallback')

    const channels = []
    const result = await callVisionAgent({
      agentName: 'screenshot-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
      onChannel: (c) => channels.push(c),
    })

    expect(result).toBe('cli fallback')
    expect(sdkMock).toHaveBeenCalledTimes(2)
    expect(cliMock).toHaveBeenCalledTimes(1)
    expect(channels).toEqual(['cli-text-fallback'])
  })

  it('falls back to the CLI when the SDK call throws', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    sdkMock.mockRejectedValue(new Error('overloaded'))
    cliMock.mockResolvedValue('cli fallback')

    const result = await callVisionAgent({
      agentName: 'mockup-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
    })

    expect(result).toBe('cli fallback')
    expect(sdkMock).toHaveBeenCalledTimes(1)
    expect(cliMock).toHaveBeenCalledTimes(1)
  })

  // #432: an out-of-credits key returns a clean SDK response with no text
  // content at all — not an exception. That must be treated as a transport
  // failure and fall through to the CLI, not resolve as an empty verdict.
  it('falls back to the CLI when the SDK returns no text', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    sdkMock.mockResolvedValue('')
    cliMock.mockResolvedValue('cli fallback')

    const channels = []
    const result = await callVisionAgent({
      agentName: 'mockup-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
      onChannel: (c) => channels.push(c),
    })

    expect(result).toBe('cli fallback')
    expect(sdkMock).toHaveBeenCalledTimes(1)
    expect(cliMock).toHaveBeenCalledTimes(1)
    expect(channels).toEqual(['cli-text-fallback'])
    // The CLI fallback call is told it IS the fallback, so a transport error
    // out of that call names 'cli-text-fallback' rather than the generic 'cli'.
    const [, , , opts] = cliMock.mock.calls[0]
    expect(opts.channel).toBe('cli-text-fallback')
  })

  it('raises the CLI fallback as a transport error too when it also comes back empty', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    const { ModelTransportError } = await import('../../scripts/utils/model-transport-error.js')
    sdkMock.mockResolvedValue('   ')
    cliMock.mockRejectedValue(
      new ModelTransportError({
        agent: 'mockup-critic',
        channel: 'cli-text-fallback',
        emptyReply: true,
      })
    )

    await expect(
      callVisionAgent({ agentName: 'mockup-critic', systemPrompt: 'sys', contentBlocks: BLOCKS })
    ).rejects.toBeInstanceOf(ModelTransportError)
  })

  it('passes timeouts through to both paths', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
    sdkMock.mockResolvedValue('ok')
    await callVisionAgent({
      agentName: 'mockup-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
      timeoutMs: 600000,
      stallTimeoutMs: 300000,
    })
    expect(sdkMock.mock.calls[0][3]).toMatchObject({ timeoutMs: 600000 })

    vi.stubEnv('ANTHROPIC_API_KEY', '')
    cliMock.mockResolvedValue('ok')
    await callVisionAgent({
      agentName: 'mockup-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
      timeoutMs: 600000,
      stallTimeoutMs: 300000,
    })
    expect(cliMock.mock.calls[0][3]).toMatchObject({
      timeoutMs: 600000,
      stallTimeoutMs: 300000,
    })
  })

  // #293: the fixture seam used to live only in callClaudeCLI, so with a key
  // set MOCK_MODE replayed the text agents and billed the vision critics.
  describe('fixtures', () => {
    beforeEach(() => {
      // CI sets GITHUB_ACTIONS=true, which is precisely what assertNotAutomated
      // refuses on. The replay and record cases are about a local run; only
      // the refusal case below opts back in.
      vi.stubEnv('GITHUB_ACTIONS', '')
    })

    it('replays a fixture under MOCK_MODE even when an API key would route to the SDK', async () => {
      vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
      vi.stubEnv('MOCK_MODE', 'true')
      nextFixtureMock.mockReturnValue('===VERDICT===\nAPPROVE\n===END===')
      const channels = []

      const result = await callVisionAgent({
        agentName: 'mockup-critic',
        systemPrompt: 'sys',
        contentBlocks: BLOCKS,
        onChannel: (c) => channels.push(c),
      })

      expect(result).toBe('===VERDICT===\nAPPROVE\n===END===')
      expect(nextFixtureMock).toHaveBeenCalledWith('mockup-critic')
      expect(sdkMock).not.toHaveBeenCalled()
      expect(cliMock).not.toHaveBeenCalled()
      expect(channels).toEqual(['fixture-replay'])
    })

    it('refuses MOCK_MODE inside GitHub Actions before touching the SDK', async () => {
      vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
      vi.stubEnv('MOCK_MODE', 'true')
      vi.stubEnv('GITHUB_ACTIONS', 'true')

      await expect(
        callVisionAgent({ agentName: 'mockup-critic', systemPrompt: 'sys', contentBlocks: BLOCKS })
      ).rejects.toThrow(/MOCK_MODE=true inside GitHub Actions/)
      expect(sdkMock).not.toHaveBeenCalled()
      expect(cliMock).not.toHaveBeenCalled()
    })

    it('records the SDK response as a fixture under RECORD_FIXTURES', async () => {
      vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
      vi.stubEnv('RECORD_FIXTURES', 'true')
      sdkMock.mockResolvedValue('sdk text')

      await callVisionAgent({
        agentName: 'screenshot-critic',
        systemPrompt: 'sys',
        contentBlocks: BLOCKS,
      })

      expect(recordFixtureMock).toHaveBeenCalledWith('screenshot-critic', 'sdk text')
    })

    it('does not record twice when the SDK fails and the CLI answers', async () => {
      vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test')
      vi.stubEnv('RECORD_FIXTURES', 'true')
      sdkMock.mockRejectedValue(new Error('overloaded'))
      cliMock.mockResolvedValue('cli fallback')

      await callVisionAgent({
        agentName: 'screenshot-critic',
        systemPrompt: 'sys',
        contentBlocks: BLOCKS,
      })

      // callClaudeCLI records its own response; the router must not add one.
      expect(recordFixtureMock).not.toHaveBeenCalled()
    })
  })
})
