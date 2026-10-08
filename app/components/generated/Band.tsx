import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function Band({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section
      aria-label={label}
      className={css({
        paddingBlock: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
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

export function SecHead({ title, std }: { title: string; std?: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'baseline',
        gap: '4',
        flexWrap: 'wrap',
        marginBottom: 'clamp(28px, 4vw, 48px)',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: 'lg', lg: 'xl' },
          letterSpacing: 'tight',
        })}
      >
        {title}
      </h2>
      {std ? (
        <p className={css({ fontSize: 'sm', color: 'textMuted', maxWidth: '52ch' })}>{std}</p>
      ) : null}
    </div>
  )
}
