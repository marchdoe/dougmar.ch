/**
 * The two thin CLIs the nightly workflow calls for a failed run's spend
 * (#578), run as the workflow runs them: as node processes with files and a
 * pipe. The logic they hand to is tested in tests/utils/; what is checked here
 * is that they exit 0 on every input the workflow can give them, because
 * neither may stop an issue from opening or a night from running.
 */

import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { costMarker } from '../../scripts/utils/failure-cost-section.js'
import { findCostFiles, readFailedRunCost } from '../../scripts/print-failed-run-cost.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const PRINT = path.join(ROOT, 'scripts', 'print-failed-run-cost.js')
const WRITE = path.join(ROOT, 'scripts', 'write-prior-attempts.js')

let dir
beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'dm-cost-cli-'))
})
afterEach(() => {
  rmSync(dir, { recursive: true, force: true })
})

/** An artifact tree as upload-artifact lays it out: the date and the failure directory. */
function artifact(cost, failedDirName = 'build-failed-1788700000000') {
  const failed = path.join(dir, 'artifact', '2026-09-20', failedDirName)
  mkdirSync(failed, { recursive: true })
  if (cost) writeFileSync(path.join(failed, 'cost.json'), JSON.stringify(cost))
  return path.join(dir, 'artifact')
}

const COST = {
  total_usd: 4.18,
  calls: 10,
  retries: 1,
  estimated: false,
  byAgent: [
    { agent: 'art-director', purpose: 'first', cost_usd: 0.9 },
    { agent: 'react-engineer', purpose: 'first', cost_usd: 3.28 },
  ],
}

describe('print-failed-run-cost', () => {
  it('prints the section for the cost.json in the artifact, wherever it sits', () => {
    const out = execFileSync(process.execPath, [PRINT, artifact(COST), '24000000001'], {
      encoding: 'utf8',
    })
    expect(out).toContain('Spend before it failed: $4.18 across 10 calls (1 retry).')
    expect(out).toContain('| art-director | 1 | first | $0.90 |')
    expect(out).toContain(
      '<!-- run-cost {"runId":"24000000001","attempt":1,"total_usd":4.18,"calls":10,"estimated":false} -->'
    )
  })

  it('puts the run attempt in the marker when the workflow gives one', () => {
    const out = execFileSync(process.execPath, [PRINT, artifact(COST), '24000000001', '2'], {
      encoding: 'utf8',
    })
    expect(out).toContain('"runId":"24000000001","attempt":2')
  })

  it('says the spend is not recorded when the artifact has no cost.json', () => {
    const out = execFileSync(process.execPath, [PRINT, artifact(null), '1'], { encoding: 'utf8' })
    expect(out).toMatch(/^Spend: not recorded/)
  })

  it('says the same when the artifact was never downloaded, and still exits 0', () => {
    const result = spawnSync(process.execPath, [PRINT, path.join(dir, 'nothing-here'), '1'], {
      encoding: 'utf8',
    })
    expect(result.status).toBe(0)
    expect(result.stdout).toMatch(/^Spend: not recorded/)
  })

  it('treats a corrupt cost.json as not recorded', () => {
    const root = artifact(null)
    writeFileSync(path.join(root, '2026-09-20', 'build-failed-1788700000000', 'cost.json'), '{oops')
    expect(readFailedRunCost(root)).toBeNull()
  })

  // Run 35585953176 (2026-09-21): the swarm shipped a night and a later step
  // failed. Its artifact held `2026-09-21/last-build-output.txt`,
  // `2026-09-21/last-static-checks.txt` and an old `2026-04-29/last-build-output.txt`,
  // and no cost.json. With the shipped build's files uploaded too, the spend is there.
  it("reads a shipped build's cost.json when the swarm did not fail", () => {
    const root = path.join(dir, 'shipped')
    const build = path.join(root, 'archive', '2026-09-21', 'build-1789000000000')
    mkdirSync(build, { recursive: true })
    writeFileSync(path.join(root, 'archive', '2026-09-21', 'last-build-output.txt'), 'x')
    writeFileSync(path.join(build, 'cost.json'), JSON.stringify(COST))

    const out = execFileSync(process.execPath, [PRINT, root, '35585953176', '1'], {
      encoding: 'utf8',
    })
    expect(out).toContain('Spend before it failed: $4.18 across 10 calls (1 retry).')
  })

  it('says the spend is not recorded for the artifact as run 35585953176 actually uploaded it', () => {
    const root = path.join(dir, 'real')
    mkdirSync(path.join(root, '2026-09-21'), { recursive: true })
    writeFileSync(path.join(root, '2026-09-21', 'last-build-output.txt'), 'x')
    writeFileSync(path.join(root, '2026-09-21', 'last-static-checks.txt'), 'x')
    expect(readFailedRunCost(root)).toBeNull()
  })

  it("prefers a failed swarm's cost.json over a shipped build's from earlier the same day", () => {
    const root = path.join(dir, 'both')
    const day = path.join(root, 'archive', '2026-09-21')
    mkdirSync(path.join(day, 'build-1789000000000'), { recursive: true })
    mkdirSync(path.join(day, 'build-failed-1789100000000'), { recursive: true })
    writeFileSync(
      path.join(day, 'build-1789000000000', 'cost.json'),
      JSON.stringify({ total_usd: 1, calls: 1, byAgent: [] })
    )
    writeFileSync(
      path.join(day, 'build-failed-1789100000000', 'cost.json'),
      JSON.stringify({ total_usd: 2, calls: 2, byAgent: [] })
    )
    expect(readFailedRunCost(root).total_usd).toBe(2)
  })

  it('reads the newest failure directory when there is more than one', () => {
    const root = artifact({ total_usd: 1, calls: 1, byAgent: [] }, 'build-failed-1788700000000')
    const later = path.join(root, '2026-09-20', 'build-failed-1788800000000')
    mkdirSync(later)
    writeFileSync(
      path.join(later, 'cost.json'),
      JSON.stringify({ total_usd: 2, calls: 2, byAgent: [] })
    )

    expect(findCostFiles(root)).toHaveLength(2)
    expect(readFailedRunCost(root).total_usd).toBe(2)
  })

  it('refuses to run without its two arguments', () => {
    const result = spawnSync(process.execPath, [PRINT], { encoding: 'utf8' })
    expect(result.status).toBe(1)
    expect(result.stderr).toMatch(/usage/)
  })
})

describe('write-prior-attempts', () => {
  const issues = (date = '2026-09-20') => [
    {
      number: 601,
      title: `Daily redesign failed — ${date}`,
      body: `The daily redesign pipeline failed.\n\n${costMarker({ total_usd: 4.18, calls: 10 }, '111')}`,
    },
    { number: 602, title: 'Something else', body: 'unrelated' },
  ]

  const run = (input, date = '2026-09-20') =>
    spawnSync(process.execPath, [WRITE, date], { input, cwd: dir, encoding: 'utf8' })

  it('leaves signals/prior-attempts.json for the night in the working directory', () => {
    const result = run(JSON.stringify(issues()))

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('1 earlier failed attempt(s) for 2026-09-20: 111')
    const written = JSON.parse(
      readFileSync(path.join(dir, 'signals', 'prior-attempts.json'), 'utf8')
    )
    expect(written).toEqual([
      { runId: '111', attempt: 1, issue: 601, total_usd: 4.18, calls: 10, estimated: false },
    ])
  })

  it('writes nothing when the failures were another day', () => {
    const result = run(JSON.stringify(issues('2026-09-19')))
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('no earlier failed attempt recorded')
    expect(existsSync(path.join(dir, 'signals', 'prior-attempts.json'))).toBe(false)
  })

  it.each([
    ['an empty pipe, which is what a failed gh leaves', ''],
    ['text that is not JSON', 'HTTP 401: Bad credentials'],
    ['an error object', '{"message":"Bad credentials"}'],
  ])('exits 0 and writes nothing for %s', (_name, input) => {
    const result = run(input)
    expect(result.status).toBe(0)
    expect(existsSync(path.join(dir, 'signals', 'prior-attempts.json'))).toBe(false)
  })

  it('exits 0 with a usage line when given no date', () => {
    const result = spawnSync(process.execPath, [WRITE], { input: '[]', cwd: dir, encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stderr).toMatch(/usage/)
  })
})
