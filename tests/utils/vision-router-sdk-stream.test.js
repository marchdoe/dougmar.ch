import { createServer } from 'node:http'
import { APIUserAbortError } from '@anthropic-ai/sdk'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { callClaudeSDK, imageBlock, textBlock } from '../../scripts/utils/claude-sdk.js'
import { budgetFor } from '../../scripts/utils/budgets.js'
import { callVisionAgent } from '../../scripts/utils/vision-router.js'
import { runScreenshotCritic } from '../../scripts/agents/screenshot-critic.js'
import { VisionTruncatedError } from '../../scripts/utils/vision-truncated-error.js'

/**
 * The router, callClaudeSDK and the real Anthropic SDK against a local server
 * speaking the streaming protocol (#791). The stubs in claude-sdk.test.js can
 * only say what the code asked for; this is what proves the SDK's stream hands
 * back a stop_reason and usage the truncation check can read.
 */

const BLOCKS = [textBlock('## Brief'), imageBlock(Buffer.from([1, 2, 3]))]
const SHIP = '===VERDICT===\nSHIP\n===END==='

function sse(event, data) {
  return `event: ${event}\ndata: ${JSON.stringify({ type: event, ...data })}\n\n`
}

function messageEvents({ stopReason, outputTokens, text }) {
  return [
    sse('message_start', {
      message: {
        id: 'msg_1',
        type: 'message',
        role: 'assistant',
        model: 'claude-sonnet-5',
        content: [],
        stop_reason: null,
        usage: { input_tokens: 100, output_tokens: 1 },
      },
    }),
    sse('content_block_start', { index: 0, content_block: { type: 'text', text: '' } }),
    sse('content_block_delta', { index: 0, delta: { type: 'text_delta', text } }),
    sse('content_block_stop', { index: 0 }),
    sse('message_delta', {
      delta: { stop_reason: stopReason },
      usage: { output_tokens: outputTokens },
    }),
    sse('message_stop', {}),
  ]
}

describe('callVisionAgent over a real SDK stream', () => {
  let server
  let respond
  const requests = []

  beforeAll(async () => {
    server = createServer((req, res) => {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        requests.push(JSON.parse(body))
        res.writeHead(200, { 'content-type': 'text/event-stream' })
        respond(res, requests.length)
      })
    })
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  })

  afterAll(() => {
    server.closeAllConnections()
    server.close()
  })

  function pointSdkAtLocalServer() {
    requests.length = 0
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-local-test')
    vi.stubEnv('ANTHROPIC_BASE_URL', `http://127.0.0.1:${server.address().port}`)
  }

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  function write(res, events) {
    for (const event of events) res.write(event)
    res.end()
  }

  it('returns a reply past the old 16000 cap, on the screenshot critic budget', async () => {
    pointSdkAtLocalServer()
    respond = (res) =>
      write(res, messageEvents({ stopReason: 'end_turn', outputTokens: 23325, text: SHIP }))

    const channels = []
    const text = await callVisionAgent({
      agentName: 'screenshot-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
      ...budgetFor('screenshot-critic'),
      onChannel: (c) => channels.push(c),
    })

    expect(text).toBe(SHIP)
    expect(channels).toEqual(['sdk-vision'])
    expect(requests[0]).toMatchObject({ stream: true, max_tokens: 32000 })
  })

  it('keeps a truncated stream as no verdict', async () => {
    pointSdkAtLocalServer()
    respond = (res) =>
      write(res, messageEvents({ stopReason: 'max_tokens', outputTokens: 32000, text: 'half a' }))

    await expect(
      callVisionAgent({
        agentName: 'screenshot-critic',
        systemPrompt: 'sys',
        contentBlocks: BLOCKS,
        ...budgetFor('screenshot-critic'),
      })
    ).rejects.toBeInstanceOf(VisionTruncatedError)
    expect(requests).toHaveLength(1)

    const result = await runScreenshotCritic({
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
      wantsBar: false,
      purpose: 'rejudge',
    })
    expect(result).toMatchObject({
      verdict: 'UNVERIFIED',
      visionChannel: 'sdk-vision-truncated',
      criticResponse: expect.stringContaining('32000 output tokens, cap 32000'),
    })
  })

  it('retries when the stream reports an overload after the headers', async () => {
    pointSdkAtLocalServer()
    respond = (res, attempt) => {
      if (attempt === 1) {
        write(res, [
          `event: error\ndata: ${JSON.stringify({
            type: 'error',
            error: { type: 'overloaded_error', message: 'Overloaded' },
          })}\n\n`,
        ])
      } else {
        write(res, messageEvents({ stopReason: 'end_turn', outputTokens: 900, text: SHIP }))
      }
    }

    const channels = []
    const text = await callVisionAgent({
      agentName: 'screenshot-critic',
      systemPrompt: 'sys',
      contentBlocks: BLOCKS,
      ...budgetFor('screenshot-critic'),
      onChannel: (c) => channels.push(c),
    })

    expect(text).toBe(SHIP)
    expect(channels).toEqual(['sdk-vision'])
    expect(requests).toHaveLength(2)
  }, 15_000)

  it('gives up on a stream that hangs once its deadline passes', async () => {
    pointSdkAtLocalServer()
    // Headers go out, then nothing: the SDK's own timeout has already stopped
    // counting, so only the signal can end this.
    respond = (res) => res.flushHeaders()

    // callClaudeSDK rather than the router, which would answer this failure by
    // starting the text-only CLI.
    const started = Date.now()
    const error = await callClaudeSDK('screenshot-critic', 'sys', BLOCKS, {
      maxTokens: 32000,
      timeoutMs: 1500,
    }).catch((err) => err)

    expect(error).toBeInstanceOf(APIUserAbortError)
    expect(Date.now() - started).toBeLessThan(5000)
    expect(requests).toHaveLength(1)
  }, 15_000)
})
