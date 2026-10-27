import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

export function TimelineList({ entries }: { entries: Entry[] }) {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(32px, 5vw, 72px)',
        paddingInline: 'clamp(18px, 6vw, 96px)',
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
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: '0.11em',
          fontSize: '2xs',
          fontWeight: 'bold',
          color: 'fieldInkMuted',
          marginBottom: '4',
        })}
      >
        Experience
      </h2>
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {entries.map((entry) => (
          <li
            key={`${entry.year}-${entry.company}-${entry.role}`}
            className={css({
              display: 'flex',
              flexDirection: { base: 'column', lg: 'row' },
              gap: { base: '1', lg: '5' },
              paddingBlock: '16px',
              borderTop: '1px solid',
              borderTopColor: 'fieldBorder',
              _last: { borderBottom: '1px solid', borderBottomColor: 'fieldBorder' },
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: { base: 'base', lg: 'md' },
                lineHeight: 'tight',
                fontVariantNumeric: 'tabular-nums',
                color: 'fieldInk',
                lg: { width: '240px', minWidth: '240px', flexShrink: 0 },
              })}
            >
              {entry.year}
            </span>
            <div
              className={css({ display: 'flex', flexDirection: 'column', gap: '1', minWidth: '0' })}
            >
              <span
                className={css({
                  fontFamily: 'body',
                  fontSize: 'base',
                  fontWeight: 'bold',
                  color: 'fieldInk',
                })}
              >
                {[entry.role, entry.company].filter(Boolean).join(', ')}
              </span>
              {entry.description ? (
                <p
                  className={css({
                    fontFamily: 'body',
                    fontSize: 'sm',
                    color: 'fieldInkMuted',
                    maxWidth: '48ch',
                  })}
                >
                  {entry.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
