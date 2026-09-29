/**
 * The replay tool (spec 11 1e) runs keyless, so its mockup critic must see the
 * screenshots through the CLI's Read path (1d) and say so: channel
 * `cli-vision`, not `cli-text-no-key`. Driven through the environment
 * replayEnv builds and the real runMockupCritic, with only the CLI spawn
 * faked. No model call.
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

const cliMock = vi.fn()
vi.mock('../../scripts/utils/claude-cli.js', () => ({ callClaudeCLI: cliMock }))

const { replayEnv } = await import('../../scripts/replay-mockup.js')
const { runMockupCritic } = await import('../../scripts/agents/mockup-critic.js')

const DESKTOP = Buffer.from([0xff, 0xd8, 0xff, 0x01])
const PHONE = Buffer.from([0xff, 0xd8, 0xff, 0x02])

describe('a replay night reaches the mockup critic with its images', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    cliMock.mockReset()
  })

  it('reports cli-vision and hands the CLI both screenshots as files', async () => {
    // A key in the caller's shell is exactly what replayEnv strips.
    const env = replayEnv(
      { ANTHROPIC_API_KEY: 'sk-ant-should-be-dropped', PATH: process.env.PATH },
      { model: 'opus-4-8', weights: null }
    )
    expect(env).not.toHaveProperty('ANTHROPIC_API_KEY')
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    vi.stubEnv('MOCK_MODE', env.MOCK_MODE)
    vi.stubEnv('GITHUB_ACTIONS', '')
    vi.stubEnv('PIPELINE_TIER', env.PIPELINE_TIER)
    vi.stubEnv('MODEL_OVERRIDE', env.MODEL_OVERRIDE)

    let seen = null
    cliMock.mockImplementation(async (_agent, _sys, prompt, opts) => {
      const files = [...prompt.matchAll(/\[Image \d: ([^\]]+)\]/g)].map((m) => m[1])
      seen = { files, bytes: files.map((f) => readFileSync(f)), opts }
      return '===VERDICT===\nAPPROVE\n===FEEDBACK===\nfine\n===END==='
    })

    const result = await runMockupCritic({
      systemPrompt: 'sys',
      screenshotBuffer: DESKTOP,
      mobileScreenshot: PHONE,
      enrichedBrief: 'brief',
      measurables: 'floors',
      shell: 'shell',
      purpose: 'first',
    })

    expect(result).toMatchObject({ verdict: 'APPROVE', channel: 'cli-vision' })
    expect(seen.bytes).toEqual([DESKTOP, PHONE])
    expect(seen.files.every((f) => path.dirname(f) === seen.opts.readableDir)).toBe(true)
    // The override moves the Art Director and designer only; the critic keeps prod.
    expect(seen.opts).toMatchObject({ channel: 'cli-vision', model: 'claude-opus-5-5' })
    expect(existsSync(seen.opts.readableDir)).toBe(false)
  })
})
