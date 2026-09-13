import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type NarrativeProject = { problem?: string; approach?: string; outcome?: string }

const labelCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'accentAlt',
  marginBottom: '2',
})

const bodyCss = css({
  fontSize: 'base',
  lineHeight: 'normal',
  color: 'text',
  maxWidth: '68ch',
})

function NarrativeBlock({ label, body }: { label: string; body?: string }) {
  if (!body) return null
  return (
    <Box>
      <Box className={labelCss}>{label}</Box>
      <p className={bodyCss}>{body}</p>
    </Box>
  )
}

export function CaseStudyNarrative({ project }: { project: NarrativeProject }) {
  return (
    <Box
      as="section"
      padding={{ base: '32px 20px', md: '48px 7vw' }}
      display="flex"
      flexDirection="column"
      gap="8"
    >
      <NarrativeBlock label="Problem" body={project.problem} />
      <NarrativeBlock label="Approach" body={project.approach} />
      <NarrativeBlock label="Outcome" body={project.outcome} />
    </Box>
  )
}
