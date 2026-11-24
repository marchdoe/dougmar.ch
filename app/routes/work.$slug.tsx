import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { CaseHead } from '../components/generated/CaseHead'
import { MissingProject } from '../components/generated/MissingProject'
import { WorkIndex } from '../components/generated/WorkIndex'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <MissingProject />
  const others = projects.filter((p) => p.slug !== slug)
  return (
    <>
      <CaseHead project={project} />
      {project.slug === 'dougmar-ch' ? (
        <WhitePaper />
      ) : (
        <>
          <CaseBody project={project} />
          <WorkIndex items={others} label="More work" />
        </>
      )}
    </>
  )
}
