import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { projects } from '../content/projects'
import { CaseLinks } from '../components/generated/CaseLinks'
import { CaseNarrative } from '../components/generated/CaseNarrative'
import { SignalsStrip, todaySignals } from '../components/generated/SignalsStrip'
import { MissingProject, WorkHero } from '../components/generated/WorkHero'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

type Project = (typeof projects)[number]

function CaseBody({ project }: { project: Project }) {
  return (
    <>
      <CaseNarrative project={project} />
      <CaseLinks project={project} />
    </>
  )
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) {
    return <MissingProject slug={slug} />
  }
  return (
    <>
      <WorkHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseBody project={project} />}
      <SignalsStrip kicker="signals · sat 31 oct 2026" facts={todaySignals} />
    </>
  )
}
