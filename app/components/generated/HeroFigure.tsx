import { css } from '../../../styled-system/css'

export function HeroFigure() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '80vh',
        paddingBottom: '12px',
        md: { minHeight: '0', paddingBottom: '24px' },
        lg: {
          minHeight: '0',
          paddingBottom: '0',
          gridColumn: '1 / 8',
          gridRow: '1 / 4',
          alignSelf: 'center',
        },
      })}
    >
      <div
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          fontWeight: 'bold',
          marginBottom: '20px',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        Detroit Red Wings · final · last night
      </div>
      <div
        aria-hidden="true"
        className={css({
          display: 'block',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          fontFamily: 'display',
          fontWeight: 'light',
          fontSize: { base: '64px', lg: 'clamp(120px, 11vw, 156px)' },
          lineHeight: '0.86',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        <span
          className={css({
            display: 'inline-block',
            color: 'transparent',
            WebkitTextStroke: { base: '2px {colors.text}', lg: '3px {colors.text}' },
            transform: 'translateY(-0.02em)',
          })}
        >
          2
        </span>{' '}
        <span
          className={css({
            display: 'inline-block',
            color: 'transparent',
            WebkitTextStroke: { base: '2px {colors.textMuted}', lg: '3px {colors.textMuted}' },
            transform: 'scaleX(1.6)',
          })}
        >
          -
        </span>{' '}
        <span
          className={css({
            display: 'inline-block',
            color: 'transparent',
            WebkitTextStroke: { base: '2px {colors.textFaint}', lg: '3px {colors.textFaint}' },
            transform: 'translate(0.05em, 0.06em)',
          })}
        >
          0
        </span>
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'light',
          fontSize: { base: '22px', lg: '2xl' },
          lineHeight: '1.1',
          color: 'text',
          marginTop: '24px',
          maxWidth: '17ch',
          textAlign: 'center',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Nobody scored on the Red Wings.
      </h1>
      <p
        className={css({
          textStyle: 'lede',
          color: 'textMuted',
          marginTop: '18px',
          marginBottom: '0',
          maxWidth: '44ch',
          lineHeight: '1.45',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '240ms',
        })}
      >
        Detroit shut them out{' '}
        <span className={css({ color: 'accent', fontWeight: 'bold' })}>2–0</span>. A clean sheet,
        the empty net nobody got past.
      </p>
    </div>
  )
}
