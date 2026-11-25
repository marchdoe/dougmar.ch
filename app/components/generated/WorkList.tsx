import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

type Props = { heading: string; items: Project[]; divided?: boolean }

export function WorkList({ heading, items, divided }: Props) {
  return (
    <div
      className={css({
        minWidth: '0',
        borderRight: { base: 'none', lg: divided ? '1px solid' : 'none' },
        borderRightColor: 'border',
        paddingRight: { base: '0', lg: divided ? 'clamp(24px, 3vw, 40px)' : '0' },
      })}
    >
      <h3
        className={css({
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          fontWeight: 'bold',
          textStyle: 'xs',
          color: 'textMuted',
          paddingTop: '18px',
          paddingBottom: '4px',
          borderBottom: '1px solid',
          borderBottomColor: 'border',
        })}
      >
        {heading}
      </h3>
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {items.map((p) => (
          <li
            key={p.slug}
            className={css({ borderBottom: '1px solid', borderBottomColor: 'border' })}
          >
            <a
              href={`/work/${p.slug}`}
              className={css({
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                columnGap: '14px',
                minHeight: '48px',
                paddingBlock: '6px',
                color: 'text',
                _hover: { color: 'accent' },
              })}
            >
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  textStyle: 'lg',
                  minWidth: '0',
                })}
              >
                {p.title}
              </span>
              <span
                className={css({
                  fontFamily: 'body',
                  textStyle: '2xs',
                  letterSpacing: 'wide',
                  textTransform: 'uppercase',
                  color: 'textMuted',
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                  lineHeight: 'snug',
                })}
              >
                {p.type}
                <br />
                {p.year}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
