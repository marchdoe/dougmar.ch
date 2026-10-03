import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutIntro() {
  return (
    <section
      className={css({
        maxWidth: '720px',
        marginInline: 'auto',
        paddingTop: '64px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        boxSizing: 'content-box',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: 'xl',
          textTransform: 'lowercase',
          color: 'text',
        })}
      >
        {identity.name}
      </div>
      <div
        className={css({
          fontSize: 'sm',
          color: 'textMuted',
          textTransform: 'lowercase',
          letterSpacing: '0.04em',
          marginTop: '4px',
        })}
      >
        {identity.role}
      </div>
      <h1
        className={css({
          fontFamily: 'body',
          fontWeight: 'normal',
          textStyle: 'lg',
          color: 'text',
          maxWidth: '46ch',
          marginTop: '24px',
        })}
      >
        {identity.statement}
      </h1>
    </section>
  )
}
