import type { ReactNode } from 'react'
import { Box } from '../../styled-system/jsx'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      minHeight="100dvh"
      display="flex"
      flexDirection="column"
      bg="field"
      color="text"
      position="relative"
      overflowX="hidden"
    >
      {/* atmospheric glow — drenched teal field, token-only */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="480px"
        bg="accentAlt"
        opacity={0.08}
        filter="blur(80px)"
        pointerEvents="none"
      />
      <Sidebar />
      <Box flex="1 1 auto" position="relative" zIndex={1} display="flex" flexDirection="column">
        {children}
      </Box>
    </Box>
  )
}
