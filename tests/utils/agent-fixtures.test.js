import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

/**
 * FIXTURE_DIR is resolved from ROOT at import time, so each test file needs
 * its own module instance pointed at a temp root.
 */
async function loadWithRoot(root) {
  vi.resetModules()
  vi.doMock('../../scripts/utils/file-manager.js', () => ({ ROOT: root }))
  return await import('../../scripts/utils/agent-fixtures.js')
}

function seed(root, agent, index, body) {
  const dir = path.join(root, 'fixtures', 'agents', agent)
  mkdirSync(dir, { recursive: true })
  writeFileSync(path.join(dir, `${String(index).padStart(2, '0')}.txt`), body, 'utf8')
}

describe('agent fixtures', () => {
  let root
  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'fixtures-'))
    // These tests exercise both sides of the Actions guard, so neither may
    // read whatever the runner happens to have set. Ambient GITHUB_ACTIONS is
    // exactly what made this suite pass locally and fail in CI.
    vi.stubEnv('GITHUB_ACTIONS', '')
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
    vi.unstubAllEnvs()
    vi.doUnmock('../../scripts/utils/file-manager.js')
  })

  it('serves recorded responses in call order, not the same one twice', async () => {
    const m = await loadWithRoot(root)
    seed(root, 'react-engineer', 0, 'first attempt')
    seed(root, 'react-engineer', 1, 'after the stall retry')

    expect(m.nextFixture('react-engineer')).toBe('first attempt')
    expect(m.nextFixture('react-engineer')).toBe('after the stall retry')
  })

  it('counts each agent separately', async () => {
    const m = await loadWithRoot(root)
    seed(root, 'art-director', 0, 'AD')
    seed(root, 'mockup-critic', 0, 'CRITIC')

    expect(m.nextFixture('art-director')).toBe('AD')
    expect(m.nextFixture('mockup-critic')).toBe('CRITIC')
  })

  it('replays the last recording when a run makes more calls than were recorded', async () => {
    const m = await loadWithRoot(root)
    seed(root, 'react-engineer', 0, 'only one recorded')
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})

    m.nextFixture('react-engineer')
    // A refactor that adds a retry should not kill the harness — but the
    // reuse has to be visible, or a replay looks more faithful than it is.
    expect(m.nextFixture('react-engineer')).toBe('only one recorded')
    expect(log.mock.calls.flat().join(' ')).toContain('replaying 0 again')
    log.mockRestore()
  })

  it('names the missing path and how to create it when an agent has none', async () => {
    const m = await loadWithRoot(root)
    expect(() => m.nextFixture('mockup-designer')).toThrow(/no fixtures for "mockup-designer"/)
    expect(() => m.nextFixture('mockup-designer')).toThrow(/build-fixtures-from-archive/)
  })

  it('records real responses to the next free index', async () => {
    const m = await loadWithRoot(root)
    vi.spyOn(console, 'log').mockImplementation(() => {})
    m.recordFixture('art-director', 'response one')
    m.recordFixture('art-director', 'response two')

    expect(readFileSync(m.fixturePath('art-director', 0), 'utf8')).toBe('response one')
    expect(readFileSync(m.fixturePath('art-director', 1), 'utf8')).toBe('response two')
  })

  it('refuses to replay or record inside GitHub Actions', async () => {
    const m = await loadWithRoot(root)
    vi.stubEnv('GITHUB_ACTIONS', 'true')

    vi.stubEnv('MOCK_MODE', 'true')
    // A mocked nightly would commit and publish a design no agent produced,
    // and every downstream gate would pass, because the fixtures came from a
    // run that passed.
    expect(() => m.assertNotAutomated()).toThrow(/would publish a design no agent produced/)

    vi.stubEnv('MOCK_MODE', '')
    vi.stubEnv('RECORD_FIXTURES', 'true')
    expect(() => m.assertNotAutomated()).toThrow(/Record fixtures locally/)
  })

  it('is inert outside GitHub Actions', async () => {
    const m = await loadWithRoot(root)
    vi.stubEnv('GITHUB_ACTIONS', '')
    vi.stubEnv('MOCK_MODE', 'true')
    expect(() => m.assertNotAutomated()).not.toThrow()
  })

  it('treats any value other than the exact string "true" as off', async () => {
    const m = await loadWithRoot(root)
    vi.stubEnv('MOCK_MODE', '1')
    expect(m.isMockMode()).toBe(false)
    vi.stubEnv('MOCK_MODE', 'true')
    expect(m.isMockMode()).toBe(true)
  })

  it('resetFixtureCounts lets one process replay a run twice', async () => {
    const m = await loadWithRoot(root)
    seed(root, 'art-director', 0, 'AD')
    seed(root, 'art-director', 1, 'AD retry')
    m.nextFixture('art-director')
    m.resetFixtureCounts()
    expect(m.nextFixture('art-director')).toBe('AD')
  })

  it('ignores non-fixture files in an agent directory', async () => {
    const m = await loadWithRoot(root)
    seed(root, 'art-director', 0, 'AD')
    writeFileSync(path.join(root, 'fixtures', 'agents', 'art-director', 'README.md'), 'notes')
    expect(m.nextFixture('art-director')).toBe('AD')
    expect(existsSync(m.fixturePath('art-director', 0))).toBe(true)
  })
})
