import { createFileRoute } from '@tanstack/react-router'
import { CaseStudy } from '../components/generated/CaseStudy'
import { WorkHeader } from '../components/generated/WorkHeader'
import { WorkMissing } from '../components/generated/WorkMissing'
import { WhitePaper } from '../components/WhitePaper'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((entry) => entry.slug === slug)
  if (!project) return <WorkMissing />
  return (
    <>
      <WorkHeader project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
