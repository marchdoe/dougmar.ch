import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { FeaturedWork } from './FeaturedWork'
import { IndexList } from './IndexList'

export function WorkSection() {
  return (
    <section
      className={css({
        paddingTop: 'clamp(56px, 7vw, 112px)',
        paddingBottom: 'clamp(40px, 5vw, 72px)',
        paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ marginBottom: 'clamp(28px, 4vw, 48px)' })}>
        <h2
          className={css({
            textStyle: 'xs',
            fontWeight: 'semibold',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
          })}
        >
          Selected work
        </h2>
      </div>
      {featuredProject ? <FeaturedWork project={featuredProject} /> : null}
      <IndexList label="Case studies" items={selectedWork} />
      <IndexList label="Experiments" items={experiments} />
    </section>
  )
}
