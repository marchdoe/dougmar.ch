import type { ReactNode } from 'react'
import { Box } from '../../../styled-system/jsx'

export function EvidenceRow({ k, children }: { k: string; children: ReactNode }) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', md: 'minmax(96px, 120px) 1fr' }}
      gap={{ base: '6px', md: '26px' }}
      py={{ base: '14px', md: '20px' }}
      borderTop="1px solid"
      borderColor="fieldBorder"
      alignItems="baseline"
    >
      <Box
        as="span"
        textStyle="sm"
        textTransform="uppercase"
        letterSpacing="wide"
        color="accentAlt"
        fontWeight="700"
      >
        {k}
      </Box>
      <Box as="div" color="textMuted" textStyle="base" maxW="52ch" minW="0">
        {children}
      </Box>
    </Box>
  )
}
