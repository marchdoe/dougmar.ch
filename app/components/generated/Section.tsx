import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`${css({
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })} ${className}`}
    >
      {children}
    </div>
  )
}
