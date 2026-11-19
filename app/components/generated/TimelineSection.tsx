import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { SectionHead } from './SectionHead'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const current = entry.year.includes('present')
  const heading = [entry.role, entry.company].filter((s) => s !== '').join(' · ')
  return (
    <article
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '160px minmax(0, 1fr)' },
        columnGap: '6',
        rowGap: '2',
        paddingBlock: '5',
        borderBottom: '1px solid',
        borderColor: 'border',
      })}
    >
      <span
        className={css({
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 'bold',
          fontSize: { base: 'sm', lg: 'md' },
          letterSpacing: 'wide',
          color: current ? 'accent' : 'textMuted',
        })}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <h3
          className={css({
            fontFamily: { base: 'body', lg: 'display' },
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: { base: 'base', lg: 'xl' },
            lineHeight: 'snug',
            letterSpacing: '0.01em',
            color: 'text',
          })}
        >
          {heading}
        </h3>
        {entry.description && (
          <p
            className={css({
              fontSize: 'sm',
              lineHeight: 'normal',
              color: 'textMuted',
              maxWidth: '50ch',
              marginTop: '2',
            })}
          >
            {entry.description}
          </p>
        )}
      </div>
    </article>
  )
}

export function TimelineSection() {
  return (
    <section
      className={css({
        bg: 'bg',
        color: 'text',
        paddingInline: '6vw',
        paddingTop: { base: '52px', lg: '72px' },
        paddingBottom: { base: '44px', lg: '60px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead title="Experience" tag={`${timeline.length} positions`} />
      {timeline.map((entry) => (
        <TimelineRow key={`${entry.year}-${entry.role}-${entry.company}`} entry={entry} />
      ))}
    </section>
  )
}
