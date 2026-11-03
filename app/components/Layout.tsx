import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Colophon } from './generated/Colophon'
import { Reveal } from './generated/Reveal'
import { Sidebar } from './Sidebar'

// BLOCKED, NOT FIXED: the 820px error on /, /about and /work/* is still open and this patch does
// not change it. The gate reports 230px of text in a 131px box, at
// div.d_flex.ai_stretch.gap_4px.bx-s_border-box > span.d_block.as_center.flex_0_1_auto.min-w_0.
// Neither the reported text nor that class combination appears in any file this agent owns. The
// affected routes match the routes that carry the top rail, so the likely source is the rail
// markup in __root.tsx. That file could not be read here, so this remains an inference.
// __root.tsx cannot be written from this patch, and the rail cannot be styled from here, so no
// override has been added. Orchestrator action needed: in the rail template, let the span wrap at
// 820 or drop the line at that width. Until then, expect the surface gate to keep reporting this.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: { base: 'block', lg: 'grid' },
        gridTemplateColumns: { lg: '96px minmax(0, 1fr)' },
        alignItems: { lg: 'stretch' },
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        // Secondary ink on the dark field reads 3.49:1, including on hand-written routes.
        // Inside the shell it resolves to the primary field ink in the dark scheme.
        _dark: { '--colors-field-ink-muted': 'var(--colors-field-ink)' },
      })}
    >
      <Sidebar />
      <main className={css({ minWidth: '0' })}>
        {children}
        <Reveal>
          <Colophon />
        </Reveal>
      </main>
    </div>
  )
}
