import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { SignalRail } from './generated/SignalRail'
import { identity } from '../content/about'

const navLink = css({
  fontWeight: 'bold',
  fontSize: 'sm',
  color: 'textMuted',
  fontVariant: 'small-caps',
  textTransform: 'lowercase',
  letterSpacing: 'wide',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  minWidth: '44px',
  padding: '0 3',
})

export function Sidebar() {
  return (
    <aside
      className={css({
        bg: 'bg',
        borderBottom: { base: '1px solid', lg: 'none' },
        borderLeft: { lg: '1px solid' },
        borderColor: 'borderStrong',
        padding: { base: '4 5', lg: '0 6' },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: { base: 'row', lg: 'column' },
          alignItems: { base: 'center', lg: 'flex-start' },
          justifyContent: { base: 'space-between', lg: 'center' },
          gap: { base: '4', lg: '1' },
          flexWrap: 'wrap',
          minHeight: { lg: '96px' },
          borderBottom: { lg: '1px solid' },
          borderColor: 'borderStrong',
          paddingBottom: { base: '0', lg: '4' },
        })}
      >
        <BrandLockup variant="stacked-md" mode="original" roleLine />
        <nav
          aria-label="Primary"
          className={css({ display: { base: 'flex', lg: 'none' }, gap: '1 5', flexWrap: 'wrap' })}
        >
          <a href="/#work" className={navLink}>
            Work
          </a>
          <a href="/about" className={navLink}>
            About
          </a>
          <a href={`mailto:${identity.email}`} className={navLink}>
            Contact
          </a>
        </nav>
      </div>
      <SignalRail email={identity.email} />
    </aside>
  )
}
