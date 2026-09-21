/**
 * What a night's run records, driven through the real swarm against a temp
 * root (#578): why each model call was made, the trace steps for the
 * branches that ran with none, what a failed run leaves behind, and a run that
 * starts from a failed run's paid responses.
 *
 * The harness's model fakes book each call in the ledger with the purpose the
 * swarm passed, as the real transports do, so `run.ledger` is what `cost.json`
 * would hold for the call list.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { setRunDeadline } from '../../scripts/utils/run-budget.js'
import {
  CLEAN_GATE,
  FAKE_CALL_USD,
  fixtureFor,
  mockFactories as m,
  runSwarm,
} from './swarm-harness.js'

vi.mock('../../scripts/utils/claude-cli.js', (o) => m['scripts/utils/claude-cli.js'](o))
vi.mock('../../scripts/utils/vision-router.js', (o) => m['scripts/utils/vision-router.js'](o))
vi.mock('../../scripts/utils/build-validator.js', (o) => m['scripts/utils/build-validator.js'](o))
vi.mock('../../scripts/utils/snapshot.js', (o) => m['scripts/utils/snapshot.js'](o))
vi.mock('../../scripts/utils/surface-gate.js', (o) => m['scripts/utils/surface-gate.js'](o))
vi.mock('../../scripts/utils/copy-gate.js', (o) => m['scripts/utils/copy-gate.js'](o))
vi.mock('../../scripts/utils/archiver.js', (o) => m['scripts/utils/archiver.js'](o))
vi.mock('../../scripts/seal-archive.js', (o) => m['scripts/seal-archive.js'](o))
vi.mock('../../scripts/utils/file-manager.js', (o) => m['scripts/utils/file-manager.js'](o))
vi.mock('node:child_process', (o) => m['node:child_process'](o))

const { parseHandoff } = await import('../../scripts/utils/handoff.js')

const ENGINEER = fixtureFor('react-engineer')
const SIDEBAR = 'app/components/Sidebar.tsx'
const LAYOUT = 'app/components/Layout.tsx'

/** One `===FILE:<relPath>===` block of the fixture, delimiter to the next delimiter. */
function blockOf(text, relPath) {
  const header = `===FILE:${relPath}===`
  const start = text.indexOf(header)
  if (start < 0) throw new Error(`fixture has no block for ${relPath}`)
  return text.slice(start, text.indexOf('\n===', start + header.length) + 1)
}

const withoutBlock = (text, relPath) => text.replace(blockOf(text, relPath), '')

/** A patch reply carrying the fixture's block for one file, with a marker comment on top. */
function markedPatch(relPath, marker) {
  const header = `===FILE:${relPath}===\n`
  return `${header}// ${marker}\n${blockOf(ENGINEER, relPath).slice(header.length)}\n===RATIONALE===\n${marker}\n`
}

const criticReply = (verdict, feedback) =>
  `===VERDICT===\n${verdict}\n\n===FEEDBACK===\n${feedback}\n===END===`

const SCREENSHOT_REVISE = [
  '===VERDICT===',
  'REVISE',
  '===END===',
  '',
  '**Responsible agent:** react-engineer',
  '',
  '===FEEDBACK===',
  'The wordmark and the nav share a baseline at 1440px.',
  '===END===',
  '',
].join('\n')

/** The designer fixture with a marker on <body>, so each round's mockup is distinct. */
const mockupRound = (n) =>
  fixtureFor('mockup-designer').replace('<body>', `<body data-round="${n}">`)

const stepNames = (run) => run.trace.steps.map((s) => s.name)
const stepsNamed = (run, name) => run.trace.steps.filter((s) => s.name === name)
const purposes = (run) => run.ledger.map((r) => [r.agent, r.purpose])

function failedDir(run) {
  return path.join(run.root, 'archive', run.date, run.trace.dir)
}
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'))

describe('why each call was made (#578)', () => {
  // A night with every kind of second call: a mockup the critic sends back, an
  // engineer reply missing a file, a build that fails once, and a screenshot
  // critic that sends the build back.
  async function busyNight() {
    return runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0), mockupRound(1)],
        'mockup-critic': [
          criticReply('REVISE', 'The hero is 48px; the spec declares 64px or more.'),
          criticReply('APPROVE', 'Executes the brief.'),
        ],
        'react-engineer': [
          withoutBlock(ENGINEER, SIDEBAR),
          `${blockOf(ENGINEER, SIDEBAR)}\n===RATIONALE===\nadded Sidebar\n`,
          markedPatch(LAYOUT, 'repair'),
          markedPatch(SIDEBAR, 'revision'),
        ],
        'screenshot-critic': [SCREENSHOT_REVISE, fixtureFor('screenshot-critic')],
      },
      // The first build fails, the repair passes, and so does the revision's.
      build: [false, true, true],
    })
  }

  it('gives every call in the ledger the reason the swarm asked for it', async () => {
    const run = await busyNight()

    expect(run.error).toBeNull()
    expect(purposes(run)).toEqual([
      ['art-director', 'first'],
      ['mockup-designer', 'first'],
      ['mockup-critic', 'first'],
      ['mockup-designer', 'revision'],
      ['mockup-critic', 'rejudge'],
      ['react-engineer', 'first'],
      ['react-engineer', 'output-patch'],
      ['react-engineer', 'repair'],
      ['screenshot-critic', 'first'],
      ['react-engineer', 'revision'],
      ['screenshot-critic', 'rejudge'],
    ])
    // The ledger and the call list are the same calls.
    expect(run.ledger.map((r) => r.agent)).toEqual(run.calls.map((c) => c.agent))
    expect(run.cost.calls).toBe(11)
    expect(run.cost.total_usd).toBeCloseTo(11 * FAKE_CALL_USD, 6)
    // cost.json carries the purpose in every entry.
    expect(run.cost.byAgent.every((r) => typeof r.purpose === 'string')).toBe(true)
  })

  it('retries and stalls are their own reason', async () => {
    const stall = '[react-engineer] stalled — no output for 15 minutes (generated 0KB before stall)'
    const run = await runSwarm({
      agents: {
        'art-director': ['not a reply at all', fixtureFor('art-director')],
        'react-engineer': [new Error(stall), ENGINEER],
      },
    })

    expect(run.error).toBeNull()
    expect(
      purposes(run).filter(([agent]) => agent !== 'mockup-designer' && agent !== 'mockup-critic')
    ).toEqual([
      ['art-director', 'first'],
      ['art-director', 'retry'],
      ['react-engineer', 'first'],
      ['react-engineer', 'retry'],
      ['screenshot-critic', 'first'],
    ])
  })

  it('leaves no call as unknown on the paths the swarm has', async () => {
    const run = await busyNight()
    expect(run.ledger.filter((r) => r.purpose === 'unknown')).toEqual([])
  })
})

describe('the trace of the revision and the final re-judge (#578)', () => {
  it('records the revision, then the round-2 gate, then the final critic, in that order', async () => {
    const run = await runSwarm({
      agents: {
        'react-engineer': [ENGINEER, markedPatch(SIDEBAR, 'revision')],
        'screenshot-critic': [SCREENSHOT_REVISE, fixtureFor('screenshot-critic')],
      },
    })

    expect(run.error).toBeNull()
    const names = stepNames(run)
    const revisionAt = names.indexOf('revision')
    const finalAt = names.indexOf('screenshot-critic-final')
    expect(revisionAt).toBeGreaterThan(names.indexOf('screenshot-critic'))
    expect(names.indexOf('surface-gate', revisionAt)).toBeGreaterThan(revisionAt)
    expect(finalAt).toBeGreaterThan(names.indexOf('surface-gate', revisionAt))

    const [revision] = stepsNamed(run, 'revision')
    expect(revision).toMatchObject({
      phase: 4,
      input: {
        verdict: 'REVISE',
        responsibleAgent: 'react-engineer',
        gateForced: false,
        engineerFaults: 0,
      },
      output: { outcome: 'rebuilt', replied: 1, written: 1, deleted: 0 },
    })
    expect(revision.input.feedback).toContain('The wordmark and the nav share a baseline')
    expect(revision.output.merged).toBeGreaterThan(1)

    const [final] = stepsNamed(run, 'screenshot-critic-final')
    expect(final).toMatchObject({
      phase: 4,
      input: { remainingFaults: 0 },
      output: { verdict: 'SHIP', channel: 'sdk-vision' },
    })
  })

  it('records a revision the gate forced on a SHIP', async () => {
    const overflow = {
      surface: '/',
      viewport: 'phone',
      width: 390,
      scheme: 'light',
      kind: 'overflow',
      severity: 'error',
      detail: 'document is 640px wide in a 390px viewport',
    }
    const run = await runSwarm({
      gate: [{ findings: [overflow], measured: 8, errorCount: 1 }, CLEAN_GATE],
    })

    const [revision] = stepsNamed(run, 'revision')
    expect(revision.input).toMatchObject({ verdict: 'SHIP', gateForced: true, engineerFaults: 1 })
    expect(revision.output.outcome).toBe('rebuilt')
  })

  it('records a revision whose build broke and was rolled back', async () => {
    const run = await runSwarm({
      build: [true, false, true],
      agents: {
        'react-engineer': [ENGINEER, markedPatch(LAYOUT, 'revision')],
        'screenshot-critic': [SCREENSHOT_REVISE],
      },
    })

    expect(run.error).toBeNull()
    const [revision] = stepsNamed(run, 'revision')
    expect(revision.output).toMatchObject({ outcome: 'build-broke-restored', written: 1 })
    expect(revision.output.error).toContain('Layout.tsx')
    // No rebuild passed, so no round-2 gate and no final judge ran.
    expect(stepsNamed(run, 'screenshot-critic-final')).toEqual([])
  })

  it('records a rollback that did not rebuild, before the run fails', async () => {
    const run = await runSwarm({
      build: [true, false, false],
      agents: { 'screenshot-critic': [SCREENSHOT_REVISE] },
    })

    expect(run.error.fatal).toBe(true)
    const [revision] = stepsNamed(run, 'revision')
    expect(revision.output.outcome).toBe('restore-failed')
    expect(revision.output.error).toMatch(/^Restore of passing state failed to rebuild/)
  })

  it('records a revision that was not applied because the merged set failed the output check', async () => {
    const noSidebar = `===FILE:${SIDEBAR}===\n\n===RATIONALE===\nremoved\n`
    const run = await runSwarm({
      agents: {
        'react-engineer': [ENGINEER, noSidebar],
        'screenshot-critic': [SCREENSHOT_REVISE],
      },
    })

    expect(run.error).toBeNull()
    const [revision] = stepsNamed(run, 'revision')
    expect(revision.output.outcome).toBe('not-applied')
    expect(revision.output.problem).toMatch(/Sidebar/)
  })

  it('records a revision skipped because the run is out of time', async () => {
    const run = await runSwarm({
      agents: {
        'screenshot-critic': [
          () => {
            setRunDeadline(Date.now())
            return SCREENSHOT_REVISE
          },
        ],
      },
    })

    expect(run.error).toBeNull()
    expect(stepsNamed(run, 'revision')[0].output).toEqual({ outcome: 'skipped-deadline' })
    expect(run.callsFor('react-engineer')).toHaveLength(1)
  })

  it('records a final re-judge that could not run, and still ships', async () => {
    const run = await runSwarm({
      agents: {
        'react-engineer': [ENGINEER, markedPatch(SIDEBAR, 'revision')],
        'screenshot-critic': [SCREENSHOT_REVISE, new Error('vision transport down')],
      },
    })

    expect(run.error).toBeNull()
    const [final] = stepsNamed(run, 'screenshot-critic-final')
    expect(final.output).toEqual({ verdict: 'ERROR', error: 'vision transport down' })
  })

  it('records nothing for a build that needed no revision', async () => {
    const run = await runSwarm({})
    expect(stepNames(run)).not.toContain('revision')
    expect(stepNames(run)).not.toContain('screenshot-critic-final')
    expect(stepNames(run)).not.toContain('output-patch')
  })
})

describe('the trace of the output patch rounds (#578, #611)', () => {
  it('records each round the engineer was asked to patch, and how it ended', async () => {
    const run = await runSwarm({
      agents: {
        'react-engineer': [
          withoutBlock(ENGINEER, SIDEBAR),
          // A round-1 reply that repairs nothing, then one that does.
          `===FILE:${LAYOUT}===\n// nothing\n\n===RATIONALE===\nno\n`,
          `${blockOf(ENGINEER, SIDEBAR)}\n===RATIONALE===\nadded\n`,
        ],
      },
    })

    expect(run.error).toBeNull()
    const rounds = stepsNamed(run, 'output-patch')
    expect(rounds.map((s) => [s.input.round, s.output.outcome])).toEqual([
      [1, 'not-applied'],
      [2, 'applied'],
    ])
    expect(rounds[0].input.kind).toBe('missing-files')
    expect(rounds[0].phase).toBe(3)
    // Before the react-engineer step that reports the merged files.
    expect(stepNames(run).indexOf('output-patch')).toBeLessThan(
      stepNames(run).indexOf('react-engineer')
    )
  })
})

describe('a mockup round that shipped an earlier round is traced (#593)', () => {
  it('still leaves its mockup-round-shipped step', () => {
    const source = readFileSync(
      new URL('../../scripts/utils/mockup-rounds.js', import.meta.url),
      'utf8'
    )
    expect(source).toContain("name: 'mockup-round-shipped'")
  })
})

describe('what a failed run leaves beside its trace (#578)', () => {
  // The engineer never produces Layout.tsx: the run fails after the Art
  // Director and the mockup loop have been paid for.
  const noLayout = withoutBlock(ENGINEER, LAYOUT)

  async function failedNight(extra = {}) {
    return runSwarm({ agents: { 'react-engineer': [noLayout], ...extra } })
  }

  it('writes cost.json with the calls it paid for, and their reasons', async () => {
    const run = await failedNight()

    expect(run.error.message).toMatch(/Layout\.tsx/)
    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    const cost = readJson(path.join(failedDir(run), 'cost.json'))
    // The Art Director, the designer, the critic and three engineer asks.
    expect(cost.calls).toBe(6)
    expect(cost.total_usd).toBeCloseTo(6 * FAKE_CALL_USD, 6)
    expect(cost.byAgent.map((r) => [r.agent, r.purpose])).toEqual([
      ['art-director', 'first'],
      ['mockup-designer', 'first'],
      ['mockup-critic', 'first'],
      ['react-engineer', 'first'],
      ['react-engineer', 'output-patch'],
      ['react-engineer', 'output-patch'],
    ])
    expect(cost).not.toHaveProperty('priorAttempts')
  })

  it('writes handoff.json with the responses of the paid stages before the engineer', async () => {
    const run = await failedNight()

    const file = path.join(failedDir(run), 'handoff.json')
    expect(existsSync(file)).toBe(true)
    const handoff = parseHandoff(readFileSync(file, 'utf8'), { date: run.date })
    expect(handoff.tape.map((e) => e.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
    ])
    expect(handoff.tape[0].text).toBe(fixtureFor('art-director'))
    expect(handoff.tape[1].text).toBe(fixtureFor('mockup-designer'))
    expect(handoff.tape[2]).toEqual({
      agent: 'mockup-critic',
      text: fixtureFor('mockup-critic'),
      channel: 'sdk-vision',
    })
    expect(handoff.signals.date).toBe(run.date)
  })

  it('carries the references file the run read, so a resume can put it back', async () => {
    const run = await runSwarm({
      agents: { 'react-engineer': [noLayout] },
      beforeRun: (root) =>
        writeFileSync(path.join(root, 'signals', 'today.references.md'), '## Trending\n- a thing'),
    })

    const handoff = parseHandoff(readFileSync(path.join(failedDir(run), 'handoff.json'), 'utf8'), {
      date: run.date,
    })
    expect(handoff.references).toBe('## Trending\n- a thing')
  })

  it('writes no handoff for a run that failed before its first paid stage answered', async () => {
    const run = await runSwarm({ agents: { 'art-director': [new Error('no credits')] } })

    expect(run.error).toBeTruthy()
    expect(existsSync(path.join(failedDir(run), 'cost.json'))).toBe(true)
    expect(existsSync(path.join(failedDir(run), 'handoff.json'))).toBe(false)
  })

  // 2026-09-21: the swarm shipped and a later workflow step failed. Its
  // handoff sits in signals/, which nothing commits, for the failure artifact.
  it('leaves a night that shipped its handoff in signals/, and no failure directory', async () => {
    const run = await runSwarm({})

    expect(run.error).toBeNull()
    const handoff = parseHandoff(
      readFileSync(path.join(run.root, 'signals', 'handoff.json'), 'utf8'),
      {
        date: run.date,
      }
    )
    expect(handoff.tape.map((e) => e.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
    ])
    expect(handoff.signals.date).toBe(run.date)
  })

  it('lets a night that shipped and then failed a later step be resumed at the engineer', async () => {
    const shipped = await runSwarm({})
    const tape = parseHandoff(
      readFileSync(path.join(shipped.root, 'signals', 'handoff.json'), 'utf8'),
      {
        date: shipped.date,
      }
    ).tape

    const resumed = await runSwarm({ tape })

    expect(resumed.error).toBeNull()
    expect(resumed.calls.map((c) => c.agent)).toEqual(['react-engineer', 'screenshot-critic'])
    expect(resumed.fakes.archive[0].artifacts['mockup.html']).toBe(
      shipped.fakes.archive[0].artifacts['mockup.html']
    )
  })

  it('writes neither into a night that shipped', async () => {
    const run = await runSwarm({})
    const dateDir = path.join(run.root, 'archive', run.date)
    const failed = readdirSync(dateDir).filter((d) => d.startsWith('build-failed-'))
    expect(failed).toEqual([])
  })
})

describe('a run that starts from a failed run (#578)', () => {
  const noLayout = withoutBlock(ENGINEER, LAYOUT)

  /** The tape a failed run left, read back the way the pipeline reads it. */
  function tapeOf(failed) {
    return parseHandoff(readFileSync(path.join(failedDir(failed), 'handoff.json'), 'utf8'), {
      date: failed.date,
    }).tape
  }

  it('asks the engineer and not the Art Director, the mockup designer or the mockup critic', async () => {
    const failed = await runSwarm({ agents: { 'react-engineer': [noLayout] } })
    const resumed = await runSwarm({ tape: tapeOf(failed) })

    expect(resumed.error).toBeNull()
    expect(resumed.calls.map((c) => c.agent)).toEqual(['react-engineer', 'screenshot-critic'])
    expect(resumed.callsFor('art-director')).toEqual([])
    expect(resumed.callsFor('mockup-designer')).toEqual([])
    expect(resumed.callsFor('mockup-critic')).toEqual([])
  })

  it('hands the engineer the prompt a run that paid for everything would have', async () => {
    const failed = await runSwarm({ agents: { 'react-engineer': [noLayout] } })
    const resumed = await runSwarm({ tape: tapeOf(failed) })
    const whole = await runSwarm({})

    const [a] = resumed.callsFor('react-engineer')
    const [b] = whole.callsFor('react-engineer')
    expect(a.systemPrompt).toBe(b.systemPrompt)
    expect(a.userPrompt).toBe(b.userPrompt)
    expect(a.model).toBe(b.model)
  })

  it('ships the same night: the mockup, the verdicts and the files come out the same', async () => {
    const failed = await runSwarm({ agents: { 'react-engineer': [noLayout] } })
    const resumed = await runSwarm({ tape: tapeOf(failed) })
    const whole = await runSwarm({})

    const shipped = (run) => run.fakes.archive[0]
    expect(shipped(resumed).artifacts['mockup.html']).toBe(shipped(whole).artifacts['mockup.html'])
    expect(shipped(resumed).artifacts['composition.json']).toBe(
      shipped(whole).artifacts['composition.json']
    )
    expect(shipped(resumed).artifacts['lane.json']).toBe(shipped(whole).artifacts['lane.json'])
    expect(shipped(resumed).changedFiles).toEqual(shipped(whole).changedFiles)
    const critic = (run) => run.verdicts.find((v) => v.critic === 'mockup-critic')
    expect(critic(resumed)).toMatchObject({ verdict: 'APPROVE', channel: 'sdk-vision', round: 0 })
    expect(shipped(resumed).rationale).toBe(shipped(whole).rationale)
    // The mockup was still captured and measured on this run, by the real stage.
    expect(resumed.fakes.captureHtmlFileScreenshot).toHaveLength(1)
  })

  it('leaves the resumed stages in the trace, and a resume step that says so', async () => {
    const failed = await runSwarm({ agents: { 'react-engineer': [noLayout] } })
    const resumed = await runSwarm({ tape: tapeOf(failed) })

    const [resume] = stepsNamed(resumed, 'resume')
    expect(resume.phase).toBe(0)
    expect(resume.output).toEqual({
      replayed: { 'art-director': 1, 'mockup-designer': 1, 'mockup-critic': 1 },
      total: 3,
    })
    expect(stepNames(resumed)).toEqual(expect.arrayContaining(['art-director', 'mockup-critic']))
  })

  it('books the served responses as free calls and pays only for what it asked', async () => {
    const failed = await runSwarm({ agents: { 'react-engineer': [noLayout] } })
    const resumed = await runSwarm({ tape: tapeOf(failed) })

    expect(purposes(resumed)).toEqual([
      ['art-director', 'replay'],
      ['mockup-designer', 'replay'],
      ['mockup-critic', 'replay'],
      ['react-engineer', 'first'],
      ['screenshot-critic', 'first'],
    ])
    expect(resumed.cost.total_usd).toBeCloseTo(2 * FAKE_CALL_USD, 6)
  })

  it('replays a mockup loop with revisions, and ships the round the first run settled on', async () => {
    const loop = {
      'mockup-designer': [mockupRound(0), mockupRound(1), mockupRound(2)],
      'mockup-critic': [
        criticReply('REVISE', 'The hero is 48px; the spec declares 64px or more.'),
        criticReply('REVISE', 'The nav still sits in a band.'),
        criticReply('APPROVE', 'Executes the brief.'),
      ],
    }
    const failed = await runSwarm({ agents: { ...loop, 'react-engineer': [noLayout] } })
    expect(tapeOf(failed).map((e) => e.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'mockup-designer',
      'mockup-critic',
      'mockup-designer',
      'mockup-critic',
    ])

    const resumed = await runSwarm({ tape: tapeOf(failed) })

    expect(resumed.error).toBeNull()
    expect(resumed.calls.map((c) => c.agent)).toEqual(['react-engineer', 'screenshot-critic'])
    expect(resumed.fakes.captureHtmlFileScreenshot).toHaveLength(3)
    expect(resumed.fakes.archive[0].artifacts['mockup.html']).toContain('data-round="2"')
    expect(
      resumed.verdicts.filter((v) => v.critic === 'mockup-critic').map((v) => [v.round, v.verdict])
    ).toEqual([
      [0, 'REVISE'],
      [1, 'REVISE'],
      [2, 'APPROVE'],
    ])
    // The reasons the failed run gave its calls are the reasons the replays are booked under.
    expect(purposes(resumed).filter(([, why]) => why === 'replay')).toHaveLength(7)
  })

  it('goes live for a stage the tape ran out in: the original run stopped there', async () => {
    const failed = await runSwarm({ agents: { 'react-engineer': [noLayout] } })
    const [artDirector] = tapeOf(failed)
    const resumed = await runSwarm({ tape: [artDirector] })

    expect(resumed.error).toBeNull()
    expect(resumed.calls.map((c) => c.agent)).toEqual([
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
    ])
  })

  it('leaves a tape a further resume can use whole when it fails too', async () => {
    const failed = await runSwarm({ agents: { 'react-engineer': [noLayout] } })
    const again = await runSwarm({ tape: tapeOf(failed), agents: { 'react-engineer': [noLayout] } })

    expect(again.error.message).toMatch(/Layout\.tsx/)
    expect(again.trace.dir).toMatch(/^build-failed-\d+$/)
    expect(tapeOf(again)).toEqual(tapeOf(failed))
    // And it says the first three calls were free.
    const cost = readJson(path.join(failedDir(again), 'cost.json'))
    expect(cost.byAgent.slice(0, 3).map((r) => [r.purpose, r.cost_usd])).toEqual([
      ['replay', 0],
      ['replay', 0],
      ['replay', 0],
    ])
  })
})
