/**
 * Print the failure issue's cost section from a downloaded failure artifact.
 *
 * Run from the nightly workflow's `notify` job, which downloads the
 * `build-failed-<run id>` artifact and hands this script its directory. The
 * artifact's layout is whatever `upload-artifact` made of the four globs it was
 * given, so `cost.json` is looked for recursively; a run that failed twice in
 * one process cannot happen, but the newest directory name wins if it did.
 * A missing directory or file prints the "not recorded" line and exits 0: the
 * issue must open either way.
 *
 * Standalone rather than inline `actions/github-script` JS for the reason
 * `print-needs-human-section.js` gives: the repo is ESM and github-script's
 * sandbox is CommonJS, so the logic lives in `utils/failure-cost-section.js`
 * where a test can import it.
 *
 * Usage: node scripts/print-failed-run-cost.js <artifact dir> <run id> [run attempt]
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { isMain } from './utils/cli.js'
import { formatFailureCost } from './utils/failure-cost-section.js'

/**
 * Every `cost.json` under `dir`, newest directory name last.
 * @param {string} dir
 * @returns {string[]}
 */
export function findCostFiles(dir) {
  if (!existsSync(dir)) return []
  const found = []
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name === 'cost.json') found.push(full)
    }
  }
  walk(dir)
  return found.sort()
}

/**
 * The failed run's cost record, or null when the artifact has none or it is unreadable.
 * @param {string} dir
 * @returns {object|null}
 */
export function readFailedRunCost(dir) {
  const file = findCostFiles(dir).at(-1)
  if (!file) return null
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function main() {
  const [dir, runId, runAttempt] = process.argv.slice(2)
  if (!dir || !runId) {
    console.error(
      'usage: node scripts/print-failed-run-cost.js <artifact dir> <run id> [run attempt]'
    )
    process.exit(1)
  }
  process.stdout.write(formatFailureCost(readFailedRunCost(dir), runId, Number(runAttempt)))
}

if (isMain(import.meta.url)) {
  main()
}
