import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'

const reveal = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})

type RevealSectionProps = { label: string; className?: string; children: ReactNode }

export function RevealSection({ label, className, children }: RevealSectionProps) {
  return (
    <section aria-label={label} className={cx(reveal, className)}>
      {children}
    </section>
  )
}
