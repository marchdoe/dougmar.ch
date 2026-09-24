import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { Ground } from '../Material'

export function AboutHero() {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bg',
        overflow: 'hidden',
        paddingInline: '6vw',
        paddingTop: { base: '48px', xl: '64px' },
        paddingBottom: { base: '56px', md: '72px', xl: '88px' },
      })}
    >
      <Ground material="rule" seed={1908855130} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'light',
            fontSize: { base: 'lg', lg: 'xl' },
            lineHeight: '1.3',
            color: 'text',
            maxWidth: '32ch',
            textAlign: 'left',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
        <span
          className={css({
            display: 'block',
            marginTop: '20px',
            fontFamily: 'body',
            fontSize: 'xs',
            fontWeight: 600,
            fontVariantCaps: 'all-small-caps',
            letterSpacing: 'wide',
            color: 'textFaint',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {identity.role}
        </span>
      </div>
    </section>
  )
}
