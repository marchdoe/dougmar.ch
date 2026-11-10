/**
 * Build the daily `Rate: <date>` issue (title and body) from `archive/<date>/`.
 *
 * Both the nightly workflow's `publish` job and the local-night recipe open the
 * issue through `scripts/open-rating-issue.js`, which calls this module, so the
 * two can't drift. The body keeps the fenced YAML block
 * `parseRatingFromIssue` (scripts/collect-ratings.js) reads, and the title keeps
 * the `Rate: <date>` prefix it matches on.
 */

import fs from 'node:fs'
import path from 'node:path'

/** The brief's first line: the `**Design Brief:**` text in `brief.md`, or ''. */
export function readBrief(archiveDir, date) {
  try {
    const md = fs.readFileSync(path.join(archiveDir, date, 'brief.md'), 'utf8')
    return md.match(/\*\*Design Brief:\*\*\s*(.+)/)?.[1] || ''
  } catch {
    return ''
  }
}

/**
 * The id of the build that shipped. record.json names it; without it, take the
 * newest `build-<id>` directory. '' when neither exists.
 */
export function readBuildId(archiveDir, date) {
  let buildId = ''
  try {
    buildId = JSON.parse(
      fs.readFileSync(path.join(archiveDir, date, 'record.json'), 'utf8')
    ).buildId
  } catch {}
  if (!buildId) {
    try {
      buildId = fs
        .readdirSync(path.join(archiveDir, date))
        .filter((d) => /^build-\d+$/.test(d))
        .sort()
        .at(-1)
        ?.slice('build-'.length)
    } catch {}
  }
  return buildId || ''
}

/**
 * Title and body for one night.
 *
 * @param {object} input
 * @param {string} input.date YYYY-MM-DD
 * @param {string} input.brief
 * @param {boolean} input.hasDark whether screenshot-dark.png exists
 * @param {string} input.mobileFile 'mobile.webp' or 'mobile.png'
 * @param {string} input.rawBase raw.githubusercontent.com URL of the build dir on main
 * @param {string} input.needsHuman section text, '' when none
 * @param {string} input.shippedWithFaults section text, '' when none
 * @returns {{ title: string, body: string }}
 */
export function buildRatingIssue({
  date,
  brief,
  hasDark,
  mobileFile,
  rawBase,
  needsHuman,
  shippedWithFaults,
}) {
  const hero = brief.slice(0, 60) || date
  const img = `${rawBase}/screenshot.png`
  // Visitors can switch modes (#691), so a rating covers both. The dark file
  // exists only when dark renders differently from light.
  const designImages = hasDark
    ? `<img src="${img}" width="49%" alt="today's design in light mode"> <img src="${rawBase}/screenshot-dark.png" width="49%" alt="today's design in dark mode"><br>Light and dark.`
    : `![today's design](${img})\n\nOne look tonight: light and dark render the same.`
  const mobileImg = `${rawBase}/viewports/${mobileFile}`
  const body = [
    designImages,
    ``,
    `<img src="${mobileImg}" width="270" alt="today's design at phone width"><br>First fold at 360.`,
    ``,
    brief ? `> ${brief}` : '',
    ``,
    `Live: https://dougmar.ch · [Archive entry](https://dougmar.ch/archive/${date})`,
    ``,
    `Rate it (edit the YAML in a reply, ~2 min):`,
    '```yaml',
    'grade: B        # A-D',
    'worked: ""',
    `didnt: ""`,
    'try: ""',
    '```',
    ...(needsHuman ? ['', needsHuman] : []),
    ...(shippedWithFaults ? ['', shippedWithFaults] : []),
  ].join('\n')
  return { title: `Rate: ${date} — "${hero}"`, body }
}

/**
 * Read a night from disk and build its issue. The images are read from the
 * build dir on main: the copies under public/archive-data/ are made at build
 * time and not committed (#549), so a raw URL there would 404.
 *
 * @param {object} opts
 * @param {string} opts.archiveDir
 * @param {string} opts.date
 * @param {string} opts.repo `owner/name`
 * @param {string} [opts.needsHuman]
 * @param {string} [opts.shippedWithFaults]
 */
export function buildRatingIssueFromArchive({
  archiveDir,
  date,
  repo,
  needsHuman = '',
  shippedWithFaults = '',
}) {
  const brief = readBrief(archiveDir, date)
  const buildId = readBuildId(archiveDir, date)
  const buildDir = path.join(archiveDir, date, `build-${buildId}`)
  const hasDark = fs.existsSync(path.join(buildDir, 'screenshot-dark.png'))
  // The mobile viewport capture, WebP since #549; builds before that wrote PNG.
  const mobileFile = fs.existsSync(path.join(buildDir, 'viewports', 'mobile.webp'))
    ? 'mobile.webp'
    : 'mobile.png'
  const rawBase = `https://raw.githubusercontent.com/${repo}/main/archive/${date}/build-${buildId}`
  return buildRatingIssue({
    date,
    brief,
    hasDark,
    mobileFile,
    rawBase,
    needsHuman: needsHuman.trim(),
    shippedWithFaults: shippedWithFaults.trim(),
  })
}

/**
 * The open or closed `Rate: <date>` issue already on file, or null.
 * `listIssues` takes a search string and returns `[{ number, title }]`.
 */
export function findExistingRatingIssue(date, listIssues) {
  const hits = listIssues(`Rate: ${date} in:title`)
  return hits.find((i) => i.title.startsWith(`Rate: ${date}`)) ?? null
}
