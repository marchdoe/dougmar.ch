import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

// The clipped "A new design ships every morning" line reported at 820px is in the
// rail that __root.tsx renders above this Layout. That file is orchestrator-owned,
// and the rules forbid styling, moving or hiding the rail from here. Nothing in this
// shell sits beside the rail or narrows it, so the fix belongs in __root.tsx.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        lineHeight: '1.5',
        minHeight: '100vh',
        overflowX: 'clip',
      })}
    >
      <Sidebar />
      <main>{children}</main>
      <footer
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          paddingBlock: 'clamp(28px, 4vw, 40px)',
          paddingInline: 'clamp(24px, 6vw, 112px)',
        })}
      >
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: '12px',
            columnGap: '28px',
            alignItems: 'baseline',
            fontSize: '13px',
            color: 'textFaint',
          })}
        >
          <span className={css({ color: 'textMuted' })}>Aldie, VA</span>
          <span className={css({ color: 'textMuted' })}>23 Oct 2026</span>
          <span className={css({ display: 'flex', gap: '8px', alignItems: 'baseline' })}>
            <span className={css({ color: 'textMuted' })}>SPY</span>
            <span className={css({ fontVariantNumeric: 'tabular-nums' })}>763.96</span>
            <span className={css({ color: 'accentAlt', fontVariantNumeric: 'tabular-nums' })}>
              ▼1.18%
            </span>
          </span>
          <span>
            <span className={css({ color: 'textMuted' })}>in rotation:</span> Radiohead, My Morning
            Jacket, Tobin Sprout
          </span>
          <span>© Doug March</span>
        </div>
      </footer>
    </div>
  )
}
