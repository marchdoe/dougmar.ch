import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseStudy } from '../components/generated/CaseStudy'
import { Field } from '../components/generated/Field'
import { MissingWork } from '../components/generated/MissingWork'
import { WorkHeader } from '../components/generated/WorkHeader'
import { WorkIndex } from '../components/generated/WorkIndex'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <MissingWork />
  return (
    <>
      <Field>
        <WorkHeader project={project} />
      </Field>
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
      <WorkIndex />
    </>
  )
}
