import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { projectHref } from './fields'

export function WorkIndex() {
  const items = [...selectedWork, ...experiments]
  return (
    <section
      id="index"
      aria-labelledby="idx"
      className={css({
        paddingTop: '7',
        paddingBottom: '56px',
        paddingInline: { base: '24px', sm: '6vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '4',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: '14px',
        })}
      >
        <h2
          id="idx"
          className={css({
            textStyle: 'xl',
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'lowercase',
            color: 'text',
          })}
        >
          index
        </h2>
        <span className={css({ fontSize: 'xs', color: 'textMuted', letterSpacing: 'wide' })}>
          selected work &amp; experiments
        </span>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          marginTop: '14px',
        })}
      >
        {items.map((p) => (
          <div
            key={p.slug}
            className={css({
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              borderRightWidth: '0',
              borderRightStyle: 'solid',
              borderRightColor: 'border',
              paddingBlock: { base: '22px', sm: '26px', lg: '30px' },
              paddingInline: { base: '2px', sm: '22px', lg: '26px' },
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
              transition: 'background 120ms ease',
              _hover: { bg: 'surface' },
              '&:nth-child(odd)': { borderRightWidth: { smToLg: '1px' } },
              '&:not(:nth-child(3n))': { borderRightWidth: { lg: '1px' } },
            })}
          >
            <a
              href={projectHref(p)}
              className={css({
                display: 'block',
                minHeight: '44px',
                paddingBlock: '1',
                textStyle: 'xl',
                fontFamily: 'display',
                fontWeight: 'normal',
                lineHeight: 'tight',
                textTransform: 'lowercase',
                color: 'text',
                _hover: { color: 'accent', textDecoration: 'none' },
              })}
            >
              {p.title}
            </a>
            <span
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'textMuted',
                fontWeight: 'bold',
              })}
            >
              {p.type} · {p.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
