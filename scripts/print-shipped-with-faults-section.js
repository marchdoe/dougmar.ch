/**
 * Print the day's "Shipped with faults" section for the rating issue, or
 * nothing.
 *
 * Run from the nightly workflow's `publish` job, after `Push changes` has
 * committed `archive/<date>/build-<id>/verdicts.json` into the local checkout —
 * that is the earliest point in the job the file exists on the runner.
 * Deliberately a standalone script rather than inline `actions/github-script`
 * JS: the repo is ESM (`"type": "module"`) and github-script's sandbox is
 * CommonJS, so the body-building logic lives in `scripts/utils/needs-human.js`
 * where it can be imported normally and unit tested, and this is the thin CLI
 * that hands its output to the workflow step. Mirrors
 * print-needs-human-section.js (#468) for the SHIPPED-WITH-FAULTS verdict a
 * final REVISE after a repair round writes (#467).
 *
 * Usage: node scripts/print-shipped-with-faults-section.js <YYYY-MM-DD>
 */

import { isMain } from './utils/cli.js'
import { buildShippedWithFaultsSection, readShippedWithFaultsEntries } from './utils/needs-human.js'

function main() {
  const date = process.argv[2]
  if (!date) {
    console.error('usage: node scripts/print-shipped-with-faults-section.js <YYYY-MM-DD>')
    process.exit(1)
  }
  process.stdout.write(buildShippedWithFaultsSection(readShippedWithFaultsEntries('archive', date)))
}

if (isMain(import.meta.url)) {
  main()
}
