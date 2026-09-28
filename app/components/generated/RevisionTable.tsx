import { css } from '../../../styled-system/css'

const rows = [
  { k: 'Detroit Lions', v: 'Win', f: '31–24', win: true },
  { k: 'Detroit Tigers', v: 'Loss', f: '2–4', win: false },
  { k: 'Presidents Cup', v: 'Final', f: '17–13', win: false },
  { k: 'SPY', v: '+0.54%', f: '771.35', win: false },
  { k: 'Weather · Aldie', v: 'Overcast', f: '59.6°F', win: false },
  { k: 'Moon', v: 'Waning gibbous', f: '92.6%', win: false },
  { k: 'Air quality', v: 'Good', f: '✓', win: false },
]

const td = css({
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'border',
  paddingBlock: '9px',
  paddingInline: '1',
  fontFamily: 'body',
  fontSize: 'sm',
  verticalAlign: 'baseline',
})
const keyCell = css({
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '2xs',
  color: 'textFaint',
  whiteSpace: 'nowrap',
  width: '34%',
})
const fig = css({
  textAlign: 'right',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  color: 'text',
  fontVariantNumeric: 'tabular-nums',
})
const figWin = css({
  textAlign: 'right',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  color: 'accent',
  fontVariantNumeric: 'tabular-nums',
})

export function RevisionTable() {
  return (
    <div className={css({ marginTop: '2' })}>
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'lg',
          fontSize: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '6px',
        })}
      >
        Revision table · 2026.09.28
      </div>
      <table className={css({ width: '100%', borderCollapse: 'collapse', marginTop: '2px' })}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.k}>
              <td className={`${td} ${keyCell}`}>{r.k}</td>
              <td className={`${td} ${css({ color: 'text' })}`}>{r.v}</td>
              <td className={`${td} ${r.win ? figWin : fig}`}>{r.f}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: 'sm',
          fontStyle: 'italic',
          color: 'textFaint',
          marginTop: '12px',
          lineHeight: '1.45',
          maxWidth: '48ch',
        })}
      >
        Footnote: “A leader is one who knows the way, goes the way, and shows the way.”{' '}
        <cite
          className={css({
            fontStyle: 'normal',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontSize: '2xs',
          })}
        >
          Unknown
        </cite>
      </p>
    </div>
  )
}
