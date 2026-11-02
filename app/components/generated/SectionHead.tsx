import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export const revealSection = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})

export function SectionHead({ children }: { children: ReactNode }) {
  return (
    <h2
      className={css({
        fontFamily: 'display',
        fontWeight: 'bold',
        textStyle: 'xs',
        textTransform: 'uppercase',
        letterSpacing: 'widest',
        color: 'text',
        paddingBottom: '12px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      {children}
    </h2>
  )
}
