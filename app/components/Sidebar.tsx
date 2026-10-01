import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { identity } from '../content/about'

export function Sidebar() {
  const items = [
    { n: '01', label: 'Work', href: '/work' },
    { n: '02', label: 'About', href: '/about' },
    { n: '03', label: 'Contact', href: `mailto:${identity.email}` },
  ]
  return (
    <aside
      className={css({
        display: 'none',
        lg: {
          display: 'block',
          position: 'relative',
          borderLeftWidth: '1px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'border',
          bg: 'bg',
          paddingTop: '32px',
        },
      })}
    >
      <div
        className={css({
          position: 'sticky',
          top: '0',
          minHeight: '640px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '28px',
        })}
      >
        <div
          className={css({
            color: 'text',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '40px',
          })}
        >
          <BrandLockup variant="stacked-md" mode="single-color" />
        </div>
        <nav
          aria-label="Primary"
          className={css({
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
          })}
        >
          {items.map((item) => (
            <a
              key={item.n}
              href={item.href}
              className={css({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '6px',
                paddingBlock: '22px',
                paddingInline: '4px',
                minHeight: '88px',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'border',
                fontFamily: 'display',
                fontWeight: 'bold',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                fontSize: 'sm',
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
              <span className={css({ display: 'block' })}>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
