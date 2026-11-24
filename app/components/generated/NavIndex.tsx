import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export const navItems = [
  { num: '01', label: 'Work', href: '/work' },
  { num: '02', label: 'About', href: '/about' },
  { num: '03', label: 'Contact', href: `mailto:${identity.email}` },
]

export function NavIndex() {
  return (
    <ol
      className={css({
        listStyle: 'none',
        margin: '0',
        padding: '0',
        display: { base: 'none', lg: 'flex' },
        flexDirection: 'row',
        alignItems: 'center',
        gap: '40px',
        height: '100%',
      })}
    >
      {navItems.map((item) => (
        <li key={item.num} className={css({ height: '100%', display: 'flex' })}>
          <a
            href={item.href}
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              minHeight: '42px',
              color: 'text',
              fontFamily: 'body',
              fontWeight: 'bold',
              textStyle: 'sm',
              lineHeight: '1',
              letterSpacing: '0.01em',
              _hover: { color: 'accent', textDecoration: 'none' },
            })}
          >
            <span
              className={css({
                color: 'accent',
                textStyle: 'xs',
                fontWeight: 'bold',
                letterSpacing: '0.04em',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {item.num}
            </span>
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  )
}
