import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const links = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: `mailto:${identity.email}` },
]

// Mockup ink50 on the tab maps to surface, the nearest token that holds on field in both schemes.
// Unresolved here: the clipped rail sentence at 820 is rendered by __root.tsx, which this run may not change.
export function Sidebar() {
  return (
    <header
      className={css({
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: 20,
        bg: 'field',
        color: 'fieldInk',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        paddingTop: '10px',
        paddingRight: '18px',
        paddingBottom: '12px',
        paddingLeft: '18px',
        borderRightWidth: '2px',
        borderRightStyle: 'solid',
        borderRightColor: 'borderStrong',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      <a
        href="/"
        aria-label={`${identity.name}, home`}
        className={css({ display: 'block', color: 'fieldInk' })}
      >
        <BrandLockup variant="mark-only-md" mode={{ light: 'original', dark: 'single-color' }} />
      </a>
      <details>
        <summary
          className={css({
            listStyle: 'none',
            cursor: 'pointer',
            fontFamily: 'body',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textStyle: 'sm',
            color: 'fieldInk',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            '&::-webkit-details-marker': { display: 'none' },
          })}
        >
          Index
        </summary>
        <nav
          aria-label="Primary"
          className={css({
            display: 'none',
            'details[open] > &': { display: 'flex' },
            flexWrap: 'wrap',
            rowGap: '4px',
            columnGap: '14px',
            marginTop: '4px',
          })}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={css({
                bg: 'field',
                color: 'surface',
                textStyle: 'sm',
                fontWeight: 'normal',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
                fontVariantCaps: 'all-small-caps',
                paddingBlock: '8px',
                paddingInline: '2px',
                minHeight: '44px',
                minWidth: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                _hover: { color: 'fieldInk' },
              })}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </details>
    </header>
  )
}
