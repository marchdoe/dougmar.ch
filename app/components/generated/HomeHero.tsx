import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        bg: 'bg',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: { base: '14px', lg: '52px' },
        paddingBottom: { base: '44px', lg: '56px' },
        paddingLeft: { base: '20px', lg: '48px' },
        paddingRight: { base: '20px', lg: '6vw' },
        minHeight: { lg: '72vh' },
      })}
    >
      <Ground material="grain" seed={876486250} />
      {/* ember glow: mockup's accent-at-20% radial maps to bgAlt (red.900) through a radial mask */}
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          inset: '-4%',
          zIndex: -1,
          bg: 'bgAlt',
          pointerEvents: 'none',
          maskImage: 'radial-gradient(44% 42% at 88% 94%, black 0%, transparent 62%)',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <h1 className={css({ display: 'block', textAlign: 'left' })}>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'bold',
              textTransform: 'lowercase',
              fontSize: { base: '60px', lg: 'hero' },
              lineHeight: { base: '0.86', lg: '0.82' },
              letterSpacing: 'tight',
              color: 'accent',
            })}
          >
            thousands
          </span>
          <span
            className={css({
              display: 'block',
              marginTop: { base: '22px', lg: '28px' },
              maxWidth: '32ch',
              fontFamily: 'body',
              fontStyle: 'normal',
              fontWeight: 'normal',
              textTransform: 'none',
              fontSize: { base: '20px', lg: '30px' },
              lineHeight: 'snug',
              color: 'text',
            })}
          >
            of kids practicing spelling from the list the teacher sent home.
          </span>
        </h1>
      </div>
    </section>
  )
}
