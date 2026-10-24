import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Item = (typeof projects)[number]

function hrefFor(p: Item): string {
  return p.depth === 'full' ? `/work/${p.slug}` : (p.externalUrl ?? `/work/${p.slug}`)
}

export function WorkList({ heading, items }: { heading: string; items: Item[] }) {
  return (
    <div>
      <h3
        className={css({
          textStyle: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'text',
          marginBottom: '1',
        })}
      >
        {heading}
      </h3>
      {items.map((p) => (
        <a
          key={p.slug}
          href={hrefFor(p)}
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            columnGap: '4',
            rowGap: '1',
            paddingBlock: '4',
            minHeight: '48px',
            borderTop: '1px solid',
            borderTopColor: 'borderStrong',
            _last: { borderBottom: '1px solid', borderBottomColor: 'borderStrong' },
          })}
        >
          <span
            className={css({
              fontFamily: 'display',
              textStyle: 'xl',
              lineHeight: '1',
              color: 'text',
            })}
          >
            {p.title}
          </span>
          {/* mockup sets this in umber 800; text keeps it over 4.5:1 on bgAlt */}
          <span
            className={css({
              textStyle: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'text',
              whiteSpace: 'nowrap',
            })}
          >
            {p.type} · {p.year}
          </span>
        </a>
      ))}
    </div>
  )
}
