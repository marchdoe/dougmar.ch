import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function WorkRows({
  label,
  items,
  external,
}: {
  label: string
  items: Project[]
  external: boolean
}) {
  return (
    <div className={css({ '& + &': { marginTop: '40px' } })}>
      <div
        className={css({
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: '0.11em',
          fontSize: '2xs',
          fontWeight: 'bold',
          color: 'textMuted',
          marginBottom: '4',
        })}
      >
        {label}
      </div>
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        {items.map((p) => (
          <a
            key={p.slug}
            href={external && p.externalUrl ? p.externalUrl : `/work/${p.slug}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) auto' },
              columnGap: '4',
              rowGap: '1',
              alignItems: 'baseline',
              paddingBlock: '14px',
              paddingInline: '2px',
              borderTop: '1px solid',
              borderTopColor: 'border',
              color: 'text',
              _last: { borderBottom: '1px solid', borderBottomColor: 'border' },
              _hover: { color: 'accent' },
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: { base: 'lg', md: 'xl' },
                lineHeight: '1.05',
                letterSpacing: '-0.005em',
                minWidth: '0',
              })}
            >
              {p.title}
            </span>
            <span
              className={css({
                display: 'flex',
                alignItems: 'baseline',
                gap: '14px',
                justifySelf: { base: 'start', md: 'end' },
                fontFamily: 'body',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              <span
                className={css({
                  fontSize: 'xs',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'textMuted',
                  fontWeight: 'bold',
                })}
              >
                {p.type}
              </span>
              <span className={css({ fontSize: 'sm', color: 'textMuted', fontWeight: 'normal' })}>
                {p.year}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
