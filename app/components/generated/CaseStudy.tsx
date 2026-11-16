import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseSection } from './CaseSection'
import { LiveLink } from './LiveLink'
import { RevealSection } from './RevealSection'
import { StackList } from './StackList'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  return (
    <RevealSection
      aria-label="Case study"
      className={css({
        gridArea: 'rest',
        minWidth: '0',
        bg: 'bg',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: { base: '16px', lg: '32px' },
        paddingBottom: { base: '52px', lg: '64px' },
        paddingInline: { base: '24px', lg: '6vw' },
      })}
    >
      <CaseSection label="Overview" text={project.description} />
      <CaseSection label="Problem" text={project.problem} />
      <CaseSection label="Approach" text={project.approach} />
      <CaseSection label="Outcome" text={project.outcome} />
      <StackList stack={project.stack} />
      <LiveLink url={project.liveUrl} />
    </RevealSection>
  )
}
