import { createFileRoute } from '@tanstack/react-router'
import { projects } from '../content/projects'
import { Masthead } from '../components/generated/Masthead'
import { CaseStudyBody } from '../components/generated/CaseStudyBody'
import { WhitePaperSection } from '../components/generated/WhitePaperSection'
import { WorkFoot } from '../components/generated/WorkFoot'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

type BaseProject = (typeof projects)[number]
type FullProject = BaseProject & {
  timeline?: string
  status?: string
  context?: string
  constraints?: string[]
  process?: { phase: string; does: string; produces: string }[]
  decisions?: { decision: string; why: string }[]
  references?: { title: string; url: string; note?: string }[]
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = (projects[index] ?? projects[0]) as FullProject
  const prev = projects[index - 1]
  const next = projects[index + 1]
  const hasPaper = Boolean(
    project.context ||
      project.constraints ||
      project.process ||
      project.decisions ||
      project.references
  )

  return (
    <>
      <Masthead heroContent={<>{project.title}</>} heroVariant="title" />
      <CaseStudyBody project={project} />
      {hasPaper && <WhitePaperSection paper={project} />}
      <WorkFoot prev={prev} next={next} />
    </>
  )
}
