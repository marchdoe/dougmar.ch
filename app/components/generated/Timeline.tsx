import { css } from '../../../styled-system/css'
import type { TimelineEntry, Education } from '../../content/timeline'

export function Timeline({
  entries,
  education,
}: {
  entries: TimelineEntry[]
  education: Education
}) {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        padding: { base: '9 5 10', lg: '64px 40px 56px' },
        borderTop: '1px solid',
        borderColor: 'borderStrong',
      })}
    >
      <p
        className={css({
          fontWeight: 'bold',
          fontSize: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'accentAlt',
          marginBottom: '4',
        })}
      >
        Timeline
      </p>
      {entries.map((entry) => (
        <div
          key={`${entry.year}-${entry.company}`}
          className={css({
            display: 'flex',
            gap: '5',
            padding: '4 0',
            borderBottom: '1px solid',
            borderColor: 'border',
          })}
        >
          <span
            className={css({
              flex: '0 0 120px',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'base',
              color: 'textFaint',
            })}
          >
            {entry.year}
          </span>
          <div className={css({ flex: '1', minWidth: 0 })}>
            <p
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'lg',
                color: 'text',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              })}
            >
              {entry.role} · {entry.company}
            </p>
            <p
              className={css({
                fontSize: 'sm',
                color: 'textMuted',
                maxWidth: '64ch',
                marginTop: '1',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              })}
            >
              {entry.description}
            </p>
          </div>
        </div>
      ))}
      <div className={css({ display: 'flex', gap: '5', padding: '5 0 0' })}>
        <span
          className={css({
            flex: '0 0 120px',
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'base',
            color: 'textFaint',
          })}
        >
          {education.years}
        </span>
        <div className={css({ flex: '1', minWidth: 0 })}>
          <p
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'lg',
              color: 'text',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            })}
          >
            {education.degree}, {education.concentration}
          </p>
          <p
            className={css({
              fontSize: 'sm',
              color: 'textMuted',
              marginTop: '1',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            })}
          >
            {education.school}
          </p>
        </div>
      </div>
    </section>
  )
}
