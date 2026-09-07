import type { ReactNode } from 'react'
import { Box } from '../../styled-system/jsx'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box bg="bg" color="text" fontFamily="body" minHeight="100vh" overflowX="hidden">
      <Sidebar />
      {children}
    </Box>
  )
}
