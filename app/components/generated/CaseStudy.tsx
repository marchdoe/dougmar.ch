import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseLinks } from './CaseLinks'
import { CaseNarrative } from './CaseNarrative'
import { CaseStack } from './CaseStack'

type Item = (typeof projects)[number]

export function CaseStudy({ project }: { project: Item }) {
  return (
    <section
      className={css({
        paddingBottom: { base: '24px', lg: '64px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <CaseNarrative project={project} />
      <CaseStack stack={project.stack ?? []} />
      <CaseLinks project={project} />
    </section>
  )
}
