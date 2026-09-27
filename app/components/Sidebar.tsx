import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const LINKS = [
  { label: 'work', href: '/work' },
  { label: 'about', href: '/about' },
  { label: 'contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <nav
      aria-label="Primary"
      className={css({
        gridArea: 'rail',
        bg: 'bg',
        minHeight: { lg: '760px' },
        borderStyle: 'solid',
        borderColor: 'borderStrong',
        borderTopWidth: { base: '1px', lg: '0' },
        borderBottomWidth: { base: '1px', lg: '0' },
        borderRightWidth: '0',
        borderLeftWidth: { base: '0', lg: '1px' },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: { base: 'row', lg: 'column' },
          position: { lg: 'sticky' },
          top: { lg: '0' },
        })}
      >
        <a
          href="/"
          aria-label={`${identity.name}, home`}
          className={css({
            display: { base: 'none', lg: 'flex' },
            justifyContent: 'center',
            paddingTop: '20px',
            paddingBottom: '22px',
            color: 'accent',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          <BrandLockup variant="mark-only-md" mode="single-color" color="accent" />
        </a>
        <ul
          className={css({
            display: 'flex',
            flexDirection: { base: 'row', lg: 'column' },
            flex: { base: '1', lg: 'none' },
            listStyle: 'none',
            margin: '0',
            padding: '0',
          })}
        >
          {LINKS.map((link) => (
            <li
              key={link.label}
              className={css({
                flex: { base: '1', lg: 'none' },
                borderStyle: 'solid',
                borderColor: 'border',
                borderTopWidth: '0',
                borderLeftWidth: '0',
                borderRightWidth: { base: '1px', lg: '0' },
                borderBottomWidth: { base: '0', lg: '1px' },
                _last: { borderRightWidth: '0' },
              })}
            >
              <a
                href={link.href}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { base: '52px', lg: '56px' },
                  paddingBlock: { base: '14px', lg: '3' },
                  paddingInline: { base: '2', lg: '0' },
                  fontFamily: 'display',
                  fontSize: 'sm',
                  textTransform: 'lowercase',
                  letterSpacing: { base: 'wide', lg: 'normal' },
                  color: 'textMuted',
                  _hover: {
                    color: 'accent',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                    textDecorationColor: 'accent',
                  },
                })}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
