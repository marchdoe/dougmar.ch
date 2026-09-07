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
  serializeCalls,
} from './swarm-harness.js'

vi.mock('../../scripts/utils/claude-cli.js', (o) => m['scripts/utils/claude-cli.js'](o))
vi.mock('../../scripts/utils/vision-router.js', (o) => m['scripts/utils/vision-router.js'](o))
vi.mock('../../scripts/utils/build-validator.js', (o) => m['scripts/utils/build-validator.js'](o))
vi.mock('../../scripts/utils/snapshot.js', (o) => m['scripts/utils/snapshot.js'](o))
vi.mock('../../scripts/utils/surface-gate.js', (o) => m['scripts/utils/surface-gate.js'](o))
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
      'spec-critic',
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
    // a nine-key composition tuple.
    const artifacts = run.fakes.archive[0].artifacts
    const composition = JSON.parse(artifacts['composition.json'])
    expect(Object.keys(composition)).toHaveLength(9)
    expect(composition.collapse).toBe('split-to-sequence')
    const mobile = JSON.parse(artifacts['mobile.json'])
    expect(mobile).toMatchObject({ hero_step_360: 'hero' })
    expect(mobile.order.split(',')[0].trim()).toBe('gold thesis field')
    expect(mobile.carrier).toMatch(/gold thesis field/)
    // Every downstream agent received the declaration.
    for (const agent of [
      'spec-critic',
      'mockup-designer',
      'mockup-critic',
      'react-engineer',
      'screenshot-critic',
    ]) {
      expect(run.callsFor(agent)[0].userPrompt, agent).toContain('## Mobile Declaration')
      expect(run.callsFor(agent)[0].userPrompt, agent).toContain('hero_step_360: hero')
    }

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
      { critic: 'spec-critic', round: undefined, verdict: 'APPROVED', channel: undefined },
      { critic: 'mockup-critic', round: 0, verdict: 'APPROVE', channel: 'sdk-vision' },
      { critic: 'surface-gate', round: 1, verdict: 'SHIP', channel: undefined },
      { critic: 'screenshot-critic', round: undefined, verdict: 'SHIP', channel: 'sdk-vision' },
    ])

    // Nothing reached the real checkout.
    expect(statSync(realPreset).mtimeMs).toBe(presetBefore)
    expect(existsSync(realMockup) ? statSync(realMockup).mtimeMs : null).toBe(mockupBefore)
    expect(existsSync(path.join(REPO, 'archive', '2026-08-31'))).toBe(false)
  })

  it('asks every agent the same thing, in the same order, with the same budgets', async () => {
    const run = await runSwarm()
    expect(run.error).toBeNull()
    const serialized = serializeCalls(run.calls, run.root)
    expect(serialized).not.toContain(run.root)
    await expect(serialized).toMatchFileSnapshot('./__snapshots__/swarm-calls.snap')
  })

  it('records the phases in the trace, in order', async () => {
    const run = await runSwarm()
    expect(run.error).toBeNull()
    const names = run.trace.steps.map((s) => s.name)
    const expected = [
      'art-director',
      'spec-critic',
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
})
