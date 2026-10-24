import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { FeaturedWork } from './FeaturedWork'
import { WorkList } from './WorkList'

export function WorkIndex() {
  return (
    <section
      id="work"
      aria-label="Work"
      className={css({
        position: 'relative',
        zIndex: 1,
        bg: 'bgAlt',
        borderTop: '3px solid',
        borderTopColor: 'borderStrong',
        paddingTop: '8',
        paddingBottom: '72px',
        paddingInline: '5vw',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ maxWidth: '1180px', marginInline: 'auto' })}>
        <div
          className={css({
            textStyle: 'xs',
            fontWeight: 'bold',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'text',
            marginBottom: '28px',
          })}
        >
          Design and engineering · the work
        </div>
        <FeaturedWork />
        <div
          className={css({
            display: 'grid',
            gap: { base: '40px', lg: '56px' },
            gridTemplateColumns: { lg: '1fr 1fr' },
          })}
        >
          <WorkList heading="Selected work" items={selectedWork} />
          <WorkList heading="Experiments" items={experiments} />
        </div>
      </div>
    </section>
  )
}
