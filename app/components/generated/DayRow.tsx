import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { Label, track } from './LedgerParts'

const row = css({
  gridTemplateAreas: { base: '"label" "value" "meta"', md: '"value label" "value meta"' },
  gridTemplateRows: { md: 'auto 1fr' },
  paddingTop: '20px',
  paddingBottom: { base: '14px', md: '18px' },
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  '&:first-child': { borderTopWidth: '0px' },
})

const labelCell = css({
  gridArea: 'label',
  marginBottom: { base: '6px', md: '4px' },
  paddingTop: { md: '6px' },
})

const valueCell = css({
  gridArea: 'value',
  fontFamily: 'display',
  fontWeight: 'bold',
  textStyle: 'lg',
  lineHeight: '1.25',
  color: 'text',
  fontVariantNumeric: 'tabular-nums',
  minWidth: 0,
})

const metaCell = css({
  gridArea: 'meta',
  marginTop: { base: '4px', md: '0px' },
  textStyle: 'sm',
  lineHeight: '1.5',
  color: 'textMuted',
  maxWidth: '40ch',
})

type DayRowProps = { label: string; meta?: string; children: ReactNode }

export function DayRow({ label, meta, children }: DayRowProps) {
  return (
    <div className={`${track} ${row}`}>
      <div className={labelCell}>
        <Label>{label}</Label>
      </div>
      <div className={valueCell}>{children}</div>
      {meta ? <p className={metaCell}>{meta}</p> : null}
    </div>
  )
}
