import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'

export function RevealSection({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section
      id={id}
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
