// Hand-written declarations for collect-ratings.js so TS test files can
// import the parser without allowJs. Keep in sync with the JS exports.

export interface ParsedRating {
  date: string
  grade: string
  worked: string
  didnt: string
  try: string
}

export interface RatingIssueComment {
  body: string
  authorAssociation?: string
}

export interface RatingIssue {
  number?: number
  title?: string
  body?: string
  comments?: RatingIssueComment[]
  author?: { login?: string } | null
}

export function parseRatingFromIssue(issue: RatingIssue): ParsedRating | null

export function isTrustedIssueAuthor(issue: Pick<RatingIssue, 'author'>): boolean
