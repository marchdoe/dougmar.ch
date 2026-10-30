import type { projects } from '../../content/projects'
import { CaseNarrative } from './CaseNarrative'
import { CaseStack } from './CaseStack'
import { ClientSet } from './ClientSet'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  return (
    <>
      <ClientSet clients={project.clients ?? []} />
      <CaseNarrative project={project} />
      <CaseStack project={project} />
    </>
  )
}
