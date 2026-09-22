/**
 * The backstop for a night that never happened (#193).
 *
 * GitHub does not promise to deliver a scheduled run. When the 00:15 trigger
 * is dropped, or the guard job skips both cron entries, Daily Redesign does not
 * fail: it never runs, and its `notify` job, which only fires on failure,
 * tells nobody. This script is what the nightly-backstop workflow runs a few
 * times each day to notice that.
 *
 * It only reads. It lists runs, reads main and lists issues, then prints what
 * the workflow should do: nothing, wait, dispatch one Daily Redesign, or open
 * one issue. The workflow's own jobs do the dispatching and the issue, each
 * with its own token scope. Run it locally to see today's answer:
 *
 *   node scripts/nightly-backstop.js [YYYY-MM-DD]
 *
 * With --night-exists it answers only rule 1, for Daily Redesign's guard job,
 * which skips a day that already has its night (see nightExistsCli below).
 *
 * The rules, in order. A manual dry run is left out of all of them: it never
 * makes a night, so it neither holds the day up nor spends its dispatch.
 *   1. archive/<today>/record.json is on main: the night exists. Nothing.
 *   2. A Daily Redesign run is queued or running: wait for it.
 *   3. Today already had a dispatch (this backstop's, or anyone's manual one)
 *      and there is still no night: open one issue, once.
 *   4. Otherwise: dispatch Daily Redesign, once. When today's scheduled run
 *      failed and left a handoff.json in its build-failed-<id> artifact, the
 *      dispatch resumes that run (resume_run_id), so the Art Director and the
 *      mockups are not paid for twice (#578).
 *
 * "Today" is New York's calendar day, the day every archive path is keyed on.
 */

import { execFile } from 'node:child_process'
import { appendFileSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { isMain } from './utils/cli.js'

const run = promisify(execFile)

export const SITE_TIME_ZONE = 'America/New_York'
export const NIGHTLY_WORKFLOW = 'daily-redesign.yml'
export const BACKSTOP_WORKFLOW = 'nightly-backstop.yml'
/** The `name:` of the backstop's dispatch job. Its success is the day's record of a dispatch. */
export const DISPATCH_JOB_NAME = 'Dispatch Daily Redesign'
export const ISSUE_LABEL = 'pipeline-failure'

const ACTIVE = new Set(['queued', 'in_progress', 'waiting', 'requested', 'pending'])

/**
 * New York's calendar date for an instant, as YYYY-MM-DD.
 *
 * @param {Date} [now]
 * @returns {string}
 */
export function siteDate(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: SITE_TIME_ZONE })
}

/**
 * The runs whose creation falls on `date` in New York.
 *
 * @template {{ created_at: string }} T
 * @param {T[]} runs
 * @param {string} date YYYY-MM-DD
 * @returns {T[]}
 */
export function runsOn(runs, date) {
  return runs.filter((r) => siteDate(new Date(r.created_at)) === date)
}

/**
 * The inputs a Daily Redesign run was dispatched with. The runs API does not
 * return workflow_dispatch inputs, so daily-redesign.yml writes them into its
 * `run-name`, which the API returns as `display_title`: "Daily Redesign (dry
 * run)", "Daily Redesign (resume 123)". Runs from before that carry the plain
 * name and read as a full, paid night.
 *
 * @param {{ display_title?: string }} run
 * @returns {{ dryRun: boolean, resumeRunId: string }}
 */
export function dispatchInputs(run) {
  const title = run.display_title ?? ''
  return {
    dryRun: /\(dry run\)/.test(title),
    resumeRunId: /\(resume (\d+)\)/.exec(title)?.[1] ?? '',
  }
}

/**
 * Today's failed scheduled runs, newest first: the ones a dispatch could
 * resume, in the order to try them.
 *
 * @template {{ id: number, event: string, status: string, conclusion?: string | null, created_at: string }} T
 * @param {T[]} runs
 * @param {string} date
 * @returns {T[]}
 */
export function resumeCandidates(runs, date) {
  return runsOn(runs, date)
    .filter((r) => r.event === 'schedule' && r.status === 'completed' && r.conclusion === 'failure')
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

/**
 * The file names inside a zip archive, read from its central directory.
 * GitHub serves artifacts as zips, and this is all the backstop needs of one.
 *
 * @param {Buffer} zip
 * @returns {string[]}
 */
export function zipEntryNames(zip) {
  // End of central directory: signature, then the count at +10, offset at +16.
  let eocd = -1
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 22 - 0xffff); i--) {
    if (zip.readUInt32LE(i) === 0x06054b50) {
      eocd = i
      break
    }
  }
  if (eocd < 0) throw new Error('not a zip archive')
  const count = zip.readUInt16LE(eocd + 10)
  let at = zip.readUInt32LE(eocd + 16)
  const names = []
  for (let n = 0; n < count; n++) {
    if (zip.readUInt32LE(at) !== 0x02014b50) throw new Error('corrupt zip central directory')
    const nameLen = zip.readUInt16LE(at + 28)
    const extraLen = zip.readUInt16LE(at + 30)
    const commentLen = zip.readUInt16LE(at + 32)
    names.push(zip.toString('utf8', at + 46, at + 46 + nameLen))
    at += 46 + nameLen + extraLen + commentLen
  }
  return names
}

/**
 * Does a failure artifact carry what a resume needs? The resume step takes
 * any handoff.json in it (daily-redesign.yml, "Stage the handoff").
 *
 * @param {string[]} names
 */
export function hasHandoff(names) {
  return names.some((n) => path.posix.basename(n) === 'handoff.json')
}

/** @param {string} date */
export function backstopIssueTitle(date) {
  return `Nightly backstop: no night for ${date}`
}

/**
 * Did one of today's backstop runs dispatch? Its dispatch job only runs when
 * the check said so, and only succeeds once `gh workflow run` has.
 *
 * @param {Array<{ name?: string, conclusion?: string | null }>} jobs every job of today's backstop runs
 * @returns {boolean}
 */
export function backstopDispatched(jobs) {
  return jobs.some((j) => j.name === DISPATCH_JOB_NAME && j.conclusion === 'success')
}

/**
 * What to do today. Pure: every fact is passed in.
 *
 * @param {{
 *   date: string,
 *   nightExists: boolean,
 *   nightlyRuns: Array<{ id?: number, event: string, status: string, conclusion?: string | null, created_at: string }>,
 *   dispatchedByBackstop: boolean,
 *   issueExists: boolean,
 *   resumable?: number | string | null,
 * }} facts nightlyRuns may include other days; only `date`'s are read. resumable
 *   is the id of today's failed scheduled run whose artifact holds a handoff.
 * @returns {{ action: 'none' | 'wait' | 'dispatch' | 'issue', reason: string, resumeRunId: string }}
 */
export function decide(facts) {
  return { resumeRunId: '', ...decideAction(facts) }
}

/** @param {Parameters<typeof decide>[0]} facts */
function decideAction({
  date,
  nightExists,
  nightlyRuns,
  dispatchedByBackstop,
  issueExists,
  resumable,
}) {
  if (nightExists) {
    return { action: 'none', reason: `archive/${date}/record.json is on main: the night exists` }
  }
  // A dry run makes no night: it neither holds the day up nor spends its dispatch.
  const today = runsOn(nightlyRuns, date).filter((r) => !dispatchInputs(r).dryRun)
  const active = today.filter((r) => ACTIVE.has(r.status))
  if (active.length > 0) {
    const list = active.map((r) => `${r.id ?? '?'} (${r.event}, ${r.status})`).join(', ')
    return {
      action: 'wait',
      reason: `no night yet, but a Daily Redesign run is under way: ${list}`,
    }
  }
  const manual = today.filter((r) => r.event === 'workflow_dispatch')
  if (dispatchedByBackstop || manual.length > 0) {
    const who = dispatchedByBackstop
      ? 'the backstop already dispatched a run today'
      : `a manual dispatch already ran today (${manual.map((r) => `${r.id ?? '?'}: ${r.conclusion}`).join(', ')})`
    if (issueExists) {
      return { action: 'none', reason: `no night, ${who}, and the issue is already open` }
    }
    return { action: 'issue', reason: `no night, and ${who}; it did not produce one` }
  }
  const seen = today.length
    ? `today's runs (${today.map((r) => `${r.event}: ${r.conclusion}`).join(', ')}) produced none`
    : 'no Daily Redesign run was created today'
  if (resumable) {
    return {
      action: 'dispatch',
      reason: `no night on main and ${seen}; resuming run ${resumable}, whose artifact holds a handoff`,
      resumeRunId: String(resumable),
    }
  }
  return { action: 'dispatch', reason: `no night on main and ${seen}` }
}

/**
 * The body of the one issue a day can open.
 *
 * @param {{ date: string, reason: string, repo: string }} p
 */
export function issueBody({ date, reason, repo }) {
  return [
    `There is no night for ${date} on main, and the backstop has already spent its one dispatch for the day.`,
    ``,
    `Why: ${reason}.`,
    ``,
    `The backstop does not dispatch again. [Daily Redesign runs](https://github.com/${repo}/actions/workflows/${NIGHTLY_WORKFLOW}) shows what happened; a failed run also opened its own \`Daily redesign failed\` issue with the way to resume it.`,
  ].join('\n')
}

// --- the thin API layer -----------------------------------------------------

/** @param {string[]} args */
async function gh(args) {
  const { stdout } = await run('gh', args, { maxBuffer: 32 * 1024 * 1024 })
  return stdout
}

/** @param {string} endpoint */
async function ghJson(endpoint) {
  return JSON.parse(await gh(['api', endpoint]))
}

/**
 * The newest of today's failed scheduled runs whose build-failed-<id> artifact
 * holds a handoff.json, or null. Downloads each candidate's artifact to a
 * temporary file to read its file list.
 *
 * @param {string} repo
 * @param {Array<{ id: number, event: string, status: string, conclusion?: string | null, created_at: string }>} runs
 * @param {string} date
 */
export async function findResumable(repo, runs, date) {
  for (const r of resumeCandidates(runs, date)) {
    const { artifacts = [] } = await ghJson(`repos/${repo}/actions/runs/${r.id}/artifacts`)
    const artifact = artifacts.find((a) => a.name === `build-failed-${r.id}` && !a.expired)
    if (!artifact) continue
    const dir = mkdtempSync(path.join(tmpdir(), 'backstop-'))
    try {
      const file = path.join(dir, 'artifact.zip')
      // gh writes the binary body to stdout; a shell redirect keeps it intact.
      await run('sh', [
        '-c',
        'gh api "$1" > "$2"',
        'sh',
        `repos/${repo}/actions/artifacts/${artifact.id}/zip`,
        file,
      ])
      if (hasHandoff(zipEntryNames(readFileSync(file)))) return r.id
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  return null
}

/**
 * The day before `date`, so a `created` filter in UTC still covers all of
 * New York's day; runsOn narrows it back down.
 *
 * @param {string} date
 */
function dayBefore(date) {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

/**
 * @param {string} repo owner/name
 * @param {string} date
 */
export async function nightOnMain(repo, date) {
  try {
    await gh(['api', `repos/${repo}/contents/archive/${date}/record.json?ref=main`, '--silent'])
    return true
  } catch (err) {
    if (/HTTP 404|Not Found/.test(String(err.stderr ?? err.message))) return false
    throw err
  }
}

/**
 * @param {string} repo
 * @param {string} workflow
 * @param {string} date
 */
async function workflowRuns(repo, workflow, date) {
  const since = dayBefore(date)
  const data = await ghJson(
    `repos/${repo}/actions/workflows/${workflow}/runs?created=%3E%3D${since}&per_page=100`
  )
  return data.workflow_runs ?? []
}

/**
 * @param {string} repo
 * @param {string} date
 */
export async function gatherFacts(repo, date) {
  const [nightExists, nightlyRuns, backstopRuns, issues] = await Promise.all([
    nightOnMain(repo, date),
    workflowRuns(repo, NIGHTLY_WORKFLOW, date),
    workflowRuns(repo, BACKSTOP_WORKFLOW, date).catch((err) => {
      // Before the workflow first lands on main it has no runs to list.
      if (/HTTP 404|Not Found/.test(String(err.stderr ?? err.message))) return []
      throw err
    }),
    ghJson(`repos/${repo}/issues?labels=${ISSUE_LABEL}&state=all&per_page=100`),
  ])
  const jobs = []
  for (const r of runsOn(backstopRuns, date)) {
    const data = await ghJson(`repos/${repo}/actions/runs/${r.id}/jobs?per_page=100`)
    jobs.push(...(data.jobs ?? []))
  }
  return {
    date,
    nightExists,
    nightlyRuns,
    dispatchedByBackstop: backstopDispatched(jobs),
    issueExists: issues.some((i) => i.title === backstopIssueTitle(date)),
    // Only worth the download when there is no night to find.
    resumable: nightExists ? null : await findResumable(repo, nightlyRuns, date),
  }
}

/**
 * Daily Redesign's guard asks this before a run that would pay for a night:
 * is today's already on main? It prints the answer and writes `exists=` to
 * GITHUB_OUTPUT. A late scheduled run that lands after the backstop's
 * dispatch has published would otherwise build the day twice.
 *
 * @param {string} repo
 * @param {string} date
 */
async function nightExistsCli(repo, date) {
  const exists = await nightOnMain(repo, date)
  console.log(
    `${date} (${SITE_TIME_ZONE}): archive/${date}/record.json ${exists ? 'is' : 'is not'} on main`
  )
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `exists=${exists}\n`)
}

async function main() {
  const repo = process.env.GITHUB_REPOSITORY || 'marchdoe/dougmar.ch'
  const args = process.argv.slice(2)
  // A date argument asks about another day, read-only, for trying it by hand.
  const date = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) ?? siteDate()
  if (args.includes('--night-exists')) return nightExistsCli(repo, date)
  const facts = await gatherFacts(repo, date)
  const { action, reason, resumeRunId } = decide(facts)
  console.log(`${date} (${SITE_TIME_ZONE}): ${action} — ${reason}`)

  const out = process.env.GITHUB_OUTPUT
  if (out) {
    const body = issueBody({ date, reason, repo })
    appendFileSync(
      out,
      `action=${action}\nresume_run_id=${resumeRunId}\ndate=${date}\ntitle=${backstopIssueTitle(date)}\nbody<<BACKSTOP_EOF\n${body}\nBACKSTOP_EOF\n`
    )
  }
}

if (isMain(import.meta.url)) {
  main().catch((err) => {
    console.error(`nightly backstop could not decide: ${err.message}`)
    process.exit(1)
  })
}
