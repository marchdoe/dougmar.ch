import { css } from '../../../styled-system/css'
import { NavList } from './NavList'

export function NavRow() {
  return (
    <nav
      data-home-nav=""
      aria-label="Site"
      className={css({
        display: { base: 'block', lg: 'none' },
        paddingInline: '20px',
        paddingBottom: '30px',
        bg: 'bg',
      })}
    >
      <NavList />
    </nav>
  )
}
