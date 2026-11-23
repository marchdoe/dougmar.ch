import { css } from '../../../styled-system/css'

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        minHeight: '64vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingInline: 'clamp(24px, 5vw, 72px)',
        paddingTop: 'clamp(40px, 8vh, 96px)',
        paddingBottom: 'clamp(40px, 6vw, 80px)',
      })}
    >
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          inset: '-4%',
          bg: 'bg',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(14px, 2.2vw, 30px)',
          maxWidth: '100%',
        })}
      >
        <h1
          className={css({
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
            textAlign: 'center',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textStyle: { base: '3xl', lg: 'hero' },
              lineHeight: '0.9',
              letterSpacing: 'normal',
              color: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: { base: '1.5px currentColor', lg: '2.5px currentColor' },
            })}
          >
            {'Ten\u00a0years'}
            <br />
            independent.
          </span>
          <span
            className={css({
              display: 'block',
              marginTop: 'clamp(14px, 2.2vw, 30px)',
              marginInline: 'auto',
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textStyle: '2xl',
              lineHeight: 'snug',
              letterSpacing: 'normal',
              color: 'accent',
              maxWidth: { base: '24ch', sm: '28ch' },
            })}
          >
            Still the vehicle for the next experiment.
          </span>
        </h1>
        <p
          className={css({
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
            fontFamily: 'body',
            textStyle: 'lede',
            color: 'textMuted',
            maxWidth: '50ch',
            lineHeight: 'normal',
          })}
        >
          Spaceman is the LLC I've worked under for ten years: product design, frontend engineering,
          design systems and brand, for companies and studios. One vehicle, still pointed at the
          next small thing.
        </p>
      </div>
    </section>
  )
}
