import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const navLink = css({
  fontFamily: 'body',
  fontSize: 'sm',
  fontWeight: '500',
  textTransform: 'lowercase',
  letterSpacing: '0.02em',
  color: 'textMuted',
  paddingBlock: { base: '11px', md: '3px' },
  paddingInline: '16px',
  minHeight: { base: '44px', md: '0' },
  display: 'inline-flex',
  alignItems: 'center',
  position: 'relative',
  transition: 'color 0.2s ease',
  _after: {
    content: '""',
    position: 'absolute',
    left: '16px',
    right: '16px',
    bottom: '6px',
    height: '1px',
    bg: 'fieldBorder',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.25s ease',
  },
  _hover: { color: 'fieldBorder' },
  '&:hover::after': { transform: 'scaleX(1)' },
})

export function Sidebar() {
  return (
    <header
      className={css({
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        paddingTop: '12px',
        paddingBottom: '0',
        paddingInline: 'clamp(24px, 6vw, 112px)',
      })}
    >
      <a
        href="/"
        aria-label={`${identity.name}, home`}
        className={css({ display: 'inline-flex', alignItems: 'center', _hover: { color: 'text' } })}
      >
        <BrandLockup variant="mark-only-md" mode="original" />
      </a>
      <nav className={css({ display: 'flex', gap: '2px', alignItems: 'center', marginTop: '2px' })}>
        <a href="/#work" className={navLink}>
          work
        </a>
        <a href="/about" className={navLink}>
          about
        </a>
        <a href={`mailto:${identity.email}`} className={navLink}>
          contact
        </a>
      </nav>
      {/* accentDeep (#8F5316) maps to fieldBorder, the exact token for that hex */}
      <div
        className={css({
          width: '100%',
          maxWidth: '1216px',
          height: '1px',
          bg: 'fieldBorder',
          opacity: 0.55,
          marginTop: '6px',
        })}
      />
    </header>
  )
}
