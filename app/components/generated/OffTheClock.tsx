import { css, cx } from '../../../styled-system/css'
import { SectionHead, revealSection } from './SectionHead'

const rows = [
  { k: 'On Rotation', v: 'My Morning Jacket · Guided by Voices · Wet Leg' },
  { k: 'Watching', v: 'Detroit Lions, one-score wins I’ll take every Sunday' },
  { k: 'Keeping Score', v: 'Mexico Open at VidantaWorld · Novak closing at −25' },
]

export function OffTheClock() {
  return (
    <section
      aria-label="On rotation"
      className={cx(
        css({
          bg: 'bg',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingBlock: 'clamp(28px, 4vh, 44px)',
          paddingInline: { base: '6vw', lg: '5vw' },
        }),
        revealSection
      )}
    >
      <SectionHead>Off The Clock</SectionHead>
      <div className={css({ display: 'grid', marginTop: '14px' })}>
        {rows.map((r) => (
          <div
            key={r.k}
            className={css({
              display: 'flex',
              alignItems: 'baseline',
              columnGap: { base: '14px', lg: '24px' },
              rowGap: '4px',
              flexWrap: 'wrap',
              paddingBlock: '12px',
              paddingInline: '2px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              '&:last-child': { borderBottomWidth: '0' },
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                textStyle: 'xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'accent',
                minWidth: '120px',
              })}
            >
              {r.k}
            </span>
            <span className={css({ fontSize: 'sm', color: 'text' })}>{r.v}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
