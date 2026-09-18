import { css } from '../../../styled-system/css'

export function ConstraintsBlock({ items }: { items: string[] }) {
  return (
    <section
      className={css({
        bg: 'bg',
        color: 'text',
        padding: { base: '5', md: '7' },
        borderTop: '1px solid',
        borderColor: 'border',
      })}
    >
      <p
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          fontSize: 'xs',
          color: 'textFaint',
          marginBottom: '3',
        })}
      >
        Constraints
      </p>
      <ul className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
        {items.map((item) => (
          <li
            key={item}
            className={css({
              fontSize: 'base',
              color: 'textMuted',
              paddingLeft: '4',
              borderLeft: '3px solid',
              borderColor: 'accent',
            })}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
