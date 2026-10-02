import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { FeaturedWork } from './FeaturedWork'
import { ProjectGroup } from './ProjectGroup'

export function WorkIndex() {
  return (
    <section
      id="work"
      className={css({
        bg: 'bg',
        paddingTop: 'clamp(48px, 7vw, 96px)',
        paddingBottom: 'clamp(40px, 5vw, 72px)',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {featuredProject ? <FeaturedWork project={featuredProject} /> : null}
      <ProjectGroup label="Selected Work" items={selectedWork} />
      <ProjectGroup label="Experiments" items={experiments} preferExternal />
    </section>
  )
}
