import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function IndexList({ label, items }: { label: string; items: Project[] }) {
  return (
    <div className={css({ marginBottom: 'clamp(36px, 5vw, 64px)' })}>
      <span
        className={css({
          display: 'block',
          marginBottom: '2',
          textStyle: 'xs',
          fontWeight: 'semibold',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        {label}
      </span>
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {items.map((p) => (
          <li
            key={p.slug}
            className={css({
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              _last: {
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'border',
              },
            })}
          >
            <a
              href={`/work/${p.slug}`}
              className={css({
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '4',
                minHeight: '112px',
                paddingBlock: '18px',
                color: 'text',
                '&:hover .rtitle': { color: 'fieldBorder' },
              })}
            >
              <span
                className={`rtitle ${css({
                  fontFamily: 'display',
                  fontWeight: 'medium',
                  fontSize: 'clamp(28px, 4vw, 46px)',
                  lineHeight: '1',
                  letterSpacing: '-0.01em',
                  transition: 'color 120ms ease',
                })}`}
              >
                {p.title}
              </span>
              <span
                className={css({
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'baseline',
                  textStyle: 'sm',
                  letterSpacing: 'wide',
                  textTransform: 'uppercase',
                  color: 'textMuted',
                  whiteSpace: 'nowrap',
                })}
              >
                <span
                  className={css({
                    fontVariantNumeric: 'tabular-nums',
                    color: 'text',
                    fontWeight: 'semibold',
                  })}
                >
                  {p.year}
                </span>
                <span>{p.type}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
