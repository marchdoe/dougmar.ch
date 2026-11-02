import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutHero() {
  const eyebrow = [identity.name, identity.role].filter(Boolean).join(' · ')
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bg',
        paddingTop: { base: '30px', lg: '48px' },
        paddingBottom: { base: '40px', lg: '64px' },
        paddingInline: { base: '6vw', lg: '5vw' },
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'sm',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'textMuted',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
          _before: {
            content: '""',
            width: '28px',
            height: '4px',
            bg: 'accent',
            display: 'inline-block',
            flexShrink: '0',
          },
        })}
      >
        {eyebrow}
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(28px, 3.4vw, 46px)',
          lineHeight: '1.06',
          color: 'text',
          maxWidth: '26ch',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.statement}
      </h1>
    </section>
  )
}
