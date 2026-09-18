import { css } from '../../../styled-system/css'

type Entry = { year: string; role: string; company: string; description: string; current?: boolean }

export function AboutTimeline({
  timeline,
  capabilities,
}: {
  timeline: Entry[]
  capabilities: string[]
}) {
  return (
    <section
      className={css({
        bg: 'bg',
        color: 'text',
        minWidth: 0,
        padding: { base: '5', md: '7' },
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
      })}
    >
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        {timeline.map((entry) => (
          <div
            key={`${entry.year}-${entry.company}`}
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4',
              padding: '3',
              borderBottom: '1px solid',
              borderColor: 'border',
              alignItems: 'baseline',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'sm',
                color: 'textFaint',
                flex: '0 0 100px',
              })}
            >
              {entry.year}
            </span>
            <div className={css({ minWidth: 0, flex: '1 1 200px' })}>
              <p
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'lg',
                  color: 'text',
                })}
              >
                {entry.role} &middot; {entry.company}
              </p>
              <p
                className={css({
                  fontSize: 'base',
                  color: 'textMuted',
                  marginTop: '1',
                  maxWidth: '62ch',
                })}
              >
                {entry.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
          gap: '2',
        })}
      >
        {capabilities.map((cap) => (
          <span
            key={cap}
            className={css({
              bg: 'surface',
              color: 'text',
              borderRadius: 'sm',
              minHeight: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2',
              fontSize: 'xs',
              fontWeight: 'bold',
              textAlign: 'center',
            })}
          >
            {cap}
          </span>
        ))}
      </div>
    </section>
  )
}
