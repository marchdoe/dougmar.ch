import { css } from '../../../styled-system/css'

type Row = { key: string; title: string; meta: string; href: string }

const row = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  columnGap: '3',
  rowGap: '1',
  minHeight: '52px',
  paddingBlock: '3',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  '&:hover > span:first-child': { color: 'accent' },
})

export function ProjectList({ heading, rows }: { heading: string; rows: Row[] }) {
  return (
    <div>
      <h3
        className={css({
          fontFamily: 'body',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'textFaint',
          marginBottom: '2',
        })}
      >
        {heading}
      </h3>
      {rows.map((r) => (
        <a key={r.key} href={r.href} className={row}>
          <span
            className={css({
              fontFamily: 'display',
              fontSize: { base: 'lg', lg: 'xl' },
              lineHeight: 'tight',
              color: 'text',
            })}
          >
            {r.title}
          </span>
          <span
            className={css({
              fontFamily: 'body',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              color: 'textFaint',
              whiteSpace: 'nowrap',
              textAlign: 'right',
            })}
          >
            {r.meta}
          </span>
        </a>
      ))}
    </div>
  )
}
