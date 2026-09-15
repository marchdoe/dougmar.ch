import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'
import type { Project } from '../../content/projects'

const revealCss = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})

const blocks: { key: 'problem' | 'approach' | 'outcome'; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'approach', label: 'Approach' },
  { key: 'outcome', label: 'Outcome' },
]

export function CaseStudyNarrative({ project }: { project: Project }) {
  return (
    <Box as="section" className={css({ pb: '5' })}>
      <Box className={revealCss}>
        {blocks.map((b) => {
          const text = project[b.key]
          if (!text) return null
          return (
            <Box key={b.key} className={css({ mb: '6' })}>
              <Box
                className={css({
                  color: 'fieldInkMuted',
                  mb: '2',
                  fontSize: 'sm',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                })}
              >
                {b.label}
              </Box>
              <p
                className={css({
                  fontSize: 'base',
                  lineHeight: 'normal',
                  color: 'fieldInk',
                  margin: 0,
                  maxWidth: '60ch',
                })}
              >
                {text}
              </p>
            </Box>
          )
        })}
        {project.stack && project.stack.length > 0 && (
          <Box className={css({ mb: '6' })}>
            <Box
              className={css({
                color: 'fieldInkMuted',
                mb: '2',
                fontSize: 'sm',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
              })}
            >
              Stack
            </Box>
            <p className={css({ fontSize: 'base', color: 'fieldInkMuted', margin: 0 })}>
              {project.stack.join(', ')}
            </p>
          </Box>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            className={css({
              fontSize: 'sm',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              fontWeight: 'bold',
              color: 'accentAlt',
              display: 'inline-flex',
              minHeight: '44px',
              alignItems: 'center',
            })}
          >
            Visit live &rarr;
          </a>
        )}
      </Box>
    </Box>
  )
}
