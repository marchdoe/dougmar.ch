import { css } from '../../../styled-system/css'

const line = css({
  position: 'absolute',
  left: { base: '-16%', lg: '-20%' },
  right: '0',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
  pointerEvents: 'none',
  zIndex: 0,
})

const label = css({
  position: 'absolute',
  left: '0',
  top: '-7px',
  textStyle: 'xs',
  lineHeight: '1',
  fontWeight: 'normal',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textMuted',
  bg: 'bgAlt',
  paddingRight: '9px',
})

export function Guides() {
  return (
    <>
      <div aria-hidden="true" className={`${line} ${css({ top: '34px' })}`}>
        <b className={label}>cap-height</b>
      </div>
      <div aria-hidden="true" className={`${line} ${css({ bottom: '26px' })}`}>
        <b className={label}>baseline</b>
      </div>
    </>
  )
}
