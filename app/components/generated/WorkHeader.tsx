import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function WorkHeader({
  title,
  deck,
  aside,
}: {
  title: string
  deck?: ReactNode
  aside?: ReactNode
}) {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingTop: { base: 'clamp(40px, 8vw, 88px)', lg: 'clamp(56px, 8vw, 112px)' },
        paddingBottom: '7',
        paddingInline: 'clamp(40px, 6vw, 112px)',
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1fr 280px' },
          columnGap: '7',
          rowGap: '6',
          alignItems: 'end',
        })}
      >
        <div className={css({ minWidth: '0' })}>
          <div
            className={css({
              fontSize: '2xs',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'textFaint',
              marginBottom: '3',
            })}
          >
            Case study
          </div>
          <h1
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontSize: { base: '40px', lg: 'clamp(56px, 6vw, 104px)' },
              lineHeight: '0.95',
              letterSpacing: 'tight',
              color: 'accent',
              margin: '0',
            })}
          >
            {title}
          </h1>
          {deck}
        </div>
        {aside}
      </div>
    </section>
  )
}
