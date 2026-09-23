import { css } from '../../../styled-system/css'
import { CapabilityTags } from './CapabilityTags'
import { EducationRow } from './EducationRow'
import { PersonalRail } from './PersonalRail'
import { TimelineLedger } from './TimelineLedger'

export function AboutBody() {
  return (
    <section
      aria-label="Record"
      className={css({
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(30px, 5vw, 52px)',
        paddingBottom: 'clamp(24px, 3vw, 32px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
        lg: {
          display: 'grid',
          gridTemplateColumns: '1.65fr 1fr',
          columnGap: 'clamp(32px, 5vw, 80px)',
          alignItems: 'start',
        },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '6', minWidth: '0' })}>
        <TimelineLedger />
        <CapabilityTags />
        <EducationRow />
      </div>
      <PersonalRail />
    </section>
  )
}
