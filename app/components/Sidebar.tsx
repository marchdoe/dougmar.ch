import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const links = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <header
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '3',
        paddingBlock: '3',
        paddingInline: '20px',
        bg: 'bg',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'border',
        lg: {
          gridColumn: '1',
          gridRow: '1',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '0',
          paddingBlock: '28px',
          paddingInline: '10px',
          borderBottomWidth: '0',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
        },
      })}
    >
      <a
        href="/"
        aria-label="Doug March, home"
        className={css({
          display: 'block',
          flexShrink: 0,
          color: 'text',
          lg: { marginBottom: '40px' },
        })}
      >
        <BrandLockup variant="mark-only-md" mode="original" />
      </a>
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '1',
          lg: { flexDirection: 'column', gap: '0', width: '100%' },
        })}
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '44px',
              minWidth: '48px',
              paddingBlock: '12px',
              paddingInline: '10px',
              fontFamily: 'body',
              fontWeight: 'bold',
              textStyle: 'sm',
              lineHeight: '1',
              color: 'text',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              borderLeftWidth: { base: '1px', lg: '0' },
              borderTopWidth: { base: '0', lg: '1px' },
              borderRightWidth: '0',
              borderBottomWidth: '0',
              _first: { borderLeftWidth: '0', borderTopWidth: '0' },
              _hover: { color: 'accent', boxShadow: 'inset 0 -2px 0 currentColor' },
              lg: { width: '100%', paddingBlock: '18px', paddingInline: '4px' },
            })}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
