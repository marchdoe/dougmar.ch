import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

type Props = { label: string; title: string; meta?: string; children: ReactNode }

const railClass = css({
  bg: 'field',
  color: 'fieldInk',
  paddingTop: '28px',
  paddingBottom: '34px',
  paddingInline: 'clamp(20px, 3vw, 34px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '22px',
  minHeight: { lg: '92vh' },
  minWidth: '0',
})

const headClass = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: '12px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
  paddingBottom: '12px',
})

const titleClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  textStyle: 'md',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'fieldInk',
})

const metaClass = css({
  textStyle: '2xs',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
})

export function Rail({ label, title, meta, children }: Props) {
  return (
    <aside aria-label={label} className={railClass}>
      <div className={headClass}>
        <h2 className={titleClass}>{title}</h2>
        {meta ? <span className={metaClass}>{meta}</span> : null}
      </div>
      {children}
    </aside>
  )
}
