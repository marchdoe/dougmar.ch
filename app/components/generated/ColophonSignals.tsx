import { css } from '../../../styled-system/css'

const leaders = [
  { name: 'E. van Rooyen', score: '14 under' },
  { name: 'K. Yu', score: '14 under' },
  { name: 'B. Harman', score: '13 under' },
]

const gridCls = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', xl: '1.2fr 1fr 1.1fr' },
  rowGap: { base: '5', lg: '6' },
  columnGap: { base: '5', lg: '7' },
})

const h3Cls = css({
  fontSize: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
  fontWeight: 'bold',
  marginBottom: '3',
})

const rowCls = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: '4',
  paddingBlock: '2',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'fieldBorder',
  fontSize: 'sm',
  maxWidth: '34ch',
  _first: { borderTopWidth: '0' },
})

const lineCls = css({ fontSize: 'sm', lineHeight: 'loose', maxWidth: '40ch' })
const kCls = css({ color: 'fieldInkMuted' })
const vCls = css({ fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' })

const quoteCls = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  textStyle: 'lg',
  lineHeight: 'snug',
  color: 'fieldInk',
  maxWidth: '30ch',
  margin: '0',
})

const citeCls = css({
  display: 'block',
  fontStyle: 'normal',
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
  marginTop: '3',
})

export function ColophonSignals() {
  return (
    <div className={gridCls}>
      <div>
        <h3 className={h3Cls}>Austin Championship · leaderboard</h3>
        {leaders.map((l) => (
          <div key={l.name} className={rowCls}>
            <span>{l.name}</span>
            <span className={vCls}>{l.score}</span>
          </div>
        ))}
      </div>
      <div>
        <h3 className={h3Cls}>the ticker</h3>
        <p className={lineCls}>
          <span className={kCls}>SPY</span> <span className={vCls}>754.37</span>{' '}
          <span className={vCls}>down 0.36%</span>
        </p>
        <p className={lineCls}>
          <span className={kCls}>moon</span> <span className={vCls}>first quarter</span>
        </p>
        <p className={lineCls}>
          <span className={kCls}>sky</span> aldie, va, 48°f, overcast
        </p>
        <p className={lineCls}>
          <span className={kCls}>in rotation</span> <span className={vCls}>The War on Drugs</span>{' '}
          and <span className={vCls}>My Morning Jacket</span>
        </p>
      </div>
      <blockquote className={quoteCls}>
        “Never settle for the crumbs of life.”
        <cite className={citeCls}>Og Mandino</cite>
      </blockquote>
    </div>
  )
}
