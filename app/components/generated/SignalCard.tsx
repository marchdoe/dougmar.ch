import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'

type Props = { label: string; flood?: boolean; className?: string; children: ReactNode }

export function SignalCard({ label, flood = false, className, children }: Props) {
  return (
    <div
      className={cx(
        css({
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: flood ? 'borderStrong' : 'border',
          borderRadius: 'sm',
          padding: '20px',
          bg: flood ? 'field' : 'bg',
          color: flood ? 'fieldInk' : 'text',
        }),
        className
      )}
    >
      <div
        className={css({
          fontSize: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: flood ? 'fieldInkMuted' : 'textFaint',
          fontWeight: 'bold',
          marginBottom: '14px',
        })}
      >
        {label}
      </div>
      {children}
    </div>
  )
}
