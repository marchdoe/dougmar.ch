import { css } from '../../../styled-system/css'
import { timeline, education } from '../../content/timeline'

const rowClass = css({
  display: 'grid',
  gridTemplateColumns: { base: '70px minmax(0, 1fr)', lg: '120px minmax(0, 1fr)' },
  columnGap: '5',
  rowGap: '1',
  borderBottom: '1px solid',
  borderColor: 'border',
  paddingBlock: '5',
})

const yearClass = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'sm',
  letterSpacing: 'wide',
  color: 'textFaint',
})
const roleClass = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: { base: 'md', lg: 'xl' },
  color: 'text',
  overflowWrap: 'break-word',
})
const descClass = css({
  fontFamily: 'body',
  fontSize: 'sm',
  color: 'textMuted',
  maxWidth: '48ch',
  lineHeight: 'normal',
  marginTop: '1',
})

function formatYear(year: string, current?: boolean): string {
  const trimmed = year.trim()
  if (current) {
    const stripped = trimmed.replace(/[\s\u2013\u2014-]+$/, '')
    return `${stripped} to present`
  }
  return trimmed.replace(/\s+[\u2013\u2014-]\s+/g, '\u2013')
}

export function TimelineRows() {
  return (
    <div>
      {timeline.map((entry) => (
        <div key={`${entry.year}-${entry.company}`} className={rowClass}>
          <span className={yearClass}>{formatYear(entry.year, entry.current)}</span>
          <div>
            <span className={roleClass}>
              {entry.role ? `${entry.role}, ${entry.company}` : entry.company}
            </span>
            {entry.description ? <p className={descClass}>{entry.description}</p> : null}
          </div>
        </div>
      ))}
      <div className={rowClass}>
        <span className={yearClass}>{education.years}</span>
        <div>
          <span className={roleClass}>
            {education.degree}, {education.school}
          </span>
          <p className={descClass}>{education.concentration}</p>
        </div>
      </div>
    </div>
  )
}
