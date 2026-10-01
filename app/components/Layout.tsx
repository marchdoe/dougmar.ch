import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { MobileNav } from './generated/MobileNav'
import { DataStrip } from './generated/DataStrip'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        lineHeight: 'normal',
        minHeight: '100vh',
      })}
    >
      <div
        className={css({
          display: 'block',
          // The mockup's rail is 88px; the stacked lockup's wordmark measures about 178px,
          // so the rail is 208px to hold the whole lockup inside the viewport.
          lg: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 208px' },
        })}
      >
        <main className={css({ minWidth: '0' })}>
          {children}
          <MobileNav />
        </main>
        <Sidebar />
      </div>
      <DataStrip />
    </div>
  )
}
