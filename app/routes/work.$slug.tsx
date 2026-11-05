import { createFileRoute } from '@tanstack/react-router'
import { CaseStudy } from '../components/generated/CaseStudy'
import { MissingWorkHero, WorkHero } from '../components/generated/WorkHero'
import { WhitePaper } from '../components/WhitePaper'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((candidate) => candidate.slug === slug)
  if (!project) return <MissingWorkHero />
  return (
    <>
      <WorkHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
