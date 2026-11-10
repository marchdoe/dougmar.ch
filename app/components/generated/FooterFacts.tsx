import { css } from '../../../styled-system/css'

const headClass = css({
  fontSize: '2xs',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
  fontWeight: 'bold',
  marginBottom: '14px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
  paddingBottom: '10px',
})

const rowClass = css({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'baseline',
  gap: '12px',
  paddingBlock: '9px',
  fontSize: '15px',
})

const tClass = css({ color: 'fieldInk', fontWeight: 'normal' })
// mockup goldLight (#E6B436) has no token and field flips to gold in dark; fieldInk is the nearest legible ink
const vClass = css({ color: 'fieldInk', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' })

const lineClass = css({
  fontSize: 'sm',
  color: 'fieldInkMuted',
  paddingBlock: '7px',
  lineHeight: '1.55',
})
const strongClass = css({ color: 'fieldInk', fontWeight: 'bold' })

export function FooterFacts() {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
        gap: 'clamp(20px, 3vw, 36px)',
      })}
    >
      <div>
        <h4 className={headClass}>Detroit</h4>
        <div className={rowClass}>
          <span className={tClass}>Lions</span>
          <span className={vClass}>19–9</span>
        </div>
        <div className={rowClass}>
          <span className={tClass}>Pistons</span>
          <span className={vClass}>122–111</span>
        </div>
      </div>
      <div>
        <h4 className={headClass}>Markets</h4>
        <div className={rowClass}>
          <span className={tClass}>SPY</span>
          <span className={vClass}>752.69</span>
        </div>
        <div className={rowClass}>
          <span className={tClass}>Day</span>
          <span className={vClass}>+2.37%</span>
        </div>
      </div>
      <div>
        <h4 className={headClass}>On the desk</h4>
        <div className={lineClass}>
          <strong className={strongClass}>Veterans Day</strong> tomorrow, Nov 11
        </div>
        <div className={lineClass}>
          In rotation: <strong className={strongClass}>Guided by Voices</strong>,{' '}
          <strong className={strongClass}>Wet Leg</strong>
        </div>
        <div className={lineClass}>Aldie, new moon, 2% lit</div>
      </div>
    </div>
  )
}
