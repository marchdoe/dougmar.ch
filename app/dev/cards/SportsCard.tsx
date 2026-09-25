import { css, cva } from '../../../styled-system/css'
import { readSports } from '../../lib/archive-signals'
import type { Signals } from '../api'
import { card, cardHeading, cardHeadingMeta, dot, emptyText } from '../styles'

const teamRow = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 6px',
    borderRadius: '3px',
    background: 'transparent',
    marginBottom: '2px',
  },
  variants: { active: { true: { background: 'devPanel.green/6' } } },
})

const teamName = cva({
  base: { fontSize: '11px', fontWeight: 400, color: 'devPanel.muted', flex: 1 },
  variants: { active: { true: { fontWeight: 700, color: 'devPanel.text' } } },
})

const resultBadge = cva({
  base: { fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '3px' },
  variants: {
    win: {
      true: { background: 'devPanel.green', color: 'devPanel.bg' },
      false: { background: 'devPanel.red', color: 'devPanel.white' },
    },
  },
})

const score = css({ fontSize: '11px', color: 'devPanel.green', fontWeight: 700 })
const offSeason = css({ fontSize: '10px', fontStyle: 'italic', color: 'devPanel.muted' })

export function SportsCard({ signals }: { signals: Signals }) {
  const teams = readSports(signals.sports)?.teams ?? []

  return (
    <div className={card()}>
      <h3 className={cardHeading}>
        <span>// SPORTS</span>
        <span className={cardHeadingMeta}>{teams.length} teams</span>
      </h3>
      {teams.map((team, i) => {
        const isActive = team.result !== 'off season'
        const result = team.result?.toLowerCase()
        const isWin = result === 'w' || result === 'win'
        // Real feeds can report the same team name twice in a day (e.g. a
        // doubleheader), so the index rules out a duplicate key.
        const rowKey = team.name + i
        return (
          <div key={rowKey} className={teamRow({ active: isActive })}>
            <span className={dot({ size: 'sm', tone: isActive ? 'green' : 'ghost' })} />
            <span className={teamName({ active: isActive })}>{team.name}</span>
            {isActive ? (
              <>
                {team.result && <span className={resultBadge({ win: isWin })}>{team.result}</span>}
                {team.score && <span className={score}>{team.score}</span>}
              </>
            ) : (
              <span className={offSeason}>off season</span>
            )}
          </div>
        )
      })}
      {teams.length === 0 && <div className={emptyText}>No teams</div>}
    </div>
  )
}
