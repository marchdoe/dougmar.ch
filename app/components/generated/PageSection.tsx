import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

type Props = { title: string; children: ReactNode }

export function PageSection({ title, children }: Props) {
  return (
    <section
      className={css({
        paddingBlock: '7',
        paddingInline: { base: '24px', sm: '6vw' },
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          textStyle: '2xl',
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'lowercase',
          color: 'text',
          marginBottom: '5',
        })}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
