import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'

export function Sidebar() {
  return (
    <div
      className={css({
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(24px, 5vw, 44px)',
        paddingBottom: '6px',
        lg: { paddingTop: 'clamp(40px, 4vw, 56px)' },
      })}
    >
      <a href="/" aria-label="Doug March, home" className={css({ display: 'inline-flex' })}>
        <BrandLockup variant="mark-only-md" mode="original" />
      </a>
    </div>
  )
}
