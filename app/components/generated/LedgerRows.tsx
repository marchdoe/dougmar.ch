import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

const blockClass = css({ display: 'flex', flexDirection: 'column', gap: '8px' })

const labelClass = css({
  textStyle: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
  fontWeight: 'bold',
})

const ledeRowClass = css({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '12px',
  paddingBlock: '6px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'borderStrong',
  _last: { borderBottomWidth: '0' },
})

const nmClass = css({ textStyle: 'sm', color: 'fieldInk' })

const smallClass = css({
  display: 'block',
  color: 'fieldInkMuted',
  textStyle: '2xs',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  marginTop: '2px',
})

const figClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'clamp(26px, 2.2vw, 36px)',
  lineHeight: '0.9',
  color: 'fieldInk',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
})

const figBigClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'clamp(30px, 2.6vw, 42px)',
  lineHeight: '0.9',
  color: 'fieldInk',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
})

const subRowClass = css({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '12px',
  paddingBlock: '4px',
})
const subNmClass = css({ textStyle: 'xs', color: 'fieldInkMuted' })
const subFigClass = css({
  textStyle: 'base',
  fontWeight: 'bold',
  color: 'fieldInk',
  fontVariantNumeric: 'tabular-nums',
})

const clusterClass = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12px',
  textStyle: 'xs',
  paddingBlock: '4px',
  color: 'fieldInk',
})
const clusterValClass = css({
  color: 'fieldInkMuted',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'right',
})

export function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={blockClass}>
      <span className={labelClass}>{label}</span>
      {children}
    </div>
  )
}

export function LedeRow({
  name,
  sub,
  fig,
  big,
}: {
  name: string
  sub: ReactNode
  fig: string
  big?: boolean
}) {
  return (
    <div className={ledeRowClass}>
      <span className={nmClass}>
        {name}
        <small className={smallClass}>{sub}</small>
      </span>
      <span className={big ? figBigClass : figClass}>{fig}</span>
    </div>
  )
}

export function SubRow({ name, fig }: { name: string; fig: string }) {
  return (
    <div className={subRowClass}>
      <span className={subNmClass}>{name}</span>
      <span className={subFigClass}>{fig}</span>
    </div>
  )
}

export function ClusterRow({ name, value }: { name: string; value: string }) {
  return (
    <div className={clusterClass}>
      <span>{name}</span>
      <span className={clusterValClass}>{value}</span>
    </div>
  )
}
