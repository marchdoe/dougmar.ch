/**
 * Anthropic SDK call path — the only way an agent in this pipeline can
 * actually SEE an image.
 *
 * The `claude` CLI path (utils/claude-cli.js) takes one flat string. A
 * screenshot embedded in that string as a `data:image/jpeg;base64,...` URI is
 * billed as raw text (~1.07 chars/token — a 360KB JPEG is ~336k input tokens)
 * and the model never decodes it: a solid-red probe image came back described
 * as "light gray". Real vision needs structured content blocks, which means
 * the SDK and an API key.
 *
 * Text-only agents stay on the CLI (Max-plan auth, no API spend in local dev).
 * Only the vision critics route here, and only when ANTHROPIC_API_KEY is set.
 *
 * @module
 */

import Anthropic, { APIConnectionError } from '@anthropic-ai/sdk'
import { modelFor, supportsAdaptiveThinking } from './models.js'
import { noteRetry, recordUsage } from './cost-ledger.js'
import { clampToBudget } from './run-budget.js'

/**
 * @typedef {{ type: 'text', text: string }} TextBlock
 * @typedef {{ type: 'image', source: { type: 'base64', media_type: string, data: string } }} ImageBlock
 * @typedef {TextBlock | ImageBlock} ContentBlock
 */

/** Default output ceiling. Critics write a page or two of prose, not files. */
const DEFAULT_MAX_TOKENS = 16000

/** Matches the CLI path's default hard timeout (10 min). */
const DEFAULT_TIMEOUT_MS = 600000

/**
 * Retries on a transient failure, same count as the SDK's own default. The
 * SDK's retries are turned off (#294): they were invisible to the cost
 * ledger's retry count and each one restarted the per-request timeout, so a
 * critic budgeted at 10 minutes could hold 30. Ours are booked with
 * noteRetry() and share one deadline with the first attempt.
 */
const DEFAULT_RETRIES = 2

/** Backoff before the Nth retry (1-based): 2s, 4s. */
const RETRY_BACKOFF_MS = [2000, 4000]

/**
 * Whether an SDK error is worth another attempt: connection errors, rate
 * limits, overload and other server-side failures. A 400 (bad thinking
 * param, wrong model id) is not going to get better, and neither is an error
 * that did not come from the API at all.
 * @param {unknown} err
 * @returns {boolean}
 */
export function isRetryableSdkError(err) {
  if (err instanceof APIConnectionError) return true
  const status = err && typeof err === 'object' ? err.status : undefined
  if (typeof status !== 'number') return false
  return status === 408 || status === 409 || status === 429 || status >= 500
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Wrap an image buffer as an Anthropic image content block.
 *
 * JPEG only, by convention: snapshot.js captures both PNG and JPEG (q70) and
 * the JPEGs run 5-10x smaller for the same visual judgement.
 *
 * @param {Buffer} buffer
 * @param {string} [mediaType='image/jpeg']
 * @returns {ImageBlock}
 */
export function imageBlock(buffer, mediaType = 'image/jpeg') {
  return {
    type: 'image',
    source: { type: 'base64', media_type: mediaType, data: buffer.toString('base64') },
  }
}

/**
 * Wrap a string as a text content block.
 * @param {string} text
 * @returns {TextBlock}
 */
export function textBlock(text) {
  return { type: 'text', text }
}

/**
 * True when the SDK path is usable at all. No key means local Max-plan dev,
 * where multimodal input is not available to us.
 * @returns {boolean}
 */
export function hasApiKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

/**
 * @param {string} agentName
 * @param {string|undefined} apiKey
 * @param {unknown} contentBlocks
 */
function assertSdkInputs(agentName, apiKey, contentBlocks) {
  if (!apiKey) throw new Error(`[${agentName}] callClaudeSDK requires ANTHROPIC_API_KEY`)
  if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
    throw new Error(`[${agentName}] callClaudeSDK requires at least one content block`)
  }
}

/**
 * The API returns token counts and no price; the ledger prices these from
 * its own table and marks them estimated. A ledger failure must not fail a
 * call that succeeded.
 * @param {string} agentName
 * @param {string} model
 * @param {object} usage
 * @param {number} ms
 */
function bookUsage(agentName, model, usage, ms) {
  try {
    recordUsage({ agent: agentName, model, source: 'sdk', usage, ms })
  } catch {}
}

/**
 * A max_tokens stop is a truncated answer, not an answer. A critic cut off
 * before its ===VERDICT=== block used to fail closed to REVISE and buy a
 * full engineer round for a formatting accident (#300). Called after the
 * usage is booked: the tokens were spent either way.
 *
 * The thrown error carries `truncated: true` so a caller (vision-router.js)
 * can tell this apart from a transport failure: a vision critic cut off at
 * the cap saw the images and had something to say, which is a different
 * situation from a dead connection or a bad model id (#486).
 * @param {string} agentName
 * @param {{ stop_reason?: string, usage?: { output_tokens?: number } }} response
 * @param {number} maxTokens
 */
function assertNotTruncated(agentName, response, maxTokens) {
  if (response.stop_reason !== 'max_tokens') return
  const err = new Error(
    `[${agentName}] response truncated at max_tokens (${response.usage?.output_tokens ?? '?'} output tokens, cap ${maxTokens})`
  )
  err.truncated = true
  throw err
}

/**
 * The thinking param to send: an explicit choice wins (null disables),
 * otherwise adaptive where the model supports it.
 * @param {string} model
 * @param {object|null|undefined} explicit
 * @returns {object|null}
 */
function resolveThinking(model, explicit) {
  if (explicit !== undefined) return explicit
  return supportsAdaptiveThinking(model) ? { type: 'adaptive' } : null
}

/**
 * Counts for the call log.
 * @param {ContentBlock[]} contentBlocks
 * @returns {{ imageCount: number, textChars: number }}
 */
function describeBlocks(contentBlocks) {
  let imageCount = 0
  let textChars = 0
  for (const block of contentBlocks) {
    if (block.type === 'image') imageCount += 1
    else if (block.type === 'text') textChars += block.text.length
  }
  return { imageCount, textChars }
}

/**
 * One messages.create with the pipeline's own retry policy.
 *
 * Each attempt gets only what is left of the one budget, so three attempts
 * cannot outlive the timeout the caller asked for, and a retry is not started
 * when its backoff would land past the deadline.
 *
 * @param {object} client - Anthropic client (or a test stub with messages.create)
 * @param {object} params - messages.create params
 * @param {{ agentName: string, retries: number, deadline: number }} opts
 * @returns {Promise<object>} the API response
 */
async function createWithRetries(client, params, { agentName, retries, deadline }) {
  for (let attempt = 0; ; attempt++) {
    const timeout = Math.max(1000, deadline - Date.now())
    try {
      return await client.messages.create(params, { timeout, maxRetries: 0 })
    } catch (err) {
      const backoff = RETRY_BACKOFF_MS[Math.min(attempt, RETRY_BACKOFF_MS.length - 1)]
      const outOfTime = Date.now() + backoff >= deadline
      if (attempt >= retries || !isRetryableSdkError(err) || outOfTime) throw err
      noteRetry()
      console.warn(
        `  [${agentName}] SDK call failed (${err.status ?? 'no status'}: ${err.message}) — retry ${attempt + 1}/${retries} in ${backoff / 1000}s`
      )
      await sleep(backoff)
    }
  }
}

/**
 * Call Claude with structured content blocks (text + image) via the API.
 *
 * @param {string} agentName - pipeline agent name; also selects the model via modelFor()
 * @param {string} systemPrompt
 * @param {ContentBlock[]} contentBlocks - the single user turn's content
 * @param {object} [opts]
 * @param {string} [opts.apiKey] - defaults to process.env.ANTHROPIC_API_KEY
 * @param {string} [opts.model] - defaults to modelFor(agentName)
 * @param {number} [opts.maxTokens=16000]
 * @param {number} [opts.timeoutMs=600000] - hard cap for ALL attempts together
 * @param {number} [opts.retries=2] - extra attempts on a transient failure
 * @param {object|null} [opts.thinking] - null disables; defaults to adaptive where supported
 * @param {object} [opts.client] - injectable Anthropic client (tests)
 * @returns {Promise<string>} concatenated assistant text blocks
 */
export async function callClaudeSDK(agentName, systemPrompt, contentBlocks, opts = {}) {
  const apiKey = opts.apiKey ?? process.env.ANTHROPIC_API_KEY
  assertSdkInputs(agentName, apiKey, contentBlocks)

  const model = opts.model ?? modelFor(agentName)
  const maxTokens = opts.maxTokens ?? DEFAULT_MAX_TOKENS
  // Same bound as callClaudeCLI (#295). Without it the two vision critics
  // were the only calls that could outlive the run deadline: at minute 58 of
  // a 60-minute budget the screenshot critic could start a 10-minute call
  // and be killed by the Actions timeout with no trace written.
  const requestedTimeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const timeoutMs = clampToBudget(requestedTimeoutMs)
  if (timeoutMs < requestedTimeoutMs) {
    console.log(
      `  [${agentName}] timeout clamped ${Math.round(requestedTimeoutMs / 60000)}m → ${Math.round(timeoutMs / 60000)}m by the run budget`
    )
  }
  const thinking = resolveThinking(model, opts.thinking)
  const retries = opts.retries ?? DEFAULT_RETRIES
  const client = opts.client ?? new Anthropic({ apiKey, timeout: timeoutMs, maxRetries: 0 })

  const { imageCount, textChars } = describeBlocks(contentBlocks)
  console.log(
    `  [${agentName}] calling Anthropic SDK (model=${model}, ${imageCount} image block(s), ${(textChars / 1024).toFixed(0)}KB text)`
  )

  const params = {
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: contentBlocks }],
    ...(thinking ? { thinking } : {}),
  }

  const started = Date.now()
  const response = await createWithRetries(client, params, {
    agentName,
    retries,
    deadline: started + timeoutMs,
  })

  const text = (response.content ?? [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')

  const usage = response.usage ?? {}
  const elapsedMs = Date.now() - started
  bookUsage(agentName, model, usage, elapsedMs)
  assertNotTruncated(agentName, response, maxTokens)
  console.log(
    `  [${agentName}] SDK finished in ${Math.round(elapsedMs / 1000)}s ` +
      `(in=${usage.input_tokens ?? '?'}, out=${usage.output_tokens ?? '?'}, stop=${response.stop_reason ?? '?'}, ${(text.length / 1024).toFixed(0)}KB text)`
  )

  return text
}
