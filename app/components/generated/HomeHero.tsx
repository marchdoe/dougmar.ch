import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { HeroReadings } from './HeroReadings'

const word = css({
  display: 'block',
  fontFamily: 'display',
  fontWeight: 'bold',
  lineHeight: '0.9',
  letterSpacing: 'tight',
  color: 'text',
  textAlign: { base: 'right', md: 'left' },
  animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
})

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        paddingTop: { base: 'clamp(28px, 5vw, 72px)', md: 'clamp(36px, 4vw, 64px)' },
        paddingBottom: { base: 'clamp(32px, 5vw, 72px)', md: 'clamp(40px, 5vw, 80px)' },
        display: { md: 'flex' },
        alignItems: { md: 'stretch' },
        minHeight: { md: 'calc(90vh - 64px)' },
      })}
    >
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          inset: '-4%',
          bg: 'bg',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <Ground material="halftone" seed={910188583} />
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: { base: 'flex', md: 'grid' },
          flexDirection: 'column',
          flex: { md: '1' },
          gridTemplateColumns: { md: '1fr 1fr 1.3fr' },
          gridTemplateRows: { md: 'repeat(5, auto)' },
          columnGap: 'clamp(16px, 2.4vw, 40px)',
          rowGap: { md: 'clamp(10px, 1.4vw, 20px)' },
          alignContent: { md: 'space-between' },
        })}
      >
        <h1
          className={css({
            display: { base: 'block', md: 'grid' },
            gridTemplateColumns: { md: 'subgrid' },
            gridTemplateRows: { md: 'subgrid' },
            gridColumn: { md: '1 / 4' },
            gridRow: { md: '1 / 5' },
          })}
        >
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: { base: 'lg', md: 'xl' },
              lineHeight: 'tight',
              letterSpacing: 'tight',
              color: 'textMuted',
              textAlign: { base: 'right', md: 'left' },
              maxWidth: '24ch',
              marginLeft: { base: 'auto', md: '0' },
              marginBottom: { base: 'clamp(14px, 2vw, 22px)', md: '0' },
              gridColumn: { md: '1 / 3' },
              gridRow: { md: '1' },
              alignSelf: { md: 'start' },
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            If you want to find the secrets of the universe, think in terms of{' '}
          </span>
          <span
            className={`${word} ${css({ fontSize: 'xl', gridColumn: { md: '1 / 2' }, gridRow: { md: '2' }, alignSelf: { md: 'center' }, animationDelay: '80ms' })}`}
          >
            energy{' '}
          </span>
          <span
            className={`${word} ${css({ fontSize: { base: '2xl', md: 'xl', lg: '2xl' }, gridColumn: { md: '2 / 3' }, gridRow: { md: '3' }, alignSelf: { md: 'center' }, animationDelay: '80ms' })}`}
          >
            frequency{' '}
          </span>
          <span
            className={`${word} ${css({ fontSize: { base: '40px', md: 'lg' }, color: { md: 'textMuted' }, gridColumn: { md: '3 / 4' }, gridRow: { md: '3' }, alignSelf: { md: 'center' }, animationDelay: '80ms' })}`}
          >
            and{' '}
          </span>
          <span
            className={`${word} ${css({ fontSize: { base: '56px', md: 'clamp(56px, 8.9vw, 128px)' }, color: 'accent', marginTop: { base: '0.02em', md: '0' }, gridColumn: { md: '2 / 4' }, gridRow: { md: '4' }, alignSelf: { md: 'end' }, animationDelay: '160ms' })}`}
          >
            vibration.
          </span>
        </h1>
        <cite
          className={css({
            display: 'block',
            fontStyle: 'normal',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: 'sm',
            fontWeight: 'bold',
            color: 'text',
            textAlign: { base: 'right', md: 'left' },
            marginTop: { base: 'clamp(10px, 1.4vw, 18px)', md: '0' },
            gridColumn: { md: '3 / 4' },
            gridRow: { md: '5' },
            alignSelf: { md: 'start' },
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        >
          Nikola Tesla
        </cite>
        <HeroReadings />
      </div>
    </section>
  )
}
