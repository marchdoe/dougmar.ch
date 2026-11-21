import { css } from '../../../styled-system/css'

type Signal = { label: string; value: string; sub: string; accent?: boolean }

// The strip sits at the fold directly under the hero; a scroll-driven fade left its
// small labels half-transparent at scroll 0, so it renders fully formed from the first frame.
export function SignalStrip({ items, label }: { items: Signal[]; label: string }) {
  return (
    <section
      aria-label={label}
      className={css({
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        paddingBlock: '26px',
        paddingInline: '6vw',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        columnGap: { base: '0', md: '40px', lg: '3vw' },
      })}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={css({
            paddingBlock: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
            borderBottomWidth: '1px',
            _last: { borderBottomWidth: { base: '0', md: '1px' } },
          })}
        >
          <span
            className={css({
              fontSize: 'xs',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: 'textMuted',
            })}
          >
            {item.label}
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontSize: '34px',
              letterSpacing: '.02em',
              lineHeight: '0.95',
              fontVariantNumeric: 'tabular-nums',
              color: item.accent ? 'accent' : 'text',
            })}
          >
            {item.value}
          </span>
          <span className={css({ textStyle: 'sm', color: 'textMuted' })}>{item.sub}</span>
        </div>
      ))}
    </section>
  )
}
