import type { Grade } from '../../app/types/panel.js'

export interface RatingInput {
  grade: Grade
  worked: string
  didnt: string
  try: string
}

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/"/g, "'").replace(/`/g, "'").replace(/\\/g, '/').trim()
}

/** Build the YAML-fenced comment that scripts/collect-ratings.js harvests. */
export function formatRatingComment(r: RatingInput): string {
  return [
    '```yaml',
    `grade: ${r.grade}`,
    `worked: "${clean(r.worked)}"`,
    `didnt: "${clean(r.didnt)}"`,
    `try: "${clean(r.try)}"`,
    '```',
  ].join('\n')
}
