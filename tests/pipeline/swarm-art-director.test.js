/**
 * The swarm's Phase 1 and Phase 2 retry paths, run for real against a temp
 * root (#221): the Art Director retry, the codegen retry, the spec-critic
 * gate and the mockup critic loop.
 *
 * Same fakes as swarm.test.js. The harness records every `restore` and
 * `cleanupOrphans` the swarm makes as `run.fakes.restore` and
 * `run.fakes.cleanupOrphans`, so a rollback can be asserted by the map it
 * received as well as by the disk it left behind.
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { ModelTransportError } from '../../scripts/utils/model-transport-error.js'
import {
  fixtureFor,
  mockFactories as m,
  REQUIRED_ENGINEER_FILES,
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

// site-context.js imports file-manager.js, so it loads after the mock block.
const { MUTABLE_FILES } = await import('../../scripts/utils/site-context.js')
const { parseDelimiterResponse } = await import('../../scripts/utils/delimiter-parser.js')

/** The `restore` calls as `{ paths, root }`, the two fields these scenarios pin. */
const restored = (run) => run.fakes.restore.map(({ paths, root }) => ({ paths, root }))
/** The `cleanupOrphans` calls as `{ written, root }`. */
const cleaned = (run) => run.fakes.cleanupOrphans.map(({ written, root }) => ({ written, root }))

const HAPPY_CALLS = [
  'art-director',
  'spec-critic',
  'mockup-designer',
  'mockup-critic',
  'react-engineer',
  'screenshot-critic',
]

/** A mockup-critic reply in the layout parseMockupCriticResponse reads. */
function mockupCriticReply(verdict, feedback) {
  return `===VERDICT===\n${verdict}\n\n===FEEDBACK===\n${feedback}\n===END===`
}

/** The designer fixture with a marker on <body>, so each round's mockup is distinct. */
function mockupRound(n) {
  return fixtureFor('mockup-designer').replace('<body>', `<body data-round="${n}">`)
}

/** The `mockup.html` a round's designer reply carries, which is what the next round is shown. */
const mockupHtmlOf = (n) =>
  parseDelimiterResponse(mockupRound(n)).files.find((f) => f.path === 'mockup.html').content

const under = (root, rel) => path.join(root, ...rel.split('/'))
const read = (root, rel) => readFileSync(under(root, rel), 'utf8')

describe('the mockup critic loop', () => {
  it('revises twice on REVISE, REVISE, APPROVE and ships the third mockup', async () => {
    const feedbackA = 'Hero phrase renders at 48px; the spec declares clamp(64px, 8.5vw, 136px).'
    const feedbackB = 'Nav still sits in a band; the header declaration says marginal.'
    const run = await runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0), mockupRound(1), mockupRound(2)],
        'mockup-critic': [
          mockupCriticReply('REVISE', feedbackA),
          mockupCriticReply('REVISE', feedbackB),
          mockupCriticReply('APPROVE', 'Lands the brief.'),
        ],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'mockup-designer',
      'mockup-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
    ])

    const designer = run.callsFor('mockup-designer')
    expect(designer).toHaveLength(3)
    const header = '## CRITIC REVISION FEEDBACK — fix these before anything else'
    expect(designer[0].userPrompt).not.toContain(header)
    expect(designer[1].userPrompt).toContain(`${header}\n\n${feedbackA}`)
    expect(designer[1].userPrompt).not.toContain(feedbackB)
    expect(designer[2].userPrompt).toContain(`${header}\n\n${feedbackB}`)
    expect(designer[2].userPrompt).not.toContain(feedbackA)

    expect(
      run.verdicts
        .filter((v) => v.critic === 'mockup-critic')
        .map(({ round, verdict, feedback, channel }) => ({ round, verdict, feedback, channel }))
    ).toEqual([
      { round: 0, verdict: 'REVISE', feedback: feedbackA, channel: 'sdk-vision' },
      { round: 1, verdict: 'REVISE', feedback: feedbackB, channel: 'sdk-vision' },
      { round: 2, verdict: 'APPROVE', feedback: 'Lands the brief.', channel: 'sdk-vision' },
    ])
    expect(run.trace.steps.filter((s) => s.name === 'mockup-critic').map((s) => s.input)).toEqual([
      { round: 0 },
      { round: 1 },
      { round: 2 },
    ])
    expect(run.retries).toBe(2)
    expect(run.fakes.restore).toEqual([])

    // The engineer received the approved round, and it is what sits on disk.
    expect(read(run.root, 'signals/today.mockup.html')).toContain('<body data-round="2">')
    expect(run.callsFor('react-engineer')[0].userPrompt).toContain('<body data-round="2">')
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.trace.dir).toMatch(/^build-\d+$/)
  })

  it('accepts the round-0 mockup when the critic reply has no verdict block', async () => {
    const garbage = 'Looks fine to me, ship it.'
    const run = await runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0)],
        'mockup-critic': [garbage],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual(HAPPY_CALLS)
    expect(run.callsFor('mockup-designer')).toHaveLength(1)
    expect(run.callsFor('mockup-designer')[0].userPrompt).not.toContain(
      '## CRITIC REVISION FEEDBACK'
    )

    // The fail-closed REVISE is recorded, with the raw reply as its feedback,
    // and the loop stops without spending a revision on it.
    const critic = run.verdicts.filter((v) => v.critic === 'mockup-critic')
    expect(critic).toHaveLength(1)
    expect(critic[0]).toMatchObject({
      round: 0,
      verdict: 'REVISE',
      feedback: `malformed critic response: ${garbage}`,
      channel: 'sdk-vision',
    })
    expect(run.trace.steps.filter((s) => s.name === 'mockup-critic')).toHaveLength(1)
    expect(run.retries).toBe(0)

    expect(read(run.root, 'signals/today.mockup.html')).toContain('<body data-round="0">')
    expect(run.callsFor('react-engineer')[0].userPrompt).toContain('<body data-round="0">')
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.trace.dir).toMatch(/^build-\d+$/)
  })
})

/**
 * A `captureHtmlFileScreenshot` result carrying the numbers the critic reads
 * and the round picker scores. The image bytes name their round, so an
 * archived screenshot shows which round's page it came from.
 */
function capture(round, canvas, colour, hero) {
  return {
    png: Buffer.from(`png:round-${round}`),
    jpeg: Buffer.from(`jpeg:round-${round}`),
    headerJpeg: Buffer.from(`jpeg:round-${round}-header`),
    mobileJpeg: Buffer.from(`jpeg:round-${round}-360`),
    measured: { canvas_utilization: canvas, color_coverage: colour, hero_px: hero },
  }
}

/** Three REVISE verdicts, so the loop runs out of rounds without an approval. */
const REVISE_THREE_TIMES = [
  mockupCriticReply('REVISE', 'Round 0 is not there yet.'),
  mockupCriticReply('REVISE', 'Round 1 is not there yet.'),
  mockupCriticReply('REVISE', 'Round 2 is not there yet.'),
]

const shippedStep = (run) => run.trace.steps.find((s) => s.name === 'mockup-round-shipped')

describe('the mockup revision loop (#573)', () => {
  // The recorded Art Director declares canvas >= 85, colour >= 40 and a hero
  // of clamp(64px, 8.5vw, 136px), which is 122.4px at 1440.
  it('hands each revision the page the critic just reviewed', async () => {
    const run = await runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0), mockupRound(1), mockupRound(2)],
        'mockup-critic': REVISE_THREE_TIMES,
      },
    })

    expect(run.error).toBeNull()
    const [first, second, third] = run.callsFor('mockup-designer').map((c) => c.userPrompt)
    const section = (n) =>
      `## PREVIOUS MOCKUP — the page the critic reviewed; revise this file, do not start over\n\n\`\`\`html\n${mockupHtmlOf(n)}\n\`\`\``
    expect(first).not.toContain('## PREVIOUS MOCKUP')
    expect(second).toContain(section(0))
    expect(second).not.toContain('data-round="1"')
    expect(third).toContain(section(1))
    expect(third).not.toContain('data-round="0"')
  })

  it('keeps the previous mockup in the prompt when the designer is retried inside a revision round', async () => {
    const scriptTagError = 'mockup.html contains a <script> tag — the mockup must be JS-free'
    const rejected = fixtureFor('mockup-designer').replace('<body>', '<body><script>x</script>')
    const run = await runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0), rejected, mockupRound(1)],
        'mockup-critic': [
          mockupCriticReply('REVISE', 'Round 0 is not there yet.'),
          mockupCriticReply('APPROVE', 'Lands it.'),
        ],
      },
    })

    expect(run.error).toBeNull()
    const designer = run.callsFor('mockup-designer')
    expect(designer).toHaveLength(3)
    expect(designer[2].userPrompt).toContain(
      `Your previous mockup failed validation: ${scriptTagError}`
    )
    expect(designer[2].userPrompt).toContain(`\`\`\`html\n${mockupHtmlOf(0)}\n\`\`\``)
  })

  it('adds only the previous mockup and the feedback to the first-round prompt', async () => {
    const run = await runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0), mockupRound(1)],
        'mockup-critic': [
          mockupCriticReply('REVISE', 'Hero phrase renders at 48px.'),
          mockupCriticReply('APPROVE', 'Lands it.'),
        ],
      },
    })

    const [first, second] = run.callsFor('mockup-designer').map((c) => c.userPrompt)
    expect(second.startsWith(first)).toBe(true)
    const added = second.slice(first.length).replaceAll(run.root, '<root>')
    await expect(added).toMatchFileSnapshot('./__snapshots__/swarm-mockup-revision.snap')
  })

  it('ships the round with the smallest shortfall when the critic never approves', async () => {
    const run = await runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0), mockupRound(1), mockupRound(2)],
        'mockup-critic': REVISE_THREE_TIMES,
      },
      mockupCapture: [capture(0, 90, 50, 122), capture(1, 60, 50, 122), capture(2, 40, 50, 122)],
    })

    expect(run.error).toBeNull()
    expect(run.callsFor('mockup-designer')).toHaveLength(3)

    // Round 0 is what the engineer builds from, what sits on disk and what is archived.
    expect(read(run.root, 'signals/today.mockup.html')).toContain('<body data-round="0">')
    expect(run.callsFor('react-engineer')[0].userPrompt).toContain('<body data-round="0">')
    expect(run.callsFor('react-engineer')[0].userPrompt).not.toContain('data-round="2"')
    const artifacts = run.fakes.archive[0].artifacts
    expect(artifacts['mockup.html']).toContain('<body data-round="0">')
    expect(artifacts['mockup-screenshot.png'].toString()).toBe('png:round-0')
    expect(artifacts['mockup-screenshot-mobile.jpg'].toString()).toBe('jpeg:round-0-360')
    // Every round is still on the record.
    expect(JSON.parse(artifacts['mockup-measurables.json']).rounds.map((r) => r.round)).toEqual([
      0, 1, 2,
    ])

    const step = shippedStep(run)
    expect(step).toMatchObject({ phase: 2, input: { rounds: [0, 1, 2] } })
    expect(step.output).toMatchObject({ round: 0, latest: 2 })
    expect(step.output.shortfalls.map((s) => [s.round, s.total])).toEqual([
      [0, 0.3],
      [1, 25.3],
      [2, 45.3],
    ])
    expect(step.output.reason).toContain('round 0 misses its floors by 0.3 points against 45.3')
  })

  it('ships the last round when it measured best, and says so', async () => {
    const run = await runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0), mockupRound(1), mockupRound(2)],
        'mockup-critic': REVISE_THREE_TIMES,
      },
      mockupCapture: [capture(0, 40, 50, 122), capture(1, 60, 50, 122), capture(2, 80, 50, 122)],
    })

    expect(run.error).toBeNull()
    expect(read(run.root, 'signals/today.mockup.html')).toContain('<body data-round="2">')
    expect(run.callsFor('react-engineer')[0].userPrompt).toContain('<body data-round="2">')
    expect(run.fakes.archive[0].artifacts['mockup-screenshot.png'].toString()).toBe('png:round-2')
    expect(shippedStep(run).output).toMatchObject({ round: 2, latest: 2 })
  })

  it('ships the approved round even when an earlier one measured better', async () => {
    const run = await runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0), mockupRound(1), mockupRound(2)],
        'mockup-critic': [
          mockupCriticReply('REVISE', 'Round 0 is not there yet.'),
          mockupCriticReply('REVISE', 'Round 1 is not there yet.'),
          mockupCriticReply('APPROVE', 'Lands it.'),
        ],
      },
      mockupCapture: [capture(0, 95, 50, 122), capture(1, 60, 50, 122), capture(2, 70, 50, 122)],
    })

    expect(run.error).toBeNull()
    expect(read(run.root, 'signals/today.mockup.html')).toContain('<body data-round="2">')
    expect(run.fakes.archive[0].artifacts['mockup-screenshot.png'].toString()).toBe('png:round-2')
    expect(shippedStep(run)).toBeUndefined()
  })

  it('ships the last round, unchanged, when no round was measured', async () => {
    const run = await runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0), mockupRound(1), mockupRound(2)],
        'mockup-critic': REVISE_THREE_TIMES,
      },
    })

    expect(run.error).toBeNull()
    expect(read(run.root, 'signals/today.mockup.html')).toContain('<body data-round="2">')
    expect(shippedStep(run)).toBeUndefined()
  })

  it('does not pick a round on a malformed critic reply', async () => {
    const run = await runSwarm({
      agents: {
        'mockup-designer': [mockupRound(0)],
        'mockup-critic': ['Looks fine to me, ship it.'],
      },
      mockupCapture: [capture(0, 10, 10, 10)],
    })

    expect(run.error).toBeNull()
    expect(shippedStep(run)).toBeUndefined()
    expect(read(run.root, 'signals/today.mockup.html')).toContain('<body data-round="0">')
  })
})

describe('the Art Director retry', () => {
  it('retries once with the failure in the prompt and then completes', async () => {
    const run = await runSwarm({
      agents: {
        'art-director': [
          new Error('claude exited 1 before any output'),
          fixtureFor('art-director'),
        ],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual(['art-director', ...HAPPY_CALLS])

    const director = run.callsFor('art-director')
    expect(director[0].userPrompt).not.toContain('## Previous attempt was rejected')
    expect(director[1].userPrompt).toContain(
      '## Previous attempt was rejected\n\nYour previous response failed validation: claude exited 1 before any output\nEmit ALL required blocks with exact delimiters and exact field formats this time.'
    )
    expect(director[1].systemPrompt).toBe(director[0].systemPrompt)

    expect(run.retries).toBe(1)
    expect(run.fakes.restore).toEqual([])
    expect(run.fakes.cleanupOrphans).toEqual([])
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.trace.dir).toMatch(/^build-\d+$/)
    expect(run.trace.steps.map((s) => s.name)).toContain('art-director')
    for (const rel of ['elements/preset.ts', ...REQUIRED_ENGINEER_FILES]) {
      expect(existsSync(under(run.root, rel)), `${rel} under the root`).toBe(true)
    }
  })

  it('restores the original backup and throws after the second failure', async () => {
    let seededPreset = ''
    const run = await runSwarm({
      agents: {
        'art-director': [new Error('first stall'), new Error('second stall')],
      },
      beforeRun: (root) => {
        seededPreset = read(root, 'elements/preset.ts')
      },
    })

    expect(run.result).toBeNull()
    expect(run.error.message).toMatch(/^Art Director failed after retry: second stall/)
    expect(run.calls.map((c) => c.agent)).toEqual(['art-director', 'art-director'])
    expect(run.retries).toBe(1)

    expect(restored(run)).toEqual([{ paths: MUTABLE_FILES, root: run.root }])
    expect(run.fakes.cleanupOrphans).toEqual([])

    // Nothing was written before the throw, and the restore leaves the seed as it was.
    expect(read(run.root, 'elements/preset.ts')).toBe(seededPreset)
    for (const rel of [
      'elements/chassis-preset.ts',
      'app/routes/__root.tsx',
      'app/components/BrandLockup.tsx',
      'signals/today.mockup.html',
      ...REQUIRED_ENGINEER_FILES,
    ]) {
      expect(existsSync(under(run.root, rel)), `${rel} under the root`).toBe(false)
    }

    expect(run.fakes.archive).toHaveLength(0)
    expect(run.verdicts).toBeNull()
    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    expect(run.trace.steps.map((s) => s.name)).not.toContain('art-director')
    expect(read(run.root, `archive/${run.date}/${run.trace.dir}/error.txt`)).toMatch(
      /^Art Director failed after retry: second stall/
    )
  })
  it('fails fast on a dead model: one call, the original restored, no retry (#432)', async () => {
    const dead = new ModelTransportError({
      agent: 'art-director',
      channel: 'cli',
      emptyReply: true,
    })
    const run = await runSwarm({ agents: { 'art-director': [dead, dead] } })

    expect(run.result).toBeNull()
    expect(run.error.message).toMatch(
      /^Art Director failed: no response from the model — no response from the model for art-director \(cli, empty reply\)/
    )
    // The August nights spent a second call on the same dead API; this one does not.
    expect(run.calls.map((c) => c.agent)).toEqual(['art-director'])
    expect(run.retries).toBe(0)
    expect(restored(run)).toEqual([{ paths: MUTABLE_FILES, root: run.root }])
    expect(run.fakes.archive).toHaveLength(0)
    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    expect(read(run.root, `archive/${run.date}/${run.trace.dir}/error.txt`)).toMatch(
      /^Art Director failed: no response from the model/
    )
  })
})

describe('the mockup designer retry', () => {
  const scriptTagError = 'mockup.html contains a <script> tag — the mockup must be JS-free'
  /** The fixture with a `<script>` planted inside `===FILE:mockup.html===`. */
  const rejectedMockup = () =>
    fixtureFor('mockup-designer').replace('<body>', '<body><script>alert(1)</script>')

  it('retries once with the failure in the prompt and then ships', async () => {
    const run = await runSwarm({
      agents: {
        'mockup-designer': [rejectedMockup(), fixtureFor('mockup-designer')],
      },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
    ])

    const designer = run.callsFor('mockup-designer')
    expect(designer).toHaveLength(2)
    expect(designer[0].userPrompt).not.toContain('Your previous mockup failed validation')
    expect(designer[1].userPrompt).toContain(
      `Your previous mockup failed validation: ${scriptTagError}`
    )
    expect(designer[1].systemPrompt).toBe(designer[0].systemPrompt)

    expect(run.retries).toBe(1)
    expect(run.fakes.restore).toEqual([])
    expect(run.fakes.archive).toHaveLength(1)

    const rejected = run.trace.steps.filter((s) => s.name === 'mockup-designer-rejected')
    expect(rejected).toHaveLength(1)
    expect(rejected[0]).toMatchObject({ phase: 2, input: { round: 0 } })
    expect(rejected[0].output.error).toBe(scriptTagError)
  })

  it('restores the original backup and throws after the second failure', async () => {
    let seededPreset = ''
    const run = await runSwarm({
      agents: { 'mockup-designer': [rejectedMockup(), rejectedMockup()] },
      beforeRun: (root) => {
        seededPreset = read(root, 'elements/preset.ts')
      },
    })

    expect(run.result).toBeNull()
    expect(run.error.message).toBe(`Mockup Designer failed after retry: ${scriptTagError}`)
    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'spec-critic',
      'mockup-designer',
      'mockup-designer',
    ])
    expect(run.retries).toBe(1)

    expect(restored(run)).toEqual([{ paths: MUTABLE_FILES, root: run.root }])
    expect(run.fakes.cleanupOrphans).toEqual([])
    expect(read(run.root, 'elements/preset.ts')).toBe(seededPreset)

    expect(run.fakes.archive).toHaveLength(0)
    expect(run.verdicts).toBeNull()
    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    expect(read(run.root, `archive/${run.date}/${run.trace.dir}/error.txt`)).toMatch(
      /^Mockup Designer failed after retry: mockup\.html contains a <script> tag/
    )
  })
})

describe('the codegen retry', () => {
  const codegenError = "PandaCSS: token path 'colors.gold.550' is not defined in the preset"

  it('re-runs the Art Director with the codegen error and regenerates the chassis files', async () => {
    const retryReply = fixtureFor('art-director').replace(
      'Select a busy man.',
      'Select a busier man.'
    )
    const run = await runSwarm({
      agents: { 'art-director': [fixtureFor('art-director'), retryReply] },
      codegen: [{ status: 1, stderr: codegenError }, { status: 0 }],
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual(['art-director', ...HAPPY_CALLS])

    const director = run.callsFor('art-director')
    expect(director[0].userPrompt).not.toContain('## Previous attempt failed codegen')
    expect(director[1].userPrompt).toContain(
      `## Previous attempt failed codegen\n\n${codegenError}`
    )

    expect(run.fakes.spawnSync).toEqual([
      { cmd: 'pnpm', args: ['panda', 'codegen'], cwd: run.root },
      { cmd: 'pnpm', args: ['panda', 'codegen'], cwd: run.root },
    ])
    // preset.ts alone is rolled back before the retry; the full backup is never used.
    expect(restored(run)).toEqual([{ paths: ['elements/preset.ts'], root: run.root }])
    expect(run.fakes.cleanupOrphans).toEqual([])
    expect(run.retries).toBe(1)

    // The three files a retry can move were formatted twice before the
    // archive's final __root.tsx refresh, and the root on disk carries the
    // retry's hero copy. The callout takes only the date and the archive
    // count, and WhitePaper.tsx takes nothing at all, so each is written once.
    expect(run.fakes.formatGeneratedFile.map((f) => f.relPath)).toEqual([
      'app/routes/__root.tsx',
      'app/components/BrandLockup.tsx',
      'app/components/Material.tsx',
      'app/components/SiteCallout.tsx',
      'app/components/WhitePaper.tsx',
      'app/routes/__root.tsx',
      'app/components/BrandLockup.tsx',
      'app/components/Material.tsx',
      'app/routes/__root.tsx',
    ])
    const rootTsx = read(run.root, 'app/routes/__root.tsx')
    expect(rootTsx).toContain('{ title: "Select a busier man." }')
    expect(rootTsx).not.toContain('"Select a busy man."')
    expect(existsSync(under(run.root, 'app/components/BrandLockup.tsx'))).toBe(true)
    expect(run.callsFor('spec-critic')[0].userPrompt).toContain(
      '## Hero Copy\n\nSelect a busier man.'
    )

    expect(run.fakes.archive).toHaveLength(1)
    expect(run.trace.dir).toMatch(/^build-\d+$/)
    for (const rel of ['elements/preset.ts', ...REQUIRED_ENGINEER_FILES]) {
      expect(existsSync(under(run.root, rel)), `${rel} under the root`).toBe(true)
    }
  })

  it('cleans up, restores and throws when codegen fails again after the retry', async () => {
    let seededPreset = ''
    const run = await runSwarm({
      codegen: [
        { status: 1, stderr: codegenError },
        { status: 1, stderr: `${codegenError} (still)` },
      ],
      beforeRun: (root) => {
        seededPreset = read(root, 'elements/preset.ts')
      },
    })

    expect(run.result).toBeNull()
    expect(run.error.message).toMatch(/^Codegen failed after Art Director retry: /)
    expect(run.error.message).toContain(`${codegenError} (still)`)
    expect(run.calls.map((c) => c.agent)).toEqual(['art-director', 'art-director'])
    expect(run.fakes.spawnSync).toHaveLength(2)
    expect(run.retries).toBe(1)

    expect(restored(run)).toEqual([
      { paths: ['elements/preset.ts'], root: run.root },
      { paths: MUTABLE_FILES, root: run.root },
    ])
    expect(cleaned(run)).toEqual([
      {
        written: [
          'elements/preset.ts',
          'elements/chassis-preset.ts',
          'app/routes/__root.tsx',
          'app/components/BrandLockup.tsx',
          'app/components/Material.tsx',
          'app/components/SiteCallout.tsx',
          'app/components/WhitePaper.tsx',
        ],
        root: run.root,
      },
    ])

    // The seed is back and the five generated files are gone: all six are
    // in MUTABLE_FILES, so restore deletes what did not exist before.
    expect(read(run.root, 'elements/preset.ts')).toBe(seededPreset)
    for (const rel of [
      'elements/chassis-preset.ts',
      'app/routes/__root.tsx',
      'app/components/BrandLockup.tsx',
      'app/components/Material.tsx',
      'app/components/SiteCallout.tsx',
      'app/components/WhitePaper.tsx',
      'signals/today.mockup.html',
      ...REQUIRED_ENGINEER_FILES,
    ]) {
      expect(existsSync(under(run.root, rel)), `${rel} under the root`).toBe(false)
    }

    expect(run.fakes.archive).toHaveLength(0)
    expect(run.verdicts).toBeNull()
    expect(run.trace.dir).toMatch(/^build-failed-\d+$/)
    expect(run.trace.steps.map((s) => s.name)).toContain('art-director')
    expect(run.trace.steps.map((s) => s.name)).not.toContain('spec-critic')
    expect(read(run.root, `archive/${run.date}/${run.trace.dir}/error.txt`)).toMatch(
      /^Codegen failed after Art Director retry: /
    )
  })
})

describe('the spec critic gate', () => {
  it('logs a REVISE into verdicts and carries on unchanged', async () => {
    const reason = 'The spec names gold #C9A227 but preset.ts declares gold.500 as #D4AF37.'
    const run = await runSwarm({
      agents: { 'spec-critic': [`===VERDICT===\nREVISE\n\n${reason}\n===END===`] },
    })

    expect(run.error).toBeNull()
    expect(run.calls.map((c) => c.agent)).toEqual(HAPPY_CALLS)
    expect(run.retries).toBe(0)
    expect(run.fakes.restore).toEqual([])

    expect(run.verdicts[0]).toMatchObject({ critic: 'spec-critic', verdict: 'REVISE' })
    expect(run.verdicts[0].feedback).toContain(reason)
    expect(run.verdicts.map(({ critic, round, verdict }) => ({ critic, round, verdict }))).toEqual([
      { critic: 'spec-critic', round: undefined, verdict: 'REVISE' },
      { critic: 'mockup-critic', round: 0, verdict: 'APPROVE' },
      { critic: 'surface-gate', round: 1, verdict: 'SHIP' },
      { critic: 'screenshot-critic', round: undefined, verdict: 'SHIP' },
    ])
    const specStep = run.trace.steps.find((s) => s.name === 'spec-critic')
    expect(specStep.output.verdict).toBe('REVISE')
    expect(specStep.output.feedback).toContain(reason)

    // The Art Director's preset ships as written; no second Art Director call.
    expect(run.callsFor('art-director')).toHaveLength(1)
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.result.files.map((f) => f.path)).toContain('elements/preset.ts')
    expect(run.trace.dir).toMatch(/^build-\d+$/)
  })
})
