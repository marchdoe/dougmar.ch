import { css } from '../../../styled-system/css'

const signals = [
  { label: 'Smotherman, Bank of Utah Championship', value: '23 under', lead: true },
  { label: 'Doug Ghim', value: '22 under', lead: false },
  { label: 'SPY', value: '769.64\u00a0\u00a0+0.74%', lead: false },
  { label: 'Aldie, VA', value: '58.7°F · overcast', lead: false },
  { label: 'Moon', value: 'Last quarter · 37% lit', lead: false },
]

const lab = css({ fontFamily: 'body', fontSize: 'sm', color: 'fieldInkMuted' })
const labLead = css({ fontFamily: 'body', fontSize: 'sm', fontWeight: 'bold', color: 'fieldInk' })

export function SignalLedger() {
  return (
    <div
      className={css({
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
      })}
    >
      {signals.map((s) => (
        <div
          key={s.label}
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            columnGap: '12px',
            rowGap: '1',
            paddingBlock: '13px',
            paddingInline: '2px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'fieldBorder',
          })}
        >
          <span className={s.lead ? labLead : lab}>
            {s.lead ? (
              <span
                aria-hidden="true"
                className={css({
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  marginRight: '8px',
                  bg: 'fieldInkMuted',
                  transform: 'translateY(-1px)',
                })}
              />
            ) : null}
            {s.label}
          </span>
          <span
            className={css({
              fontFamily: 'body',
              fontSize: 'sm',
              fontWeight: 'bold',
              color: 'fieldInk',
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {s.value}
          </span>
        </div>
      ))}
    </div>
  )
}
