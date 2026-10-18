import { css } from '../../../styled-system/css'
import { Masthead } from './Masthead'

export function HomeHero() {
  return (
    <Masthead tall>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '2xl',
          fontSize: 'clamp(30px, 6vw, 62px)',
          lineHeight: '1.04',
          letterSpacing: '0.008em',
          textTransform: 'uppercase',
          textAlign: 'right',
          color: 'fieldInk',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        If you're waiting until you feel talented enough to make it, you'll{' '}
        {/* mockup gold (amber.400) has no semantic token; fieldInkMuted is the nearest light accent ink on field */}
        <span className={css({ color: 'fieldInkMuted' })}>never make it.</span>
      </h1>
      <p
        className={css({
          marginTop: 'clamp(16px, 2vw, 26px)',
          fontFamily: 'body',
          fontWeight: 'normal',
          textStyle: 'sm',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        Criss Jami
      </p>
    </Masthead>
  )
}
