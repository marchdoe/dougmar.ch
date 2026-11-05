import { css } from '../../../styled-system/css'
import { HeroField } from './HeroField'

export function HomeHero() {
  return (
    <HeroField>
      <h1
        className={css({
          marginTop: 'auto',
          paddingTop: 'clamp(40px,8vh,96px)',
          fontFamily: 'display',
          fontWeight: 'normal',
          textTransform: 'uppercase',
          textAlign: 'left',
          textStyle: { base: '5xl', lg: 'hero' },
          lineHeight: '0.86',
          letterSpacing: '0.01em',
          color: 'text',
          display: 'flex',
          flexDirection: 'column',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        <span className={css({ display: 'block' })}>
          Ask Why
          <span aria-hidden="true" className={css({ color: 'accent' })}>
            .
          </span>
        </span>{' '}
        <span className={css({ display: 'block', marginLeft: { lg: '22%' } })}>Then Build</span>{' '}
        <span className={css({ display: 'block', marginLeft: { lg: '34%' } })}>The Answer.</span>
      </h1>
      {/* The flat bg plate keeps the deck clear of the halftone dots. */}
      <p
        className={css({
          marginTop: 'clamp(28px,4vh,48px)',
          marginLeft: { lg: '34%' },
          alignSelf: 'flex-start',
          maxWidth: '30ch',
          bg: 'bg',
          paddingBlock: '2',
          paddingInline: '3',
          fontSize: 'clamp(16px,2vw,21px)',
          lineHeight: '1.45',
          fontWeight: 'normal',
          color: 'text',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        A builder of small products made to answer his own questions. Design and engineering,
        shipped as one.
      </p>
    </HeroField>
  )
}
