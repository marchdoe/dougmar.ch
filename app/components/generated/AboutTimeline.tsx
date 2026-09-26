import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { SectionHead } from './SectionHead'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const title = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '140px 1fr' },
        columnGap: '5',
        rowGap: '1',
        paddingBlock: { base: '16px', lg: '20px' },
        paddingInline: '4px',
        borderBottom: '1px solid',
        borderColor: 'border',
        _first: { borderTopWidth: '1px', borderTopStyle: 'solid' },
      })}
    >
      <div
        className={css({
          fontSize: 'sm',
          color: 'textFaint',
          fontVariantNumeric: 'tabular-nums',
          minWidth: { md: '140px' },
        })}
      >
        {entry.year}
      </div>
      <div className={css({ minWidth: '0' })}>
        <div
          className={css({
            fontFamily: 'display',
            fontSize: { base: 'base', md: 'xl' },
            lineHeight: 'snug',
            color: 'text',
          })}
        >
          {title}
        </div>
        {entry.description ? (
          <p
            className={css({
              fontSize: 'sm',
              color: 'textMuted',
              maxWidth: '50ch',
              marginTop: '1',
              marginBottom: '0',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function AboutTimeline() {
  return (
    <section
      className={css({
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead title="The record" meta={`${timeline.length} roles`} />
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </div>
    </section>
  )
}
