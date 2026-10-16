import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Colophon } from './generated/Colophon'
import { Sidebar } from './Sidebar'

// The measured overflow at 820px ("A new design ships every morning...") sits in the
// site rail that __root.tsx renders above this Layout. The rail is orchestrator-owned and
// sits outside this tree, so nothing here styles, moves or targets it. Layout keeps to its
// own shell: Sidebar, main and the colophon.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        fontSize: 'base',
        lineHeight: '1.5',
        minHeight: '100vh',
        minWidth: '0',
        '&:has([data-split]) > [data-shell-header]': { display: 'none' },
      })}
    >
      <Sidebar />
      <main className={css({ minWidth: '0' })}>{children}</main>
      <Colophon />
    </div>
  )
}
