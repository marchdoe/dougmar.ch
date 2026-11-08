import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { ScorecardFooter } from './generated/ScorecardFooter'

// --tab is the room the corner tab takes. main reserves it for every route,
// and the day's own heroes pull back up underneath the tab with a negative margin.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        '--pad': 'clamp(28px,5vw,88px)',
        '--tab': '84px',
        position: 'relative',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        minHeight: '100vh',
      })}
    >
      <Sidebar />
      <main className={css({ paddingTop: 'var(--tab)' })}>{children}</main>
      <ScorecardFooter />
    </div>
  )
}
