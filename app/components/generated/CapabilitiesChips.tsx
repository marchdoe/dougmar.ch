import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

export function CapabilitiesChips({ capabilities }: { capabilities: string[] }) {
  return (
    <Box className={css({ display: 'flex', flexWrap: 'wrap', gap: '3', marginTop: '6' })}>
      {capabilities.map((cap) => (
        <span
          key={cap}
          className={css({
            border: '1px solid',
            borderColor: 'border',
            paddingX: '4',
            paddingY: '2',
            textStyle: '2xs',
            fontWeight: '700',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            color: 'text',
          })}
        >
          {cap}
        </span>
      ))}
    </Box>
  )
}
