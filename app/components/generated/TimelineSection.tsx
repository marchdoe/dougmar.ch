import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

export function TimelineSection() {
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
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(22px, 3vw, 34px)',
          letterSpacing: '-0.01em',
          textTransform: 'lowercase',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '14px',
          marginBottom: 'clamp(16px, 2vw, 24px)',
        })}
      >
        timeline
      </h2>
      <div>
        {timeline.map((e) => (
          <div
            key={`${e.year}-${e.role}-${e.company}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', lg: '160px 1fr' },
              columnGap: '24px',
              rowGap: '4px',
              alignItems: 'baseline',
              paddingBlock: '14px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <span
              className={css({
                fontSize: 'sm',
                fontWeight: 'bold',
                color: 'textFaint',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {e.year}
            </span>
            <div>
              <div
                className={css({
                  fontSize: { base: 'base', lg: 'lg' },
                  fontWeight: 'bold',
                  color: 'text',
                })}
              >
                {[e.role, e.company].filter(Boolean).join(', ')}
              </div>
              {e.description ? (
                <p
                  className={css({
                    fontSize: 'sm',
                    color: 'textMuted',
                    maxWidth: '50ch',
                    marginTop: '6px',
                  })}
                >
                  {e.description}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
