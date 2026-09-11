import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = { project: { stack?: string[]; liveUrl?: string } }

export function CaseStudyStack({ project }: Props) {
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
      {project.stack && (
        <Box className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
          {project.stack.map((s) => (
            <span
              key={s}
              className={css({
                fontFamily: 'display',
                textStyle: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'textFaint',
                bg: 'bgAlt',
                border: '1px solid',
                borderColor: 'border',
                padding: '2 3',
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
          target="_blank"
          rel="noopener"
          className={css({
            fontFamily: 'display',
            textStyle: 'sm',
            fontWeight: 'bold',
            color: 'accentAlt',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2',
            minHeight: '44px',
          })}
        >
          <span>visit live</span> ▸
        </a>
      )}
    </Box>
  )
}
