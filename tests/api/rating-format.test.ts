import { describe, it, expect } from 'vitest'
import * as yaml from 'js-yaml'
import { formatRatingComment } from '../../api/_lib/rating-format'
// Real harvest parser — the round-trip target.
import { parseRatingFromIssue } from '../../scripts/collect-ratings.js'

const issueWith = (comment: string) => ({
  title: 'Rate: 2026-07-20 — "Breadboard-amber Poster"',
  body: '',
  author: { login: 'app/github-actions' },
  // Panel-posted comments are authored by the owner's token
  comments: [{ body: comment, authorAssociation: 'OWNER' }],
})

describe('formatRatingComment', () => {
  it('round-trips through parseRatingFromIssue', () => {
    const comment = formatRatingComment({
      grade: 'B',
      worked: 'the amber drench',
      didnt: 'cramped sidebar',
      try: 'bigger hero type',
    })
    const parsed = parseRatingFromIssue(issueWith(comment))
    expect(parsed).toEqual({
      date: '2026-07-20',
      grade: 'B',
      worked: 'the amber drench',
      didnt: 'cramped sidebar',
      try: 'bigger hero type',
    })
  })

  it('survives double quotes and newlines in notes', () => {
    const comment = formatRatingComment({
      grade: 'A',
      worked: 'the "drench" was\ngreat',
      didnt: '',
      try: '',
    })
    const parsed = parseRatingFromIssue(issueWith(comment))
    expect(parsed?.grade).toBe('A')
    expect(parsed?.worked).toBe("the 'drench' was great")
  })

  it('round-trips empty notes', () => {
    const comment = formatRatingComment({ grade: 'D', worked: '', didnt: '', try: '' })
    const parsed = parseRatingFromIssue(issueWith(comment))
    expect(parsed).toEqual({ date: '2026-07-20', grade: 'D', worked: '', didnt: '', try: '' })
  })

  it('survives backticks in notes without breaking the fence', () => {
    const comment = formatRatingComment({
      grade: 'C',
      worked: '',
      didnt: 'the ```code``` blocks clipped',
      try: '',
    })
    const parsed = parseRatingFromIssue(issueWith(comment))
    expect(parsed?.grade).toBe('C')
    expect(parsed?.didnt).toBe("the '''code''' blocks clipped")
  })
})

describe('formatRatingComment emits valid YAML', () => {
  const yamlBody = (comment: string) => comment.split('\n').slice(1, -1).join('\n')

  it('neutralises a trailing backslash so the scalar does not run into the next line', () => {
    const comment = formatRatingComment({
      grade: 'B',
      worked: 'nice \\',
      didnt: 'C:\\Users\\doug',
      try: '',
    })
    expect(() => yaml.load(yamlBody(comment))).not.toThrow()
    const parsed = parseRatingFromIssue(issueWith(comment))
    expect(parsed?.worked).toBe('nice /')
    expect(parsed?.didnt).toBe('C:/Users/doug')
    expect(yaml.load(yamlBody(comment))).toMatchObject({ worked: 'nice /', didnt: 'C:/Users/doug' })
  })
})
