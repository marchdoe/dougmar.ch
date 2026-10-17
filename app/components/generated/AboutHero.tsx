import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { Masthead } from './Masthead'

export function AboutHero() {
  const byline = [identity.name, identity.role].filter(Boolean).join(', ')
  return (
    <Masthead>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'xl',
          fontSize: 'clamp(22px, 2.8vw, 40px)',
          lineHeight: 'snug',
          textAlign: 'right',
          color: 'fieldInk',
          maxWidth: '26em',
          marginInlineStart: 'auto',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.statement}
      </h1>
      <p
        className={css({
          marginTop: 'clamp(16px, 2vw, 26px)',
          fontFamily: 'body',
          textStyle: 'sm',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {byline}
      </p>
    </Masthead>
  )
}
