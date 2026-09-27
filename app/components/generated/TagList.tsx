import { css } from '../../../styled-system/css'

export function TagList({ items }: { items: string[] }) {
  return (
    <ul
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2',
        listStyle: 'none',
        margin: '0',
        padding: '0',
      })}
    >
      {items.map((item) => (
        <li
          key={item}
          className={css({
            fontFamily: 'display',
            fontSize: 'sm',
            textTransform: 'lowercase',
            color: 'textMuted',
            paddingBlock: '1',
            paddingInline: '2',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'md',
          })}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
