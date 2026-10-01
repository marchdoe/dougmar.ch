import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

export function AboutHero() {
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
        md: { paddingTop: '40px', paddingBottom: '56px', paddingInline: '6vw' },
      })}
    >
      <Ground material="dots" seed={1027631916} />
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
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '4',
            rowGap: '1',
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
          <span>{identity.name}</span>
          <span>{identity.role}</span>
        </p>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: 'clamp(24px, 4vw, 44px)',
            lineHeight: 'snug',
            color: 'fieldInk',
            textAlign: 'left',
            maxWidth: '30ch',
            animationName: 'wipe',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
      </div>
    </header>
  )
}
