/**
 * `withPreviewServer` starts `vite preview` on a random port. Without
 * `--strictPort` vite hops to the next free port when that one is taken, and
 * the readiness poll then waits its whole timeout on a port nothing listens
 * on. The surface gate reported "failed (non-blocking)" and the night shipped
 * ungated. These tests give it a fake vite that exits the way vite does with
 * `--strictPort` and check the helper starts again on another port.
 */
import { EventEmitter } from 'node:events'
import { createServer } from 'node:http'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { withPreviewServer } from '../../scripts/utils/snapshot.js'

const servers = []
afterEach(async () => {
  vi.restoreAllMocks()
  for (const s of servers.splice(0)) await new Promise((r) => s.close(r))
})

/** A live HTTP server that answers 200, and the port it got. */
async function listening() {
  const server = createServer((_req, res) => res.end('ok'))
  servers.push(server)
  await new Promise((r) => server.listen(0, () => r()))
  return server.address().port
}

/** A child process that has printed `stderr` and exited with `code` on the next tick. */
function exitingChild(code, stderr) {
  const child = new EventEmitter()
  child.stderr = new EventEmitter()
  setImmediate(() => {
    child.stderr.emit('data', Buffer.from(stderr))
    child.emit('exit', code)
  })
  return child
}

/** A child process that stays up; the port under test answers for it. */
function runningChild() {
  return new EventEmitter()
}

describe('withPreviewServer and a port that is taken', () => {
  it('passes --strictPort and the port it picked', async () => {
    const good = await listening()
    const spawnFn = vi.fn(() => runningChild())

    await withPreviewServer(async () => {}, { spawnFn, pickPort: () => good })

    const [bin, args, options] = spawnFn.mock.calls[0]
    expect(bin).toMatch(/node_modules\/\.bin\/vite$/)
    expect(args).toEqual(['preview', '--port', String(good), '--strictPort'])
    expect(options.detached).toBe(true)
  })

  it('starts again on a new port when vite exits, and serves from the second', async () => {
    const good = await listening()
    const taken = 14001
    const ports = [taken, good]
    const spawnFn = vi
      .fn()
      .mockImplementationOnce(() => exitingChild(1, `Error: Port ${taken} is already in use`))
      .mockImplementationOnce(() => runningChild())
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const started = Date.now()
    const seen = await withPreviewServer(async (baseUrl, port) => ({ baseUrl, port }), {
      spawnFn,
      pickPort: () => ports.shift(),
    })

    expect(spawnFn).toHaveBeenCalledTimes(2)
    expect(spawnFn.mock.calls[0][1]).toContain(String(taken))
    expect(spawnFn.mock.calls[1][1]).toContain(String(good))
    expect(seen).toEqual({ baseUrl: `http://localhost:${good}`, port: good })
    // The first exit is noticed at once, not after the 30s readiness timeout.
    expect(Date.now() - started).toBeLessThan(5000)
  })

  it('gives up after three exits and reports the last one', async () => {
    const spawnFn = vi.fn(() => exitingChild(1, 'Error: Port 14002 is already in use'))
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fn = vi.fn()

    await expect(
      withPreviewServer(fn, { spawnFn, pickPort: () => 14002, timeoutMs: 60_000 })
    ).rejects.toThrow(/vite preview exited with code 1 before serving: Error: Port 14002/)

    expect(spawnFn).toHaveBeenCalledTimes(3)
    expect(fn).not.toHaveBeenCalled()
  })

  it('does not start again on a server that is up but never answers', async () => {
    const spawnFn = vi.fn(() => runningChild())
    // Nothing listens here, so the poll runs to its deadline.
    await expect(
      withPreviewServer(async () => {}, { spawnFn, pickPort: () => 14003, timeoutMs: 400 })
    ).rejects.toThrow(/did not answer on http:\/\/localhost:14003 within 400ms/)

    expect(spawnFn).toHaveBeenCalledTimes(1)
  })

  it('reuses a caller-supplied port without spawning anything', async () => {
    const spawnFn = vi.fn()
    const seen = await withPreviewServer(async (url, port) => [url, port], { port: 4173, spawnFn })
    expect(seen).toEqual(['http://localhost:4173', 4173])
    expect(spawnFn).not.toHaveBeenCalled()
  })
})
