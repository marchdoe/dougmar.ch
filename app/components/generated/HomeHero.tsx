import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { SentenceNav } from './SentenceNav'

const vlabel = css({
  display: { base: 'none', lg: 'block' },
  position: 'absolute',
  zIndex: 2,
  writingMode: 'vertical-rl',
  textOrientation: 'mixed',
  fontSize: '15px',
  letterSpacing: 'widest',
  textTransform: 'lowercase',
  color: 'accent',
  fontWeight: 'bold',
})

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        bg: 'bg',
        minHeight: { base: '86vh', lg: '90vh' },
        paddingBlock: { base: '24px', sm: '40px', lg: '48px' },
        paddingInline: { base: '24px', sm: '40px', lg: '6vw' },
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <Ground material="dots" seed={826153393} />
      {/* The figure: the rotated field band settles in as part of the hero entrance.
          The wrapper carries the animation so the band keeps its own rotate transform. */}
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          inset: '0',
          zIndex: -1,
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '240ms',
        })}
      >
        <div
          data-allow-x-overflow=""
          className={css({
            position: 'absolute',
            left: { base: '-14%', sm: '-16%' },
            right: { base: '-14%', sm: '-16%' },
            top: { base: '30%', sm: '26%' },
            height: { base: '40%', sm: '48%' },
            bg: 'field',
            borderBlockWidth: { base: '0', sm: '1px' },
            borderBlockStyle: 'solid',
            borderColor: 'fieldBorder',
            transform: { sm: 'rotate(-8deg)' },
          })}
        />
      </div>
      <div
        className={css({
          position: { base: 'relative', lg: 'absolute' },
          top: { lg: '40px' },
          left: { lg: '6vw' },
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
        })}
      >
        <BrandLockup variant="horizontal-md" mode="original" />
      </div>
      <SentenceNav workHref="#index" placement="hero" />
      <span aria-hidden="true" className={`${vlabel} ${css({ left: '6vw', top: '20%' })}`}>
        designed
      </span>
      <span aria-hidden="true" className={`${vlabel} ${css({ right: '6vw', bottom: '16%' })}`}>
        shipped
      </span>
      <div
        className={css({
          position: 'relative',
          zIndex: 2,
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: '14px',
          paddingBlock: { base: '28px', lg: '0' },
          paddingInline: { lg: '7' },
        })}
      >
        <div
          className={css({
            fontSize: 'xs',
            letterSpacing: 'wide',
            color: 'text',
            textTransform: 'lowercase',
            fontWeight: 'bold',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          aldie, virginia · 40°f, clear
        </div>
        <h1
          className={css({
            textStyle: '2xl',
            fontSize: { sm: 'clamp(44px, 7.2vw, 110px)' },
            fontFamily: 'display',
            fontWeight: 'normal',
            lineHeight: 'tight',
            letterSpacing: 'tight',
            textTransform: 'lowercase',
            textAlign: 'center',
            color: 'fieldInk',
            maxWidth: { base: '16ch', lg: 'none' },
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          what ships should look like what was designed
        </h1>
        <p
          className={css({
            fontSize: { base: '18px', lg: '22px' },
            lineHeight: 'normal',
            color: 'text',
            maxWidth: '50ch',
            textAlign: 'center',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          The gap between the mockup and the build is the whole job. One skeleton for the design and
          the engineering, held to the same standard on both sides of the handoff.
        </p>
      </div>
    </section>
  )
}
