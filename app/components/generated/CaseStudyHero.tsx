import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = {
  project: {
    title: string
    type: string
    year: number
    role?: string
    timeline?: string
    status?: string
  }
}

export function CaseStudyHero({ project }: Props) {
  return (
    <Box
      as="section"
      bg="field"
      color="fieldInk"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '9', lg: '9' },
        borderBottom: '2px solid',
        borderColor: 'fieldBorder',
        display: 'flex',
        flexDirection: 'column',
        gap: '4',
      })}
    >
      <Box
        className={css({
          fontFamily: 'display',
          textStyle: 'sm',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          display: 'flex',
          gap: '4',
          flexWrap: 'wrap',
        })}
      >
        <span>{project.type}</span>
        <span>{project.year}</span>
        {project.role && <span>{project.role}</span>}
        {project.status && <span>{project.status}</span>}
      </Box>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'hero',
          letterSpacing: 'tight',
          color: 'fieldInk',
        })}
      >
        {project.title}
      </h1>
      {project.timeline && (
        <div className={css({ fontFamily: 'display', textStyle: 'sm', color: 'fieldInkMuted' })}>
          {project.timeline}
        </div>
      )}
    </Box>
  )
}
