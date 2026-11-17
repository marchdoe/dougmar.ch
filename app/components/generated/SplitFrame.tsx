import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

type Props = { thesis: ReactNode; children: ReactNode }

export function SplitFrame({ thesis, children }: Props) {
  return (
    <section
      className={css({
        display: 'flex',
        flexDirection: 'column',
        lg: {
          display: 'grid',
          gridTemplateColumns: 'minmax(360px, 0.72fr) 1.4fr',
          alignItems: 'start',
        },
      })}
    >
      <div
        className={css({
          bg: 'field',
          color: 'fieldInk',
          padding: 'clamp(28px, 6vw, 72px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(24px, 5vw, 44px)',
          minHeight: '92vh',
          position: 'relative',
          minWidth: '0',
          lg: {
            position: 'sticky',
            top: '0',
            alignSelf: 'start',
            minHeight: '100vh',
            justifyContent: 'flex-start',
          },
        })}
      >
        {thesis}
      </div>
      <div
        className={css({
          bg: 'bgAlt',
          color: 'text',
          paddingTop: 'clamp(24px, 5vw, 56px)',
          paddingInline: 'clamp(20px, 5vw, 72px)',
          paddingBottom: '0',
          minWidth: '0',
          lg: { minHeight: '100vh' },
        })}
      >
        {children}
      </div>
    </section>
  )
}
