import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { Lab } from './Lab'

const hot = css({ color: 'accent', fontWeight: 'bold' })

const signals: { name: string; value: ReactNode; sub: ReactNode }[] = [
  {
    name: 'Red Wings',
    value: (
      <>
        <span className={hot}>0–1</span> L
      </>
    ),
    sub: 'Oct 10, the one live defeat',
  },
  {
    name: 'Baycurrent Classic',
    value: 'Final',
    sub: (
      <>
        M. Brennan <span className={hot}>−16</span> leads K. Mitchell −15
      </>
    ),
  },
  { name: 'SPY', value: '778.57', sub: <span className={hot}>▲ +0.60%</span> },
]

export function SignalsPanel() {
  return (
    <aside
      className={css({
        bg: 'field',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        padding: '6',
        alignSelf: 'start',
        minWidth: 0,
        lg: { gridColumn: '9 / 13' },
      })}
    >
      <Lab alt>The day, as evidence</Lab>
      {signals.map((signal) => (
        <div
          key={signal.name}
          className={css({
            paddingBlock: '18px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderColor: 'fieldBorder',
            _last: { borderBottomWidth: '0' },
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              columnGap: '3',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontStyle: 'italic',
                fontSize: '19px',
                color: 'fieldInk',
              })}
            >
              {signal.name}
            </span>
            <span
              className={css({
                fontSize: '15px',
                color: 'textFaint',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {signal.value}
            </span>
          </div>
          <div
            className={css({
              fontSize: '14px',
              color: 'textFaint',
              marginTop: '6px',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {signal.sub}
          </div>
        </div>
      ))}
    </aside>
  )
}
