import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

export function Band({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <section
      aria-label="The claim"
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(30px, 6vw, 60px)',
        paddingBottom: 'clamp(32px, 6vw, 62px)',
        borderTopWidth: '3px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        lg: {
          paddingTop: 'clamp(44px, 4vw, 68px)',
          paddingBottom: 'clamp(44px, 4vw, 68px)',
        },
      })}
    >
      <Ground material="halftone" seed={1925632749} />
      <div className={css({ position: 'relative', zIndex: 1, textAlign: 'justify' })}>
        {label}
        {children}
      </div>
    </section>
  )
}
