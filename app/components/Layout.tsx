import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { FootStrip } from './generated/FootStrip'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr',
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        overflowX: 'clip',
        lg: { gridTemplateColumns: '96px 1fr', gridTemplateRows: '1fr auto' },
      })}
    >
      <Sidebar />
      <main className={css({ minWidth: '0', lg: { gridColumn: '2', gridRow: '1' } })}>
        {children}
      </main>
      <FootStrip />
    </div>
  )
}
