/**
 * The backstop for a missed night (#193): its decision, and the workflow that
 * carries the decision out.
 *
 * A scheduled Daily Redesign that GitHub never delivers, or that the guard
 * skips, fails nothing, so its failure notice never fires. The backstop checks
 * for the night itself and dispatches at most one run per New York day. If
 * that run leaves no night either, it opens one issue.
 */

import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'

import {
  BACKSTOP_WORKFLOW,
  backstopDispatched,
  backstopIssueTitle,
  DISPATCH_JOB_NAME,
  decide,
  dispatchInputs,
  hasHandoff,
  issueBody,
  NIGHTLY_WORKFLOW,
  resumeCandidates,
  runsOn,
  siteDate,
  zipEntryNames,
} from '../../scripts/nightly-backstop.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const WORKFLOWS = path.join(ROOT, '.github', 'workflows')
const workflow = yaml.load(readFileSync(path.join(WORKFLOWS, BACKSTOP_WORKFLOW), 'utf8'))

const DATE = '2026-09-22'
/** A GitHub expression, spelled without a template-literal placeholder. */
const ghExpr = (inner) => `\${{ ${inner} }}`

/** A Daily Redesign run, created at 10:00 New York time on DATE unless told otherwise. */
function nightly(over = {}) {
  return {
    id: 1,
    event: 'schedule',
    status: 'completed',
    conclusion: 'success',
    created_at: '2026-09-22T14:00:00Z',
    ...over,
  }
}

function facts(over = {}) {
  return {
    date: DATE,
    nightExists: false,
    nightlyRuns: [],
    dispatchedByBackstop: false,
    issueExists: false,
    ...over,
  }
}

describe('siteDate and runsOn', () => {
  it("read New York's calendar day, not UTC's", () => {
    // 03:30 UTC on the 23rd is 23:30 EDT on the 22nd.
    expect(siteDate(new Date('2026-09-23T03:30:00Z'))).toBe('2026-09-22')
    expect(siteDate(new Date('2026-09-23T04:30:00Z'))).toBe('2026-09-23')
    // Winter: EST is UTC-5.
    expect(siteDate(new Date('2026-12-02T04:30:00Z'))).toBe('2026-12-01')
  })

  it('keep only the runs created on the day in New York', () => {
    const late = nightly({ id: 2, created_at: '2026-09-23T03:30:00Z' }) // 23:30 EDT on the 22nd
    const next = nightly({ id: 3, created_at: '2026-09-23T04:20:00Z' }) // 00:20 EDT on the 23rd
    const before = nightly({ id: 4, created_at: '2026-09-22T03:59:00Z' }) // 23:59 EDT on the 21st
    expect(runsOn([late, next, before], DATE).map((r) => r.id)).toEqual([2])
  })
})

describe('decide', () => {
  it('does nothing when the night is on main, whatever the runs say', () => {
    const d = decide(
      facts({
        nightExists: true,
        nightlyRuns: [nightly({ status: 'in_progress' })],
        dispatchedByBackstop: true,
      })
    )
    expect(d.action).toBe('none')
    expect(d.reason).toContain(`archive/${DATE}/record.json`)
  })

  it('dispatches when no run was created today (the trigger was dropped)', () => {
    expect(decide(facts()).action).toBe('dispatch')
  })

  it("dispatches when today's scheduled runs finished without a night (both guard skips)", () => {
    const runs = [nightly({ id: 1 }), nightly({ id: 2, created_at: '2026-09-22T05:15:00Z' })]
    expect(decide(facts({ nightlyRuns: runs })).action).toBe('dispatch')
  })

  it('dispatches once when the scheduled run failed', () => {
    expect(decide(facts({ nightlyRuns: [nightly({ conclusion: 'failure' })] })).action).toBe(
      'dispatch'
    )
  })

  it('ignores runs from other days', () => {
    const yesterday = nightly({ event: 'workflow_dispatch', created_at: '2026-09-21T14:00:00Z' })
    const stale = nightly({ status: 'queued', created_at: '2026-09-21T14:00:00Z' })
    expect(decide(facts({ nightlyRuns: [yesterday, stale] })).action).toBe('dispatch')
  })

  for (const status of ['queued', 'in_progress', 'waiting', 'requested', 'pending']) {
    it(`waits while a run of today's is ${status}`, () => {
      const d = decide(facts({ nightlyRuns: [nightly({ status, conclusion: null })] }))
      expect(d.action).toBe('wait')
    })
  }

  it('waits for a scheduled run that arrives hours late, rather than dispatching beside it', () => {
    const late = nightly({ status: 'queued', conclusion: null, created_at: '2026-09-22T20:05:00Z' })
    expect(decide(facts({ nightlyRuns: [late] })).action).toBe('wait')
  })

  it('waits for its own dispatched run rather than reporting it', () => {
    const d = decide(
      facts({
        dispatchedByBackstop: true,
        nightlyRuns: [nightly({ event: 'workflow_dispatch', status: 'in_progress' })],
      })
    )
    expect(d.action).toBe('wait')
  })

  it('opens the issue when its dispatch finished without a night', () => {
    const d = decide(
      facts({
        dispatchedByBackstop: true,
        nightlyRuns: [nightly({ event: 'workflow_dispatch', conclusion: 'failure' })],
      })
    )
    expect(d.action).toBe('issue')
  })

  it('opens the issue when its dispatch never appeared', () => {
    expect(decide(facts({ dispatchedByBackstop: true })).action).toBe('issue')
  })

  it('counts a manual dispatch today as the day spent', () => {
    const manual = nightly({ event: 'workflow_dispatch', conclusion: 'failure' })
    const d = decide(facts({ nightlyRuns: [manual] }))
    expect(d.action).toBe('issue')
    expect(d.reason).toContain('manual dispatch')
  })

  it('opens the issue only once', () => {
    const d = decide(facts({ dispatchedByBackstop: true, issueExists: true }))
    expect(d.action).toBe('none')
  })

  it('never dispatches twice in a day, however many checks run', () => {
    // Walk a day of checks. Each check dispatches only if nothing has, and
    // every later check sees that.
    const outcomes = []
    let dispatched = false
    let issue = false
    for (let check = 0; check < 5; check++) {
      const d = decide(facts({ dispatchedByBackstop: dispatched, issueExists: issue }))
      outcomes.push(d.action)
      if (d.action === 'dispatch') dispatched = true
      if (d.action === 'issue') issue = true
    }
    expect(outcomes).toEqual(['dispatch', 'issue', 'none', 'none', 'none'])
  })
})

describe('backstopDispatched', () => {
  it("reads a successful dispatch job as the day's dispatch", () => {
    expect(backstopDispatched([{ name: DISPATCH_JOB_NAME, conclusion: 'success' }])).toBe(true)
  })

  it('does not count a skipped or failed dispatch job, or any other job', () => {
    expect(
      backstopDispatched([
        { name: DISPATCH_JOB_NAME, conclusion: 'skipped' },
        { name: DISPATCH_JOB_NAME, conclusion: 'failure' },
        { name: 'check', conclusion: 'success' },
      ])
    ).toBe(false)
  })
})

describe('the issue', () => {
  it('names the day in its title, which is also how a later check finds it', () => {
    expect(backstopIssueTitle(DATE)).toBe(`Nightly backstop: no night for ${DATE}`)
  })

  it('stays clear of the failure-issue title the next run reads its cost from', () => {
    expect(backstopIssueTitle(DATE)).not.toMatch(/Daily redesign failed/i)
  })

  it('says why and where to look', () => {
    const body = issueBody({ date: DATE, reason: 'because', repo: 'o/r' })
    expect(body).toContain('Why: because.')
    expect(body).toContain(`https://github.com/o/r/actions/workflows/${NIGHTLY_WORKFLOW}`)
  })
})

describe('the workflow', () => {
  const { check, dispatch, report } = workflow.jobs

  it('checks at least twice a day, off the hour, and never overlaps itself', () => {
    const crons = workflow.on.schedule.map((s) => s.cron)
    expect(crons.length).toBeGreaterThanOrEqual(2)
    for (const c of crons) expect(c.split(' ')[0]).not.toBe('0')
    expect(workflow.concurrency).toEqual({ group: 'nightly-backstop', 'cancel-in-progress': false })
  })

  it('checks after the nightly should have landed, in both seasons', () => {
    // Every check in New York's morning or afternoon: 09:00-18:00 EST and EDT.
    for (const { cron } of workflow.on.schedule) {
      const hourUtc = Number(cron.split(' ')[1])
      expect(hourUtc - 5).toBeGreaterThanOrEqual(9)
      expect(hourUtc - 4).toBeLessThanOrEqual(18)
    }
  })

  it('gives no job a token by default, and each job only what it uses', () => {
    expect(workflow.permissions).toEqual({})
    expect(check.permissions).toEqual({ contents: 'read', actions: 'read', issues: 'read' })
    expect(dispatch.permissions).toEqual({ actions: 'write' })
    expect(report.permissions).toEqual({ issues: 'write' })
    expect(Object.keys(workflow.jobs).sort()).toEqual(['check', 'dispatch', 'report'])
  })

  it('pins every action to the SHA the other workflows use', () => {
    const pinsElsewhere = new Set()
    for (const file of readdirSync(WORKFLOWS)) {
      if (file === BACKSTOP_WORKFLOW || !/\.ya?ml$/.test(file)) continue
      const text = readFileSync(path.join(WORKFLOWS, file), 'utf8')
      for (const m of text.matchAll(/uses:\s*(\S+@[0-9a-f]{40})/g)) pinsElsewhere.add(m[1])
    }
    const uses = Object.values(workflow.jobs).flatMap((job) =>
      job.steps.filter((s) => s.uses).map((s) => s.uses)
    )
    expect(uses.length).toBeGreaterThan(0)
    for (const u of uses) {
      expect(u, u).toMatch(/^[\w-]+\/[\w-]+@[0-9a-f]{40}$/)
      expect(pinsElsewhere.has(u), `${u} is the pin the other workflows use`).toBe(true)
    }
  })

  it('decides with the tested script, from a checkout holding no credential', () => {
    const checkout = check.steps[0]
    expect(checkout.with['persist-credentials']).toBe(false)
    const decideStep = check.steps.find((s) => s.id === 'decide')
    expect(decideStep.run).toBe('node scripts/nightly-backstop.js')
    expect(check.outputs.action).toBe(ghExpr('steps.decide.outputs.action'))
  })

  it('names the dispatch job the way the script reads it back', () => {
    expect(dispatch.name).toBe(DISPATCH_JOB_NAME)
  })

  it('dispatches only on a dispatch verdict, and never on a manual dry run', () => {
    expect(dispatch.needs).toBe('check')
    expect(dispatch.if).toContain("needs.check.outputs.action == 'dispatch'")
    expect(dispatch.if).toContain('!inputs.dry_run')
    expect(workflow.on.workflow_dispatch.inputs.dry_run.default).toBe(true)
    const step = dispatch.steps.find((s) => s.name === 'Dispatch')
    expect(step.run).toContain(`gh workflow run ${NIGHTLY_WORKFLOW}`)
    expect(step.run).toContain('--ref main')
    // Never a dry run; resume_run_id is the check's, through env, and empty
    // for a full night.
    expect(step.run).not.toMatch(/dry_run/)
    expect(step.run).toContain('-f resume_run_id="$RESUME_RUN_ID"')
    expect(step.run).not.toContain(ghExpr('').slice(0, 3))
    expect(step.env.RESUME_RUN_ID).toBe(ghExpr('needs.check.outputs.resume_run_id'))
    expect(check.outputs.resume_run_id).toBe(ghExpr('steps.decide.outputs.resume_run_id'))
  })

  it('opens an issue only on an issue verdict', () => {
    expect(report.needs).toBe('check')
    expect(report.if).toContain("needs.check.outputs.action == 'issue'")
    expect(report.if).toContain('!inputs.dry_run')
    const step = report.steps[0]
    expect(step.run).toContain('gh issue create')
    // Passed through env, never spliced into the shell line.
    expect(step.run).not.toContain(ghExpr('').slice(0, 3))
    expect(step.env.TITLE).toBe(ghExpr('needs.check.outputs.title'))
  })

  it('holds no secret beyond the workflow token', () => {
    const text = JSON.stringify(workflow)
    const secrets = [...text.matchAll(/secrets\.(\w+)/g)].map((m) => m[1])
    expect(new Set(secrets)).toEqual(new Set(['GITHUB_TOKEN']))
  })
})

/**
 * A zip holding the named files, stored uncompressed. Enough of the format
 * for zipEntryNames, which reads only the central directory.
 */
function makeZip(names) {
  const locals = []
  const centrals = []
  let offset = 0
  for (const name of names) {
    const n = Buffer.from(name)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(n.length, 26)
    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(n.length, 28)
    central.writeUInt32LE(offset, 42)
    locals.push(local, n)
    centrals.push(central, n)
    offset += local.length + n.length
  }
  const dir = Buffer.concat(centrals)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(names.length, 8)
  end.writeUInt16LE(names.length, 10)
  end.writeUInt32LE(dir.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, dir, end])
}

describe('a dry run does not spend the day', () => {
  it("reads the dispatch inputs from the run's title", () => {
    expect(dispatchInputs({ display_title: 'Daily Redesign' })).toEqual({
      dryRun: false,
      resumeRunId: '',
    })
    expect(dispatchInputs({ display_title: 'Daily Redesign (dry run)' }).dryRun).toBe(true)
    expect(dispatchInputs({ display_title: 'Daily Redesign (resume 123)' })).toEqual({
      dryRun: false,
      resumeRunId: '123',
    })
    expect(dispatchInputs({ display_title: 'Daily Redesign (dry run) (resume 9)' })).toEqual({
      dryRun: true,
      resumeRunId: '9',
    })
    // Runs from before run-name existed read as a full night.
    expect(dispatchInputs({})).toEqual({ dryRun: false, resumeRunId: '' })
  })

  it('titles each run the way dispatchInputs reads it', () => {
    const daily = yaml.load(readFileSync(path.join(WORKFLOWS, NIGHTLY_WORKFLOW), 'utf8'))
    expect(daily['run-name']).toBe(
      ghExpr(
        "format('Daily Redesign{0}{1}', inputs.dry_run && ' (dry run)' || '', inputs.resume_run_id && format(' (resume {0})', inputs.resume_run_id) || '')"
      )
    )
    // What that expression renders for each dispatch, read back.
    const render = (dry, resume) =>
      `Daily Redesign${dry ? ' (dry run)' : ''}${resume ? ` (resume ${resume})` : ''}`
    for (const [dry, resume] of [
      [false, ''],
      [true, ''],
      [false, '42'],
      [true, '42'],
    ]) {
      expect(dispatchInputs({ display_title: render(dry, resume) })).toEqual({
        dryRun: dry,
        resumeRunId: resume,
      })
    }
  })

  it('dispatches past a manual dry run, finished or running', () => {
    const done = nightly({ event: 'workflow_dispatch', display_title: 'Daily Redesign (dry run)' })
    const running = nightly({
      id: 2,
      event: 'workflow_dispatch',
      status: 'in_progress',
      conclusion: null,
      display_title: 'Daily Redesign (dry run)',
    })
    expect(decide(facts({ nightlyRuns: [done, running] })).action).toBe('dispatch')
  })

  it('still counts a manual resume as the day spent', () => {
    const resume = nightly({
      event: 'workflow_dispatch',
      conclusion: 'failure',
      display_title: 'Daily Redesign (resume 7)',
    })
    expect(decide(facts({ nightlyRuns: [resume] })).action).toBe('issue')
  })
})

describe('resuming a failed night', () => {
  it("resumes today's failed scheduled run when it left a handoff", () => {
    const failed = nightly({ id: 77, conclusion: 'failure' })
    const d = decide(facts({ nightlyRuns: [failed], resumable: 77 }))
    expect(d).toMatchObject({ action: 'dispatch', resumeRunId: '77' })
    expect(d.reason).toContain('resuming run 77')
  })

  it('dispatches a full night when there is nothing to resume', () => {
    const d = decide(facts({ nightlyRuns: [nightly({ conclusion: 'failure' })] }))
    expect(d).toMatchObject({ action: 'dispatch', resumeRunId: '' })
  })

  it('is still the one dispatch: after it, a check waits or reports, never resumes again', () => {
    const resumed = nightly({
      id: 9,
      event: 'workflow_dispatch',
      display_title: 'Daily Redesign (resume 77)',
    })
    const base = { dispatchedByBackstop: true, resumable: 77 }
    expect(
      decide(facts({ ...base, nightlyRuns: [{ ...resumed, status: 'in_progress' }] })).action
    ).toBe('wait')
    expect(
      decide(facts({ ...base, nightlyRuns: [{ ...resumed, conclusion: 'failure' }] })).action
    ).toBe('issue')
    expect(decide(facts({ ...base, issueExists: true })).action).toBe('none')
  })

  it('returns an empty resume id for every other verdict', () => {
    expect(decide(facts({ nightExists: true, resumable: 1 })).resumeRunId).toBe('')
    expect(decide(facts({ dispatchedByBackstop: true, resumable: 1 })).resumeRunId).toBe('')
  })

  it("takes only today's failed scheduled runs, newest first", () => {
    const runs = [
      nightly({ id: 1, conclusion: 'failure', created_at: '2026-09-22T09:00:00Z' }),
      nightly({ id: 2, conclusion: 'failure', created_at: '2026-09-22T10:00:00Z' }),
      nightly({ id: 3, conclusion: 'success' }),
      nightly({ id: 4, conclusion: 'failure', event: 'workflow_dispatch' }),
      nightly({ id: 5, conclusion: 'failure', created_at: '2026-09-21T10:00:00Z' }),
      nightly({ id: 6, status: 'in_progress', conclusion: null }),
    ]
    expect(resumeCandidates(runs, DATE).map((r) => r.id)).toEqual([2, 1])
  })

  it('reads the file names out of an artifact zip', () => {
    const names = [
      'archive/2026-09-22/build-failed-1/handoff.json',
      'archive/2026-09-22/build-failed-1/trace.json',
      'signals/handoff.json',
    ]
    expect(zipEntryNames(makeZip(names))).toEqual(names)
    expect(() => zipEntryNames(Buffer.from('not a zip'))).toThrow()
  })

  it('knows a handoff wherever the artifact put it', () => {
    expect(hasHandoff(['archive/2026-09-22/build-failed-1/handoff.json'])).toBe(true)
    expect(hasHandoff(['signals/handoff.json'])).toBe(true)
    expect(hasHandoff(['2026-09-21/last-build-output.txt', 'x/handoff.json.bak'])).toBe(false)
  })
})
