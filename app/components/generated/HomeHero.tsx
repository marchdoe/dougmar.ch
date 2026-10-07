import { css } from '../../../styled-system/css'

export function HomeHero() {
  return (
    <div
      className={css({
        minHeight: { base: '70vh', lg: '82vh' },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        textAlign: 'center',
      })}
    >
      <div
        className={css({
          fontFamily: 'body',
          textStyle: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        Red Wings · NHL
      </div>
      <div
        aria-hidden="true"
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          lineHeight: '0.82',
          letterSpacing: '-0.01em',
          fontSize: 'clamp(96px, 20vw, 160px)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '0.04em',
        })}
      >
        <span className={css({ color: 'accent' })}>5</span>
        <span
          className={css({
            color: 'textMuted',
            fontWeight: 'normal',
            fontSize: '0.6em',
            transform: 'translateY(-0.12em)',
          })}
        >
          {'\u2013'}
        </span>
        {/* steel #72819f maps to textFaint; stroke reads currentColor */}
        <span
          className={css({
            color: 'textFaint',
            WebkitTextFillColor: 'transparent',
            WebkitTextStroke: { base: '3px currentColor', lg: '4px currentColor' },
          })}
        >
          3
        </span>
      </div>
      <div
        aria-hidden="true"
        className={css({
          width: 'min(72vw, 420px)',
          height: '2px',
          bg: 'accent',
          marginTop: '4px',
        })}
      />
      <h1
        className={css({
          fontFamily: 'display',
          fontSize: { base: '28px', lg: '40px' },
          fontWeight: 'bold',
          textTransform: 'lowercase',
          lineHeight: '0.95',
          letterSpacing: 'tight',
          color: 'textMuted',
          maxWidth: '16ch',
          textAlign: 'center',
        })}
      >
        <b className={css({ color: 'text', fontWeight: 'bold' })}>Red Wings</b> take it, 5–3.
      </h1>
    </div>
  )
}
