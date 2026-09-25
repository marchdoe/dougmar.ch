import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { NavSentence } from './NavSentence'

export function HomeHero() {
  return (
    <section
      data-home-hero=""
      className={css({
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        bg: 'bg',
        color: 'text',
        minHeight: { base: '72vh', sm: '88vh' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: { base: 'flex-start', sm: 'center' },
        textAlign: 'center',
        paddingTop: { base: '6', lg: '8' },
        paddingBottom: { base: '6', lg: '8' },
        paddingInline: { base: '4', lg: '7' },
      })}
    >
      <Ground material="grain" seed={1892077511} />
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          inset: '-4%',
          zIndex: '-1',
          bg: 'bg',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <span
          className={css({
            display: 'block',
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: { base: '56vw', md: '38vw' },
            lineHeight: '1',
            letterSpacing: 'normal',
            color: 'text',
            opacity: 0.055,
            whiteSpace: 'nowrap',
            transform: 'rotate(-4deg)',
          })}
        >
          fun
        </span>
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { base: '4', lg: '5' },
          width: '100%',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'light',
            textStyle: { base: '3xl', md: '4xl', xl: '5xl' },
            lineHeight: 'tight',
            letterSpacing: 'tight',
            textTransform: 'none',
            textAlign: 'center',
            color: 'text',
            maxWidth: { base: '14ch', sm: '16ch', xl: '18ch' },
            textWrap: 'balance',
          })}
        >
          People rarely succeed unless they have fun in what they are doing.
        </h1>
        <p
          className={css({
            fontFamily: 'body',
            fontWeight: 'normal',
            textStyle: { base: 'base', lg: 'md' },
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
          })}
        >
          Dale Carnegie <span className={css({ color: 'textFaint' })}>·</span> Friday, full moon
        </p>
        {/* Standfirst sits at the mockup's measured 21px / 34px, below the hero register. */}
        <p
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: { base: '21px', lg: '34px' },
            lineHeight: 'snug',
            letterSpacing: 'normal',
            color: 'textMuted',
            maxWidth: '24ch',
            marginTop: { base: '2', lg: '3' },
          })}
        >
          Doug runs <em className={css({ color: 'text' })}>Spaceman</em> for the paying work, and
          builds FishSticks and 15th Club on the side{' '}
          <em className={css({ color: 'text' })}>for the joy of it.</em>
        </p>
      </div>
      <div
        className={css({ position: 'relative', zIndex: '1', marginTop: { base: '4', lg: '5' } })}
      >
        <NavSentence />
      </div>
    </section>
  )
}
