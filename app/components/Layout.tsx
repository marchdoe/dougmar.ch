import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

// Known unresolved fault, not fixable from this file: at 820px the line
// "A new design ships every morning." is cut off. It sits in a flex row
// (d_flex, ai_stretch, gap_4px) inside the site rail ([data-live-frame]).
// It appears on every route, including routes where SiteCallout does not
// render. __root.tsx renders the rail above this Layout, as a sibling and
// not as one of its children, so nothing set here reaches the rail by
// inheritance. The rail is orchestrator-owned, and the shell rules forbid
// styling, sizing or targeting it. The fix has to go in the rail's own
// template.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        overflowX: 'clip',
      })}
    >
      <main className={css({ flex: '1', minWidth: '0' })}>{children}</main>
      <Sidebar />
    </div>
  )
}
