import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function Reveal({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {children}
    </div>
  )
}
