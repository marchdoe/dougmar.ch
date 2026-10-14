import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseFacts } from './CaseFacts'
import { CaseLinks } from './CaseLinks'
import { CaseNarrative } from './CaseNarrative'

type Proj = (typeof projects)[number]

export function CaseBody({ project }: { project: Proj }) {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        paddingBlock: { base: '44px', lg: '60px' },
        paddingLeft: { base: '20px', lg: '48px' },
        paddingRight: { base: '20px', lg: '6vw' },
        display: 'flex',
        flexDirection: 'column',
        gap: '7',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <CaseFacts project={project} />
      <CaseNarrative project={project} />
      <CaseLinks project={project} />
    </section>
  )
}
