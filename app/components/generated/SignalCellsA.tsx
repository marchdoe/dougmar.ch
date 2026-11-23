import { css, cx } from '../../../styled-system/css'
import { cell, label } from './styles'

const games = [
  { team: 'Lions', result: 'Win', win: true, pts: '31–21' },
  { team: 'Pistons', result: 'Loss', win: false, pts: '97–107' },
]

export function GolfCell() {
  return (
    <div
      className={css({
        gridColumn: { sm: 'span 6', lg: 'span 5' },
        bg: 'field',
        color: 'fieldInk',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        borderRadius: 'sm',
        padding: 'clamp(18px, 2vw, 28px)',
        minWidth: '0',
      })}
    >
      <span
        className={css({
          display: 'block',
          textStyle: '2xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          marginBottom: '4',
        })}
      >
        RSM Classic
        <span className={css({ marginLeft: '2', color: 'fieldInk' })}>In progress</span>
      </span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '4xl',
          lineHeight: '0.95',
          fontVariantNumeric: 'tabular-nums',
          color: 'fieldInk',
        })}
      >
        −14
      </span>
      <p
        className={css({ textStyle: 'sm', color: 'fieldInk', marginTop: '3', lineHeight: 'snug' })}
      >
        <b>Max Greyserman</b> and <b>Rasmus Højgaard</b>, tied for the lead at Sea Island.
      </p>
    </div>
  )
}

export function DetroitCell() {
  return (
    <div className={cx(cell, css({ gridColumn: { sm: 'span 6', lg: 'span 4' } }))}>
      <span className={label}>Detroit, last out</span>
      {games.map((g) => (
        <div
          key={g.team}
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '3',
            paddingBlock: '2',
            '& + &': { borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'border' },
          })}
        >
          <span className={css({ textStyle: 'sm', color: 'text', fontWeight: 'bold' })}>
            {g.team}{' '}
            <span
              className={css({
                textStyle: '2xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: g.win ? 'accentAlt' : 'textFaint',
              })}
            >
              {g.result}
            </span>
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'xl',
              color: 'textMuted',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {g.pts}
          </span>
        </div>
      ))}
    </div>
  )
}

export function MarketCell() {
  return (
    <div className={cx(cell, css({ gridColumn: { sm: 'span 4', lg: 'span 3' } }))}>
      <span className={label}>SPY, close</span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '2xl',
          lineHeight: '0.95',
          fontVariantNumeric: 'tabular-nums',
          color: 'text',
        })}
      >
        689.81
      </span>
      <div
        className={css({
          textStyle: 'sm',
          color: 'textMuted',
          marginTop: '2',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        −26.06 · −3.64%
      </div>
      <div className={css({ textStyle: '2xs', color: 'textFaint', marginTop: '1' })}>
        A loud down day, stated as fact.
      </div>
    </div>
  )
}
