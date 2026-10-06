import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { CaseHero, CaseMissing } from '../components/generated/CaseHero'
import { CaseRail } from '../components/generated/CaseRail'
import { SplitHero } from '../components/generated/SplitHero'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: CaseStudyPage })

function CaseStudyPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <CaseMissing />
  const isPaper = project.slug === 'dougmar-ch'
  return (
    <>
      <SplitHero rail={isPaper ? undefined : <CaseRail project={project} />}>
        <CaseHero project={project} />
      </SplitHero>
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseBody project={project} />}
    </>
  )
}
