import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const items = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <>
      <div
        className={css({
          order: { base: -2, lg: 0 },
          gridColumn: { lg: '1 / 5' },
          gridRow: { lg: '1' },
          paddingBottom: '16px',
          borderBottom: { base: 'none', lg: '2px solid' },
          borderBottomColor: 'borderStrong',
          color: 'text',
        })}
      >
        <BrandLockup variant="horizontal-md" mode="original" roleLine />
      </div>
      <nav
        aria-label="Primary"
        className={css({
          order: 0,
          marginTop: { base: '4px', lg: '18px' },
          marginBottom: { base: '20px', lg: '0' },
          gridColumn: { lg: '1 / 2' },
          gridRow: { lg: '2' },
          alignSelf: { lg: 'stretch' },
          borderRight: { base: 'none', lg: '1px solid' },
          borderRightColor: 'border',
          paddingRight: { base: '0', lg: '12px' },
        })}
      >
        <div
          className={css({
            display: { base: 'none', lg: 'block' },
            fontFamily: 'body',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            fontWeight: 'bold',
            textStyle: '2xs',
            color: 'textMuted',
            marginBottom: '8px',
          })}
        >
          Index
        </div>
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexDirection: { base: 'row', lg: 'column' },
            borderTop: '2px solid',
            borderTopColor: 'borderStrong',
            borderBottom: { base: '2px solid', lg: 'none' },
            borderBottomColor: 'borderStrong',
          })}
        >
          {items.map((item) => (
            <li
              key={item.label}
              className={css({
                flex: { base: '1', lg: 'none' },
                borderLeft: { base: '1px solid', lg: 'none' },
                borderTop: { base: 'none', lg: '1px solid' },
                borderColor: 'border',
                _first: { borderLeft: 'none', borderTop: 'none' },
              })}
            >
              <a
                href={item.href}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { base: 'center', lg: 'flex-start' },
                  minHeight: { base: '46px', lg: '48px' },
                  paddingInline: { base: '8px', lg: '0' },
                  fontFamily: 'body',
                  textTransform: 'uppercase',
                  letterSpacing: 'wide',
                  fontWeight: 'bold',
                  textStyle: 'sm',
                  color: 'text',
                  _hover: { color: 'accent', textDecoration: 'none' },
                })}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
