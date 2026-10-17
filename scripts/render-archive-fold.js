#!/usr/bin/env node

/**
 * Render a reference — the first fold of an archived night — to a PNG.
 *
 * Usage:
 *   node scripts/render-archive-fold.js --date 2026-04-28 --out references/own-2026-04-28-terracotta-specimen.png
 *
 * Serves public/ from a throwaway static server (archived pages reference
 * assets by absolute path), loads /archive/<date>/ at 1440x900, device scale 1,
 * hides the archive viewer frame, waits for web fonts, and writes the first fold (900px tall) as a PNG.
 * Web fonts come from Google Fonts, so the render needs network access.
 */

import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { isMain } from './utils/cli.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public')

export const VIEWPORT = { width: 1440, height: 900 }

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

/**
 * Serve a directory over HTTP on an ephemeral port.
 *
 * @param {string} dir directory to serve
 * @returns {Promise<import('node:http').Server>}
 */
export function serveDir(dir) {
  const server = createServer(async (req, res) => {
    try {
      let rel = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)
      if (rel.endsWith('/')) rel += 'index.html'
      const file = path.join(dir, rel)
      if (!file.startsWith(dir + path.sep)) {
        res.writeHead(403).end()
        return
      }
      const body = await readFile(file)
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404).end()
    }
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

/**
 * Render the first fold of an archived night.
 *
 * @param {{ date: string, out: string, publicDir?: string }} opts
 * @returns {Promise<void>}
 */
export async function renderGoldStandard({ date, out, publicDir = PUBLIC_DIR }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD, got "${date}"`)
  const server = await serveDir(publicDir)
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 })
    await page.goto(`http://127.0.0.1:${port}/archive/${date}/`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    // Sealed archive pages carry a 44px viewer frame (archive-seal.js) that is
    // not part of the design; drop it and the padding it adds to the body.
    await page.addStyleTag({
      content: '[data-archive-frame]{display:none!important}body{padding-top:0!important}',
    })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(500)
    const png = await page.screenshot({ type: 'png', fullPage: false })
    await mkdir(path.dirname(path.resolve(out)), { recursive: true })
    await writeFile(out, png)
  } finally {
    await browser.close()
    server.close()
  }
}

if (isMain(import.meta.url)) {
  const args = process.argv.slice(2)
  const flag = (name) => {
    const i = args.indexOf(`--${name}`)
    return i === -1 ? undefined : args[i + 1]
  }
  const date = flag('date')
  const out = flag('out')
  if (!date || !out) {
    console.error('Usage: node scripts/render-archive-fold.js --date YYYY-MM-DD --out <file.png>')
    process.exit(1)
  }
  await renderGoldStandard({ date, out })
  console.log(`rendered ${date} -> ${out}`)
}
