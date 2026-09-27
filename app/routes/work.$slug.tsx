import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseStudy } from '../components/generated/CaseStudy'
import { MissingProject } from '../components/generated/MissingProject'
import { ProjectBanner } from '../components/generated/ProjectBanner'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return <MissingProject slug={slug} />
  return (
    <>
      <ProjectBanner title={project.title} kicker={`${project.type} · ${project.year}`} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
