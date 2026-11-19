import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const navLinksClass = css({
  position: 'absolute',
  top: '100%',
  right: '0',
  marginTop: '6px',
  zIndex: 30,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '2px',
  bg: 'field',
  border: '1px solid',
  borderColor: 'fieldBorder',
  paddingBlock: '2',
  paddingInline: '3',
  visibility: 'hidden',
})

const navLinkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  minWidth: '44px',
  justifyContent: 'flex-end',
  fontSize: 'sm',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  color: 'fieldInkMuted',
  paddingBlock: '2',
  paddingInline: '1',
  lineHeight: '1',
  _hover: { color: 'accent' },
})

export function Sidebar() {
  return (
    <header
      className={css({
        position: 'relative',
        zIndex: 20,
        bg: 'field',
        color: 'fieldInk',
        borderBottom: '1px solid',
        borderColor: 'fieldBorder',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4',
        paddingBlock: '3',
        paddingInline: '6vw',
        minHeight: '112px',
      })}
    >
      <a
        href="/"
        aria-label="Doug March home"
        className={css({ display: 'flex', color: 'fieldInk' })}
      >
        <BrandLockup variant="stacked-lg" mode="original" />
      </a>
      <nav
        aria-label="Primary"
        className={css({
          position: 'relative',
          '&:hover .nav-links': { visibility: 'visible' },
          '&:focus-within .nav-links': { visibility: 'visible' },
        })}
      >
        <button
          type="button"
          className={css({
            bg: 'field',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'xl',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            color: 'fieldInkMuted',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2',
            minHeight: '44px',
            paddingBlock: '2',
            paddingInline: '0',
            _hover: { color: 'accent' },
          })}
        >
          Index
          <span
            aria-hidden="true"
            className={css({ fontSize: 'md', fontWeight: 'normal', color: 'fieldInkMuted' })}
          >
            +
          </span>
        </button>
        <span className={`nav-links ${navLinksClass}`}>
          <a href="/#work" className={navLinkClass}>
            Work
          </a>
          <a href="/about" className={navLinkClass}>
            About
          </a>
          <a href={`mailto:${identity.email}`} className={navLinkClass}>
            Contact
          </a>
        </span>
      </nav>
    </header>
  )
}
