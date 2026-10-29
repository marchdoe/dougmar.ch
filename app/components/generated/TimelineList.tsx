import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

export function TimelineList() {
  return (
    <section className={css({ paddingInline: { base: '7vw', md: '6vw' }, paddingBottom: '7' })}>
      <h2
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '4',
        })}
      >
        Experience
      </h2>
      <ul>
        {timeline.map((entry) => (
          <li
            key={`${entry.year}-${entry.company}-${entry.role}`}
            className={css({
              display: { base: 'block', md: 'grid' },
              gridTemplateColumns: { md: '140px 1fr' },
              columnGap: '6',
              paddingBlock: '5',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'borderStrong',
            })}
          >
            <div
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wide',
                color: 'textFaint',
                marginBottom: { base: '2', md: '0' },
              })}
            >
              {entry.year}
            </div>
            <div>
              <h3
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: { base: 'base', md: 'md' },
                  lineHeight: 'snug',
                  color: 'text',
                })}
              >
                {[entry.role, entry.company].filter(Boolean).join(', ')}
              </h3>
              {entry.description ? (
                <p
                  className={css({
                    marginTop: '2',
                    fontSize: '15px',
                    lineHeight: '1.5',
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
      </ul>
    </section>
  )
}
