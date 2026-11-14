import { css } from '../../../styled-system/css'

const board = [
  { name: 'E. van Rooyen', score: '−13' },
  { name: 'M. Russell', score: '−12' },
  { name: 'S. Välimäki', score: '−12' },
  { name: 'K. Yu', score: '−12' },
  { name: 'T. Crowe', score: '−12' },
]

const head = css({
  fontFamily: 'body',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  color: 'textFaint',
  marginBottom: '2',
})
const row = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  paddingBlock: '2',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  fontSize: 'sm',
  '&:nth-child(2)': { borderTopWidth: '0' },
})
const name = css({ color: 'textMuted' })
const nameLead = css({ color: 'text' })
const fig = css({
  fontFamily: 'display',
  fontSize: 'lede',
  color: 'text',
  fontVariantNumeric: 'tabular-nums',
})
const figLead = css({
  fontFamily: 'display',
  fontSize: 'lede',
  fontVariantNumeric: 'tabular-nums',
  color: { base: 'accent', _light: 'accentAlt' },
})
const sub = css({ color: 'textFaint', fontSize: 'xs' })

export function DayIndex() {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '5' })}>
      <div>
        <div className={head}>Austin Championship</div>
        {board.map((r, i) => (
          <div key={r.name} className={row}>
            <span className={i === 0 ? nameLead : name}>{r.name}</span>
            <span className={i === 0 ? figLead : fig}>{r.score}</span>
          </div>
        ))}
      </div>
      <div>
        <div className={head}>Aldie, Virginia</div>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '1',
            fontSize: 'sm',
            color: 'textMuted',
          })}
        >
          <span className={css({ color: 'text', fontSize: 'base' })}>
            Overcast, 48°, feels like 42°
          </span>
          <span className={sub}>Sunrise 06:59 · Sunset 16:50</span>
          <span className={sub}>First quarter moon, 31% lit</span>
        </div>
      </div>
      <div>
        <div className={head}>Markets</div>
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: '2',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            fontSize: 'sm',
          })}
        >
          <span className={css({ color: 'textMuted', fontWeight: 'medium' })}>SPY</span>
          <span className={fig}>754.37</span>
          <span className={sub}>−0.36%</span>
        </div>
      </div>
    </div>
  )
}
