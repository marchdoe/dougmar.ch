import type { ReactNode } from 'react'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '240px 1fr' },
        gridTemplateAreas: {
          base: `"brand" "nav" "content" "ledger"`,
          lg: `"brand content" "nav content" "spacer content" "ledger content"`,
        },
        gridTemplateRows: { lg: 'auto auto 1fr auto' },
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
      })}
    >
      <Sidebar />
      <Box
        className={css({
          gridArea: 'content',
          bg: 'bg',
          color: 'text',
          minWidth: 0,
          maxWidth: '100%',
          overflowX: 'hidden',
        })}
      >
        {children}
      </Box>
    </Box>
  )
}
