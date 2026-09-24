import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

export function HomeHero() {
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
        <h1 className={css({ margin: '0', fontWeight: 'light', textAlign: 'left' })}>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'light',
              textTransform: 'lowercase',
              fontSize: { base: '4xl', lg: 'hero' },
              lineHeight: '0.92',
              letterSpacing: { base: '-0.02em', '2xl': '-0.025em' },
              color: 'text',
              whiteSpace: 'nowrap',
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            commitments
          </span>
          <span
            className={css({
              display: 'block',
              marginTop: { base: '40px', xl: '52px' },
              marginInline: '-6vw',
              bg: 'field',
              color: 'fieldInk',
              paddingInline: '6vw',
              paddingTop: { base: '40px', xl: '52px' },
              paddingBottom: { base: '48px', xl: '60px' },
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontStyle: 'italic',
                fontWeight: 'light',
                fontSize: { base: 'md', md: 'lg', xl: 'xl' },
                lineHeight: '1.36',
                color: 'fieldInk',
                maxWidth: { base: '34ch', xl: '44ch' },
              })}
            >
              The quality of your commitments will determine the course of your life.
            </span>
            <span
              className={css({
                display: 'block',
                marginTop: '16px',
                fontFamily: 'body',
                fontSize: 'xs',
                fontWeight: 600,
                fontVariantCaps: 'all-small-caps',
                letterSpacing: 'wide',
                color: 'fieldInkMuted',
              })}
            >
              Ralph Marston
            </span>
          </span>
        </h1>
      </div>
    </section>
  )
}
