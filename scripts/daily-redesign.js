#!/usr/bin/env node

/**
 * Daily Redesign Pipeline
 *
 * Reads signals/today.yml, runs the design agent swarm, which handles
 * backup/restore/retry/archive internally. This script is just the outer
 * orchestration layer — the heavy lifting happens in design-agents.js.
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY - required in production
 *   DRY_RUN=true      - optional; the workflow's dry_run input and the canary set
 *                       it. It only changes the closing log line. It does not
 *                       skip a model call or the archive, and nothing in this
 *                       process commits: the workflow's push steps check
 *                       dry_run themselves.
 *
 * Exit codes:
 *   0 - success (build passed, committed)
 *   1 - failure (all attempts exhausted or fatal error)
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env'), quiet: true })

import { execSync } from 'node:child_process'
import { appendFileSync } from 'node:fs'
import { readContext } from './utils/site-context.js'
import { runAgentSwarm } from './design-agents.js'
import { isMain } from './utils/cli.js'
import { runDate } from './utils/run-date.js'

const DRY_RUN = process.env.DRY_RUN === 'true'

/**
 * Tell the workflow which day this run is for.
 *
 * The push step derived its own `TODAY` with `date -u`, while every archive
 * path in this process is keyed on `signals.date`, the Eastern day. Between
 * 20:00 and 23:59 Eastern the two differ, and /panel's "trigger a run"
 * button lands in exactly that window: the site changed, `git add
 * archive/$TODAY/...` matched nothing, and the run reported success with no
 * record for the day (#338). One source now: the workflow reads this output.
 *
 * @param {{ date?: string } | null | undefined} signals
 * @param {string | undefined} [outputFile] GITHUB_OUTPUT; absent outside Actions
 * @returns {string} the date published
 */
export function publishRunDate(signals, outputFile = process.env.GITHUB_OUTPUT) {
  const date = runDate(signals)
  if (outputFile && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    appendFileSync(outputFile, `date=${date}\n`)
  }
  return date
}

async function main() {
  // Validate claude CLI is available (required in all modes)
  try {
    execSync('claude --version', { encoding: 'utf8', timeout: 5000 })
  } catch {
    console.error('Error: The `claude` CLI (Claude Code) is required.')
    console.error('  Install: https://claude.ai/download')
    process.exit(1)
  }

  console.log(`\n=== Daily Redesign Pipeline ===`)
  console.log(`DRY_RUN: ${DRY_RUN}`)
  console.log('')

  // Step 1: Read context
  console.log('[1/3] Reading site context...')
  const context = await readContext()
  console.log(`  signals date: ${context.signals.date}`)
  publishRunDate(context.signals)
  console.log(`  mutable files found: ${context.currentFiles.length}`)

  // Step 2: Run agent swarm (handles its own backup/restore/retry/archive)
  console.log('[2/3] Running agent swarm...')
  let result
  try {
    result = await runAgentSwarm(context)
  } catch (err) {
    console.error(`\nAgent swarm failed: ${err.message}`)
    process.exit(1)
  }

  // Step 3: Done
  console.log(`\n[3/3] design_brief: ${result.design_brief}`)

  if (DRY_RUN) {
    console.log('\nDRY_RUN=true — files written to disk. Build was verified.')
  } else {
    console.log('\nDone. GitHub Actions will commit and push.')
  }

  // Actions pipes stdout, which is async — exiting immediately after the
  // last console.log can cut those lines off before they flush. A plain
  // fall-through instead of an explicit exit is not safe here: the swarm
  // opens browsers and preview servers, and a leaked handle would hang the
  // unattended nightly run until the job timeout (#305).
  process.stdout.write('', () => process.exit(0))
}

// Run main only when executed directly (not when imported for testing)
if (isMain(import.meta.url)) {
  main().catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
}
