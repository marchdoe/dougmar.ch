import { css } from '../../../styled-system/css'

export function DayPanel() {
  return (
    <span
      className={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: { base: 'stretch', lg: 'flex-start' },
        gap: '18px',
        bg: 'bg',
        minHeight: { base: 'calc(100svh - 96px)', lg: '0' },
        paddingTop: { base: '48px', lg: '72px' },
        paddingBottom: { base: '40px', lg: '72px' },
        paddingLeft: { base: 'clamp(24px, 5vw, 88px)', lg: 'clamp(40px, 6vw, 88px)' },
        paddingRight: { base: 'clamp(24px, 5vw, 88px)', lg: 'clamp(24px, 3vw, 44px)' },
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
          color: 'textMuted',
        })}
      >
        Aldie, Virginia · Tue 24 Nov
      </span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: { base: '5xl', lg: 'hero' },
          lineHeight: '0.84',
          letterSpacing: 'tight',
          color: 'text',
        })}
      >
        Clear
      </span>
      {/* Deck departs from the ramp: the mockup sets it at 30px / 52px under the hero word. */}
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: '30px', lg: '52px' },
          lineHeight: '0.98',
          letterSpacing: 'normal',
          color: 'text',
        })}
      >
        all day
      </span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'body',
          textStyle: 'sm',
          letterSpacing: '0.02em',
          color: 'textMuted',
          marginTop: '12px',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        Clear and cloudless. 44°F.
      </span>
      <span
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '2',
          marginTop: { base: '22px', lg: 'auto' },
          paddingTop: { lg: '24px' },
          alignSelf: { lg: 'flex-end' },
          alignItems: { lg: 'flex-end' },
          textAlign: { lg: 'right' },
        })}
      >
        {/* The mockup's radial gradient is rebuilt as stacked token discs: accent rim, accentAlt amber, bg gold, surface core. */}
        <svg
          viewBox="0 0 120 120"
          role="img"
          aria-label="Low November sun setting toward the horizon"
          className={css({ width: 'clamp(96px, 16vw, 190px)', height: 'auto', display: 'block' })}
        >
          <g className={css({ stroke: 'accent' })} strokeWidth="2.4" strokeLinecap="round">
            <line x1="60" y1="6" x2="60" y2="20" />
            <line x1="92" y1="14" x2="85" y2="27" />
            <line x1="114" y1="46" x2="101" y2="53" />
            <line x1="28" y1="14" x2="35" y2="27" />
            <line x1="6" y1="46" x2="19" y2="53" />
          </g>
          <circle cx="60" cy="60" r="34" className={css({ fill: 'accent' })} />
          <circle cx="60" cy="59" r="30" className={css({ fill: 'accentAlt' })} />
          <circle cx="60" cy="57" r="22" className={css({ fill: 'bg' })} />
          <circle cx="60" cy="55" r="12" className={css({ fill: 'surface' })} />
        </svg>
        <span
          className={css({
            fontFamily: 'body',
            textStyle: 'sm',
            color: 'textMuted',
            letterSpacing: '0.02em',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          Sunset 4:45.
        </span>
      </span>
    </span>
  )
}
