import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

function joinParts(parts: string[]) {
  return parts.filter(Boolean).join(', ')
}

export function Timeline() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: { base: '38px', lg: '48px' },
        paddingLeft: { base: '20px', lg: '48px' },
        paddingRight: { base: '20px', lg: '6vw' },
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
          fontStyle: 'italic',
          fontWeight: 'normal',
          textTransform: 'lowercase',
          textStyle: '3xl',
          lineHeight: 'tight',
          marginBottom: '28px',
        })}
      >
        experience
      </h2>
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((entry) => (
          <li
            key={`${entry.year}-${entry.company}-${entry.role}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '120px minmax(0, 1fr)' },
              columnGap: '6',
              rowGap: '1',
              paddingBlock: '4',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
            })}
          >
            <span
              className={css({
                fontSize: 'sm',
                color: 'textFaint',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {entry.year}
            </span>
            <div className={css({ minWidth: '0' })}>
              <div
                className={css({
                  fontSize: { base: 'base', lg: 'md' },
                  fontWeight: 'bold',
                  color: 'text',
                })}
              >
                {joinParts([entry.role, entry.company])}
              </div>
              {entry.description ? (
                <p
                  className={css({
                    margin: '0',
                    marginTop: '2',
                    maxWidth: '60ch',
                    fontSize: { base: 'sm', lg: 'base' },
                    color: 'textMuted',
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
