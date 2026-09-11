import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { identity } from '../content/about'

const navLinkClass = css({
  padding: '3 0',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  _hover: { color: 'accentAlt' },
})

const dotClass = css({ color: 'accent', padding: '0 3', fontWeight: 'bold' })

export function Sidebar() {
  return (
    <Box
      as="header"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingTop: { base: '6', md: '8' },
      })}
    >
      <Box className={css({ color: 'text' })}>
        <BrandLockup variant="stacked-lg" mode="original" />
      </Box>
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0',
          marginTop: { base: '5', md: '6' },
          fontFamily: 'display',
          textStyle: 'sm',
          fontVariantCaps: 'small-caps',
          textTransform: 'lowercase',
          letterSpacing: 'wide',
          color: 'textMuted',
        })}
      >
        <a href="/#work" className={navLinkClass}>
          <span>work</span>
        </a>
        <span className={dotClass}>·</span>
        <a href="/about" className={navLinkClass}>
          <span>about</span>
        </a>
        <span className={dotClass}>·</span>
        <a href={`mailto:${identity.email}`} className={navLinkClass}>
          <span>contact</span>
        </a>
      </nav>
      <hr
        className={css({
          height: 0,
          border: 0,
          borderTop: '2px solid',
          borderColor: 'borderStrong',
          marginTop: { base: '5', md: '6' },
        })}
      />
    </Box>
  )
}
