import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Box } from '../../styled-system/jsx'
import { projects } from '../content/projects'
import { WorkHero } from '../components/generated/WorkHero'
import { WorkNarrative } from '../components/generated/WorkNarrative'
import { WorkMeta } from '../components/generated/WorkMeta'
import { WhitePaperContext } from '../components/generated/WhitePaperContext'
import { WhitePaperProcess } from '../components/generated/WhitePaperProcess'
import { WhitePaperDecisions } from '../components/generated/WhitePaperDecisions'
import { WhitePaperReferences } from '../components/generated/WhitePaperReferences'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <Box
        className={css({
          bg: 'bg',
          paddingInline: { base: '5', lg: '9' },
          paddingBlock: '9',
          color: 'textMuted',
        })}
      >
        Project not found.
      </Box>
    )
  }

  return (
    <>
      <WorkHero title={project.title} type={project.type} year={project.year} />
      <WorkNarrative
        problem={project.problem}
        approach={project.approach}
        outcome={project.outcome}
      />
      <WorkMeta role={project.role} stack={project.stack} liveUrl={project.liveUrl} />
      {(project.context || project.constraints) && (
        <WhitePaperContext context={project.context} constraints={project.constraints} />
      )}
      {project.process && <WhitePaperProcess process={project.process} />}
      {project.decisions && <WhitePaperDecisions decisions={project.decisions} />}
      {project.references && <WhitePaperReferences references={project.references} />}
    </>
  )
}
