import { css } from '../../../styled-system/css'

type Row = { key: string; title: string; type: string; year: number; href: string }

export function WorkRows({ heading, unit, rows }: { heading: string; unit: string; rows: Row[] }) {
  return (
    <div className={css({ minWidth: '0' })}>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '16px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '12px',
          marginBottom: '8px',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'all-small-caps',
            letterSpacing: '0.03em',
            fontSize: '2xl',
            color: 'text',
          })}
        >
          {heading}
        </h2>
        <span
          className={css({
            fontSize: 'sm',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'textMuted',
          })}
        >
          {String(rows.length).padStart(2, '0')} {unit}
        </span>
      </div>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          marginBottom: 'clamp(40px, 5vh, 64px)',
          padding: '0',
        })}
      >
        {rows.map((r) => (
          <li
            key={r.key}
            className={css({
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <a
              href={r.href}
              className={`group ${css({
                display: 'grid',
                gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) auto' },
                alignItems: 'baseline',
                rowGap: '6px',
                columnGap: '16px',
                paddingBlock: '16px',
                paddingInline: '2px',
                minHeight: '52px',
                _hover: { bg: 'bg' },
              })}`}
            >
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontVariant: 'all-small-caps',
                  letterSpacing: '0.02em',
                  fontSize: 'xl',
                  color: 'text',
                  lineHeight: '1.1',
                  minWidth: '0',
                  _groupHover: { color: 'accentAlt' },
                })}
              >
                {r.title}
              </span>
              <span
                className={css({
                  fontSize: 'sm',
                  color: 'textMuted',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  whiteSpace: { base: 'normal', sm: 'nowrap' },
                  minWidth: '0',
                })}
              >
                {r.type} ·{' '}
                <span className={css({ fontVariantNumeric: 'tabular-nums' })}>{r.year}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
