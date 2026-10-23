import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const links = [
  { label: 'work', href: '/#work' },
  { label: 'about', href: '/about' },
]

const linkClass = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: '46px',
  fontSize: '15px',
  color: 'textMuted',
  textTransform: 'lowercase',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'accent',
  transition: 'color 0.2s ease, padding 0.2s ease',
  _hover: { color: 'accent', paddingLeft: '6px' },
  _last: { borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'accent' },
})

export function Sidebar() {
  return (
    <header
      className={css({
        position: 'relative',
        zIndex: 1,
        paddingTop: 'clamp(20px, 5vw, 40px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        paddingBottom: { base: 'clamp(36px, 7vw, 64px)', lg: 'clamp(40px, 5vw, 72px)' },
      })}
    >
      <BrandLockup variant="horizontal-md" mode="original" roleLine />
      <nav
        aria-label="Primary"
        className={css({
          marginTop: '22px',
          maxWidth: '240px',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} className={linkClass}>
            {link.label}
          </a>
        ))}
        <a href={`mailto:${identity.email}`} className={linkClass}>
          contact
        </a>
      </nav>
    </header>
  )
}
