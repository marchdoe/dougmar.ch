import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

export function TimelineLedger() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(48px, 6vw, 88px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontSize: '13px',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '12px',
        })}
      >
        Experience
      </h2>
      {timeline.map((entry) => (
        <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
      ))}
    </section>
  )
}

function TimelineRow({ entry }: { entry: Entry }) {
  const heading = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', md: '140px minmax(0, 1fr)' },
        columnGap: '24px',
        rowGap: '4px',
        paddingBlock: '18px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontSize: 'sm',
          color: 'textMuted',
          minWidth: { md: '140px' },
        })}
      >
        {entry.year}
      </div>
      <div className={css({ minWidth: '0' })}>
        <div
          className={css({
            fontFamily: 'body',
            fontSize: { base: 'base', md: 'lg' },
            color: 'text',
            lineHeight: '1.3',
          })}
        >
          {heading}
        </div>
        {entry.description ? (
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'md',
              color: 'textMuted',
              maxWidth: '48ch',
              marginTop: '6px',
              lineHeight: '1.5',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}
