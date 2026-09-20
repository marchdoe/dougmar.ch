/**
 * Run the copy gate's matcher by hand (#504).
 *
 *   node scripts/copy-gate-cli.js <path|url>
 *
 * A URL is read the way the nightly reads a route: headless Chromium,
 * `document.body.innerText` and the per-block text runs, the same in-page
 * functions. A directory is its `index.html`, and an `.html` file is opened
 * from disk in the same browser, which is how an archived page under
 * `public/archive/<date>/` is checked. A `.ts` or `.tsx` file goes through
 * the static scan, string literals and JSX text.
 *
 * Exits 1 when anything is found, so it can gate a shell step.
 */

import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { isMain } from './utils/cli.js'
import {
  readCopyExemptions,
  readRenderedCopy,
  scanRuns,
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

/** An orphan-separator hit in the shape `formatHits` prints. */
function orphanHit(h) {
  return {
    tell: 'orphan-separator',
    label: `orphan separator "${h.separator}" at the ${h.position} of <${h.tag}>`,
    context: h.text,
  }
}

async function scanRendered(url, exemptions) {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      colorScheme: 'light',
    })
    // An archived page has no network to settle, and its fonts come from a CDN.
    const waitUntil = url.startsWith('file:') ? 'domcontentloaded' : 'networkidle'
    await page.goto(url, { waitUntil, timeout: 30000 })
    await page.waitForTimeout(900)
    const visible = await readRenderedCopy(page)
    return [
      ...scanText(visible.text, { exemptions, allowed: visible.allowed }),
      ...scanRuns(visible.runs, { exemptions }).map(orphanHit),
    ]
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
    return { target, mode: 'rendered', hits: await scanRendered(target, exemptions) }
  }
  const file = resolveTargetFile(target)
  if (/\.tsx?$/.test(file)) {
    return {
      target: file,
      mode: 'static',
      hits: scanSource(readFileSync(file, 'utf8'), { exemptions }),
    }
  }
  return {
    target: file,
    mode: 'html',
    hits: await scanRendered(pathToFileURL(file).href, exemptions),
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
