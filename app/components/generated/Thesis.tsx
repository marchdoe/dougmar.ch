import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { Sidebar } from '../Sidebar'

export function Thesis({ children }: { children: ReactNode }) {
  return (
    <div
      data-folded-shell=""
      className={css({
        position: 'relative',
        overflow: 'hidden',
        minWidth: '0',
        bg: 'field',
        color: 'fieldInk',
        paddingTop: { base: '4', lg: '40px' },
        paddingBottom: { base: '6', lg: '56px' },
        paddingInline: {
          base: '12px',
          sm: 'clamp(20px, 5vw, 72px)',
          lg: 'clamp(40px, 4vw, 80px)',
        },
        minHeight: { lg: '100vh' },
      })}
    >
      <Ground material="rule" seed={2110186558} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: { base: 'block', lg: 'flex' },
          flexDirection: 'column',
          minWidth: '0',
          minHeight: { lg: 'calc(100vh - 96px)' },
        })}
      >
        <Sidebar />
        <div className={css({ marginTop: 'auto', paddingTop: '40px' })}>{children}</div>
      </div>
    </div>
  )
}
