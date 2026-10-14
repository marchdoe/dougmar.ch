import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { NavList } from './generated/NavList'

export function Sidebar() {
  return (
    <aside className={css({ alignSelf: 'start', minWidth: '0' })}>
      <a
        href="/"
        aria-label="Doug March, home"
        className={css({
          display: 'block',
          width: 'fit-content',
          color: 'text',
          paddingTop: { base: '22px', lg: '34px' },
          paddingBottom: { base: '10px', lg: '0' },
          paddingLeft: { base: '20px', lg: '22px' },
          paddingRight: { base: '20px', lg: '0' },
        })}
      >
        <BrandLockup variant="mark-only-md" mode="single-color" />
      </a>
      <nav
        data-rail-nav=""
        aria-label="Primary"
        className={css({
          display: 'block',
          paddingTop: { base: '0', lg: '28px' },
          paddingInline: { base: '20px', lg: '0' },
          paddingBottom: { base: '30px', lg: '0' },
          'body:has([data-home-nav]) &': { display: { base: 'none', lg: 'block' } },
        })}
      >
        <NavList />
      </nav>
    </aside>
  )
}
