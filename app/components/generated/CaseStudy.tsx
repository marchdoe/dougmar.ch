import type { projects } from '../../content/projects'
import { CaseDetails } from './CaseDetails'
import { CaseNarrative } from './CaseNarrative'
import { MoreWork } from './MoreWork'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  return (
    <>
      <CaseNarrative project={project} />
      <CaseDetails project={project} />
      <MoreWork slug={project.slug} />
    </>
  )
}
