/**
 * The swarm, run for real against a temp root (#221).
 *
 * The model calls are scripted from `fixtures/agents/<agent>/00.txt`; the
 * process spawns and browser captures are faked; everything else is the code
 * the nightly runs. The prompt snapshot is the quality lock: after the split
 * it must match byte for byte.
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import {
  REQUIRED_ENGINEER_FILES,
  mockFactories as m,
  runSwarm,
  serializeCall,
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

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

describe('runAgentSwarm on the recorded night', () => {
  it('ships the fixtures end to end and leaves the checkout alone', async () => {
    const realPreset = path.join(REPO, 'elements', 'preset.ts')
    const realMockup = path.join(REPO, 'signals', 'today.mockup.html')
    const presetBefore = statSync(realPreset).mtimeMs
    const mockupBefore = existsSync(realMockup) ? statSync(realMockup).mtimeMs : null

    const run = await runSwarm()

    expect(run.error).toBeNull()
    expect(run.result).toMatchObject({
      rationale: 'Agent swarm redesign',
      design_brief: 'Multi-agent redesign',
    })
    // The preset, then the engineer's seven blocks in fixture order. The
    // fixture's Ledger.tsx is an extra the engineer invented; writeFiles
    // allows it and it ships with the six required files.
    expect(run.result.files.map((f) => f.path)).toEqual([
      'elements/preset.ts',
      'app/components/generated/Ledger.tsx',
      'app/components/Sidebar.tsx',
      'app/components/Layout.tsx',
      'app/routes/index.tsx',
      'app/routes/about.tsx',
      'app/routes/work.$slug.tsx',
      'app/routes/og.tsx',
    ])

    expect(run.calls.map((c) => c.agent)).toEqual([
      'art-director',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
    ])
    expect(run.retries).toBe(0)

    expect(run.fakes.archive).toHaveLength(1)
    expect(run.fakes.archive[0]).toMatchObject({
      date: '2026-08-31',
      options: { root: run.root },
      changedFiles: run.result.files.map((f) => f.path),
    })
    expect(run.trace.dir).toMatch(/^build-\d+$/)

    // The phone declaration (#452) is parsed, validated and archived beside
    // a ten-key composition tuple (#501 added hero_object).
    const artifacts = run.fakes.archive[0].artifacts
    const composition = JSON.parse(artifacts['composition.json'])
    expect(Object.keys(composition)).toHaveLength(10)
    expect(composition.collapse).toBe('split-to-sequence')
    expect(composition.hero_object).toBe('statement')
    const mobile = JSON.parse(artifacts['mobile.json'])
    expect(mobile).toMatchObject({ hero_step_360: 'hero' })
    expect(mobile.order.split(',')[0].trim()).toBe('gold thesis field')
    expect(mobile.carrier).toMatch(/gold thesis field/)
    // Every downstream agent received the declaration.
    for (const agent of [
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
    ]) {
      expect(run.callsFor(agent)[0].userPrompt, agent).toContain('## Mobile Declaration')
      expect(run.callsFor(agent)[0].userPrompt, agent).toContain('hero_step_360: hero')
    }
    // The type treatment (#502) is parsed, archived, and reaches every
    // downstream agent under one heading.
    expect(JSON.parse(artifacts['type-treatment.json'])).toEqual({
      case: 'caps',
      lead: 'roman',
      weight: 'heavy',
      alignment: 'left',
      texture: 'stacked',
    })
    for (const agent of [
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
    ]) {
      expect(run.callsFor(agent)[0].userPrompt, agent).toContain(
        '## Type Treatment (execute exactly)'
      )
      expect(run.callsFor(agent)[0].userPrompt, agent).toContain('texture: stacked')
    }

    // The motion declaration (#506) is parsed, archived, and reaches the
    // designer, the engineer and the screenshot critic. The fixture holds
    // still, so no strip was captured and none was archived.
    expect(JSON.parse(artifacts['motion.json'])).toEqual({
      entrance: 'none',
      ground: 'static',
      reveal: 'none',
    })
    expect(artifacts['motion-strip.jpg']).toBeNull()
    expect(run.fakes.captureScreenshot[0].motion).toEqual({
      entrance: 'none',
      ground: 'static',
      reveal: 'none',
    })
    for (const agent of ['mockup-designer', 'react-engineer', 'screenshot-critic']) {
      expect(run.callsFor(agent)[0].userPrompt, agent).toContain('## Motion')
      expect(run.callsFor(agent)[0].userPrompt, agent).toContain('entrance: none')
    }
    expect(run.callsFor('react-engineer')[0].userPrompt).not.toContain('## Motion Design Reference')

    for (const rel of [
      'elements/preset.ts',
      'elements/chassis-preset.ts',
      'app/routes/__root.tsx',
      'app/components/BrandLockup.tsx',
      'signals/today.mockup.html',
      'signals/today.brief.md',
      ...REQUIRED_ENGINEER_FILES,
    ]) {
      expect(existsSync(path.join(run.root, rel)), `${rel} under the root`).toBe(true)
    }
    expect(readFileSync(path.join(run.root, 'elements', 'preset.ts'), 'utf8')).toContain(
      'definePreset'
    )

    expect(
      run.verdicts.map(({ critic, round, verdict, channel }) => ({
        critic,
        round,
        verdict,
        channel,
      }))
    ).toEqual([
      { critic: 'mockup-critic', round: 0, verdict: 'APPROVE', channel: 'sdk-vision' },
      { critic: 'surface-gate', round: 1, verdict: 'SHIP', channel: undefined },
      { critic: 'screenshot-critic', round: undefined, verdict: 'SHIP', channel: 'sdk-vision' },
    ])

    // Nothing reached the real checkout.
    expect(statSync(realPreset).mtimeMs).toBe(presetBefore)
    expect(existsSync(realMockup) ? statSync(realMockup).mtimeMs : null).toBe(mockupBefore)
    expect(existsSync(path.join(REPO, 'archive', '2026-08-31'))).toBe(false)
  })

  it('never re-judges the build when no repair round ran (#467)', async () => {
    // The recorded night ships on the first screenshot-critic SHIP: no
    // surface-gate fault forces a revision and the critic never asks for
    // one, so there is no repair round to re-judge.
    const run = await runSwarm()
    expect(run.error).toBeNull()
    expect(run.retries).toBe(0)
    expect(run.calls.filter((c) => c.agent === 'screenshot-critic')).toHaveLength(1)
    expect(run.fakes.captureScreenshot).toHaveLength(1)
    expect(run.verdicts.some((v) => v.round === 'final')).toBe(false)
    expect(run.verdicts.some((v) => v.critic === 'ship-gate')).toBe(false)
  })

  it('asks every agent the same thing, in the same order, with the same budgets', async () => {
    const run = await runSwarm()
    expect(run.error).toBeNull()
    // One file per call, so a prompt change shows up as a diff in that
    // agent's file. The recorded night makes each agent exactly one call.
    for (const [i, call] of run.calls.entries()) {
      const serialized = serializeCall(call, i, run.root)
      expect(serialized).not.toContain(run.root)
      await expect(serialized).toMatchFileSnapshot(
        `./__snapshots__/swarm-calls/${String(i + 1).padStart(2, '0')}-${call.agent}.txt`
      )
    }
  })

  it('sends no unfilled {{PLACEHOLDER}} to any agent, the repair brief included', async () => {
    // A prompt file may carry a placeholder until its own replace runs, so
    // this reads what each model was handed, not the files. `build: [false,
    // true]` adds the repair call, whose brief is a template of its own.
    // Upper case only: the vendored impeccable references carry lower-case
    // `{{command_prefix}}`-style tokens from their upstream, and JSX in a
    // printed file has `{{` of its own.
    const run = await runSwarm({ build: [false, true] })
    expect(run.error).toBeNull()
    expect(run.callsFor('react-engineer').length).toBeGreaterThan(1)
    const unfilled = run.calls.flatMap((c) =>
      [
        ...`${c.systemPrompt ?? ''}\n${c.userPrompt ?? ''}`.matchAll(/\{\{[A-Z][A-Z0-9_]*\}\}/g),
      ].map((m) => `${c.agent}: ${m[0]}`)
    )
    expect(unfilled).toEqual([])
  })

  it('tells the engineer which content fields are empty, read from app/content under the root (#568)', async () => {
    // The seeded root carries a two-entry timeline with one empty role and
    // one empty description, so the list is the fixture's, not the owner's.
    // A repair call reuses the same system prompt.
    const run = await runSwarm({ build: [false, true] })
    expect(run.error).toBeNull()
    const [first, repair] = run.callsFor('react-engineer')
    for (const call of [first, repair]) {
      expect(call.systemPrompt).toContain('### Content fields that can be empty')
      expect(call.systemPrompt).toContain("- `timeline[].role` is '' in 1 of 2 entries")
      expect(call.systemPrompt).toContain("- `timeline[].description` is '' in 1 of 2 entries")
      expect(call.systemPrompt).not.toContain('`timeline[].company`')
      expect(call.systemPrompt).toContain('leave it out along with its separator')
    }
    // Only the engineer is told; no other agent writes a template.
    for (const agent of ['art-director', 'mockup-designer', 'screenshot-critic']) {
      expect(run.callsFor(agent)[0].systemPrompt).not.toContain('Content fields that can be empty')
    }
  })

  it('records the phases in the trace, in order', async () => {
    const run = await runSwarm()
    expect(run.error).toBeNull()
    const names = run.trace.steps.map((s) => s.name)
    const expected = [
      'art-director',
      'mockup-critic',
      'react-engineer',
      'build-validation',
      'surface-gate',
      'screenshot-critic',
    ]
    expect(names.filter((n) => expected.includes(n))).toEqual(expected)
  })

  it('writes a NEEDS-HUMAN verdict for a human-owned surface even when the critic ships (#468)', async () => {
    // `/work` is an authored route (ownerForSurface): no agent can fix it, so
    // this must not force a revision, and the default screenshot-critic
    // fixture answers SHIP. Before #468 the NEEDS-HUMAN record only ever
    // landed inside the REVISE-or-gateDemandsRevision branch, so this exact
    // combination — SHIP verdict, only a human-owned surface at fault — wrote
    // nothing at all.
    const run = await runSwarm({
      gate: [
        {
          findings: [
            {
              surface: '/work',
              viewport: 'mobile',
              width: 360,
              scheme: 'light',
              kind: 'overflow',
              severity: 'error',
              detail: 'document is 70px wider than the 360px viewport (scrollWidth 430)',
            },
          ],
          measured: 8,
          errorCount: 1,
        },
      ],
    })

    expect(run.error).toBeNull()
    expect(run.retries).toBe(0)

    const screenshotVerdict = run.verdicts.find((v) => v.critic === 'screenshot-critic')
    expect(screenshotVerdict.verdict).toBe('SHIP')

    const needsHuman = run.verdicts.find((v) => v.verdict === 'NEEDS-HUMAN')
    expect(needsHuman).toMatchObject({ critic: 'surface-gate', verdict: 'NEEDS-HUMAN' })
    expect(needsHuman.feedback).toContain('/work')
    expect(needsHuman.feedback).toContain('70px wider than the 360px viewport')
  })

  it('leaves a trace of a surface gate that threw, and still ships the build (#565)', async () => {
    const run = await runSwarm({ gate: [new Error('browser crashed')] })

    // Non-blocking, as before: the critic still ran and the night archived.
    expect(run.error).toBeNull()
    expect(run.callsFor('screenshot-critic')).toHaveLength(1)
    expect(run.fakes.archive).toHaveLength(1)

    // But a gate that measured nothing no longer reads like one that found
    // nothing: a verdict, a trace step and the record's artifact all say so.
    expect(run.verdicts.find((v) => v.critic === 'surface-gate')).toMatchObject({
      round: 1,
      verdict: 'GATE-FAILED',
      error: 'browser crashed',
    })
    const step = run.trace.steps.find((s) => s.name === 'surface-gate')
    expect(step.output).toEqual({ ran: false, error: 'browser crashed' })
    expect(JSON.parse(run.fakes.archive[0].artifacts['surface-gate.json'])).toEqual({
      ran: false,
      error: 'browser crashed',
      round: 1,
    })
  })

  it('sends the critic the whole first case study at 1440, and the phone density the gate measured (#569)', async () => {
    const facts = '## Measured phone density\n\n- / , 7 folds of 640px: 47% 26% 12%.'
    const run = await runSwarm({ gate: [{ findings: [], measured: 8, errorCount: 0, facts }] })
    expect(run.error).toBeNull()

    // One capture, of the first case study route the build lists.
    expect(run.fakes.captureRouteDesktopFilmstrip).toHaveLength(1)
    expect(run.fakes.captureRouteDesktopFilmstrip[0].route.startsWith('/work/')).toBe(true)

    const [critic] = run.callsFor('screenshot-critic')
    expect(critic.userPrompt).toContain('A desktop filmstrip of /work/')
    expect(critic.userPrompt).toContain('## Measured phone density')
    // The 1440 still of the case study that used to be captured here is the
    // filmstrip's first tile now; only the share card's capture is left.
    expect(run.fakes.captureRouteScreenshot.map((c) => c.route)).toEqual(['/og'])
    expect(critic.imageCount).toBeLessThanOrEqual(9)
  })

  it('still asks the critic when the desktop filmstrip cannot be captured (#569)', async () => {
    const run = await runSwarm({ desktopFilmstrip: [new Error('chromium died')] })
    expect(run.error).toBeNull()
    const [critic] = run.callsFor('screenshot-critic')
    expect(critic.userPrompt).not.toContain('A desktop filmstrip')
  })

  it('records a gate that measured as having run', async () => {
    const run = await runSwarm()
    expect(JSON.parse(run.fakes.archive[0].artifacts['surface-gate.json'])).toEqual({
      ran: true,
      error: null,
      round: null,
    })
  })
})
