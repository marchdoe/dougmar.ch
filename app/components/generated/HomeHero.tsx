import { css } from '../../../styled-system/css'
import { HeroGround } from './HeroGround'
import { SignalField } from './SignalField'

export function HomeHero() {
  return (
    <section
      aria-label="Most golf apps are digital scorecards"
      className={css({
        position: 'relative',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        paddingBottom: 'clamp(48px, 7vw, 112px)',
        display: { base: 'block', lg: 'grid' },
        gridTemplateColumns: { lg: 'minmax(0, 1.9fr) minmax(280px, 1fr)' },
        columnGap: { lg: '5vw' },
        alignItems: 'start',
      })}
    >
      <HeroGround />
      <div className={css({ position: 'relative', zIndex: 1, paddingBottom: { lg: '40px' } })}>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'light',
            textTransform: 'lowercase',
            textAlign: 'left',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontSize: 'clamp(27px, 7.2vw, 76px)',
              lineHeight: '0.98',
              letterSpacing: '-0.02em',
              color: 'textMuted',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '1.6px currentColor',
              marginBottom: '0.12em',
            })}
          >
            most golf apps are
            <br /> digital scorecards.
          </span>{' '}
          <span
            className={css({
              display: 'block',
              fontSize: 'clamp(44px, 10vw, 148px)',
              lineHeight: '0.92',
              letterSpacing: '-0.035em',
              color: 'accent',
            })}
          >
            this one is not.
          </span>
        </h1>
        <p
          className={css({
            marginTop: 'clamp(28px, 4vw, 40px)',
            maxWidth: '48ch',
            fontSize: 'clamp(17px, 2.1vw, 22px)',
            lineHeight: '1.45',
            fontWeight: '500',
            color: 'textMuted',
            bg: 'bg',
            paddingBlock: '2',
            paddingInline: '3',
            borderRadius: 'md',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          <b className={css({ color: 'text', fontWeight: 'bold' })}>15th&nbsp;Club</b> is a platform
          for AI experiments through the lens of golf. The scorecard is the first experiment:
          shareable, real-time, no app install required.
        </p>
        <hr
          className={css({
            height: '2px',
            bg: 'borderStrong',
            borderWidth: '0',
            marginTop: 'clamp(32px, 4vw, 48px)',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        />
      </div>
      <SignalField />
    </section>
  )
}
