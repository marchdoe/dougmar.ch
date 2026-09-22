#!/usr/bin/env node
/**
 * Offline mockup-fidelity check, run by hand.
 *
 *   node scripts/mockup-fidelity-cli.js --date 2026-09-19
 *   node scripts/mockup-fidelity-cli.js --all
 *
 * Loads a night's mockup (`archive/<date>/<shipped build>/mockup.html`) and
 * the built page (`public/archive/<date>/index.html`) over `file://`, no
 * server, and compares their text geometry with `compareLayouts`
 * (mockup-fidelity.js) at two viewports: 1440x900 and 360x640. `--all` walks
 * every archived date that has both.
 *
 * Prints each date's findings as JSON, plus a one-line summary of counts per
 * finding kind. Phase 1-2 only: this is not wired into the nightly pipeline
 * or any gate — see mockup-fidelity.js's module doc.
 */

import { parseArgs } from 'node:util'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { archivedDates } from './utils/archive-fs.js'
import { pickBuild } from './utils/archive-record.js'
import { ROOT } from './utils/file-manager.js'
import { compareLayouts, extractTextSegments } from './utils/mockup-fidelity.js'

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 360, height: 640 },
]

const { values } = parseArgs({
  options: {
    date: { type: 'string' },
    all: { type: 'boolean' },
  },
})

if (!values.date && !values.all) {
  console.error('usage: mockup-fidelity-cli.js --date YYYY-MM-DD | --all')
  process.exitCode = 1
  process.exit()
}

/**
 * A night's mockup path and built page path, or null when either is
 * missing — an archived day predating mockups, or a build never shipped.
 *
 * @param {string} date
 * @returns {{ mockupPath: string, buildPath: string } | null}
 */
function pathsForDate(date) {
  const dateDir = path.join(ROOT, 'archive', date)
  const { buildDir } = pickBuild(dateDir)
  if (!buildDir) return null
  const mockupPath = path.join(buildDir, 'mockup.html')
  const buildPath = path.join(ROOT, 'public', 'archive', date, 'index.html')
  if (!existsSync(mockupPath) || !existsSync(buildPath)) return null
  return { mockupPath, buildPath }
}

/**
 * Extract text segments from a local HTML file at one viewport. Reduced
 * motion, like `measureStranded` (render-health.js): a capture that never
 * scrolls should see whatever a `prefers-reduced-motion` visitor sees,
 * rather than the mid-animation state of a scroll-linked reveal.
 *
 * @param {import('playwright').Browser} browser
 * @param {string} filePath
 * @param {{ width: number, height: number }} viewport
 * @returns {Promise<Array<object>>}
 */
async function extract(browser, filePath, viewport) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
  try {
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' })
    try {
      await page.evaluate(() => document.fonts.ready)
    } catch {
      // fonts API unavailable in this context — proceed with whatever loaded
    }
    await page.waitForTimeout(300)
    return await page.evaluate(extractTextSegments)
  } finally {
    await page.close()
  }
}

/**
 * @param {import('playwright').Browser} browser
 * @param {string} date
 * @param {{ mockupPath: string, buildPath: string }} paths
 * @returns {Promise<Array<object>>}
 */
async function runDate(browser, date, { mockupPath, buildPath }) {
  const findings = []
  for (const viewport of VIEWPORTS) {
    const [mockupSegs, buildSegs] = await Promise.all([
      extract(browser, mockupPath, viewport),
      extract(browser, buildPath, viewport),
    ])
    findings.push(
      ...compareLayouts(mockupSegs, buildSegs, {
        width: viewport.width,
        viewportHeight: viewport.height,
      })
    )
  }
  return findings.map((f) => ({ date, ...f }))
}

function summarize(date, findings) {
  const counts = new Map()
  for (const f of findings) counts.set(f.kind, (counts.get(f.kind) ?? 0) + 1)
  const parts = [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([kind, n]) => `${kind}:${n}`)
  return `${date}: ${findings.length} findings${parts.length ? ` (${parts.join(', ')})` : ''}`
}

const dates = values.all ? archivedDates(path.join(ROOT, 'archive')) : [values.date]

const { chromium } = await import('playwright')
const browser = await chromium.launch({ headless: true })

const summaries = []
try {
  for (const date of dates) {
    const paths = pathsForDate(date)
    if (!paths) continue
    const findings = await runDate(browser, date, paths)
    console.log(JSON.stringify({ date, findings }, null, 2))
    summaries.push(summarize(date, findings))
  }
} finally {
  await browser.close()
}

console.log('\n--- summary ---')
for (const line of summaries) console.log(line)
