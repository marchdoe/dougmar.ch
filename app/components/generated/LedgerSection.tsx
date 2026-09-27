import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { SectionHead } from './SectionHead'

export function LedgerSection({
  label,
  aside,
  children,
}: {
  label: string
  aside: string
  children: ReactNode
}) {
  return (
    <section
      className={css({
        paddingBlock: { base: '5', lg: '7' },
        paddingInline: { base: '3', lg: '6vw' },
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead label={label} aside={aside} />
      <div className={css({ marginTop: '3' })}>{children}</div>
    </section>
  )
}
