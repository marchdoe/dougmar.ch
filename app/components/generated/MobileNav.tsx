import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function MobileNav() {
  const items = [
    { n: '01', label: 'Work', href: '/work' },
    { n: '02', label: 'About', href: '/about' },
    { n: '03', label: 'Contact', href: `mailto:${identity.email}` },
  ]
  return (
    <div
      className={css({
        paddingInline: '24px',
        marginTop: '48px',
        md: { paddingInline: '6vw' },
        lg: { display: 'none' },
      })}
    >
      <nav
        aria-label="Primary mobile"
        className={css({
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        })}
      >
        {items.map((item) => (
          <a
            key={item.n}
            href={item.href}
            className={css({
              display: 'flex',
              alignItems: 'baseline',
              gap: '14px',
              paddingBlock: '16px',
              paddingInline: '2px',
              minHeight: '44px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontSize: '22px',
              color: 'text',
              _hover: { color: 'accent' },
            })}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: '12px',
                color: 'accent',
                letterSpacing: 'wider',
                fontVariantNumeric: 'tabular-nums lining-nums',
              })}
            >
              {item.n}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}
