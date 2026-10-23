import { css } from '../../../styled-system/css'

export function StackList({ items }: { items: string[] | undefined }) {
  if (!items || items.length === 0) return null
  return (
    <div
      className={css({
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        paddingTop: '12px',
      })}
    >
      <div
        className={css({
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '12px',
        })}
      >
        stack
      </div>
      <ul className={css({ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px' })}>
        {items.map((s) => (
          <li
            key={s}
            className={css({
              fontSize: 'sm',
              bg: 'fieldInkMuted',
              color: 'accentAlt',
              _dark: { color: 'field' },
              borderRadius: 'sm',
              paddingInline: '10px',
              paddingBlock: '4px',
              fontWeight: '500',
            })}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
