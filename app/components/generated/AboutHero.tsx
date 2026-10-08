import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutHero() {
  return (
    <section
      className={css({
        paddingInline: 'clamp(24px, 6vw, 96px)',
        paddingTop: 'clamp(36px, 5vw, 72px)',
        paddingBottom: 'clamp(40px, 5vw, 80px)',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: '3xl',
          lineHeight: 'tight',
          letterSpacing: 'tight',
          color: 'text',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.name}
      </div>
      <p
        className={css({
          marginTop: '2',
          fontSize: 'lg',
          color: 'textMuted',
          maxWidth: '48ch',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {identity.role}
      </p>
      <h1
        className={css({
          marginTop: '6',
          fontFamily: 'body',
          fontWeight: 'normal',
          fontSize: 'lede',
          lineHeight: 'normal',
          color: 'text',
          maxWidth: '48ch',
          textWrap: 'pretty',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        {identity.statement}
      </h1>
    </section>
  )
}
