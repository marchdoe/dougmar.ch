import type { ReactNode } from 'react'
import { Box } from '../../styled-system/jsx'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box bg="bg" color="text" minH="100vh" display="flex" flexDirection="column">
      <Box flex="1" display="flex" flexDirection="column">
        {children}
      </Box>
      <Sidebar />
    </Box>
  )
}
