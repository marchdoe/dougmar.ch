import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function Split({ children }: { children: ReactNode }) {
  return (
    <section
      className={css({
        display: { base: 'block', lg: 'grid' },
        gridTemplateColumns: { lg: '1.35fr 1fr' },
        minHeight: { lg: '100vh' },
      })}
    >
      {children}
    </section>
  )
}

export function EvidencePanel({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div
      id={id}
      className={css({
        minWidth: '0',
        bg: 'bg',
        color: 'text',
        paddingTop: '40px',
        paddingBottom: '6',
        paddingInline: { base: 'clamp(20px, 5vw, 56px)', lg: 'clamp(28px, 3vw, 56px)' },
      })}
    >
      {children}
    </div>
  )
}
