/**
 * The `Rate: <date>` issue is built by scripts/utils/rating-issue.js, shared by
 * the nightly workflow and the local-night recipe (#792). The fixtures under
 * tests/fixtures/rating-issue/ hold the title and body the workflow's inline
 * github-script built for two real nights before the extraction (checked byte
 * for byte against that script when this was written), so a change to the
 * builder that alters a normal night's issue fails here.
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
const FIXTURES = fileURLToPath(new URL('../fixtures/rating-issue', import.meta.url))
const REPO = 'marchdoe/dougmar.ch'
const NEEDS_HUMAN = '## Needs a human\n\n- one thing'
const FAULTS = '## Shipped with faults\n\n- another'

const fixture = (date, kind) => fs.readFileSync(path.join(FIXTURES, `${date}.${kind}`), 'utf8')

describe('buildRatingIssueFromArchive', () => {
  // 11-05 has a dark screenshot, 11-06 does not; both are real nights on main.
  it.each(['2026-11-05', '2026-11-06'])('matches the old inline output for %s', (date) => {
    const plain = buildRatingIssueFromArchive({ archiveDir: ARCHIVE, date, repo: REPO })
    expect(plain.title).toBe(fixture(date, 'title.txt'))
    expect(plain.body).toBe(fixture(date, 'body.md'))
  })

  it.each(['2026-11-05', '2026-11-06'])(
    'appends the two sections after the form for %s',
    (date) => {
      const full = buildRatingIssueFromArchive({
        archiveDir: ARCHIVE,
        date,
        repo: REPO,
        needsHuman: NEEDS_HUMAN,
        shippedWithFaults: FAULTS,
      })
      expect(full.body).toBe(`${fixture(date, 'body.md')}\n\n${NEEDS_HUMAN}\n\n${FAULTS}`)
    }
  )

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
