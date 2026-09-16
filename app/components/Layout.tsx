import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Box } from '../../styled-system/jsx'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box bg="bg" color="text" minH="100vh">
      {children}
      <Sidebar />
    </Box>
  )
}
