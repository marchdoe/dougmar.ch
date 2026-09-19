import { css } from '../../../styled-system/css'

type Exp = { slug?: string; title: string; type: string; year: number; externalUrl?: string }

export function ExperimentsList({ items }: { items: Exp[] }) {
  return (
    <div className={css({ minWidth: 0 })}>
      <h4
        className={css({
          textStyle: 'sm',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          mb: '3',
        })}
      >
        Experiments
      </h4>
      <ul className={css({ listStyle: 'none', m: 0, p: 0, minWidth: 0 })}>
        {items.map((item) => {
          const href = item.externalUrl || (item.slug ? `/work/${item.slug}` : '#')
          return (
            <li
              key={item.title}
              className={css({ borderTop: '1px solid', borderColor: 'fieldBorder' })}
            >
              <a
                href={href}
                className={css({
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                  gap: '2',
                  py: '3',
                  color: 'fieldInk',
                  textDecoration: 'none',
                  minWidth: 0,
                })}
              >
                <span className={css({ minWidth: 0, overflowWrap: 'anywhere' })}>{item.title}</span>
                <span
                  className={css({
                    display: 'flex',
                    gap: '3',
                    textStyle: 'sm',
                    color: 'fieldInkMuted',
                    flexShrink: 0,
                  })}
                >
                  <span>{item.type}</span>
                  <span>{item.year}</span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
