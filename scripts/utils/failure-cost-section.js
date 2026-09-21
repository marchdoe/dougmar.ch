/**
 * What a failed run spent, in the words of the failure issue.
 *
 * The scheduled run of 2026-09-20 spent $4.18 across ten calls and failed; the
 * manual re-run cost $4.82 and shipped. The night cost $9.00 and its archive
 * said $4.82, because the failed run's `cost.json` lives in a `build-failed-*`
 * directory that stays out of main on purpose and in an artifact that expires
 * in thirty days (#578). The failure issue is the durable place a failed run
 * can say what it cost, so the `notify` job prints this section into it.
 *
 * The issue body carries the numbers twice: as a table for the person reading
 * it, and as one HTML comment for the run that ships the night afterwards.
 * `parseCostMarker` reads the comment back; `prior-attempts.js` is its caller.
 *
 * @module
 */

const MARKER = /<!-- run-cost (\{[^\n]*?\}) -->/

const usd = (n) => (typeof n === 'number' ? `$${n.toFixed(2)}` : 'unpriced')
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

/**
 * The one comment a later run reads. Only the run's own total: a failed
 * run that itself had earlier attempts must not have them counted twice.
 *
 * @param {object} cost a `cost.json`
 * @param {string|number} runId the workflow run that spent it
 * @param {number} [runAttempt] which attempt of that run: a re-run of failed jobs
 *   keeps the run id, and its spend is its own
 * @returns {string}
 */
export function costMarker(cost, runId, runAttempt = 1) {
  const attempt = {
    runId: String(runId),
    attempt: Number(runAttempt) || 1,
    total_usd: typeof cost.total_usd === 'number' ? cost.total_usd : null,
    calls: typeof cost.calls === 'number' ? cost.calls : 0,
    estimated: Boolean(cost.estimated),
  }
  return `<!-- run-cost ${JSON.stringify(attempt)} -->`
}

/**
 * The attempt a failure issue's body records, or null when it records none
 * (an issue from before this section, or one whose marker was edited away).
 *
 * @param {string} body
 * @returns {{ runId: string, attempt: number, total_usd: number|null, calls: number, estimated: boolean }|null}
 */
export function parseCostMarker(body) {
  const match = MARKER.exec(String(body ?? ''))
  if (!match) return null
  try {
    const data = JSON.parse(match[1])
    if (typeof data.runId !== 'string' || data.runId === '') return null
    return {
      runId: data.runId,
      attempt: Number.isInteger(data.attempt) && data.attempt > 0 ? data.attempt : 1,
      total_usd: typeof data.total_usd === 'number' ? data.total_usd : null,
      calls: typeof data.calls === 'number' ? data.calls : 0,
      estimated: Boolean(data.estimated),
    }
  } catch {
    return null
  }
}

/** Calls grouped by agent, in first-seen order: count, dollars, purposes. */
function groupByAgent(byAgent) {
  const groups = new Map()
  for (const call of byAgent) {
    const g = groups.get(call.agent) ?? { agent: call.agent, calls: 0, usd: 0, priced: 0, why: [] }
    g.calls += 1
    if (typeof call.cost_usd === 'number') {
      g.usd += call.cost_usd
      g.priced += 1
    }
    g.why.push(call.purpose ?? 'unknown')
    groups.set(call.agent, g)
  }
  return [...groups.values()]
}

/** `first, repair x2`: purposes in first-seen order with repeats counted. */
function describePurposes(why) {
  const counts = new Map()
  for (const p of why) counts.set(p, (counts.get(p) ?? 0) + 1)
  return [...counts].map(([p, n]) => (n > 1 ? `${p} x${n}` : p)).join(', ')
}

function tableRow(g) {
  const cost = g.priced === 0 ? 'unpriced' : `$${g.usd.toFixed(2)}`
  return `| ${g.agent} | ${g.calls} | ${describePurposes(g.why)} | ${cost} |`
}

/** The parenthesis after the total: retries, and what makes the number soft. */
function qualifiers(cost) {
  const retries = typeof cost.retries === 'number' ? cost.retries : 0
  return [
    retries > 0 ? plural(retries, 'retry', 'retries') : '',
    cost.estimated ? 'partly estimated' : '',
    cost.partial ? 'some calls unpriced' : '',
  ].filter(Boolean)
}

/**
 * The failure issue's cost section: one line with the total, a table per
 * agent, and the marker. Without a cost record it says so, so a missing number
 * is never read as a free run.
 *
 * @param {object|null} cost the failed run's `cost.json`, or null
 * @param {string|number} runId
 * @param {number} [runAttempt]
 * @returns {string}
 */
export function formatFailureCost(cost, runId, runAttempt) {
  if (!cost || typeof cost !== 'object') {
    return 'Spend: not recorded. The failure artifact has no `cost.json`, so what this run cost is unknown.'
  }
  const calls = typeof cost.calls === 'number' ? cost.calls : 0
  const note = qualifiers(cost)
  const line = `Spend before it failed: ${usd(cost.total_usd)} across ${plural(calls, 'call', 'calls')}${
    note.length ? ` (${note.join(', ')})` : ''
  }.`
  const groups = groupByAgent(Array.isArray(cost.byAgent) ? cost.byAgent : [])
  const table = groups.length
    ? ['', '| Agent | Calls | Why | Cost |', '| --- | --- | --- | --- |', ...groups.map(tableRow)]
    : []
  return [line, ...table, '', costMarker(cost, runId, runAttempt)].join('\n')
}
