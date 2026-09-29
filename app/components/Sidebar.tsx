import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'

export function Sidebar() {
  return (
    <header
      className={css({
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        paddingInline: '6vw',
        position: 'relative',
        zIndex: 5,
        bg: 'bg',
      })}
    >
      <a
        href="/"
        aria-label="Doug March, home"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          minWidth: '44px',
          _hover: { textDecoration: 'none' },
        })}
      >
        <BrandLockup variant="mark-only-md" mode="original" />
      </a>
    </header>
  )
}
