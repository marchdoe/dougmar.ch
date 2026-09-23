import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseHeader } from '../components/generated/CaseHeader'
import { CaseLinks } from '../components/generated/CaseLinks'
import { CaseMissing } from '../components/generated/CaseMissing'
import { CaseNarrative } from '../components/generated/CaseNarrative'
import { SignalLedger } from '../components/generated/SignalLedger'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

type CaseProject = (typeof projects)[number]

function CaseStudy({ project }: { project: CaseProject }) {
  return (
    <>
      <CaseNarrative project={project} />
      <CaseLinks project={project} />
    </>
  )
}

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <CaseMissing />
  return (
    <>
      <CaseHeader project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
      <SignalLedger />
    </>
  )
}
