import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const who = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', md: '140px minmax(0, 1fr)' },
        columnGap: '16px',
        rowGap: '4px',
        paddingBlock: 'clamp(16px, 2vw, 22px)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <span
        className={css({
          fontSize: 'sm',
          color: 'textFaint',
          fontVariantNumeric: 'tabular-nums',
          paddingTop: { md: '4px' },
        })}
      >
        {entry.year}
      </span>
      <div>
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: '600',
            fontSize: { base: 'base', md: 'md' },
            lineHeight: '1.2',
            color: 'text',
          })}
        >
          {who}
        </div>
        {entry.description && (
          <p
            className={css({
              marginTop: '8px',
              maxWidth: '50ch',
              fontSize: 'base',
              lineHeight: '1.5',
              color: 'textMuted',
            })}
          >
            {entry.description}
          </p>
        )}
      </div>
    </div>
  )
}

export function TimelineIndex() {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
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
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '16px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '12px',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: '600',
            fontSize: 'clamp(20px, 2.4vw, 26px)',
            letterSpacing: '-0.01em',
            textTransform: 'lowercase',
          })}
        >
          experience
        </h2>
        <span
          className={css({
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'textFaint',
          })}
        >
          {timeline.length} roles
        </span>
      </div>
      {timeline.map((entry) => (
        <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
      ))}
    </section>
  )
}
