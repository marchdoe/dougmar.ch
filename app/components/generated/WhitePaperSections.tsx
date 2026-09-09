import { Box } from '../../../styled-system/jsx'
import { ContextConstraints } from './ContextConstraints'
import { ProcessList } from './ProcessList'
import { DecisionsList } from './DecisionsList'
import { ReferencesList } from './ReferencesList'

type Props = {
  project: {
    context?: string
    constraints?: string[]
    process?: { phase: string; does: string; produces: string }[]
    decisions?: { decision: string; why: string }[]
    references?: { title: string; url: string; note?: string }[]
  }
}

export function WhitePaperSections({ project }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap="6">
      <ContextConstraints context={project.context} constraints={project.constraints} />
      <ProcessList process={project.process} />
      <DecisionsList decisions={project.decisions} />
      <ReferencesList references={project.references} />
    </Box>
  )
}
