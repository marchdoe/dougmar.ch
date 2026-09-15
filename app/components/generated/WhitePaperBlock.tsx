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

const label = css({
  color: 'fieldInkMuted',
  mb: '2',
  fontSize: 'sm',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
})
const block = css({ mb: '6' })

export function WhitePaperBlock({ project }: { project: Project }) {
  const hasAny = Boolean(
    project.context ||
      project.constraints?.length ||
      project.process?.length ||
      project.decisions?.length ||
      project.references?.length
  )
  if (!hasAny) return null
  return (
    <Box
      as="section"
      borderTop="1px solid"
      borderColor="fieldBorder"
      className={css({ pt: '5', pb: '5' })}
    >
      <Box className={revealCss}>
        {project.context && (
          <Box className={block}>
            <Box className={label}>Context</Box>
            <p
              className={css({ fontSize: 'base', color: 'fieldInk', margin: 0, maxWidth: '60ch' })}
            >
              {project.context}
            </p>
          </Box>
        )}
        {project.constraints && project.constraints.length > 0 && (
          <Box className={block}>
            <Box className={label}>Constraints</Box>
            <Box
              as="ul"
              className={css({ margin: 0, pl: '5', color: 'fieldInkMuted', fontSize: 'base' })}
            >
              {project.constraints.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </Box>
          </Box>
        )}
        {project.process && project.process.length > 0 && (
          <Box className={block}>
            <Box className={label}>Process</Box>
            <Box
              as="ol"
              className={css({
                margin: 0,
                pl: '5',
                color: 'fieldInkMuted',
                fontSize: 'base',
                display: 'flex',
                flexDirection: 'column',
                gap: '3',
              })}
            >
              {project.process.map((p) => (
                <li key={p.phase}>
                  <span className={css({ fontWeight: 'bold', color: 'fieldInk' })}>{p.phase}</span>:{' '}
                  {p.does}
                  <span className={css({ display: 'block', color: 'accentAlt', fontSize: 'sm' })}>
                    {p.produces}
                  </span>
                </li>
              ))}
            </Box>
          </Box>
        )}
        {project.decisions && project.decisions.length > 0 && (
          <Box className={block}>
            <Box className={label}>Decisions</Box>
            <Box className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
              {project.decisions.map((d) => (
                <Box key={d.decision}>
                  <Box className={css({ fontWeight: 'bold', color: 'fieldInk', fontSize: 'base' })}>
                    {d.decision}
                  </Box>
                  <Box className={css({ color: 'fieldInkMuted', fontSize: 'sm' })}>{d.why}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {project.references && project.references.length > 0 && (
          <Box>
            <Box className={label}>References</Box>
            <Box
              as="ul"
              className={css({ margin: 0, pl: '5', color: 'fieldInkMuted', fontSize: 'base' })}
            >
              {project.references.map((r) => (
                <li key={r.url}>
                  <a href={r.url} className={css({ color: 'accentAlt' })}>
                    {r.title}
                  </a>
                  {r.note && <span> &middot; {r.note}</span>}
                </li>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
