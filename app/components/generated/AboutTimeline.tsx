import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

export function AboutTimeline() {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(40px, 6vw, 96px)',
        paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
      })}
    >
      <h2
        className={css({
          marginBottom: '5',
          textStyle: 'xs',
          fontWeight: 'semibold',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        Experience
      </h2>
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((entry) => (
          <li
            key={`${entry.year}-${entry.role}-${entry.company}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: '160px 1fr' },
              columnGap: '6',
              rowGap: '1',
              paddingBlock: '5',
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
            {/* mockup --amberSmall #8F520D maps to fieldInkMuted, nearest amber ink token */}
            <span
              className={css({
                textStyle: 'sm',
                fontWeight: 'semibold',
                fontVariantNumeric: 'tabular-nums',
                color: 'fieldInkMuted',
                minWidth: { md: '160px' },
              })}
            >
              {entry.year}
            </span>
            <div className={css({ minWidth: '0' })}>
              <span
                className={css({
                  display: 'block',
                  fontFamily: { base: 'body', md: 'display' },
                  fontWeight: { base: 'semibold', md: 'medium' },
                  fontSize: { base: 'base', md: 'lg' },
                  lineHeight: 'snug',
                })}
              >
                {[entry.role, entry.company].filter(Boolean).join(', ')}
              </span>
              {entry.description ? (
                <p
                  className={css({
                    marginTop: '2',
                    marginBottom: '0',
                    textStyle: 'base',
                    color: 'textMuted',
                    maxWidth: '60ch',
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
