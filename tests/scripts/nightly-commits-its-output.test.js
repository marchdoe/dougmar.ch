/**
 * The nightly must commit everything the nightly produces.
 *
 * The daily workflow stages an explicit list of paths rather than `git add -A`,
 * which is deliberate — `archive/<date>/build-failed-*` and `build-pre-*` must
 * never reach main. The cost of that precision is that moving an output path
 * silently stops it being committed, with no error anywhere: the run succeeds,
 * the push succeeds, and the file is simply gone.
 *
 * That happened. #154 moved the day's screenshot from
 * `public/archive/<date>.png` to `public/archive-data/<date>.png`. The old path
 * was covered incidentally by `public/archive/`; the new one was covered by
 * nothing, so from that commit onward no screenshot would ever have been
 * committed again. Nothing failed. It was found by reading the workflow.
 *
 * This asserts the staging list covers every directory the pipeline writes to,
 * and that the exclusions it relies on still hold.
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const WORKFLOW = path.join(ROOT, '.github', 'workflows', 'daily-redesign.yml')
const ROLLBACK = path.join(ROOT, '.github', 'workflows', 'rollback.yml')
const src = readFileSync(WORKFLOW, 'utf8')
const rollbackSrc = readFileSync(ROLLBACK, 'utf8')

/**
 * Everything a successful run writes that has to survive to main, and what
 * writes it. A path added here without being added to the workflow fails.
 */
const OUTPUTS = [
  ['elements/', "the day's preset and chassis preset"],
  ['app/components/', "the React Engineer's components"],
  ['app/routes/', 'the routes, including __root.tsx regenerated from template'],
  ['public/archive/', 'the sealed, framed snapshot of the day (#156, #158)'],
  ['public/og/', 'the share card'],
  ['references/', "the owner's promoted A/B-graded screenshots (#340)"],
  ['signals/today.references.md', 'the references the run consumed'],
]

/**
 * The paths in the `for p in … ; do git add "$p"` loop, and nothing else.
 *
 * Matching against the whole file is not good enough: the first version of
 * this test did that, and it kept passing when the path was deleted from the
 * loop, because the comment above the loop explaining the path still mentioned
 * it. A test that a comment can satisfy is not a test.
 */
function stagedLoopPaths() {
  const m = /for p in ([^;]+); do/.exec(src)
  if (!m) return []
  return m[1].trim().split(/\s+/)
}

describe('the daily workflow stages', () => {
  const staged = stagedLoopPaths()

  it('has a staging loop to read', () => {
    expect(staged.length).toBeGreaterThan(0)
  })

  it.each(OUTPUTS)('%s — %s', (outputPath) => {
    expect(staged).toContain(outputPath)
  })

  it("commits the day's screenshot and viewport captures once, in the build dir (#549)", () => {
    // They used to be staged twice: in archive/<date>/build-*, and again as a
    // copy under public/archive-data/. The build now makes that copy, and the
    // path is gitignored, so staging it would add nothing but a second commit
    // of the same bytes if the ignore rule were ever lost.
    expect(staged).not.toContain('public/archive-data/')
    expect(src).toMatch(/for d in archive\/\$TODAY\/build-\[0-9\]\*; do/)
  })

  it("carries the day's record, not only its prose", () => {
    // record.json is the canonical record (#153). Its absence is not fatal —
    // the projection rebuilds from brief.md and the build dir — but the cache
    // then never persists.
    expect(src).toMatch(/git add "archive\/\$TODAY\/record\.json"/)
    expect(src).toMatch(/git add "archive\/\$TODAY\/brief\.md"/)
    expect(src).toMatch(/git add "archive\/\$TODAY\/archetype\.txt"/)
  })

  it('still refuses to commit failure and snapshot temp dirs', () => {
    // The whole reason the list is explicit rather than `git add -A`.
    expect(src).toMatch(/build-\[0-9\]\*/)
    expect(src).not.toMatch(/git add\s+-A/)
    expect(src).not.toMatch(/git add\s+archive\/\$TODAY\s*$/m)
  })
})

describe('the push', () => {
  it('checks out over SSH, because the ruleset has no actor for the bot', () => {
    // github-actions[bot] cannot be added to a personal-account repository
    // ruleset's bypass list; deploy keys can. See the comment on the step.
    expect(src).toMatch(/ssh-key:\s*\$\{\{\s*secrets\.DEPLOY_KEY\s*\}\}/)
    expect(src).not.toMatch(/- uses: actions\/checkout@\S+ # v\d+\s*\n\s*with:\s*\n\s*token:/)
  })

  it('still fails loudly when the commit does not leave the runner', () => {
    // A for-loop's exit status is its last command, which once let a run
    // report success while nothing was pushed.
    expect(src).toMatch(/pushed" != "true"/)
    expect(src).toMatch(/::error::push failed/)
  })

  it('clears a stale rebase before retrying the push (#342)', () => {
    // A conflicted rebase leaves a rebase-merge directory behind; without
    // clearing it first, attempts 2 and 3 fail on "there is already a
    // rebase-merge directory" instead of retrying anything.
    expect(src).toMatch(/rebase --abort 2>\/dev\/null \|\| true\s*\n\s*if git pull --rebase/)
  })
})

describe('the nightly agrees with the pipeline about which day it is', () => {
  // #338: the push step derived TODAY with `date -u` while every archive path
  // is keyed on signals.date, the Eastern day. Between 20:00 and 23:59
  // Eastern, which is when a /panel-triggered run lands, the site was staged
  // and the day's record was not, and the run reported success.
  it('never derives the day from UTC', () => {
    expect(src).not.toMatch(/\$\(date -u/)
    expect(src).not.toMatch(/toISOString\(\)\.slice\(0, 10\)/)
  })

  it('reads the day the pipeline published, with the Eastern clock as the fallback', () => {
    expect(src).toMatch(/- name: Run daily redesign\s*\n\s*id: redesign/)
    const today = /TODAY="\$\{RUN_DATE:-\$\(TZ=America\/New_York date \+%Y-%m-%d\)\}"/
    // The agents job stages under the step output.
    const stage = src.slice(
      src.indexOf("Stage the night's output"),
      src.indexOf("Upload the night's output")
    )
    expect(stage).toMatch(/RUN_DATE: \$\{\{ steps\.redesign\.outputs\.date \}\}/)
    expect(stage).toMatch(today)
    // The publish job commits and files the rating under the job output.
    const push = src.slice(src.indexOf('Push changes'), src.indexOf('Open today'))
    expect(push).toMatch(/RUN_DATE: \$\{\{ needs\.redesign\.outputs\.date \}\}/)
    expect(push).toMatch(today)
    const rating = src.slice(src.indexOf('Open today'), src.indexOf('  notify:'))
    expect(rating).toMatch(/RUN_DATE: \$\{\{ needs\.redesign\.outputs\.date \}\}/)
    expect(rating).toMatch(/process\.env\.RUN_DATE/)
  })

  it('has the pipeline publish signals.date, the day every archive path is keyed on', async () => {
    const { publishRunDate } = await import('../../scripts/daily-redesign.js')
    const { mkdtempSync, readFileSync } = await import('node:fs')
    const { tmpdir } = await import('node:os')
    const path = await import('node:path')
    const out = path.join(mkdtempSync(path.join(tmpdir(), 'gh-output-')), 'output')
    expect(publishRunDate({ date: '2026-09-01' }, out)).toBe('2026-09-01')
    expect(readFileSync(out, 'utf8')).toBe('date=2026-09-01\n')
  })

  it('publishes nothing that is not a date', async () => {
    const { publishRunDate } = await import('../../scripts/daily-redesign.js')
    const { mkdtempSync, existsSync } = await import('node:fs')
    const { tmpdir } = await import('node:os')
    const path = await import('node:path')
    const out = path.join(mkdtempSync(path.join(tmpdir(), 'gh-output-')), 'output')
    publishRunDate({ date: 'today; rm -rf /' }, out)
    expect(existsSync(out)).toBe(false)
  })
})

describe('the deploy key never shares a job with generated code', () => {
  // #337: `ssh-key` checkout ran first with persist-credentials defaulting
  // to true, so the push-to-main key sat in git config while `pnpm build`
  // executed TSX an LLM wrote from public headlines. Now the agents job has
  // no credential and hands its output to a publish job as a patch.
  const agents = src.slice(src.indexOf('  redesign:'), src.indexOf('  publish:'))
  const publish = src.slice(src.indexOf('  publish:'), src.indexOf('  notify:'))

  it('runs the pipeline in a job that checks out with no credential', () => {
    expect(agents).toContain('Run daily redesign')
    expect(agents).toMatch(
      /- uses: actions\/checkout@[0-9a-f]{40} # v\d+\s*\n\s*with:\s*\n\s*persist-credentials: false/
    )
    expect(agents).not.toContain('DEPLOY_KEY')
    expect(agents).toMatch(/permissions:\s*\n\s*contents: read/)
  })

  it('pushes from a job that runs no generated code', () => {
    expect(publish).toMatch(/ssh-key:\s*\$\{\{\s*secrets\.DEPLOY_KEY\s*\}\}/)
    expect(publish).not.toContain('daily-redesign.js')
    expect(publish).not.toContain('pnpm install')
    expect(publish).toMatch(/needs: redesign/)
  })

  it('hands the staged set over as one artifact, by the same name on both sides', () => {
    expect(agents).toMatch(/git diff --cached --binary > "\$RUNNER_TEMP\/nightly\.patch"/)
    expect(agents).toMatch(/upload-artifact[\s\S]*name: nightly-\$\{\{ github\.run_id \}\}/)
    expect(publish).toMatch(/download-artifact[\s\S]*name: nightly-\$\{\{ github\.run_id \}\}/)
    expect(publish).toMatch(/git apply --index --binary "\$RUNNER_TEMP\/nightly\.patch"/)
  })

  it('notifies when either job fails, not only the agents', () => {
    const notify = src.slice(src.indexOf('  notify:'))
    expect(notify).toMatch(/needs: \[redesign, publish\]/)
    expect(notify).toMatch(
      /always\(\) && \(needs\.redesign\.result == 'failure' \|\| needs\.publish\.result == 'failure'\)/
    )
  })

  it('caches Playwright browsers, same as ci.yml, before installing them (#346)', () => {
    // Every night downloaded Chromium cold — a minute or two against a job
    // budgeted at 80 minutes with a 60-minute internal RUN_BUDGET_MINUTES.
    // Sharing ci.yml's cache key means a nightly run can hit the same cache
    // a CI run just warmed, and vice versa.
    expect(agents).toMatch(/uses: actions\/cache@[0-9a-f]{40} # v\d+/)
    expect(agents).toMatch(/path:\s*~\/\.cache\/ms-playwright/)
    expect(agents).toMatch(
      /key:\s*playwright-\$\{\{\s*runner\.os\s*\}\}-\$\{\{\s*steps\.pw\.outputs\.version\s*\}\}/
    )

    const cacheIndex = agents.indexOf('actions/cache@')
    const installIndex = agents.indexOf('Install Playwright browser')
    expect(cacheIndex).toBeGreaterThan(-1)
    expect(installIndex).toBeGreaterThan(-1)
    expect(cacheIndex).toBeLessThan(installIndex)
  })
})

describe('a red main stops the night before it is paid for (#574)', () => {
  // `pnpm test` ran only after the run, so a red main cost the whole night's
  // $4 to $5 and shipped nothing. One step ahead of the run makes it free.
  const steps = yaml.load(src).jobs.redesign.steps
  const at = (predicate) => steps.findIndex(predicate)
  const runsUnitTests = (step) => /^\s*pnpm test\s*$/m.test(step.run ?? '')
  const paid = at((step) => /node scripts\/daily-redesign\.js/.test(step.run ?? ''))
  const guard = at(runsUnitTests)

  it('runs the unit tests in a step of its own ahead of the paid run', () => {
    expect(paid).toBeGreaterThan(-1)
    expect(guard).toBeGreaterThan(-1)
    expect(guard).toBeLessThan(paid)
    expect(steps[guard].run.trim()).toBe('pnpm test')
  })

  it('runs no e2e there: those need the built night, so they stay after the run', () => {
    expect(steps[guard].run).not.toContain('e2e')
    const later = steps.slice(paid + 1).find((step) => /pnpm test:e2e:site/.test(step.run ?? ''))
    expect(later).toBeDefined()
  })

  it('still runs the unit tests after the run as well', () => {
    const after = steps.findIndex((step, i) => i > paid && runsUnitTests(step))
    expect(after).toBeGreaterThan(paid)
  })

  it('keeps the Anthropic key out of that step, and out of the job', () => {
    // The key is scoped to the run step. Tests do not need it, and generated
    // code has no business seeing it before the run either.
    expect(steps[guard].env).toBeUndefined()
    expect(steps[guard]['working-directory']).toBeUndefined()
    const jobEnv = yaml.load(src).jobs.redesign.env
    expect(Object.keys(jobEnv)).not.toContain('ANTHROPIC_API_KEY')
    expect(JSON.stringify(jobEnv)).not.toContain('secrets.')
    expect(steps[paid].env.ANTHROPIC_API_KEY).toMatch(/secrets\.ANTHROPIC_API_KEY/)
    const holders = steps.filter((step) => JSON.stringify(step).includes('ANTHROPIC_API_KEY'))
    expect(holders).toEqual([steps[paid]])
  })

  it('has no credential in the checkout the tests run in, and runs on a dry run too', () => {
    expect(steps[guard].if).toBeUndefined()
    const checkout = steps.find((step) => /actions\/checkout@/.test(step.uses ?? ''))
    expect(checkout.with['persist-credentials']).toBe(false)
  })

  it('comes after the toolchain it needs: dependencies and the browser', () => {
    const named = (needle) => at((step) => (step.run ?? '').includes(needle))
    expect(named('pnpm install --frozen-lockfile')).toBeLessThan(guard)
    expect(named('playwright install')).toBeLessThan(guard)
  })
})

describe('what the nightly links to', () => {
  it('points the rating issue at where the screenshot is actually committed', () => {
    // #154 moved the day's screenshot without moving this URL, so every rating
    // issue rendered a broken image, and the rating loop is the only taste
    // signal the Art Director gets back. #549 moved it again: public/archive-data
    // is made at build time now, so the issue reads the build dir on main,
    // which is where the nightly commits the capture.
    const rating = src.slice(src.indexOf('Open today'), src.indexOf('  notify:'))
    // biome-ignore lint/suspicious/noTemplateCurlyInString: asserting on the literal text the workflow YAML contains, not interpolating
    expect(rating).toContain('const img = `${rawBase}/screenshot.png`')
    // biome-ignore lint/suspicious/noTemplateCurlyInString: asserting on the literal text the workflow YAML contains, not interpolating
    expect(rating).toContain('/main/${buildDir}`')
    expect(rating).not.toContain('main/public/archive-data')
    // biome-ignore lint/suspicious/noTemplateCurlyInString: asserting on the literal text the workflow YAML contains, not interpolating
    expect(src).not.toContain('main/public/archive/${today}.png')
  })

  it('names the phone capture in whichever format the build wrote (#549)', () => {
    const rating = src.slice(src.indexOf('Open today'), src.indexOf('  notify:'))
    expect(rating).toContain('viewports/mobile.webp')
    expect(rating).toContain("'mobile.png'")
  })

  it('resolves dates in the failure issue in JS, not in a dead shell substitution', () => {
    // `$(date -u +%Y-%m-%d)` inside a JS template literal is never expanded;
    // the issue body showed the literal text. Scoped to the github-script
    // block — a shell substitution in the push step is correct there.
    const notify = src.slice(src.indexOf('Notify on failure'))
    expect(notify).not.toMatch(/\$\(date /)
    expect(notify).toMatch(
      /new Date\(\)\.toLocaleDateString\('en-CA', \{ timeZone: 'America\/New_York' \}\)/
    )
  })

  it('points the failure issue at diagnostics that outlive the runner', () => {
    // The notice used to send you to `archive/<date>/build-failed-*/trace.json`.
    // Nothing ever put that file anywhere you could reach: `Push changes`
    // excludes build-failed-* from main on purpose, so the trace died with the
    // job and #283 sent a reader to a path that has never existed.
    const notify = src.slice(src.indexOf('Notify on failure'))
    expect(notify).not.toMatch(/archive\/\$\{[^}]*\}\/build-failed-\*/)
    expect(notify).toContain('artifact')
  })

  it('uploads the diagnostics under the name the failure issue cites', () => {
    // The issue body names an artifact. If the two ever drift apart the notice
    // is a dead pointer again, which is the whole bug this pair guards.
    const upload = src.slice(src.indexOf('Upload failure diagnostics'))
    expect(upload).toContain('actions/upload-artifact')
    expect(upload).toMatch(/name:\s*build-failed-\$\{\{\s*github\.run_id\s*\}\}/)
    expect(upload).toContain('build-failed-*/')
    expect(upload).toContain('last-build-output.txt')

    const notify = src.slice(src.indexOf('Notify on failure'))
    // biome-ignore lint/suspicious/noTemplateCurlyInString: asserting on the literal text the workflow YAML contains, not interpolating
    expect(notify).toContain('build-failed-${context.runId}')
  })

  it('collects the diagnostics before it opens the issue that links them', () => {
    expect(src.indexOf('Upload failure diagnostics')).toBeLessThan(src.indexOf('Notify on failure'))
  })
})

describe('the DST guard', () => {
  it('decides from the cron entry that fired, not the hour it arrived', () => {
    // Reading `date +%-H` meant routine queue lag (the header documents
    // 17-31 minutes) pushed the run past the hour it was checking for, so
    // both entries were dropped and the day produced no build at all.
    expect(src).toContain('github.event.schedule')
    expect(src).not.toMatch(/hour=\$\(TZ=America\/New_York date/)
  })

  it('schedules both entries for 00:15 in New York', () => {
    // 00:15 EDT is 04:15 UTC; 00:15 EST is 05:15 UTC. Just past midnight is
    // the earliest moment that is unambiguously the new day, and it leaves
    // five to six hours of slack for a scheduler that has delivered late
    // since the 2026-08-26 Actions outage (#193). The pairing below is what
    // stops the wrong one running out of season.
    expect(src).toContain("- cron: '15 4 * * *'")
    expect(src).toContain("- cron: '15 5 * * *'")
    for (const old of ["cron: '50 8", "cron: '50 9", "cron: '0 9 ", "cron: '0 10 "]) {
      expect(src).not.toContain(old)
    }
  })

  it('pairs each cron entry with the season it belongs to', () => {
    expect(src).toContain("'15 4 * * *|EDT' | '15 5 * * *|EST'")
    expect(src).toContain("'15 4 * * *|EST' | '15 5 * * *|EDT'")
  })

  it('runs rather than skips when the schedule is unrecognised', () => {
    // A missed morning is visible on a site whose premise is a daily rebuild;
    // a duplicate queues behind the concurrency group.
    expect(src).toMatch(/::warning::unrecognised schedule/)
  })
})

describe('the rollback workflow', () => {
  // #545: the first version restored MUTABLE_FILES from HEAD~N. HEAD~1 is one
  // commit back, not one night back, and the list had no
  // app/components/generated/, so yesterday's routes were restored against
  // components the night had deleted. A night is one commit; reverting it
  // carries every file it touched.
  const revertJob = rollbackSrc.slice(
    rollbackSrc.indexOf('  revert:'),
    rollbackSrc.indexOf('  push:')
  )
  const pushJob = rollbackSrc.slice(rollbackSrc.indexOf('  push:'))

  it('reverts the nightly commit it finds by subject, not a file list at HEAD~N', () => {
    expect(revertJob).toMatch(/--grep='\^chore: daily redesign'/)
    expect(revertJob).toMatch(/git revert --no-edit "\$sha"/)
    // The header comment names the old approach; only the code counts.
    const code = rollbackSrc
      .split('\n')
      .filter((line) => !line.trim().startsWith('#'))
      .join('\n')
    expect(code).not.toMatch(/HEAD~/)
    expect(code).not.toContain('MUTABLE_FILES')
    expect(code).not.toMatch(/git checkout/)
  })

  it('checks the subject again, because --grep matches any line of a message', () => {
    expect(revertJob).toMatch(/\[\[ "\$subject" =~ \^chore:/)
    expect(revertJob).toContain('--no-merges')
  })

  it('does not revert a night it already reverted', () => {
    expect(revertJob).toMatch(/This reverts commit \$sha/)
  })

  it('stops on a conflict and pushes nothing', () => {
    expect(revertJob).toMatch(/git revert --abort/)
    expect(revertJob).toMatch(/::error::reverting \$sha conflicts/)
  })

  it('builds in a job with no credential and a read-only token', () => {
    expect(revertJob).toMatch(
      /- uses: actions\/checkout@[0-9a-f]{40} # v\d+\s*\n\s*with:\s*\n\s*persist-credentials: false/
    )
    expect(revertJob).toMatch(/permissions:\s*\n\s*contents: read/)
    expect(revertJob).toContain('pnpm build')
    expect(revertJob).not.toContain('DEPLOY_KEY')
    expect(revertJob).not.toMatch(/GITHUB_TOKEN/)
    expect(revertJob).not.toMatch(/git push/)
  })

  it('pushes from a job that runs no generated code, with the deploy key', () => {
    // The ruleset lets the deploy key and repository admins bypass it;
    // github-actions[bot] is neither.
    expect(pushJob).toMatch(/ssh-key:\s*\$\{\{\s*secrets\.DEPLOY_KEY\s*\}\}/)
    expect(pushJob).not.toContain('pnpm')
    expect(pushJob).not.toContain('node ')
    expect(pushJob).toMatch(/needs: revert/)
    expect(pushJob).toMatch(/git am "\$RUNNER_TEMP\/rollback\.patch"/)
  })

  it('hands the revert over as one artifact, by the same name on both sides', () => {
    expect(revertJob).toMatch(
      /git format-patch --binary --stdout "\$BASE"\.\.HEAD > "\$RUNNER_TEMP\/rollback\.patch"/
    )
    expect(revertJob).toMatch(/upload-artifact[\s\S]*name: rollback-\$\{\{ github\.run_id \}\}/)
    expect(pushJob).toMatch(/download-artifact[\s\S]*name: rollback-\$\{\{ github\.run_id \}\}/)
  })

  it('is a dry run unless told otherwise, and a dry run never pushes', () => {
    const doc = yaml.load(rollbackSrc)
    expect(doc.on.workflow_dispatch.inputs.dry_run).toMatchObject({
      type: 'boolean',
      default: true,
    })
    // biome-ignore lint/suspicious/noTemplateCurlyInString: asserting on the literal expression text in the workflow YAML, not interpolating
    expect(doc.jobs.push.if).toBe('${{ !inputs.dry_run }}')
    expect(revertJob).toContain('$GITHUB_STEP_SUMMARY')
    expect(revertJob).toContain('git diff --stat')
  })

  it('refuses a real rollback that was not dispatched on main', () => {
    expect(revertJob).toMatch(/!inputs\.dry_run && github\.ref != 'refs\/heads\/main'/)
  })

  it('fails loudly when the rollback does not leave the runner', () => {
    expect(pushJob).toMatch(/pushed" != "true"/)
    expect(pushJob).toMatch(/::error::push failed/)
  })

  it('clears a stale rebase before retrying the push (#342)', () => {
    expect(pushJob).toMatch(/rebase --abort 2>\/dev\/null \|\| true\s*\n\s*if git pull --rebase/)
  })

  it('passes commits_back through env, not straight into the run body (#345)', () => {
    // type: number on the input is a UI hint, not server-side validation —
    // interpolating ${{ inputs.commits_back }} directly into the run: body
    // is the template-injection pattern the rest of the workflow avoids.
    const start = rollbackSrc.indexOf('Revert the nightly')
    const nextStep = rollbackSrc.indexOf('- name:', start + 1)
    const step = rollbackSrc.slice(start, nextStep === -1 ? undefined : nextStep)
    expect(step).toMatch(/COMMITS_BACK:\s*\$\{\{\s*inputs\.commits_back\s*\}\}/)

    // The run: body itself — after the env: block, which is allowed to
    // reference inputs — must never interpolate an expression directly.
    const runBody = step.slice(step.indexOf('run: |'))
    expect(runBody).not.toMatch(/\$\{\{\s*inputs\./)
    expect(runBody).toMatch(/N="\$COMMITS_BACK"/)
    expect(runBody).toMatch(/case "\$N" in ''\|\*\[!0-9\]\*\)/)
  })
})
