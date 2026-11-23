import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const navLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  paddingInline: '1',
  color: 'text',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
})

export function Sidebar() {
  return (
    <header
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', sm: 'row' },
        justifyContent: { base: 'flex-start', sm: 'space-between' },
        alignItems: 'flex-start',
        gap: '4',
        paddingTop: 'clamp(20px, 2.4vw, 34px)',
        paddingInline: 'clamp(24px, 5vw, 72px)',
        bg: 'bg',
        color: 'text',
      })}
    >
      <a
        href="/"
        aria-label={`${identity.name}, home`}
        className={css({ display: 'inline-block', color: 'text' })}
      >
        {/* The full-colour mark passes contrast on both grounds, so it renders original in each scheme. */}
        <BrandLockup variant="stacked-lg" mode="original" />
      </a>
      <nav
        aria-label="Primary"
        className={css({
          textStyle: 'sm',
          textTransform: 'lowercase',
          color: 'textMuted',
          lineHeight: 'snug',
          maxWidth: '40ch',
          textAlign: { base: 'left', sm: 'right' },
        })}
      >
        start at{' '}
        <a href="/#work" className={navLink}>
          the work
        </a>
        , meet{' '}
        <a href="/about" className={navLink}>
          the person
        </a>
        , or find{' '}
        <a href={`mailto:${identity.email}`} className={navLink}>
          a way in
        </a>
        .
      </nav>
    </header>
  )
}
