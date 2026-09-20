import { css } from '../../../styled-system/css'
import type { ColorRead } from '../../lib/archive-explainer'
import type { ArchiveDetail } from '../../types/archive-record'
import { absent } from './styles'

const rail = css({
  position: { base: 'static', lg: 'sticky' },
  top: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  fontSize: 'archive.label',
})

const railRow = css({ display: 'flex', flexDirection: 'column', gap: '4px' })

const railKey = css({
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'archive.faint',
})

const railValue = css({ color: 'archive.text', fontSize: 'archive.small', wordBreak: 'break-word' })

const openDesign = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  minHeight: '44px',
  textAlign: 'center',
  border: '1px solid',
  borderColor: 'archive.line',
  color: 'archive.text',
  textDecoration: 'none',
  padding: '11px 12px',
  fontSize: 'archive.label',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  transition: 'background 0.15s ease, color 0.15s ease',
  _hover: { background: 'archive.text', color: 'archive.bg' },
})

function RailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className={railRow}>
      <span className={railKey}>{label}</span>
      <span className={railValue}>{value}</span>
    </div>
  )
}

export function HowRail({
  date,
  detail,
  color,
  hasDesign,
}: {
  date: string
  detail: ArchiveDetail
  color: ColorRead
  hasDesign: boolean
}) {
  return (
    <aside className={rail}>
      {hasDesign ? (
        <a href={`/archive/${date}/`} className={openDesign}>
          Open the design
        </a>
      ) : (
        <p className={absent}>
          The record for this day survived; the pages did not. There is no design to open.
        </p>
      )}

      <RailRow label="Era" value={detail.era} />
      <RailRow label="Chassis" value={detail.chassis} />
      <RailRow label="Archetype" value={detail.legacyArchetype} />
      <RailRow label="Mood" value={color.mood} />
      <RailRow label="Color" value={color.name} />
      <RailRow label="Build" value={detail.buildId} />
      <RailRow label="Attempts" value={detail.attempts ? String(detail.attempts) : null} />
    </aside>
  )
}
