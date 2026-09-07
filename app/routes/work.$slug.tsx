import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { projects } from '../content/projects'
import { ProjectHero } from '../components/generated/ProjectHero'
import { ProjectNarrative } from '../components/generated/ProjectNarrative'
import { ProjectContext } from '../components/generated/ProjectContext'
import { ProjectProcess } from '../components/generated/ProjectProcess'
import { ProjectDecisions } from '../components/generated/ProjectDecisions'
import { ProjectReferences } from '../components/generated/ProjectReferences'
import { SiteColophon } from '../components/generated/SiteColophon'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const idx = projects.findIndex((p) => p.slug === slug)
  const project = projects[idx]

  if (!project) {
    return (
      <Box
        paddingInline="clamp(24px, 8vw, 160px)"
        paddingBlock="9"
        fontFamily="body"
        color="textMuted"
      >
        Project not found.
      </Box>
    )
  }

  const prev = projects[(idx - 1 + projects.length) % projects.length]
  const next = projects[(idx + 1) % projects.length]
  const hasConstraints = Boolean(project.constraints && project.constraints.length > 0)

  return (
    <>
      <ProjectHero title={project.title} type={project.type} year={project.year} />
      <ProjectNarrative
        role={project.role}
        problem={project.problem}
        approach={project.approach}
        outcome={project.outcome}
        stack={project.stack}
        liveUrl={project.liveUrl}
      />
      {(project.context || hasConstraints) && (
        <ProjectContext context={project.context} constraints={project.constraints} />
      )}
      {project.process && project.process.length > 0 && (
        <ProjectProcess process={project.process} />
      )}
      {project.decisions && project.decisions.length > 0 && (
        <ProjectDecisions decisions={project.decisions} />
      )}
      {project.references && project.references.length > 0 && (
        <ProjectReferences references={project.references} />
      )}
      <SiteColophon
        extraRows={[
          { k: 'Previous', v: <a href={`/work/${prev.slug}`}>{prev.title}</a> },
          { k: 'Next', v: <a href={`/work/${next.slug}`}>{next.title}</a> },
        ]}
      />
    </>
  )
}
