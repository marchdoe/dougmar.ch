/**
 * Routing for the pipeline's two vision critics (mockup-critic,
 * screenshot-critic).
 *
 * With an API key (CI, or a deliberate billed local run) the call goes through
 * the SDK with real image blocks — the model sees the pixels, and three
 * 1440x900 JPEGs cost roughly 5k input tokens.
 *
 * Without a key (local Max-plan dev) the call goes to the `claude` CLI, which
 * takes no image blocks. Inlining the images as base64 data-URIs is no answer:
 * the CLI bills that base64 as text (~336k tokens for a 360KB image) and the
 * model still can't see it. Until spec 11's 1d the images were dropped and the
 * critic was told so (NO_IMAGE_NOTICE). Phase 0 of that spec showed a keyless
 * CLI call with the Read tool reads a PNG or JPG path correctly, at about 1.5k
 * to 2k input tokens an image. So each image is now written to a private temp
 * directory, the prompt lists the paths where the images stood, and the CLI
 * gets Read for that directory only (see claude-cli.js). The channel is
 * `cli-vision`. This covers both critics, mockup and screenshot. The notice
 * survives for the calls that really have no image: none was attached, the
 * temp files could not be written, or the SDK failed with a key present
 * (`cli-text-fallback`, still text only).
 *
 * @module
 */

import { mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
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

/** Prepended to a text-only CLI prompt so the critic never invents pixels. */
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

/** File extension per image media type; anything else is written as .jpg. */
const IMAGE_EXTENSIONS = { 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }

/**
 * Write every image block to its own file in a fresh temp directory under the
 * process's temp area. The directory is resolved through realpath (on macOS
 * os.tmpdir() sits behind the /var symlink), so the paths the prompt names
 * are the same paths the CLI sees as inside its working directory.
 *
 * @param {Array<{type: string, source?: {media_type?: string, data?: string}}>} contentBlocks
 * @returns {Promise<{ dir: string, paths: string[] }>} `paths` in block order
 */
async function writeImageFiles(contentBlocks) {
  const dir = await realpath(await mkdtemp(path.join(os.tmpdir(), 'vision-')))
  const paths = []
  try {
    for (const block of contentBlocks) {
      if (block.type !== 'image') continue
      const ext = IMAGE_EXTENSIONS[block.source?.media_type] ?? 'jpg'
      const file = path.join(dir, `image-${paths.length + 1}.${ext}`)
      await writeFile(file, Buffer.from(block.source?.data ?? '', 'base64'))
      paths.push(file)
    }
  } catch (err) {
    await rm(dir, { recursive: true, force: true })
    throw err
  }
  return { dir, paths }
}

/**
 * The CLI prompt for a call whose images are on disk: a line saying how many
 * there are and to Read each one, then the blocks in order with each image
 * replaced by its path, so "the screenshot follows:" is still followed by it.
 *
 * @param {Array<{type: string, text?: string}>} contentBlocks
 * @param {string[]} imagePaths one per image block, in block order
 * @returns {string}
 */
export function blocksToCliPrompt(contentBlocks, imagePaths) {
  let next = 0
  const parts = contentBlocks
    .map((block) => {
      if (block.type === 'image') {
        next += 1
        return `[Image ${next}: ${imagePaths[next - 1]}]`
      }
      return block.type === 'text' ? block.text : ''
    })
    .filter(Boolean)
  const notice =
    `${imagePaths.length} image(s) come with this request as files. Use the Read tool on each ` +
    'path in square brackets below before you answer, and read nothing else. Judge the images ' +
    'as the screenshots they are.'
  return [notice, ...parts].join('\n\n---\n\n')
}

/**
 * A keyless call that reads its images from disk. The temp directory is
 * removed whatever the call does.
 *
 * @param {object} opts
 * @param {string} opts.agentName
 * @param {string} opts.systemPrompt
 * @param {Array<object>} opts.contentBlocks
 * @param {{ dir: string, paths: string[] }} opts.files from writeImageFiles
 * @param {object} opts.cliOptions timeouts and purpose, passed through
 * @returns {Promise<string>}
 */
async function callCliWithImages({ agentName, systemPrompt, contentBlocks, files, cliOptions }) {
  try {
    return await callClaudeCLI(
      agentName,
      systemPrompt,
      blocksToCliPrompt(contentBlocks, files.paths),
      {
        ...cliOptions,
        model: modelFor(agentName),
        channel: 'cli-vision',
        readableDir: files.dir,
        // One Read per image, the answer, and one spare for a retried Read.
        maxTurns: files.paths.length + 2,
      }
    )
  } finally {
    await rm(files.dir, { recursive: true, force: true })
  }
}

/**
 * Write the images for the keyless path, or null when that failed and the
 * call goes text-only instead.
 * @param {string} agentName
 * @param {Array<object>} contentBlocks
 * @returns {Promise<{ dir: string, paths: string[] }|null>}
 */
async function tryWriteImageFiles(agentName, contentBlocks) {
  try {
    return await writeImageFiles(contentBlocks)
  } catch (err) {
    console.warn(
      `  [${agentName}] could not write screenshots for the CLI (${err.message}); text-only critique`
    )
    return null
  }
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
 * @param {string} [opts.purpose]
 * @returns {Promise<{ channel: 'sdk-vision', text: string } |
 *   { channel: 'sdk-vision-truncated', error: VisionTruncatedError } |
 *   { channel: 'cli-text-fallback', fallback: true }>}
 */
async function attemptSdkVision({
  agentName,
  systemPrompt,
  contentBlocks,
  maxTokens,
  timeoutMs,
  purpose,
}) {
  try {
    // Throws ModelTransportError on an empty reply, or the `truncated: true`
    // error from claude-sdk.js's assertNotTruncated on a max_tokens stop —
    // the catch below tells those apart.
    const text = await callClaudeSDK(agentName, systemPrompt, contentBlocks, {
      maxTokens,
      timeoutMs,
      purpose,
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
 * @param {string} [args.purpose] - why the call is made, for the ledger (`PURPOSES` in cost-ledger.js)
 * @param {(channel: string) => void} [args.onChannel] - told which channel
 *   actually answered: 'sdk-vision', 'sdk-vision-truncated' (the SDK saw the
 *   images but stopped at max_tokens; the call then throws), 'cli-text-fallback'
 *   (the SDK failed for another reason), 'cli-vision' (no key; the CLI read
 *   the images from temp files), 'cli-text-no-key' (no key, and the temp files
 *   could not be written), 'cli-text-no-images', or 'fixture-replay'
 *   (MOCK_MODE, nothing was called). `sawImages` in vision-channels.js says
 *   which of these saw the pixels.
 *   Without this the degradation is invisible: a 400 from a bad thinking param
 *   or a wrong model id silently turns both vision gates into text-only, and a
 *   critic can APPROVE a design it never saw.
 * @returns {Promise<string>} raw assistant text (callers parse their own verdicts)
 * @throws {VisionTruncatedError} when the SDK reply stopped at max_tokens. It
 *   is thrown, never returned as text, so no caller can parse it as a verdict.
 */
export async function callVisionAgent(args) {
  const { agentName, systemPrompt, contentBlocks, maxTokens, timeoutMs, stallTimeoutMs, purpose } =
    args
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
      purpose,
    })
    onChannel(result.channel)
    if (result.error) throw result.error
    if (!result.fallback) return result.text
    cliChannel = result.channel
  } else if (imageCount > 0) {
    const files = await tryWriteImageFiles(agentName, contentBlocks)
    if (files) {
      console.log(
        `  [${agentName}] no ANTHROPIC_API_KEY — ${imageCount} screenshot(s) read from disk`
      )
      onChannel('cli-vision')
      const cliOptions = { timeoutMs, stallTimeoutMs, purpose }
      return await callCliWithImages({ agentName, systemPrompt, contentBlocks, files, cliOptions })
    }
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
    purpose,
  })
}
