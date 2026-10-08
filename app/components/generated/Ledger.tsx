import { css } from '../../../styled-system/css'
import { Band, SecHead } from './Band'

const reads = [
  { label: 'Calendar', value: 'Columbus Day', meta: 'in 4 days' },
  { label: 'On the clock', value: 'Oct 8, 2026', meta: 'Week 41' },
]

export function Ledger() {
  return (
    <Band label="Readings of the day">
      <SecHead
        title="Readings of the day"
        std="The rest of the signals on Oct 8: the calendar, the clock, and one name worth keeping."
      />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1.3fr 1.3fr' },
          columnGap: { sm: 'clamp(16px, 2.4vw, 40px)' },
        })}
      >
        {reads.map((r) => (
          <div
            key={r.label}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              paddingBlock: '16px',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
            })}
          >
            <span
              className={css({
                fontSize: '2xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'textMuted',
                fontWeight: 'bold',
              })}
            >
              {r.label}
            </span>
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'md',
                letterSpacing: 'tight',
              })}
            >
              {r.value}
            </span>
            <span className={css({ fontSize: 'xs', color: 'textMuted' })}>{r.meta}</span>
          </div>
        ))}
        <div
          className={css({
            gridColumn: '1 / -1',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
            marginTop: '8px',
            paddingTop: '18px',
          })}
        >
          <p
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: 'lede',
              color: 'textMuted',
              maxWidth: '56ch',
              lineHeight: 'snug',
            })}
          >
            <b className={css({ color: 'text', fontWeight: 'bold' })}>
              Margaret Hamilton, 1936–2026.
            </b>{' '}
            She named software engineering, the discipline Doug practices as one job with design.
          </p>
        </div>
      </div>
    </Band>
  )
}
