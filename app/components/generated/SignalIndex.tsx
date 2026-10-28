import { css } from '../../../styled-system/css'

const signals = [
  { key: 'Pistons', value: '97–111 L', up: '' },
  { key: 'Market', value: 'SPY 769.66', up: '+0.56%' },
  { key: 'Golf', value: 'VidantaWorld Mexico Open · scheduled', up: '' },
  { key: 'Moon', value: 'Waning gibbous, 90%', up: '' },
  { key: 'Holiday', value: 'Halloween, 3 days out', up: '' },
  { key: 'In rotation', value: 'My Morning Jacket, The War on Drugs', up: '' },
]

export function SignalIndex() {
  return (
    <ul
      aria-label="Today's signals"
      className={css({ listStyle: 'none', margin: '0', padding: '0', minWidth: '0' })}
    >
      {signals.map((s) => (
        <li
          key={s.key}
          className={css({
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            columnGap: '3',
            alignItems: 'baseline',
            paddingBlock: '3',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderColor: 'fieldBorder',
            fontSize: 'sm',
            _last: { borderBottomWidth: '1px', borderBottomStyle: 'solid' },
          })}
        >
          <span
            className={css({
              fontVariantCaps: 'all-small-caps',
              letterSpacing: 'wider',
              color: 'fieldInkMuted',
            })}
          >
            {s.key}
          </span>
          <span
            className={css({
              color: 'fieldInk',
              fontVariantNumeric: 'tabular-nums',
              minWidth: '0',
            })}
          >
            {s.value}
            {s.up ? (
              <span
                className={css({ color: { base: 'accent', _light: 'accentAlt' }, marginLeft: '2' })}
              >
                {s.up}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  )
}
