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
 * finding kind. The nightly runs the same comparison inside the surface gate
 * and archives it per build as mockup-fidelity.json; this replays it over
 * nights already shipped.
 */

import { parseArgs } from 'node:util'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { archivedDates } from './utils/archive-fs.js'
import { pickBuild } from './utils/archive-record.js'
import { ROOT } from './utils/file-manager.js'
import { compareMockupLayout, readPageLayout } from './utils/mockup-fidelity.js'

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
 * Read both pages at both widths and compare them, the same readers and the
 * same comparison the nightly runs (`readPageLayout`, `compareMockupLayout`).
 *
 * @param {import('playwright').Browser} browser
 * @param {string} date
 * @param {{ mockupPath: string, buildPath: string }} paths
 * @returns {Promise<Array<object>>}
 */
async function runDate(browser, date, { mockupPath, buildPath }) {
  const [mockupLayout, buildLayout] = await Promise.all([
    readPageLayout(browser, `file://${mockupPath}`),
    readPageLayout(browser, `file://${buildPath}`),
  ])
  return compareMockupLayout(mockupLayout, buildLayout).map((f) => ({ date, ...f }))
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
