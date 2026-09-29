import { css } from '../../../styled-system/css'
import { CaseBand } from './CaseBand'
import { CaseLinks } from './CaseLinks'
import { CaseNarrative } from './CaseNarrative'

type StudyProject = {
  problem?: string
  description?: string
  approach?: string
  outcome?: string
  stack?: string[]
  liveUrl?: string
  externalUrl?: string
  githubUrl?: string
}

export function CaseStudy({ project }: { project: StudyProject }) {
  return (
    <>
      <CaseBand problem={project.problem} description={project.description} />
      <section
        className={css({
          paddingBlock: '7',
          paddingInline: '6vw',
          '@supports (animation-timeline: view())': {
            animationName: 'rise',
            animationTimeline: 'view()',
            animationRange: 'entry 0% entry 40%',
            animationFillMode: 'both',
          },
        })}
      >
        <div
          className={css({
            maxWidth: '880px',
            marginInline: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6',
          })}
        >
          <CaseNarrative
            approach={project.approach}
            outcome={project.outcome}
            stack={project.stack}
          />
          <CaseLinks
            liveUrl={project.liveUrl}
            externalUrl={project.externalUrl}
            githubUrl={project.githubUrl}
          />
        </div>
      </section>
    </>
  )
}
