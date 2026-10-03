import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'
import { SectionHeading } from './SectionHeading'

const work = projects.filter((p) => p.depth === 'full')

export function WorkListSection() {
  return (
    <section
      id="work"
      className={css({
        paddingTop: '80px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHeading label="off the card · into the work" title="selected work" />
      <div
        className={css({
          maxWidth: '720px',
          marginInline: 'auto',
          marginTop: '28px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        })}
      >
        {work.map((p) => (
          <a
            key={p.slug}
            href={`/work/${p.slug}`}
            className={`group ${css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', sm: '1fr auto' },
              alignItems: 'baseline',
              columnGap: '16px',
              rowGap: '4px',
              paddingBlock: '16px',
              paddingInline: '8px',
              minHeight: '56px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              transition: 'background 0.2s ease',
              _hover: { bg: 'surface', color: 'text' },
            })}`}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'normal',
                textStyle: 'lg',
                lineHeight: '1.1',
                textTransform: 'lowercase',
                letterSpacing: '-0.005em',
                color: 'text',
                minWidth: '0',
                _groupHover: { color: 'fieldBorder' },
              })}
            >
              {p.title}
            </span>
            <span
              className={css({
                fontSize: 'sm',
                color: 'textMuted',
                textTransform: 'lowercase',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              })}
            >
              {p.type}
              <span className={`tnum ${css({ color: 'textFaint', marginLeft: '8px' })}`}>
                {p.year}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
