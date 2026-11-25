import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

type Props = { children: ReactNode; labelledBy: string; tall?: boolean }

export function FloodHero({ children, labelledBy, tall }: Props) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        order: { base: -1, lg: 0 },
        marginBottom: { base: '4px', lg: '0' },
      })}
    >
      <Ground material="grain" seed={1550498522} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          minHeight: tall ? '56vh' : '0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          rowGap: '2',
          paddingTop: '22px',
          paddingBottom: '26px',
          paddingInline: 'clamp(18px, 4vw, 40px)',
        })}
      >
        {children}
      </div>
    </section>
  )
}
