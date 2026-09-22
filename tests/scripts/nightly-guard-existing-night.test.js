/**
 * Daily Redesign's guard skips a day whose night is already on main.
 *
 * The backstop (nightly-backstop.yml) dispatches a run when the scheduled one
 * has not arrived by mid-morning. A scheduled run that lands after that
 * dispatch published would otherwise pay to build the same day twice (#193).
 * A manual dry run or a resume always runs.
 */

import { execFileSync } from 'node:child_process'
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const daily = yaml.load(
  readFileSync(path.join(ROOT, '.github', 'workflows', 'daily-redesign.yml'), 'utf8')
)
/** A GitHub expression, spelled without a template-literal placeholder. */
const ghExpr = (inner) => `\${{ ${inner} }}`
const { guard } = daily.jobs
const night = guard.steps.find((s) => s.id === 'night')
const checkout = guard.steps.find((s) => (s.uses ?? '').startsWith('actions/checkout@'))

/**
 * Evaluate a step's `if:` for one trigger. The expressions here use only
 * ==, !, && and ||, which read the same in JavaScript once == is strict and
 * the ${{ }} wrapper is gone.
 */
function evaluate(expr, { event, dryRun = false, resume = '', dstRun = 'true' }) {
  const body = expr
    .replace(/^\$\{\{\s*|\s*\}\}$/g, '')
    .replace(/==/g, '===')
    .replace(/github\.event_name/g, 'ctx.event')
    .replace(/inputs\.dry_run/g, 'ctx.dryRun')
    .replace(/inputs\.resume_run_id/g, 'ctx.resume')
    .replace(/steps\.check\.outputs\.run/g, 'ctx.dstRun')
  // A scheduled run has no inputs: GitHub reads them as null.
  const ctx =
    event === 'schedule'
      ? { event, dryRun: null, resume: null, dstRun }
      : { event, dryRun, resume, dstRun }
  return Boolean(new Function('ctx', `return (${body})`)(ctx))
}

describe("the guard reads whether today's night is on main", () => {
  it('asks the backstop script, not a copy of its logic', () => {
    expect(night.run).toContain('node scripts/nightly-backstop.js --night-exists')
    expect(night.env.GH_TOKEN).toBe(ghExpr('secrets.GITHUB_TOKEN'))
  })

  it('skips when the night exists, and builds when the read fails', () => {
    expect(night.run).toMatch(/exists=true[\s\S]*run=false/)
    expect(night.run).toMatch(/if ! node[\s\S]*::warning::[\s\S]*run=true/)
  })

  it("lets the night step's answer win over the DST check's", () => {
    expect(guard.outputs.run).toBe(ghExpr('steps.night.outputs.run || steps.check.outputs.run'))
  })

  it('checks out the scripts with no credential, on the same pin as the other jobs', () => {
    expect(checkout.with).toEqual({ 'persist-credentials': false, 'sparse-checkout': 'scripts' })
    expect(checkout.uses).toBe(daily.jobs.redesign.steps[0].uses)
    expect(checkout.if).toBe(night.if)
  })

  it('holds read access to contents and nothing more', () => {
    expect(guard.permissions).toEqual({ contents: 'read' })
  })
})

describe('which runs it checks', () => {
  it.each([
    ['the scheduled run of the day', { event: 'schedule' }, true],
    ['a plain dispatch (the backstop, or a manual night)', { event: 'workflow_dispatch' }, true],
  ])('checks %s', (_label, trigger, expected) => {
    expect(evaluate(night.if, trigger)).toBe(expected)
  })

  it.each([
    ['a manual dry run', { event: 'workflow_dispatch', dryRun: true }],
    ['a resume', { event: 'workflow_dispatch', resume: '35652547929' }],
    ['a dry-run resume', { event: 'workflow_dispatch', dryRun: true, resume: '1' }],
    ['the other DST entry, already skipped', { event: 'schedule', dstRun: 'false' }],
  ])('leaves %s alone', (_label, trigger) => {
    expect(evaluate(night.if, trigger)).toBe(false)
  })
})

describe("the night step's shell", () => {
  /**
   * Run the step's script with `node` stubbed to answer as the backstop
   * script would, and return what it wrote to its output file.
   */
  function runStep(stub) {
    const dir = mkdtempSync(path.join(tmpdir(), 'guard-night-'))
    try {
      const out = path.join(dir, 'output')
      writeFileSync(out, '')
      const node = path.join(dir, 'node')
      writeFileSync(node, `#!/bin/sh\n${stub}\n`)
      chmodSync(node, 0o755)
      execFileSync('bash', ['-e', '-c', night.run], {
        env: { PATH: `${dir}:${process.env.PATH}`, GITHUB_OUTPUT: out },
        stdio: 'pipe',
      })
      return readFileSync(out, 'utf8')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }

  it('skips when the night is on main', () => {
    expect(runStep('echo exists=true >> "$GITHUB_OUTPUT"')).toMatch(/^run=false$/m)
  })

  it('runs when it is not', () => {
    const out = runStep('echo exists=false >> "$GITHUB_OUTPUT"')
    expect(out).toMatch(/^run=true$/m)
    expect(out).not.toMatch(/^run=false$/m)
  })

  it('runs when the read fails', () => {
    expect(runStep('exit 1')).toMatch(/^run=true$/m)
  })
})
