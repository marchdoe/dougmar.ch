import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { Label } from './Label'

export function TimelineCatalog() {
  return (
    <section
      className={css({
        marginTop: '48px',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: '18px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ marginBottom: '16px' })}>
        <Label>Record · Roles and companies</Label>
      </div>
      {timeline.map((entry, i) => (
        <div
          key={`${entry.year}-${entry.company}`}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '36px 1fr', md: '36px 140px 1fr' },
            columnGap: '12px',
            rowGap: '6px',
            alignItems: 'baseline',
            paddingBlock: '16px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
          })}
        >
          <span
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              fontSize: '2xs',
              color: 'textFaint',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <span
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              fontSize: 'sm',
              color: 'textMuted',
              fontVariantNumeric: 'tabular-nums',
              minWidth: { md: '140px' },
            })}
          >
            {entry.year}
          </span>
          <div
            className={css({
              gridColumn: { base: '1 / -1', md: 'auto' },
              minWidth: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: { base: 'base', md: 'lg' },
                color: 'text',
                lineHeight: '1.3',
              })}
            >
              {[entry.role, entry.company].filter(Boolean).join(', ')}
            </span>
            {entry.description ? (
              <p
                className={css({
                  fontFamily: 'body',
                  fontSize: 'sm',
                  lineHeight: '1.55',
                  color: 'textMuted',
                  maxWidth: '56ch',
                })}
              >
                {entry.description}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  )
}
