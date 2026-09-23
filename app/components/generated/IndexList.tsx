import { css } from '../../../styled-system/css'

type Item = { key: string; href: string; title: string; meta: string }

export function IndexList({ heading, items }: { heading: string; items: Item[] }) {
  return (
    <div
      className={css({
        borderTopWidth: '3px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: '4',
      })}
    >
      <h3
        className={css({
          textStyle: 'lg',
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          marginBottom: '2',
        })}
      >
        {heading}
      </h3>
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        {items.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className={css({
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'baseline',
              gap: '3',
              minHeight: '48px',
              paddingBlock: '2',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              _hover: { color: 'accent' },
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                textStyle: 'lg',
                letterSpacing: '0.01em',
                minWidth: '0',
              })}
            >
              {item.title}
            </span>
            <span
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'textMuted',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              })}
            >
              {item.meta}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
