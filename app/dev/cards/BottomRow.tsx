import { css, cx } from '../../../styled-system/css'
import { readBooks, readMusic } from '../../lib/archive-signals'
import type { Signals } from '../api'
import { emptyText } from '../styles'

const row = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginBottom: '24px',
})
const pair = css({ display: 'flex', gap: '10px' })
const halfCard = css({
  background: 'devPanel.card',
  border: '1px solid',
  borderColor: 'devPanel.border',
  borderRadius: '4px',
  padding: '14px',
  flex: 1,
})
const heading = css({
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.12em',
  color: 'devPanel.dim',
  marginBottom: '10px',
  marginTop: 0,
})
const chips = css({ display: 'flex', flexWrap: 'wrap', gap: '5px' })
const chip = css({
  fontSize: '10px',
  background: 'devPanel.blue/12',
  color: 'devPanel.blue',
  padding: '3px 8px',
  borderRadius: '10px',
})
const book = css({ fontSize: '11px', color: 'devPanel.text', padding: '2px 0' })
const italic = css({ fontStyle: 'italic' })
const reserved = css({
  border: '1px dashed',
  borderColor: 'devPanel.border',
  borderRadius: '4px',
  padding: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
const reservedText = css({ fontSize: '10px', color: 'devPanel.ghost', fontStyle: 'italic' })

/** Zone 5: music and books, and a slot held for signals not yet added. */
export function BottomRow({ signals }: { signals: Signals }) {
  const bands = readMusic(signals.music)?.bands ?? []
  const reading = readBooks(signals.books)?.currently_reading ?? []

  return (
    <div className={row}>
      <div className={pair}>
        <div className={halfCard}>
          <h3 className={heading}>// MUSIC</h3>
          <div className={chips}>
            {bands.map((band) => (
              <span key={band} className={chip}>
                {band}
              </span>
            ))}
            {bands.length === 0 && <span className={emptyText}>No bands</span>}
          </div>
        </div>

        <div className={halfCard}>
          <h3 className={heading}>// BOOKS</h3>
          {reading.length > 0 ? (
            reading.map((title) => (
              <div key={title} className={book}>
                {title}
              </div>
            ))
          ) : (
            <div className={cx(emptyText, italic)}>nothing currently</div>
          )}
        </div>
      </div>

      <div className={reserved}>
        <span className={reservedText}>+ add signals</span>
      </div>
    </div>
  )
}
