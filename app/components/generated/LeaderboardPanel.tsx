import { css } from '../../../styled-system/css'

const chasers = [
  { pos: 2, name: 'Ryan Gerard', thru: 'Thru 15', score: '−18' },
  { pos: 3, name: 'Chris Kirk', thru: 'Thru 13', score: '−17' },
  { pos: 4, name: 'Denny McCarthy', thru: 'Thru 16', score: '−16' },
  { pos: 5, name: 'Carlos Ortiz', thru: 'Thru 12', score: '−15' },
  { pos: 6, name: 'Nico Echavarría', thru: 'Thru 14', score: '−14' },
  { pos: 7, name: 'Austin Eckroat', thru: 'Thru 15', score: '−13' },
  { pos: 8, name: 'Sami Välimäki', thru: 'Thru 11', score: '−12' },
]

function LeaderRow() {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'baseline',
        gap: '12px',
        paddingTop: '16px',
        paddingBottom: '14px',
        bg: 'field',
        color: 'surface',
        marginInline: 'calc(var(--pad) * -1)',
        paddingInline: 'var(--pad)',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          textStyle: 'base',
          width: '2.2ch',
          flex: 'none',
          color: 'fieldInk',
        })}
      >
        1
      </span>
      <span
        className={css({
          textStyle: { base: 'base', lg: 'lg' },
          fontWeight: 'bold',
          color: 'surface',
          whiteSpace: 'nowrap',
        })}
      >
        Ben James
      </span>
      <span
        className={css({
          flex: '1',
          minWidth: '16px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'dotted',
          borderBottomColor: 'fieldInk',
          transform: 'translateY(-5px)',
          opacity: 0.6,
        })}
      />
      <span
        className={css({
          textStyle: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          flex: 'none',
          whiteSpace: 'nowrap',
        })}
      >
        Thru 14
      </span>
      <span
        className={css({
          fontFamily: 'display',
          fontSize: 'clamp(21px,1.9vw,27px)',
          lineHeight: '1',
          color: 'fieldInk',
          flex: 'none',
          width: '3.6ch',
          textAlign: 'right',
        })}
      >
        −21
      </span>
    </div>
  )
}

function ChaserRow({ pos, name, thru, score }: (typeof chasers)[number]) {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'baseline',
        gap: '12px',
        paddingTop: '16px',
        paddingBottom: '14px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        '&:nth-child(n+6)': { paddingTop: '10px', paddingBottom: '9px' },
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          textStyle: 'base',
          width: '2.2ch',
          flex: 'none',
          color: 'textFaint',
        })}
      >
        {pos}
      </span>
      <span
        className={css({
          textStyle: { base: 'base', lg: 'lg' },
          color: 'text',
          whiteSpace: 'nowrap',
        })}
      >
        {name}
      </span>
      <span
        className={css({
          flex: '1',
          minWidth: '16px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'dotted',
          borderBottomColor: 'borderStrong',
          transform: 'translateY(-5px)',
          opacity: 0.7,
        })}
      />
      <span
        className={css({
          textStyle: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textFaint',
          flex: 'none',
          whiteSpace: 'nowrap',
        })}
      >
        {thru}
      </span>
      <span
        className={css({
          fontFamily: 'display',
          fontSize: 'clamp(21px,1.9vw,27px)',
          lineHeight: '1',
          color: 'textMuted',
          flex: 'none',
          width: '3.6ch',
          textAlign: 'right',
        })}
      >
        {score}
      </span>
    </div>
  )
}

export function LeaderboardPanel() {
  return (
    <div
      className={css({
        bg: 'bg',
        paddingTop: { base: '84px', lg: '96px' },
        paddingBottom: '40px',
        paddingInline: 'var(--pad)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: { lg: 'center' },
        minWidth: '0',
        order: '1',
      })}
    >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingBottom: '14px',
          marginBottom: '6px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
            fontSize: 'clamp(26px,4.4vw,44px)',
            lineHeight: '0.9',
            color: 'text',
          })}
        >
          The Chase
        </h2>
        <div
          className={css({
            textStyle: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: 'textFaint',
            textAlign: 'right',
          })}
        >
          WWT Championship
          <br />
          El Cardonal · Los Cabos
        </div>
      </div>
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        <LeaderRow />
        {chasers.map((row) => (
          <ChaserRow key={row.name} {...row} />
        ))}
      </div>
    </div>
  )
}
