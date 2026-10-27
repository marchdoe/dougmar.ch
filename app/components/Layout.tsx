import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { LedgerFooter } from './generated/LedgerFooter'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        lg: {
          display: 'grid',
          gridTemplateColumns: '184px minmax(0, 1fr)',
          alignItems: 'stretch',
        },
      })}
    >
      <Sidebar />
      <div className={css({ display: 'flex', flexDirection: 'column', minWidth: '0', flex: '1' })}>
        <main
          className={css({ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '0' })}
        >
          {children}
        </main>
        <LedgerFooter />
      </div>
    </div>
  )
}
