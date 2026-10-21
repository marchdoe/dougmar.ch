import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

export function ProblemPlane({ statement }: { statement?: string }) {
  if (!statement) return null
  return (
    <section
      aria-label="The problem"
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(32px, 5vw, 72px)',
        paddingInline: '5vw',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <Ground material="halftone" seed={692425309} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <div
          className={css({
            fontSize: '13px',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            marginBottom: 'clamp(10px, 2vw, 24px)',
          })}
        >
          The problem
        </div>
        <p
          className={css({
            fontFamily: 'body',
            textStyle: 'lede',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textAlign: 'left',
            maxWidth: '46ch',
            color: 'fieldInk',
          })}
        >
          {statement}
        </p>
      </div>
    </section>
  )
}
