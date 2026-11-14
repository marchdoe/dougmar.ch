import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

const label = css({
  textStyle: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  fontWeight: 'bold',
  color: 'fieldInkMuted',
})

export function AboutBand() {
  return (
    <div
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        paddingBlock: 'clamp(28px, 4vw, 48px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
        gap: { base: '32px', md: '0' },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: { base: 'flex-start', md: 'flex-end' },
          textAlign: { base: 'left', md: 'right' },
          paddingRight: { md: 'clamp(24px, 3vw, 56px)' },
          borderRightWidth: { md: '2px' },
          borderRightStyle: { md: 'solid' },
          borderRightColor: 'fieldBorder',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: '5xl',
            lineHeight: '0.9',
            color: 'fieldInk',
          })}
        >
          {personal.holesInOne}
        </span>
        <span className={label}>holes in one</span>
      </div>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '8px',
          paddingLeft: { md: 'clamp(24px, 3vw, 56px)' },
        })}
      >
        <span className={label}>current focus</span>
        <p
          className={css({
            textStyle: 'lede',
            color: 'fieldInk',
            maxWidth: '44ch',
            fontFamily: 'display',
          })}
        >
          {personal.currentFocus}
        </p>
      </div>
    </div>
  )
}
