import { css } from '../../../styled-system/css'

const board = [
  { name: 'Penge', score: '−17', lead: true },
  { name: 'Thorbjornsen', score: '−16', lead: false },
  { name: 'Li', score: '−16', lead: false },
  { name: 'Greyserman', score: '−16', lead: false },
]

export function NightPanel() {
  return (
    <span
      className={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: { base: 'stretch', lg: 'flex-start' },
        gap: 'clamp(18px, 2.6vw, 30px)',
        bg: 'field',
        paddingBlock: { base: '56px', lg: '72px' },
        paddingLeft: { base: 'clamp(24px, 5vw, 88px)', lg: 'clamp(24px, 3vw, 44px)' },
        paddingRight: { base: 'clamp(24px, 5vw, 88px)', lg: 'clamp(40px, 6vw, 88px)' },
      })}
    >
      {/* Moon gradient rebuilt as token discs: accentAlt rim, fieldInkMuted, bgAlt, surface core. */}
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="Full moon, 99.4% illuminated"
        className={css({
          width: { base: 'clamp(130px, 18vw, 250px)', lg: 'clamp(150px, 13vw, 230px)' },
          height: 'auto',
          alignSelf: 'flex-start',
          display: 'block',
        })}
      >
        <circle cx="50" cy="50" r="48" className={css({ fill: 'accentAlt' })} />
        <circle cx="49" cy="49" r="46" className={css({ fill: 'fieldInkMuted' })} />
        <circle cx="47" cy="46" r="37" className={css({ fill: 'bgAlt' })} />
        <circle cx="44" cy="42" r="22" className={css({ fill: 'surface' })} />
      </svg>
      {/* Deck departs from the ramp: the mockup sets it at 30px / 52px. */}
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: '30px', lg: '52px' },
          lineHeight: '0.98',
          letterSpacing: 'normal',
          color: 'fieldInk',
        })}
      >
        full moon all night
      </span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'body',
          textStyle: 'sm',
          color: 'fieldInkMuted',
          letterSpacing: '0.02em',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        99.4% lit.
      </span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'body',
          textStyle: 'sm',
          color: 'fieldInk',
        })}
      >
        Thanksgiving, Thursday.
      </span>
      <span
        className={css({
          display: 'block',
          marginTop: '6px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          paddingTop: '14px',
        })}
      >
        <span
          className={css({
            display: 'block',
            fontFamily: 'body',
            fontWeight: 'bold',
            textStyle: '2xs',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            color: 'accentAlt',
            marginBottom: '10px',
          })}
        >
          RSM Classic, final
        </span>
        {board.map((row) => (
          <span
            key={row.name}
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '4',
              paddingBlock: '5px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
              _last: { borderBottomWidth: '0' },
            })}
          >
            <span className={css({ fontFamily: 'body', textStyle: 'sm', color: 'fieldInk' })}>
              {row.name}
            </span>
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                textStyle: 'sm',
                fontVariantNumeric: 'tabular-nums',
                color: row.lead ? 'accentAlt' : 'fieldInkMuted',
              })}
            >
              {row.score}
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}
