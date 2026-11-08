/**
 * The `Rate: <date>` issue is built by scripts/utils/rating-issue.js, shared by
 * the nightly workflow and the local-night recipe (#792). `legacyInlineIssue`
 * below is the body the workflow's inline github-script built before the
 * extraction, kept verbatim so a real archived night proves the output did not
 * change.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'

import { parseRatingFromIssue } from '../../scripts/collect-ratings.js'
import {
  buildRatingIssueFromArchive,
  findExistingRatingIssue,
} from '../../scripts/utils/rating-issue.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const ARCHIVE = fileURLToPath(new URL('../../archive', import.meta.url))
const REPO = 'marchdoe/dougmar.ch'

/** The pre-extraction github-script body, with `today` and the temp-file reads as arguments. */
function legacyInlineIssue(today, needsHuman, shippedWithFaults) {
  const fsx = fs
  const cwdArchive = (p) => path.join(ROOT, p)
  let brief = ''
  try {
    const briefMd = fsx.readFileSync(cwdArchive(`archive/${today}/brief.md`), 'utf8')
    brief = briefMd.match(/\*\*Design Brief:\*\*\s*(.+)/)?.[1] || ''
  } catch {}
  const hero = brief.slice(0, 60) || today
  let buildId = ''
  try {
    buildId = JSON.parse(
      fsx.readFileSync(cwdArchive(`archive/${today}/record.json`), 'utf8')
    ).buildId
  } catch {}
  if (!buildId) {
    try {
      buildId = fsx
        .readdirSync(cwdArchive(`archive/${today}`))
        .filter((d) => /^build-\d+$/.test(d))
        .sort()
        .at(-1)
        ?.slice('build-'.length)
    } catch {}
  }
  const buildDir = `archive/${today}/build-${buildId}`
  const rawBase = `https://raw.githubusercontent.com/${REPO}/main/${buildDir}`
  const img = `${rawBase}/screenshot.png`
  const hasDark = fsx.existsSync(cwdArchive(`${buildDir}/screenshot-dark.png`))
  const designImages = hasDark
    ? `<img src="${img}" width="49%" alt="today's design in light mode"> <img src="${rawBase}/screenshot-dark.png" width="49%" alt="today's design in dark mode"><br>Light and dark.`
    : `![today's design](${img})\n\nOne look tonight: light and dark render the same.`
  const mobileFile = fsx.existsSync(cwdArchive(`${buildDir}/viewports/mobile.webp`))
    ? 'mobile.webp'
    : 'mobile.png'
  const mobileImg = `${rawBase}/viewports/${mobileFile}`
  const body = [
    designImages,
    ``,
    `<img src="${mobileImg}" width="270" alt="today's design at phone width"><br>First fold at 360.`,
    ``,
    brief ? `> ${brief}` : '',
    ``,
    `Live: https://dougmar.ch · [Archive entry](https://dougmar.ch/archive/${today})`,
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
  return { title: `Rate: ${today} — "${hero}"`, body }
}

describe('buildRatingIssueFromArchive', () => {
  // 11-05 has a dark screenshot, 11-06 does not; both are real nights on main.
  for (const date of ['2026-11-05', '2026-11-06']) {
    it(`matches the old inline output for ${date}`, () => {
      const nh = '## Needs a human\n\n- one thing'
      const sf = '## Shipped with faults\n\n- another'
      for (const [a, b] of [
        ['', ''],
        [nh, sf],
      ]) {
        const next = buildRatingIssueFromArchive({
          archiveDir: ARCHIVE,
          date,
          repo: REPO,
          needsHuman: a,
          shippedWithFaults: b,
        })
        const legacy = legacyInlineIssue(date, a, b)
        expect(next.title).toBe(legacy.title)
        expect(next.body).toBe(legacy.body)
      }
    })
  }

  it('picks the light-and-dark layout only when a dark screenshot exists', () => {
    const dark = buildRatingIssueFromArchive({
      archiveDir: ARCHIVE,
      date: '2026-11-05',
      repo: REPO,
    })
    const light = buildRatingIssueFromArchive({
      archiveDir: ARCHIVE,
      date: '2026-11-06',
      repo: REPO,
    })
    expect(dark.body).toContain('screenshot-dark.png')
    expect(light.body).not.toContain('screenshot-dark.png')
  })

  it('writes a body and title parseRatingFromIssue reads once graded', () => {
    const { title, body } = buildRatingIssueFromArchive({
      archiveDir: ARCHIVE,
      date: '2026-11-06',
      repo: REPO,
    })
    const issue = (text) => ({
      title,
      body: text,
      author: { login: 'marchdoe' },
      comments: [],
    })
    // The template line carries a comment, so a rater edits it; simulate that.
    const parsed = parseRatingFromIssue(issue(body.replace(/grade: B .*/, 'grade: A')))
    expect(parsed?.date).toBe('2026-11-06')
    expect(parsed?.grade).toBe('A')
    const fence = /```ya?ml\s*\n([\s\S]*?)```/.exec(body)
    expect(yaml.load(fence?.[1] ?? '')).toMatchObject({
      grade: 'B',
      worked: '',
      didnt: '',
      try: '',
    })
  })
})

describe('findExistingRatingIssue', () => {
  it('finds an issue for the date and ignores other dates', () => {
    const list = () => [
      { number: 5, title: 'Rate: 2026-11-05 — "x"' },
      { number: 6, title: 'Something about Rate: 2026-11-06' },
    ]
    expect(findExistingRatingIssue('2026-11-05', list)?.number).toBe(5)
    expect(findExistingRatingIssue('2026-11-06', list)).toBeNull()
  })
})

describe('the nightly workflow', () => {
  it('opens the issue through scripts/open-rating-issue.js', () => {
    const daily = yaml.load(
      fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'daily-redesign.yml'), 'utf8')
    )
    const step = daily.jobs.publish.steps.find((s) => s.name === "Open today's rating issue")
    expect(step.run).toContain('node scripts/open-rating-issue.js')
    expect(step.uses).toBeUndefined()
  })
})
