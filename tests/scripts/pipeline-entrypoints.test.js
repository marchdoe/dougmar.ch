/**
 * The two pipeline entrypoints, checked against what they actually do.
 *
 * #305: run-pipeline.js's header comment said signal collection was
 * "skipped if already collected today". No such check exists anywhere in
 * the repo — the header described a freshness check that was never built,
 * or was removed without updating the comment. daily-redesign.js called
 * process.exit(0) immediately after its last console.log; on a pipe, which
 * is what GitHub Actions gives it, stdout is async and the exit can cut off
 * the last lines before they flush.
 *
 * #341: ci.yml declared no permissions block at all, so every one of its
 * jobs held the repository's default token scope for a workflow that never
 * reads a secret and runs branch code, some of it LLM-written.
 *
 * #340: references/*.png was gitignored with no exception, so the nightly's
 * own promoted A/B-graded screenshot (references/own-<date>.png, written by
 * promoteRatingToReferences in collect-ratings.js) was discarded on the
 * runner every time — the file promoted, and the index.yml entry pointing at
 * it, never survived to be committed.
 *
 * #339: ci.yml triggered on pull_request only. The nightly pushes to main
 * over a deploy key, bypassing the ruleset entirely, so lint, typecheck, the
 * test suite and the fallow audit never ran against what actually shipped.
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as yaml from 'js-yaml'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8')

describe('run-pipeline.js', () => {
  const src = read('scripts/run-pipeline.js')

  it('does not claim signal collection is skipped when already collected', () => {
    expect(src).not.toMatch(/skipped if already collected/)
  })

  it('still runs collect-signals.js unconditionally', () => {
    expect(src).toMatch(/node scripts\/collect-signals\.js/)
  })
})

describe('daily-redesign.js', () => {
  const src = read('scripts/daily-redesign.js')

  it('drains stdout before exiting on the success path', () => {
    expect(src).toMatch(/process\.stdout\.write\('', \(\) => process\.exit\(0\)\)/)
  })

  it('has no bare process.exit(0) left to race the pipe', () => {
    // Every process.exit(0) in the file must be the argument to the drain
    // callback above; strip that one occurrence out and none should remain.
    const withoutDrain = src.replace(
      /process\.stdout\.write\('', \(\) => process\.exit\(0\)\)/g,
      ''
    )
    expect(withoutDrain).not.toMatch(/process\.exit\(0\)/)
  })
})

describe('ci.yml holds a read-only token', () => {
  const src = read('.github/workflows/ci.yml')

  it('declares a top-level permissions: block before jobs:', () => {
    const permIndex = src.indexOf('\npermissions:')
    const jobsIndex = src.indexOf('\njobs:')
    expect(permIndex).toBeGreaterThan(-1)
    expect(jobsIndex).toBeGreaterThan(-1)
    expect(permIndex).toBeLessThan(jobsIndex)
  })

  it('sets contents: read at the top level once parsed', () => {
    const doc = yaml.load(src)
    expect(doc.permissions).toEqual({ contents: 'read' })
  })

  it('still uses no secret or token — nothing here needed write access', () => {
    expect(src).not.toMatch(/secrets\./)
    expect(src).not.toMatch(/GITHUB_TOKEN/)
  })

  it('also runs on a push to main, not just a pull_request (#339)', () => {
    // The nightly pushes to main over a deploy key with no PR — this is the
    // first time the full suite ever sees a nightly commit.
    const doc = yaml.load(src)
    expect(doc.on.pull_request).toEqual({ branches: ['main'] })
    expect(doc.on.push).toEqual({ branches: ['main'] })
  })

  it('audits a push against the previous main SHA, not an empty base_ref (#339)', () => {
    // github.base_ref is only set on a pull_request; on a push it is empty,
    // which would turn `--base origin/` into a command that fails outright.
    const doc = yaml.load(src)
    const audit = doc.jobs.architecture.steps.find((s) => s.name === 'Architecture audit (fallow)')
    expect(audit.run).toContain('github.event.before')
  })
})

describe('references/own-*.png survives the runner (#340)', () => {
  const src = read('.gitignore')

  it('un-ignores the promoted screenshot right after the blanket png rule', () => {
    expect(src).toMatch(/references\/\*\.png\n[^\n]*\n!references\/own-\*\.png/)
  })

  it('leaves the jpg rules alone — only png is negated', () => {
    expect(src).not.toMatch(/!references\/own-\*\.jpe?g/)
  })
})

describe('the nightly stages references/ (#340)', () => {
  const src = read('.github/workflows/daily-redesign.yml')

  it('adds references/ to the staging loop', () => {
    const m = /for p in ([^;]+); do/.exec(src)
    expect(m).not.toBeNull()
    expect(m[1].trim().split(/\s+/)).toContain('references/')
  })
})

describe('the workflows hold the least token they can (#544)', () => {
  const daily = yaml.load(read('.github/workflows/daily-redesign.yml'))
  const rollback = yaml.load(read('.github/workflows/rollback.yml'))

  it.each([
    ['daily-redesign.yml', daily],
    ['rollback.yml', rollback],
  ])('%s grants nothing at the top level, so every job has to ask', (_name, doc) => {
    expect(doc.permissions).toEqual({})
  })

  it.each([
    ['daily-redesign.yml', daily],
    ['rollback.yml', rollback],
  ])('%s declares permissions on every job', (_name, doc) => {
    for (const [id, job] of Object.entries(doc.jobs)) {
      expect(job.permissions, `job ${id}`).toBeDefined()
    }
  })

  it('gives the guard job read access to contents and nothing else', () => {
    // It reads whether today's night is already on main (#193 follow-up).
    expect(daily.jobs.guard.permissions).toEqual({ contents: 'read' })
  })

  it('lets only the jobs that open or close issues write them', () => {
    const writers = Object.entries(daily.jobs)
      .filter(([, job]) => job.permissions.issues === 'write')
      .map(([id]) => id)
      .sort()
    expect(writers).toEqual(['notify', 'publish', 'redesign'])
    for (const job of Object.values(rollback.jobs)) {
      expect(job.permissions.issues).toBeUndefined()
    }
  })

  it('never lets a job that runs generated code write contents', () => {
    expect(daily.jobs.redesign.permissions.contents).toBe('read')
    expect(rollback.jobs.revert.permissions.contents).toBe('read')
  })
})

describe('every action is pinned to a commit SHA (#544)', () => {
  const workflows = ['ci.yml', 'daily-redesign.yml', 'rollback.yml']
  const uses = workflows.flatMap((file) =>
    [...read(`.github/workflows/${file}`).matchAll(/^\s*(?:- )?uses:\s*(\S.*)$/gm)].map((m) => [
      file,
      m[1].trim(),
    ])
  )

  it('finds the actions to check', () => {
    expect(uses.length).toBeGreaterThan(10)
  })

  it.each(uses)('%s: %s', (_file, ref) => {
    // owner/name@<40 hex> # <tag the sha was resolved from>
    expect(ref).toMatch(/^[\w.-]+\/[\w./-]+@[0-9a-f]{40} # v\d+(\.\d+){0,2}$/)
  })
})

describe('dependabot.yml keeps the pins and the lockfile current (#544)', () => {
  const doc = yaml.load(read('.github/dependabot.yml'))

  it('covers github-actions and npm', () => {
    expect(doc.updates.map((u) => u['package-ecosystem']).sort()).toEqual(['github-actions', 'npm'])
  })

  it('checks weekly and groups, so it does not open a PR per package', () => {
    for (const update of doc.updates) {
      expect(update.schedule.interval).toBe('weekly')
      expect(Object.keys(update.groups ?? {}).length).toBeGreaterThan(0)
    }
  })
})
