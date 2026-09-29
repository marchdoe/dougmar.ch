import { css } from '../../../styled-system/css'

export function CaseBand({ problem, description }: { problem?: string; description?: string }) {
  const lead = problem ?? description
  if (!lead) return null
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: '8',
        paddingInline: '6vw',
        textAlign: 'center',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {/* fieldInkMuted on field is under 4.5:1 in the dark scheme; fieldInk clears it */}
      <h2
        className={css({
          fontSize: 'xs',
          letterSpacing: 'wide',
          color: 'fieldInk',
          marginBottom: '4',
        })}
      >
        the problem
      </h2>
      <p
        className={css({
          fontSize: 'lede',
          lineHeight: 'normal',
          maxWidth: '48ch',
          marginInline: 'auto',
          color: 'fieldInk',
        })}
      >
        {lead}
      </p>
    </section>
  )
}
