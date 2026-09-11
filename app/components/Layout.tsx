import type { ReactNode } from 'react'
import { Box } from '../../styled-system/jsx'
import { Sidebar } from './Sidebar'
import { BuildLogFoot } from './generated/BuildLogFoot'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      minHeight="100dvh"
      display="flex"
      flexDirection="column"
      bg="bg"
      color="text"
      fontFamily="body"
      overflowX="hidden"
    >
      <Sidebar />
      <Box as="main" display="flex" flexDirection="column">
        {children}
      </Box>
      <BuildLogFoot />
    </Box>
  )
}
