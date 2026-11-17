import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function RuledList({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      {children}
    </div>
  )
}
