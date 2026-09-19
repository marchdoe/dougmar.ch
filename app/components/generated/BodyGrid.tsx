import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function BodyGrid({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <main
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: 'minmax(0, 1.6fr) minmax(0, 1fr)' },
        gap: { base: '6', lg: '9' },
        px: { base: '4', lg: '9' },
        py: { base: '8', lg: '9' },
        alignItems: 'start',
      })}
    >
      <div className={css({ minWidth: 0 })}>{left}</div>
      <div className={css({ minWidth: 0 })}>{right}</div>
    </main>
  )
}
