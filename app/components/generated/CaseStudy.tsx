import type { projects } from '../../content/projects'
import { CaseBody } from './CaseBody'
import { CaseClients } from './CaseClients'
import { CaseFacts } from './CaseFacts'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  return (
    <>
      <CaseBody project={project} />
      <CaseClients project={project} />
      <CaseFacts project={project} />
    </>
  )
}
