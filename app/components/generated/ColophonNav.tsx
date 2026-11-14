import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const links = [
  { num: '01', label: 'work', href: '/work' },
  { num: '02', label: 'about', href: '/about' },
  { num: '03', label: 'contact', href: `mailto:${identity.email}` },
]

const navCls = css({
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: '4',
  columnGap: '6',
  alignItems: 'baseline',
  paddingBottom: { base: '5', lg: '6' },
  marginBottom: { base: '5', lg: '6' },
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
})

const linkCls = css({
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: '2',
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'lowercase',
  textStyle: 'xl',
  letterSpacing: 'tight',
  color: 'fieldInk',
  minHeight: '44px',
  lineHeight: '44px',
  _hover: { color: 'fieldInk', textDecoration: 'underline', textUnderlineOffset: '5px' },
})

const numCls = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'xs',
  letterSpacing: 'wider',
  color: 'fieldInkMuted',
})

export function ColophonNav() {
  return (
    <nav aria-label="Primary" className={navCls}>
      {links.map((l) => (
        <a key={l.num} href={l.href} className={linkCls}>
          <span className={numCls}>{l.num}</span>
          {l.label}
        </a>
      ))}
    </nav>
  )
}
