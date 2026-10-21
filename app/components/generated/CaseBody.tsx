import type { projects } from '../../content/projects'
import { CaseNarrative } from './CaseNarrative'
import { CaseStack } from './CaseStack'
import { ClientBand } from './ClientBand'
import { ProblemPlane } from './ProblemPlane'

type Project = (typeof projects)[number]

export function CaseBody({ project }: { project: Project }) {
  return (
    <>
      <ProblemPlane statement={project.description ?? project.problem} />
      <CaseNarrative
        rows={[
          { label: 'Problem', body: project.problem },
          { label: 'Approach', body: project.approach },
          { label: 'Outcome', body: project.outcome },
        ]}
      />
      <CaseStack project={project} />
      <ClientBand clients={project.clients} />
    </>
  )
}
