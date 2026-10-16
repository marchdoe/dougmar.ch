import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseNarrative } from '../components/generated/CaseNarrative'
import { WorkHero } from '../components/generated/WorkHero'
import { WorkMissing } from '../components/generated/WorkMissing'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <WorkMissing />
  return (
    <>
      <WorkHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseNarrative project={project} />}
    </>
  )
}
