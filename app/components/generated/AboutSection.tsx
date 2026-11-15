import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function AboutSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(40px, 6vw, 72px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        bg: 'bgAlt',
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
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'lg',
          color: 'text',
          marginBottom: '28px',
        })}
      >
        <span
          className={css({
            display: 'block',
            fontFamily: 'body',
            fontWeight: 'normal',
            fontSize: 'xs',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textFaint',
            marginBottom: '8px',
          })}
        >
          {eyebrow}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}
