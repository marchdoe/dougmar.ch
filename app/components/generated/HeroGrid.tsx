import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function HeroGrid({ field, rail }: { field: ReactNode; rail: ReactNode }) {
  return (
    <section
      className={css({
        display: 'grid',
        gridTemplateColumns: {
          base: 'minmax(0, 1fr)',
          lg: 'minmax(0, 0.34fr) minmax(0, 0.66fr)',
        },
        minWidth: '0',
      })}
    >
      {field}
      {rail}
    </section>
  )
}
