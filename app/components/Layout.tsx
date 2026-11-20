import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { Colophon } from './generated/Colophon'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: { base: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { lg: '96px 1fr' },
        minHeight: '100vh',
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        lineHeight: 'normal',
        overflowX: 'hidden',
      })}
    >
      <Sidebar />
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          minWidth: '0',
          minHeight: { lg: '100vh' },
        })}
      >
        <div
          className={css({ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '0' })}
        >
          {children}
        </div>
        <Colophon />
      </div>
    </div>
  )
}
