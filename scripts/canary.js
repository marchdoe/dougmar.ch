#!/usr/bin/env node

/**
 * The local canary: a $0 dry run through the owner's Claude CLI that
 * reproduces what a paid production run would do.
 *
 * #432: three paid runs failed on 2026-09-02. A local dry run on the Max
 * plan (`MOCK_MODE=false DRY_RUN=true node scripts/run-pipeline.js`)
 * reproduced the same failures for free, and a fix then passed a full night
 * at $0. That local run is now a standing gate — required before any change
 * to `scripts/prompts/**`, `scripts/design-agents.js` or
 * `scripts/utils/build-validator.js` merges, and weekly otherwise — and its
 * evidence is kept so a failure can be read back without paying to
 * reproduce it.
 *
 * What this does, in order:
 *   1. Refuses to run if `ANTHROPIC_API_KEY` is set (environment or `.env`)
 *      or if `GITHUB_ACTIONS` is set — this script is the $0 path, not a
 *      billed one and not a CI job.
 *   2. Creates the evidence dir up front and prints its `canary.log` path —
 *      the first line of this script's own output — so `tail -f` that path
 *      follows the run. Creates a fresh git worktree of HEAD under the OS
 *      temp dir (or reuses one passed with `--worktree`, skipping install),
 *      installs with a frozen lockfile, copies the repo's `.env` if present,
 *      and runs `scripts/run-pipeline.js` with `MOCK_MODE=false` and
 *      `DRY_RUN=true` forced, streaming its output into that log file as it
 *      arrives (so a crash or Ctrl-C mid-run still leaves the partial log on
 *      disk).
 *   3. Collects the run's trace/cost/verdicts/build-output files into
 *      `docs/evidence/canary/<YYYY-MM-DD>-<HHMM>/` alongside the log, and
 *      writes a `summary.md` there too.
 *   4. Removes the worktree unless `--keep`. Exits 0 on a shipped night, 1
 *      on a failed one, 2 on refusal.
 *
 * `--mock` runs the other seam instead: `MOCK_MODE=true` replays the
 * recorded fixtures (`fixtures/agents/<agent>/00.txt`, see
 * `scripts/utils/agent-fixtures.js`) through the same loop and gates, no
 * model called, evidence under `docs/evidence/canary/<date>-<HHMM>-mock/`.
 * It skips the `ANTHROPIC_API_KEY` refusal — no model is called, so a key
 * being set doesn't matter — but still refuses under `GITHUB_ACTIONS`. It's
 * the three-minute smoke test after a change to a gate or the loop itself,
 * not a substitute for the real dry run above.
 *
 * Usage:
 *   node scripts/canary.js [--keep] [--worktree <path>] [--mock]
 */

import { spawn, spawnSync } from 'node:child_process'
import {
  appendFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { parse as parseEnvFile } from 'dotenv'
import { isMain } from './utils/cli.js'
import { compositionLabel, readDesignIdentity } from './utils/design-identity.js'
import { ROOT } from './utils/file-manager.js'

/** How many characters of an error to keep in the summary. */
const ERROR_HEAD_CHARS = 1500

/** A build dir the pipeline shipped from — never build-failed-* or build-pre-*. */
const SHIPPED_BUILD_RE = /^build-\d+$/

/**
 * Evidence worth keeping, wherever under archive/<date>/ it lands. Images
 * excluded on purpose — a routine canary run shouldn't accumulate binaries
 * in git. The one exception, the shipped render, is copied separately as
 * `render.png` by `copyRenderScreenshot` below, for the taste-note invite.
 */
const EVIDENCE_FILENAMES = new Set([
  'trace.json',
  'cost.json',
  'verdicts.json',
  'last-build-output.txt',
  'last-static-checks.txt',
])

/**
 * Does `.env` in `root` declare a non-empty ANTHROPIC_API_KEY?
 * @param {string} root
 * @returns {boolean}
 */
function envFileHasApiKey(root) {
  const envPath = path.join(root, '.env')
  if (!existsSync(envPath)) return false
  try {
    return Boolean(parseEnvFile(readFileSync(envPath, 'utf8')).ANTHROPIC_API_KEY)
  } catch {
    return false
  }
}

/**
 * Why the canary should refuse to run, or null if it's clear to go. Under
 * `--mock` no model is called, so the `ANTHROPIC_API_KEY` checks don't
 * apply — only the `GITHUB_ACTIONS` refusal still fires.
 * @param {{ root: string, env: NodeJS.ProcessEnv, mock?: boolean }} args
 * @returns {string|null}
 */
export function refusalReason({ root, env, mock = false }) {
  if (env.GITHUB_ACTIONS) {
    return 'GITHUB_ACTIONS is set — this is the $0 local path, not a CI job.'
  }
  if (mock) return null
  if (env.ANTHROPIC_API_KEY) {
    return 'ANTHROPIC_API_KEY is set in the environment — the canary only runs the $0 CLI path.'
  }
  if (envFileHasApiKey(root)) {
    return 'ANTHROPIC_API_KEY is set in .env — the canary only runs the $0 CLI path.'
  }
  return null
}

/**
 * Run a shell command, buffering its output rather than inheriting stdio, so
 * a real run's output can be replaced in tests with a function that never
 * shells out. Without `onChunk` this runs synchronously (`spawnSync`), same
 * as always. With `onChunk`, it runs asynchronously instead (`spawn`),
 * calling `onChunk` with each piece of stdout/stderr text as it arrives —
 * this is how the pipeline run's log gets written incrementally rather than
 * only once the process exits.
 * @param {string} command
 * @param {{ cwd?: string, env?: NodeJS.ProcessEnv, onChunk?: (text: string) => void }} [options]
 * @returns {{ status: number, stdout: string, stderr: string } | Promise<{ status: number, stdout: string, stderr: string }>}
 */
export function defaultExec(command, { cwd, env, onChunk } = {}) {
  if (!onChunk) {
    const result = spawnSync(command, {
      cwd,
      env,
      shell: true,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 64,
    })
    return {
      status: result.status ?? (result.signal ? 1 : 0),
      stdout: result.stdout ?? '',
      stderr: result.stderr ?? '',
    }
  }

  return new Promise((resolve, reject) => {
    const child = spawn(command, { cwd, env, shell: true })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => {
      const text = chunk.toString('utf8')
      stdout += text
      onChunk(text)
    })
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString('utf8')
      stderr += text
      onChunk(text)
    })
    child.on('error', reject)
    child.on('close', (code, signal) => {
      resolve({ status: code ?? (signal ? 1 : 0), stdout, stderr })
    })
  })
}

/**
 * `YYYY-MM-DD-HHMM` as read on the machine's own clock — a filesystem-safe
 * label for when this evidence was collected, not the pipeline's own
 * site-local run date (that's `findArchiveDate` below). `-mock` is appended
 * under `--mock` so a replay run never overwrites a real dry run's evidence
 * from the same minute.
 * @param {Date} date
 * @param {boolean} [mock]
 */
function evidenceStamp(date, mock = false) {
  const pad = (n) => String(n).padStart(2, '0')
  const stamp =
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `-${pad(date.getHours())}${pad(date.getMinutes())}`
  return mock ? `${stamp}-mock` : stamp
}

/**
 * Which `archive/<date>/` the run just filed under. The pipeline keys its
 * own date on America/New_York (see `utils/local-time.js`), which can differ
 * from the machine's calendar day near midnight — so this reads it off disk
 * rather than recomputing it: whichever date directory the run touched most
 * recently is the one it wrote.
 * @param {string} worktree
 * @returns {string|null}
 */
function findArchiveDate(worktree) {
  const archiveDir = path.join(worktree, 'archive')
  if (!existsSync(archiveDir)) return null
  const dates = readdirSync(archiveDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(e.name))
    .map((e) => e.name)
  if (dates.length === 0) return null
  return dates
    .map((name) => ({ name, mtime: statSync(path.join(archiveDir, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0].name
}

/**
 * The build dir the night shipped from, if any (#432's detection rule: a
 * `build-<ts>/` directory that is not `build-failed-*` or `build-pre-*`).
 * @param {string} archiveDateDir
 * @returns {string|null} the build dir's basename
 */
function findShippedBuild(archiveDateDir) {
  if (!existsSync(archiveDateDir)) return null
  return (
    readdirSync(archiveDateDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && SHIPPED_BUILD_RE.test(e.name))
      .map((e) => e.name)
      .sort()
      .at(-1) ?? null
  )
}

/**
 * The dedicated failure dir design-agents.js writes trace.json/cost.json/
 * error.txt into on a lost night — never the `build-failed-sources-*`
 * sibling, which only holds the failing .tsx snapshot.
 * @param {string} archiveDateDir
 * @returns {string|null}
 */
function findFailedBuildDir(archiveDateDir) {
  if (!existsSync(archiveDateDir)) return null
  const name = readdirSync(archiveDateDir, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() &&
        e.name.startsWith('build-failed-') &&
        !e.name.startsWith('build-failed-sources-')
    )
    .map((e) => e.name)
    .sort()
    .at(-1)
  return name ? path.join(archiveDateDir, name) : null
}

function readJsonSafe(p) {
  if (!existsSync(p)) return null
  try {
    return JSON.parse(readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

/** Recursively visit every file under `dir`. */
function walkFiles(dir, onFile) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkFiles(full, onFile)
    else onFile(full, entry.name)
  }
}

/**
 * Copy every evidence-worthy file under `archive/<date>/` into the evidence
 * dir, keeping its path relative to `archive/<date>/` (so trace.json lands
 * at `archive/<date>/build-<id>/trace.json`, and last-build-output.txt at
 * `archive/<date>/last-build-output.txt`). Anything not in
 * EVIDENCE_FILENAMES — screenshots included — is left behind.
 * @param {{ archiveDateDir: string, evidenceDir: string, date: string }} args
 * @returns {string[]} relative paths copied
 */
function copyEvidenceFiles({ archiveDateDir, evidenceDir, date }) {
  const copied = []
  if (!existsSync(archiveDateDir)) return copied
  walkFiles(archiveDateDir, (fullPath, name) => {
    if (!EVIDENCE_FILENAMES.has(name)) return
    const rel = path.join('archive', date, path.relative(archiveDateDir, fullPath))
    const dest = path.join(evidenceDir, rel)
    mkdirSync(path.dirname(dest), { recursive: true })
    copyFileSync(fullPath, dest)
    copied.push(rel)
  })
  return copied
}

/**
 * Copy the shipped build's own `screenshot.png` to `<evidenceDir>/render.png`
 * — the one image this evidence dir ever keeps (#454: everything else stays
 * text so a routine canary run doesn't accumulate binaries in git; this one
 * exists so the taste-note invite below has a real render to point at,
 * since the worktree it lived in is gone by the time the owner reads that
 * invite). No-op, returning null, when there's no shipped build or its
 * screenshot is missing.
 * @param {{ archiveDateDir: string, shippedBuild: string|null, evidenceDir: string }} args
 * @returns {string|null} path to the copy, or null
 */
function copyRenderScreenshot({ archiveDateDir, shippedBuild, evidenceDir }) {
  if (!shippedBuild) return null
  const src = path.join(archiveDateDir, shippedBuild, 'screenshot.png')
  if (!existsSync(src)) return null
  const dest = path.join(evidenceDir, 'render.png')
  copyFileSync(src, dest)
  return dest
}

/**
 * The invite: what the run's design was, where its render landed, and the
 * exact `pnpm taste` invocation to react to it — printed only for a shipped,
 * non-mock run, since a mock replay has no real design and a failed run has
 * no render. Reads the design identity back from the evidence copy of
 * trace.json rather than the (about-to-be-removed) worktree.
 * @param {{ root: string, evidenceDir: string, date: string, shippedBuild: string, renderPath: string|null }} args
 */
function printTasteInvite({ root, evidenceDir, date, shippedBuild, renderPath }) {
  const identity = readDesignIdentity(path.join(evidenceDir, 'archive', date, shippedBuild))
  const composition = compositionLabel(identity.composition)

  console.log('')
  const idBits = []
  if (identity.heroCopy) idBits.push(`"${identity.heroCopy}"`)
  const tags = [identity.chassisId, composition].filter(Boolean)
  if (tags.length > 0) idBits.push(`(${tags.join(', ')})`)
  if (idBits.length > 0) console.log(`[canary] design: ${idBits.join(' ')}`)

  if (renderPath) console.log(`[canary] render: ${path.relative(root, renderPath)}`)

  console.log(
    `[canary] got a reaction? while it's on screen: pnpm taste --evidence ${path.relative(root, evidenceDir)} "..."`
  )
}

/** The last repair step's own error, wherever it landed in the trace. */
function lastRepairError(trace) {
  const error = [...(trace?.steps ?? [])]
    .reverse()
    .find((s) => s?.name === 'repair' && s.output?.error)?.output?.error
  return error ? String(error) : null
}

/**
 * The head of whatever explains why the night was lost: the failure dir's
 * error.txt first, then the last repair attempt's own error, then the tail
 * of pnpm build's output, then the tail of the pipeline's own console
 * output — whichever of those the run actually left behind.
 * @param {{ archiveDateDir: string|null, failedDir: string|null, trace: object|null, log: string }} args
 * @returns {string|null}
 */
function findErrorHead({ archiveDateDir, failedDir, trace, log }) {
  const errorTxt = failedDir ? path.join(failedDir, 'error.txt') : null
  const buildOutput = archiveDateDir ? path.join(archiveDateDir, 'last-build-output.txt') : null

  const candidates = [
    errorTxt && existsSync(errorTxt) && readFileSync(errorTxt, 'utf8'),
    lastRepairError(trace),
    buildOutput && existsSync(buildOutput) && readFileSync(buildOutput, 'utf8'),
  ]
  const found = candidates.find((c) => typeof c === 'string' && c.length > 0)
  if (found) return found.slice(0, ERROR_HEAD_CHARS)
  return log ? log.slice(-ERROR_HEAD_CHARS) : null
}

/**
 * The phase whose agent's own error message names it, read off the head of
 * the run's final error rather than the trace's last step — a rejected
 * Mockup Designer reply logs a `mockup-designer-rejected` step ahead of the
 * throw, so "the last step" is a retry artifact, not where the run actually
 * ended (canary reported "phase 1 (spec-critic)" for a phase-2 failure).
 */
const ERROR_PHASE_OWNERS = [
  { prefix: 'Art Director failed', phase: 1, name: 'art-director' },
  { prefix: 'Mockup Designer failed', phase: 2, name: 'mockup-designer' },
  { prefix: 'React Engineer failed', phase: 3, name: 'react-engineer' },
  { prefix: 'Restore of passing state failed', phase: 4, name: 'revision' },
  { prefix: 'Build failed', phase: 5, name: 'repair' },
]

/** The `{ phase, name }` an error's own message names, or null when it names none. */
function phaseOwnerFromError(errorHead) {
  if (!errorHead) return null
  const owner = ERROR_PHASE_OWNERS.find((o) => errorHead.startsWith(o.prefix))
  return owner ? { phase: owner.phase, name: owner.name } : null
}

/** The `Ended in:` line: the error's named owner, else the trace's last step. */
function computeEndedIn({ shipped, errorHead, trace }) {
  const owner = shipped ? null : phaseOwnerFromError(errorHead)
  if (owner) return `phase ${owner.phase} (${owner.name})`
  const lastStep = (trace?.steps ?? []).at(-1)
  if (!lastStep) return 'unknown — no trace recorded'
  return `phase ${lastStep.phase ?? '—'} (${lastStep.name})`
}

/**
 * `# Canary run — <date>` (or `# Canary run (mock) — <date>` under
 * `--mock`), the pass/fail line, and the phase it ended in.
 */
function renderHeader({ date, shipped, trace, mock, errorHead }) {
  const endedIn = computeEndedIn({ shipped, errorHead, trace })
  const title = mock ? 'Canary run (mock)' : 'Canary run'
  return [
    `# ${title} — ${date ?? 'unknown date'}`,
    '',
    `**Result:** ${shipped ? 'PASS — shipped' : 'FAIL'}`,
    `**Ended in:** ${endedIn}`,
    '',
  ]
}

/** `## Trace`: every step, its phase, and how long it took. */
function renderTraceSection(steps) {
  if (steps.length === 0) return ['## Trace', '', '_no trace recorded_', '']
  const rows = steps.map((step) => {
    const duration = typeof step.durationMs === 'number' ? `${step.durationMs}ms` : '—'
    return `| ${step.name} | ${step.phase ?? '—'} | ${duration} |`
  })
  return ['## Trace', '', '| step | phase | duration |', '| --- | --- | --- |', ...rows, '']
}

/** `## Repair attempts`: each attempt's file count and outcome (#435 shape). */
function renderRepairSection(repairs) {
  if (repairs.length === 0) return ['## Repair attempts', '', '_none_', '']
  const rows = repairs.map((step) => {
    const attempt = step.input?.attempt ?? '?'
    const files = step.output?.files ?? 0
    const outcome = step.output?.success ? 'passed' : 'failed'
    return `- attempt ${attempt}: ${files} file(s), ${outcome}`
  })
  return ['## Repair attempts', '', ...rows, '']
}

/** `## Cost`: the run's total from cost.json, or that there is none. */
function renderCostSection(cost) {
  if (!cost) return ['## Cost', '', '_no cost record_', '']
  const total =
    cost.total_usd === null || cost.total_usd === undefined
      ? 'unpriced'
      : `$${cost.total_usd.toFixed(4)}`
  const retries = cost.retries ?? 0
  const line = `${total}${cost.estimated ? ' (partly estimated)' : ''} across ${cost.calls ?? 0} call(s), ${retries} retr${retries === 1 ? 'y' : 'ies'}`
  return ['## Cost', '', line, '']
}

/** `## Final error`, only rendered on a loss. */
function renderErrorSection({ shipped, errorHead }) {
  if (shipped) return []
  return ['## Final error', '', '```', errorHead || '_no error recorded_', '```', '']
}

/**
 * Render `summary.md`: pass/fail, the phase the run ended in, the trace's
 * step list with durations, repair attempts with file counts and outcomes,
 * the cost estimate, and (on a loss) the head of the final error.
 * @param {{ date: string|null, shipped: boolean, trace: object|null, cost: object|null, errorHead: string|null, mock?: boolean }} args
 * @returns {string}
 */
function buildSummary({ date, shipped, trace, cost, errorHead, mock = false }) {
  const steps = trace?.steps ?? []
  const repairs = steps.filter((s) => s?.name === 'repair')
  return [
    ...renderHeader({ date, shipped, trace, mock, errorHead }),
    ...renderTraceSection(steps),
    ...renderRepairSection(repairs),
    ...renderCostSection(cost),
    ...renderErrorSection({ shipped, errorHead }),
  ].join('\n')
}

function createWorktree({ exec, root, now }) {
  const dir = path.join(tmpdir(), `canary-${now().getTime()}-${process.pid}`)
  console.log(`  worktree: ${dir}`)
  const result = exec(`git worktree add ${JSON.stringify(dir)} HEAD`, {
    cwd: root,
    env: process.env,
  })
  if (result.status !== 0) {
    throw new Error(`git worktree add failed:\n${result.stderr || result.stdout}`)
  }
  return dir
}

function removeWorktree({ exec, root, worktree }) {
  console.log(`  removing worktree ${worktree}`)
  const result = exec(`git worktree remove ${JSON.stringify(worktree)} --force`, {
    cwd: root,
    env: process.env,
  })
  if (result.status !== 0) {
    console.warn(`  could not remove worktree (non-blocking): ${result.stderr || result.stdout}`)
  }
}

function installDeps({ exec, worktree }) {
  console.log('  pnpm install --frozen-lockfile')
  const result = exec('pnpm install --frozen-lockfile', { cwd: worktree, env: process.env })
  if (result.status !== 0) {
    throw new Error(`pnpm install failed:\n${result.stderr || result.stdout}`)
  }
}

/** Copies the repo's .env into the worktree, if it has one. Returns whether it did. */
function copyEnvFile({ root, worktree }) {
  const src = path.join(root, '.env')
  if (!existsSync(src)) return false
  copyFileSync(src, path.join(worktree, '.env'))
  return true
}

/**
 * The $0 run itself: MOCK_MODE and DRY_RUN forced regardless of whatever the
 * shell or the copied .env set them to. `mock` forces `MOCK_MODE=true` (the
 * recorded-fixture replay) instead of `false` (the real CLI dry run).
 *
 * Streams the child's combined output into `logPath` as it arrives (#449 —
 * a 45-minute run used to write nothing until it finished), then resolves
 * to the same buffered `{ stdout, stderr }` the rest of this script has
 * always read.
 */
async function runPipeline({ exec, worktree, mock = false, logPath }) {
  const mockModeValue = mock ? 'true' : 'false'
  console.log(`  MOCK_MODE=${mockModeValue} DRY_RUN=true node scripts/run-pipeline.js`)
  const env = { ...process.env, MOCK_MODE: mockModeValue, DRY_RUN: 'true' }
  const onChunk = (text) => appendFileSync(logPath, text)
  return exec('node scripts/run-pipeline.js', { cwd: worktree, env, onChunk })
}

/**
 * The evidence dir and its log file, created before the pipeline even
 * starts (and printed as this script's first line of output) so `tail -f`
 * the log path follows a live run, and a crash or Ctrl-C mid-run still
 * leaves the partial log on disk rather than nothing at all.
 * @returns {{ evidenceDir: string, logPath: string }}
 */
function prepareEvidenceDir({ root, now, mock }) {
  const evidenceDir = path.join(root, 'docs', 'evidence', 'canary', evidenceStamp(now(), mock))
  mkdirSync(evidenceDir, { recursive: true })
  const logPath = path.join(evidenceDir, 'canary.log')
  writeFileSync(logPath, '', 'utf8')
  return { evidenceDir, logPath }
}

/**
 * Fresh worktree, or the reused one from `--worktree` (install skipped
 * either way). A worktree this creates is also this function's to clean up
 * if install fails partway through — nothing further up the call stack
 * still has a reference to it once the throw leaves this function.
 */
function prepareWorktree({ exec, root, now, worktreePath }) {
  if (worktreePath) {
    console.log(`  reusing worktree ${worktreePath} (skipping install)`)
    return { worktree: worktreePath, reused: true }
  }
  const worktree = createWorktree({ exec, root, now })
  try {
    installDeps({ exec, worktree })
  } catch (err) {
    removeWorktree({ exec, root, worktree })
    throw err
  }
  return { worktree, reused: false }
}

/** Read back the trace and cost the run left behind, wherever it filed them. */
function readRunArtifacts({ archiveDateDir, shippedBuild }) {
  const traceDir = shippedBuild
    ? path.join(archiveDateDir, shippedBuild)
    : findFailedBuildDir(archiveDateDir)
  if (!traceDir) return { trace: null, cost: null, failedDir: null }
  return {
    trace: readJsonSafe(path.join(traceDir, 'trace.json')),
    cost: readJsonSafe(path.join(traceDir, 'cost.json')),
    failedDir: shippedBuild ? null : traceDir,
  }
}

/**
 * Collect the run's trace/cost/verdicts/build-output files and a
 * summary.md into `evidenceDir` (already created by `prepareEvidenceDir`,
 * with the streamed log already at `evidenceDir/canary.log`). Overwrites
 * that log with the buffered `log` string so its final content stays
 * exactly what it has always been — the streamed writes only mattered for
 * following the run live.
 * @returns {{ shipped: boolean, date: string|null }}
 */
function collectEvidence({ worktree, root, evidenceDir, log, mock = false }) {
  const date = findArchiveDate(worktree)
  const archiveDateDir = date ? path.join(worktree, 'archive', date) : null
  const shippedBuild = archiveDateDir ? findShippedBuild(archiveDateDir) : null
  const shipped = Boolean(shippedBuild)

  writeFileSync(path.join(evidenceDir, 'canary.log'), log, 'utf8')

  const { trace, cost, failedDir, renderPath } = collectArchiveArtifacts({
    archiveDateDir,
    shippedBuild,
    evidenceDir,
    date,
  })

  const errorHead = shipped ? null : findErrorHead({ archiveDateDir, failedDir, trace, log })
  const summary = buildSummary({ date, shipped, trace, cost, errorHead, mock })
  writeFileSync(path.join(evidenceDir, 'summary.md'), summary, 'utf8')

  console.log('')
  console.log(summary)
  console.log(`[canary] evidence: ${path.relative(root, evidenceDir)}`)

  maybePrintTasteInvite({ root, evidenceDir, date, shippedBuild, renderPath, shipped, mock })

  return { shipped, date }
}

/**
 * Everything read out of, and copied out of, the (still-live) worktree's
 * archive dir — trace/cost/the failed-build dir, plus this evidence dir's
 * own copies of the text evidence and the shipped render. All-null / no
 * copies when the run never wrote an archive dir at all.
 */
function collectArchiveArtifacts({ archiveDateDir, shippedBuild, evidenceDir, date }) {
  if (!archiveDateDir) return { trace: null, cost: null, failedDir: null, renderPath: null }
  const { trace, cost, failedDir } = readRunArtifacts({ archiveDateDir, shippedBuild })
  copyEvidenceFiles({ archiveDateDir, evidenceDir, date })
  const renderPath = copyRenderScreenshot({ archiveDateDir, shippedBuild, evidenceDir })
  return { trace, cost, failedDir, renderPath }
}

/**
 * A mock replay has no real design to react to (same fixtures every time);
 * a lost night never reached a render. Only a shipped, real run gets the
 * taste-note invite.
 */
function maybePrintTasteInvite({
  root,
  evidenceDir,
  date,
  shippedBuild,
  renderPath,
  shipped,
  mock,
}) {
  if (!shipped || mock || !date) return
  printTasteInvite({ root, evidenceDir, date, shippedBuild, renderPath })
}

/**
 * Run the canary: evidence dir (and its log, printed first), worktree,
 * install, dry run, evidence, cleanup.
 *
 * @param {object} [args]
 * @param {(command: string, options: { cwd?: string, env?: NodeJS.ProcessEnv, onChunk?: (text: string) => void }) => { status: number, stdout: string, stderr: string } | Promise<{ status: number, stdout: string, stderr: string }>} [args.exec]
 *   command runner, replaced in tests so nothing is actually shelled out
 * @param {() => Date} [args.now] clock, pinned in tests
 * @param {string} [args.root] the repo whose HEAD gets worktreed and whose
 *   `docs/evidence/` receives the result
 * @param {boolean} [args.keep] leave the worktree behind instead of removing it
 * @param {string|null} [args.worktreePath] reuse this worktree instead of creating one — skips install
 * @param {boolean} [args.mock] replay recorded fixtures (`MOCK_MODE=true`) instead of calling the real CLI (`MOCK_MODE=false`); skips the `ANTHROPIC_API_KEY` refusal and suffixes the evidence dir with `-mock`
 * @returns {Promise<{ exitCode: number, reason?: string, shipped?: boolean, date?: string|null, evidenceDir?: string }>}
 */
export async function runCanary({
  exec = defaultExec,
  now = () => new Date(),
  root = ROOT,
  keep = false,
  worktreePath = null,
  mock = false,
} = {}) {
  const reason = refusalReason({ root, env: process.env, mock })
  if (reason) {
    console.error(`[canary] refusing to run: ${reason}`)
    return { exitCode: 2, reason }
  }

  const { evidenceDir, logPath } = prepareEvidenceDir({ root, now, mock })
  console.log(logPath)

  const { worktree, reused } = prepareWorktree({ exec, root, now, worktreePath })

  try {
    console.log(
      copyEnvFile({ root, worktree }) ? '  copied .env into worktree' : '  no .env to copy'
    )

    const { stdout, stderr } = await runPipeline({ exec, worktree, mock, logPath })
    const { shipped, date } = collectEvidence({
      worktree,
      root,
      evidenceDir,
      log: `${stdout}${stderr}`,
      mock,
    })

    return { exitCode: shipped ? 0 : 1, shipped, date, evidenceDir }
  } finally {
    if (reused) {
      // Not ours to remove — the caller passed it in with --worktree.
    } else if (keep) {
      console.log(`  --keep set, leaving worktree at ${worktree}`)
    } else {
      removeWorktree({ exec, root, worktree })
    }
  }
}

function parseArgs(argv) {
  const keep = argv.includes('--keep')
  const mock = argv.includes('--mock')
  const worktreeIdx = argv.indexOf('--worktree')
  const worktreePath = worktreeIdx !== -1 ? argv[worktreeIdx + 1] : null
  return { keep, worktreePath, mock }
}

async function main() {
  const { keep, worktreePath, mock } = parseArgs(process.argv.slice(2))
  const result = await runCanary({ keep, worktreePath, mock })
  process.exit(result.exitCode)
}

if (isMain(import.meta.url)) {
  main().catch((err) => {
    console.error(`[canary] fatal: ${err.stack || err.message}`)
    process.exit(1)
  })
}
