import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { MissingProject } from '../components/generated/MissingProject'
import { WorkHero } from '../components/generated/WorkHero'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <MissingProject slug={slug} />
  return (
    <>
      <WorkHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseBody project={project} />}
    </>
  )
}
