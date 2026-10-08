import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'

const lbl = css({
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  color: 'textMuted',
  fontWeight: 'bold',
})
const val = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'md',
  letterSpacing: 'tight',
  color: 'text',
})
const meta = css({ fontSize: 'xs', color: 'textFaint' })
// mockup accentDeep #7E2708 has no semantic ink token; nearest is accent
const tick = css({ color: 'accent' })
const td = css({
  paddingBlock: '3px',
  paddingInlineStart: '0',
  paddingInlineEnd: '8px',
  fontSize: 'sm',
  color: 'text',
})
const pos = css({ color: 'textFaint', width: '1%', whiteSpace: 'nowrap' })
const sc = css({ textAlign: 'right', color: 'accent', fontWeight: 'bold' })

function Reading({
  place,
  label,
  children,
}: {
  place: string
  label: string
  children: ReactNode
}) {
  return (
    <div
      className={cx(
        css({
          marginTop: { base: '22px', md: '0' },
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          bg: 'surface',
          borderRadius: 'sm',
          paddingBlock: '14px',
          paddingInline: '16px',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '240ms',
        }),
        place
      )}
    >
      <span className={lbl}>{label}</span>
      {children}
    </div>
  )
}

const board = [
  { pos: '1', name: 'Bridgeman', score: '−8' },
  { pos: 'T2', name: 'Hoshino', score: '−6' },
  { pos: 'T2', name: 'Kanaya', score: '−6' },
]

export function HeroReadings() {
  return (
    <>
      <Reading
        label="Markets · SPY"
        place={css({ gridColumn: { md: '3 / 4' }, gridRow: { md: '1' }, alignSelf: { md: 'end' } })}
      >
        <span className={val}>
          777.22 <span className={tick}>−0.24%</span>
        </span>
        <span className={meta}>Close, prior session</span>
      </Reading>
      <Reading
        label="Weather · Aldie"
        place={css({
          gridColumn: { md: '2 / 3' },
          gridRow: { md: '2' },
          alignSelf: { md: 'center' },
        })}
      >
        <span className={val}>Clear, 55°F</span>
        <span className={meta}>Light NW wind</span>
      </Reading>
      <Reading
        label="Moon"
        place={css({
          gridColumn: { md: '3 / 4' },
          gridRow: { md: '2' },
          alignSelf: { md: 'center' },
        })}
      >
        <span className={val}>Waning crescent</span>
        <span className={meta}>5% illuminated</span>
      </Reading>
      <Reading
        label="Baycurrent Classic · R3"
        place={css({
          gridColumn: { md: '1 / 2' },
          gridRow: { md: '3 / 6' },
          alignSelf: { md: 'end' },
        })}
      >
        <table
          aria-label="Baycurrent Classic leaderboard"
          className={css({ borderCollapse: 'collapse', width: '100%', marginTop: '2px' })}
        >
          <tbody>
            {board.map((r) => (
              <tr key={r.name}>
                <td className={cx(td, pos)}>{r.pos}</td>
                <td className={td}>{r.name}</td>
                <td className={cx(td, sc)}>{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reading>
    </>
  )
}
