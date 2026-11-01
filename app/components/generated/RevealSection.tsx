import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'

type Props = { children: ReactNode; className?: string; id?: string; label?: string }

export function RevealSection({ children, className, id, label }: Props) {
  return (
    <section
      id={id}
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
