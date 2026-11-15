import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

export function TimelineRows() {
  return (
    <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
      {timeline.map((e) => (
        <li
          key={`${e.year}-${e.company}-${e.role}`}
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '4px',
            paddingBlock: '18px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            lg: { gridTemplateColumns: '160px 1fr', gap: '24px', alignItems: 'baseline' },
          })}
        >
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'sm',
              color: 'textFaint',
              fontVariantNumeric: 'tabular-nums',
              lg: { fontSize: 'base', minWidth: '160px' },
            })}
          >
            {e.year}
          </span>
          <div>
            <div
              className={css({
                fontSize: 'base',
                color: 'text',
                fontWeight: 'bold',
                overflowWrap: 'break-word',
              })}
            >
              {[e.role, e.company].filter(Boolean).join(', ')}
            </div>
            {e.description ? (
              <p
                className={css({
                  fontSize: 'sm',
                  color: 'textMuted',
                  marginTop: '6px',
                  marginBottom: '0',
                  maxWidth: '50ch',
                })}
              >
                {e.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
