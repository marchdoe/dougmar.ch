import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { BrandLockup } from '../BrandLockup'

const conn = css({ display: { base: 'none', md: 'inline' } })

const navLink = css({
  fontWeight: 'bold',
  color: 'text',
  borderBottom: '2px solid',
  borderBottomColor: 'accent',
  display: { base: 'inline-flex', md: 'inline' },
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: { base: '44px', md: '0' },
  minWidth: { base: '48px', md: '0' },
  paddingInline: { base: '4px', md: '0' },
  _hover: { color: 'accent' },
})

// The mockup sets the corner sentence at 14px; that literal is kept here so the
// nav reads at the mockup's size rather than the chassis `sm` step.
export function CornerHeader() {
  return (
    <header
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', lg: 'row' },
        alignItems: { base: 'flex-start', lg: 'flex-start' },
        justifyContent: { lg: 'space-between' },
        gap: { base: '14px', lg: '5' },
        marginBottom: { base: '5', lg: '6' },
      })}
    >
      <a href="/" className={css({ display: 'inline-flex', color: 'text' })}>
        <BrandLockup variant="stacked-lg" mode="original" />
      </a>
      <nav
        aria-label="Primary"
        className={css({
          fontFamily: 'body',
          fontSize: '14px',
          color: 'textMuted',
          lineHeight: '1.6',
          display: { base: 'flex', md: 'block' },
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: '14px',
          rowGap: '4px',
          maxWidth: { lg: '30ch' },
          marginTop: { lg: '6px' },
        })}
      >
        <span className={conn}>{'Doug builds things. Start with the '}</span>
        <a href="/work" className={navLink}>
          Work
        </a>
        <span className={conn}>{', meet him in '}</span>
        <a href="/about" className={navLink}>
          About
        </a>
        <span className={conn}>{', or say '}</span>
        <a href={`mailto:${identity.email}`} className={navLink}>
          Hello
        </a>
        <span className={conn}>.</span>
      </nav>
    </header>
  )
}
