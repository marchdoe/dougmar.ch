import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBand } from '../components/generated/CaseBand'
import { CaseBody } from '../components/generated/CaseBody'
import { CaseHero } from '../components/generated/CaseHero'
import { CaseMissing } from '../components/generated/CaseMissing'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const index = projects.findIndex((entry) => entry.slug === slug)
  const project = index >= 0 ? projects[index] : undefined
  if (!project) return <CaseMissing />
  const next = projects[(index + 1) % projects.length]
  return (
    <>
      <CaseHero project={project} />
      {project.slug === 'dougmar-ch' ? (
        <WhitePaper />
      ) : (
        <>
          <CaseBody project={project} />
          <CaseBand project={project} next={next} />
        </>
      )}
    </>
  )
}
