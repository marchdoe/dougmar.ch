import { css, cx } from '../../../styled-system/css'

type Item = { k: string; v: string }
type MaybeItem = { k: string; v?: string }

export function pickFilled(items: MaybeItem[]): Item[] {
  return items.filter((item): item is Item => typeof item.v === 'string' && item.v.length > 0)
}

export function KeyValueGrid({ items, className }: { items: Item[]; className?: string }) {
  return (
    <dl
      className={cx(
        css({
          display: 'grid',
          gridTemplateColumns: '1fr',
          rowGap: '16px',
          columnGap: '48px',
          margin: '0',
        }),
        className
      )}
    >
      {items.map((item) => (
        <div key={item.k}>
          <dt
            className={css({
              display: 'block',
              fontFamily: 'body',
              fontWeight: '600',
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontVariantCaps: 'all-small-caps',
              color: 'accentAlt',
              marginBottom: '5px',
            })}
          >
            {item.k}
          </dt>
          <dd
            className={css({
              display: 'block',
              margin: '0',
              fontFamily: 'body',
              fontSize: '15px',
              lineHeight: '1.5',
              color: 'textMuted',
              fontVariantNumeric: 'tabular-nums',
              maxWidth: '40ch',
            })}
          >
            {item.v}
          </dd>
        </div>
      ))}
    </dl>
  )
}
