import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseHeader } from '../components/generated/CaseHeader'
import { CaseNotFound } from '../components/generated/CaseNotFound'
import { CaseStudy } from '../components/generated/CaseStudy'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <CaseNotFound />
  return (
    <>
      <CaseHeader project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
