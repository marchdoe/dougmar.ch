import { css } from '../../../styled-system/css'

export function TagList({ items }: { items: string[] }) {
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
      {items.map((item) => (
        <span
          key={item}
          className={css({
            fontFamily: 'body',
            fontSize: 'xs',
            fontWeight: '500',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            fontVariantCaps: 'all-small-caps',
            color: 'textMuted',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'sm',
            paddingBlock: '1',
            paddingInline: '3',
          })}
        >
          {item}
        </span>
      ))}
    </div>
  )
}
