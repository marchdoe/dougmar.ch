import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Box } from '../../styled-system/jsx'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', lg: 'row' },
        minHeight: '100vh',
        bg: 'bg',
      })}
    >
      <Sidebar />
      <Box className={css({ flex: '1', minWidth: 0 })}>{children}</Box>
    </Box>
  )
}
