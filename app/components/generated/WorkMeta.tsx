import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type Project = { stack?: string[]; liveUrl?: string }

export function WorkMeta({ project }: { project: Project }) {
  return (
    <Box
      as="section"
      bg="bgAlt"
      className={css({
        paddingInline: '7vw',
        paddingBlock: { base: '32px', md: '40px' },
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6',
        alignItems: 'baseline',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {project.stack && (
        <Box className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
          {project.stack.map((s) => (
            <span
              key={s}
              className={css({
                fontSize: 'sm',
                color: 'textMuted',
                border: '1px solid',
                borderColor: 'border',
                borderRadius: 'sm',
                padding: '1',
              })}
            >
              {s}
            </span>
          ))}
        </Box>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          className={css({
            fontFamily: 'display',
            color: 'accent',
            fontSize: 'md',
            textDecoration: 'underline',
            textUnderlineOffset: '0.16em',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            paddingBlock: '2',
          })}
        >
          Visit the live site
        </a>
      )}
    </Box>
  )
}
