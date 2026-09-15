import { css } from '../../../styled-system/css'
import { Box, Wrap } from '../../../styled-system/jsx'

export function CapabilityTags({ capabilities }: { capabilities: string[] }) {
  return (
    <Box
      as="section"
      borderTop="1px solid"
      borderColor="fieldBorder"
      className={css({ pt: '5', pb: '5' })}
    >
      <Box
        className={css({
          color: 'fieldInkMuted',
          mb: '4',
          fontSize: 'sm',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
        })}
      >
        Capabilities
      </Box>
      <Wrap gap="3">
        {capabilities.map((c) => (
          <span
            key={c}
            className={css({
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontSize: 'base',
              color: 'fieldInk',
              border: '1px solid',
              borderColor: 'fieldBorder',
              borderRadius: 'full',
              px: '4',
              py: '2',
            })}
          >
            {c}
          </span>
        ))}
      </Wrap>
    </Box>
  )
}
