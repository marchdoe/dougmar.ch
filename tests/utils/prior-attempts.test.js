import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { recordUsage, resetLedger } from '../../scripts/utils/cost-ledger.js'
import { costMarker } from '../../scripts/utils/failure-cost-section.js'
import {
  PRIOR_ATTEMPTS_FILE,
  attemptsFromIssues,
  currentCost,
  failureIssueTitle,
  logPriorAttempts,
  readPriorAttempts,
  withPriorAttempts,
  writePriorAttempts,
} from '../../scripts/utils/prior-attempts.js'

const DATE = '2026-09-20'

const failureIssue = (runId, total, over = {}) => ({
  number: Number(runId) % 1000,
  title: failureIssueTitle(DATE),
  body: `The daily redesign pipeline failed.\n\n${costMarker({ total_usd: total, calls: 10 }, runId)}`,
  ...over,
})

describe('attemptsFromIssues', () => {
  it("reads a failed run's spend out of its issue", () => {
    expect(attemptsFromIssues([failureIssue('111', 4.18)], DATE)).toEqual([
      { runId: '111', attempt: 1, issue: 111, total_usd: 4.18, calls: 10, estimated: false },
    ])
  })

  it("counts a re-run of the same run's failed jobs as its own attempt, but not the same issue twice", () => {
    const rerun = failureIssue('111', 2.5, {
      number: 700,
      body: `failed again\n\n${costMarker({ total_usd: 2.5, calls: 6 }, '111', 2)}`,
    })
    const found = attemptsFromIssues([failureIssue('111', 4.18), rerun, rerun], DATE)
    expect(found.map((a) => [a.runId, a.attempt, a.total_usd])).toEqual([
      ['111', 1, 4.18],
      ['111', 2, 2.5],
    ])
  })

  it('keeps one attempt per run, and every run of the night', () => {
    const issues = [failureIssue('111', 4.18), failureIssue('222', 1.2), failureIssue('111', 4.18)]
    expect(attemptsFromIssues(issues, DATE).map((a) => a.runId)).toEqual(['111', '222'])
  })

  it('compares titles exactly, because the search that found them was loose', () => {
    const issues = [
      failureIssue('111', 4.18, { title: failureIssueTitle('2026-09-19') }),
      failureIssue('222', 1, { title: `Daily redesign failed - ${DATE}` }),
      failureIssue('333', 2, { title: `Rate: ${DATE}` }),
    ]
    expect(attemptsFromIssues(issues, DATE)).toEqual([])
  })

  it('skips an issue that records no spend (one from before the marker, or an edited one)', () => {
    const bare = {
      number: 4,
      title: failureIssueTitle(DATE),
      body: 'The daily redesign pipeline failed.',
    }
    expect(attemptsFromIssues([bare], DATE)).toEqual([])
  })

  it('reads anything that is not a list as nothing', () => {
    expect(attemptsFromIssues(null, DATE)).toEqual([])
    expect(attemptsFromIssues({ message: 'Bad credentials' }, DATE)).toEqual([])
    expect(attemptsFromIssues([null, 7], DATE)).toEqual([])
  })
})

describe('withPriorAttempts', () => {
  const cost = { total_usd: 4.82, calls: 12, retries: 1, byAgent: [] }

  it('is the summary itself for a night with one attempt', () => {
    expect(withPriorAttempts(cost, [])).toBe(cost)
  })

  it("adds the night's total beside the run's own: the 09-20 night was $9.00, not $4.82", () => {
    const night = withPriorAttempts(cost, [{ runId: '111', total_usd: 4.18, calls: 10 }])
    expect(night.total_usd).toBe(4.82)
    expect(night.night_usd).toBe(9)
    expect(night.priorAttempts).toEqual([{ runId: '111', total_usd: 4.18, calls: 10 }])
  })

  it('sums what is priced and leaves an unpriced attempt out of the sum', () => {
    const night = withPriorAttempts(cost, [
      { runId: '1', total_usd: null },
      { runId: '2', total_usd: 1 },
    ])
    expect(night.night_usd).toBe(5.82)
  })

  it('has no night total when nothing is priced anywhere', () => {
    expect(withPriorAttempts({ total_usd: null }, [{ total_usd: null }]).night_usd).toBeNull()
  })
})

describe('the file the workflow leaves', () => {
  let root
  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'dm-prior-'))
    resetLedger()
  })
  afterEach(async () => {
    await rm(root, { recursive: true, force: true })
  })

  it('writePriorAttempts leaves signals/prior-attempts.json, and readPriorAttempts reads it', async () => {
    const found = await writePriorAttempts([failureIssue('111', 4.18)], DATE, root)
    expect(found).toHaveLength(1)
    expect(PRIOR_ATTEMPTS_FILE).toBe(path.join('signals', 'prior-attempts.json'))
    expect((await readPriorAttempts(root))[0].runId).toBe('111')
  })

  it('writes no file for a night with no earlier attempt', async () => {
    await writePriorAttempts([], DATE, root)
    await expect(readFile(path.join(root, PRIOR_ATTEMPTS_FILE))).rejects.toThrow(/ENOENT/)
    expect(await readPriorAttempts(root)).toEqual([])
  })

  it('reads a corrupt file as no attempts, because telemetry never fails a night', async () => {
    await mkdir(path.join(root, 'signals'))
    await writeFile(path.join(root, PRIOR_ATTEMPTS_FILE), '{oops')
    expect(await readPriorAttempts(root)).toEqual([])
    await writeFile(path.join(root, PRIOR_ATTEMPTS_FILE), '{"not":"a list"}')
    expect(await readPriorAttempts(root)).toEqual([])
  })

  it("currentCost is the ledger's own summary when there is no file", async () => {
    recordUsage({ agent: 'art-director', model: 'claude-opus-4-8', costUsd: 0.5, purpose: 'first' })
    const cost = await currentCost(root)
    expect(cost.total_usd).toBe(0.5)
    expect(cost).not.toHaveProperty('priorAttempts')
    expect(cost).not.toHaveProperty('night_usd')
  })

  it('currentCost carries the earlier attempts into the record', async () => {
    await writePriorAttempts([failureIssue('111', 4.18)], DATE, root)
    recordUsage({ agent: 'react-engineer', model: 'claude-sonnet-5', costUsd: 4.82 })
    const cost = await currentCost(root)
    expect(cost.total_usd).toBe(4.82)
    expect(cost.night_usd).toBe(9)
    expect(cost.byAgent).toHaveLength(1)
  })
})

describe('logPriorAttempts', () => {
  it('says nothing for a night that took one attempt, and the night total for one that took more', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    logPriorAttempts({ total_usd: 1 })
    expect(log).not.toHaveBeenCalled()
    logPriorAttempts({ priorAttempts: [{}], night_usd: 9 })
    expect(log).toHaveBeenCalledWith('  earlier failed attempt(s): 1, night total $9.0000')
    logPriorAttempts({ priorAttempts: [{}], night_usd: null })
    expect(log).toHaveBeenLastCalledWith('  earlier failed attempt(s): 1, night total unpriced')
    log.mockRestore()
  })
})
