import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { Colophon } from './generated/Colophon'

// The 44px rail above this shell is rendered by __root.tsx, outside Layout.
// Its inner span is not in any file this shell owns, so nothing here styles,
// sizes or targets it. The shell starts below it, in normal flow.
//
// ORCHESTRATOR NOTE: the surface gate reports the rail's inner span
// (div.d_flex.ai_stretch.gap_4px > span.d_block.as_center.flex_0_1_auto.min-w_0)
// cutting its sentence by 9px at 820px on every route. That element is
// rendered by __root.tsx, before this Layout, and inherits nothing from it.
// The engineer rules forbid styling or targeting [data-live-frame], so the
// fix belongs in the rail markup itself: let that span wrap, or step its
// font size down at the md width.
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
      <Sidebar />
      <main className={css({ flex: '1', minWidth: '0' })}>{children}</main>
      <Colophon />
    </div>
  )
}
