import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const navLink = css({
  color: 'text',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  textDecorationThickness: '1px',
  display: 'inline-block',
  paddingBlock: '6px',
  paddingInline: '2px',
  minHeight: '44px',
  lineHeight: '32px',
  _hover: { color: 'accent' },
  lg: { paddingBlock: '4px', minHeight: '0', lineHeight: '1.6' },
})

export function Sidebar() {
  return (
    <header
      className={css({
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingBlock: '20px',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        bg: 'bg',
        lg: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
      })}
    >
      <a
        href="/"
        aria-label="Doug March, home"
        className={css({ display: 'inline-flex', color: 'text' })}
      >
        <BrandLockup variant="stacked-md" mode="original" />
      </a>
      <nav
        aria-label="Primary"
        className={css({
          fontSize: 'sm',
          color: 'textMuted',
          lineHeight: '1.6',
          maxWidth: '34ch',
          textTransform: 'lowercase',
          lg: { textAlign: 'right', maxWidth: '40ch' },
        })}
      >
        see{' '}
        <a href="/#work" className={navLink}>
          the work
        </a>
        , read{' '}
        <a href="/about" className={navLink}>
          about me
        </a>
        , say{' '}
        <a href={`mailto:${identity.email}`} className={navLink}>
          hello
        </a>
        .
      </nav>
    </header>
  )
}
