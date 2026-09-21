/**
 * The paid responses of a night's first stages, kept so a re-run can be
 * handed them back instead of buying them again.
 *
 * On 2026-09-20 the scheduled run failed in the engineer phase. The manual
 * re-run paid again for the Art Director and three mockup rounds, $2.73, before
 * it reached the engineer that had actually failed (#578). Most of a failed
 * night's money is spent before the engineer starts, and nothing after that
 * point touches what those stages produced.
 *
 * What is kept is the raw text each of those calls returned, per agent and in
 * order, not the parsed results. On a resume the swarm runs exactly the code a
 * live run runs: the same parse, the same validators, the same rejected and
 * retried answers, the same mockup rounds and settle choice. Only the model
 * call is answered from the tape. A resume therefore has no second code path
 * to drift from the first, and a tape written by an earlier run is data that
 * meets every gate a fresh model reply meets.
 *
 * Calls after the mockup loop (the engineer and the screenshot critic) are not
 * taped: a resume exists to try them again. A tape that runs out mid-stage
 * (the original run stopped there) falls through to the live call.
 *
 * The state is module-level, like the cost ledger, and for the same reason:
 * the call sites return plain strings that many callers destructure.
 *
 * @module
 */

import { callClaudeCLI } from './claude-cli.js'
import { callVisionAgent } from './vision-router.js'
import { recordUsage } from './cost-ledger.js'
import { modelFor } from './models.js'

/** The agents whose responses are kept: every paid call before the engineer. */
export const TAPED_AGENTS = Object.freeze(['art-director', 'mockup-designer', 'mockup-critic'])

/**
 * @typedef {{ agent: string, text: string, channel: string }} TapeEntry
 */

/** @type {TapeEntry[]} */
let recorded = []
/** @type {Map<string, TapeEntry[]>} */
let pending = new Map()
/** @type {Record<string, number>} */
let loadedCounts = {}

/**
 * Begin a run's tape. Called once at the top of a run, with the entries an
 * earlier run left (validated by `parseHandoff`) or none.
 *
 * @param {TapeEntry[]} [entries]
 */
export function startTape(entries = []) {
  recorded = []
  pending = new Map()
  loadedCounts = {}
  for (const entry of entries) {
    if (!pending.has(entry.agent)) pending.set(entry.agent, [])
    pending.get(entry.agent).push(entry)
    loadedCounts[entry.agent] = (loadedCounts[entry.agent] ?? 0) + 1
  }
}

/**
 * Everything this run's stages consumed, replayed and live alike, in order.
 * A resumed run that fails leaves a tape that a further resume can use whole.
 * @returns {TapeEntry[]}
 */
export function recordedCalls() {
  return recorded.map((entry) => ({ ...entry }))
}

/**
 * The trace step that says a run began from an earlier run's responses, so
 * `trace.json` does not read as a night whose Art Director took no time.
 * Does nothing on a run that has no tape to serve.
 *
 * @param {{ addStep: (step: object) => void }} trace
 */
export function traceReplay(trace) {
  const total = Object.values(loadedCounts).reduce((sum, n) => sum + n, 0)
  if (total === 0) return
  trace.addStep({
    name: 'resume',
    phase: 0,
    input: {},
    output: { replayed: { ...loadedCounts }, total },
    durationMs: 0,
  })
}

/** The next unserved response for an agent, or null when none is left. */
function takeReplay(agentName) {
  return pending.get(agentName)?.shift() ?? null
}

/**
 * Book a served response in the ledger at no cost, so `cost.json` still lists
 * the call the stage made and says it was free.
 */
function bookReplay(agentName) {
  try {
    recordUsage({
      agent: agentName,
      purpose: 'replay',
      model: modelFor(agentName),
      source: 'cli',
      costUsd: 0,
      ms: 0,
    })
  } catch {}
}

/**
 * `callClaudeCLI` with the tape in front of it: the recorded response when the
 * tape has one for this agent, otherwise the live call, whose answer is kept.
 *
 * @param {string} agentName
 * @param {string} systemPrompt
 * @param {string} promptText
 * @param {object} [options] as `callClaudeCLI`
 * @returns {Promise<string>}
 */
export async function callTapedCLI(agentName, systemPrompt, promptText, options = {}) {
  const replay = takeReplay(agentName)
  if (replay) {
    bookReplay(agentName)
    console.log(`  [${agentName}] answered from the failed run's tape (no model call)`)
    recorded.push(replay)
    return replay.text
  }
  const text = await callClaudeCLI(agentName, systemPrompt, promptText, options)
  recorded.push({ agent: agentName, text, channel: 'cli' })
  return text
}

/**
 * `callVisionAgent` with the tape in front of it. A replayed answer reports the
 * channel it originally arrived on, so a verdict reached with pixels stays one
 * in `verdicts.json`.
 *
 * @param {object} args as `callVisionAgent`
 * @returns {Promise<string>}
 */
export async function callTapedVision(args) {
  const replay = takeReplay(args.agentName)
  if (replay) {
    bookReplay(args.agentName)
    console.log(`  [${args.agentName}] answered from the failed run's tape (no model call)`)
    args.onChannel?.(replay.channel)
    recorded.push(replay)
    return replay.text
  }
  let channel = 'unknown'
  const text = await callVisionAgent({
    ...args,
    onChannel: (c) => {
      channel = c
      args.onChannel?.(c)
    },
  })
  recorded.push({ agent: args.agentName, text, channel })
  return text
}
