import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

export function TimelineSection() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(48px, 8vh, 112px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
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
          fontWeight: 'normal',
          fontSize: 'clamp(26px, 3.4vw, 38px)',
          color: 'text',
          marginBottom: '6',
        })}
      >
        Experience
      </h2>
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((entry) => (
          <li
            key={`${entry.year}-${entry.company}-${entry.role}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: '140px 1fr' },
              columnGap: '5',
              rowGap: '1',
              paddingBlock: '4',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
            })}
          >
            {/* mockup year ink #cf9a33 has no token; accent is the nearest brass */}
            <span
              className={css({
                fontFamily: 'body',
                fontSize: 'sm',
                color: 'accent',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 'bold',
              })}
            >
              {entry.year}
            </span>
            <div className={css({ display: 'grid', gap: '1' })}>
              <span
                className={css({
                  fontFamily: { base: 'body', md: 'display' },
                  fontSize: { base: 'base', md: 'lg' },
                  color: 'text',
                })}
              >
                {[entry.role, entry.company].filter(Boolean).join(', ')}
              </span>
              {entry.description && (
                <span
                  className={css({
                    fontFamily: 'body',
                    fontSize: 'sm',
                    color: 'textMuted',
                    maxWidth: '60ch',
                    lineHeight: '1.6',
                  })}
                >
                  {entry.description}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
