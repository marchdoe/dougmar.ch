import { css } from '../../../styled-system/css'

export function PivotBand() {
  return (
    <span
      className={css({
        position: 'relative',
        zIndex: 1,
        order: { base: 3, md: 0 },
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        rowGap: '4',
        columnGap: '28px',
        bg: 'bgAlt',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        paddingBlock: { base: '16px', md: '18px' },
        paddingInline: { base: '20px', md: '24px' },
        marginBlock: '28px',
        fontFamily: 'body',
        fontWeight: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '160ms',
      })}
    >
      <span className={css({ fontFamily: 'display', fontSize: '19px', color: 'text' })}>
        Aldie, Virginia
      </span>
      <span className={css({ fontSize: 'sm', color: 'textMuted' })}>
        Oct 29, 2026 · fog, 48.8°F
      </span>
      <span className={css({ fontSize: 'sm', color: 'textMuted' })}>
        {/* amberLight (#F0AD45) has no semantic token; accentAlt is the nearest highlight ink. */}
        SPY <span className={css({ color: 'accentAlt' })}>+0.34%</span>
      </span>
      <span
        className={css({
          fontSize: '2xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'borderStrong',
          borderRadius: 'sm',
          paddingBlock: '1',
          paddingInline: '2',
        })}
      >
        the code, now
      </span>
    </span>
  )
}
