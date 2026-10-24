import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { Kicker } from './Kicker'

export function TimelineSection() {
  return (
    <section
      className={css({
        paddingInline: '5vw',
        paddingBottom: '8',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ maxWidth: '1180px', marginInline: 'auto' })}>
        <Kicker>Experience</Kicker>
        {timeline.map((entry) => (
          <div
            key={`${entry.year}-${entry.company}-${entry.role}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '300px minmax(0, 1fr)' },
              columnGap: '6',
              rowGap: '2',
              paddingBlock: '5',
              borderTop: '1px solid',
              borderTopColor: 'border',
            })}
          >
            <span
              className={css({
                fontFamily: { base: 'body', lg: 'display' },
                fontSize: { base: 'sm', lg: 'md' },
                fontWeight: { base: 'bold', lg: 'normal' },
                lineHeight: '1.1',
                color: 'text',
              })}
            >
              {entry.year}
            </span>
            <div
              className={css({ display: 'flex', flexDirection: 'column', gap: '1', minWidth: '0' })}
            >
              <span className={css({ textStyle: 'base', fontWeight: 'bold', color: 'text' })}>
                {entry.role}
              </span>
              <span className={css({ textStyle: 'sm', color: 'textMuted' })}>{entry.company}</span>
              {entry.description ? (
                <p
                  className={css({
                    textStyle: 'sm',
                    color: 'text',
                    maxWidth: '48ch',
                    marginTop: '1',
                  })}
                >
                  {entry.description}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
