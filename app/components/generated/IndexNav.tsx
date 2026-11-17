import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const linkClass = css({
  color: 'fieldInk',
  display: 'flex',
  alignItems: 'center',
  minHeight: '44px',
  paddingBlock: '12px',
  paddingInline: '16px',
  whiteSpace: 'nowrap',
  _hover: { color: 'accentAlt', textDecoration: 'underline', textDecorationColor: 'accentAlt' },
})

export function IndexNav() {
  return (
    <nav
      aria-label="Primary"
      className={css({
        position: 'relative',
        flex: 'none',
        fontFamily: 'display',
        fontVariant: 'small-caps',
        textStyle: 'sm',
        letterSpacing: 'wide',
        '&:hover [data-nav-links], &:focus-within [data-nav-links]': {
          visibility: 'visible',
          opacity: '1',
        },
      })}
    >
      <button
        type="button"
        aria-haspopup="true"
        className={css({
          bg: 'transparent',
          borderWidth: '0',
          color: 'fieldInk',
          fontFamily: 'display',
          fontVariant: 'small-caps',
          fontWeight: 'bold',
          fontSize: 'inherit',
          letterSpacing: 'wide',
          cursor: 'pointer',
          paddingBlock: '12px',
          paddingInline: '4px',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
        })}
      >
        Index
        <span aria-hidden="true" className={css({ color: 'fieldInkMuted', marginLeft: '6px' })}>
          +
        </span>
      </button>
      <div
        data-nav-links=""
        className={css({
          position: 'absolute',
          top: '100%',
          right: '0',
          zIndex: '5',
          display: 'flex',
          flexDirection: 'column',
          bg: 'field',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'fieldBorder',
          visibility: 'hidden',
          opacity: '0',
          transition: 'opacity 0.25s ease, visibility 0.25s ease',
        })}
      >
        <a href="/work" className={linkClass}>
          work
        </a>
        <a href="/about" className={linkClass}>
          about
        </a>
        <a href={`mailto:${identity.email}`} className={linkClass}>
          contact
        </a>
      </div>
    </nav>
  )
}
