import { css } from '../../../styled-system/css'

type Row = { slug: string; title: string; type: string; year: number }

export function WorkList({ items }: { items: Row[] }) {
  return (
    <ul
      className={css({
        listStyle: 'none',
        m: 0,
        p: 0,
        minWidth: 0,
        '& > li:last-child': { borderBottom: '1px solid', borderColor: 'borderStrong' },
      })}
    >
      {items.map((item) => (
        <li
          key={item.slug}
          className={css({ borderTop: '1px solid', borderColor: 'borderStrong' })}
        >
          <a
            href={`/work/${item.slug}`}
            className={css({
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2',
              py: '4',
              textDecoration: 'none',
              minWidth: 0,
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                textStyle: 'xl',
                color: 'text',
                minWidth: 0,
                overflowWrap: 'anywhere',
              })}
            >
              {item.title}
            </span>
            <span
              className={css({
                display: 'flex',
                gap: '3',
                alignItems: 'baseline',
                flexShrink: 0,
              })}
            >
              <span
                className={css({
                  textStyle: 'sm',
                  color: 'textMuted',
                  textTransform: 'uppercase',
                  letterSpacing: 'wide',
                })}
              >
                {item.type}
              </span>
              <span className={css({ textStyle: 'sm', color: 'accent', fontWeight: 'bold' })}>
                {item.year}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
