import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Item = (typeof projects)[number]

export function WorkList({
  label,
  items,
  spaced,
}: {
  label: string
  items: Item[]
  spaced: boolean
}) {
  return (
    <div className={css({ marginTop: spaced ? '56px' : '0' })}>
      <div
        className={css({
          fontSize: '13px',
          fontVariant: 'small-caps',
          letterSpacing: 'wider',
          color: 'textFaint',
          marginBottom: '20px',
        })}
      >
        {label}
      </div>
      <div className={css({ borderTop: '1px solid', borderColor: 'border' })}>
        {items.map((p) => (
          <a
            key={p.slug}
            href={`/work/${p.slug}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'baseline',
              gap: '12px',
              paddingBlock: '20px',
              minHeight: '44px',
              borderBottom: '1px solid',
              borderColor: 'border',
              '&:hover [data-title]': { color: 'accentAlt' },
              '&:hover [data-title]::after': { transform: 'scaleX(1)' },
            })}
          >
            <span
              data-title=""
              className={css({
                fontFamily: 'display',
                fontWeight: 'normal',
                fontSize: 'clamp(26px, 3.4vw, 38px)',
                lineHeight: '1.05',
                letterSpacing: '-0.01em',
                color: 'text',
                position: 'relative',
                minWidth: '0',
                transition: 'color 0.18s ease',
                _after: {
                  content: '""',
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  bottom: '-4px',
                  height: '2px',
                  bg: 'accent',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.22s ease',
                },
              })}
            >
              {p.title}
            </span>
            <span
              className={css({
                textAlign: 'right',
                fontSize: '14px',
                color: 'textMuted',
                whiteSpace: 'nowrap',
              })}
            >
              <span className={css({ fontVariant: 'small-caps', letterSpacing: 'wide' })}>
                {p.type}
              </span>
              <span
                className={css({
                  fontVariantNumeric: 'tabular-nums',
                  color: 'textFaint',
                  marginLeft: '10px',
                })}
              >
                {p.year}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
