import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

// Light scheme: accent (chartreuse.600) is 2.2:1 on bg, so small links take text.
// The mark is full colour in both schemes: on bg its blue reaches 3.4:1 in light
// (warmblack.50) and its white disc 19.5:1 in dark (warmblack.900), so it passes
// the Brand Contract's contrast test and mono is not needed.
const linkClass = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: { base: '44px', lg: '56px' },
  minWidth: '44px',
  paddingLeft: { base: '12px', lg: '22px' },
  paddingRight: { base: '12px', lg: '8px' },
  fontSize: '14px',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  color: { base: 'accent', _light: 'text' },
  whiteSpace: 'nowrap',
  transition: 'color 0.18s ease',
  borderBottom: { base: 'none', lg: '1px solid' },
  borderColor: 'border',
  _hover: { color: 'accentAlt' },
})

export function Sidebar() {
  const links = [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: `mailto:${identity.email}` },
  ]
  return (
    <header
      className={css({
        position: 'relative',
        zIndex: 5,
        bg: 'bg',
        borderBottom: { base: '1px solid', lg: 'none' },
        borderRight: { base: 'none', lg: '1px solid' },
        borderColor: 'border',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: { base: 'row', lg: 'column' },
          alignItems: { base: 'center', lg: 'flex-start' },
          justifyContent: { base: 'space-between', lg: 'flex-start' },
          gap: { base: '16px', lg: '48px' },
          paddingTop: { base: '16px', lg: '40px' },
          paddingBottom: { base: '16px', lg: '40px' },
          paddingLeft: { base: '20px', lg: '0' },
          paddingRight: { base: '20px', lg: '0' },
          position: { base: 'static', lg: 'sticky' },
          top: '0',
          bg: 'bg',
        })}
      >
        <a
          href="/"
          aria-label="Doug March, home"
          className={css({
            display: 'block',
            color: { base: 'accent', _light: 'accentAlt' },
            paddingLeft: { base: '0', lg: '22px' },
            _hover: { color: { base: 'accentAlt', _light: 'accentAlt' } },
          })}
        >
          <BrandLockup variant="mark-only-md" mode="original" />
        </a>
        <nav
          aria-label="Primary"
          className={css({
            display: 'flex',
            flexDirection: { base: 'row', lg: 'column' },
            alignItems: { base: 'center', lg: 'stretch' },
            gap: { base: '2px', lg: '0' },
            width: { base: 'auto', lg: '100%' },
            borderTop: { base: 'none', lg: '1px solid' },
            borderColor: 'border',
          })}
        >
          {links.map((link) => (
            <a key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
