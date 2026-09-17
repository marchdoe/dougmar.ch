import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type Project = { problem?: string; approach?: string; outcome?: string }

export function WorkNarrative({ project }: { project: Project }) {
  return (
    <Box
      as="section"
      bg="bg"
      className={css({
        paddingInline: '7vw',
        paddingBlock: { base: '32px', md: '48px' },
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {project.problem && <Narrative label="Problem" text={project.problem} />}
      {project.approach && <Narrative label="Approach" text={project.approach} />}
      {project.outcome && <Narrative label="Outcome" text={project.outcome} />}
    </Box>
  )
}

function Narrative({ label, text }: { label: string; text: string }) {
  return (
    <Box>
      <span
        className={css({
          fontSize: 'xs',
          fontWeight: '600',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textFaint',
          display: 'block',
          marginBottom: '2',
        })}
      >
        {label}
      </span>
      <Box
        as="p"
        color="textMuted"
        className={css({ fontSize: 'lg', maxWidth: '66ch', lineHeight: 'normal' })}
      >
        {text}
      </Box>
    </Box>
  )
}
