import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { FooterStrip } from './generated/FooterStrip'

// The 820px overflow flagged on every route is inside the top rail, which
// __root.tsx renders above Layout and owns. Layout and Sidebar neither render
// nor style that element, by rule, so nothing here reaches it.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '96px 1fr' },
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
      })}
    >
      <Sidebar />
      <div className={css({ minWidth: '0', display: 'flex', flexDirection: 'column' })}>
        <main
          className={css({
            flex: '1',
            minWidth: '0',
            paddingLeft: { base: '20px', lg: 'clamp(32px, 4vw, 64px)' },
            paddingRight: { base: '20px', lg: 'clamp(40px, 6vw, 112px)' },
          })}
        >
          {children}
        </main>
        <FooterStrip />
      </div>
    </div>
  )
}
