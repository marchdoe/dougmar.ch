import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function FeaturedProject({ project }: { project: Project }) {
  const href = project.externalUrl ?? project.liveUrl ?? '#'
  return (
    <Box
      className={css({
        bg: 'surface',
        border: '1px solid',
        borderColor: 'border',
        padding: { base: '5', lg: '9' },
        marginBottom: '6',
        display: { lg: 'grid' },
        gridTemplateColumns: { lg: '1.1fr 1fr' },
        columnGap: { lg: '9' },
      })}
    >
      <Box>
        <p
          className={css({
            textStyle: '2xs',
            fontWeight: '700',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            color: 'textMuted',
            marginBottom: '3',
          })}
        >
          {project.title} · {project.role} · {project.year}
        </p>
        <h3
          className={css({
            fontFamily: 'display',
            textStyle: { base: '3xl', lg: '4xl' },
            lineHeight: 'tight',
            color: 'text',
            marginBottom: '4',
          })}
        >
          {project.title}
        </h3>
      </Box>
      <Box>
        <p
          className={css({
            textStyle: 'base',
            lineHeight: 'normal',
            color: 'textMuted',
            maxWidth: '60ch',
            marginBottom: '5',
          })}
        >
          {project.problem}
        </p>
        <a
          href={href}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            gap: '2',
            fontWeight: '700',
            textStyle: 'sm',
            fontVariant: 'small-caps',
            borderBottom: '2px solid',
            borderColor: 'text',
            color: 'text',
            _hover: { color: 'border', borderColor: 'border' },
          })}
        >
          Visit {project.title} ↗
        </a>
      </Box>
    </Box>
  )
}
