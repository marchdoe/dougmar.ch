import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type NarrativeProject = {
  problem?: string
  approach?: string
  outcome?: string
}

const fields: { key: keyof NarrativeProject; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'approach', label: 'Approach' },
  { key: 'outcome', label: 'Outcome' },
]

export function CaseStudyNarrative({ project }: { project: NarrativeProject }) {
  return (
    <Box display="flex" flexDirection="column" gap="5">
      {fields.map(({ key, label }) => {
        const value = project[key]
        if (!value) return null
        return (
          <Box key={key}>
            <Box
              className={css({
                textStyle: 'xs',
                fontVariantCaps: 'all-small-caps',
                letterSpacing: 'wide',
                color: 'textFaint',
                marginBottom: '1',
              })}
            >
              {label}
            </Box>
            <Box className={css({ textStyle: 'lg', color: 'text', maxWidth: '60ch' })}>{value}</Box>
          </Box>
        )
      })}
    </Box>
  )
}
