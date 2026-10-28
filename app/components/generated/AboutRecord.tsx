import { css } from '../../../styled-system/css'
import { CapabilityList } from './CapabilityList'
import { EducationBlock } from './EducationBlock'
import { TimelineList } from './TimelineList'

export function AboutRecord() {
  return (
    <section
      className={css({
        bg: 'surface',
        paddingBlock: 'clamp(48px, 6vw, 112px)',
        paddingInline: 'clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1.6fr 1fr' },
        gap: 'clamp(36px, 5vw, 72px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ minWidth: '0' })}>
        <TimelineList />
        <EducationBlock />
      </div>
      <div className={css({ minWidth: '0' })}>
        <CapabilityList />
      </div>
    </section>
  )
}
