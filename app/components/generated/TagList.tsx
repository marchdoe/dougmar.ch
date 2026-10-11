import { css } from '../../../styled-system/css'

export function TagList({ items }: { items: string[] }) {
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
      {items.map((item) => (
        <span
          key={item}
          className={css({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'fieldBorder',
            paddingBlock: '1',
            paddingInline: '2',
            fontFamily: 'body',
            textStyle: 'xs',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontVariant: 'small-caps',
            letterSpacing: 'wider',
            color: 'fieldInk',
          })}
        >
          {item}
        </span>
      ))}
    </div>
  )
}
