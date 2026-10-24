import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'clip',
      })}
    >
      <header
        className={css({
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: { base: '40px', lg: '48px' },
          paddingInline: '5vw',
        })}
      >
        <a
          href="/"
          aria-label="Doug March, home"
          className={css({ color: 'text', _hover: { textDecoration: 'none' } })}
        >
          <BrandLockup variant="stacked-lg" mode="original" />
        </a>
      </header>
      <main className={css({ flex: '1', minWidth: '0' })}>{children}</main>
      <Sidebar />
    </div>
  )
}
