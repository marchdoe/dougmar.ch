import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { EventEmitter } from 'node:events'
import path from 'node:path'
import { Readable, Writable } from 'node:stream'
import { spawn } from 'node:child_process'

// We need to mock child_process.spawn before importing claude-cli.js
// so the spawn call inside resolves to our fake child process. The source
// imports 'node:child_process', so that is the specifier mocked here —
// mocking bare 'child_process' only worked because vitest normalises the two.

const mockChildren = []

vi.mock('node:child_process', () => ({
  spawn: vi.fn(() => {
    const child = new EventEmitter()
    child.stdout = new EventEmitter()
    child.stderr = new EventEmitter()
    // stdin needs the Writable interface pipe() uses.
    child.stdin = new Writable({
      write(_chunk, _enc, cb) {
        cb()
      },
    })
    child.stdin.on('error', () => {})
    child.kill = vi.fn((signal) => {
      // Simulate a process that ignores SIGTERM but responds to SIGKILL
      if (signal === 'SIGKILL') {
        setImmediate(() => child.emit('close', null))
      }
    })
    mockChildren.push(child)
    return child
  }),
}))

// Also mock fs/promises writeFile/unlink since we don't want to actually
// write the temp prompt file
vi.mock('fs/promises', async () => {
  const actual = await vi.importActual('fs/promises')
  return {
    ...actual,
    writeFile: vi.fn(async () => {}),
    unlink: vi.fn(async () => {}),
  }
})

vi.mock('fs', async () => {
  const actual = await vi.importActual('fs')
  return {
    ...actual,
    createReadStream: vi.fn(() => {
      // Return a readable stream that emits nothing and ends immediately
      return Readable.from([])
    }),
  }
})

describe('claude-cli stall detection', () => {
  beforeEach(async () => {
    mockChildren.length = 0
    vi.useFakeTimers()
    const { resetLedger } = await import('../../scripts/utils/cost-ledger.js')
    resetLedger()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('rejects with /stalled/ when no content arrives within stallTimeoutMs', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')

    const promise = callClaudeCLI('test-agent', 'system', 'user prompt', {
      model: 'claude-sonnet-5',
      timeoutMs: 60 * 60 * 1000, // 1 hour — much longer than stall
      stallTimeoutMs: 1000, // 1 second stall timeout for the test
    })

    // Attach rejection handler immediately so unhandled rejection doesn't fail
    const rejected = promise.catch((err) => err)

    // Advance past the stall check interval (30s is default, but the stall
    // timeout itself is 1s — we need to trigger a check after that).
    // The stallCheck interval runs every 30s, so we need 30s+ of fake time.
    await vi.advanceTimersByTimeAsync(35000)

    // The first child should be killed by stall detection
    expect(mockChildren[0].kill).toHaveBeenCalled()

    // Wait for SIGKILL fallback (5s after SIGTERM) and close event
    await vi.advanceTimersByTimeAsync(6000)

    const err = await rejected
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toMatch(/stalled/)
    expect(err.message).toMatch(/test-agent/)

    // A stalled call still consumed real time (and, on a billed run, real
    // tokens) — it must show up in cost.json as unpriceable, not disappear.
    const { getUsageRecords } = await import('../../scripts/utils/cost-ledger.js')
    const [record] = getUsageRecords()
    expect(record.agent).toBe('test-agent')
    expect(record.cost_usd).toBeNull()
  })

  it('does NOT stall when content arrives periodically', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')

    const promise = callClaudeCLI('test-agent', 'system', 'user prompt', {
      model: 'claude-sonnet-5',
      timeoutMs: 60 * 60 * 1000,
      stallTimeoutMs: 10000, // 10s stall
    })

    const rejected = promise.catch((err) => err)

    // Wait for the spawn to happen
    await vi.advanceTimersByTimeAsync(10)
    const child = mockChildren[0]
    expect(child).toBeDefined()

    // Emit actual text content events at 5s intervals — under stall threshold
    for (let i = 0; i < 3; i++) {
      await vi.advanceTimersByTimeAsync(5000)
      const event = {
        type: 'assistant',
        message: { content: [{ type: 'text', text: 'content chunk' }] },
      }
      child.stdout.emit('data', Buffer.from(`${JSON.stringify(event)}\n`))
    }

    // At this point 15 seconds have passed but the content kept arriving.
    // Kill shouldn't have been called.
    expect(child.kill).not.toHaveBeenCalled()

    // Now stop emitting and let it stall
    await vi.advanceTimersByTimeAsync(40000)
    expect(child.kill).toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(6000)
    const err = await rejected
    expect(err.message).toMatch(/stalled/)
  })

  it('books the purpose of a call the stall check killed (#578)', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const { getUsageRecords } = await import('../../scripts/utils/cost-ledger.js')

    const rejected = callClaudeCLI('test-agent', 'system', 'user prompt', {
      model: 'claude-sonnet-5',
      timeoutMs: 60 * 60 * 1000,
      stallTimeoutMs: 1000,
      purpose: 'repair',
    }).catch((err) => err)
    await vi.advanceTimersByTimeAsync(35000)
    await vi.advanceTimersByTimeAsync(6000)
    await rejected

    expect(getUsageRecords().map((r) => r.purpose)).toEqual(['repair'])
  })

  it('books an unpriceable call when the hard timeout fires', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const { getUsageRecords } = await import('../../scripts/utils/cost-ledger.js')

    const promise = callClaudeCLI('timeout-agent', 'system', 'user prompt', {
      model: 'claude-sonnet-5',
      timeoutMs: 1000,
      stallTimeoutMs: 60 * 60 * 1000, // stall check must not fire first
    })
    const rejected = promise.catch((err) => err)

    await vi.advanceTimersByTimeAsync(1000) // trips the hard timeout
    await vi.advanceTimersByTimeAsync(6000) // SIGKILL fallback + close

    const err = await rejected
    expect(err.message).toMatch(/timed out/)

    const [record] = getUsageRecords()
    expect(record.agent).toBe('timeout-agent')
    expect(record.cost_usd).toBeNull()
  })

  it('books an unpriceable call, not a $0 one, when the process crashes with no result event', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const { getUsageRecords } = await import('../../scripts/utils/cost-ledger.js')
    const { ModelTransportError } = await import('../../scripts/utils/model-transport-error.js')

    const promise = callClaudeCLI('crash-agent', 'system', 'user prompt', {
      model: 'claude-sonnet-5',
      timeoutMs: 60 * 60 * 1000,
      stallTimeoutMs: 60 * 60 * 1000,
    })
    const rejected = promise.catch((err) => err)

    await vi.advanceTimersByTimeAsync(10)
    const child = mockChildren[0]
    child.stderr.emit('data', Buffer.from('fatal: bad auth config\n'))
    child.emit('close', 1)

    // A non-zero exit with no text at all and no result event (#432): the
    // model never answered, so this is a transport failure, not a malformed
    // response for a parser to reject.
    const err = await rejected
    expect(err).toBeInstanceOf(ModelTransportError)
    expect(err.transport).toBe(true)
    expect(err.agent).toBe('crash-agent')
    expect(err.channel).toBe('cli')
    expect(err.exitCode).toBe(1)
    expect(err.message).toMatch(/no response from the model for crash-agent \(cli, exit 1\)/)
    expect(err.message).toMatch(/fatal: bad auth config/)

    const [record] = getUsageRecords()
    expect(record.agent).toBe('crash-agent')
    // The bug this guards: an empty usage object must not price to $0 —
    // that would read as "this call was free" instead of "we don't know".
    expect(record.cost_usd).toBeNull()
    expect(record.estimated).toBe(false)
  })

  it('rejects with a ModelTransportError, named for the channel, when the CLI exits 0 with no text', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const { ModelTransportError } = await import('../../scripts/utils/model-transport-error.js')

    // #432: an out-of-credits API key returns exactly this shape — the
    // process exits clean and reports success, but the reply is empty.
    const promise = callClaudeCLI('empty-agent', 'system', 'user prompt', {
      model: 'claude-sonnet-5',
      timeoutMs: 60 * 60 * 1000,
      stallTimeoutMs: 60 * 60 * 1000,
    })
    const rejected = promise.catch((err) => err)

    await vi.advanceTimersByTimeAsync(10)
    const child = mockChildren[0]
    child.emit('close', 0)

    const err = await rejected
    expect(err).toBeInstanceOf(ModelTransportError)
    expect(err.transport).toBe(true)
    expect(err.emptyReply).toBe(true)
    expect(err.message).toBe('no response from the model for empty-agent (cli, empty reply)')
  })

  it('rejects the same way when the CLI exits 0 with a whitespace-only reply', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const { ModelTransportError } = await import('../../scripts/utils/model-transport-error.js')

    const promise = callClaudeCLI('whitespace-agent', 'system', 'user prompt', {
      model: 'claude-sonnet-5',
      timeoutMs: 60 * 60 * 1000,
      stallTimeoutMs: 60 * 60 * 1000,
    })
    const rejected = promise.catch((err) => err)

    await vi.advanceTimersByTimeAsync(10)
    const child = mockChildren[0]
    const event = {
      type: 'assistant',
      message: { content: [{ type: 'text', text: '   \n\t  ' }] },
    }
    child.stdout.emit('data', Buffer.from(`${JSON.stringify(event)}\n`))
    child.emit('close', 0)

    const err = await rejected
    expect(err).toBeInstanceOf(ModelTransportError)
    expect(err.emptyReply).toBe(true)
  })

  it('resolves normally when the CLI exits 0 with real text — unaffected by the transport check', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')

    const promise = callClaudeCLI('happy-agent', 'system', 'user prompt', {
      model: 'claude-sonnet-5',
      timeoutMs: 60 * 60 * 1000,
      stallTimeoutMs: 60 * 60 * 1000,
    })

    await vi.advanceTimersByTimeAsync(10)
    const child = mockChildren[0]
    const event = {
      type: 'assistant',
      message: { content: [{ type: 'text', text: 'a real response' }] },
    }
    child.stdout.emit('data', Buffer.from(`${JSON.stringify(event)}\n`))
    child.emit('close', 0)

    await expect(promise).resolves.toBe('a real response')
  })
})

describe('a finished process is not always a response (#300)', () => {
  beforeEach(async () => {
    mockChildren.length = 0
    vi.useFakeTimers()
    const { resetLedger } = await import('../../scripts/utils/cost-ledger.js')
    resetLedger()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('rejects a crash after partial streaming instead of resolving the fragment', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const promise = callClaudeCLI('partial-agent', 'system', 'user prompt', {
      model: 'claude-sonnet-5',
      timeoutMs: 60 * 60 * 1000,
      stallTimeoutMs: 60 * 60 * 1000,
    })
    const rejected = promise.catch((err) => err)
    await vi.advanceTimersByTimeAsync(10)
    const child = mockChildren[0]
    const event = {
      type: 'assistant',
      message: {
        content: [{ type: 'text', text: '===FILE:app/routes/index.tsx===\nexport function' }],
      },
    }
    child.stdout.emit('data', Buffer.from(`${JSON.stringify(event)}\n`))
    child.emit('close', 1)
    const err = await rejected
    expect(err.message).toMatch(/exited with code 1 after 0KB of partial output/)
  })

  it('rejects a result event flagged is_error even on a clean exit', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const promise = callClaudeCLI('error-agent', 'system', 'user prompt', {
      model: 'claude-sonnet-5',
      timeoutMs: 60 * 60 * 1000,
      stallTimeoutMs: 60 * 60 * 1000,
    })
    const rejected = promise.catch((err) => err)
    await vi.advanceTimersByTimeAsync(10)
    const child = mockChildren[0]
    const event = {
      type: 'result',
      subtype: 'error_max_turns',
      is_error: true,
      result: 'max turns reached',
    }
    child.stdout.emit('data', Buffer.from(`${JSON.stringify(event)}\n`))
    child.emit('close', 0)
    const err = await rejected
    expect(err.message).toMatch(/claude reported error_max_turns \(is_error\): max turns reached/)
  })
})

describe('default timeout relationships', () => {
  it('clamps the stall window below the hard timeout', async () => {
    // The defaults were timeoutMs 600000 and stallTimeoutMs 900000, so the
    // stall check could never fire before the timeout did — dead unless every
    // caller overrode it, and two call sites carry comments saying they had to.
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    expect(typeof callClaudeCLI).toBe('function')
    const src = await import('node:fs').then((fs) =>
      fs.readFileSync(new URL('../../scripts/utils/claude-cli.js', import.meta.url), 'utf8')
    )
    expect(src).toContain('Math.min(requestedStallMs, Math.floor(timeoutMs / 2))')
  })
})

describe('MOCK_MODE', () => {
  // `pnpm pipeline` and `pipeline:dry` both set MOCK_MODE=true, and nothing
  // honoured it — "the mock pipeline" spent real tokens (#220). It threw
  // after that, which was safe but left the swarm runnable only by paying.
  // It now replays a recorded response, and still refuses when there is
  // nothing recorded (#221).
  // GITHUB_ACTIONS is cleared as well as MOCK_MODE set: replaying is refused
  // inside Actions, so on a runner these two cases would assert against the
  // guard's message instead of the behaviour they are about.
  const withMock = async (fn) => {
    const prevMock = process.env.MOCK_MODE
    const prevCi = process.env.GITHUB_ACTIONS
    process.env.MOCK_MODE = 'true'
    delete process.env.GITHUB_ACTIONS
    try {
      return await fn()
    } finally {
      if (prevMock === undefined) delete process.env.MOCK_MODE
      else process.env.MOCK_MODE = prevMock
      if (prevCi === undefined) delete process.env.GITHUB_ACTIONS
      else process.env.GITHUB_ACTIONS = prevCi
    }
  }

  it('replays a recorded response instead of spawning the CLI', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const { resetFixtureCounts } = await import('../../scripts/utils/agent-fixtures.js')
    resetFixtureCounts()
    const result = await withMock(() =>
      callClaudeCLI('mockup-critic', 'sys', 'prompt', { model: 'claude-haiku-4-5' })
    )
    // The checked-in fixture for this agent is a critic verdict.
    expect(result).toContain('===VERDICT===')
    resetFixtureCounts()
  })

  it('still refuses rather than spending when an agent has no fixture', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    await expect(
      withMock(() => callClaudeCLI('no-such-agent', 'sys', 'prompt', { model: 'claude-haiku-4-5' }))
    ).rejects.toThrow(/no fixtures for "no-such-agent"/)
  })
})

describe('callClaudeCLI refuses an implicit model', () => {
  it('throws before spawning when no model ID is given', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    // The old default was the 'sonnet' alias, which a pinned CLI resolves to
    // whatever was current when that CLI version shipped.
    await expect(callClaudeCLI('some-agent', 'sys', 'prompt', {})).rejects.toThrow(
      /requires an explicit model ID/
    )
    await expect(callClaudeCLI('some-agent', 'sys', 'prompt', { model: 'sonnet' })).rejects.toThrow(
      /requires an explicit model ID/
    )
  })
})

describe('callClaudeCLI temp prompt file', () => {
  beforeEach(async () => {
    mockChildren.length = 0
    vi.useFakeTimers()
    const { resetLedger } = await import('../../scripts/utils/cost-ledger.js')
    resetLedger()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('gives each call its own file, even two for one agent, and removes both', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const { writeFile, unlink } = await import('node:fs/promises')
    const opts = { model: 'claude-sonnet-5', timeoutMs: 60 * 60 * 1000, stallTimeoutMs: 1000 }

    const first = callClaudeCLI('test-agent', 'system', 'first prompt', opts).catch((e) => e)
    const second = callClaudeCLI('test-agent', 'system', 'second prompt', opts).catch((e) => e)
    await vi.advanceTimersByTimeAsync(10)

    const written = writeFile.mock.calls
      .filter(([, content]) => content === 'first prompt' || content === 'second prompt')
      .map(([file, content]) => ({ file, content }))
    expect(written.map((w) => w.content).sort()).toEqual(['first prompt', 'second prompt'])
    expect(new Set(written.map((w) => w.file)).size).toBe(2)
    for (const { file } of written) {
      expect(path.basename(file)).toMatch(/^\.agent-prompt-test-agent-\d+-\d+\.tmp$/)
    }

    // Let both stall out; each removes the file it wrote.
    await vi.advanceTimersByTimeAsync(35000)
    await vi.advanceTimersByTimeAsync(6000)
    await Promise.all([first, second])
    const removed = unlink.mock.calls.map(([file]) => file)
    for (const { file } of written) expect(removed).toContain(file)
  })
})

// 2026-09-22: one-week Opus 5.5 trial for react-engineer (see models.js and
// budgets.js). effort reaches the CLI as a plain --effort flag; every other
// caller must see cliArgs unchanged.
describe('callClaudeCLI --effort flag', () => {
  beforeEach(() => {
    mockChildren.length = 0
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('passes --effort <level> right after --model when options.effort is set', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const promise = callClaudeCLI('react-engineer', 'system', 'user prompt', {
      model: 'claude-opus-5-5',
      effort: 'high',
      timeoutMs: 60 * 60 * 1000,
      stallTimeoutMs: 60 * 60 * 1000,
    }).catch(() => {})

    await vi.advanceTimersByTimeAsync(10)
    const cliArgs = spawn.mock.calls.at(-1)[1]
    const modelAt = cliArgs.indexOf('--model')
    expect(cliArgs.slice(modelAt, modelAt + 4)).toEqual([
      '--model',
      'claude-opus-5-5',
      '--effort',
      'high',
    ])

    mockChildren.at(-1).emit('close', 0)
    await promise
  })

  it('omits --effort entirely when the caller does not set it', async () => {
    const { callClaudeCLI } = await import('../../scripts/utils/claude-cli.js')
    const promise = callClaudeCLI('mockup-critic', 'system', 'user prompt', {
      model: 'claude-haiku-4-5',
      timeoutMs: 60 * 60 * 1000,
      stallTimeoutMs: 60 * 60 * 1000,
    }).catch(() => {})

    await vi.advanceTimersByTimeAsync(10)
    const cliArgs = spawn.mock.calls.at(-1)[1]
    expect(cliArgs).not.toContain('--effort')

    mockChildren.at(-1).emit('close', 0)
    await promise
  })
})
