import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function Column({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        paddingTop: '40px',
        paddingInline: '24px',
        md: { paddingTop: '56px', paddingInline: '6vw' },
      })}
    >
      {children}
    </div>
  )
}
