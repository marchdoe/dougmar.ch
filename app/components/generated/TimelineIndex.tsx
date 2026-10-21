import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '150px minmax(0, 1fr)' },
        alignItems: 'baseline',
        columnGap: 'clamp(14px, 2.4vw, 40px)',
        rowGap: '4px',
        paddingBlock: 'clamp(14px, 1.8vw, 26px)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'border',
      })}
    >
      <span className={css({ fontSize: { base: '14px', md: '18px' }, color: 'textMuted' })}>
        {entry.year}
      </span>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' })}>
        <span
          className={css({
            display: 'block',
            textStyle: { base: 'base', md: 'md' },
            fontWeight: 'bold',
            color: 'text',
          })}
        >
          {entry.role}
        </span>
        {/* accent fails 4.5:1 at this size on the light ground; the company takes textMuted on a flat bg */}
        <span
          className={css({
            display: 'block',
            width: 'fit-content',
            bg: 'bg',
            textStyle: 'sm',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
          })}
        >
          {entry.company}
        </span>
        {entry.description ? (
          <p
            className={css({
              textStyle: 'sm',
              color: 'textMuted',
              maxWidth: '50ch',
              marginTop: '4px',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function TimelineIndex() {
  return (
    <section
      aria-label="Experience"
      className={css({
        paddingInline: '5vw',
        paddingBottom: 'clamp(30px, 4vw, 56px)',
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
          paddingTop: 'clamp(14px, 3vw, 40px)',
          paddingBottom: '8px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'borderStrong',
          fontSize: '14px',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        Experience
      </div>
      {timeline.map((entry) => (
        <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
      ))}
    </section>
  )
}
