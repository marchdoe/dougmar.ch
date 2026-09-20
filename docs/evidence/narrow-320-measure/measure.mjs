#!/usr/bin/env node
/**
 * Throwaway measurement script for the 320-vs-360 narrow-viewport question.
 *
 * Does NOT edit scripts/utils/surface-gate.js. It imports the gate's pure
 * functions (evaluateMeasurement, collectSurfaceMetrics, findClippedElements,
 * findTapTargetFailures, findSmallCopy) and calls them against the ten most
 * recent frozen nightly designs served from public/archive/<date>/, at both
 * 360x640 (the gate's own mobile rung) and 320x640 (the width under review).
 *
 * Serving: `vite preview` against a built dist/, the same mechanism
 * playwright.config.ts uses for tests/e2e/site-health.spec.ts. Archive pages
 * are plain static files under public/archive/<date>/, copied into dist/
 * client/archive/<date>/ verbatim by `vite build` — no app/router code runs
 * against them.
 *
 * Frame stripping: every archived page is already sealed with a fixed
 * `[data-archive-frame]` rail (scripts/utils/archive-seal.js) that is
 * identical on every date. It is removed from the DOM right after load,
 * before any measurement runs, so what gets measured is the shipped design,
 * not the archive viewer's chrome. This does not touch surface-gate.js; it
 * is a `page.evaluate` this script runs.
 *
 * Advisories at 320: surface-gate.js's `measureRoute` only populates
 * `tapTargets` / `smallCopy` when `viewport.width === 360` (~line 899). This
 * script deliberately mirrors that instead of patching it, so at 320 those
 * two fields are always empty and the report says so rather than claiming a
 * clean result.
 *
 * Mid-word-break probe: not in surface-gate.js. Reimplemented here from
 * tests/e2e/site-health.spec.ts on origin/fix/display-type-shred-gate (PR
 * #534, "no word breaks across lines" describe block) — same regex, same
 * getClientRects-based line count, same writing-mode/hyphens exemptions.
 */

import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'

import {
  evaluateMeasurement,
  collectSurfaceMetrics,
  findClippedElements,
  findTapTargetFailures,
  findSmallCopy,
  RUNNING_COPY_MIN_CHARS,
  OVERFLOW_TOLERANCE_PX,
} from '../../../scripts/utils/surface-gate.js'
import { TAP_TARGET_MIN_PX, BODY_TEXT_MIN_PX } from '../../../scripts/utils/responsive-thresholds.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../..')
const OUT_DIR = __dirname

const DATES = [
  '2026-09-11',
  '2026-09-12',
  '2026-09-13',
  '2026-09-14',
  '2026-09-15',
  '2026-09-16',
  '2026-09-17',
  '2026-09-18',
  '2026-09-19',
  '2026-09-20',
]

const PAGES = [
  { name: 'home', file: 'index.html' },
  { name: 'about', file: 'about.html' },
  { name: 'work', file: 'work/spaceman.html' },
]

const WIDTHS = [360, 320]
const HEIGHT = 640

async function chassisFor(date) {
  const dir = await fs.readdir(path.join(ROOT, 'archive', date))
  const buildDir = dir.find((d) => d.startsWith('build-'))
  if (!buildDir) return { chassis: null, ratio: null }
  const base = path.join(ROOT, 'archive', date, buildDir)
  let chassis = null
  let ratio = null
  try {
    const trace = JSON.parse(await fs.readFile(path.join(base, 'trace.json'), 'utf8'))
    chassis = trace?.chassis?.chassisId ?? findDeep(trace, 'chassisId')
  } catch {
    /* no trace.json */
  }
  try {
    const composition = JSON.parse(await fs.readFile(path.join(base, 'composition.json'), 'utf8'))
    ratio = composition.field_ratio ?? null
  } catch {
    /* no composition.json */
  }
  return { chassis, ratio }
}

// trace.json nests chassisId under a step; walk it rather than assume the shape.
function findDeep(obj, key) {
  if (!obj || typeof obj !== 'object') return null
  if (key in obj) return obj[key]
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object') {
      const found = findDeep(v, key)
      if (found != null) return found
    }
  }
  return null
}

async function withPreviewServer(fn) {
  const port = 14173 + Math.floor(Math.random() * 500)
  const baseUrl = `http://localhost:${port}`
  const bin = path.join(ROOT, 'node_modules', '.bin', 'vite')
  const server = spawn(bin, ['preview', '--port', String(port)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  })
  let stderr = ''
  server.stderr?.on('data', (c) => {
    stderr += c.toString()
  })
  let exited = null
  server.on('exit', (code) => {
    exited = code
  })
  try {
    const deadline = Date.now() + 60000
    for (;;) {
      if (exited !== null) throw new Error(`vite preview exited (${exited}): ${stderr.slice(0, 300)}`)
      try {
        const r = await fetch(`${baseUrl}/`)
        if (r.ok) break
      } catch {
        /* not up yet */
      }
      if (Date.now() >= deadline) throw new Error(`vite preview did not come up: ${stderr.slice(0, 300)}`)
      await new Promise((r) => setTimeout(r, 250))
    }
    return await fn(baseUrl)
  } finally {
    try {
      if (server.pid && exited === null) process.kill(-server.pid, 'SIGTERM')
    } catch {
      try {
        server.kill('SIGTERM')
      } catch {
        /* already gone */
      }
    }
  }
}

/**
 * Mid-word-break probe (PR #534's shred gate), reimplemented against a live
 * page rather than surface-gate.js, which has no such check.
 */
async function findWordBreaks(page) {
  return await page.evaluate(() => {
    const measurable = (cs) =>
      cs.visibility !== 'hidden' && cs.hyphens !== 'auto' && cs.writingMode.startsWith('horizontal')

    const range = document.createRange()
    const brokenWords = (node, el, size) =>
      Array.from((node.textContent ?? '').matchAll(/[\p{L}\p{N}'’]+/gu)).flatMap((word) => {
        range.setStart(node, word.index)
        range.setEnd(node, word.index + word[0].length)
        const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0)
        const lines = new Set(rects.map((r) => Math.round(r.top / (size / 2))))
        if (lines.size < 2) return []
        const needs = rects.reduce((sum, r) => sum + r.width, 0)
        return [
          {
            tag: el.tagName.toLowerCase(),
            word: word[0],
            fontSizePx: Math.round(size),
            needsPx: Math.round(needs),
          },
        ]
      })

    const bad = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const el = node.parentElement
      if (!el) continue
      const cs = getComputedStyle(el)
      if (measurable(cs)) bad.push(...brokenWords(node, el, Number.parseFloat(cs.fontSize)))
    }
    return bad
  })
}

async function measureArchivePage(browser, baseUrl, date, pageDef, width) {
  const route = `/archive/${date}/${pageDef.file}`
  const viewport = { width, height: HEIGHT }
  const page = await browser.newPage({ viewport, colorScheme: 'light' })
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(String(err)))

  try {
    const resp = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(900)
    // Strip the archive viewer's own chrome before measuring the design.
    await page.evaluate(() => {
      document.querySelector('[data-archive-frame]')?.remove()
    })

    const box = await page.evaluate(collectSurfaceMetrics, { minChars: RUNNING_COPY_MIN_CHARS })
    const clipped = await page.evaluate(
      ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
      [findClippedElements.toString(), { overflowTolerancePx: OVERFLOW_TOLERANCE_PX }]
    )

    // Mirrors measureRoute's own gate: these only run at the 360 rung. Left
    // as a real gap rather than patched, per the task brief.
    let tapTargets = []
    let smallCopy = null
    let advisoryMeasured = false
    if (width === 360) {
      advisoryMeasured = true
      tapTargets = await page.evaluate(
        ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
        [findTapTargetFailures.toString(), { tapTargetMinPx: TAP_TARGET_MIN_PX }]
      )
      smallCopy = await page.evaluate(
        ([src, thresholds]) => new Function(`return ${src}`)()(window.innerWidth, thresholds),
        [findSmallCopy.toString(), { bodyTextMinPx: BODY_TEXT_MIN_PX }]
      )
    }

    const wordBreaks = await findWordBreaks(page)

    const m = {
      id: `${date}-${pageDef.name}`,
      route,
      viewport: 'mobile',
      scheme: 'light',
      status: resp?.status() ?? null,
      ...box,
      clipped,
      tapTargets,
      smallCopy,
      visibleCopy: null,
      consoleErrors,
    }
    const findings = evaluateMeasurement(m)

    return {
      date,
      page: pageDef.name,
      width,
      status: m.status,
      scrollWidth: m.scrollWidth,
      clientWidth: m.clientWidth,
      overflowPx: Math.max(0, Math.round(m.scrollWidth - m.clientWidth)),
      findings,
      advisoryMeasured,
      wordBreaks,
    }
  } finally {
    await page.close()
  }
}

async function main() {
  const chassisInfo = {}
  for (const date of DATES) chassisInfo[date] = await chassisFor(date)

  const results = await withPreviewServer(async (baseUrl) => {
    const browser = await chromium.launch({ headless: true })
    const out = []
    try {
      for (const date of DATES) {
        for (const pageDef of PAGES) {
          for (const width of WIDTHS) {
            const r = await measureArchivePage(browser, baseUrl, date, pageDef, width)
            out.push(r)
            const errCount = r.findings.filter((f) => f.severity === 'error').length
            console.error(
              `${date} ${pageDef.name} @${width}: status=${r.status} overflow=${r.overflowPx}px ` +
                `errors=${errCount} wordBreaks=${r.wordBreaks.length}`
            )
          }
        }
      }

      // Screenshots for the worst and best night, home page at 320.
      const byDateError320 = {}
      for (const r of out) {
        if (r.width !== 320) continue
        const errCount = r.findings.filter((f) => f.severity === 'error').length
        byDateError320[r.date] = (byDateError320[r.date] ?? 0) + errCount
      }
      const dates320Sorted = [...DATES].sort((a, b) => byDateError320[a] - byDateError320[b])
      const bestDate = dates320Sorted[0]
      const worstDate = dates320Sorted[dates320Sorted.length - 1]

      for (const [label, date] of [
        ['best', bestDate],
        ['worst', worstDate],
      ]) {
        const page = await browser.newPage({ viewport: { width: 320, height: HEIGHT } })
        await page.goto(`${baseUrl}/archive/${date}/index.html`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        })
        await page.waitForTimeout(900)
        await page.evaluate(() => document.querySelector('[data-archive-frame]')?.remove())
        await page.screenshot({
          path: path.join(OUT_DIR, `${label}-320-${date}.png`),
          fullPage: true,
        })
        await page.close()
      }

      return { measurements: out, bestDate, worstDate }
    } finally {
      await browser.close()
    }
  })

  await fs.writeFile(
    path.join(OUT_DIR, 'raw-results.json'),
    JSON.stringify({ chassisInfo, ...results }, null, 2)
  )
  console.error('wrote raw-results.json, best=' + results.bestDate + ' worst=' + results.worstDate)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
