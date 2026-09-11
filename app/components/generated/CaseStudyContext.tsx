import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = { project: { context?: string; constraints?: string[] } }

export function CaseStudyContext({ project }: Props) {
  return (
    <Box
      as="section"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '7', lg: '8' },
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
        borderBottom: '1px solid',
        borderColor: 'border',
      })}
    >
      {project.context && (
        <Box>
          <span
            className={css({
              fontFamily: 'display',
              textStyle: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            context
          </span>
          <p
            className={css({
              fontFamily: 'body',
              textStyle: 'md',
              color: 'textMuted',
              maxWidth: '66ch',
              marginTop: '2',
            })}
          >
            {project.context}
          </p>
        </Box>
      )}
      {project.constraints && (
        <Box>
          <span
            className={css({
              fontFamily: 'display',
              textStyle: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            constraints
          </span>
          <ul
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2',
              marginTop: '2',
              paddingLeft: '0',
              listStyle: 'none',
            })}
          >
            {project.constraints.map((c) => (
              <li
                key={c}
                className={css({
                  fontFamily: 'body',
                  textStyle: 'sm',
                  color: 'textMuted',
                  bg: 'bgAlt',
                  border: '1px solid',
                  borderColor: 'border',
                  padding: '2 3',
                })}
              >
                {c}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  )
}
