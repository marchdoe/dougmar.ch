import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]

export function WorkIndex({ heading, items }: { heading: string; items: Proj[] }) {
  return (
    <section
      id="work"
      className={css({
        bg: 'bgAlt',
        paddingBlock: { base: '44px', lg: '60px' },
        paddingLeft: { base: '20px', lg: '48px' },
        paddingRight: { base: '20px', lg: '6vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'normal',
          textTransform: 'lowercase',
          fontSize: { base: '26px', lg: '42px' },
          lineHeight: 'tight',
          color: 'text',
          marginBottom: '28px',
        })}
      >
        {heading}
      </h2>
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        {items.map((p) => (
          <a
            key={p.slug}
            href={`/work/${p.slug}`}
            className={css({
              position: 'relative',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '4',
              paddingBlock: '4',
              minHeight: '44px',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'fieldBorder',
              _last: {
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'fieldBorder',
              },
              _after: {
                content: '""',
                position: 'absolute',
                left: '0',
                right: '0',
                bottom: '-1px',
                height: '2px',
                bg: 'accentAlt',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 160ms ease',
              },
              '&:hover::after': { transform: 'scaleX(1)' },
              '&:hover [data-row-title]': { color: 'accentAlt' },
            })}
          >
            <span
              data-row-title=""
              className={css({
                minWidth: '0',
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: { base: 'lede', lg: 'md' },
                color: 'text',
                transition: 'color 120ms ease',
              })}
            >
              {p.title}
            </span>
            <span
              className={css({
                display: 'flex',
                gap: '3',
                flexShrink: 0,
                fontFamily: 'body',
                fontSize: 'sm',
                color: 'textMuted',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              <span>{p.year}</span>
              <span
                className={css({
                  fontVariant: 'small-caps',
                  letterSpacing: 'wide',
                  color: 'textFaint',
                })}
              >
                {p.type}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
