/**
 * Run the copy gate's matcher by hand (#504).
 *
 *   node scripts/copy-gate-cli.js <path|url>
 *
 * A URL is read the way the nightly reads a route: headless Chromium,
 * `document.body.innerText`, the same in-page function. A directory is its
 * `index.html`. An `.html` file is read as text with its tags stripped, which
 * is how an archived page under `public/archive/<date>/` is checked. A `.ts`
 * or `.tsx` file goes through the static scan, string literals and JSX text.
 *
 * Exits 1 when anything is found, so it can gate a shell step.
 */

import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { isMain } from './utils/cli.js'
import {
  collectVisibleCopy,
  htmlToText,
  readCopyExemptions,
  scanSource,
  scanText,
} from './utils/copy-gate.js'
import { ROOT } from './utils/file-manager.js'

/** One line per hit, the same words the gate puts in a finding. */
function formatHits(hits) {
  return hits.map(
    (h) =>
      `[${h.tell}] ${h.label}${h.line ? ` at line ${h.line}` : ''}: "${h.context ?? h.lineText}"`
  )
}

async function scanUrl(url, exemptions) {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      colorScheme: 'light',
    })
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(900)
    const visible = await page.evaluate(
      ([src]) => new Function(`return ${src}`)()(),
      [collectVisibleCopy.toString()]
    )
    return scanText(visible.text, { exemptions, allowed: visible.allowed })
  } finally {
    await browser.close()
  }
}

/**
 * @param {string} target a URL, a directory, an .html file, or a .ts/.tsx file
 * @param {{ root?: string }} [opts]
 * @returns {Promise<{ target: string, mode: string, hits: Array<object> }>}
 */
export async function scanTarget(target, { root = ROOT } = {}) {
  const exemptions = readCopyExemptions(root)
  if (/^https?:\/\//.test(target)) {
    return { target, mode: 'rendered', hits: await scanUrl(target, exemptions) }
  }
  const file = resolveTargetFile(target)
  const source = readFileSync(file, 'utf8')
  const isSource = /\.tsx?$/.test(file)
  return {
    target: file,
    mode: isSource ? 'static' : 'html',
    hits: isSource
      ? scanSource(source, { exemptions })
      : scanText(htmlToText(source), { exemptions }),
  }
}

/** A path argument as the file to read: a directory means its index.html. */
function resolveTargetFile(target) {
  const file = path.resolve(target)
  if (!existsSync(file)) throw new Error(`no such file: ${file}`)
  return statSync(file).isDirectory() ? path.join(file, 'index.html') : file
}

if (isMain(import.meta.url)) {
  const target = process.argv[2]
  if (!target) {
    console.error('usage: node scripts/copy-gate-cli.js <path|url>')
    process.exit(2)
  }
  const { mode, hits } = await scanTarget(target)
  console.log(`copy gate (${mode}) on ${target}: ${hits.length} finding(s)`)
  for (const line of formatHits(hits)) console.log(`  ${line}`)
  process.exitCode = hits.length ? 1 : 0
}
