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

const titleCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textStyle: '2xl',
  textTransform: 'uppercase',
  color: 'fieldInk',
  display: 'block',
})

export function FeaturedProject({ project }: { project: Project }) {
  const link = project.externalUrl || project.liveUrl
  return (
    <Box as="section" borderTop="none" className={css({ pb: '5' })}>
      <Box className={revealCss}>
        <Box
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            color: 'fieldInkMuted',
            mb: '4',
            fontSize: 'sm',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
          })}
        >
          <span>Featured</span>
          <span className={css({ color: 'accentAlt', fontVariantNumeric: 'tabular-nums' })}>
            {project.year}
          </span>
        </Box>
        {link ? (
          <a href={link} className={titleCss}>
            {project.title}
          </a>
        ) : (
          <span className={titleCss}>{project.title}</span>
        )}
        {project.problem && (
          <p
            className={css({
              fontSize: 'base',
              lineHeight: 'normal',
              color: 'fieldInkMuted',
              mt: '3',
              mb: '4',
              maxWidth: '44ch',
            })}
          >
            {project.problem}
          </p>
        )}
        {link && (
          <a
            href={link}
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
