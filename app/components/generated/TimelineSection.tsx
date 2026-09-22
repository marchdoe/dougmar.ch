import { css } from '../../../styled-system/css'

type Entry = { year: string; role: string; company: string; description: string }

export function TimelineSection({ entries }: { entries: Entry[] }) {
  return (
    <section
      className={css({
        bg: 'surface',
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 'md',
        marginInline: '6vw',
        paddingInline: { base: '4', md: '6' },
        paddingBlock: '7',
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
          fontSize: 'lg',
          color: 'text',
          marginBottom: '4',
        })}
      >
        Timeline
      </h2>
      <ul className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
        {entries.map((entry) => (
          <li
            key={`${entry.year}-${entry.company}`}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
              paddingBlock: '4',
              borderTop: '1px solid',
              borderColor: 'border',
              md: {
                display: 'grid',
                gridTemplateColumns: '120px minmax(0, 1fr)',
                columnGap: '4',
                alignItems: 'baseline',
                gap: '0',
              },
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
              <h3
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: { base: 'md', md: '2xl' },
                  lineHeight: 'snug',
                  color: 'text',
                  overflowWrap: 'break-word',
                })}
              >
                {entry.role}, {entry.company}
              </h3>
              {entry.description && (
                <p
                  className={css({
                    color: 'textMuted',
                    fontSize: 'base',
                    maxWidth: '50ch',
                    marginTop: '2',
                  })}
                >
                  {entry.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
