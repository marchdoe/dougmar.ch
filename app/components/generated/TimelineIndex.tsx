import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

export function TimelineIndex({ entries }: { entries: Entry[] }) {
  return (
    <section
      aria-label="Experience"
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(44px, 6vw, 72px)',
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
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'accent',
          marginBottom: '24px',
        })}
      >
        Experience
      </div>
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {entries.map((entry) => (
          <li
            key={`${entry.year}-${entry.company}-${entry.role}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', lg: '160px 1fr 1fr' },
              rowGap: '2',
              columnGap: '6',
              paddingBlock: '16px',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              _last: {
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'border',
              },
            })}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                textStyle: 'sm',
                color: 'accent',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {entry.year}
            </span>
            <span className={css({ fontFamily: 'body', textStyle: 'sm', color: 'text' })}>
              <span className={css({ fontWeight: 'bold' })}>{entry.role}</span>
              <span className={css({ display: 'block', color: 'textMuted' })}>{entry.company}</span>
            </span>
            {entry.description ? (
              <p
                className={css({
                  fontFamily: 'body',
                  textStyle: 'sm',
                  color: 'textMuted',
                  maxWidth: '48ch',
                })}
              >
                {entry.description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
