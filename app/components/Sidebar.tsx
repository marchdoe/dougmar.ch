import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

// The 820px "A new design ships every morning" overflow sits inside the root
// rail ([data-live-frame]), which __root.tsx renders above Layout. No file
// this shell owns renders that element, and the rail is not ours to style.

const links = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
]

const deskLink = css({
  display: 'block',
  paddingBlock: '11px',
  paddingInline: '2px',
  fontSize: 'sm',
  letterSpacing: '0.02em',
  color: 'textMuted',
  fontWeight: 'bold',
  _hover: { color: 'accentAlt' },
})

const mobLink = css({
  display: 'block',
  paddingBlock: '12px',
  paddingInline: '12px',
  minHeight: '44px',
  fontSize: 'sm',
  fontWeight: 'bold',
  color: 'textMuted',
  whiteSpace: 'nowrap',
})

const rowLine = css({
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
})

export function Sidebar() {
  const mail = `mailto:${identity.email}`
  return (
    <div
      className={css({
        position: 'relative',
        zIndex: 3,
        bg: 'bg',
        paddingTop: { base: '28px', lg: '36px' },
        paddingInline: { base: '6vw', lg: '5vw' },
      })}
    >
      <header
        className={css({
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
        })}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
          })}
        >
          <a
            href="/"
            aria-label="Doug March home"
            className={css({ color: 'text', _hover: { color: 'text' } })}
          >
            <BrandLockup variant="stacked-md" mode="original" />
          </a>
          <nav aria-label="Primary" className={css({ display: { base: 'none', lg: 'block' } })}>
            <ul
              className={css({
                listStyle: 'none',
                marginTop: '14px',
                marginBottom: '0',
                padding: '0',
                width: '160px',
                '& li': {
                  borderTopWidth: '1px',
                  borderTopStyle: 'solid',
                  borderTopColor: 'borderStrong',
                },
                '& li:last-child': {
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'borderStrong',
                },
              })}
            >
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={deskLink}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={mail} className={deskLink}>
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <nav
          aria-label="Menu"
          className={css({ position: 'relative', display: { base: 'block', lg: 'none' } })}
        >
          <details>
            <summary
              className={css({
                listStyle: 'none',
                cursor: 'pointer',
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: '20px',
                lineHeight: '1',
                letterSpacing: 'wide',
                color: 'accent',
                paddingBlock: '12px',
                paddingInline: '4px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                '&::-webkit-details-marker': { display: 'none' },
              })}
            >
              Menu
            </summary>
            <ul
              className={css({
                listStyle: 'none',
                margin: '0',
                padding: '0',
                textAlign: 'right',
                position: 'absolute',
                top: '100%',
                right: '0',
                minWidth: '160px',
                width: 'max-content',
                bg: 'surface',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'borderStrong',
                zIndex: 4,
              })}
            >
              {links.map((l) => (
                <li key={l.label} className={rowLine}>
                  <a href={l.href} className={mobLink}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li className={rowLine}>
                <a href={mail} className={mobLink}>
                  Contact
                </a>
              </li>
            </ul>
          </details>
        </nav>
      </header>
    </div>
  )
}
