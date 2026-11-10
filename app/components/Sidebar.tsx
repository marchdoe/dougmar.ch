import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const NAV = [
  { num: '01', label: 'Work', href: '/work' },
  { num: '02', label: 'About', href: '/about' },
  { num: '03', label: 'Contact', href: `mailto:${identity.email}` },
]

// The rail head. In flow above every route at a fixed height from lg up; the split
// heroes pull up by the same 128px so the olive field runs beside this block.
export function Sidebar() {
  return (
    <header
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1.55fr 1fr' },
        height: { lg: '128px' },
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <div
        className={css({
          gridColumn: { lg: '2' },
          position: 'relative',
          zIndex: '2',
          paddingTop: { base: '14px', lg: '18px' },
          paddingBottom: { base: '8px', lg: '18px' },
          paddingInline: { base: '14px', lg: 'clamp(28px, 3vw, 52px)' },
        })}
      >
        <a href="/" className={css({ display: 'inline-block', color: 'text' })}>
          <BrandLockup variant="horizontal-md" mode="original" roleLine />
        </a>
        <nav aria-label="Primary" className={css({ marginTop: { base: '4px', lg: '10px' } })}>
          <ul
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              rowGap: { base: '18px', lg: '14px' },
              columnGap: { base: '18px', lg: '26px' },
            })}
          >
            {NAV.map((item) => (
              <li key={item.num}>
                <a
                  href={item.href}
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: { base: '44px', lg: 'auto' },
                    paddingBlock: { lg: '4px' },
                    textStyle: 'sm',
                    fontWeight: 'bold',
                    fontVariant: 'small-caps',
                    textTransform: 'lowercase',
                    letterSpacing: '0.06em',
                    color: 'textMuted',
                    transition: 'color 0.18s ease',
                    _hover: { color: 'accent' },
                  })}
                >
                  <span
                    className={css({
                      fontVariantCaps: 'normal',
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: '13px',
                      color: 'accent',
                    })}
                  >
                    {item.num}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
