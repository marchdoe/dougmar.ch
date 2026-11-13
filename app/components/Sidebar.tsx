import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const LINKS = [
  { num: '01', text: 'work', href: '/#work' },
  { num: '02', text: 'about', href: '/about' },
  { num: '03', text: 'contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <header
      className={css({
        bg: 'bg',
        minHeight: '96px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        rowGap: '16px',
        columnGap: '24px',
        paddingBlock: '20px',
        paddingInline: 'clamp(16px, 5vw, 64px)',
      })}
    >
      <a
        href="/"
        aria-label={`${identity.name}, home`}
        className={css({ color: 'text', _hover: { textDecoration: 'none' } })}
      >
        {/* nav_360 drops the role line; it returns from sm up. */}
        <span className={css({ display: { base: 'block', sm: 'none' } })}>
          <BrandLockup variant="horizontal-md" mode="original" />
        </span>
        <span className={css({ display: { base: 'none', sm: 'block' } })}>
          <BrandLockup variant="horizontal-md" mode="original" roleLine />
        </span>
      </a>
      <nav className={css({ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' })}>
        {LINKS.map((l) => (
          <a
            key={l.num}
            href={l.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              minHeight: '44px',
              minWidth: '44px',
              paddingBlock: '10px',
              paddingInline: '12px',
              fontSize: 'sm',
              color: 'textMuted',
              textTransform: 'lowercase',
              letterSpacing: '0.01em',
              _hover: { color: 'accent', textDecoration: 'none' },
            })}
          >
            <span className={css({ fontFamily: 'display', fontSize: '13px', color: 'accent' })}>
              {l.num}
            </span>
            {l.text}
          </a>
        ))}
      </nav>
    </header>
  )
}
