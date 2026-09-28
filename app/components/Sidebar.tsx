import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const links = [
  { label: 'Work', href: '/work', idx: '01' },
  { label: 'About', href: '/about', idx: '02' },
]

const row = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '44px',
  paddingInline: '2px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'border',
  fontFamily: 'display',
  fontWeight: 'bold',
  textStyle: 'md',
  lineHeight: '1',
  letterSpacing: '0.01em',
  color: 'text',
  _last: { borderBottomWidth: '0' },
  _hover: { color: 'accent' },
})

const idx = css({
  fontFamily: 'body',
  fontSize: '2xs',
  letterSpacing: '0.12em',
  color: 'textFaint',
  fontWeight: 'normal',
})

export function Sidebar() {
  return (
    <div
      className={css({
        bg: 'surface',
        color: 'text',
        borderRadius: 'sm',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border',
        paddingBlock: '16px',
        paddingInline: { base: '8px', sm: '18px' },
        width: '100%',
        minWidth: '0',
        maxWidth: '420px',
        boxSizing: 'border-box',
      })}
    >
      <BrandLockup variant="horizontal-md" mode="original" roleLine />
      <nav
        aria-label="Primary"
        className={css({
          marginTop: '14px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} className={row}>
            {link.label} <span className={idx}>{link.idx}</span>
          </a>
        ))}
        <a href={`mailto:${identity.email}`} className={row}>
          Contact <span className={idx}>03</span>
        </a>
      </nav>
    </div>
  )
}
