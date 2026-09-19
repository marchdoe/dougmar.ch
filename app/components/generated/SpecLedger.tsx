import { css } from '../../../styled-system/css'

type Props = { role?: string; year: number; type: string; stack?: string[]; liveUrl?: string }

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2',
        borderTop: '1px solid',
        borderColor: 'fieldBorder',
        pt: '2',
        minWidth: 0,
      })}
    >
      <span
        className={css({
          textStyle: 'sm',
          color: 'fieldInkMuted',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          flexShrink: 0,
        })}
      >
        {label}
      </span>
      <span
        className={css({
          textStyle: 'sm',
          color: 'fieldInk',
          fontWeight: 'bold',
          textAlign: 'right',
          minWidth: 0,
          overflowWrap: 'anywhere',
        })}
      >
        {value}
      </span>
    </div>
  )
}

export function SpecLedger({ role, year, type, stack, liveUrl }: Props) {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '3', minWidth: 0 })}>
      <Row label="Role" value={role} />
      <Row label="Year" value={String(year)} />
      <Row label="Type" value={type} />
      {stack && stack.length > 0 && <Row label="Stack" value={stack.join(', ')} />}
      {liveUrl && (
        <div className={css({ pt: '3', borderTop: '1px solid', borderColor: 'fieldBorder' })}>
          <a
            href={liveUrl}
            className={css({
              color: 'accentAlt',
              fontWeight: 'bold',
              textStyle: 'sm',
              letterSpacing: 'wide',
            })}
          >
            Visit the live site →
          </a>
        </div>
      )}
    </div>
  )
}
