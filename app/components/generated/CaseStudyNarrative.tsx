import { Box } from '../../../styled-system/jsx'
import { EvidenceRow } from './EvidenceRow'
import type { Project } from '../../content/projects'

export function CaseStudyNarrative({ project }: { project: Project }) {
  return (
    <Box bg="bgAlt" px={{ base: '28px', md: '52px', lg: '88px' }} py={{ base: '30px', md: '52px' }}>
      <EvidenceRow k="Problem">{project.problem}</EvidenceRow>
      <EvidenceRow k="Approach">{project.approach}</EvidenceRow>
      <EvidenceRow k="Outcome">{project.outcome}</EvidenceRow>
    </Box>
  )
}
