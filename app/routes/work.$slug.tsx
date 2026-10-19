import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { CaseHero } from '../components/generated/CaseHero'
import { CaseMissing } from '../components/generated/CaseMissing'
import { InteriorHeader } from '../components/generated/InteriorHeader'
import { PageFrame } from '../components/generated/PageFrame'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) {
    return (
      <PageFrame>
        <InteriorHeader />
        <CaseMissing slug={slug} />
      </PageFrame>
    )
  }
  return (
    <>
      <PageFrame>
        <InteriorHeader />
        <CaseHero project={project} />
      </PageFrame>
      {project.slug === 'dougmar-ch' ? (
        <WhitePaper />
      ) : (
        <PageFrame>
          <CaseBody project={project} />
        </PageFrame>
      )}
    </>
  )
}
