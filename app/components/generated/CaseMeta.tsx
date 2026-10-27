import { css } from '../../../styled-system/css'

type Item = { label: string; value?: string }

export function CaseMeta({ items }: { items: Item[] }) {
  const shown = items.filter((item) => Boolean(item.value))
  return (
    <dl
      className={css({
        bg: 'field',
        color: 'fieldInk',
        border: '1px solid',
        borderColor: 'fieldBorder',
        borderRadius: 'sm',
        maxWidth: '560px',
        margin: '0',
      })}
    >
      {shown.map((item) => (
        <div
          key={item.label}
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '4',
            paddingBlock: '12px',
            paddingInline: '18px',
            '& + &': { borderTop: '1px solid', borderTopColor: 'fieldBorder' },
          })}
        >
          <dt
            className={css({
              fontFamily: 'body',
              fontSize: '2xs',
              textTransform: 'uppercase',
              letterSpacing: '0.11em',
              fontWeight: 'bold',
              color: 'fieldInkMuted',
            })}
          >
            {item.label}
          </dt>
          <dd
            className={css({
              margin: '0',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'md',
              textAlign: 'right',
              color: 'fieldInk',
            })}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
