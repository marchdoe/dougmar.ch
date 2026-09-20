/**
 * Routing for the pipeline's two vision critics (mockup-critic,
 * screenshot-critic).
 *
 * With an API key (CI, or a deliberate billed local run) the call goes through
 * the SDK with real image blocks — the model sees the pixels, and three
 * 1440x900 JPEGs cost roughly 5k input tokens.
 *
 * Without a key (local Max-plan dev) the call falls back to the `claude` CLI
 * with the TEXT blocks only. The images are dropped rather than inlined as
 * base64 data-URIs: the CLI bills that base64 as text (~336k tokens for a
 * 360KB image) and the model still can't see it, so a blind critique costs
 * dollars and returns a hallucination. A critic told plainly that no image is
 * available gives a cheaper and more honest answer.
 *
 * @module
 */

import {
  assertNotAutomated,
  isMockMode,
  isRecording,
  nextFixture,
  recordFixture,
} from './agent-fixtures.js'
import { callClaudeCLI } from './claude-cli.js'
import { callClaudeSDK, hasApiKey } from './claude-sdk.js'
import { modelFor } from './models.js'
import { ModelTransportError } from './model-transport-error.js'
import { VisionTruncatedError } from './vision-truncated-error.js'

/** Prepended to the CLI fallback prompt so the critic never invents pixels. */
export const NO_IMAGE_NOTICE =
  'NOTE: no screenshot is attached to this request — this run has no API key, ' +
  'so image input is unavailable. Judge only what the text below states. Do NOT ' +
  'describe, guess at, or invent anything about the rendered pixels; base your ' +
  'verdict on the declared brief, measurables, and shell alone.'

/**
 * Flatten content blocks to the plain-text prompt the CLI path takes,
 * dropping every image block.
 *
 * @param {Array<{type: string, text?: string}>} contentBlocks
 * @returns {string}
 */
export function blocksToText(contentBlocks) {
  return contentBlocks
    .filter((block) => block.type === 'text' && block.text)
    .map((block) => block.text)
    .join('\n\n---\n\n')
}

/**
 * One SDK vision attempt. A max_tokens truncation is not a transport
 * failure: the critic saw the pixels and was mid-answer. Falling straight to
 * the text-only CLI here is how #486 shipped a build the critic never
 * actually re-saw as SHIPPED-WITH-FAULTS — the CLI, told plainly it has no
 * screenshot, correctly said REVISE for the wrong reason.
 *
 * A truncation is not retried. The retry used to append a "keep it short"
 * notice, but that limits the visible answer and the cap is spent on
 * adaptive thinking, so the second call truncated like the first (#570).
 *
 * @param {object} opts
 * @param {string} opts.agentName
 * @param {string} opts.systemPrompt
 * @param {Array<object>} opts.contentBlocks
 * @param {number} [opts.maxTokens]
 * @param {number} [opts.timeoutMs]
 * @returns {Promise<{ channel: 'sdk-vision', text: string } |
 *   { channel: 'sdk-vision-truncated', error: VisionTruncatedError } |
 *   { channel: 'cli-text-fallback', fallback: true }>}
 */
async function attemptSdkVision({ agentName, systemPrompt, contentBlocks, maxTokens, timeoutMs }) {
  try {
    // Throws ModelTransportError on an empty reply, or the `truncated: true`
    // error from claude-sdk.js's assertNotTruncated on a max_tokens stop —
    // the catch below tells those apart.
    const text = await callClaudeSDK(agentName, systemPrompt, contentBlocks, {
      maxTokens,
      timeoutMs,
    })
    if (!text?.trim()) {
      throw new ModelTransportError({ agent: agentName, channel: 'sdk-vision', emptyReply: true })
    }
    // The CLI path records inside callClaudeCLI; the SDK path has to do it
    // here or a recorded run would have no fixture for either critic.
    if (isRecording()) recordFixture(agentName, text)
    return { channel: 'sdk-vision', text }
  } catch (err) {
    if (err.truncated) {
      console.warn(
        `  [${agentName}] SDK vision call truncated at max_tokens — no verdict, not falling back to text-only CLI`
      )
      return {
        channel: 'sdk-vision-truncated',
        error: new VisionTruncatedError({ agent: agentName, reason: err.message }),
      }
    }
    console.warn(
      `  [${agentName}] SDK vision call failed (${err.message}) — falling back to text-only CLI`
    )
    return { channel: 'cli-text-fallback', fallback: true }
  }
}

/**
 * Call a vision agent with the best channel available.
 *
 * @param {object} args
 * @param {string} args.agentName
 * @param {string} args.systemPrompt
 * @param {Array<{type: string, text?: string, source?: object}>} args.contentBlocks -
 *   ordered text/image blocks for the SDK path
 * @param {number} [args.maxTokens]
 * @param {number} [args.timeoutMs]
 * @param {number} [args.stallTimeoutMs] - CLI path only
 * @param {(channel: string) => void} [args.onChannel] - told which channel
 *   actually answered: 'sdk-vision', 'sdk-vision-truncated' (the SDK saw the
 *   images but stopped at max_tokens; the call then throws), 'cli-text-fallback'
 *   (the SDK failed for another reason), 'cli-text-no-key', or
 *   'fixture-replay' (MOCK_MODE, nothing was called).
 *   Without this the degradation is invisible: a 400 from a bad thinking param
 *   or a wrong model id silently turns both vision gates into text-only, and a
 *   critic can APPROVE a design it never saw.
 * @returns {Promise<string>} raw assistant text (callers parse their own verdicts)
 * @throws {VisionTruncatedError} when the SDK reply stopped at max_tokens. It
 *   is thrown, never returned as text, so no caller can parse it as a verdict.
 */
export async function callVisionAgent(args) {
  const { agentName, systemPrompt, contentBlocks, maxTokens, timeoutMs, stallTimeoutMs } = args
  const onChannel = args.onChannel ?? (() => {})
  const imageCount = contentBlocks.filter((block) => block.type === 'image').length

  // The fixture seam sits in front of BOTH channels. It used to live only in
  // callClaudeCLI, so with a key in the environment MOCK_MODE replayed the
  // text agents and quietly billed the two vision critics through the SDK
  // (#293) — #220 again on the second door. Same for the CI refusal: a mocked
  // run inside Actions failed partially instead of fast.
  assertNotAutomated()
  if (isMockMode()) {
    const response = nextFixture(agentName)
    console.log(`  [${agentName}] replayed fixture (${(response.length / 1024).toFixed(0)}KB)`)
    onChannel('fixture-replay')
    return response
  }

  // Which channel a ModelTransportError from the CLI call below should name.
  // 'cli' unless the SDK path was actually tried and came back dead — then
  // this text call IS the fallback, and the error should say so.
  let cliChannel = 'cli'

  if (hasApiKey() && imageCount > 0) {
    const result = await attemptSdkVision({
      agentName,
      systemPrompt,
      contentBlocks,
      maxTokens,
      timeoutMs,
    })
    onChannel(result.channel)
    if (result.error) throw result.error
    if (!result.fallback) return result.text
    cliChannel = result.channel
  } else if (imageCount > 0) {
    console.warn(
      `  [${agentName}] no ANTHROPIC_API_KEY — ${imageCount} screenshot(s) dropped; text-only critique`
    )
    onChannel('cli-text-no-key')
  } else {
    onChannel('cli-text-no-images')
  }

  const textPrompt = [NO_IMAGE_NOTICE, blocksToText(contentBlocks)].join('\n\n---\n\n')
  return await callClaudeCLI(agentName, systemPrompt, textPrompt, {
    model: modelFor(agentName),
    timeoutMs,
    stallTimeoutMs,
    channel: cliChannel,
  })
}
