import { createFileRoute } from '@tanstack/react-router'
import { CaseStudy } from '../components/generated/CaseStudy'
import { WorkHero } from '../components/generated/WorkHero'
import { WhitePaper } from '../components/WhitePaper'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

type Project = (typeof projects)[number]

function deckFor(project: Project): string {
  const parts = [project.role ?? '', project.type, String(project.year)].filter((p) => p !== '')
  return [...new Set(parts)].join(' · ')
}

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <WorkHero title="Not found" deck="No project by that name." />
  return (
    <>
      <WorkHero title={project.title} deck={deckFor(project)} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
