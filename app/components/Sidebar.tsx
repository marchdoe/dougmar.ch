import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const links = [
  { label: 'work', href: '/work' },
  { label: 'about', href: '/about' },
]

const linkClass = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: { base: '44px', lg: '40px' },
  paddingInline: { base: '10px', lg: '4px' },
  fontFamily: 'body',
  fontSize: 'base',
  textTransform: 'lowercase',
  letterSpacing: '0.01em',
  color: 'fieldInk',
  _hover: { color: 'fieldInk', textDecoration: 'underline', textUnderlineOffset: '3px' },
})

const itemClass = css({
  borderTop: '1px solid',
  borderTopColor: 'fieldBorder',
  _last: { borderBottom: '1px solid', borderBottomColor: 'fieldBorder' },
})

export function Sidebar() {
  return (
    // spine ink: mockup lime100 has no token in light; nearest is fieldInk (lime300)
    <header className={css({ bg: 'field', color: 'fieldInk' })}>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
          paddingTop: '20px',
          paddingInline: '20px',
          paddingBottom: '4',
          lg: {
            position: 'sticky',
            top: '0',
            minHeight: '140px',
            gap: '28px',
            paddingTop: '4',
            paddingInline: '18px',
            paddingBottom: '28px',
          },
        })}
      >
        <a
          href="/"
          aria-label="Doug March, home"
          className={css({ display: 'flex', color: 'fieldInk', _hover: { color: 'fieldInk' } })}
        >
          <BrandLockup
            variant="horizontal-md"
            mode={{ light: 'original', dark: 'single-color' }}
            roleLine
          />
        </a>
        <nav aria-label="Primary">
          <ul
            className={css({
              display: 'flex',
              flexDirection: { base: 'row', lg: 'column' },
              flexWrap: 'wrap',
              listStyle: 'none',
              margin: '0',
              padding: '0',
            })}
          >
            {links.map((link) => (
              <li key={link.href} className={itemClass}>
                <a href={link.href} className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className={itemClass}>
              <a href={`mailto:${identity.email}`} className={linkClass}>
                contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
