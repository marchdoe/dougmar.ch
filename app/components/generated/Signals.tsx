import { css } from '../../../styled-system/css'

const item = css({
  position: 'relative',
  whiteSpace: 'nowrap',
  '&:not(:first-child)::before': {
    content: '""',
    position: 'absolute',
    left: '-13px',
    top: '50%',
    width: '3px',
    height: '3px',
    borderRadius: 'full',
    bg: 'borderStrong',
  },
})

export function Signals() {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: '6',
        rowGap: '1',
        fontSize: 'sm',
        lineHeight: 'loose',
        color: 'textMuted',
        fontVariantNumeric: 'tabular-nums',
        maxWidth: '68ch',
        marginInline: 'auto',
      })}
    >
      <span className={item}>overcast, 62°f</span>
      <span className={item}>waning gibbous, 86% lit</span>
      <span className={item}>
        spy 765.61 <span className={css({ color: 'textMuted' })}>↓0.74%</span>
      </span>
      <span className={item}>presidents cup, final</span>
      {/* mockup amber #b5821c has no semantic token; nearest semantic emphasis ink is accent */}
      <span className={`${item} ${css({ color: 'accent' })}`}>lions 31–24, a win</span>
      <span className={item}>tigers 2, guardians 4</span>
    </div>
  )
}
