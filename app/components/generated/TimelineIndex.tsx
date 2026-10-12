import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { IndexLabel } from './IndexLabel'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <article
      className={css({
        display: { base: 'block', md: 'grid' },
        gridTemplateColumns: { md: '160px minmax(0, 1fr)' },
        columnGap: { md: '24px' },
        alignItems: 'baseline',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        paddingTop: { base: '14px', md: '18px' },
        paddingBottom: { base: '18px', md: '22px' },
      })}
    >
      <span
        className={css({
          display: 'block',
          fontWeight: 'bold',
          fontSize: { base: 'sm', md: 'md' },
          color: 'accent',
          letterSpacing: '0.02em',
        })}
      >
        {entry.year}
      </span>
      <div>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontVariant: 'small-caps',
            fontSize: { base: 'base', md: '2xl' },
            lineHeight: 'snug',
            color: 'text',
          })}
        >
          {[entry.role, entry.company].filter(Boolean).join(', ')}
        </h2>
        {entry.description ? (
          <p
            className={css({
              marginTop: '10px',
              maxWidth: '50ch',
              fontSize: 'base',
              lineHeight: '1.5',
              color: 'textMuted',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export function TimelineIndex() {
  return (
    <section
      className={css({
        marginTop: { base: '34px', md: '40px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <IndexLabel>Experience</IndexLabel>
      {timeline.map((e) => (
        <TimelineRow key={`${e.year}-${e.role}-${e.company}`} entry={e} />
      ))}
    </section>
  )
}
