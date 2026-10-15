import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

export function AboutTimeline() {
  return (
    <section
      className={css({ bg: 'surface', paddingTop: '7', paddingBottom: '8', paddingInline: '6vw' })}
    >
      <div className={css({ maxWidth: '1400px', marginInline: 'auto', minWidth: '0' })}>
        <h2
          className={css({
            fontFamily: 'display',
            textStyle: { base: 'lg', md: '2xl' },
            fontWeight: 'normal',
            color: 'text',
            paddingBottom: '3',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'borderStrong',
          })}
        >
          Experience
        </h2>
        {timeline.map((e) => (
          <div
            key={`${e.year}-${e.company}-${e.role}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' },
              columnGap: '4',
              rowGap: '1',
              alignItems: 'baseline',
              paddingBlock: '3',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontSize: { base: 'sm', lg: 'base' },
                color: 'accentAlt',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {e.year}
            </span>
            <div className={css({ minWidth: '0' })}>
              <div
                className={css({
                  fontFamily: { base: 'body', lg: 'display' },
                  fontSize: { base: 'base', lg: 'lg' },
                  lineHeight: 'snug',
                  color: 'text',
                })}
              >
                {[e.role, e.company].filter(Boolean).join(', ')}
              </div>
              {e.description ? (
                <p
                  className={css({
                    fontSize: 'sm',
                    lineHeight: 'normal',
                    color: 'textMuted',
                    marginTop: '2',
                    maxWidth: '60ch',
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
