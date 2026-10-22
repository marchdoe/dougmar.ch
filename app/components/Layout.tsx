import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { SignalFooter } from './generated/SignalFooter'

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
        // The viewport scrollbar takes width from the top row at mid widths, and the
        // day's body face sets wide at the root size. Between md and lg the root steps
        // down a touch so the row above the shell keeps its full line of type.
        // Panda resolves `&` anywhere in a nested selector; its types only accept it at either end.
        // @ts-expect-error nested selector with `&` inside :has()
        'html:has(&)': {
          scrollbarWidth: { base: 'none', xl: 'auto' },
          fontSize: { mdOnly: '93.75%' },
          letterSpacing: { mdOnly: '-0.01em' },
        },
        lg: {
          display: 'grid',
          gridTemplateColumns: '88px minmax(0, 1fr)',
          gridTemplateRows: '1fr auto',
        },
      })}
    >
      <Sidebar />
      <main
        className={css({
          flexGrow: 1,
          minWidth: 0,
          lg: { gridColumn: '2', gridRow: '1' },
        })}
      >
        {children}
      </main>
      <SignalFooter />
    </div>
  )
}
