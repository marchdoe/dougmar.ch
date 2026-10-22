import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function SplitGrid({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'block',
        lg: {
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          alignItems: 'start',
        },
      })}
    >
      {children}
    </div>
  )
}

export function BonePanel({
  id,
  label,
  children,
}: {
  id?: string
  label: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={css({
        display: 'flex',
        flexDirection: 'column',
        bg: 'surface',
        color: 'text',
        paddingTop: { base: '40px', lg: 'clamp(56px, 8vh, 96px)' },
        paddingBottom: { base: '48px', lg: 'clamp(40px, 6vh, 72px)' },
        paddingInline: { base: '24px', lg: 'clamp(32px, 4vw, 72px)' },
        lg: {
          minHeight: '100vh',
          borderLeftWidth: '1px',
          borderLeftStyle: 'solid',
          borderColor: 'border',
        },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {children}
    </section>
  )
}

// Mockup ev-label is #764E1A (amber.700), which has no semantic token.
// textMuted is the nearest semantic ink that clears 4.5:1 on surface.
export function EvLabel({ children }: { children: ReactNode }) {
  return (
    <h2
      className={css({
        fontFamily: 'body',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 'wider',
        fontSize: 'xs',
        color: 'textMuted',
        marginBottom: '3',
      })}
    >
      {children}
    </h2>
  )
}
