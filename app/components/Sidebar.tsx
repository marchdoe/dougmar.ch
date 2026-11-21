import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const navItems = [
  { num: '01', label: 'Work', href: '/work' },
  { num: '02', label: 'About', href: '/about' },
  { num: '03', label: 'Contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'bgAlt',
        color: 'text',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: { base: '40px', lg: '56px' },
        paddingInline: '6vw',
        paddingBottom: { base: '48px', lg: '64px' },
        display: 'flex',
        flexDirection: { base: 'column', lg: 'row' },
        justifyContent: { lg: 'space-between' },
        alignItems: { lg: 'flex-start' },
        gap: { base: '28px', lg: '6vw' },
      })}
    >
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          flex: { lg: '1 1 52%' },
        })}
      >
        {navItems.map((item) => (
          <a
            key={item.num}
            href={item.href}
            className={css({
              display: 'flex',
              alignItems: 'baseline',
              gap: '14px',
              paddingBlock: '12px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              color: 'text',
              minHeight: '44px',
              fontFamily: 'display',
              fontSize: '34px',
              letterSpacing: '.03em',
              fontVariant: 'small-caps',
              _hover: { color: 'accentAlt' },
            })}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontSize: 'xs',
                fontWeight: 'bold',
                letterSpacing: '.1em',
                color: 'accent',
                transform: 'translateY(-4px)',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {item.num}
            </span>
            {item.label}
          </a>
        ))}
      </nav>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          paddingTop: '8px',
          flex: { lg: '1 1 38%' },
          alignItems: { base: 'flex-start', lg: 'flex-end' },
          textAlign: { lg: 'right' },
        })}
      >
        <div className={css({ color: 'text' })}>
          <BrandLockup variant="horizontal-md" mode="original" />
        </div>
        <p className={css({ textStyle: 'sm', color: 'textMuted', letterSpacing: '.02em' })}>
          {identity.role}
        </p>
        <p className={css({ textStyle: 'sm', color: 'textMuted', letterSpacing: '.02em' })}>
          On rotation:{' '}
          <strong className={css({ color: 'text', fontWeight: 'bold' })}>The War on Drugs</strong>,{' '}
          <strong className={css({ color: 'text', fontWeight: 'bold' })}>My Morning Jacket</strong>
        </p>
        <p
          className={css({
            textStyle: 'sm',
            color: 'textMuted',
            letterSpacing: '.04em',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          © 2026 {identity.name} · Aldie, VA
        </p>
      </div>
    </footer>
  )
}
