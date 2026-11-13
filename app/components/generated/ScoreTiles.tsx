import { css, cx } from '../../../styled-system/css'
import { label, tile } from './styles'

const big = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  lineHeight: '0.82',
  letterSpacing: '0.01em',
  fontSize: { base: 'clamp(56px, 16vw, 104px)', md: '64px', lg: '96px', xl: '104px' },
})
const big2 = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  lineHeight: '0.9',
  fontSize: 'clamp(30px, 6vw, 44px)',
})
const bottom = css({ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4' })
const foot = css({ fontSize: 'sm', lineHeight: '1.5', marginTop: '2' })

// Labels on the field use fieldInk: fieldInkMuted measured 4.00:1 on field.
export function ScoreTiles() {
  return (
    <>
      <div className={cx(tile, css({ bg: 'field', color: 'fieldInk' }))}>
        <div className={bottom}>
          <span className={cx(label, css({ color: 'fieldInk' }))}>Pistons · W</span>
          <span className={cx(big, css({ color: 'fieldInk' }))}>144</span>
        </div>
      </div>
      <div className={cx(tile, css({ bg: 'bgAlt' }))}>
        <div className={bottom}>
          <span className={cx(label, css({ color: 'textMuted' }))}>Opponent · final</span>
          <span className={cx(big, css({ color: 'text' }))}>140</span>
        </div>
      </div>
      <div className={cx(tile, css({ bg: 'surface' }))}>
        <span className={cx(label, css({ color: 'textMuted' }))}>
          Red Wings · <span className={css({ color: 'textFaint' })}>L</span>
        </span>
        <div>
          <div className={cx(big2, css({ color: 'text' }))}>4–5</div>
          <div className={cx(foot, css({ color: 'textMuted' }))}>
            Overtime loss at home. One slipped away.
          </div>
        </div>
      </div>
      <div className={cx(tile, css({ bg: 'field', color: 'fieldInk' }))}>
        <span className={cx(label, css({ color: 'fieldInk' }))}>Golf · Austin Championship</span>
        <div>
          <div className={cx(big2, css({ color: 'fieldInk' }))}>Trace Crowe −10</div>
          <div className={cx(foot, css({ color: 'fieldInk' }))}>In progress · moving day</div>
        </div>
      </div>
    </>
  )
}
