import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = { project: { problem?: string; approach?: string; outcome?: string } }

function Block({ label, text }: { label: string; text: string }) {
  return (
    <Box className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
      <span
        className={css({
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
        })}
      >
        {label}
      </span>
      <p
        className={css({
          fontFamily: 'body',
          textStyle: 'md',
          color: 'textMuted',
          maxWidth: '66ch',
        })}
      >
        {text}
      </p>
    </Box>
  )
}

export function CaseStudyNarrative({ project }: Props) {
  return (
    <Box
      as="section"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '8', lg: '9' },
        display: 'flex',
        flexDirection: 'column',
        gap: '7',
        borderBottom: '2px solid',
        borderColor: 'borderStrong',
      })}
    >
      {project.problem && <Block label="Problem" text={project.problem} />}
      {project.approach && <Block label="Approach" text={project.approach} />}
      {project.outcome && <Block label="Outcome" text={project.outcome} />}
    </Box>
  )
}
