import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function RailNav() {
  const links = [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: `mailto:${identity.email}` },
  ]
  return (
    <nav
      aria-label="Primary"
      className={css({
        display: 'flex',
        flexDirection: 'column',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
      })}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={css({
            display: 'flex',
            alignItems: 'center',
            minHeight: '48px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'fieldBorder',
            textStyle: 'base',
            fontWeight: 'bold',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'fieldInk',
            _hover: {
              color: 'fieldInkMuted',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            },
          })}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
