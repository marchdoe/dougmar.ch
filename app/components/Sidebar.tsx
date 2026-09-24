import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const links = [
  { num: '01', label: 'Work', href: '/#work' },
  { num: '02', label: 'About', href: '/about' },
  { num: '03', label: 'Contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <header
      className={css({
        position: 'relative',
        bg: 'bg',
        paddingTop: { base: '32px', md: '40px', xl: '44px' },
        paddingInline: '6vw',
      })}
    >
      <a
        href="/"
        aria-label={identity.name}
        className={css({
          display: 'inline-block',
          color: 'text',
          _hover: { color: 'text', textDecoration: 'none' },
        })}
      >
        <BrandLockup variant="stacked-lg" mode="original" />
      </a>
      <nav aria-label="Primary" className={css({ marginTop: '20px' })}>
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: '8px',
            columnGap: { base: '22px', md: '30px' },
          })}
        >
          {links.map((link) => (
            <li key={link.num}>
              <a
                href={link.href}
                className={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  minHeight: '44px',
                  minWidth: '44px',
                  paddingBlock: '4px',
                  paddingInline: '4px',
                  fontFamily: 'body',
                  fontSize: 'sm',
                  fontWeight: 500,
                  fontVariantCaps: 'all-small-caps',
                  textTransform: 'lowercase',
                  letterSpacing: 'wide',
                  color: 'textMuted',
                  _hover: { color: 'accent', textDecoration: 'none' },
                })}
              >
                <span
                  className={css({
                    fontVariantNumeric: 'tabular-nums',
                    color: 'accent',
                    fontWeight: 600,
                  })}
                >
                  {link.num}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
