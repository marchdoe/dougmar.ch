import { css } from '../../../styled-system/css'
import type { Project } from '../../content/projects'

function hrefFor(p: Project): string {
  if (p.depth === 'full') return `/work/${p.slug}`
  return p.externalUrl ?? `/work/${p.slug}`
}

export function IndexGroup({
  label,
  items,
  offset,
}: {
  label: string
  items: Project[]
  offset: number
}) {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', minWidth: '0' })}>
      <div
        className={css({
          fontWeight: 'bold',
          fontSize: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          paddingTop: '4',
          paddingBottom: '12px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        {label}
      </div>
      {items.map((p, i) => (
        <a
          key={p.slug}
          href={hrefFor(p)}
          className={`group ${css({
            display: 'grid',
            gridTemplateColumns: { base: 'auto minmax(0, 1fr)', md: 'auto minmax(0, 1fr) auto' },
            alignItems: 'baseline',
            rowGap: '2',
            columnGap: '3',
            paddingBlock: '3',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'fieldBorder',
            minHeight: '44px',
            color: 'text',
          })}`}
        >
          <span
            className={css({
              fontFamily: 'display',
              fontSize: 'md',
              color: 'accentAlt',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {String(i + offset + 1).padStart(2, '0')}
          </span>
          <span
            className={css({
              fontFamily: 'display',
              textStyle: { base: 'lg', md: 'xl' },
              fontWeight: 'normal',
              lineHeight: 'tight',
              color: 'text',
              minWidth: '0',
              _groupHover: { color: 'accentAlt' },
            })}
          >
            {p.title}
          </span>
          <span
            className={css({
              gridColumn: { base: '2', md: 'auto' },
              display: 'flex',
              gap: '4',
              alignItems: 'baseline',
              fontSize: 'xs',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            <span className={css({ color: 'textMuted' })}>{p.type}</span>
            <span>{p.year}</span>
          </span>
        </a>
      ))}
    </div>
  )
}
