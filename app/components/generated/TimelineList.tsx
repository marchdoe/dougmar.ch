import { css } from '../../../styled-system/css'

type Entry = { year: string; role: string; company: string; description: string; current?: boolean }

export function TimelineList({ items }: { items: Entry[] }) {
  return (
    <ul
      className={css({
        listStyle: 'none',
        m: 0,
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '2',
      })}
    >
      {items.map((e) => (
        <li
          key={`${e.year}-${e.company}`}
          className={css({
            bg: 'surface',
            border: '1px solid',
            borderColor: 'border',
            borderRadius: 'sm',
            p: '4',
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: '120px 1fr' },
            gap: '3',
          })}
        >
          <div className={css({ textStyle: 'sm', color: 'accent', fontWeight: 'bold' })}>
            {e.year}
          </div>
          <div>
            <div className={css({ textStyle: 'base', fontWeight: 'bold', color: 'text' })}>
              {e.role} · {e.company}
              {e.current ? ' (current)' : ''}
            </div>
            <p
              className={css({
                textStyle: 'sm',
                color: 'textMuted',
                mt: '1',
                lineHeight: 'normal',
              })}
            >
              {e.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
