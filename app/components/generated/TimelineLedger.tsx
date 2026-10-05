import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

export function TimelineLedger() {
  return (
    <section
      className={css({
        bg: 'surface',
        borderTopWidth: '3px',
        borderTopStyle: 'solid',
        borderTopColor: 'field',
        paddingBlock: 'clamp(22px, 6vw, 56px)',
        paddingInline: 'clamp(20px, 6vw, 80px)',
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
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '16px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '12px',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'all-small-caps',
            letterSpacing: '0.03em',
            fontSize: '2xl',
            color: 'text',
          })}
        >
          The record
        </h2>
        <span
          className={css({
            fontSize: 'sm',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'textMuted',
          })}
        >
          {timeline.length} entries
        </span>
      </div>
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((t) => (
          <li
            key={`${t.year}-${t.role}-${t.company}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: '140px minmax(0, 1fr)' },
              columnGap: '24px',
              rowGap: '4px',
              paddingBlock: '16px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <span
              className={css({
                fontSize: 'sm',
                color: 'textMuted',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.04em',
              })}
            >
              {t.year}
            </span>
            <div>
              <span
                className={css({
                  display: 'block',
                  fontFamily: { base: 'body', md: 'display' },
                  fontVariant: { base: 'normal', md: 'all-small-caps' },
                  fontWeight: 'bold',
                  fontSize: { base: 'base', md: 'lg' },
                  color: 'text',
                  lineHeight: '1.25',
                })}
              >
                {t.role}
              </span>
              <span
                className={css({
                  display: 'block',
                  fontSize: 'sm',
                  color: 'textMuted',
                  marginTop: '2px',
                })}
              >
                {t.company}
              </span>
              {t.description ? (
                <p
                  className={css({
                    margin: '0',
                    marginTop: '8px',
                    fontSize: 'sm',
                    color: 'text',
                    lineHeight: '1.55',
                    maxWidth: '50ch',
                  })}
                >
                  {t.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
