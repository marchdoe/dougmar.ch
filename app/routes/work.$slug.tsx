import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBands } from '../components/generated/CaseBands'
import { CaseHead } from '../components/generated/CaseHead'
import { CaseMissing } from '../components/generated/CaseMissing'
import { CaseStack } from '../components/generated/CaseStack'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <CaseMissing />
  return (
    <>
      <CaseHead project={project} />
      {project.slug === 'dougmar-ch' ? (
        <WhitePaper />
      ) : (
        <>
          <CaseBands project={project} />
          <CaseStack project={project} />
        </>
      )}
    </>
  )
}
