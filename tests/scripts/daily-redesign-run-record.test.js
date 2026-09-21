/**
 * What the nightly workflow does for a failed run's spend and for a re-run that
 * resumes it (#578).
 *
 * Three properties matter and each has a way to rot quietly. The failure
 * artifact has to carry what a resume reads. The resume path has to be
 * reachable only from a manual dispatch that named a run: a scheduled night
 * that replayed an old run's responses would ship yesterday's design as
 * today's. And the resume must not widen what the job that holds the deploy
 * key can see or run.
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'
import { failureIssueTitle } from '../../scripts/utils/prior-attempts.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const src = readFileSync(path.join(ROOT, '.github', 'workflows', 'daily-redesign.yml'), 'utf8')
const workflow = yaml.load(src)
const { redesign, publish, notify } = workflow.jobs

const stepNamed = (job, name) => job.steps.find((s) => s.name === name)
const indexOfStep = (job, name) => job.steps.findIndex((s) => s.name === name)
const text = (value) => JSON.stringify(value)

/** A GitHub expression, spelled without a literal `${{` in a plain string (Biome flags those). */
const ghExpr = (inner) => `\${{ ${inner} }}`
const DOLLAR = '$'
const EXPRESSION_OPEN = `${DOLLAR}{{`

const DISPATCH_ONLY = "github.event_name == 'workflow_dispatch'"

describe('the failure artifact', () => {
  const upload = stepNamed(redesign, 'Upload failure diagnostics')

  it('is uploaded when the redesign job fails, under the name the resume and the issue cite', () => {
    expect(upload.if).toBe('failure()')
    expect(upload.uses).toMatch(/^actions\/upload-artifact@[0-9a-f]{40}/)
    expect(upload.with.name).toBe(`build-failed-${ghExpr('github.run_id')}`)
  })

  it('includes the directory the pipeline writes cost.json and handoff.json into', () => {
    // design-agents.js writes both beside trace.json in archive/<date>/build-failed-<ts>/.
    expect(upload.with.path).toContain('archive/*/build-failed-*/')
    expect(src).toMatch(/build-failed-\*\/ also holds cost\.json[\s\S]*handoff\.json/)
  })

  // 2026-09-21: the swarm shipped a whole night and "Verify the night's output
  // renders" then failed. The artifact (run 35585953176) held only
  // last-build-output.txt and last-static-checks.txt: no trace, no cost, and no
  // build-failed-*/ directory, because the swarm had not failed.
  it('also carries what a night that shipped and then failed a later step left', () => {
    const paths = upload.with.path.split('\n').map((p) => p.trim())
    const date = ghExpr('steps.redesign.outputs.date')
    expect(paths).toContain(`archive/${date}/build-[0-9]*/trace.json`)
    expect(paths).toContain(`archive/${date}/build-[0-9]*/cost.json`)
    // The handoff of a shipped night is written to signals/, which is never staged.
    expect(paths).toContain('signals/handoff.json')
    expect(stepNamed(redesign, 'Run daily redesign').id).toBe('redesign')
  })

  it('keeps the failure directories out of main, as before', () => {
    const stage = stepNamed(redesign, "Stage the night's output").run
    expect(stage).toContain('build-failed-*')
    expect(stage).not.toMatch(/git add[^\n]*build-failed/)
    expect(stage).not.toMatch(/git add[^\n]*handoff/)
  })
})

describe('the resume input', () => {
  const input = workflow.on.workflow_dispatch.inputs.resume_run_id

  it('is a string on the manual dispatch, empty by default, so a normal dispatch is a normal run', () => {
    expect(input).toMatchObject({ type: 'string', default: '' })
    expect(input.required).not.toBe(true)
  })

  it('is not an input of the schedule trigger', () => {
    expect(workflow.on.schedule).toBeDefined()
    expect(Object.keys(workflow.on)).toEqual(['schedule', 'workflow_dispatch'])
  })

  const resumeSteps = [
    'Check the run to resume',
    "Download the failed run's handoff",
    'Stage the handoff for the pipeline',
  ]

  it.each(resumeSteps)('%s runs only on a dispatch that named a run', (name) => {
    const step = stepNamed(redesign, name)
    expect(step.if).toContain(DISPATCH_ONLY)
    expect(step.if).toContain("inputs.resume_run_id != ''")
  })

  it('every step of the job that reads the input is guarded by the dispatch event', () => {
    for (const step of redesign.steps) {
      const mentionsResume = /resume_run_id|RESUME_HANDOFF|resume-handoff/.test(text(step))
      if (!mentionsResume || step.name === 'Run daily redesign') continue
      expect(step.if ?? '', step.name).toContain(DISPATCH_ONLY)
    }
  })

  it('reaches the pipeline as RESUME_HANDOFF, set only by the dispatch event', () => {
    const run = stepNamed(redesign, 'Run daily redesign')
    expect(run.env.RESUME_HANDOFF).toContain(DISPATCH_ONLY)
    expect(run.env.RESUME_HANDOFF).toContain("inputs.resume_run_id != ''")
    expect(run.env.RESUME_HANDOFF).toContain("'signals/resume-handoff.json'")
    // Nothing else, on any job, sets it.
    expect(src.match(/RESUME_HANDOFF:/g)).toHaveLength(1)
  })

  it('takes only a run id, before anything is downloaded', () => {
    const check = stepNamed(redesign, 'Check the run to resume')
    expect(check.run).toContain('^[0-9]+$')
    expect(indexOfStep(redesign, 'Check the run to resume')).toBeLessThan(
      indexOfStep(redesign, "Download the failed run's handoff")
    )
    // The input reaches the shell through env, never interpolated into the script.
    expect(check.run).not.toContain(EXPRESSION_OPEN)
    expect(stepNamed(redesign, 'Stage the handoff for the pipeline').run).not.toContain(
      EXPRESSION_OPEN
    )
  })

  it("downloads the named run's failure artifact with the token, from this repository", () => {
    const download = stepNamed(redesign, "Download the failed run's handoff")
    expect(download.uses).toMatch(/^actions\/download-artifact@[0-9a-f]{40}/)
    expect(download.with).toMatchObject({
      name: `build-failed-${ghExpr('inputs.resume_run_id')}`,
      'run-id': ghExpr('inputs.resume_run_id'),
      'github-token': ghExpr('secrets.GITHUB_TOKEN'),
    })
    expect(download.with.repository).toBeUndefined()
  })

  it('stages the handoff before the paid step, and fails when the artifact has none', () => {
    expect(indexOfStep(redesign, 'Stage the handoff for the pipeline')).toBeLessThan(
      indexOfStep(redesign, 'Run daily redesign')
    )
    const stage = stepNamed(redesign, 'Stage the handoff for the pipeline').run
    expect(stage).toContain('handoff.json')
    expect(stage).toMatch(/::error::[^\n]*left no handoff\.json/)
    expect(stage).toMatch(/exit 1/)
  })

  it('treats the artifact as data: it is copied to a path and never executed by a step', () => {
    for (const name of resumeSteps) {
      const run = stepNamed(redesign, name).run ?? ''
      expect(run).not.toMatch(
        /\bnode\b|\bpnpm\b|\bsource\b|\bbash\s+\S*handoff|\beval\b|\.\/\S*handoff/
      )
    }
  })
})

describe('the resume does not widen what holds a credential', () => {
  it('leaves the top of the workflow with no token and every job with its own list', () => {
    expect(workflow.permissions).toEqual({})
    for (const job of Object.values(workflow.jobs)) {
      expect(job.permissions, 'every job names its permissions').toBeDefined()
    }
  })

  it('gives the redesign job read access to actions and nothing that writes code', () => {
    expect(redesign.permissions).toEqual({ contents: 'read', issues: 'write', actions: 'read' })
  })

  it('keeps the publish job, which holds the deploy key, away from the failed run and the handoff', () => {
    expect(publish.permissions).toEqual({ contents: 'read', issues: 'write' })
    const body = text(publish)
    expect(body).toContain('DEPLOY_KEY')
    expect(body).not.toMatch(/resume|handoff|build-failed|run-id/i)
    for (const step of publish.steps) {
      if (!/download-artifact/.test(step.uses ?? '')) continue
      expect(step.with.name).toBe(`nightly-${ghExpr('github.run_id')}`)
    }
  })

  it('never hands the deploy key to a job that runs generated code or reads the artifact', () => {
    expect(text(redesign)).not.toContain('DEPLOY_KEY')
    expect(text(notify)).not.toContain('DEPLOY_KEY')
  })

  it('keeps the GitHub token out of the step that runs the pipeline', () => {
    const run = stepNamed(redesign, 'Run daily redesign')
    expect(text(run)).not.toMatch(/GITHUB_TOKEN|GH_TOKEN/)
    // The one step that reads earlier attempts has the token and no API key.
    const attempts = stepNamed(redesign, "Read the night's earlier failed attempts")
    expect(text(attempts)).toContain('secrets.GITHUB_TOKEN')
    expect(text(attempts)).not.toContain('ANTHROPIC_API_KEY')
  })

  it('pins every action added by SHA, as the rest of the workflow is', () => {
    const uses = []
    for (const job of Object.values(workflow.jobs)) {
      for (const step of job.steps) if (step.uses) uses.push(step.uses)
    }
    expect(uses.length).toBeGreaterThan(8)
    for (const u of uses) expect(u, u).toMatch(/^[\w-]+\/[\w-]+@[0-9a-f]{40}$/)
  })
})

describe('the failure issue says what the run spent', () => {
  it("reads the failed run's cost.json from its artifact in the notify job", () => {
    const download = stepNamed(notify, 'Download the failure diagnostics')
    expect(download.uses).toMatch(/^actions\/download-artifact@[0-9a-f]{40}/)
    expect(download.with.name).toBe(`build-failed-${ghExpr('github.run_id')}`)
    // A failed push leaves no such artifact, and the issue must open anyway.
    expect(download['continue-on-error']).toBe(true)
    expect(download.if).toContain("needs.redesign.result == 'failure'")
  })

  it('formats the section with a tested script, not inline JavaScript', () => {
    const read = stepNamed(notify, 'Read what the failed run spent')
    expect(read.run).toContain('node scripts/print-failed-run-cost.js')
    // A re-run of failed jobs keeps the run id; the attempt keeps its spend apart.
    expect(read.env.RUN_ATTEMPT).toBe(ghExpr('github.run_attempt'))
    expect(read.run).toContain('"$RUN_ATTEMPT"')
    expect(indexOfStep(notify, 'Read what the failed run spent')).toBeLessThan(
      indexOfStep(notify, 'Notify on failure')
    )
    const checkout = notify.steps[0]
    expect(checkout.uses).toMatch(/^actions\/checkout@[0-9a-f]{40}/)
    expect(checkout.with['persist-credentials']).toBe(false)
    expect(checkout.with['sparse-checkout']).toBe('scripts')
  })

  it('puts the spend and the way to resume into the issue body', () => {
    const script = stepNamed(notify, 'Notify on failure').with.script
    expect(script).toContain('failed-cost.md')
    expect(script).toContain('resume_run_id')
    expect(script).toContain(`${DOLLAR}{context.runId}`)
    // The title the next run searches for is the one built here: the workflow
    // and prior-attempts.js spell it the same way.
    expect(script).toContain(`\`${failureIssueTitle(`${DOLLAR}{today}`)}\``)
  })

  it('has the notify job read the repository and write issues, and nothing more', () => {
    expect(notify.permissions).toEqual({ contents: 'read', issues: 'write' })
  })
})

describe('the run that ships a night records its earlier attempts', () => {
  it('reads them before the paid step, with the failure issues', () => {
    const step = stepNamed(redesign, "Read the night's earlier failed attempts")
    expect(indexOfStep(redesign, "Read the night's earlier failed attempts")).toBeLessThan(
      indexOfStep(redesign, 'Run daily redesign')
    )
    expect(step.run).toContain('gh issue list --label pipeline-failure --state all')
    expect(step.run).toContain('node scripts/write-prior-attempts.js "$TODAY"')
    expect(step.run).toContain('TZ=America/New_York')
  })

  it('never fails the night: a failed read is a warning', () => {
    const step = stepNamed(redesign, "Read the night's earlier failed attempts")
    expect(step.run).toMatch(/\|\| echo "::warning::/)
  })

  it('runs on the schedule too: a night that failed and was re-run by the clock still adds up', () => {
    expect(stepNamed(redesign, "Read the night's earlier failed attempts").if).toBeUndefined()
  })
})

describe('the pipeline entry takes the resume in order', () => {
  const entry = readFileSync(path.join(ROOT, 'scripts', 'daily-redesign.js'), 'utf8')
  const at = (needle) => entry.indexOf(needle)

  it('reads the handoff after the signals are collected, and restores its inputs before the swarm', () => {
    expect(at('await readContext()')).toBeGreaterThan(-1)
    expect(at('await readContext()')).toBeLessThan(at('await loadResume(process.env'))
    expect(at('await loadResume(process.env')).toBeLessThan(at('await restoreInputs(resume'))
    expect(at('await restoreInputs(resume')).toBeLessThan(at('await runAgentSwarm('))
  })

  it('hands the tape to the swarm, and only what the handoff held', () => {
    expect(entry).toContain('runAgentSwarm(context, { tape: resume?.tape })')
  })
})

describe('the files the workflow leaves for a run stay out of git', () => {
  const ignore = readFileSync(path.join(ROOT, '.gitignore'), 'utf8').split('\n')

  it.each(['signals/handoff.json', 'signals/resume-handoff.json', 'signals/prior-attempts.json'])(
    '%s',
    (file) => {
      expect(ignore).toContain(file)
    }
  )

  it('is never staged by the nightly, which names its signals path', () => {
    const stage = stepNamed(redesign, "Stage the night's output").run
    expect(stage).toContain('signals/today.references.md')
    expect(stage).not.toMatch(/signals\/(handoff|prior-attempts)/)
    expect(stage).not.toMatch(/git add[^\n]*\bsignals\/\s/)
  })
})
