import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { projects } from '../content/projects'
import { FieldBand } from '../components/generated/FieldBand'
import { CaseStudyNarrative } from '../components/generated/CaseStudyNarrative'
import { CaseStudyMeta } from '../components/generated/CaseStudyMeta'
import { WhitePaperContext } from '../components/generated/WhitePaperContext'
import { WhitePaperProcess } from '../components/generated/WhitePaperProcess'
import { WhitePaperDecisions } from '../components/generated/WhitePaperDecisions'
import { WhitePaperReferences } from '../components/generated/WhitePaperReferences'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

type WhitePaper = {
  context?: string
  constraints?: string[]
  process?: { phase: string; does: string; produces: string }[]
  decisions?: { decision: string; why: string }[]
  references?: { title: string; url: string; note?: string }[]
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug) as
    | ((typeof projects)[number] & WhitePaper)
    | undefined

  if (!project) {
    return (
      <Box padding="9" color="textMuted" fontSize="lg">
        Project not found.
      </Box>
    )
  }

  return (
    <>
      <FieldBand
        eyebrow={`${project.type} · ${project.year}`}
        title={project.title}
        standfirst={project.problem}
      />
      <CaseStudyNarrative project={project} />
      <CaseStudyMeta project={project} />
      <WhitePaperContext context={project.context} constraints={project.constraints} />
      <WhitePaperProcess process={project.process} />
      <WhitePaperDecisions decisions={project.decisions} />
      <WhitePaperReferences references={project.references} />
    </>
  )
}
