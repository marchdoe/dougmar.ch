import { CaseBody } from './CaseBody'
import { ProblemBand } from './ProblemBand'
import { type Project, field } from './projectFields'

export function CaseStudy({ project }: { project: Project }) {
  const problem = field(project, 'problem')
  return (
    <>
      {problem ? <ProblemBand text={problem} /> : null}
      <CaseBody project={project} />
    </>
  )
}
