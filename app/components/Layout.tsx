import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        position: 'relative',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        minHeight: '100vh',
      })}
    >
      <div
        className={css({
          position: 'absolute',
          top: { base: '24px', lg: '40px' },
          left: { base: '20px', lg: '5vw' },
          zIndex: 6,
        })}
      >
        <a href="/" aria-label="Doug March, home" className={css({ display: 'block' })}>
          <BrandLockup variant="mark-only-md" mode="original" />
        </a>
      </div>
      <main className={css({ position: 'relative' })}>{children}</main>
      <Sidebar />
    </div>
  )
}
