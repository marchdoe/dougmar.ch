import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { Ledger } from './generated/Ledger'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      {/* Shell band for hand-written routes; routes that fold the title block into their hero hide it */}
      <header
        className={css({
          bg: 'field',
          paddingBlock: '4',
          paddingInline: { base: '12px', sm: 'clamp(20px, 5vw, 72px)' },
          'body:has([data-folded-shell]) &': { display: 'none' },
        })}
      >
        <Sidebar />
      </header>
      <main className={css({ flex: '1', minWidth: '0' })}>{children}</main>
      <Ledger />
    </div>
  )
}
