/**
 * The mockup capture pass measures design fidelity on the same page it
 * screenshots (#487), instead of the Mockup Critic estimating canvas
 * utilization and colour coverage by eye. Real Chromium, like
 * design-fidelity.test.js — getComputedStyle/getBoundingClientRect need
 * actual layout, not jsdom.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { captureHtmlFileScreenshot } from '../../scripts/utils/snapshot.js'

let dir

async function writeFixture(name, bodyHtml) {
  const filePath = path.join(dir, name)
  await writeFile(
    filePath,
    `<!doctype html><html><head><style>html,body{margin:0;padding:0}</style></head>` +
      `<body>${bodyHtml}</body></html>`,
    'utf8'
  )
  return filePath
}

describe('captureHtmlFileScreenshot measured fidelity', () => {
  beforeAll(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'mockup-fidelity-'))
  })
  afterAll(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('measures a full-bleed colour field mockup high', async () => {
    const filePath = await writeFixture(
      'full-bleed.html',
      `<div style="position:fixed;inset:0;background:#2255dd"></div>`
    )
    const { measured } = await captureHtmlFileScreenshot(filePath, { width: 1440, height: 900 })
    expect(measured).toBeTruthy()
    expect(measured.canvas_utilization).toBeGreaterThan(90)
    expect(measured.color_coverage).toBeGreaterThan(90)
  }, 30000)

  it('measures a narrow centered column mockup low', async () => {
    const filePath = await writeFixture(
      'narrow-column.html',
      `<div style="width:200px;margin:300px auto;font-size:16px;color:#111">Hi</div>`
    )
    const { measured } = await captureHtmlFileScreenshot(filePath, { width: 1440, height: 900 })
    expect(measured).toBeTruthy()
    expect(measured.canvas_utilization).toBeLessThan(20)
  }, 30000)
})
