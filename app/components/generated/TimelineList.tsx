import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

export function TimelineList() {
  return (
    <section
      className={css({
        paddingTop: { base: '24px', lg: '48px' },
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
          fontSize: '13px',
          fontVariant: 'small-caps',
          letterSpacing: 'wider',
          color: 'textFaint',
          marginBottom: '20px',
        })}
      >
        Experience
      </div>
      <div className={css({ borderTop: '1px solid', borderColor: 'border' })}>
        {timeline.map((entry) => (
          <div
            key={`${entry.year}-${entry.company}-${entry.role}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', lg: '140px 1fr' },
              columnGap: '24px',
              rowGap: '4px',
              paddingBlock: '20px',
              borderBottom: '1px solid',
              borderColor: 'border',
            })}
          >
            {/* Mockup ice year (#52A5E0) has no token; nearest semantic ink is textMuted. */}
            <div
              className={css({
                fontSize: { base: '14px', lg: '16px' },
                color: 'textMuted',
                fontVariantNumeric: 'tabular-nums',
                paddingTop: { base: '0', lg: '6px' },
              })}
            >
              {entry.year}
            </div>
            <div className={css({ minWidth: '0' })}>
              <div
                className={css({
                  fontFamily: { base: 'body', lg: 'display' },
                  fontSize: { base: '16px', lg: '26px' },
                  lineHeight: '1.2',
                  color: 'text',
                })}
              >
                {[entry.role, entry.company].filter(Boolean).join(', ')}
              </div>
              {entry.description ? (
                <p
                  className={css({
                    marginTop: '8px',
                    fontSize: '15px',
                    lineHeight: '1.55',
                    color: 'textMuted',
                    maxWidth: '60ch',
                  })}
                >
                  {entry.description}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
