/**
 * The spend of a night's earlier failed attempts, carried onto the run that
 * ships the night.
 *
 * A run reads only its own ledger, so a night that took two attempts recorded
 * half its cost (#578). Each failed run opens an issue whose body carries its
 * spend (`failure-cost-section.js`). Before the pipeline starts, the workflow
 * hands those issues to `writePriorAttempts`, which leaves
 * `signals/prior-attempts.json` for the run. `currentCost` folds that file into
 * the ledger's summary, so `cost.json` says what the run spent and what the
 * night spent. Both steps are non-blocking: a night's telemetry never fails it.
 *
 * @module
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { summarizeLedger } from './cost-ledger.js'
import { parseCostMarker } from './failure-cost-section.js'

/** Where the workflow leaves the earlier attempts, relative to the checkout. */
export const PRIOR_ATTEMPTS_FILE = path.join('signals', 'prior-attempts.json')

/** The title `notify` gives a night's failure issue. Kept in step with daily-redesign.yml. */
export const failureIssueTitle = (date) => `Daily redesign failed — ${date}`

/**
 * The earlier attempts a night's failure issues record, one per workflow run.
 *
 * `gh issue list --search` matches titles loosely (the em dash is punctuation
 * to it), so the title is compared exactly here.
 *
 * @param {Array<{ number?: number, title?: string, body?: string }>} issues
 * @param {string} date `YYYY-MM-DD`
 * @returns {Array<{ runId: string, attempt: number, issue: number|null, total_usd: number|null, calls: number, estimated: boolean }>}
 */
export function attemptsFromIssues(issues, date) {
  const seen = new Set()
  const attempts = []
  for (const issue of Array.isArray(issues) ? issues : []) {
    if (issue?.title !== failureIssueTitle(date)) continue
    const attempt = parseCostMarker(issue.body)
    if (!attempt) continue
    const key = `${attempt.runId}/${attempt.attempt}`
    if (seen.has(key)) continue
    seen.add(key)
    attempts.push({ ...attempt, issue: typeof issue.number === 'number' ? issue.number : null })
  }
  return attempts
}

/**
 * Write the file the run reads. Writes nothing when there is no earlier attempt.
 *
 * @param {Array<object>} issues as `gh issue list --json number,title,body`
 * @param {string} date
 * @param {string} [root]
 * @returns {Promise<Array<object>>} the attempts found
 */
export async function writePriorAttempts(issues, date, root = process.cwd()) {
  const attempts = attemptsFromIssues(issues, date)
  if (attempts.length === 0) return attempts
  const file = path.join(root, PRIOR_ATTEMPTS_FILE)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, JSON.stringify(attempts, null, 2), 'utf8')
  return attempts
}

/**
 * The line the workflow step logs after `writePriorAttempts`.
 *
 * @param {Array<{ runId: string }>} attempts
 * @param {string} date
 * @returns {string}
 */
export function describeAttempts(attempts, date) {
  if (attempts.length === 0) return `no earlier failed attempt recorded for ${date}`
  return `${attempts.length} earlier failed attempt(s) for ${date}: ${attempts.map((a) => a.runId).join(', ')}`
}

/**
 * The attempts the workflow left for this run; empty when there are none or the
 * file is unreadable.
 *
 * @param {string} root
 * @returns {Promise<Array<{ runId: string, total_usd: number|null, calls: number }>>}
 */
export async function readPriorAttempts(root) {
  try {
    const attempts = JSON.parse(await readFile(path.join(root, PRIOR_ATTEMPTS_FILE), 'utf8'))
    return Array.isArray(attempts) ? attempts.filter((a) => a && typeof a === 'object') : []
  } catch {
    return []
  }
}

/**
 * The ledger's summary with the night's earlier attempts beside it. With none it
 * is the summary unchanged, so a night that took one attempt reads as before.
 * `night_usd` is null when nothing is priceable, as `total_usd` is.
 *
 * @param {ReturnType<typeof summarizeLedger>} cost
 * @param {Array<{ total_usd: number|null }>} priorAttempts
 * @returns {object}
 */
export function withPriorAttempts(cost, priorAttempts) {
  if (priorAttempts.length === 0) return cost
  const spent = [cost.total_usd, ...priorAttempts.map((a) => a.total_usd)]
  const priced = spent.filter((n) => typeof n === 'number')
  return {
    ...cost,
    priorAttempts,
    night_usd: priced.length ? Number(priced.reduce((a, b) => a + b, 0).toFixed(6)) : null,
  }
}

/**
 * This run's cost record: the ledger, and the night's earlier attempts when the
 * workflow found any.
 *
 * @param {string} root
 * @returns {Promise<object>}
 */
export async function currentCost(root) {
  return withPriorAttempts(summarizeLedger(), await readPriorAttempts(root))
}

/**
 * Say in the run's log what the night cost when it took more than one attempt.
 * Says nothing for a night that took one.
 *
 * @param {{ priorAttempts?: Array<object>, night_usd?: number|null }} cost from `currentCost`
 */
export function logPriorAttempts(cost) {
  if (!cost.priorAttempts) return
  const night = typeof cost.night_usd === 'number' ? `$${cost.night_usd.toFixed(4)}` : 'unpriced'
  console.log(`  earlier failed attempt(s): ${cost.priorAttempts.length}, night total ${night}`)
}
