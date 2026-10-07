import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const links = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <header
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '2',
        paddingInline: '20px',
        paddingTop: '18px',
        paddingBottom: '2',
        bg: 'bgAlt',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'borderStrong',
        position: 'relative',
        zIndex: 3,
        lg: {
          alignItems: 'center',
          gridColumn: '1',
          gridRow: '1 / span 2',
          gap: '0',
          borderBottomWidth: '0',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          paddingInline: '0',
          paddingTop: '28px',
          paddingBottom: '0',
        },
      })}
    >
      <div className={css({ display: 'flex', alignItems: 'center', lg: { marginBottom: '40px' } })}>
        <BrandLockup variant="mark-only-md" mode="original" />
      </div>
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          columnGap: '5',
          lg: { flexDirection: 'column', columnGap: '0', width: '100%' },
        })}
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              paddingBlock: '0',
              paddingInline: '0',
              textStyle: 'xs',
              fontFamily: 'body',
              fontWeight: 'bold',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textMuted',
              transition: 'color .2s ease, border-color .2s ease, background .2s ease',
              _hover: { color: 'accent' },
              lg: {
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                minHeight: '52px',
                textStyle: 'sm',
                letterSpacing: 'wide',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderColor: 'borderStrong',
                _hover: { bg: 'surface' },
                _last: { borderBottomWidth: '1px', borderBottomStyle: 'solid' },
              },
            })}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
