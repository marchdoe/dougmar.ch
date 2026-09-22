/**
 * scripts/canary.js — the $0 local dry run (#432).
 *
 * `exec` is injected throughout so nothing here actually shells out to git
 * or pnpm; the "shipped" and "failed" scenarios instead pre-populate a
 * fixture worktree (via `--worktree`, which skips install) with the archive
 * files a real run would have left behind, in the shape trace.js and the
 * repair step (#435) actually write.
 */

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultExec, refusalReason, runCanary } from '../../scripts/canary.js'

let root
let worktree

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), 'canary-root-'))
  worktree = mkdtempSync(path.join(tmpdir(), 'canary-worktree-'))
})

afterEach(() => {
  rmSync(root, { recursive: true, force: true })
  rmSync(worktree, { recursive: true, force: true })
})

// GITHUB_ACTIONS and ANTHROPIC_API_KEY are cleared around every test, then
// restored, the same way tests/scripts/claude-cli-stall.test.js handles
// MOCK_MODE — the guards this file exercises read process.env directly.
const withEnv = async (overrides, fn) => {
  const prev = {}
  for (const key of Object.keys(overrides)) prev[key] = process.env[key]
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  try {
    return await fn()
  } finally {
    for (const [key, value] of Object.entries(prev)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

const clearGuardEnv = { GITHUB_ACTIONS: undefined, ANTHROPIC_API_KEY: undefined }

function writeArchiveFixture({ date, buildName, trace, cost, verdicts, extraFiles = {} }) {
  const buildDir = path.join(worktree, 'archive', date, buildName)
  mkdirSync(buildDir, { recursive: true })
  if (trace !== undefined) writeFileSync(path.join(buildDir, 'trace.json'), JSON.stringify(trace))
  if (cost !== undefined) writeFileSync(path.join(buildDir, 'cost.json'), JSON.stringify(cost))
  if (verdicts !== undefined) {
    writeFileSync(path.join(buildDir, 'verdicts.json'), JSON.stringify(verdicts))
  }
  for (const [name, content] of Object.entries(extraFiles)) {
    writeFileSync(path.join(buildDir, name), content)
  }
  return buildDir
}

describe('refusalReason', () => {
  it('refuses when ANTHROPIC_API_KEY is set in the environment', () => {
    const reason = refusalReason({ root, env: { ANTHROPIC_API_KEY: 'sk-live-x' } })
    expect(reason).toMatch(/ANTHROPIC_API_KEY/)
  })

  it('refuses when ANTHROPIC_API_KEY is set in .env', () => {
    writeFileSync(path.join(root, '.env'), 'ANTHROPIC_API_KEY=sk-live-x\n')
    const reason = refusalReason({ root, env: {} })
    expect(reason).toMatch(/\.env/)
  })

  it('refuses when GITHUB_ACTIONS is set', () => {
    const reason = refusalReason({ root, env: { GITHUB_ACTIONS: 'true' } })
    expect(reason).toMatch(/GITHUB_ACTIONS/)
  })

  it('is clear to run with neither set and no .env', () => {
    expect(refusalReason({ root, env: {} })).toBeNull()
  })

  it('is clear when .env exists but has no key', () => {
    writeFileSync(path.join(root, '.env'), 'SOME_OTHER_VAR=1\n')
    expect(refusalReason({ root, env: {} })).toBeNull()
  })

  it('does not refuse for ANTHROPIC_API_KEY under --mock (env or .env)', () => {
    writeFileSync(path.join(root, '.env'), 'ANTHROPIC_API_KEY=sk-live-x\n')
    expect(refusalReason({ root, env: { ANTHROPIC_API_KEY: 'sk-live-x' }, mock: true })).toBeNull()
  })

  it('still refuses under --mock when GITHUB_ACTIONS is set', () => {
    const reason = refusalReason({ root, env: { GITHUB_ACTIONS: 'true' }, mock: true })
    expect(reason).toMatch(/GITHUB_ACTIONS/)
  })
})

// #449: a 45-minute pipeline run used to write nothing to canary.log until
// it finished, so there was nothing to `tail -f`. These exercise the
// streaming exec path directly, against a real (short-lived) child process,
// rather than through runCanary's injected fake — the fakes elsewhere in
// this file return synchronously and never touch a log file at all.
describe('defaultExec streaming', () => {
  it('writes chunks to the log as they arrive, and the final file matches the buffered stdout', async () => {
    const logPath = path.join(worktree, 'stream.log')
    writeFileSync(logPath, '')
    const chunks = []
    const onChunk = (text) => {
      chunks.push(text)
      writeFileSync(logPath, chunks.join(''))
    }
    // The child prints its second line only once the test creates the gate
    // file, so the ordering below does not depend on how fast either side runs.
    const gate = path.join(worktree, 'gate')
    const script =
      `console.log('line-one'); const t = setInterval(() => { ` +
      `if (require('node:fs').existsSync('${gate}')) { clearInterval(t); console.log('line-two') } }, 20); ` +
      // A failed poll below must not leave this child spinning.
      `setTimeout(() => process.exit(1), 30000).unref()`
    const pending = defaultExec(`node -e ${JSON.stringify(script)}`, { onChunk })

    // Wait for the first line to reach the log. The child is still running
    // (its gate is closed), so the log should have line-one and no more.
    await vi.waitFor(() => expect(readFileSync(logPath, 'utf8')).toContain('line-one'), {
      timeout: 10_000,
      interval: 20,
    })
    expect(readFileSync(logPath, 'utf8')).not.toContain('line-two')

    writeFileSync(gate, '')
    const result = await pending
    const final = readFileSync(logPath, 'utf8')
    expect(final).toBe(result.stdout)
    expect(final).toContain('line-one')
    expect(final).toContain('line-two')
  })
})

describe('runCanary — refusal', () => {
  it('exits 2 and never calls exec when ANTHROPIC_API_KEY is set', async () =>
    withEnv({ ...clearGuardEnv, ANTHROPIC_API_KEY: 'sk-live-x' }, async () => {
      const calls = []
      const exec = (command, options) => {
        calls.push({ command, options })
        return { status: 0, stdout: '', stderr: '' }
      }
      const result = await runCanary({ exec, root, worktreePath: worktree })
      expect(result.exitCode).toBe(2)
      expect(calls).toEqual([])
    }))

  it('exits 2 and never calls exec when GITHUB_ACTIONS is set', async () =>
    withEnv({ ...clearGuardEnv, GITHUB_ACTIONS: 'true' }, async () => {
      const calls = []
      const exec = (command, options) => {
        calls.push({ command, options })
        return { status: 0, stdout: '', stderr: '' }
      }
      const result = await runCanary({ exec, root, worktreePath: worktree })
      expect(result.exitCode).toBe(2)
      expect(calls).toEqual([])
    }))

  it('--mock does not refuse when ANTHROPIC_API_KEY is set', async () =>
    withEnv({ ...clearGuardEnv, ANTHROPIC_API_KEY: 'sk-live-x' }, async () => {
      const exec = () => ({ status: 0, stdout: '', stderr: '' })
      const result = await runCanary({ exec, root, worktreePath: worktree, mock: true })
      expect(result.exitCode).not.toBe(2)
    }))

  it('--mock still exits 2 and never calls exec when GITHUB_ACTIONS is set', async () =>
    withEnv({ ...clearGuardEnv, GITHUB_ACTIONS: 'true' }, async () => {
      const calls = []
      const exec = (command, options) => {
        calls.push({ command, options })
        return { status: 0, stdout: '', stderr: '' }
      }
      const result = await runCanary({ exec, root, worktreePath: worktree, mock: true })
      expect(result.exitCode).toBe(2)
      expect(calls).toEqual([])
    }))
})

describe('runCanary — the pipeline call', () => {
  it('forces MOCK_MODE=false and DRY_RUN=true regardless of the ambient env', async () =>
    withEnv({ ...clearGuardEnv, MOCK_MODE: 'true', DRY_RUN: 'false' }, async () => {
      const calls = []
      const exec = (command, options) => {
        calls.push({ command, options })
        return { status: 0, stdout: '', stderr: '' }
      }
      await runCanary({ exec, root, worktreePath: worktree })
      const pipelineCall = calls.find((c) => c.command.includes('run-pipeline.js'))
      expect(pipelineCall).toBeDefined()
      expect(pipelineCall.options.env.MOCK_MODE).toBe('false')
      expect(pipelineCall.options.env.DRY_RUN).toBe('true')
    }))

  it('skips install and never calls git worktree add when reusing a worktree', async () =>
    withEnv(clearGuardEnv, async () => {
      const calls = []
      const exec = (command, options) => {
        calls.push({ command, options })
        return { status: 0, stdout: '', stderr: '' }
      }
      await runCanary({ exec, root, worktreePath: worktree })
      expect(calls.some((c) => c.command.includes('pnpm install'))).toBe(false)
      expect(calls.some((c) => c.command.includes('worktree add'))).toBe(false)
    }))

  it('never removes a reused worktree', async () =>
    withEnv(clearGuardEnv, async () => {
      const calls = []
      const exec = (command, options) => {
        calls.push({ command, options })
        return { status: 0, stdout: '', stderr: '' }
      }
      await runCanary({ exec, root, worktreePath: worktree })
      expect(calls.some((c) => c.command.includes('worktree remove'))).toBe(false)
    }))

  it('copies the repo .env into the worktree before running', async () =>
    withEnv(clearGuardEnv, async () => {
      writeFileSync(path.join(root, '.env'), 'SOME_OTHER_VAR=1\n')
      const exec = () => ({ status: 0, stdout: '', stderr: '' })
      await runCanary({ exec, root, worktreePath: worktree })
      expect(readFileSync(path.join(worktree, '.env'), 'utf8')).toContain('SOME_OTHER_VAR=1')
    }))

  it('--mock forces MOCK_MODE=true (and still DRY_RUN=true) regardless of the ambient env', async () =>
    withEnv({ ...clearGuardEnv, MOCK_MODE: 'false', DRY_RUN: 'false' }, async () => {
      const calls = []
      const exec = (command, options) => {
        calls.push({ command, options })
        return { status: 0, stdout: '', stderr: '' }
      }
      await runCanary({ exec, root, worktreePath: worktree, mock: true })
      const pipelineCall = calls.find((c) => c.command.includes('run-pipeline.js'))
      expect(pipelineCall).toBeDefined()
      expect(pipelineCall.options.env.MOCK_MODE).toBe('true')
      expect(pipelineCall.options.env.DRY_RUN).toBe('true')
    }))

  it('--mock replays fixtures/canary, and a recording run writes there too (#625)', async () =>
    withEnv({ ...clearGuardEnv, FIXTURE_DIR: '' }, async () => {
      const pipelineEnv = async (opts, extraEnv = {}) => {
        const calls = []
        const exec = (command, options) => {
          calls.push({ command, options })
          return { status: 0, stdout: '', stderr: '' }
        }
        await withEnv({ ...clearGuardEnv, FIXTURE_DIR: '', ...extraEnv }, () =>
          runCanary({ exec, root, worktreePath: worktree, ...opts })
        )
        return calls.find((c) => c.command.includes('run-pipeline.js')).options.env
      }
      expect((await pipelineEnv({ mock: true })).FIXTURE_DIR).toBe('fixtures/canary')
      expect((await pipelineEnv({}, { RECORD_FIXTURES: 'true' })).FIXTURE_DIR).toBe(
        'fixtures/canary'
      )
      // A plain dry run replays nothing and records nothing, so it names no corpus.
      expect((await pipelineEnv({})).FIXTURE_DIR).toBeFalsy()
      // An explicit FIXTURE_DIR wins.
      expect(
        (await pipelineEnv({ mock: true }, { FIXTURE_DIR: 'fixtures/other' })).FIXTURE_DIR
      ).toBe('fixtures/other')
    }))

  it('creates the evidence log before the pipeline runs, and prints its path first (#449)', async () =>
    withEnv(clearGuardEnv, async () => {
      const printed = []
      const origLog = console.log
      console.log = (...args) => printed.push(args.join(' '))
      let logExistedBeforePipelineRan = false
      try {
        const exec = (command) => {
          if (command.includes('run-pipeline.js')) {
            logExistedBeforePipelineRan = printed.length > 0 && existsSync(printed[0])
          }
          return { status: 0, stdout: '', stderr: '' }
        }
        const result = await runCanary({
          exec,
          now: () => new Date(2026, 8, 2, 14, 5, 0),
          root,
          worktreePath: worktree,
        })
        expect(printed[0]).toBe(path.join(result.evidenceDir, 'canary.log'))
        expect(logExistedBeforePipelineRan).toBe(true)
      } finally {
        console.log = origLog
      }
    }))
})

describe('runCanary — a shipped night', () => {
  const fixedNow = () => new Date(2026, 8, 2, 14, 5, 0)

  it('exits 0, and writes the evidence dir laid out under docs/evidence/canary/', async () =>
    withEnv(clearGuardEnv, async () => {
      const trace = {
        date: '2026-09-02',
        steps: [
          { name: 'art-director', phase: 1, durationMs: 4000, timestamp: 't1' },
          { name: 'build', phase: 4, durationMs: 1000, timestamp: 't2' },
        ],
      }
      const cost = { total_usd: 0.42, estimated: false, partial: false, retries: 0, calls: 3 }
      const verdicts = [{ agent: 'mockup-critic', verdict: 'SHIP' }]
      writeArchiveFixture({ date: '2026-09-02', buildName: 'build-100', trace, cost, verdicts })

      const exec = () => ({ status: 0, stdout: 'pipeline complete\n', stderr: '' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })

      expect(result.exitCode).toBe(0)
      expect(result.shipped).toBe(true)
      expect(result.date).toBe('2026-09-02')

      const evidenceDir = path.join(root, 'docs', 'evidence', 'canary', '2026-09-02-1405')
      expect(result.evidenceDir).toBe(evidenceDir)
      expect(existsSync(path.join(evidenceDir, 'canary.log'))).toBe(true)
      expect(readFileSync(path.join(evidenceDir, 'canary.log'), 'utf8')).toContain(
        'pipeline complete'
      )
      expect(existsSync(path.join(evidenceDir, 'summary.md'))).toBe(true)
      expect(
        existsSync(path.join(evidenceDir, 'archive', '2026-09-02', 'build-100', 'trace.json'))
      ).toBe(true)
      expect(
        existsSync(path.join(evidenceDir, 'archive', '2026-09-02', 'build-100', 'cost.json'))
      ).toBe(true)
      expect(
        existsSync(path.join(evidenceDir, 'archive', '2026-09-02', 'build-100', 'verdicts.json'))
      ).toBe(true)
    }))

  it('keeps stray images out of the evidence dir, but copies the shipped render to render.png', async () =>
    withEnv(clearGuardEnv, async () => {
      writeArchiveFixture({
        date: '2026-09-02',
        buildName: 'build-100',
        trace: { steps: [] },
        cost: { total_usd: 0, calls: 0, retries: 0 },
        extraFiles: {
          'screenshot.png': 'the shipped render',
          'screenshot-dark.png': 'not the render',
          'mockup-screenshot.png': 'not the render either',
        },
      })
      const exec = () => ({ status: 0, stdout: '', stderr: '' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })
      const walk = (dir) => {
        const found = []
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) found.push(...walk(full))
          else found.push(full)
        }
        return found
      }
      const files = walk(result.evidenceDir)
      const pngs = files.filter((f) => f.endsWith('.png'))
      // #454: the taste-note invite needs a durable path to the render the
      // owner would be reacting to (the worktree it lived in is gone by the
      // time they act on the invite) — everything else stays text-only.
      expect(pngs).toEqual([path.join(result.evidenceDir, 'render.png')])
      expect(readFileSync(path.join(result.evidenceDir, 'render.png'), 'utf8')).toBe(
        'the shipped render'
      )
    }))

  it('--mock writes evidence under a <stamp>-mock/ dir with a "(mock)" summary title', async () =>
    withEnv(clearGuardEnv, async () => {
      writeArchiveFixture({
        date: '2026-09-02',
        buildName: 'build-100',
        trace: { steps: [] },
        cost: { total_usd: 0, calls: 0, retries: 0 },
      })
      const exec = () => ({ status: 0, stdout: '', stderr: '' })
      const result = await runCanary({
        exec,
        now: fixedNow,
        root,
        worktreePath: worktree,
        mock: true,
      })

      const evidenceDir = path.join(root, 'docs', 'evidence', 'canary', '2026-09-02-1405-mock')
      expect(result.evidenceDir).toBe(evidenceDir)
      expect(existsSync(evidenceDir)).toBe(true)
      const summary = readFileSync(path.join(evidenceDir, 'summary.md'), 'utf8')
      expect(summary).toContain('Canary run (mock)')
    }))

  it('summary.md reports PASS, the trace steps and the cost from the fixture', async () =>
    withEnv(clearGuardEnv, async () => {
      const trace = {
        steps: [
          { name: 'art-director', phase: 1, durationMs: 4000, timestamp: 't1' },
          { name: 'build', phase: 4, durationMs: 1000, timestamp: 't2' },
        ],
      }
      const cost = { total_usd: 0.42, estimated: false, calls: 3, retries: 0 }
      writeArchiveFixture({ date: '2026-09-02', buildName: 'build-100', trace, cost })
      const exec = () => ({ status: 0, stdout: '', stderr: '' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })
      const summary = readFileSync(path.join(result.evidenceDir, 'summary.md'), 'utf8')
      expect(summary).toContain('PASS — shipped')
      expect(summary).toContain('phase 4 (build)')
      expect(summary).toContain('art-director')
      expect(summary).toContain('4000ms')
      expect(summary).toContain('$0.4200')
      expect(summary).not.toContain('## Final error')
    }))
})

describe('runCanary — a lost night', () => {
  const fixedNow = () => new Date(2026, 8, 2, 14, 5, 0)

  it('exits 1 when only a build-failed-* dir exists', async () =>
    withEnv(clearGuardEnv, async () => {
      writeArchiveFixture({
        date: '2026-09-02',
        buildName: 'build-failed-999',
        trace: { steps: [{ name: 'repair', phase: 5, durationMs: 500, timestamp: 't1' }] },
        cost: { total_usd: 0.1, calls: 1, retries: 3 },
        extraFiles: {
          'error.txt': 'Build failed after 3 repair attempt(s).\nTS2769: no overload matches',
        },
      })
      const exec = () => ({ status: 1, stdout: '', stderr: 'pipeline failed\n' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })
      expect(result.exitCode).toBe(1)
      expect(result.shipped).toBe(false)
    }))

  it('records a repair attempt (#435 shape: input.attempt, output.files, output.success)', async () =>
    withEnv(clearGuardEnv, async () => {
      const trace = {
        steps: [
          {
            name: 'repair',
            phase: 5,
            durationMs: 12000,
            timestamp: 't1',
            input: { attempt: 1, error: 'TS2769: no overload matches this call' },
            output: { files: 4, success: false, error: 'TS2769: still failing' },
          },
        ],
      }
      writeArchiveFixture({
        date: '2026-09-02',
        buildName: 'build-failed-999',
        trace,
        cost: { total_usd: 0.1, calls: 1, retries: 1 },
        extraFiles: { 'error.txt': 'Build failed after 1 repair attempt(s).' },
      })
      const exec = () => ({ status: 1, stdout: '', stderr: '' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })
      const summary = readFileSync(path.join(result.evidenceDir, 'summary.md'), 'utf8')
      expect(summary).toContain('FAIL')
      expect(summary).toContain('attempt 1: 4 file(s), failed')
      expect(summary).toContain('## Final error')
      expect(summary).toContain('Build failed after 1 repair attempt(s)')
    }))

  it('falls back to the pipeline log when no archive dir was written at all', async () =>
    withEnv(clearGuardEnv, async () => {
      const exec = () => ({ status: 1, stdout: 'collect-signals crashed\n', stderr: 'ENOENT\n' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })
      expect(result.exitCode).toBe(1)
      expect(result.shipped).toBe(false)
      expect(result.date).toBeNull()
      const summary = readFileSync(path.join(result.evidenceDir, 'summary.md'), 'utf8')
      expect(summary).toContain('collect-signals crashed')
    }))
})

// A `build-<ts>/` dir already sitting under this date's archive can be one
// an earlier night already published and got committed into HEAD — `git
// worktree add HEAD` copies it straight into this run's fresh worktree.
// Seen twice: 2026-09-21 (a run that died on `error_max_turns`) and
// 2026-09-22 (a ship-gate refusal). Both reported "PASS — shipped" off that
// stale dir, because the old code never looked at the pipeline's own exit
// status at all, and picked "shipped" purely by scanning the worktree's
// filesystem for anything matching `build-<digits>`.
describe('runCanary — a committed same-date build must not paper over a refused run', () => {
  const fixedNow = () => new Date(2026, 8, 22, 16, 50, 0)

  it('reports FAIL, not PASS, when an earlier night already shipped under the same date', async () =>
    withEnv(clearGuardEnv, async () => {
      // An earlier, already-published night — present the instant this
      // run's worktree is created, before the pipeline runs at all.
      writeArchiveFixture({
        date: '2026-09-22',
        buildName: 'build-100',
        trace: { steps: [{ name: 'art-director', phase: 1, durationMs: 100, timestamp: 't0' }] },
        cost: { total_usd: 3.5, calls: 6, retries: 0 },
      })
      // This run's own output: the ship-gate refused it, so all it left
      // behind is the dedicated failure dir.
      writeArchiveFixture({
        date: '2026-09-22',
        buildName: 'build-failed-999999999999',
        trace: { steps: [{ name: 'repair', phase: 5, durationMs: 200, timestamp: 't1' }] },
        cost: { total_usd: 4.02, calls: 8, retries: 2 },
        extraFiles: {
          'error.txt':
            '[ship-gate] 3 engineer-owned fault(s) remain after 3 revision round(s) — refusing to ship',
        },
      })
      const log =
        '  [ship-gate] 3 engineer-owned fault(s) remain after 3 revision round(s) — refusing to ship\n' +
        '  failure trace saved to build-failed-999999999999/trace.json\n' +
        'Pipeline failed: Command failed: node scripts/daily-redesign.js\n'
      const exec = () => ({ status: 1, stdout: log, stderr: '' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })

      expect(result.exitCode).toBe(1)
      expect(result.shipped).toBe(false)
      const summary = readFileSync(path.join(result.evidenceDir, 'summary.md'), 'utf8')
      expect(summary).toContain('**Result:** FAIL')
      expect(summary).toContain('refusing to ship')
      // The cost/trace reported must be this run's own build-failed dir,
      // never the committed build-100 an earlier night already shipped.
      expect(summary).toContain('$4.0200')
      expect(summary).not.toContain('$3.5000')
      expect(summary).not.toContain('art-director')
    }))
})

describe('runCanary — trusts the pipeline exit status and its own log over raw disk state', () => {
  const fixedNow = () => new Date(2026, 8, 22, 16, 50, 0)

  it('a fresh, successfully shipped build reports PASS', async () =>
    withEnv(clearGuardEnv, async () => {
      writeArchiveFixture({
        date: '2026-09-22',
        buildName: 'build-100',
        trace: { steps: [{ name: 'art-director', phase: 1, durationMs: 100, timestamp: 't0' }] },
        cost: { total_usd: 1.23, calls: 4, retries: 0 },
      })
      const log = '  archived to archive/2026-09-22/build-100/\n=== Pipeline complete ===\n'
      const exec = () => ({ status: 0, stdout: log, stderr: '' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })
      expect(result.exitCode).toBe(0)
      expect(result.shipped).toBe(true)
      expect(result.date).toBe('2026-09-22')
      const summary = readFileSync(path.join(result.evidenceDir, 'summary.md'), 'utf8')
      expect(summary).toContain('PASS — shipped')
    }))

  it('trusts the archived-to line over which build-* dir sorts newest', async () =>
    withEnv(clearGuardEnv, async () => {
      // A dir name that would win a plain lexical/numeric "pick the
      // newest" scan of the date dir...
      writeArchiveFixture({
        date: '2026-09-22',
        buildName: 'build-999999999999',
        trace: { steps: [] },
        cost: { total_usd: 9.99, calls: 1, retries: 0 },
      })
      // ...but this run's own log names a different dir as what it shipped.
      writeArchiveFixture({
        date: '2026-09-22',
        buildName: 'build-100',
        trace: {
          steps: [{ name: 'react-engineer', phase: 3, durationMs: 300, timestamp: 't1' }],
        },
        cost: { total_usd: 0.5, calls: 2, retries: 0 },
      })
      const log = '  archived to archive/2026-09-22/build-100/\n'
      const exec = () => ({ status: 0, stdout: log, stderr: '' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })
      expect(result.shipped).toBe(true)
      const summary = readFileSync(path.join(result.evidenceDir, 'summary.md'), 'utf8')
      expect(summary).toContain('react-engineer')
      expect(summary).toContain('$0.5000')
      expect(summary).not.toContain('$9.9900')
    }))

  it('does not trust a status-0 run whose archived-to line names a build that was never written', async () =>
    withEnv(clearGuardEnv, async () => {
      writeArchiveFixture({
        date: '2026-09-22',
        buildName: 'build-100',
        trace: { steps: [] },
        cost: { total_usd: 1, calls: 1, retries: 0 },
      })
      const log = '  archived to archive/2026-09-22/build-777/\n'
      const exec = () => ({ status: 0, stdout: log, stderr: '' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })
      expect(result.shipped).toBe(false)
    }))
})

describe('runCanary — "Ended in" reads the failing agent off the error, not the last step', () => {
  const fixedNow = () => new Date(2026, 8, 2, 14, 5, 0)

  // The trace's last step is a critic here (phase 2), and a retry (e.g.
  // #432's mockup-designer-rejected) can log a step for the phase that
  // eventually failed, so the last step in the trace is not always where the
  // run actually ended. Only the thrown error's own message says that.
  const traceEndingInMockupCritic = {
    steps: [{ name: 'mockup-critic', phase: 2, durationMs: 200, timestamp: 't1' }],
  }

  it.each([
    ['Art Director failed: claude exited 1 before any output', 'phase 1 (art-director)'],
    ['Mockup Designer failed: mockup.html contains a <script> tag', 'phase 2 (mockup-designer)'],
    ['React Engineer failed: claude exited 1 before any output', 'phase 3 (react-engineer)'],
    [
      'Restore of passing state failed to rebuild after post-critic revision. Error:\nTS2769',
      'phase 4 (revision)',
    ],
    ['Build failed after 3 repair attempt(s).\nTS2769: no overload matches', 'phase 5 (repair)'],
  ])('maps %j to %s', async (errorText, expectedPhase) =>
    withEnv(clearGuardEnv, async () => {
      writeArchiveFixture({
        date: '2026-09-02',
        buildName: 'build-failed-999',
        trace: traceEndingInMockupCritic,
        cost: { total_usd: 0.1, calls: 1, retries: 1 },
        extraFiles: { 'error.txt': errorText },
      })
      const exec = () => ({ status: 1, stdout: '', stderr: 'pipeline failed\n' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })
      expect(result.exitCode).toBe(1)
      const summary = readFileSync(path.join(result.evidenceDir, 'summary.md'), 'utf8')
      expect(summary).toContain(`**Ended in:** ${expectedPhase}`)
      expect(summary).not.toContain('**Ended in:** phase 2 (mockup-critic)')
    })
  )

  it('falls back to the last trace step when the error names no phase owner', async () =>
    withEnv(clearGuardEnv, async () => {
      writeArchiveFixture({
        date: '2026-09-02',
        buildName: 'build-failed-999',
        trace: traceEndingInMockupCritic,
        cost: { total_usd: 0.1, calls: 1, retries: 0 },
        extraFiles: { 'error.txt': 'run budget exhausted before the Mockup Designer could start' },
      })
      const exec = () => ({ status: 1, stdout: '', stderr: 'pipeline failed\n' })
      const result = await runCanary({ exec, now: fixedNow, root, worktreePath: worktree })
      const summary = readFileSync(path.join(result.evidenceDir, 'summary.md'), 'utf8')
      expect(summary).toContain('**Ended in:** phase 2 (mockup-critic)')
    }))
})
