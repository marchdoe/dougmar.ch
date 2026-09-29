import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function AboutSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section
      className={css({
        paddingInline: '6vw',
        paddingBlock: '6',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ maxWidth: '880px', marginInline: 'auto' })}>
        <h2
          className={css({
            fontSize: 'xs',
            letterSpacing: 'wide',
            color: 'textMuted',
            textTransform: 'lowercase',
            marginBottom: '4',
          })}
        >
          {label}
        </h2>
        {children}
      </div>
    </section>
  )
}
