/**
 * Print the day's "Needs a human" section for the rating issue, followed by
 * the "Surface gate did not run" section when the gate threw (#565), or
 * nothing.
 *
 * Run from the nightly workflow's `publish` job, after `Push changes` has
 * committed `archive/<date>/build-<id>/verdicts.json` into the local checkout —
 * that is the earliest point in the job the file exists on the runner.
 * Deliberately a standalone script rather than inline `actions/github-script`
 * JS: the repo is ESM (`"type": "module"`) and github-script's sandbox is
 * CommonJS, so the body-building logic lives in `scripts/utils/needs-human.js`
 * where it can be imported normally and unit tested, and this is the thin CLI
 * that hands its output to the workflow step.
 *
 * Usage: node scripts/print-needs-human-section.js <YYYY-MM-DD>
 */

import { isMain } from './utils/cli.js'
import {
  buildGateFailedSection,
  buildNeedsHumanSection,
  readGateFailedEntries,
  readNeedsHumanEntries,
} from './utils/needs-human.js'

function main() {
  const date = process.argv[2]
  if (!date) {
    console.error('usage: node scripts/print-needs-human-section.js <YYYY-MM-DD>')
    process.exit(1)
  }
  const sections = [
    buildNeedsHumanSection(readNeedsHumanEntries('archive', date)),
    buildGateFailedSection(readGateFailedEntries('archive', date)),
  ].filter(Boolean)
  process.stdout.write(sections.join('\n\n'))
}

if (isMain(import.meta.url)) {
  main()
}
