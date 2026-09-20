import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { type RecordField, absenceNote } from '../../lib/archive-era'
import { absent } from './styles'

const section = css({ minWidth: 0 })

const stepLabel = css({
  fontSize: 'archive.micro',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'archive.faint',
  marginBottom: '10px',
})

const stepTitle = css({
  fontFamily: 'archive.sans',
  fontSize: 'archive.lead',
  fontWeight: 'normal',
  marginBottom: '18px',
  color: 'archive.text',
})

export function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className={section}>
      <p className={stepLabel}>{n}</p>
      <h2 className={stepTitle}>{title}</h2>
      {children}
    </section>
  )
}

export function Absent({
  field,
  era,
  noun,
}: {
  field: RecordField
  era: string | null
  noun: string
}) {
  return <p className={absent}>{absenceNote(field, era, noun)}</p>
}
