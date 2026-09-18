import { css } from '../../../styled-system/css'

type Reference = { title: string; url: string; note?: string }

export function ReferencesBlock({ items }: { items: Reference[] }) {
  return (
    <section
      className={css({
        bg: 'surface',
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
        References
      </p>
      <ul className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
        {items.map((ref) => (
          <li key={ref.url}>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener"
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'base',
                color: 'accent',
              })}
            >
              {ref.title}
            </a>
            {ref.note ? (
              <p className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '1' })}>
                {ref.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
