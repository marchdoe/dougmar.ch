import type { timeline as TimelineRef } from '../../content/timeline'
import { timeline } from '../../content/timeline'
import { css } from '../../../styled-system/css'

type Entry = (typeof TimelineRef)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const head = [entry.role, entry.company].filter((s) => s !== '').join(', ')
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '140px minmax(0, 1fr)' },
        columnGap: '6',
        rowGap: '1',
        paddingBlock: '4',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
      })}
    >
      <span
        className={css({
          textStyle: 'sm',
          fontWeight: 'bold',
          letterSpacing: 'wide',
          color: 'accentAlt',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {entry.year}
      </span>
      <div className={css({ maxWidth: '60ch', minWidth: '0' })}>
        <div className={css({ textStyle: 'base', fontWeight: 'bold', color: 'text' })}>{head}</div>
        {entry.description ? (
          <p
            className={css({
              textStyle: 'sm',
              color: 'textMuted',
              marginTop: '2',
              maxWidth: '60ch',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export function AboutTimeline() {
  return (
    <section
      aria-label="Experience"
      className={css({
        bg: 'bg',
        paddingInline: 'clamp(20px, 6vw, 96px)',
        paddingBlock: 'clamp(32px, 5vw, 64px)',
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
          fontVariant: 'small-caps',
          textStyle: '2xl',
          letterSpacing: 'wide',
          color: 'text',
          marginBottom: '4',
        })}
      >
        Experience
      </h2>
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </ol>
    </section>
  )
}
