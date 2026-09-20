import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  screenshotViewports,
  VIEWPORT_IMAGE_MAX_WIDTH,
} from '../../scripts/utils/viewport-screenshotter.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLEAN = `file://${path.join(__dirname, '../fixtures/responsive/clean.html')}`

/** Pixel size of a WebP, from the extended header (`VP8X`) Chromium's canvas writes. */
function webpSize(bytes) {
  expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF')
  expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP')
  expect(bytes.subarray(12, 16).toString('ascii')).toBe('VP8X')
  return { width: bytes.readUIntLE(24, 3) + 1, height: bytes.readUIntLE(27, 3) + 1 }
}

describe('viewport-screenshotter', () => {
  let outDir
  beforeAll(async () => {
    outDir = await mkdtemp(path.join(tmpdir(), 'vpscreen-'))
  })
  afterAll(async () => {
    await rm(outDir, { recursive: true, force: true })
  })

  it('writes one WebP per viewport (#549)', async () => {
    const viewports = [
      { name: 'mobile', width: 360, height: 640 },
      { name: 'tablet', width: 768, height: 1024 },
    ]
    const results = await screenshotViewports(CLEAN, viewports, outDir)
    expect(results.length).toBe(2)
    for (const r of results) {
      const s = await stat(r.path)
      expect(s.size).toBeGreaterThan(100)
      expect(r.path.endsWith(`${r.name}.webp`)).toBe(true)
    }
  }, 30_000)

  it('keeps a capture at its own width up to the cap, and scales a wider one down to it', async () => {
    const viewports = [
      { name: 'mobile', width: 360, height: 640 },
      { name: 'desktop', width: 1440, height: 900 },
    ]
    const [mobile, desktop] = await screenshotViewports(CLEAN, viewports, outDir)
    expect(webpSize(await readFile(mobile.path))).toEqual({ width: 360, height: 640 })
    expect(webpSize(await readFile(desktop.path))).toEqual({
      width: VIEWPORT_IMAGE_MAX_WIDTH,
      height: Math.round(900 * (VIEWPORT_IMAGE_MAX_WIDTH / 1440)),
    })
  }, 30_000)
})
