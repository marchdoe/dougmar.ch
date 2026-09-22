/**
 * The suite must not write into the working tree.
 *
 * `archive()` reseals every page under public/archive/ on the way out, which is
 * correct in the pipeline — today's build is what gives yesterday a next arrow
 * to point at — and wrong in a unit test, where it edits committed files as a
 * side effect of running vitest.
 *
 * It is worse than it sounds on a machine that holds a build which has not been
 * committed yet, which is the normal state of this working copy. There the seal
 * points the last committed day at a date the repository does not have, and the
 * result is nine modified files and a link that 404s in production. That
 * happened twice: once when Phase 3 landed, once again while fixing something
 * unrelated.
 *
 * A comment asking the next person to remember the mock is not a control, so
 * this asserts it.
 */

import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const TESTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Every test file, recursively. */
function testFiles(dir = TESTS_DIR) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...testFiles(full))
    else if (/\.test\.(js|ts|tsx)$/.test(entry.name)) out.push(full)
  }
  return out
}

const rel = (f) => path.relative(TESTS_DIR, f)

/**
 * Source with comments removed.
 *
 * The detectors below must not be satisfiable by prose. The first version of
 * the archive() rule flagged archiver-artifacts.test.js, which calls
 * writeArtifacts and only mentions `archive()` in a comment explaining why it
 * does not call it — the same "a test a comment can satisfy is not a test"
 * trap this file exists to close.
 */
function code(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

/** This file is all detector patterns; it must not detect itself. */
const isSelf = (file) => path.basename(file) === 'tests-do-not-mutate-archive.test.js'

describe('tests that run the archiver', () => {
  const callers = testFiles()
    .map((file) => ({ file, src: readFileSync(file, 'utf8') }))
    // Files that pull in archive() itself, rather than a helper from the module.
    .filter(({ src }) =>
      /\barchive\b\s*}?\s*=?.*archiver\.js|{[^}]*\barchive\b[^}]*}\s*=/.test(src)
    )
    .filter(({ src }) => src.includes('archiver.js'))
    .filter(({ src }) => /\barchive\s*\(/.test(src))

  it('finds the ones that actually call archive()', () => {
    // Guards the detection above: if this drops to zero the rule below is
    // vacuously true and stops protecting anything.
    expect(callers.length).toBeGreaterThan(0)
  })

  it.each(callers.map((c) => [rel(c.file), c.src]))(
    '%s stubs the seal, so the suite leaves public/archive alone',
    (_name, src) => {
      expect(src).toMatch(/vi\.mock\(\s*['"][^'"]*seal-archive\.js['"]/)
    }
  )
})

describe('tests that call archive() write somewhere disposable', () => {
  const callers = testFiles()
    .filter((file) => !isSelf(file))
    .map((file) => ({ file, src: code(readFileSync(file, 'utf8')) }))
    .filter(({ src }) => src.includes('archiver.js') && /\bawait archive\s*\(/.test(src))

  it('finds the ones that actually call archive()', () => {
    expect(callers.length).toBeGreaterThan(0)
  })

  it.each(callers.map((c) => [rel(c.file), c.src]))(
    '%s passes archive() a root of its own',
    (_name, src) => {
      // archive() writes archive/<date>/ and copies into public/archive/<date>/.
      // Without a root it does that inside the repo, and the cleanup hooks that
      // used to compensate keyed on a path recorded only after archive()
      // returned — so a throw part-way through left both directories behind.
      expect(src).toMatch(/\{\s*root:/)
    }
  )
})

describe('tests do not clean up files they never created', () => {
  it("nothing deletes the developer's collected signals", () => {
    // tests/scripts/collect-signals.test.js had an afterEach that unlinked
    // signals/today.yml and today.meta.yml after every test. runCollector()
    // does not write them — only the CLI branch does — so it was deleting a
    // real, uncommitted artifact of the day's pipeline run. The dev server
    // silently re-collects on the next request, which is why it went unnoticed.
    for (const file of testFiles().filter((f) => !isSelf(f))) {
      const src = code(readFileSync(file, 'utf8'))
      expect(
        /unlink\([^)]*signals\/today|rm\([^)]*signals\/today/.test(src),
        `${rel(file)} removes signals/today.* — it is real pipeline output, not test litter`
      ).toBe(false)
    }
  })

  it('nothing writes fixtures into the repo directories the pipeline owns', () => {
    // build-validator-scanner and file-manager both dropped .tsx fixtures into
    // the real app/components/ while vitest ran them in parallel workers.
    const offenders = []
    for (const file of testFiles().filter((f) => !isSelf(f))) {
      const src = code(readFileSync(file, 'utf8'))
      // A repo-rooted path joined with a pipeline-owned directory.
      if (/(?:resolve|join)\(\s*ROOT\s*,\s*['"](?:app\/|archive|public\/|elements\/)/.test(src)) {
        // ROOT bound to a temp dir in the same file is the fixed shape.
        const usesTempRoot = /tempDir|tempRepoRoot|mkdtemp/.test(src)
        if (!usesTempRoot) offenders.push(rel(file))
      }
    }
    expect(offenders).toEqual([])
  })
})
