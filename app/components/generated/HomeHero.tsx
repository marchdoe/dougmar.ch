import { css } from '../../../styled-system/css'

export function HomeHero() {
  return (
    <section
      className={css({
        minHeight: 'calc(100vh - 64px)',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        paddingBlock: 'clamp(40px, 7vh, 88px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        bg: 'bg',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(18px, 3vh, 34px)',
          width: '100%',
        })}
      >
        <div
          aria-hidden="true"
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            lineHeight: '0.9',
            fontSize: 'clamp(96px, 12.5vw, 160px)',
            letterSpacing: '0.01em',
            color: 'transparent',
            WebkitTextStroke: '2px token(colors.textMuted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.04em',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          <span className={css({ display: 'inline-block' })}>11</span>
          {/* mockup glow used a raw rgba; dropped, the brass point carries on its own */}
          <span
            className={css({
              display: 'inline-block',
              color: 'accent',
              WebkitTextStroke: '0',
              fontSize: '0.72em',
              transform: 'translateY(-0.06em)',
              marginInline: '0.02em',
            })}
          >
            ●
          </span>
          <span className={css({ display: 'inline-block' })}>11</span>
        </div>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(14px, 2.4vh, 24px)',
          })}
        >
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: 'clamp(34px, 5.4vw, 62px)',
              lineHeight: '1.02',
              letterSpacing: '0.005em',
              color: 'text',
              textTransform: 'none',
              fontStyle: 'normal',
              textAlign: 'center',
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            Veterans Day
          </h1>
          <div className={css({ width: '84px', height: '2px', bg: 'accent', opacity: 0.9 })} />
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'clamp(16px, 2.2vw, 22px)',
              lineHeight: '1.5',
              color: 'textMuted',
              maxWidth: '44ch',
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '160ms',
            })}
          >
            The eleventh hour of the eleventh day of the eleventh month.
          </p>
        </div>
      </div>
    </section>
  )
}
