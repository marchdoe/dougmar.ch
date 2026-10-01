import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

export function HomeHero() {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        paddingTop: '28px',
        paddingBottom: '40px',
        paddingInline: '24px',
        minHeight: '62vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        md: { paddingTop: '40px', paddingBottom: '56px', paddingInline: '6vw' },
        lg: { minHeight: '52vh' },
      })}
    >
      <Ground material="dots" seed={1027631916} />
      <span
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          display: 'none',
          lg: { display: 'block' },
          position: 'absolute',
          zIndex: 0,
          right: '2vw',
          bottom: '-0.12em',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          fontSize: '20vw',
          lineHeight: '0.8',
          whiteSpace: 'nowrap',
          color: 'fieldInk',
          opacity: 0.06,
          pointerEvents: 'none',
          userSelect: 'none',
        })}
      >
        minds
      </span>
      <div className={css({ position: 'relative', zIndex: 1, width: '100%' })}>
        <div
          className={css({
            color: 'fieldInk',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            lg: { display: 'none' },
          })}
        >
          <BrandLockup variant="stacked-md" mode="single-color" />
        </div>
        <p
          className={css({
            fontSize: 'sm',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            fontWeight: 'bold',
            marginTop: '48px',
            marginBottom: '18px',
            animationName: 'wipe',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '80ms',
          })}
        >
          Aldie, Virginia · October 1
        </p>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: { base: 'clamp(30px, 8.4vw, 62px)', xl: 'clamp(44px, 4.3vw, 64px)' },
            lineHeight: '1.04',
            color: 'fieldInk',
            textAlign: 'left',
            maxWidth: { base: '18ch', xl: '16ch' },
            animationName: 'wipe',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '0ms',
          })}
        >
          None but ourselves can free our minds.
        </h1>
        <p
          className={css({
            marginTop: '16px',
            fontSize: '14px',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            fontWeight: 'bold',
            animationName: 'wipe',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '160ms',
          })}
        >
          Bob Marley, Redemption Song
        </p>
      </div>
    </header>
  )
}
