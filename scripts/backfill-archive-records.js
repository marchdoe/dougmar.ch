#!/usr/bin/env node

/**
 * Write `archive/<date>/record.json` for every archived day.
 *
 * The record (#153) is a cache, not a source: everything in it is recomputed
 * from the artifacts that build left behind, so the fix for any drift is to run
 * this again. The pipeline writes today's record itself — this fills in history
 * and rebuilds the lot whenever the record's shape changes.
 *
 * Idempotent: a date whose record would come out identical keeps its existing
 * file, `generatedAt` included, so a re-run leaves the working tree clean.
 *
 * Usage:
 *   node scripts/backfill-archive-records.js [--check] [<date> ...]
 *
 *   --check   report what would change and write nothing (exit 1 if anything would)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from './utils/file-manager.js'
import { archivedDates } from './utils/archive-fs.js'
import { anomaliesOf, buildRecord } from './utils/archive-record.js'

const ARCHIVE_DIR = join(ROOT, 'archive')

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const only = args.filter((a) => /^\d{4}-\d{2}-\d{2}$/.test(a))

function readExisting(recordPath) {
  if (!existsSync(recordPath)) return null
  try {
    return JSON.parse(readFileSync(recordPath, 'utf8'))
  } catch {
    return null
  }
}

const dates = only.length > 0 ? only : archivedDates(ARCHIVE_DIR)
console.log(`[backfill-archive-records] ${dates.length} date(s)`)

let written = 0
let unchanged = 0
let skipped = 0
const anomalous = []

for (const date of dates) {
  const recordPath = join(ARCHIVE_DIR, date, 'record.json')
  const existing = readExisting(recordPath)

  // Reuse the old stamp so an unchanged record stays byte-identical.
  const record = buildRecord(date, {
    archiveDir: ARCHIVE_DIR,
    generatedAt: existing?.generatedAt,
  })
  if (!record) {
    console.warn(`  ${date}: no archive directory, skipped`)
    skipped++
    continue
  }

  const anomalies = anomaliesOf(record)
  if (anomalies.length > 0) anomalous.push({ date, era: record.era, anomalies })

  const serialized = `${JSON.stringify(record, null, 2)}\n`
  if (existing && `${JSON.stringify(existing, null, 2)}\n` === serialized) {
    unchanged++
    continue
  }

  if (!checkOnly) writeFileSync(recordPath, serialized, 'utf8')
  written++
}

console.log(
  `  ${checkOnly ? 'would write' : 'wrote'} ${written}, unchanged ${unchanged}${skipped ? `, skipped ${skipped}` : ''}`
)

if (anomalous.length > 0) {
  console.log(`  ${anomalous.length} date(s) disagree with their era:`)
  for (const { date, era, anomalies } of anomalous) {
    console.log(`    ${date} (${era}): ${anomalies.join(', ')}`)
  }
}

if (checkOnly && written > 0) process.exit(1)
