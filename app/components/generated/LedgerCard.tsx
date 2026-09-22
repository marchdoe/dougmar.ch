import { css } from '../../../styled-system/css'

const rows: { k: string; v: string; win?: boolean; muted?: boolean }[] = [
  { k: 'Tigers', v: '9–2', win: true },
  { k: 'Lions', v: '31, 41' },
  { k: 'Red Wings', v: '0, 1' },
  { k: 'Biltmore, final', v: 'Bridgeman -26', muted: true },
  { k: 'SPY', v: '773.50, +1.55%' },
  { k: 'Aldie', v: 'Light rain, 59°F' },
  { k: 'Moon', v: 'Waxing gibbous, 87%' },
  { k: 'Air', v: 'Good, AQI 1' },
]

const dispatches = [
  { label: 'Type specimens as living documents', href: '#' },
  { label: 'The case for two committed hues', href: '#' },
  { label: 'Grids that hold under pressure', href: '#' },
]

export function LedgerCard() {
  return (
    <div
      className={css({
        bg: 'field',
        color: 'fieldInk',
        border: '1px solid',
        borderColor: 'fieldBorder',
        borderRadius: 'md',
        paddingInline: '6',
        paddingBlock: '7',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'lg',
          color: 'fieldInk',
          marginBottom: '3',
        })}
      >
        Ledger, 22 Sep 2026
      </h2>
      <ul className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
        {rows.map((row) => (
          <li
            key={row.k}
            className={css({
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '4',
              paddingBlock: '3',
              borderTop: '1px solid',
              borderColor: 'fieldBorder',
              flexWrap: 'wrap',
            })}
          >
            <span className={css({ color: 'fieldInkMuted', fontSize: 'sm', fontWeight: 'bold' })}>
              {row.k}
            </span>
            {row.win ? (
              <span className={css({ display: 'inline-flex', alignItems: 'center', gap: '2' })}>
                <span
                  className={css({
                    bg: 'accent',
                    color: 'accentText',
                    fontWeight: 'bold',
                    fontSize: 'sm',
                    paddingInline: '2',
                    paddingBlock: '1',
                    borderRadius: 'sm',
                  })}
                >
                  Win
                </span>
                <span
                  className={css({
                    fontFamily: 'display',
                    fontWeight: 'bold',
                    fontSize: 'base',
                    color: 'fieldInk',
                  })}
                >
                  {row.v}
                </span>
              </span>
            ) : (
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'base',
                  textAlign: 'right',
                  color: row.muted ? 'fieldInkMuted' : 'fieldInk',
                })}
              >
                {row.v}
              </span>
            )}
          </li>
        ))}
      </ul>
      <p
        className={css({
          marginTop: '4',
          paddingTop: '4',
          borderTop: '1px solid',
          borderColor: 'fieldBorder',
          fontSize: 'sm',
          color: 'fieldInkMuted',
          fontStyle: 'italic',
        })}
      >
        On rotation: The War on Drugs, Radiohead.
      </p>
      <div className={css({ marginTop: '6' })}>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'lg',
            color: 'fieldInk',
            marginBottom: '3',
          })}
        >
          Today in Design
        </h2>
        <ul className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
          {dispatches.map((d) => (
            <li
              key={d.label}
              className={css({ borderTop: '1px solid', borderColor: 'fieldBorder' })}
            >
              <a
                href={d.href}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '44px',
                  gap: '2',
                  color: 'fieldInk',
                  fontSize: 'sm',
                })}
              >
                {d.label} →
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
