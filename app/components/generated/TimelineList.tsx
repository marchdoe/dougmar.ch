import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

const rows = timeline.map((e) => ({
  year: e.year,
  description: e.description,
  heading: [e.role, e.company].filter(Boolean).join(' · '),
}))

export function TimelineList() {
  return (
    <section aria-labelledby="record" className={css({ minWidth: '0' })}>
      <h2
        id="record"
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textStyle: '2xl',
          color: 'text',
          paddingBottom: '10px',
          borderBottom: '2px solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        Experience
      </h2>
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {rows.map((e) => (
          <li
            key={`${e.year}-${e.heading}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', lg: '160px 1fr' },
              columnGap: '5',
              rowGap: '1',
              paddingBlock: '16px',
              borderBottom: '1px solid',
              borderBottomColor: 'border',
            })}
          >
            <div
              className={css({
                fontFamily: 'body',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
                fontWeight: 'bold',
                textStyle: 'xs',
                color: 'accent',
                paddingTop: { lg: '4px' },
              })}
            >
              {e.year}
            </div>
            <div className={css({ minWidth: '0' })}>
              <h3
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontVariant: 'small-caps',
                  letterSpacing: 'wide',
                  textStyle: { base: 'base', lg: 'md' },
                  color: 'text',
                  maxWidth: '50ch',
                })}
              >
                {e.heading}
              </h3>
              {e.description ? (
                <p
                  className={css({
                    fontFamily: 'display',
                    textStyle: 'base',
                    color: 'textMuted',
                    maxWidth: '50ch',
                    marginTop: '6px',
                  })}
                >
                  {e.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
