/**
 * Open the day's `Rate: <date>` issue from `archive/<date>/`.
 *
 * The nightly workflow's `publish` job and the local-night recipe both run
 * this, so the issue is built one way (scripts/utils/rating-issue.js). Refuses
 * to create a second issue for a date that already has one, open or closed.
 *
 * The "Needs a human" and "Shipped with faults" sections come from
 * print-needs-human-section.js and print-shipped-with-faults-section.js. The
 * workflow has already written their output to files and passes them with
 * --needs-human and --shipped-with-faults; without those flags this runs the
 * print scripts against the night itself.
 *
 * Usage: node scripts/open-rating-issue.js <YYYY-MM-DD> [--dry-run]
 *          [--needs-human <file>] [--shipped-with-faults <file>]
 * Exit codes: 0 created (or dry run), 1 error, 3 an issue for the date exists.
 * Needs `gh` signed in (GH_TOKEN in the workflow).
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { isMain } from './utils/cli.js'
import { buildRatingIssueFromArchive, findExistingRatingIssue } from './utils/rating-issue.js'

const SCRIPTS = path.dirname(fileURLToPath(import.meta.url))
const EXISTS = 3

function gh(args) {
  return execFileSync('gh', args, { encoding: 'utf8' })
}

function flagValue(argv, flag) {
  const i = argv.indexOf(flag)
  return i === -1 ? undefined : argv[i + 1]
}

function section(argv, flag, printScript, date) {
  const file = flagValue(argv, flag)
  if (file) {
    try {
      return fs.readFileSync(file, 'utf8')
    } catch {
      return ''
    }
  }
  return execFileSync('node', [path.join(SCRIPTS, printScript), date], { encoding: 'utf8' })
}

const USAGE =
  'usage: node scripts/open-rating-issue.js <YYYY-MM-DD> [--dry-run] [--needs-human <file>] [--shipped-with-faults <file>]'

function repoName() {
  return (
    process.env.GITHUB_REPOSITORY ||
    gh(['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner']).trim()
  )
}

function listIssues(search) {
  const args = ['issue', 'list', '--state', 'all', '--search', search]
  return JSON.parse(gh([...args, '--limit', '50', '--json', 'number,title']))
}

function buildIssue(argv, date) {
  return buildRatingIssueFromArchive({
    archiveDir: 'archive',
    date,
    repo: repoName(),
    needsHuman: section(argv, '--needs-human', 'print-needs-human-section.js', date),
    shippedWithFaults: section(
      argv,
      '--shipped-with-faults',
      'print-shipped-with-faults-section.js',
      date
    ),
  })
}

function main() {
  const argv = process.argv.slice(2)
  const date = argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a))
  if (!date) {
    console.error(USAGE)
    process.exit(1)
  }
  const existing = findExistingRatingIssue(date, listIssues)
  if (existing) {
    console.error(`Rate: ${date} already exists as #${existing.number}; not creating another.`)
    process.exit(EXISTS)
  }
  const { title, body } = buildIssue(argv, date)
  if (argv.includes('--dry-run')) {
    console.log(`title: ${title}\nlabel: daily-rating\n\n${body}`)
    return
  }
  const create = ['issue', 'create', '--label', 'daily-rating', '--title', title, '--body', body]
  process.stdout.write(gh(create))
}

if (isMain(import.meta.url)) {
  main()
}
