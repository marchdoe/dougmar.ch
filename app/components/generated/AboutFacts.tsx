import { css } from '../../../styled-system/css'
import { EducationRows } from './EducationRows'
import { PersonalPanel } from './PersonalPanel'

export function AboutFacts() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(22px, 6vw, 56px)',
        paddingInline: 'clamp(20px, 6vw, 80px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '7fr 5fr' },
        gap: 'clamp(32px, 5vw, 72px)',
        alignItems: 'start',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <EducationRows />
      <PersonalPanel />
    </section>
  )
}
