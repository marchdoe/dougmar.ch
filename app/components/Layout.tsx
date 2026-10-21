import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { SpecimenTail } from './generated/SpecimenTail'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: { base: 'flex', md: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { md: 'repeat(12, minmax(0, 1fr))' },
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        '&:not(:has([data-beside-margin])) > [data-shell-margin]': {
          gridColumn: { md: '1 / -1' },
        },
      })}
    >
      <Sidebar />
      <div
        className={css({
          display: { base: 'block', md: 'contents' },
          '& > *': { minWidth: '0' },
          '& > *:not([data-beside-margin])': { gridColumn: { md: '1 / -1' } },
        })}
      >
        {children}
      </div>
      <SpecimenTail />
    </div>
  )
}
