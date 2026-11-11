import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const menuLink = css({
  minHeight: '44px',
  minWidth: '44px',
  paddingInline: '1',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  color: 'textMuted',
})

export function Sidebar() {
  return (
    <header
      className={css({
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBlock: '10px',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        bg: 'bg',
        position: 'relative',
        zIndex: 5,
      })}
    >
      <a
        href="/"
        aria-label="Doug March, home"
        className={css({
          display: 'flex',
          alignItems: 'center',
          color: 'text',
          _hover: { textDecorationLine: 'none', color: 'text' },
        })}
      >
        <BrandLockup variant="stacked-md" mode="original" />
      </a>
      <nav
        aria-label="Primary"
        className={css({
          position: 'relative',
          '&:hover [data-reveal], &:focus-within [data-reveal]': { display: 'flex' },
        })}
      >
        <button
          type="button"
          className={css({
            fontFamily: 'body',
            fontWeight: '500',
            fontSize: 'sm',
            color: 'text',
            letterSpacing: '0.01em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            minHeight: '44px',
            minWidth: '44px',
            paddingInline: '1',
            bg: 'transparent',
            borderWidth: '0',
            cursor: 'pointer',
            _after: { content: '"+"', color: 'accent', lineHeight: '1' },
          })}
        >
          Index
        </button>
        <div
          data-reveal=""
          className={css({
            position: 'absolute',
            top: '100%',
            right: '0',
            zIndex: 10,
            display: 'none',
            flexDirection: 'column',
            alignItems: 'flex-end',
            bg: 'surface',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'sm',
            paddingBlock: '1',
            paddingInline: '3',
            minWidth: '140px',
            fontSize: 'sm',
          })}
        >
          <a href="/#work" className={menuLink}>
            Work
          </a>
          <a href="/about" className={menuLink}>
            About
          </a>
          <a href={`mailto:${identity.email}`} className={menuLink}>
            Contact
          </a>
        </div>
      </nav>
    </header>
  )
}
