import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = { project: { process?: { phase: string; does: string; produces: string }[] } }

export function CaseStudyProcess({ project }: Props) {
  if (!project.process || project.process.length === 0) return null
  return (
    <Box
      as="section"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '7', lg: '8' },
        borderBottom: '1px solid',
        borderColor: 'border',
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
        })}
      >
        process
      </span>
      <ol
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          marginTop: '4',
          paddingLeft: '0',
          listStyle: 'none',
          counterReset: 'phase',
        })}
      >
        {project.process.map((step, i) => (
          <li
            key={step.phase}
            className={css({
              display: 'grid',
              gap: '1',
              borderTop: '1px solid',
              borderColor: 'border',
              paddingTop: '3',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                textStyle: 'sm',
                color: 'text',
              })}
            >
              {String(i + 1).padStart(2, '0')} · {step.phase}
            </span>
            <span className={css({ fontFamily: 'body', textStyle: 'sm', color: 'textMuted' })}>
              {step.does}
            </span>
            <span
              className={css({
                fontFamily: 'display',
                textStyle: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'accentAlt',
              })}
            >
              produces: {step.produces}
            </span>
          </li>
        ))}
      </ol>
    </Box>
  )
}
