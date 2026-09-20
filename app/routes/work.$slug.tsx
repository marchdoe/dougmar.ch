import { createFileRoute } from '@tanstack/react-router'
import { projects } from '../content/projects'
import { Masthead } from '../components/generated/Masthead'
import { CaseStudyBody } from '../components/generated/CaseStudyBody'
import { WhitePaper } from '../components/WhitePaper'
import { WorkFoot } from '../components/generated/WorkFoot'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index] ?? projects[0]
  const prev = projects[index - 1]
  const next = projects[index + 1]

  return (
    <>
      <Masthead heroContent={<>{project.title}</>} heroVariant="title" />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudyBody project={project} />}
      <WorkFoot prev={prev} next={next} />
    </>
  )
}
