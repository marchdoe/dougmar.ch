/**
 * The nightly runs site-health against the night it just built, and tells the
 * spec so with NIGHTLY_RUN=1.
 *
 * Some routes in that spec are hand-written: the engineer does not write them
 * and no gate hands a failure on them back to it. Their pages sit inside the
 * Layout and Sidebar the engineer does write, so what a night's shell does to
 * them was failing a night that nothing could then repair (2026-09-21: ten
 * failures after a whole night had shipped). The tests that measure the shell
 * skip themselves when the variable is set. PR CI runs the same file against
 * the committed design and must not set it, or nothing would ever run them.
 */

import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const WORKFLOWS = path.join(ROOT, '.github', 'workflows')
const SPEC = readFileSync(path.join(ROOT, 'tests', 'e2e', 'site-health.spec.ts'), 'utf8')

const VERIFY = "Verify the night's output renders"
const daily = yaml.load(readFileSync(path.join(WORKFLOWS, 'daily-redesign.yml'), 'utf8'))
const verifyStep = daily.jobs.redesign.steps.find((step) => step.name === VERIFY)

/** Every place a workflow document sets NIGHTLY_RUN: `env` at workflow, job or step level. */
function settersIn(doc, file) {
  const found = []
  const visit = (node, where) => {
    if (Array.isArray(node)) {
      node.forEach((child, i) => {
        visit(child, `${where}[${child?.name ?? i}]`)
      })
    } else if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        if (key === 'NIGHTLY_RUN') found.push(`${file}:${where}`)
        visit(value, `${where}.${key}`)
      }
    }
  }
  visit(doc, '')
  return found
}

describe("the nightly's verify step", () => {
  it('exists, and runs the site-health suite in the same step', () => {
    expect(verifyStep).toBeDefined()
    expect(verifyStep.run).toMatch(/^\s*pnpm test:e2e:site\s*$/m)
  })

  it('sets NIGHTLY_RUN to 1', () => {
    expect(verifyStep.env).toEqual({ NIGHTLY_RUN: '1' })
  })

  it('is the only place in any workflow that sets it', () => {
    const files = readdirSync(WORKFLOWS).filter((f) => /\.ya?ml$/.test(f))
    expect(files).toContain('ci.yml')
    const setters = files.flatMap((file) =>
      settersIn(yaml.load(readFileSync(path.join(WORKFLOWS, file), 'utf8')), file)
    )
    expect(setters).toEqual([`daily-redesign.yml:.jobs.redesign.steps[${VERIFY}].env`])
  })
})

describe('what the spec does with it', () => {
  it('reads it as the string 1', () => {
    expect(SPEC).toContain("process.env.NIGHTLY_RUN === '1'")
  })

  it('skips tests with it, each with the same stated reason', () => {
    const skips = SPEC.match(/test\.skip\(NIGHTLY, NIGHT_SHELL\)/g) ?? []
    expect(skips.length).toBeGreaterThan(0)
    expect(SPEC).toContain("hand-written route: the night's Layout decides this; PR CI covers it")
    // No skip written any other way: a bare `test.skip(` is a test that never runs anywhere.
    const all = SPEC.match(/test\.skip\(/g) ?? []
    expect(all.length).toBe(skips.length)
  })

  it("leaves the archive calendar blocking, since the archive is drawn outside the night's shell", () => {
    const start = SPEC.indexOf('the archive calendar reads on a phone (#563)')
    expect(start).toBeGreaterThan(-1)
    expect(SPEC.slice(start)).not.toContain('test.skip(')
  })
})
