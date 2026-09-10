import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = { problem?: string; approach?: string; outcome?: string }

export function ProjectNarrative({ problem, approach, outcome }: Props) {
  const sections = [
    { label: 'Problem', body: problem },
    { label: 'Approach', body: approach },
    { label: 'Outcome', body: outcome },
  ].filter((section) => section.body)

  return (
    <Box className={css({ display: 'flex', flexDirection: 'column', gap: '9' })}>
      {sections.map((section) => (
        <Box key={section.label}>
          <p
            className={css({
              textStyle: '2xs',
              fontWeight: '700',
              fontVariant: 'small-caps',
              letterSpacing: 'widest',
              color: 'textMuted',
              marginBottom: '3',
            })}
          >
            {section.label}
          </p>
          <p
            className={css({
              textStyle: 'lg',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '64ch',
            })}
          >
            {section.body}
          </p>
        </Box>
      ))}
    </Box>
  )
}
