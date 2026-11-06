import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  minHeight: { base: '44px', lg: '26px' },
  paddingInline: '2',
  fontFamily: 'body',
  fontWeight: 'normal',
  textStyle: 'sm',
  letterSpacing: 'normal',
  color: 'textMuted',
  _hover: { color: 'text' },
})

const numClass = css({
  textStyle: '2xs',
  letterSpacing: 'wider',
  color: 'accent',
  fontVariantNumeric: 'tabular-nums',
})

export function Sidebar() {
  const links = [
    { n: '01', label: 'Work', href: '/#work' },
    { n: '02', label: 'About', href: '/about' },
    { n: '03', label: 'Contact', href: `mailto:${identity.email}` },
  ]
  return (
    <header
      className={css({
        position: 'relative',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: { base: '1', lg: '0' },
        paddingBlock: { base: '2', lg: '1' },
        paddingInline: { base: '4', md: '6', lg: '7', xl: '8' },
        color: 'text',
      })}
    >
      <a
        href="/"
        aria-label={identity.name}
        className={css({ color: 'text', _hover: { color: 'text' } })}
      >
        <BrandLockup variant="stacked-md" mode="original" />
      </a>
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: '4',
          rowGap: '0',
        })}
      >
        {links.map((l) => (
          <a key={l.n} href={l.href} className={linkClass}>
            <span className={numClass}>{l.n}</span>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
