import { createFileRoute } from '@tanstack/react-router'
import { MissingProject, PaperHead, SplitCaseStudy } from '../components/generated/CaseStudy'
import { WhitePaper } from '../components/WhitePaper'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((candidate) => candidate.slug === slug)

  if (!project) return <MissingProject />

  return (
    <>
      {project.slug === 'dougmar-ch' ? <PaperHead project={project} /> : null}
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <SplitCaseStudy project={project} />}
    </>
  )
}
