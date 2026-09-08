import { Box } from '../../../styled-system/jsx'
import type { TimelineEntry } from '../../content/timeline'

export function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  return (
    <Box
      as="section"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '30px', md: '52px' }}
      bg="field"
      color="fieldInk"
    >
      <Box
        as="h2"
        fontFamily="display"
        fontWeight="700"
        textStyle="2xl"
        mb={{ base: '20px', md: '30px' }}
      >
        Timeline
      </Box>
      <Box display="flex" flexDirection="column" alignItems="stretch" gap="0">
        {entries.map((entry) => (
          <Box
            key={`${entry.year}-${entry.company}`}
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: 'minmax(120px, 120px) 1fr' }}
            gap={{ base: '6px', md: '26px' }}
            py={{ base: '14px', md: '20px' }}
            borderTop="1px solid"
            borderColor="fieldBorder"
            alignItems="baseline"
          >
            <Box
              as="span"
              textStyle="sm"
              fontVariantNumeric="tabular-nums"
              color="accentAlt"
              fontWeight="700"
            >
              {entry.year}
            </Box>
            <Box display="flex" flexDirection="column" gap="6px" minW="0">
              <Box
                as="span"
                fontFamily="display"
                fontWeight="700"
                textStyle="lg"
                color="fieldInk"
                overflowWrap="break-word"
              >
                {entry.role} · {entry.company}
              </Box>
              <Box as="p" textStyle="base" color="fieldInkMuted" maxW="62ch">
                {entry.description}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
