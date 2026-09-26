import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { CaseHero } from '../components/generated/CaseHero'
import { CaseMissing } from '../components/generated/CaseMissing'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <CaseMissing />
  return (
    <>
      <CaseHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseBody project={project} />}
    </>
  )
}
