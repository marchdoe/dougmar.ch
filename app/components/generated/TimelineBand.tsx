import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { TimelineRow } from './TimelineRow'

export function TimelineBand() {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: { base: '72px', xl: '88px' },
        paddingInline: '6vw',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          rowGap: '8px',
          columnGap: '16px',
          paddingBottom: '14px',
          marginBottom: '8px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 500,
            fontSize: 'lg',
            letterSpacing: 'tight',
            color: 'fieldInk',
          })}
        >
          The record
        </h2>
        <span
          className={css({
            fontFamily: 'body',
            fontSize: 'xs',
            fontWeight: 600,
            fontVariantCaps: 'all-small-caps',
            letterSpacing: 'wide',
            color: 'fieldInkMuted',
          })}
        >
          2006 to present
        </span>
      </div>
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </ul>
    </section>
  )
}
