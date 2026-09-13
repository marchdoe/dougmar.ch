import type { ReactNode } from 'react'
import { Box } from '../../styled-system/jsx'
import { Sidebar } from './Sidebar'
import { Footer } from './generated/Footer'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      minHeight="100dvh"
      bg="bg"
      color="text"
      display="flex"
      flexDirection="column"
      overflowX="hidden"
    >
      <Sidebar />
      <Box as="main" flex="1" display="flex" flexDirection="column">
        {children}
      </Box>
      <Footer />
    </Box>
  )
}
