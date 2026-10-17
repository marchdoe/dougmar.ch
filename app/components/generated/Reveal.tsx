import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function Reveal({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section
      aria-label={label}
      className={css({
        display: 'block',
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
