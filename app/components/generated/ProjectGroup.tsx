import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function ProjectGroup({
  label,
  items,
  preferExternal,
}: {
  label: string
  items: Project[]
  preferExternal?: boolean
}) {
  return (
    <div className={css({ marginBottom: 'clamp(32px, 4vw, 56px)' })}>
      <div
        className={css({
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          textStyle: 'xs',
          fontWeight: 'bold',
          color: 'textFaint',
          paddingBottom: '12px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'border',
          marginBottom: '1',
        })}
      >
        {label}
      </div>
      {items.map((p) => (
        <a
          key={p.slug}
          href={preferExternal && p.externalUrl ? p.externalUrl : `/work/${p.slug}`}
          className={`group ${css({
            display: 'grid',
            gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) auto' },
            alignItems: 'baseline',
            columnGap: '12px',
            rowGap: '6px',
            paddingBlock: '16px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
            minHeight: '44px',
            color: 'text',
            _hover: { color: 'text' },
          })}`}
        >
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: 'clamp(22px, 2.6vw, 34px)',
              lineHeight: '1.05',
              letterSpacing: '-0.005em',
              color: 'text',
              transition: 'color 160ms ease',
              _groupHover: { color: 'accent' },
            })}
          >
            {p.title}
          </span>
          <span
            className={css({
              display: 'flex',
              columnGap: '4',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              justifyContent: { base: 'flex-start', sm: 'flex-end' },
              fontFamily: 'body',
              textStyle: 'xs',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'textMuted',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            <span>{p.type}</span>
            <span>{p.year}</span>
          </span>
        </a>
      ))}
    </div>
  )
}
