import { css } from '../../../styled-system/css'

const rows = [
  { pos: 'T1', name: 'Penge', score: '\u22129', lead: true },
  { pos: 'T1', name: 'Neergaard-Petersen', score: '\u22129', lead: true },
  { pos: 'T1', name: 'Thorbjornsen', score: '\u22129', lead: true },
  { pos: 'T4', name: 'McGreevy', score: '\u22128', lead: false },
  { pos: 'T4', name: 'Hodges', score: '\u22128', lead: false },
]

export function Leaderboard() {
  return (
    <section
      aria-label="Leaderboard"
      className={css({
        bg: 'surface',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border',
        borderRadius: 'md',
        paddingTop: '20px',
        paddingInline: '22px',
        paddingBottom: '10px',
        color: 'text',
        gridColumn: { lg: '2' },
        gridRow: { lg: '2' },
        alignSelf: { lg: 'start' },
      })}
    >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingBottom: '12px',
          marginBottom: '4px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: '24px',
            letterSpacing: '.03em',
            color: 'text',
          })}
        >
          Leaderboard
        </h2>
        <span
          className={css({
            color: 'textMuted',
            fontSize: 'xs',
            letterSpacing: '.08em',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          Thru 18
        </span>
      </div>
      {rows.map((row) => (
        <div
          key={row.name}
          className={css({
            display: 'grid',
            gridTemplateColumns: '40px 1fr auto',
            alignItems: 'baseline',
            columnGap: '12px',
            paddingBlock: '13px',
            paddingInline: '6px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
            borderRadius: 'sm',
            transition: 'background 120ms ease',
            _last: { borderBottomWidth: '0' },
            _hover: { bg: 'bgAlt' },
          })}
        >
          <span
            className={css({
              fontSize: 'xs',
              letterSpacing: '.06em',
              color: 'textFaint',
              fontWeight: 'bold',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {row.pos}
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontSize: 'clamp(22px, 2.4vw, 30px)',
              lineHeight: '1',
              letterSpacing: '.02em',
              color: 'text',
              minWidth: '0',
            })}
          >
            {row.name}
          </span>
          <span
            className={css({
              fontFamily: 'body',
              fontSize: '15px',
              fontWeight: 'bold',
              fontVariantNumeric: 'tabular-nums',
              color: row.lead ? 'accent' : 'textMuted',
            })}
          >
            {row.score}
          </span>
        </div>
      ))}
    </section>
  )
}
