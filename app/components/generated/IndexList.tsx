import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { SectionHead } from './SectionHead'

type Project = (typeof projects)[number]
type Props = { heading: string; items: Project[]; external?: boolean; spaced?: boolean }

export function IndexList({ heading, items, external, spaced }: Props) {
  return (
    <div>
      <SectionHead spaced={spaced}>{heading}</SectionHead>
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        {items.map((p) => (
          <a
            key={p.slug}
            href={external ? (p.externalUrl ?? `/work/${p.slug}`) : `/work/${p.slug}`}
            className={`group ${css({
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              rowGap: '2',
              columnGap: '5',
              paddingBlock: '5',
              minHeight: '44px',
              borderBottom: '1px solid',
              borderColor: 'border',
              transition: 'transform 0.2s ease',
              _hover: { transform: 'translateX(12px)' },
            })}`}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'normal',
                fontSize: { base: '30px', lg: '46px' },
                lineHeight: 'tight',
                color: 'text',
                transition: 'color 0.2s ease',
                '.group:hover &': { color: 'accent' },
              })}
            >
              {p.title}
            </span>
            <span
              className={css({
                display: 'flex',
                gap: '4',
                fontSize: 'sm',
                color: 'textFaint',
                letterSpacing: 'wide',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              })}
            >
              <span className={css({ textTransform: 'uppercase', letterSpacing: 'wider' })}>
                {p.type}
              </span>
              <span>{p.year}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
