import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilitiesGrid() {
  return (
    <Box
      as="section"
      aria-label="Capabilities"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '8', lg: '9' },
        borderBottom: '1px solid',
        borderColor: 'border',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          borderBottom: '1px solid',
          borderColor: 'border',
          paddingBottom: '3',
          marginBottom: '4',
        })}
      >
        capabilities
      </div>
      <Box
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '6px',
        })}
      >
        {capabilities.map((c) => (
          <span
            key={c}
            className={css({
              bg: 'accent',
              color: 'accentText',
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'xs',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              padding: '3',
              display: 'flex',
              alignItems: 'center',
            })}
          >
            {c}
          </span>
        ))}
      </Box>
    </Box>
  )
}
