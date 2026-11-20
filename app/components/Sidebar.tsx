import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'

const linkClass = css({
  flex: '1 1 0',
  minWidth: '0',
  fontFamily: 'display',
  fontVariant: 'small-caps',
  textTransform: 'lowercase',
  letterSpacing: 'wide',
  fontSize: { base: '18px', lg: '19px' },
  lineHeight: 'snug',
  whiteSpace: 'nowrap',
  color: 'text',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '46px',
  paddingInline: { base: '4px', lg: '2px' },
  borderStyle: 'solid',
  borderColor: 'fieldBorder',
  borderTopWidth: '0',
  borderLeftWidth: '0',
  borderRightWidth: { base: '1px', lg: '0' },
  borderBottomWidth: { base: '0', lg: '1px' },
  _last: { borderRightWidth: '0' },
  _hover: { color: 'accent', textDecoration: 'none' },
})

export function Sidebar() {
  return (
    <header
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: { base: 'stretch', lg: 'center' },
        justifyContent: 'flex-start',
        gap: { base: '14px', lg: '24px' },
        paddingTop: { base: '16px', lg: '28px' },
        paddingBottom: { base: '16px', lg: '32px' },
        paddingInline: { base: '20px', lg: '10px' },
        bg: 'bg',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        borderTopWidth: '0',
        borderLeftWidth: '0',
        borderBottomWidth: { base: '1px', lg: '0' },
        borderRightWidth: { base: '0', lg: '1px' },
        height: { lg: '100%' },
        minWidth: '0',
      })}
    >
      {/* Header ground is bg (blue.700 dark, blue.50 light); the full-colour mark passes on both, so original in both schemes. */}
      <BrandLockup
        variant="stacked-md"
        mode="original"
        roleLine
        className={css({
          alignSelf: { base: 'flex-start', lg: 'center' },
          alignItems: { base: 'flex-start', lg: 'center' },
          textAlign: { base: 'left', lg: 'center' },
          whiteSpace: { lg: 'normal' },
          maxWidth: '100%',
          minWidth: '0',
          color: 'text',
        })}
      />
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexDirection: { base: 'row', lg: 'column' },
          alignItems: 'stretch',
          flexWrap: 'nowrap',
          width: '100%',
          borderStyle: 'solid',
          borderColor: 'fieldBorder',
          borderLeftWidth: '0',
          borderRightWidth: '0',
          borderTopWidth: '1px',
          borderBottomWidth: { base: '1px', lg: '0' },
        })}
      >
        <a href="/work" className={linkClass}>
          Work
        </a>
        <a href="/about" className={linkClass}>
          About
        </a>
        <a href={`mailto:${identity.email}`} className={linkClass}>
          Contact
        </a>
      </nav>
    </header>
  )
}
