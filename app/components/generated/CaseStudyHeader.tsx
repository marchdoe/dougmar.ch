import { Box, Flex } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type HeaderProject = {
  title: string
  type: string
  year: number
  role?: string
  stack?: string[]
  liveUrl?: string
}

export function CaseStudyHeader({ project }: { project: HeaderProject }) {
  return (
    <Box display="flex" flexDirection="column" gap="3">
      <Box
        className={css({
          textStyle: 'sm',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'wide',
          color: 'accentAlt',
        })}
      >
        {project.type} · {project.year}
        {project.role ? ` · ${project.role}` : ''}
      </Box>
      <Box
        as="h1"
        className={css({
          textStyle: '4xl',
          fontWeight: '800',
          fontFamily: 'display',
          color: 'text',
          maxWidth: '20ch',
          margin: 0,
        })}
      >
        {project.title}
      </Box>
      {(project.stack || project.liveUrl) && (
        <Flex wrap="wrap" gap="3" className={css({ textStyle: 'sm', color: 'textMuted' })}>
          {project.stack && <span>{project.stack.join(' · ')}</span>}
          {project.liveUrl && (
            <a href={project.liveUrl} className={css({ color: 'accent' })}>
              visit live →
            </a>
          )}
        </Flex>
      )}
    </Box>
  )
}
