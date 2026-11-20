import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseNarrative } from '../components/generated/CaseNarrative'
import { WorkFacts } from '../components/generated/WorkFacts'
import { WorkHeader } from '../components/generated/WorkHeader'
import { WorkMeta } from '../components/generated/WorkMeta'
import { WorkMissing } from '../components/generated/WorkMissing'
import { WorkStandfirst } from '../components/generated/WorkStandfirst'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <WorkMissing />
  if (project.slug === 'dougmar-ch') {
    return (
      <>
        <WorkHeader title={project.title} />
        <WhitePaper />
      </>
    )
  }
  return (
    <>
      <WorkHeader
        title={project.title}
        deck={<WorkStandfirst text={project.description ?? project.problem} />}
        aside={<WorkMeta project={project} />}
      />
      <WorkFacts project={project} />
      <CaseNarrative project={project} />
    </>
  )
}
