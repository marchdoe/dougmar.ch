import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseHero } from '../components/generated/CaseHero'
import { CaseNarrative } from '../components/generated/CaseNarrative'
import { MissingCase } from '../components/generated/MissingCase'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <MissingCase />
  return (
    <>
      <CaseHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseNarrative project={project} />}
    </>
  )
}
