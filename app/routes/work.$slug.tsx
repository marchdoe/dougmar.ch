import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { ProjectHeader } from '../components/generated/ProjectHeader'
import { ProjectNarrative } from '../components/generated/ProjectNarrative'
import { ProjectMeta } from '../components/generated/ProjectMeta'
import { WhitePaper } from '../components/generated/WhitePaper'
import { projects } from '../content/projects'

type ExtendedProject = (typeof projects)[number] & {
  timeline?: string
  status?: string
  context?: string
  constraints?: string[]
  process?: { phase: string; does: string; produces: string }[]
  decisions?: { decision: string; why: string }[]
  references?: { title: string; url: string; note?: string }[]
}

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug) as ExtendedProject | undefined

  if (!project) {
    return (
      <Box className={css({ bg: 'bg', color: 'text', minHeight: '100vh', padding: '9' })}>
        <p className={css({ textStyle: 'lg' })}>Project not found.</p>
      </Box>
    )
  }

  return (
    <Box className={css({ bg: 'bg', color: 'text', minHeight: '100vh' })}>
      <ProjectHeader
        title={project.title}
        type={project.type}
        year={project.year}
        role={project.role}
        timeline={project.timeline}
        status={project.status}
      />
      <Box
        className={css({
          paddingX: { base: '5', lg: '6vw' },
          paddingBottom: { base: '9', lg: '9' },
        })}
      >
        <ProjectNarrative
          problem={project.problem}
          approach={project.approach}
          outcome={project.outcome}
        />
        <ProjectMeta stack={project.stack} liveUrl={project.liveUrl} />
        <WhitePaper
          context={project.context}
          constraints={project.constraints}
          process={project.process}
          decisions={project.decisions}
          references={project.references}
        />
      </Box>
    </Box>
  )
}
