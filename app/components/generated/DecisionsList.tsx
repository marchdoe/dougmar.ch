import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Decision = { decision: string; why: string }

export function DecisionsList({ decisions }: { decisions?: Decision[] }) {
  if (!decisions) return null
  return (
    <Box display="flex" flexDirection="column" gap="4">
      {decisions.map((d) => (
        <Box key={d.decision} borderLeft="1px solid" borderColor="border" paddingLeft="3">
          <Box className={css({ textStyle: 'base', fontWeight: '600', color: 'text' })}>
            {d.decision}
          </Box>
          <Box className={css({ textStyle: 'sm', color: 'textMuted', marginTop: '1' })}>
            {d.why}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
