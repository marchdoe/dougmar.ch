import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

export function TimelineSection() {
  return (
    <section
      className={css({
        paddingTop: '6',
        paddingInline: '24px',
        lg: { paddingTop: '7', paddingInline: '4vw' },
        xl: { paddingInline: '5vw' },
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
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          fontSize: { base: 'lg', lg: 'xl' },
          color: 'text',
          marginBottom: '4',
        })}
      >
        Experience
      </h2>
      {timeline.map((t) => (
        <div
          key={`${t.year}-${t.company}-${t.role}`}
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr',
            columnGap: '5',
            rowGap: '2',
            paddingBlock: '20px',
            borderTop: '1px solid',
            borderColor: 'border',
            lg: { gridTemplateColumns: 'minmax(0, 1fr) 260px', paddingBlock: '26px' },
          })}
        >
          <div
            className={css({
              fontFamily: 'display',
              fontVariantNumeric: 'tabular-nums',
              fontSize: 'sm',
              color: 'textFaint',
              lg: { gridColumn: '2', gridRow: '1', textAlign: 'right', fontSize: 'lg' },
            })}
          >
            {t.year}
          </div>
          <div
            className={css({
              fontSize: 'base',
              color: 'text',
              lg: {
                gridColumn: '1',
                gridRow: '1',
                fontFamily: 'display',
                fontStyle: 'italic',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                fontSize: 'xl',
                lineHeight: 'snug',
              },
            })}
          >
            {[t.role, t.company].filter((s) => s !== '').join(', ')}
          </div>
          {t.description !== '' ? (
            <p
              className={css({
                maxWidth: '58ch',
                fontSize: 'base',
                color: 'textMuted',
                lineHeight: 'normal',
                lg: { gridColumn: '1' },
              })}
            >
              {t.description}
            </p>
          ) : null}
        </div>
      ))}
    </section>
  )
}
