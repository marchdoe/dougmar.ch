import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function SplitPage({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: { base: 'block', lg: 'grid' },
        gridTemplateColumns: { lg: '1.62fr 1fr' },
        gridTemplateAreas: { lg: '"board sheet" "index index"' },
        alignItems: { lg: 'stretch' },
      })}
    >
      {children}
    </div>
  )
}
