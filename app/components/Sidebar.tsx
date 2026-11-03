import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const links = [
  { num: '01', label: 'Work', href: '/work' },
  { num: '02', label: 'About', href: '/about' },
  { num: '03', label: 'Contact', href: `mailto:${identity.email}` },
]

const railClass = css({
  bg: 'bg',
  display: 'flex',
  flexDirection: { base: 'column', md: 'row', lg: 'column' },
  alignItems: { md: 'center', lg: 'stretch' },
  justifyContent: { lg: 'flex-start' },
  gap: { base: '12px', md: '28px', lg: '0' },
  paddingTop: { base: '18px', md: '20px', lg: '28px' },
  paddingBottom: { base: '12px', md: '20px', lg: '28px' },
  paddingInline: { base: '20px', md: '40px', lg: '0' },
  borderBottomWidth: { base: '1px', lg: '0' },
  borderRightWidth: { base: '0', lg: '1px' },
  borderStyle: 'solid',
  borderColor: 'borderStrong',
  position: { lg: 'sticky' },
  top: { lg: '0' },
  height: { lg: '100vh' },
})

const markClass = css({
  display: 'block',
  paddingLeft: { lg: '22px' },
  marginBottom: { lg: '30px' },
})

const navClass = css({
  display: 'grid',
  gridTemplateColumns: {
    base: 'repeat(3, minmax(0, 1fr))',
    md: 'repeat(3, auto)',
    lg: 'minmax(0, 1fr)',
  },
  marginLeft: { md: 'auto', lg: '0' },
})

const linkClass = css({
  display: 'flex',
  flexDirection: { base: 'row', lg: 'column' },
  alignItems: { base: 'baseline', lg: 'flex-start' },
  gap: { base: '7px', lg: '4px' },
  minHeight: { base: '44px', lg: '64px' },
  paddingTop: { base: '8px', lg: '16px' },
  paddingBottom: { base: '8px', lg: '14px' },
  paddingLeft: { base: '0', lg: '22px' },
  paddingRight: { base: '0', md: '20px', lg: '10px' },
  color: 'text',
  lineHeight: '1',
  whiteSpace: 'nowrap',
  borderTopWidth: { base: '0', lg: '1px' },
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  _last: {
    borderBottomWidth: { base: '0', lg: '1px' },
    borderBottomStyle: 'solid',
    borderBottomColor: 'border',
  },
  _hover: { color: 'accent', textDecoration: 'none' },
})

const numClass = css({
  fontWeight: 'bold',
  color: 'accentAlt',
  fontSize: '13px',
  letterSpacing: '0.04em',
  fontVariantNumeric: 'tabular-nums',
})

const labelClass = css({
  fontSize: { base: '15px', lg: '13px' },
  fontWeight: '600',
  textTransform: 'lowercase',
  fontVariant: 'small-caps',
  letterSpacing: '0.07em',
})

export function Sidebar() {
  return (
    <header className={railClass}>
      <a className={markClass} href="/" aria-label="Doug March, home">
        <BrandLockup variant="mark-only-md" mode="original" />
      </a>
      <nav className={navClass} aria-label="Primary">
        {links.map((link) => (
          <a key={link.num} className={linkClass} href={link.href}>
            <span className={numClass}>{link.num}</span>
            <span className={labelClass}>{link.label}</span>
          </a>
        ))}
      </nav>
    </header>
  )
}
