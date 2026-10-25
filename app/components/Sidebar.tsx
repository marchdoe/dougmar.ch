import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'

export function Sidebar() {
  return (
    <header
      className={css({
        minHeight: '72px',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '14px',
        paddingLeft: 'clamp(22px, 6vw, 112px)',
        paddingRight: 'clamp(22px, 6vw, 112px)',
        position: 'relative',
        zIndex: 5,
        bg: 'bg',
        color: 'text',
      })}
    >
      <a
        href="/"
        aria-label="Doug March, home"
        className={css({ color: 'text', display: 'inline-flex', _hover: { color: 'text' } })}
      >
        <BrandLockup variant="stacked-md" mode="original" />
      </a>
    </header>
  )
}
