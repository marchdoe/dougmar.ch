import { css } from '../../../styled-system/css'

const rows = [
  {
    pt: '96 PT',
    fact: 'SPY 766.81',
    up: '▲1.65%',
    size: css({ fontSize: 'clamp(28px,4vw,46px)' }),
  },
  { pt: '72 PT', fact: 'Pistons 106–112 L', size: css({ fontSize: 'clamp(26px,3.6vw,40px)' }) },
  {
    pt: '60 PT',
    fact: 'WWT Championship · Scheduled',
    size: css({ fontSize: 'clamp(23px,3.2vw,34px)' }),
  },
  { pt: '48 PT', fact: 'Waning Crescent · 14%', size: css({ fontSize: 'clamp(21px,2.8vw,30px)' }) },
  {
    pt: '36 PT',
    fact: 'Aldie, VA · Rain · 65°F',
    size: css({ fontSize: 'clamp(20px,2.4vw,27px)' }),
  },
  { pt: '24 PT', fact: 'Veterans Day · 6 Days', size: css({ fontSize: 'clamp(19px,2.1vw,24px)' }) },
  {
    pt: '18 PT',
    fact: 'War on Drugs · Radiohead',
    size: css({ fontSize: 'clamp(18px,1.9vw,22px)' }),
  },
]

const factClass = css({
  fontFamily: 'display',
  textTransform: 'uppercase',
  letterSpacing: '0.015em',
  color: 'text',
  lineHeight: '0.95',
  fontVariantNumeric: 'tabular-nums',
  minWidth: '0',
})

export function SignalsLadder() {
  return (
    <aside aria-labelledby="sig-head" className={css({ minWidth: '0' })}>
      <h2
        id="sig-head"
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textTransform: 'uppercase',
          fontSize: 'clamp(24px,3vw,34px)',
          letterSpacing: '0.03em',
          color: 'text',
          marginBottom: '6px',
        })}
      >
        Today, Set in Type
      </h2>
      <div
        className={css({
          textStyle: 'xs',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'textMuted',
          marginBottom: '28px',
        })}
      >
        The day's facts as a specimen
      </div>
      <div
        className={css({
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: '8px',
          position: { lg: 'sticky' },
          top: { lg: '40px' },
        })}
      >
        {rows.map((row) => (
          <div
            key={row.pt}
            className={css({
              display: 'grid',
              gridTemplateColumns: '62px 1fr',
              alignItems: 'baseline',
              gap: '14px',
              paddingBlock: '14px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontSize: '20px',
                color: 'accent',
                letterSpacing: '0.02em',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {row.pt}
            </span>
            <span className={`${factClass} ${row.size}`}>
              {row.fact} {row.up && <span className={css({ color: 'accent' })}>{row.up}</span>}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}
