import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseStudy } from '../components/generated/CaseStudy'
import { PageHero } from '../components/generated/PageHero'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) {
    return <PageHero title="Project not found" caption="See the work index" />
  }
  const caption = [project.type, String(project.year), project.role ?? '']
    .filter(Boolean)
    .join(' · ')
  return (
    <>
      <PageHero title={project.title} caption={caption} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
