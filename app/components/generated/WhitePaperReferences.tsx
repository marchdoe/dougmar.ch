import { css } from '../../../styled-system/css'

type Reference = { title: string; url: string; note?: string }

export function WhitePaperReferences({ references }: { references: Reference[] }) {
  return (
    <div
      className={css({
        bg: 'bg',
        paddingInline: { base: '5', lg: '9' },
        paddingBlock: '7',
        borderTop: '1px solid',
        borderColor: 'border',
      })}
    >
      <span
        className={css({
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'textFaint',
          display: 'block',
          marginBottom: '5',
        })}
      >
        References
      </span>
      <ul
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '3',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        })}
      >
        {references.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              rel="noopener"
              className={css({ textStyle: 'sm', fontWeight: '600', color: 'text' })}
            >
              {r.title} ↗
            </a>
            {r.note && (
              <span className={css({ textStyle: 'xs', color: 'textFaint', marginLeft: '3' })}>
                {r.note}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
