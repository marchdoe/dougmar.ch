import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function CaseHero({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'repeat(12, 1fr)' },
        columnGap: '6',
        rowGap: '5',
        alignItems: 'end',
        paddingInline: { base: '7vw', md: '6vw' },
        paddingTop: { base: '6', md: '7' },
        paddingBottom: '6',
      })}
    >
      <h1
        className={css({
          gridColumn: { lg: '1 / 9' },
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(38px, 7vw, 96px)',
          lineHeight: '0.98',
          letterSpacing: '-0.01em',
          color: 'text',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {title}
      </h1>
      <div
        className={css({
          gridColumn: { lg: '9 / 13' },
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {children}
      </div>
    </section>
  )
}
