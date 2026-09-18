import { css } from '../../../styled-system/css'

const rows = [
  { pos: 'T1', name: 'Greyserman', par: '-7', thru: '14' },
  { pos: 'T1', name: 'Cole', par: '-7', thru: '13' },
  { pos: 'T3', name: 'Kohles', par: '-6', thru: '16' },
  { pos: 'T3', name: 'Kirk', par: '-6', thru: 'F' },
  { pos: 'T3', name: 'Hughes', par: '-6', thru: '15' },
]

export function LeaderboardPanel() {
  return (
    <section
      className={css({
        bg: 'bg',
        color: 'text',
        minWidth: 0,
        padding: { base: '5', md: '7' },
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
      })}
    >
      <div>
        <span
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2',
            fontFamily: 'body',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            fontSize: '2xs',
            color: 'accent',
          })}
        >
          <span
            className={css({ width: '9px', height: '9px', borderRadius: 'full', bg: 'accent' })}
          />
          Live &middot; The Proof
        </span>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '2xl',
            marginTop: '2',
          })}
        >
          Biltmore Championship
        </h2>
        <p className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '1' })}>
          Round 3 in progress, two leaders tied at seven under, read by 15th Club.
        </p>
      </div>
      <div className={css({ borderTop: '1px solid', borderColor: 'border' })}>
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: '4',
            padding: '2',
            borderBottom: '1px solid',
            borderColor: 'borderStrong',
            fontFamily: 'body',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            fontSize: '2xs',
            color: 'textFaint',
          })}
        >
          <span>Player</span>
          <span>To Par</span>
          <span>Thru</span>
        </div>
        {rows.map((row) => (
          <div
            key={row.name}
            className={css({
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: '4',
              alignItems: 'baseline',
              minHeight: '48px',
              padding: '2',
              borderBottom: '1px solid',
              borderColor: 'border',
            })}
          >
            <span className={css({ display: 'flex', gap: '3', alignItems: 'baseline' })}>
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'sm',
                  color: 'textFaint',
                })}
              >
                {row.pos}
              </span>
              <span
                className={css({ fontFamily: 'display', fontWeight: 'normal', fontSize: 'md' })}
              >
                {row.name}
              </span>
            </span>
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'md',
                color: 'accent',
                textAlign: 'right',
              })}
            >
              {row.par}
            </span>
            <span className={css({ fontSize: 'sm', color: 'textMuted', textAlign: 'right' })}>
              {row.thru}
            </span>
          </div>
        ))}
      </div>
      <p
        className={css({
          fontSize: 'sm',
          color: 'textMuted',
          lineHeight: 'loose',
          borderLeft: '3px solid',
          borderColor: 'accent',
          paddingLeft: '3',
        })}
      >
        <b>Why it matters:</b> both leaders reach the closing stretch with a one shot decision
        waiting on the tee. A scorecard records what they did, 15th Club argues what they should do
        next.
      </p>
    </section>
  )
}
