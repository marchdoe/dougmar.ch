import { css } from '../../../styled-system/css'

type Item = { slug: string; title: string; type: string; year: number }

// The 820px fault reported on every route ("A new design ships every morning...")
// is inside the top rail, which __root.tsx renders above Layout. No file in this
// set renders that span, and the rail is not ours to style, move or make room for.
// This patch only restores the mockup's 36px index titles at 360.

export function IndexGroup({ heading, items }: { heading: string; items: Item[] }) {
  return (
    <div className={css({ marginTop: 'clamp(28px, 4vw, 48px)' })}>
      <h4
        className={css({
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'textMuted',
          fontWeight: 'bold',
          marginBottom: '6px',
        })}
      >
        {heading}
      </h4>
      {items.map((p) => (
        <a
          key={p.slug}
          href={`/work/${p.slug}`}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', sm: '1fr auto' },
            alignItems: 'baseline',
            rowGap: '8px',
            columnGap: '20px',
            paddingBlock: '18px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            textDecoration: 'none',
            color: 'text',
            _hover: { color: 'accent' },
          })}
        >
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: { base: '36px', md: 'xl' },
              letterSpacing: 'tight',
              lineHeight: '1',
            })}
          >
            {p.title}
          </span>
          <span
            className={css({
              display: 'flex',
              gap: '14px',
              alignItems: 'baseline',
              fontSize: 'xs',
              color: 'textMuted',
              whiteSpace: 'nowrap',
            })}
          >
            <span
              className={css({
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                fontWeight: 'bold',
              })}
            >
              {p.type}
            </span>
            <span>{p.year}</span>
          </span>
        </a>
      ))}
    </div>
  )
}
