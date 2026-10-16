import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'

export function SplitHero({ children }: { children: ReactNode }) {
  return (
    <section
      data-split=""
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
        minHeight: { lg: '100vh' },
      })}
    >
      {children}
    </section>
  )
}

export function CreamPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        css({
          bg: 'bg',
          color: 'text',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minWidth: '0',
          minHeight: { lg: '100vh' },
          paddingTop: { base: '40px', md: '56px', xl: '72px' },
          paddingBottom: { base: '56px', md: '72px', xl: '80px' },
          paddingInline: { base: '4', md: '6vw', xl: '4vw' },
        }),
        className
      )}
    >
      {children}
    </div>
  )
}

export function FieldPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        bg: 'field',
        color: 'fieldInk',
        position: 'relative',
        overflow: 'hidden',
        minWidth: '0',
        minHeight: { lg: '100vh' },
        paddingTop: { base: '48px', md: '64px', xl: '72px' },
        paddingBottom: { base: '56px', md: '72px', xl: '80px' },
        paddingInline: { base: '4', md: '6vw', xl: '4vw' },
      })}
    >
      {children}
    </div>
  )
}
