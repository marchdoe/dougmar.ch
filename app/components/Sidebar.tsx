import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const links = [
  { n: '01', label: 'Work', href: '/work' },
  { n: '02', label: 'About', href: '/about' },
]

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  minHeight: '44px',
  minWidth: '44px',
  paddingBlock: '4px',
  paddingInlineStart: '0',
  paddingInlineEnd: '14px',
  textDecoration: 'none',
  color: 'text',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  fontSize: 'sm',
  fontWeight: 'bold',
  _hover: { color: 'accent' },
})

const numClass = css({ color: 'textMuted', fontSize: 'xs', fontVariantNumeric: 'tabular-nums' })

export function Sidebar() {
  return (
    <header className={css({ position: 'relative', zIndex: 5, bg: 'bg' })}>
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          flexWrap: { base: 'wrap', lg: 'nowrap' },
          rowGap: { base: '14px', lg: '0' },
          columnGap: { base: '22px', lg: '28px' },
          paddingBlock: { base: '10px', lg: '0' },
          paddingInline: 'clamp(24px, 6vw, 96px)',
          height: { lg: '64px' },
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        {/* mockup espresso #2A2010 has no semantic token; nearest is text */}
        {/* the lockup gets its own full row below lg and never shrinks, so its role line keeps its full width at 820 */}
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            flexBasis: { base: '100%', lg: 'auto' },
            minWidth: { md: 'max-content' },
            color: 'text',
          })}
        >
          <BrandLockup variant="horizontal-md" mode="single-color" roleLine />
        </div>
        <nav
          aria-label="Primary"
          className={css({
            flexBasis: { base: '100%', lg: 'auto' },
            display: 'flex',
            flexWrap: 'wrap',
            gap: { base: '4px', lg: '10px' },
          })}
        >
          {links.map((l) => (
            <a key={l.href} href={l.href} className={linkClass}>
              <span className={numClass}>{l.n}</span>
              {l.label}
            </a>
          ))}
          <a href={`mailto:${identity.email}`} className={linkClass}>
            <span className={numClass}>03</span>
            Contact
          </a>
        </nav>
        <div
          className={css({
            display: { base: 'none', lg: 'flex' },
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginLeft: 'auto',
            lineHeight: 'snug',
          })}
        >
          <span className={css({ fontSize: 'xs', fontWeight: 'bold', letterSpacing: 'normal' })}>
            Aldie, VA
          </span>
          <span className={css({ fontSize: '2xs', color: 'textMuted' })}>Oct 8, 2026</span>
        </div>
      </div>
    </header>
  )
}
