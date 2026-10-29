import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const links = [
  { n: '01', label: 'Work', href: '/work' },
  { n: '02', label: 'About', href: '/about' },
]

const navLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  gap: '7px',
  fontSize: 'sm',
  fontWeight: 'normal',
  textTransform: 'none',
  color: 'accent',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'transparent',
  _hover: { color: 'accentAlt', borderBottomColor: 'accentAlt' },
})

const navNum = css({
  fontFamily: 'display',
  fontSize: 'xs',
  color: 'textFaint',
})

export function Sidebar() {
  return (
    <header
      className={css({
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px',
        bg: 'bg',
        paddingTop: { base: '28px', md: '40px' },
        paddingInline: { base: '7vw', md: '6vw' },
      })}
    >
      <a href="/" className={css({ color: 'text', _hover: { color: 'text' } })}>
        <BrandLockup variant="stacked-md" mode="original" />
      </a>
      <nav
        aria-label="Primary"
        className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '4px', columnGap: '20px' })}
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} className={navLink}>
            <span className={navNum}>{link.n}</span>
            {link.label}
          </a>
        ))}
        <a href={`mailto:${identity.email}`} className={navLink}>
          <span className={navNum}>03</span>
          Contact
        </a>
      </nav>
    </header>
  )
}
