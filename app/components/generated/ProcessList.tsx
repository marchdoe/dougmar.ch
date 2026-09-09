import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type ProcessStep = { phase: string; does: string; produces: string }

export function ProcessList({ process }: { process?: ProcessStep[] }) {
  if (!process) return null
  return (
    <Box
      as="ol"
      display="flex"
      flexDirection="column"
      gap="4"
      margin={0}
      paddingLeft="0px"
      className={css({ listStyle: 'none' })}
    >
      {process.map((step, i) => (
        <Box as="li" key={step.phase} display="flex" gap="3">
          <Box className={css({ textStyle: 'sm', color: 'textFaint', minWidth: '32px' })}>
            {i + 1}.
          </Box>
          <Box>
            <Box className={css({ textStyle: 'base', fontWeight: '600', color: 'text' })}>
              {step.phase}
            </Box>
            <Box className={css({ textStyle: 'sm', color: 'textMuted' })}>{step.does}</Box>
            <Box className={css({ textStyle: 'sm', color: 'accentAlt', marginTop: '1' })}>
              → {step.produces}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
