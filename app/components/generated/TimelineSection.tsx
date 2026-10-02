import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const heading = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '160px minmax(0, 1fr)' },
        columnGap: '5',
        rowGap: '1',
        paddingBlock: '4',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        textStyle: 'base',
      })}
    >
      <div
        className={css({
          textStyle: 'sm',
          color: 'textMuted',
          fontVariantNumeric: 'tabular-nums',
          minWidth: { md: '160px' },
        })}
      >
        {entry.year}
      </div>
      <div className={css({ minWidth: '0' })}>
        <div className={css({ textStyle: 'base', color: 'text', fontWeight: 'bold' })}>
          {heading}
        </div>
        {entry.description && (
          <p
            className={css({
              textStyle: 'base',
              color: 'textMuted',
              maxWidth: '50ch',
              marginTop: '2',
            })}
          >
            {entry.description}
          </p>
        )}
      </div>
    </li>
  )
}

export function TimelineSection() {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(40px, 6vw, 80px)',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
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
          fontWeight: 'bold',
          fontStyle: 'italic',
          textTransform: 'uppercase',
          fontSize: 'clamp(18px, 1.5vw, 22px)',
          color: 'text',
          marginBottom: '4',
        })}
      >
        Experience
      </h2>
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}${entry.role}${entry.company}`} entry={entry} />
        ))}
      </ul>
    </section>
  )
}
