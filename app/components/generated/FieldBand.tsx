import type { ReactNode } from 'react'
import { Box } from '../../../styled-system/jsx'

export function FieldBand({ children }: { children: ReactNode }) {
  return (
    <Box
      as="section"
      bg="field"
      color="fieldInk"
      position="relative"
      paddingInline="clamp(24px, 8vw, 160px)"
      paddingTop="clamp(72px, 12vh, 150px)"
      paddingBottom="clamp(64px, 11vh, 130px)"
      minHeight={{ base: 'auto', lg: '62vh' }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {children}
    </Box>
  )
}
