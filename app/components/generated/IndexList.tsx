import { css } from '../../../styled-system/css'

type Item = { key: string; title: string; href: string; meta: string }

export function IndexList({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map((it) => (
        <div
          key={it.key}
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '4px',
            paddingBlock: '18px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            '&:last-child': {
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            },
            lg: { gridTemplateColumns: '1fr 240px', alignItems: 'center', gap: '24px' },
          })}
        >
          <a
            href={it.href}
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'xl',
              lineHeight: '1.05',
              color: 'text',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              textDecorationThickness: '1px',
              textDecorationColor: 'borderStrong',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              justifySelf: 'start',
              _hover: { color: 'accent', textDecorationColor: 'accent' },
            })}
          >
            {it.title}
          </a>
          <div
            className={css({
              fontSize: 'xs',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'textFaint',
              fontWeight: 'bold',
              fontVariantNumeric: 'tabular-nums',
              lg: { textAlign: 'right' },
            })}
          >
            {it.meta}
          </div>
        </div>
      ))}
    </div>
  )
}
