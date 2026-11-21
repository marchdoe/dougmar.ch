import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'

type RevealProps = { children: ReactNode; className?: string; label?: string }

export function Reveal({ children, className, label }: RevealProps) {
  return (
    <section
      aria-label={label}
      className={cx(
        css({
          '@supports (animation-timeline: view())': {
            animationName: 'rise',
            animationTimeline: 'view()',
            animationRange: 'entry 0% entry 40%',
            animationFillMode: 'both',
          },
        }),
        className
      )}
    >
      {children}
    </section>
  )
}
