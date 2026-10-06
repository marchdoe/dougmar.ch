import { css, cx } from '../../../styled-system/css'
import { identity } from '../../content/about'

const links = [
  { num: '01', label: 'Work', href: '/#work' },
  { num: '02', label: 'About', href: '/about' },
]

const navClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: '8px',
  columnGap: { base: '28px', lg: '40px' },
  marginTop: 'clamp(12px, 2vh, 22px)',
  paddingTop: '16px',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
})

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: '44px',
  minWidth: '44px',
  paddingBlock: '4px',
  color: 'text',
  textStyle: 'sm',
  fontWeight: 'normal',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  _hover: {
    color: 'accent',
    textDecoration: 'underline',
    textDecorationColor: 'accent',
    textUnderlineOffset: '4px',
  },
})

// accent on bg measured under 3:1, so the numerals take textFaint
const numClass = css({
  color: 'textFaint',
  fontWeight: 'bold',
  fontVariantNumeric: 'tabular-nums',
})

export function HeroNav({ className }: { className?: string }) {
  return (
    <nav aria-label="Primary" className={cx(navClass, className)}>
      {links.map((link) => (
        <a key={link.label} href={link.href} className={linkClass}>
          <span className={numClass}>{link.num}</span>
          {link.label}
        </a>
      ))}
      <a href={`mailto:${identity.email}`} className={linkClass}>
        <span className={numClass}>03</span>
        Contact
      </a>
    </nav>
  )
}
