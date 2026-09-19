import { css } from '../../../styled-system/css'

export function CapabilityTags({ items }: { items: string[] }) {
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
      {items.map((c) => (
        <span
          key={c}
          className={css({
            textStyle: 'sm',
            border: '1px solid',
            borderColor: 'fieldBorder',
            color: 'fieldInk',
            borderRadius: 'full',
            px: '3',
            py: '1',
          })}
        >
          {c}
        </span>
      ))}
    </div>
  )
}
