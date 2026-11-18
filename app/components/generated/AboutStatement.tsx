import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutStatement() {
  return (
    <section
      className={css({
        paddingTop: 'clamp(40px, 6vw, 96px)',
        paddingBottom: 'clamp(40px, 5vw, 72px)',
        paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
      })}
    >
      <span
        className={css({
          display: 'block',
          marginBottom: '5',
          textStyle: 'xs',
          fontWeight: 'semibold',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        About
      </span>
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'light',
          textStyle: 'xl',
          maxWidth: '32ch',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.statement}
      </h1>
    </section>
  )
}
