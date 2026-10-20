import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

const linkClass = css({
  fontFamily: 'display',
  fontSize: '15px',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  color: 'text',
  display: 'inline-block',
  minHeight: '44px',
  minWidth: '44px',
  lineHeight: '44px',
  paddingInline: '4px',
  textAlign: 'center',
  textDecoration: 'underline',
  textDecorationColor: 'accent',
  textUnderlineOffset: '0.18em',
})

export function AboutHero() {
  const kicker = ['About', identity.role].filter(Boolean).join(' · ')
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        paddingTop: 'clamp(34px, 6vw, 76px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
        paddingBottom: 'clamp(48px, 6vw, 96px)',
      })}
    >
      <Ground material="rule" seed={709202928} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <BrandLockup variant="stacked-lg" mode="original" />
        <div
          className={css({
            marginTop: 'clamp(28px, 5vw, 60px)',
            fontFamily: 'display',
            fontSize: '13px',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
            bg: 'bg',
            width: 'fit-content',
            marginBottom: '14px',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {kicker}
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            color: 'text',
            fontSize: 'clamp(26px, 3.4vw, 42px)',
            lineHeight: '1.15',
            letterSpacing: '-0.01em',
            maxWidth: '30ch',
            marginBottom: '24px',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
        <p
          className={css({
            fontFamily: 'body',
            fontSize: '16px',
            color: 'textMuted',
            bg: 'bg',
            width: 'fit-content',
            lineHeight: '2.5',
            maxWidth: '40ch',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          {identity.name}. See the{' '}
          <a href="/#work" className={linkClass}>
            work
          </a>
          , go{' '}
          <a href="/" className={linkClass}>
            home
          </a>
          , or{' '}
          <a href={`mailto:${identity.email}`} className={linkClass}>
            get in touch
          </a>
          .
        </p>
      </div>
    </header>
  )
}
