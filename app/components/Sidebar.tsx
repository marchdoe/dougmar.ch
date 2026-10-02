import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'

export function Sidebar() {
  return (
    <header
      className={css({
        position: 'relative',
        zIndex: 3,
        height: { base: '96px', md: '120px' },
        paddingTop: 'clamp(20px, 5vw, 40px)',
        paddingLeft: { base: 'clamp(18px, 4vw, 56px)', lg: 'clamp(32px, 3.5vw, 60px)' },
        paddingRight: { base: 'clamp(18px, 4vw, 56px)', lg: 'clamp(16px, 1.5vw, 28px)' },
        pointerEvents: 'none',
      })}
    >
      <div
        className={css({
          display: 'inline-flex',
          alignItems: 'flex-start',
          color: 'text',
          pointerEvents: 'auto',
        })}
      >
        <BrandLockup variant="horizontal-md" mode="single-color" roleLine />
      </div>
    </header>
  )
}
