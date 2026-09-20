import { asRecord } from '../../lib/archive-explainer'
import type { ArchiveDetail } from '../../types/archive-record'
import { Absent, Step } from './Step'
import { defKey, defList, defRow, defValue } from './styles'

function DefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={defRow}>
      <span className={defKey}>{label}</span>
      <span className={defValue}>{value}</span>
    </div>
  )
}

function DefRows({ block }: { block: Record<string, unknown> | null }) {
  if (!block) return null
  return Object.entries(block).map(([k, v]) => (
    <DefRow key={k} label={k.replace(/_/g, ' ')} value={String(v)} />
  ))
}

export function CompositionStep({ detail }: { detail: ArchiveDetail }) {
  const composition = asRecord(detail.composition)
  const lane = asRecord(detail.lane)
  const shell = asRecord(detail.shell)
  return (
    <Step n="05" title="A composition was decided">
      {!composition && !lane && !shell ? (
        <Absent field="composition" era={detail.era} noun="composition grammar" />
      ) : (
        <div className={defList}>
          <DefRows block={composition} />
          {lane?.name ? <DefRow label="Lane" value={String(lane.name)} /> : null}
          <DefRows block={shell} />
        </div>
      )}
    </Step>
  )
}
