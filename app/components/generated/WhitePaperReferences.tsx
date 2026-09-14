import { css } from '../../../styled-system/css'

type Reference = { title: string; url: string; note?: string }

export function WhitePaperReferences({ references }: { references?: Reference[] }) {
  if (!references || references.length === 0) return null
  return (
    <section
      className={css({
        bg: 'bgAlt',
        padding: { base: '8 5', lg: '48px 56px' },
        borderTop: '1px solid',
        borderColor: 'borderStrong',
      })}
    >
      <p
        className={css({
          fontWeight: 'bold',
          fontSize: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'accentAlt',
          marginBottom: '4',
        })}
      >
        References
      </p>
      {references.map((r) => (
        <a
          key={r.url}
          href={r.url}
          className={css({
            display: 'block',
            padding: '3 0',
            borderBottom: '1px solid',
            borderColor: 'border',
            minHeight: '44px',
          })}
        >
          <span className={css({ fontWeight: 'bold', fontSize: 'base', color: 'accentAlt' })}>
            {r.title}
          </span>
          {r.note && (
            <span
              className={css({
                display: 'block',
                fontSize: 'sm',
                color: 'textMuted',
                marginTop: '1',
              })}
            >
              {r.note}
            </span>
          )}
        </a>
      ))}
    </section>
  )
}
