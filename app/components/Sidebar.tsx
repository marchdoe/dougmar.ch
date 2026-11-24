import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { MobileMenu } from './generated/MobileMenu'
import { NavIndex } from './generated/NavIndex'

export function Sidebar() {
  return (
    <header
      className={css({
        bg: 'bg',
        display: 'flex',
        flexDirection: { base: 'row', lg: 'column' },
        justifyContent: { base: 'space-between', lg: 'flex-start' },
        alignItems: { base: 'center', lg: 'stretch' },
        gap: { base: '4', lg: '0' },
        paddingBlock: { base: '16px', lg: '6px' },
        paddingInline: 'clamp(24px, 5vw, 88px)',
        minHeight: { lg: '120px' },
      })}
    >
      {/* Mark stays single-color on the gold header ground: the full-colour mark fails 3:1 on bg. */}
      <div className={css({ color: 'text', display: 'flex', alignItems: 'flex-start' })}>
        <BrandLockup variant="stacked-md" mode="single-color" />
      </div>
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          alignItems: 'center',
          marginTop: { lg: 'auto' },
          height: { lg: '42px' },
          borderTopStyle: 'solid',
          borderTopWidth: { base: '0', lg: '1px' },
          borderTopColor: 'borderStrong',
        })}
      >
        <MobileMenu />
        <NavIndex />
      </nav>
    </header>
  )
}
