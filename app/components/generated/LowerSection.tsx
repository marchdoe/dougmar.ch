import { css } from '../../../styled-system/css'
import { SignalsLadder } from './SignalsLadder'
import { WorkCatalog } from './WorkCatalog'

export function LowerSection() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingInline: 'clamp(28px,6vw,112px)',
        paddingBlock: 'clamp(48px,6vh,96px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '8fr 4fr' },
        gap: { base: 'clamp(48px,6vh,96px)', lg: 'clamp(28px,6vw,112px)' },
        alignItems: { lg: 'start' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <WorkCatalog />
      <SignalsLadder />
    </section>
  )
}
