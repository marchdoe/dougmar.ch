import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { BrandLockup } from '../BrandLockup'

const links = [
  { num: '01', label: 'work', href: '/work' },
  { num: '02', label: 'about', href: '/about' },
]

// accent (amber.600) fails 4.5:1 on the light ground, so light takes fieldBorder (amber.700)
const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  minHeight: '44px',
  minWidth: '44px',
  paddingBlock: '1',
  paddingInlineEnd: '1',
  fontSize: 'sm',
  fontWeight: 'semibold',
  textTransform: 'lowercase',
  color: { base: 'accent', _light: 'fieldBorder' },
})

const numClass = css({
  fontFamily: 'display',
  fontWeight: 'semibold',
  fontSize: 'sm',
  color: { base: 'accentAlt', _light: 'fieldBorder' },
})

export function HeroBrand() {
  return (
    <div
      className={css({
        gridArea: 'brand',
        position: 'relative',
        zIndex: 1,
        bg: 'bg',
        color: 'text',
        justifySelf: 'start',
        alignSelf: 'start',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '80ms',
      })}
    >
      <BrandLockup variant="horizontal-md" mode="original" roleLine />
      <nav
        aria-label="primary"
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '1',
          columnGap: '5',
          marginTop: '4',
        })}
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} className={linkClass}>
            <span className={numClass}>{link.num}</span>
            {link.label}
          </a>
        ))}
        <a href={`mailto:${identity.email}`} className={linkClass}>
          <span className={numClass}>03</span>
          contact
        </a>
      </nav>
    </div>
  )
}
