import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const links = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: `mailto:${identity.email}` },
]

export function NavList() {
  return (
    <ul
      className={css({
        listStyle: 'none',
        margin: '0',
        padding: '0',
        display: 'flex',
        flexDirection: { base: 'row', lg: 'column' },
        gap: { base: '6px', lg: '0' },
        borderTopWidth: { base: '1px', lg: '0' },
        borderBottomWidth: { base: '1px', lg: '0' },
        borderStyle: 'solid',
        borderColor: 'border',
        borderLeftWidth: '0',
        borderRightWidth: '0',
      })}
    >
      {links.map((link) => (
        <li
          key={link.label}
          className={css({
            flex: '0 0 auto',
            borderTopWidth: { base: '0', lg: '1px' },
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            _last: {
              borderBottomWidth: { base: '0', lg: '1px' },
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            },
          })}
        >
          <a
            href={link.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: { base: 'center', lg: 'flex-start' },
              minHeight: '44px',
              minWidth: '44px',
              paddingLeft: { base: '14px', lg: '22px' },
              paddingRight: { base: '14px', lg: '0' },
              width: { lg: '96px' },
              fontFamily: 'body',
              fontSize: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'textMuted',
              _hover: { color: 'accent' },
            })}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
