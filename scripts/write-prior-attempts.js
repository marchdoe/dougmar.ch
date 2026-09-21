/**
 * Leave `signals/prior-attempts.json` for the run about to start: what the
 * night's earlier failed attempts spent.
 *
 * Run from the nightly workflow's `redesign` job, before the pipeline step,
 * with the repository's failure issues on stdin:
 *
 *   gh issue list --label pipeline-failure --state all --json number,title,body \
 *     | node scripts/write-prior-attempts.js 2026-09-20
 *
 * The pipeline step does not get a GitHub token, so this is done here and the
 * result passed on as a file (#578). Never fails the run: bad input, an empty
 * pipe or a failed `gh` all mean "no earlier attempts", and the run prices
 * itself alone as it always did.
 *
 * Usage: node scripts/write-prior-attempts.js <YYYY-MM-DD>
 */

import { isMain } from './utils/cli.js'
import { describeAttempts, writePriorAttempts } from './utils/prior-attempts.js'

async function readStdin() {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

async function main() {
  const date = String(process.argv[2])
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(
      'usage: node scripts/write-prior-attempts.js <YYYY-MM-DD>  (issues JSON on stdin)'
    )
    return
  }
  try {
    const attempts = await writePriorAttempts(JSON.parse(await readStdin()), date)
    console.log(describeAttempts(attempts, date))
  } catch (err) {
    console.warn(`could not read earlier attempts (continuing without): ${err.message}`)
  }
}

if (isMain(import.meta.url)) {
  main()
}
