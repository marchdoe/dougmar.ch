import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        minHeight: '100svh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        overflowX: 'hidden',
      })}
    >
      <header
        className={css({
          bg: 'bg',
          paddingTop: 'clamp(1.25rem, 4vw, 2.5rem)',
          paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
          display: 'flex',
          alignItems: 'flex-start',
        })}
      >
        <a
          href="/"
          aria-label="Doug March, home"
          className={css({ display: 'inline-flex', minHeight: '44px', minWidth: '44px' })}
        >
          <BrandLockup variant="mark-only-md" mode="original" />
        </a>
      </header>
      <div>{children}</div>
      <Sidebar />
    </div>
  )
}
