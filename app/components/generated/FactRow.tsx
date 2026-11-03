import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

const valueClass = {
  big: css({
    fontSize: '30px',
    fontWeight: 'bold',
    fontVariantNumeric: 'tabular-nums',
    color: 'fieldInk',
    textAlign: 'right',
    minWidth: '0',
  }),
  base: css({
    fontSize: '20px',
    fontWeight: 'bold',
    fontVariantNumeric: 'tabular-nums',
    color: 'fieldInk',
    textAlign: 'right',
    minWidth: '0',
  }),
  quiet: css({
    fontSize: '16px',
    fontWeight: '600',
    color: 'fieldInk',
    textAlign: 'right',
    minWidth: '0',
    maxWidth: '44ch',
  }),
}

type FactRowProps = {
  label: string
  value: string | number
  note?: string
  size?: keyof typeof valueClass
}

export function FactGrid({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        display: { base: 'flex', md: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { md: '1fr 1fr', lg: 'repeat(3, 1fr)' },
        columnGap: { md: '48px', lg: '56px' },
        borderBottomWidth: { base: '1px', md: '0' },
        borderBottomStyle: 'solid',
        borderBottomColor: 'fieldBorder',
      })}
    >
      {children}
    </div>
  )
}

export function FactRow({ label, value, note, size = 'base' }: FactRowProps) {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '16px',
        paddingBlock: '13px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        _first: { borderTopWidth: { base: '0', md: '1px' } },
      })}
    >
      <span
        className={css({
          fontSize: '12px',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          fontWeight: '600',
          color: { base: 'fieldInkMuted', _dark: 'fieldInk' },
        })}
      >
        {label}
      </span>
      <span className={valueClass[size]}>
        {value}
        {note && (
          <small className={css({ fontSize: '13px', fontWeight: '600', marginLeft: '6px' })}>
            {note}
          </small>
        )}
      </span>
    </div>
  )
}
