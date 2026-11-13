import { css, cx } from '../../../styled-system/css'
import { label, tile } from './styles'

const STATS = [
  { label: 'Market · SPY', stat: '757.12', delta: '−0.35% on the day' },
  { label: 'Weather · Aldie, VA', stat: '43°F', delta: 'Cloudy · feels 36°' },
  { label: 'Moon', stat: '20%', delta: 'Waxing crescent' },
]
const ROTATION = ['Tobin Sprout', 'Guided by Voices', 'The War on Drugs']

const surfaceTile = cx(tile, css({ bg: 'surface' }))
const mutedLabel = cx(label, css({ color: 'textMuted' }))

export function StatTiles() {
  return (
    <>
      {STATS.map((s) => (
        <div key={s.label} className={surfaceTile}>
          <span className={mutedLabel}>{s.label}</span>
          <div>
            <div
              className={css({
                fontFamily: 'display',
                fontWeight: 'normal',
                fontSize: 'clamp(26px, 4.4vw, 38px)',
                lineHeight: '0.95',
                color: 'text',
              })}
            >
              {s.stat}
            </div>
            <div className={css({ fontSize: '15px', color: 'textMuted', marginTop: '2' })}>
              {s.delta}
            </div>
          </div>
        </div>
      ))}
      <div className={surfaceTile}>
        <span className={mutedLabel}>In rotation</span>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            fontSize: 'base',
            lineHeight: '1.4',
            color: 'text',
          })}
        >
          {ROTATION.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
      <div
        className={css({
          gridColumn: '1 / -1',
          bg: 'surface',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          rowGap: '10px',
          columnGap: '18px',
          paddingBlock: '20px',
          paddingInline: '22px',
        })}
      >
        <span
          className={css({
            fontFamily: 'body',
            fontStyle: 'italic',
            fontSize: 'base',
            color: 'text',
          })}
        >
          “When angry, count to one hundred.”
        </span>
        <span className={cx(label, css({ color: 'textFaint' }))}>Thomas Jefferson</span>
      </div>
    </>
  )
}
