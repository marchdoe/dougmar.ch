import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

type Props = { label: string; sub: string; tall?: boolean; gold?: boolean; children: ReactNode }

export function LedgerCell({ label, sub, tall = false, gold = false, children }: Props) {
  return (
    <div
      data-tall={tall}
      data-gold={gold}
      className={css({
        bg: 'surface',
        color: 'text',
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 'md',
        paddingTop: '18px',
        paddingInline: '18px',
        paddingBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '6px',
        minHeight: '140px',
        minWidth: '0',
        transition: 'border-color 140ms ease',
        _hover: { borderColor: 'borderStrong' },
        '&[data-tall=true]': { minHeight: '200px', gridRow: { md: 'span 2' } },
        '&[data-gold=true]': { bg: 'field', borderColor: 'fieldBorder', color: 'fieldInk' },
        '&[data-gold=true] [data-part=label], &[data-gold=true] [data-part=sub]': {
          color: 'fieldInkMuted',
        },
      })}
    >
      <span
        data-part="label"
        className={css({
          fontSize: 'xs',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'textFaint',
        })}
      >
        {label}
      </span>
      <div
        data-part="val"
        className={css({
          fontFamily: 'display',
          fontSize: { base: '56px', lg: '48px', xl: '64px' },
          lineHeight: '0.95',
          fontVariantNumeric: 'tabular-nums',
          minWidth: '0',
        })}
      >
        {children}
      </div>
      <span data-part="sub" className={css({ fontSize: 'sm', color: 'textMuted' })}>
        {sub}
      </span>
    </div>
  )
}
