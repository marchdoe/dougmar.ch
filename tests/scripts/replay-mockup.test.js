/**
 * scripts/replay-mockup.js — replay a saved night through the Art Director
 * and the mockup loop (spec 11, 1e).
 *
 * The input restore runs against a real throwaway git repo: three commits, the
 * night's chore commit in the middle, so a later night, a later rating and a
 * later reference all exist at HEAD and must be gone after the restore. The
 * collect-references step is the one command faked, since the throwaway repo
 * has no scripts/.
 */

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import * as yaml from 'js-yaml'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const phaseCalls = []
const phase = (name) => async () => {
  phaseCalls.push(name)
}
vi.mock('../../scripts/pipeline/context.js', () => ({ loadRunContext: phase('context') }))
vi.mock('../../scripts/pipeline/phase-art-director.js', () => ({
  runArtDirectorPhase: phase('art-director'),
}))
vi.mock('../../scripts/pipeline/phase-mockup.js', () => ({ runMockupPhase: phase('mockup') }))
vi.mock('../../scripts/pipeline/phase-engineer.js', () => ({
  runEngineerPhase: phase('engineer'),
}))
vi.mock('../../scripts/pipeline/phase-build.js', () => ({ runBuildPhase: phase('build') }))
vi.mock('../../scripts/pipeline/phase-gate.js', () => ({ runGatePhase: phase('gate') }))
vi.mock('../../scripts/pipeline/phase-archive.js', () => ({ runArchivePhase: phase('archive') }))

const {
  checkOutDir,
  dateReferencesHeader,
  findNightCommit,
  modelOverrideFor,
  parseReplayArgs,
  readNightRecord,
  replayEnv,
  restoreNightInputs,
  runReplay,
  runReplayPhases,
  signalsFromTrace,
  weightsEnv,
} = await import('../../scripts/replay-mockup.js')
const { defaultExec } = await import('../../scripts/canary.js')

const NIGHT = '2026-01-02'
const SIGNALS = { date: NIGHT, weather: { temp_f: 41 }, quote: { text: 'Measure twice.' } }

const traceWith = (signals) =>
  JSON.stringify({
    date: signals.date,
    steps: [
      { name: 'signals-loaded', phase: 0, output: signals },
      { name: 'art-director', phase: 1, output: {} },
    ],
  })

describe('parseReplayArgs', () => {
  it('reads the three flags and --keep', () => {
    expect(
      parseReplayArgs(['--date', NIGHT, '--model', 'opus-5-5', '--out', 'x', '--keep'])
    ).toEqual({ date: NIGHT, model: 'opus-5-5', out: 'x', keep: true, inner: false })
  })

  it('refuses a bad date, an unknown model and a missing --out', () => {
    expect(() =>
      parseReplayArgs(['--date', '2026-1-2', '--model', 'opus-4-8', '--out', 'x'])
    ).toThrow(/--date/)
    expect(() => parseReplayArgs(['--date', NIGHT, '--model', 'opus', '--out', 'x'])).toThrow(
      /--model must be one of opus-4-8, opus-5-5/
    )
    expect(() => parseReplayArgs(['--date', NIGHT, '--model', 'opus-4-8'])).toThrow(/--out/)
  })
})

describe('the model override', () => {
  it('moves only the art director and the mockup designer', () => {
    expect(modelOverrideFor('opus-5-5')).toBe('art-director=opus-5-5,mockup-designer=opus-5-5')
    expect(modelOverrideFor('opus-4-8')).toBe('art-director=opus,mockup-designer=opus')
    expect(() => modelOverrideFor('sonnet')).toThrow(/unknown replay model/)
  })

  it('runs the child on the prod tier with the override, the weights and no key', () => {
    const env = replayEnv(
      {
        PATH: '/bin',
        ANTHROPIC_API_KEY: 'sk-ant-x',
        RESUME_HANDOFF: 'h.json',
        PIPELINE_TIER: 'dev',
      },
      { model: 'opus-5-5', weights: { signals: 5, inspiration: 5, ratings: 5, risk: 10 } }
    )
    expect(env.PIPELINE_TIER).toBe('prod')
    expect(env.MODEL_OVERRIDE).toBe('art-director=opus-5-5,mockup-designer=opus-5-5')
    expect(env.WEIGHT_RISK).toBe('10')
    expect(env.RUN_BUDGET_MINUTES).toBe('60')
    expect(env.PATH).toBe('/bin')
    expect(env).not.toHaveProperty('ANTHROPIC_API_KEY')
    expect(env).not.toHaveProperty('RESUME_HANDOFF')
  })

  it('leaves a weight the night did not record unset', () => {
    expect(weightsEnv({ risk: 4 })).toEqual({ WEIGHT_RISK: '4' })
    expect(weightsEnv(null)).toEqual({})
  })
})

describe('checkOutDir', () => {
  it("refuses the checkout's signals/, archive/ and public/", () => {
    const root = '/repo'
    expect(() => checkOutDir('/repo/signals', root)).toThrow(/signals/)
    expect(() => checkOutDir('/repo/archive/2026-01-02', root)).toThrow(/archive/)
    expect(() => checkOutDir('/repo/public/x', root)).toThrow(/public/)
    expect(() => checkOutDir('/repo/docs/evidence/replay', root)).not.toThrow()
    expect(() => checkOutDir('/tmp/replay', root)).not.toThrow()
  })
})

describe('signalsFromTrace', () => {
  it("returns the signals-loaded step's signals", () => {
    expect(signalsFromTrace(traceWith(SIGNALS), NIGHT)).toEqual(SIGNALS)
  })

  it('refuses a trace with no signals, or signals for another day', () => {
    expect(() => signalsFromTrace(JSON.stringify({ steps: [] }), NIGHT)).toThrow(
      /no signals-loaded/
    )
    expect(() => signalsFromTrace(traceWith({ ...SIGNALS, date: '2026-01-03' }), NIGHT)).toThrow(
      /holds signals for 2026-01-03/
    )
  })
})

describe('dateReferencesHeader', () => {
  it('dates the header to the night and nothing else', () => {
    const text = '# Design References — 2026-09-28\n\n> Sources: curated library\n2026-09-28 stays'
    expect(dateReferencesHeader(text, NIGHT)).toBe(
      `# Design References — ${NIGHT}\n\n> Sources: curated library\n2026-09-28 stays`
    )
  })
})

describe('restoring a night', () => {
  let repo
  const gitEnv = {
    ...process.env,
    GIT_AUTHOR_NAME: 't',
    GIT_AUTHOR_EMAIL: 't@t',
    GIT_COMMITTER_NAME: 't',
    GIT_COMMITTER_EMAIL: 't@t',
  }
  const write = (rel, content) => {
    mkdirSync(path.dirname(path.join(repo, rel)), { recursive: true })
    writeFileSync(path.join(repo, rel), content)
  }
  const commit = (message) => {
    execSync('git add -A', { cwd: repo, env: gitEnv })
    execSync(`git -c commit.gpgsign=false commit -q -m ${JSON.stringify(message)}`, {
      cwd: repo,
      env: gitEnv,
    })
  }
  /** defaultExec, but collect-references.js writes a file stamped with "today". */
  const exec = (command, options) => {
    if (command === 'node scripts/collect-references.js') {
      const refs = readFileSync(path.join(repo, 'references/index.yml'), 'utf8')
      const signals = readFileSync(path.join(repo, 'signals/today.yml'), 'utf8')
      writeFileSync(
        path.join(repo, 'signals/today.references.md'),
        `# Design References — 2026-09-28\n\n${refs}\n${signals}`
      )
      return { status: 0, stdout: '', stderr: '' }
    }
    return defaultExec(command, options)
  }

  beforeEach(() => {
    repo = mkdtempSync(path.join(tmpdir(), 'replay-repo-'))
    execSync('git init -q', { cwd: repo })
    write('archive/2026-01-01/brief.md', 'night one')
    write('references/index.yml', 'references:\n  - file: a.png\n')
    commit('the checkout the night ran on')
    write('archive/2026-01-02/record.json', JSON.stringify({ buildId: '111' }))
    write('archive/2026-01-02/build-111/trace.json', traceWith(SIGNALS))
    write('archive/2026-01-02/build-111/build.json', JSON.stringify({ weights: { risk: 7 } }))
    commit(`chore: daily redesign ${NIGHT}`)
    write('archive/2026-01-03/brief.md', 'the night after')
    write('archive/2026-01-01/rating-999.json', '{"grade":"A"}')
    write('references/index.yml', 'references:\n  - file: a.png\n  - file: own-later.png\n')
    commit('chore: daily redesign 2026-01-03')
  })

  afterEach(() => {
    rmSync(repo, { recursive: true, force: true })
  })

  it("finds the night's commit and reads its signals and weights from the shipped build", () => {
    const sha = findNightCommit({ exec, root: repo, date: NIGHT })
    expect(sha).toMatch(/^[0-9a-f]{40}$/)
    expect(readNightRecord({ exec, root: repo, sha, date: NIGHT })).toEqual({
      signals: SIGNALS,
      weights: { risk: 7 },
      buildId: '111',
    })
    expect(() => findNightCommit({ exec, root: repo, date: '2026-01-09' })).toThrow(
      /no "chore: daily redesign 2026-01-09" commit/
    )
  })

  it('puts back the archive and references the night saw, its signals and its references file', async () => {
    const sha = findNightCommit({ exec, root: repo, date: NIGHT })
    await restoreNightInputs({ exec, worktree: repo, sha, date: NIGHT, signals: SIGNALS })

    // Nothing from the night itself or after it.
    expect(existsSync(path.join(repo, 'archive/2026-01-03'))).toBe(false)
    expect(existsSync(path.join(repo, 'archive/2026-01-02'))).toBe(false)
    expect(existsSync(path.join(repo, 'archive/2026-01-01/rating-999.json'))).toBe(false)
    expect(readFileSync(path.join(repo, 'archive/2026-01-01/brief.md'), 'utf8')).toBe('night one')
    expect(readFileSync(path.join(repo, 'references/index.yml'), 'utf8')).not.toContain('own-later')

    const restored = yaml.load(readFileSync(path.join(repo, 'signals/today.yml'), 'utf8'))
    expect(restored).toEqual(SIGNALS)

    const references = readFileSync(path.join(repo, 'signals/today.references.md'), 'utf8')
    expect(references.startsWith(`# Design References — ${NIGHT}\n`)).toBe(true)
    expect(references).not.toContain('own-later')
    expect(references).toContain('Measure twice.')
  })
})

describe('stopping before the engineer', () => {
  beforeEach(() => {
    phaseCalls.length = 0
  })

  it('runs the context, Art Director and mockup phases and nothing after them', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    try {
      await runReplayPhases({})
    } finally {
      log.mockRestore()
    }
    expect(phaseCalls).toEqual(['context', 'art-director', 'mockup'])
  })
})

describe('runReplay refusals', () => {
  it('refuses when ANTHROPIC_API_KEY is set, before touching git', async () => {
    const root = mkdtempSync(path.join(tmpdir(), 'replay-root-'))
    const exec = vi.fn()
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const status = await runReplay({
        date: NIGHT,
        model: 'opus-4-8',
        out: path.join(root, 'out'),
        exec,
        root,
        env: { ANTHROPIC_API_KEY: 'sk-ant-x' },
      })
      expect(status).toBe(2)
      expect(exec).not.toHaveBeenCalled()
    } finally {
      error.mockRestore()
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('refuses under GITHUB_ACTIONS', async () => {
    const exec = vi.fn()
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const status = await runReplay({
        date: NIGHT,
        model: 'opus-4-8',
        out: '/tmp/replay-out',
        exec,
        root: tmpdir(),
        env: { GITHUB_ACTIONS: 'true' },
      })
      expect(status).toBe(2)
      expect(exec).not.toHaveBeenCalled()
    } finally {
      error.mockRestore()
    }
  })
})
