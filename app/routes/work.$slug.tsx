import { createFileRoute } from '@tanstack/react-router'
import { projects } from '../content/projects'
import { WhitePaper } from '../components/WhitePaper'
import { CaseStudy } from '../components/generated/CaseStudy'
import { PageField } from '../components/generated/PageField'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) {
    return <PageField eyebrow="Work" title="Project not found" big />
  }
  return (
    <>
      <PageField eyebrow={project.type} title={project.title} big />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
