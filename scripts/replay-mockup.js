#!/usr/bin/env node

/**
 * Replay a saved night through the Art Director and the mockup loop, on a
 * chosen model, and stop before the engineer (spec 11, 1e).
 *
 * Phase 2 of spec 11 is a blind taste test: six past nights, each designed
 * twice, once with Opus 4.8 and once with Opus 5.5 as the Art Director and
 * mockup designer, and Doug votes on the final mockups. The 2026-09-23 arms
 * were full canary runs with PROD_MODELS edited in a commit before each one,
 * and each collected that morning's live signals, so no two arms saw the same
 * night. Nothing could replay a saved night: run-pipeline.js always collects
 * fresh signals, and RESUME_HANDOFF refuses another day's handoff and runs on
 * through the engineer.
 *
 * What the night's Art Director read, and where this rebuilds it from:
 *   - signals: the `signals-loaded` step of the shipped build's trace.json,
 *     which holds the whole signals object. signals/today.yml is gitignored,
 *     so the chore commit never carried it. Written back the way a resume
 *     writes a handoff's signals (handoff.js restoreInputs).
 *   - archive/ and references/: the tree of the commit the nightly ran on,
 *     the parent of `chore: daily redesign <date>`. The ratings, mobile
 *     lessons, mandates, uniqueness history, lane history and calibration
 *     note are all reads over archive/, and none of them filters by the
 *     run's date (the recent nights digest and the hero repeat check do), so
 *     a later night left in place is a night the Art Director sees from the
 *     future. Ratings and reference images added after
 *     the night go too.
 *   - signals/today.references.md: gitignored as well, so it is made again
 *     by the worktree's collect-references.js from the restored library and
 *     signals, as the nightly's own step made it, with its header dated to
 *     the night instead of today.
 *   - the creative weights: the shipped build's build.json, passed as
 *     WEIGHT_*; risk is derived from the date when unset, so this matches
 *     either way.
 * The prompts, the code and signals/taste.md and voice.md are HEAD's: the test
 * asks which model designs better with the prompts that would ship.
 *
 * The run happens in a temporary git worktree of HEAD, like canary.js, so
 * nothing is written into this checkout's signals/, archive/ or public/. The
 * worktree runs this same file with `--inner`, which runs the swarm's context,
 * Art Director and mockup phases under PIPELINE_TIER=prod, with
 * MODEL_OVERRIDE (models.js) moving only the art-director and mockup-designer
 * to the model under test. The mockup critic runs as production runs it.
 * Nothing after the mockup phase runs: no engineer, build, gate or archive.
 *
 * Written to --out: brief.md, signals-brief.md, mockup.html,
 * mockup-1440.png (the capture the critic loop took), mockup-360.png (the
 * first fold at 360, taken from the settled mockup), mockup-360-filmstrip.jpg
 * (the critic's phone filmstrip), verdicts.json, cost.json (the ledger),
 * trace.json, replay.json (date, model, wall time, calls, total) and
 * replay.log.
 *
 * Refuses to run when ANTHROPIC_API_KEY is set (environment or .env) or
 * under GITHUB_ACTIONS, the same refusal the canary makes: this is a local
 * Max-plan run. It runs HEAD, so commit a change before replaying with it.
 *
 * Usage:
 *   node scripts/replay-mockup.js --date YYYY-MM-DD --model opus-4-8|opus-5-5 --out <dir> [--keep]
 */

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  createWorktree,
  defaultExec,
  installDeps,
  refusalReason,
  removeWorktree,
} from './canary.js'
import { isMain } from './utils/cli.js'
import { ROOT } from './utils/file-manager.js'
import { parseModelOverride } from './utils/models.js'
import { restoreInputs } from './utils/handoff.js'

/** The two models the taste test compares, as MODEL_IDS tiers. */
export const REPLAY_MODELS = Object.freeze({ 'opus-4-8': 'opus', 'opus-5-5': 'opus-5-5' })

/** The agents the model under test replaces. The critic keeps its prod model. */
export const REPLAY_AGENTS = Object.freeze(['art-director', 'mockup-designer'])

/** Checkout dirs a replay must never write into. */
const PROTECTED_DIRS = ['signals', 'archive', 'public']

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/**
 * The flags, checked. Throws on anything missing or unknown.
 * @param {string[]} argv
 * @returns {{ date: string, model: string, out: string, keep: boolean, inner: boolean }}
 */
export function parseReplayArgs(argv) {
  const value = (flag) => {
    const i = argv.indexOf(flag)
    return i === -1 ? undefined : argv[i + 1]
  }
  const date = value('--date')
  const model = value('--model')
  const out = value('--out')
  if (!date || !DATE_RE.test(date)) throw new Error('--date YYYY-MM-DD is required')
  if (!model || !Object.hasOwn(REPLAY_MODELS, model)) {
    throw new Error(`--model must be one of ${Object.keys(REPLAY_MODELS).join(', ')}`)
  }
  if (!out) throw new Error('--out <dir> is required')
  return { date, model, out, keep: argv.includes('--keep'), inner: argv.includes('--inner') }
}

/**
 * MODEL_OVERRIDE for a replay: the model under test on the two agents only.
 * Run through the parser modelFor uses, so a name it would refuse fails here.
 * @param {string} model a REPLAY_MODELS key
 * @returns {string}
 */
export function modelOverrideFor(model) {
  const tier = REPLAY_MODELS[model]
  if (!tier) throw new Error(`unknown replay model "${model}"`)
  const raw = REPLAY_AGENTS.map((agent) => `${agent}=${tier}`).join(',')
  parseModelOverride(raw)
  return raw
}

/**
 * Refuse an --out inside this checkout's signals/, archive/ or public/.
 * @param {string} out absolute
 * @param {string} root
 */
export function checkOutDir(out, root) {
  for (const dir of PROTECTED_DIRS) {
    const rel = path.relative(path.join(root, dir), out)
    if (rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))) {
      throw new Error(`--out must not be inside the checkout's ${dir}/ (got ${out})`)
    }
  }
}

/**
 * The signals the night's Art Director read, from its trace.
 * @param {string} traceText the shipped build's trace.json
 * @param {string} date
 * @returns {object}
 */
export function signalsFromTrace(traceText, date) {
  const trace = JSON.parse(traceText)
  const step = (trace.steps ?? []).find((s) => s.name === 'signals-loaded')
  const signals = step?.output
  if (!signals || typeof signals !== 'object') {
    throw new Error(`the ${date} trace has no signals-loaded step`)
  }
  if (signals.date !== date) {
    throw new Error(`the ${date} trace holds signals for ${signals.date}`)
  }
  return signals
}

/**
 * Date the references file to the night. collect-references.js stamps its
 * header with today's UTC date; every nightly ran in the Eastern morning,
 * when that is the night's own date.
 * @param {string} text
 * @param {string} date
 * @returns {string}
 */
export function dateReferencesHeader(text, date) {
  return text.replace(/^# Design References — \d{4}-\d{2}-\d{2}/, `# Design References — ${date}`)
}

/**
 * WEIGHT_* as the night ran them, from build.json's weights.
 * @param {Record<string, number>|null|undefined} weights
 * @returns {Record<string, string>}
 */
export function weightsEnv(weights) {
  const names = {
    signals: 'WEIGHT_SIGNALS',
    inspiration: 'WEIGHT_INSPIRATION',
    ratings: 'WEIGHT_RATINGS',
    risk: 'WEIGHT_RISK',
  }
  const env = {}
  for (const [key, name] of Object.entries(names)) {
    if (typeof weights?.[key] === 'number') env[name] = String(weights[key])
  }
  return env
}

/**
 * Run a command that has to succeed, and return its stdout.
 * @param {typeof defaultExec} exec
 * @param {string} command
 * @param {string} cwd
 * @returns {string}
 */
function mustExec(exec, command, cwd) {
  const result = exec(command, { cwd, env: process.env })
  if (result.status !== 0) {
    throw new Error(`${command} failed:\n${result.stderr || result.stdout}`)
  }
  return result.stdout
}

/**
 * The `chore: daily redesign <date>` commit on HEAD's history.
 * @param {{ exec: typeof defaultExec, root: string, date: string }} args
 * @returns {string} sha
 */
export function findNightCommit({ exec, root, date }) {
  const subject = `chore: daily redesign ${date}`
  const log = mustExec(
    exec,
    `git log --format="%H %s" --fixed-strings --grep=${JSON.stringify(subject)} HEAD`,
    root
  )
  const line = log.split('\n').find((l) => l.slice(41) === subject)
  if (!line) throw new Error(`no "${subject}" commit on HEAD's history`)
  return line.slice(0, 40)
}

/**
 * The night's signals and weights, read from the shipped build its record names.
 * @param {{ exec: typeof defaultExec, root: string, sha: string, date: string }} args
 * @returns {{ signals: object, weights: object|null, buildId: string }}
 */
export function readNightRecord({ exec, root, sha, date }) {
  const show = (p) => mustExec(exec, `git show ${sha}:${p}`, root)
  const { buildId } = JSON.parse(show(`archive/${date}/record.json`))
  if (!buildId) throw new Error(`archive/${date}/record.json names no build`)
  const buildDir = `archive/${date}/build-${buildId}`
  const signals = signalsFromTrace(show(`${buildDir}/trace.json`), date)
  const weights = JSON.parse(show(`${buildDir}/build.json`)).weights ?? null
  return { signals, weights, buildId }
}

/**
 * Put the night's inputs into the worktree: archive/ and references/ as the
 * nightly's checkout had them, signals/today.yml, and the references file
 * made again from both.
 * @param {{ exec: typeof defaultExec, worktree: string, sha: string, date: string, signals: object }} args
 */
export async function restoreNightInputs({ exec, worktree, sha, date, signals }) {
  mustExec(exec, `git restore --source=${sha}^ --worktree -- archive references`, worktree)
  await restoreInputs({ signals, references: null, tape: [] }, worktree)
  mustExec(exec, 'node scripts/collect-references.js', worktree)
  const referencesFile = path.join(worktree, 'signals', 'today.references.md')
  if (existsSync(referencesFile)) {
    writeFileSync(referencesFile, dateReferencesHeader(readFileSync(referencesFile, 'utf8'), date))
  }
}

/**
 * The environment the inner run gets: prod tier, the override, the night's
 * weights and the nightly's run budget. No key and no resume.
 * @param {NodeJS.ProcessEnv} base
 * @param {{ model: string, weights: object|null }} night
 * @returns {NodeJS.ProcessEnv}
 */
export function replayEnv(base, { model, weights }) {
  const env = {
    ...base,
    PIPELINE_TIER: 'prod',
    MODEL_OVERRIDE: modelOverrideFor(model),
    RUN_BUDGET_MINUTES: '60',
    MOCK_MODE: 'false',
    ...weightsEnv(weights),
  }
  delete env.ANTHROPIC_API_KEY
  delete env.RESUME_HANDOFF
  return env
}

/**
 * The swarm phases a replay runs, in order. The engineer, build, gate and
 * archive phases are not on this list, which is what stops the replay.
 */
export async function replayPhases() {
  const { loadRunContext } = await import('./pipeline/context.js')
  const { runArtDirectorPhase } = await import('./pipeline/phase-art-director.js')
  const { runMockupPhase } = await import('./pipeline/phase-mockup.js')
  return [
    ['context', loadRunContext],
    ['art-director', runArtDirectorPhase],
    ['mockup', runMockupPhase],
  ]
}

/**
 * Run the phases on a state, each through runPhase so the log carries the
 * same `[phase]` lines a night does.
 * @param {object} state a RunState
 * @param {Array<[string, (state: object) => Promise<void>]>} [phases]
 */
export async function runReplayPhases(state, phases) {
  const { runPhase } = await import('./pipeline/phase-events.js')
  for (const [name, run] of phases ?? (await replayPhases())) {
    await runPhase(name, () => run(state))
  }
}

/**
 * The first fold of the mockup at 360, as a PNG. The filmstrip the critic
 * reads is six folds in one JPEG; a single fold compares side by side.
 * @param {string} htmlPath
 * @returns {Promise<Buffer>}
 */
async function captureFirstFold360(htmlPath) {
  const { chromium } = await import('playwright')
  const { CRITIC_MOBILE_VIEWPORT } = await import('./utils/snapshot.js')
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({
      viewport: { width: CRITIC_MOBILE_VIEWPORT.width, height: CRITIC_MOBILE_VIEWPORT.height },
      deviceScaleFactor: 2,
      reducedMotion: 'reduce',
    })
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000) // fonts
    return await page.screenshot({ type: 'png', fullPage: false })
  } finally {
    await browser.close()
  }
}

/**
 * The brief the downstream agents read, headed with the one-line design brief.
 * @param {object} state
 * @param {{ date: string, model: string }} meta
 * @returns {string|null}
 */
function briefMarkdown(state, { date, model }) {
  const ad = state.ad?.result
  if (!ad) return null
  const body = state.design?.enrichedBrief ?? `## Hero Copy\n${ad.heroCopy}`
  return `# ${date} (replay, ${model})\n\n**Design Brief:** ${ad.designBrief}\n\n${body}\n`
}

/**
 * Write what the replay made, whatever phase it reached.
 * @param {{ state: object, out: string, meta: object, root: string }} args
 * @returns {Promise<object>} replay.json's contents
 */
async function writeReplayOutputs({ state, out, meta, root }) {
  const { summarizeLedger } = await import('./utils/cost-ledger.js')
  mkdirSync(out, { recursive: true })
  const put = (name, content) => content && writeFileSync(path.join(out, name), content)
  put('brief.md', briefMarkdown(state, meta))
  const signalsBrief = path.join(root, 'signals', 'today.brief.md')
  if (existsSync(signalsBrief)) put('signals-brief.md', readFileSync(signalsBrief, 'utf8'))
  const { mockup, mockupScreenshot } = state.design ?? {}
  put('mockup.html', mockup?.mockupHtml)
  put('mockup-1440.png', mockupScreenshot?.png)
  put('mockup-360-filmstrip.jpg', mockupScreenshot?.mobileJpeg)
  if (mockup?.mockupHtml) {
    put('mockup-360.png', await captureFirstFold360(path.join(out, 'mockup.html')))
  }
  put('verdicts.json', JSON.stringify(state.verdicts ?? [], null, 2))
  put('trace.json', state.trace?.toJSON())
  const cost = summarizeLedger()
  put('cost.json', JSON.stringify(cost, null, 2))
  const summary = { ...meta, calls: cost.calls, total_usd: cost.total_usd, retries: cost.retries }
  put('replay.json', JSON.stringify(summary, null, 2))
  return summary
}

/**
 * The replay itself, inside the worktree (`--inner`). ROOT is the worktree.
 * @param {{ date: string, model: string, out: string }} args
 */
async function runInner({ date, model, out }) {
  const { readContext } = await import('./utils/site-context.js')
  const { resetLedger } = await import('./utils/cost-ledger.js')
  const { startTape } = await import('./utils/call-tape.js')
  const { newBoundaryId } = await import('./utils/data-boundary.js')
  const { createRunState } = await import('./pipeline/run-state.js')
  const started = Date.now()
  const context = await readContext()
  if (context.signals.date !== date) {
    throw new Error(`signals/today.yml is for ${context.signals.date}, not ${date}`)
  }
  resetLedger()
  startTape()
  const state = createRunState(
    { ...context, boundaryId: newBoundaryId() },
    { root: ROOT, today: date }
  )
  let error = null
  try {
    await runReplayPhases(state)
  } catch (err) {
    error = err
  }
  const meta = {
    date,
    model,
    modelOverride: process.env.MODEL_OVERRIDE,
    wallMs: Date.now() - started,
    ...(error ? { error: error.message } : {}),
  }
  const summary = await writeReplayOutputs({ state, out, meta, root: ROOT })
  console.log(
    `\n[replay] ${date} on ${model}: ${summary.calls} model call(s), $${summary.total_usd ?? 'n/a'} list price, ${(summary.wallMs / 60000).toFixed(1)} min`
  )
  if (error) throw error
}

/**
 * Run the inner replay in the worktree, its output streamed to the terminal
 * and to replay.log.
 * @param {{ exec: typeof defaultExec, worktree: string, env: NodeJS.ProcessEnv, date: string, model: string, out: string }} args
 */
async function runInWorktree({ exec, worktree, env, date, model, out }) {
  const logPath = path.join(out, 'replay.log')
  const onChunk = (text) => {
    process.stdout.write(text)
    appendFileSync(logPath, text)
  }
  const command = `node scripts/replay-mockup.js --inner --date ${date} --model ${model} --out ${JSON.stringify(out)}`
  return await exec(command, { cwd: worktree, env, onChunk })
}

/**
 * Replay one night. Resolves to the exit status: 0 done, 1 failed, 2 refused.
 * @param {object} args
 * @param {string} args.date
 * @param {string} args.model a REPLAY_MODELS key
 * @param {string} args.out
 * @param {boolean} [args.keep] leave the worktree behind
 * @param {typeof defaultExec} [args.exec]
 * @param {string} [args.root]
 * @param {NodeJS.ProcessEnv} [args.env]
 * @param {() => Date} [args.now]
 * @returns {Promise<number>}
 */
export async function runReplay({
  date,
  model,
  out,
  keep = false,
  exec = defaultExec,
  root = ROOT,
  env = process.env,
  now = () => new Date(),
}) {
  const refusal = refusalReason({ root, env })
  if (refusal) {
    console.error(`replay refused: ${refusal}`)
    return 2
  }
  const outDir = path.resolve(out)
  checkOutDir(outDir, root)
  const sha = findNightCommit({ exec, root, date })
  const night = readNightRecord({ exec, root, sha, date })
  mkdirSync(outDir, { recursive: true })
  console.log(`replay ${date} (${sha.slice(0, 8)}, build-${night.buildId}) on ${model} → ${outDir}`)
  const started = Date.now()
  const worktree = createWorktree({ exec, root, now, prefix: 'replay' })
  try {
    installDeps({ exec, worktree })
    await restoreNightInputs({ exec, worktree, sha, date, signals: night.signals })
    const childEnv = replayEnv(env, { model, weights: night.weights })
    const result = await runInWorktree({ exec, worktree, env: childEnv, date, model, out: outDir })
    console.log(`replay wall time with setup: ${((Date.now() - started) / 60000).toFixed(1)} min`)
    return result.status === 0 ? 0 : 1
  } finally {
    if (keep) console.log(`  --keep set, leaving worktree at ${worktree}`)
    else removeWorktree({ exec, root, worktree })
  }
}

async function main() {
  const args = parseReplayArgs(process.argv.slice(2))
  if (args.inner) {
    await runInner(args)
    process.stdout.write('', () => process.exit(0))
    return
  }
  const status = await runReplay(args)
  process.exit(status)
}

if (isMain(import.meta.url)) {
  main().catch((err) => {
    console.error(`replay failed: ${err.message}`)
    process.exit(1)
  })
}
