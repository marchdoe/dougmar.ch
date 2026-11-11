import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutIntro() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(48px, 10vh, 128px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        display: 'grid',
        gap: '5',
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'accent',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        About
      </span>
      {/* display step carries a short phrase; the long statement sits on the lede step below */}
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(34px, 5.4vw, 62px)',
          lineHeight: '1.02',
          color: 'text',
          maxWidth: '24ch',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.name}
      </h1>
      <div className={css({ width: '84px', height: '2px', bg: 'accent', opacity: 0.9 })} />
      <p
        className={css({
          fontFamily: 'body',
          fontSize: 'lede',
          lineHeight: '1.6',
          color: 'text',
          maxWidth: '46ch',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        {identity.statement}
      </p>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: 'sm',
          lineHeight: '1.5',
          color: 'textMuted',
          maxWidth: '44ch',
        })}
      >
        {identity.role}
      </p>
    </section>
  )
}
