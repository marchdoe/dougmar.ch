import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

export function Sidebar() {
  const links = [
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: `mailto:${identity.email}`, label: 'Contact' },
  ]
  return (
    <header
      data-shell-margin=""
      className={css({
        gridColumn: { md: '9 / 13', lg: '10 / 13' },
        gridRow: { md: '1' },
        minWidth: '0',
        // bg ground: the full-colour mark clears 3:1 on it in both schemes (bgAlt failed in light)
        bg: 'bg',
        color: 'text',
        paddingInline: { base: '5vw', md: 'clamp(20px, 2.5vw, 40px)' },
        paddingTop: { base: '14px', md: 'clamp(28px, 3.4vw, 44px)' },
        paddingBottom: '14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: { base: 'flex-start', md: 'flex-end' },
        justifyContent: 'flex-start',
        gap: { base: '10px', md: 'clamp(20px, 3vw, 40px)' },
        borderStyle: 'solid',
        borderColor: 'borderStrong',
        borderTopWidth: '0',
        borderRightWidth: '0',
        borderBottomWidth: { base: '1px', md: '0' },
        borderLeftWidth: { base: '0', md: '1px' },
      })}
    >
      <BrandLockup
        variant="stacked-md"
        mode="original"
        roleLine
        className={css({ textAlign: { base: 'left', md: 'right' } })}
      />
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexDirection: { base: 'row', md: 'column' },
          flexWrap: { base: 'wrap', md: 'nowrap' },
          columnGap: { base: '18px', md: '0' },
          width: { base: '100%', md: 'auto' },
          minWidth: { md: '140px' },
        })}
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: { base: 'flex-start', md: 'flex-end' },
              minHeight: '44px',
              minWidth: '44px',
              paddingBlock: '6px',
              paddingInline: { base: '2px', md: '0' },
              color: 'text',
              textStyle: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              borderTopStyle: 'solid',
              borderTopWidth: { base: '0', md: '1px' },
              borderColor: 'accentAlt',
              _last: {
                borderBottomStyle: 'solid',
                borderBottomWidth: { base: '0', md: '1px' },
              },
              _hover: {
                color: 'accent',
                textDecoration: 'underline',
                textDecorationColor: 'accent',
                textUnderlineOffset: '4px',
              },
            })}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
