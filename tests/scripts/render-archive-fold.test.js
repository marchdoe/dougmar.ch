import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { serveDir } from '../../scripts/render-archive-fold.js'

describe('serveDir', () => {
  let dir
  let server
  let base

  beforeEach(async () => {
    dir = mkdtempSync(path.join(tmpdir(), 'serve-dir-'))
    mkdirSync(path.join(dir, 'archive', '2026-06-13'), { recursive: true })
    writeFileSync(path.join(dir, 'archive', '2026-06-13', 'index.html'), '<h1>night</h1>')
    writeFileSync(path.join(dir, 'font.woff2'), 'w')
    writeFileSync(path.join(dir, 'blob.xyz'), 'x')
    server = await serveDir(dir)
    const address = server.address()
    base = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`
  })

  afterEach(() => {
    server.close()
    rmSync(dir, { recursive: true, force: true })
  })

  it('serves index.html for a directory path, as HTML', async () => {
    const res = await fetch(`${base}/archive/2026-06-13/`)
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8')
    expect(await res.text()).toBe('<h1>night</h1>')
  })

  it('sends the mime type for known extensions and a generic one otherwise', async () => {
    expect((await fetch(`${base}/font.woff2`)).headers.get('content-type')).toBe('font/woff2')
    expect((await fetch(`${base}/blob.xyz`)).headers.get('content-type')).toBe(
      'application/octet-stream'
    )
  })

  it('answers 404 for a missing file', async () => {
    expect((await fetch(`${base}/archive/1999-01-01/`)).status).toBe(404)
  })

  it('refuses a path that escapes the served directory', async () => {
    expect((await fetch(`${base}/..%2f..%2fetc%2fpasswd`)).status).toBe(403)
  })
})
