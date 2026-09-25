import { css, cva } from '../../../styled-system/css'
import { readGolf } from '../../lib/archive-signals'
import type { Signals } from '../api'
import { card, cardHeading, emptyText } from '../styles'

const tournament = css({
  fontSize: '12px',
  fontWeight: 700,
  color: 'devPanel.text',
  marginBottom: '2px',
})
const status = css({ fontSize: '10px', color: 'devPanel.cyan', marginBottom: '8px' })
const leaderRow = css({ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 0' })
const position = cva({
  base: { fontSize: '10px', fontWeight: 700, color: 'devPanel.dim', minWidth: '20px' },
  variants: { podium: { true: { color: 'devPanel.cyan' } } },
})
const name = css({ fontSize: '11px', color: 'devPanel.text', flex: 1 })
const score = css({ fontSize: '11px', color: 'devPanel.green', fontWeight: 700 })

export function GolfCard({ signals }: { signals: Signals }) {
  const golf = readGolf(signals.golf)

  return (
    <div className={card()}>
      <h3 className={cardHeading}>
        <span>// GOLF</span>
      </h3>
      {golf?.tournament ? (
        <>
          <div className={tournament}>{golf.tournament}</div>
          <div className={status}>{golf.status}</div>
          {golf.leaders.map((leader, i) => {
            // Two competitors can share a name (or both fall back to the
            // same placeholder — #676), so the index rules out a duplicate
            // key.
            const rowKey = leader.name + i
            return (
              <div key={rowKey} className={leaderRow}>
                <span className={position({ podium: i < 3 })}>{leader.position ?? i + 1}</span>
                <span className={name}>{leader.name}</span>
                <span className={score}>{leader.score}</span>
              </div>
            )
          })}
          {golf.leaders.length === 0 && <div className={emptyText}>No leaders yet</div>}
        </>
      ) : (
        <div className={emptyText}>No tournament</div>
      )}
    </div>
  )
}
