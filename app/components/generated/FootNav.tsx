import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const links = [
  { n: '01', label: 'Work', href: '/work' },
  { n: '02', label: 'About', href: '/about' },
  { n: '03', label: 'Contact', href: `mailto:${identity.email}` },
]

export function FootNav() {
  return (
    <nav
      aria-label="Primary"
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', sm: 'row' },
        flexWrap: { sm: 'wrap' },
        columnGap: { sm: '28px' },
        borderBottom: '1px solid',
        borderBottomColor: 'fieldBorder',
        paddingBottom: '1',
      })}
    >
      {links.map((link) => (
        <a
          key={link.n}
          href={link.href}
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '3',
            minHeight: { base: '48px', sm: '44px' },
            borderTop: { base: '1px solid', sm: 'none' },
            borderTopColor: 'fieldBorder',
            textStyle: 'sm',
            fontWeight: 'bold',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'fieldInk',
            // mockup hover is oxblood 300; nearest legible token on field is fieldInkMuted
            _hover: { color: 'fieldInkMuted', textDecoration: 'none' },
          })}
        >
          <span className={css({ color: 'fieldInkMuted', textStyle: 'xs' })}>{link.n}</span>
          {link.label}
        </a>
      ))}
    </nav>
  )
}
